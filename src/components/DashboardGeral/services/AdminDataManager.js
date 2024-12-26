import { getDatabase, ref, get, query, orderByChild, equalTo } from 'firebase/database';
import StaticDataService from '../../../services/StaticDataService';

class AdminDataManager {
  constructor() {
    this.db = getDatabase();
    this.staticDataService = StaticDataService;
  }

  async fetchProductPerformance(filters = {}) {
    try {
      const productsRef = ref(this.db, 'performance');
      let performanceQuery = query(productsRef);

      // Aplicar filtros se existirem
      if (filters.regional) {
        performanceQuery = query(
          productsRef,
          orderByChild('regional'),
          equalTo(filters.regional)
        );
      }

      const snapshot = await get(performanceQuery);
      
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        return this.processPerformanceData(rawData, filters);
      }

      return [];
    } catch (error) {
      console.error('Erro ao buscar desempenho de produtos:', error);
      throw error;
    }
  }

  processPerformanceData(rawData, filters = {}) {
    // Lógica para processar os dados de performance
    const processedData = Object.entries(rawData)
      .map(([key, item]) => ({
        id: key,
        ...item
      }))
      .filter(item => this.applyDataFilters(item, filters));

    return processedData;
  }

  applyDataFilters(item, filters = {}) {
    // Filtro por período
    if (filters.period) {
      if (!this.matchesPeriodFilter(item, filters.period)) {
        return false;
      }
    }

    // Filtro por intervalo de datas
    if (filters.startDate && filters.endDate) {
      const itemDate = new Date(item.date);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);

      if (itemDate < startDate || itemDate > endDate) {
        return false;
      }
    }

    // Filtro por regional (se ainda não foi filtrado na query)
    if (filters.regional && item.regional !== filters.regional) {
      return false;
    }

    return true;
  }

  matchesPeriodFilter(item, period) {
    const now = new Date();
    const itemDate = new Date(item.date);

    switch(period) {
      case 'ultimo_mes': {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return itemDate >= oneMonthAgo && itemDate <= now;
      }
      case 'ultimo_trimestre': {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        return itemDate >= threeMonthsAgo && itemDate <= now;
      }
      case 'ultimo_ano': {
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        return itemDate >= oneYearAgo && itemDate <= now;
      }
      default:
        return true;
    }
  }

  async calculateOverallMetrics(performanceData) {
    if (!performanceData || performanceData.length === 0) {
      return {
        totalRevenue: 0,
        averageMargin: 0,
        growthRate: 0
      };
    }

    const totalRevenue = performanceData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalProfit = performanceData.reduce((sum, item) => sum + (item.profit || 0), 0);

    return {
      totalRevenue,
      averageMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) : 0,
      growthRate: this.calculateGrowthRate(performanceData)
    };
  }

  calculateGrowthRate(performanceData) {
    // Lógica simplificada de cálculo de taxa de crescimento
    if (performanceData.length < 2) return 0;

    const sortedData = performanceData.sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    const firstPeriod = sortedData[0];
    const lastPeriod = sortedData[sortedData.length - 1];

    return (lastPeriod.revenue - firstPeriod.revenue) / firstPeriod.revenue;
  }

  async exportToPDF(data, type) {
    // Implementação de exportação para PDF
    console.log('Exportando dados para PDF:', { data, type });
    // Lógica real de geração de PDF
    return new Blob(['PDF Gerado'], { type: 'application/pdf' });
  }

  async exportToExcel(data, type) {
    // Implementação de exportação para Excel
    console.log('Exportando dados para Excel:', { data, type });
    // Lógica real de geração de Excel
    return new Blob(['Excel Gerado'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
}

export default new AdminDataManager();