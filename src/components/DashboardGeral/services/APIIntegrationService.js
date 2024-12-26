import StateManager from './StateManager';
import LoggerService from './LoggerService';
import DataValidationService from './DataValidationService';

class APIIntegrationService {
  constructor() {
    this.endpoints = new Map();
    this.requestQueue = [];
    this.rateLimits = new Map();
    this.retryConfig = {
      maxRetries: 3,
      delays: [1000, 3000, 5000]
    };
  }

  registerEndpoint(name, config) {
    this.endpoints.set(name, {
      url: config.url,
      method: config.method || 'GET',
      headers: config.headers || {},
      rateLimit: config.rateLimit,
      schema: config.schema,
      transform: config.transform
    });
    
    if (config.rateLimit) {
      this.rateLimits.set(name, {
        limit: config.rateLimit,
        remaining: config.rateLimit,
        resetTime: Date.now()
      });
    }
  }

  async request(endpointName, params = {}) {
    const endpoint = this.endpoints.get(endpointName);
    if (!endpoint) throw new Error(`Endpoint não registrado: ${endpointName}`);

    if (!this.checkRateLimit(endpointName)) {
      throw new Error(`Rate limit excedido para ${endpointName}`);
    }

    try {
      const response = await this.executeRequest(endpoint, params);
      const data = await response.json();

      if (endpoint.schema) {
        const validation = DataValidationService.validate(endpoint.schema, data);
        if (!validation.valid) {
          throw new Error('Dados inválidos recebidos da API');
        }
      }

      const transformedData = endpoint.transform ? 
        endpoint.transform(data) : data;

      StateManager.setState({
        api: {
          [endpointName]: {
            data: transformedData,
            lastUpdate: new Date(),
            status: 'success'
          }
        }
      });

      return transformedData;

    } catch (error) {
      LoggerService.log('error', 'API request failed', {
        endpoint: endpointName,
        error
      });
      
      throw error;
    }
  }

  async executeRequest(endpoint, params, attempt = 0) {
    try {
      const response = await fetch(this.buildUrl(endpoint.url, params), {
        method: endpoint.method,
        headers: endpoint.headers
      });

      if (!response.ok) {
        if (attempt < this.retryConfig.maxRetries) {
          await this.delay(this.retryConfig.delays[attempt]);
          return this.executeRequest(endpoint, params, attempt + 1);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;

    } catch (error) {
      if (attempt < this.retryConfig.maxRetries) {
        await this.delay(this.retryConfig.delays[attempt]);
        return this.executeRequest(endpoint, params, attempt + 1);
      }
      throw error;
    }
  }

   buildUrl(url, params) {
    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, value);
    });
    return urlObj.toString();
  }

   checkRateLimit(endpointName) {
    const rateLimit = this.rateLimits.get(endpointName);
    if (!rateLimit) return true;

    if (Date.now() > rateLimit.resetTime) {
      rateLimit.remaining = rateLimit.limit;
      rateLimit.resetTime = Date.now() + 60000; // Reset a cada minuto
    }

    if (rateLimit.remaining > 0) {
      rateLimit.remaining--;
      return true;
    }

    return false;
  }

   delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new APIIntegrationService();