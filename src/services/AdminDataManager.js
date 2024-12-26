import { getDatabase, ref, get, query, orderByChild, equalTo, startAt, endAt } from 'firebase/database';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import StaticDataService from './StaticDataService';

class AdminDataManager {
  constructor() {
    this.db = getDatabase();
    this.staticDataService = StaticDataService;
  }

  /**
   * Calcula métricas gerais com base nos filtros aplicados
   * @param {Object} filters - Filtros a serem aplicados
   * @returns {Promise<Object>} Métricas calculadas
   */
  async calculateOverallMetrics(filters = {}) {
    try {
      const produtos = await this.staticDataService.getProdutos();
      const filteredProdutos = this.applyFilters(produtos, filters);
      
      const totalRevenue = filteredProdutos.reduce((sum, produto) => 
        sum + (produto.valorTotal || 0), 0);
      
      const totalProfit = filteredProdutos.reduce((sum, produto) => 
        sum + (produto.lucro || 0), 0);

      const periodData = await this.getPeriodData(filters);

      return {
        totalRevenue,
        totalProfit,
        growthRate: this.calculateGrowthRate(periodData),
        profitGrowthRate: this.calculateProfitGrowthRate(periodData),
        periodComparison: await this.calculatePeriodComparison(filters)
      };
    } catch (error) {
      console.error('Erro ao calcular métricas:', error);
      throw error;
    }
  }

  /**
   * Aplica filtros aos produtos
   * @param {Array} produtos - Lista de produtos
   * @param {Object} filters - Filtros a serem aplicados
   * @returns {Array} Produtos filtrados
   */
  applyFilters(produtos, filters) {
    return produtos.filter(produto => {
      const matchesRegional = !filters.selectedRegional || 
        produto.regional === filters.selectedRegional;
      
      const matchesProduct = !filters.selectedProduct || 
        produto.id === filters.selectedProduct;
      
      const matchesPeriod = !filters.period || 
        this.isWithinPeriod(produto.data, filters.period);

      const matchesBU = !filters.bu || 
        produto.bu === filters.bu;

      return matchesRegional && matchesProduct && matchesPeriod && matchesBU;
    });
  }

  /**
   * Verifica se uma data está dentro do período especificado
   * @param {string} date - Data a ser verificada
   * @param {number} period - Período em meses
   * @returns {boolean}
   */
  isWithinPeriod(date, period) {
    const targetDate = parseISO(date);
    const startDate = startOfMonth(subMonths(new Date(), period));
    const endDate = endOfMonth(new Date());
    
    return targetDate >= startDate && targetDate <= endDate;
  }

  /**
   * Obtém dados do período especificado
   * @param {Object} filters - Filtros incluindo período
   * @returns {Promise<Array>} Dados do período
   */
  async getPeriodData(filters) {
    const trendsRef = ref(this.db, 'trends');
    let trendsQuery = query(trendsRef);

    if (filters.period) {
      const startDate = format(
        startOfMonth(subMonths(new Date(), filters.period)), 
        'yyyy-MM-dd'
      );
      const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

      trendsQuery = query(
        trendsRef,
        orderByChild('date'),
        startAt(startDate),
        endAt(endDate)
      );
    }

    const snapshot = await get(trendsQuery);
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  }

  /**
   * Calcula taxa de crescimento
   * @param {Array} data - Dados para cálculo
   * @returns {number} Taxa de crescimento
   */
  calculateGrowthRate(data) {
    if (data.length < 2) return 0;
    
    const sortedData = data.sort((a, b) => 
      new Date(a.data) - new Date(b.data));
    
    const firstPeriod = sortedData[0];
    const lastPeriod = sortedData[sortedData.length - 1];

    return ((lastPeriod.valorTotal - firstPeriod.valorTotal) / 
            firstPeriod.valorTotal) * 100;
  }

  /**
   * Calcula taxa de crescimento do lucro
   * @param {Array} data - Dados para cálculo
   * @returns {number} Taxa de crescimento do lucro
   */
  calculateProfitGrowthRate(data) {
    if (data.length < 2) return 0;
    
    const sortedData = data.sort((a, b) => 
      new Date(a.data) - new Date(b.data));
    
    const firstPeriod = sortedData[0];
    const lastPeriod = sortedData[sortedData.length - 1];

    return ((lastPeriod.lucro - firstPeriod.lucro) / 
            firstPeriod.lucro) * 100;
  }

  /**
   * Busca dados regionais com filtros aplicados
   * @param {Object} filters - Filtros a serem aplicados
   * @returns {Promise<Array>} Dados regionais
   */
  async fetchRegionalData(filters = {}) {
    try {
      const performanceRef = ref(this.db, 'performance');
      let performanceQuery = query(performanceRef);

      if (filters.selectedRegional) {
        performanceQuery = query(
          performanceRef, 
          orderByChild('regional'), 
          equalTo(filters.selectedRegional)
        );
      }

      const snapshot = await get(performanceQuery);
      
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const processedData = Object.values(rawData).map(item => ({
          regional: item.regional,
          total: item.total || 0,
          performance: item.performance || 0,
          meta: item.meta || 0,
          realizado: item.realizado || 0,
          crescimento: item.crescimento || 0
        }));

        // Aplica filtros adicionais se necessário
        return this.applyAdditionalFilters(processedData, filters);
      }

      return [];
    } catch (error) {
      console.error('Erro ao buscar dados regionais:', error);
      throw error;
    }
  }

  /**
   * Aplica filtros adicionais aos dados regionais
   * @param {Array} data - Dados a serem filtrados
   * @param {Object} filters - Filtros adicionais
   * @returns {Array} Dados filtrados
   */
  applyAdditionalFilters(data, filters) {
    if (!filters.bu) return data;

    return data.filter(item => {
      const regionalBU = this.getRegionalBU(item.regional);
      return regionalBU === filters.bu;
    });
  }

  /**
   * Busca dados de tendências
   * @param {Object} filters - Filtros a serem aplicados
   * @returns {Promise<Array>} Dados de tendências
   */
  async fetchTrendData(filters = {}) {
    try {
      const trendsRef = ref(this.db, 'trends');
      let trendsQuery = query(trendsRef);

      if (filters.period) {
        const startDate = format(
          startOfMonth(subMonths(new Date(), filters.period)), 
          'yyyy-MM-dd'
        );
        const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

        trendsQuery = query(
          trendsRef,
          orderByChild('date'),
          startAt(startDate),
          endAt(endDate)
        );
      }

      const snapshot = await get(trendsQuery);
      
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        return Object.values(rawData).map(item => ({
          date: item.date,
          value: item.value || 0,
          forecast: item.forecast || null,
          confidence: item.confidence || null
        }));
      }

      return [];
    } catch (error) {
      console.error('Erro ao buscar dados de tendência:', error);
      throw error;
    }
  }

  /**
   * Busca dados de performance dos produtos
   * @param {Object} filters - Filtros a serem aplicados
   * @returns {Promise<Array>} Dados de performance
   */
  async fetchPerformanceData(filters = {}) {
    try {
      const produtosRef = ref(this.db, 'produtos');
      let performanceQuery = query(produtosRef);

      if (filters.selectedProduct) {
        performanceQuery = query(
          produtosRef, 
          orderByChild('id'), 
          equalTo(filters.selectedProduct)
        );
      }

      const snapshot = await get(performanceQuery);
      
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        return Object.values(rawData).map(item => ({
          id: item.id,
          nome: item.nome,
          vendido: item.vendido || 0,
          bonificado: item.bonificado || 0,
          meta: item.meta || 0,
          margem: item.margem || 0,
          crescimento: item.crescimento || 0
        }));
      }

      return [];
    } catch (error) {
      console.error('Erro ao buscar dados de performance:', error);
      throw error;
    }
  }

  /**
   * Calcula comparação entre períodos
   * @param {Object} filters - Filtros para comparação
   * @returns {Promise<Object>} Dados comparativos
   */
  async calculatePeriodComparison(filters) {
    const currentPeriodData = await this.getPeriodData(filters);
    const previousPeriodData = await this.getPeriodData({
      ...filters,
      period: (filters.period || 1) * 2
    });

    return {
      currentPeriod: this.summarizePeriodData(currentPeriodData),
      previousPeriod: this.summarizePeriodData(previousPeriodData),
      growth: this.calculateGrowthBetweenPeriods(
        currentPeriodData,
        previousPeriodData
      )
    };
  }

  /**
   * Sumariza dados de um período
   * @param {Array} data - Dados do período
   * @returns {Object} Resumo do período
   */
  summarizePeriodData(data) {
    return {
      total: data.reduce((sum, item) => sum + (item.value || 0), 0),
      average: data.length ? 
        data.reduce((sum, item) => sum + (item.value || 0), 0) / data.length : 0,
      count: data.length
    };
  }

  /**
   * Calcula crescimento entre períodos
   * @param {Array} currentPeriod - Dados do período atual
   * @param {Array} previousPeriod - Dados do período anterior
   * @returns {Object} Dados de crescimento
   */
  calculateGrowthBetweenPeriods(currentPeriod, previousPeriod) {
    const currentTotal = this.summarizePeriodData(currentPeriod).total;
    const previousTotal = this.summarizePeriodData(previousPeriod).total;

    return {
      absolute: currentTotal - previousTotal,
      percentage: previousTotal ? 
        ((currentTotal - previousTotal) / previousTotal) * 100 : 0
    };
  }

  /**
   * Obtém a BU de uma regional
   * @param {string} regional - Nome da regional
   * @returns {string} Nome da BU
   */
  getRegionalBU(regional) {
    const businessUnits = {
      'BU1': ['RS NORTE', 'RS SUL', 'PR SUL SC', 'PR NORTE SP EXP'],
      'BU2': ['AC RO MT OESTE', 'MS', 'MT', 'MT SUL', 'GO'],
      'BU3': ['MA PI TO PA', 'CERRADO MG', 'REGIONAL LESTE', 'REGIONAL NORDEST']
    };

    for (const [bu, regionais] of Object.entries(businessUnits)) {
      if (regionais.includes(regional)) return bu;
    }
    return null;
  }
}

export default new AdminDataManager();