import LoggerService from './LoggerService';
import StateManager from './StateManager';

class DataValidationService {
  constructor() {
    this.schemas = new Map();
    this.validationResults = new Map();
  }

  registerSchema(name, schema) {
    this.schemas.set(name, {
      fields: schema.fields,
      required: schema.required || [],
      types: schema.types || {},
      validators: schema.validators || {}
    });
  }

  validate(schemaName, data) {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      throw new Error(`Schema não encontrado: ${schemaName}`);
    }

    const results = {
      valid: true,
      errors: [],
      warnings: []
    };

    // Validação de campos obrigatórios
    schema.required.forEach(field => {
      if (data[field] === undefined || data[field] === null) {
        results.valid = false;
        results.errors.push({
          field,
          type: 'required',
          message: `Campo obrigatório: ${field}`
        });
      }
    });

    // Validação de tipos
    Object.entries(schema.types).forEach(([field, type]) => {
      if (data[field] !== undefined) {
        const validType = this.validateType(data[field], type);
        if (!validType) {
          results.valid = false;
          results.errors.push({
            field,
            type: 'type',
            message: `Tipo inválido para ${field}: esperado ${type}`
          });
        }
      }
    });

    // Validações customizadas
    Object.entries(schema.validators).forEach(([field, validator]) => {
      if (data[field] !== undefined) {
        try {
          const validationResult = validator(data[field], data);
          if (validationResult !== true) {
            results.valid = false;
            results.errors.push({
              field,
              type: 'custom',
              message: validationResult
            });
          }
        } catch (error) {
          LoggerService.log('error', 'Validation error', { field, error });
          results.errors.push({
            field,
            type: 'error',
            message: 'Erro na validação'
          });
        }
      }
    });

    this.validationResults.set(schemaName, results);
    this.updateState(schemaName, results);
    return results;
  }

  validateType(value, type) {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'date':
        return value instanceof Date && !isNaN(value);
      default:
        return true;
    }
  }

  updateState(schemaName, results) {
    StateManager.setState({
      validation: {
        ...StateManager.getState().validation,
        [schemaName]: results
      }
    });
  }

  getValidationResults(schemaName) {
    return this.validationResults.get(schemaName);
  }

  clearValidationResults() {
    this.validationResults.clear();
    StateManager.setState({
      validation: {}
    });
  }
}

export default new DataValidationService();