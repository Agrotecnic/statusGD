// Constantes para cálculos e formatação
const MONTHS_IN_QUARTER = 3;
const MIN_PERFORMANCE_THRESHOLD = 0.7; // 70% do objetivo
const TARGET_ACHIEVEMENT_THRESHOLD = 0.9; // 90% do objetivo

// Funções utilitárias
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const calculateGrowthRate = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Função para obter dados do período anterior
const getPreviousPeriodData = (data, period = 'ultimo_mes') => {
  const now = new Date();
  let periodStart, periodEnd;

  switch (period) {
    case 'ultimo_mes':
      periodEnd = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      periodStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      break;
    case 'ultimo_trimestre':
      periodEnd = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      periodStart = new Date(now.getFullYear(), now.getMonth() - 6, 1);
      break;
    default:
      periodEnd = new Date(now.getFullYear() - 1, 11, 31);
      periodStart = new Date(now.getFullYear() - 1, 0, 1);
  }

  return data.filter(item => {
    const itemDate = new Date(item.lastUpdate);
    return itemDate >= periodStart && itemDate <= periodEnd;
  });
};

// Função para calcular métricas de tendência
const calculateTrendMetrics = (monthlyData) => {
  if (!monthlyData.length) return [];

  return monthlyData.map((month, index) => {
    const previousMonth = monthlyData[index - 1];
    return {
      ...month,
      vendasGrowth: previousMonth 
        ? calculateGrowthRate(month.vendas, previousMonth.vendas)
        : 0,
      areasGrowth: previousMonth
        ? calculateGrowthRate(month.areas, previousMonth.areas)
        : 0,
      tendencia: previousMonth
        ? month.vendas > previousMonth.vendas ? 'up' : 'down'
        : 'stable'
    };
  });
};

// Função para calcular projeções
const calculateProjections = (trendData) => {
  if (trendData.length < 3) return null;

  const lastThreeMonths = trendData.slice(-3);
  const avgGrowth = lastThreeMonths.reduce((sum, month) => 
    sum + (month.vendasGrowth || 0), 0) / 3;

  const lastMonth = trendData[trendData.length - 1];
  const projectedVendas = lastMonth.vendas * (1 + (avgGrowth / 100));
  const projectedAreas = lastMonth.areas * (1 + (avgGrowth / 100));

  return {
    nextMonth: {
      vendas: projectedVendas,
      areas: projectedAreas,
      confidence: calculateConfidenceScore(avgGrowth, lastThreeMonths)
    }
  };
};

// Função para calcular score de confiança
const calculateConfidenceScore = (avgGrowth, lastThreeMonths) => {
  const growthVariance = lastThreeMonths.reduce((variance, month) => {
    const diff = (month.vendasGrowth || 0) - avgGrowth;
    return variance + (diff * diff);
  }, 0) / 3;

  // Quanto menor a variância, maior a confiança
  const confidenceScore = Math.max(0, 100 - (growthVariance * 2));
  return Math.min(100, confidenceScore);
};

// Função principal de processamento de dados
const processRawData = (rawData, filters) => {
  const { regional, period, startDate, endDate } = filters;
  
  // Extrai dados dos usuários
  const usersData = Object.values(rawData).filter(user => user.role !== 'admin');
  
  // Processa dados por período
  const filteredData = filterDataByPeriod(usersData, period, startDate, endDate);
  
  // Filtra por regional se especificado
  const regionalFilteredData = regional 
    ? filteredData.filter(user => user.vendedorInfo?.regional === regional)
    : filteredData;

  // Calcula todos os dados necessários
  const kpis = calculateKPIs(regionalFilteredData);
  const regionais = processRegionalData(filteredData);
  const trends = calculateTrends(filteredData, period);
  const performance = calculatePerformance(filteredData);
  const predictions = calculatePredictions(trends);
  const alerts = generateAlerts(kpis, trends, performance);

  return {
    kpis,
    regionais,
    trends,
    performance,
    predictions,
    alerts
  };
};

// Função para filtrar dados por período
const filterDataByPeriod = (data, period, startDate, endDate) => {
  const now = new Date();
  let periodStart = new Date();

  switch (period) {
    case 'ultimo_mes':
      periodStart.setMonth(now.getMonth() - 1);
      break;
    case 'ultimo_trimestre':
      periodStart.setMonth(now.getMonth() - MONTHS_IN_QUARTER);
      break;
    case 'ultimo_ano':
      periodStart.setFullYear(now.getFullYear() - 1);
      break;
    case 'custom':
      return data.filter(user => {
        const updateDate = new Date(user.lastUpdate);
        return updateDate >= new Date(startDate) && updateDate <= new Date(endDate);
      });
    default:
      return data;
  }

  return data.filter(user => {
    const updateDate = new Date(user.lastUpdate);
    return updateDate >= periodStart;
  });
};

// Cálculo de KPIs
const calculateKPIs = (data) => {
  const previousPeriodData = getPreviousPeriodData(data);
  
  const totalVendas = calculateTotalSales(data);
  const previousTotalVendas = calculateTotalSales(previousPeriodData);
  const vendasGrowth = calculateGrowthRate(totalVendas, previousTotalVendas);

  const totalAreas = calculateTotalAreas(data);
  const previousTotalAreas = calculateTotalAreas(previousPeriodData);
  const areasGrowth = calculateGrowthRate(totalAreas, previousTotalAreas);

  const areasPotenciais = calculatePotentialAreas(data);
  const vendedoresAtivos = data.length;
  const mediaVendasPorArea = totalAreas > 0 ? totalVendas / totalAreas : 0;
  const ticketMedio = totalVendas / vendedoresAtivos;

  return {
    totalVendas,
    totalAreas,
    areasPotenciais,
    vendedoresAtivos,
    mediaVendasPorArea,
    ticketMedio,
    performance: {
      vendasGrowth,
      areasGrowth
    }
  };
};

// Funções auxiliares para KPIs
const calculateTotalSales = (data) => {
  return data.reduce((sum, user) => {
    const produtosTotal = user.produtos?.reduce((acc, produto) => 
      acc + (produto.valorVendido || 0) + (produto.valorBonificado || 0), 0);
    return sum + (produtosTotal || 0);
  }, 0);
};

const calculateTotalAreas = (data) => {
  return data.reduce((sum, user) => {
    const areasTotal = (user.areas?.emAcompanhamento || 0) + 
                      (user.areas?.aImplantar || 0) + 
                      (user.areas?.finalizados || 0);
    return sum + areasTotal;
  }, 0);
};

const calculatePotentialAreas = (data) => {
  return data.reduce((sum, user) => sum + (user.areas?.areaPotencialTotal || 0), 0);
};

// Processamento de dados regionais
const processRegionalData = (data) => {
  const regionaisMap = new Map();

  data.forEach(user => {
    const regional = user.vendedorInfo?.regional;
    if (!regional) return;

    const currentData = regionaisMap.get(regional) || {
      regional,
      vendas: 0,
      areas: 0,
      vendedores: new Set(),
      clientes: new Set(),
      produtos: new Set()
    };

    // Processa vendas e produtos
    user.produtos?.forEach(produto => {
      currentData.vendas += (produto.valorVendido || 0) + (produto.valorBonificado || 0);
      if (produto.cliente) currentData.clientes.add(produto.cliente);
      if (produto.nome) currentData.produtos.add(produto.nome);
    });

    // Processa áreas
    currentData.areas += calculateTotalAreas([user]);
    currentData.vendedores.add(user.vendedorInfo?.nome);

    regionaisMap.set(regional, currentData);
  });

  return Array.from(regionaisMap.values())
    .map(regional => ({
      ...regional,
      vendedores: regional.vendedores.size,
      clientes: regional.clientes.size,
      produtos: regional.produtos.size,
      mediaVendasPorVendedor: regional.vendas / regional.vendedores.size,
      mediaAreasPorVendedor: regional.areas / regional.vendedores.size
    }))
    .sort((a, b) => b.vendas - a.vendas);
};

// Cálculo de tendências
const calculateTrends = (data, period) => {
  const monthlyData = aggregateMonthlyData(data);
  const trendData = calculateTrendMetrics(monthlyData);
  
  return {
    monthly: trendData,
    projections: calculateProjections(trendData, period)
  };
};

const aggregateMonthlyData = (data) => {
  const monthlyMap = new Map();

  data.forEach(user => {
    const updateDate = new Date(user.lastUpdate);
    const monthKey = `${updateDate.getFullYear()}-${String(updateDate.getMonth() + 1).padStart(2, '0')}`;

    const currentMonth = monthlyMap.get(monthKey) || {
      month: monthKey,
      vendas: 0,
      areas: 0,
      areasPotenciais: 0,
      vendedores: new Set(),
      clientes: new Set()
    };

    // Agrega dados do usuário
    user.produtos?.forEach(produto => {
      currentMonth.vendas += (produto.valorVendido || 0) + (produto.valorBonificado || 0);
      if (produto.cliente) currentMonth.clientes.add(produto.cliente);
    });

    currentMonth.areas += calculateTotalAreas([user]);
    currentMonth.areasPotenciais += (user.areas?.areaPotencialTotal || 0);
    if (user.vendedorInfo?.nome) currentMonth.vendedores.add(user.vendedorInfo.nome);

    monthlyMap.set(monthKey, currentMonth);
  });

  return Array.from(monthlyMap.values())
    .map(month => ({
      ...month,
      vendedores: month.vendedores.size,
      clientes: month.clientes.size
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

// Cálculo de performance
const calculatePerformance = (data) => {
  const vendedoresPerformance = data.map(user => {
    const vendas = calculateTotalSales([user]);
    const areas = calculateTotalAreas([user]);
    const potencial = user.areas?.areaPotencialTotal || 0;
    const performance = potencial > 0 ? (vendas / potencial) * 100 : 0;

    return {
      vendedor: user.vendedorInfo?.nome,
      regional: user.vendedorInfo?.regional,
      vendas,
      areas,
      potencial,
      performance,
      status: getPerformanceStatus(performance),
      tendencia: calculatePerformanceTrend(user)
    };
  });

  return vendedoresPerformance.sort((a, b) => b.performance - a.performance);
};

const getPerformanceStatus = (performance) => {
  if (performance >= TARGET_ACHIEVEMENT_THRESHOLD * 100) return 'otimo';
  if (performance >= MIN_PERFORMANCE_THRESHOLD * 100) return 'bom';
  return 'precisa_melhorar';
};

const calculatePerformanceTrend = () => {
    // Por padrão, retorna estável
    return 'estavel';
  };

// Cálculo de previsões
const calculatePredictions = (trends) => {
  const monthlyData = trends.monthly;
  if (monthlyData.length < 3) return null;

  // Implementar análise de tendências e previsões
  return {
    nextMonth: {
      vendas: 0,
      areas: 0,
      confidence: 0
    }
  };
};

// Geração de alertas
const generateAlerts = (kpis, trends, performance) => {
  const alerts = [];

  // Alerta de queda nas vendas
  if (kpis.performance.vendasGrowth < -10) {
    alerts.push({
      type: 'warning',
      message: `Queda de ${Math.abs(kpis.performance.vendasGrowth.toFixed(1))}% nas vendas`,
      metric: 'vendas'
    });
  }

  // Alerta de performance abaixo do esperado
  const lowPerformers = performance.filter(p => p.status === 'precisa_melhorar');
  if (lowPerformers.length > 0) {
    alerts.push({
      type: 'alert',
      message: `${lowPerformers.length} vendedores com performance abaixo do esperado`,
      metric: 'performance'
    });
  }

  return alerts;
};

// Exportação das funções
export {
    processRawData,
    filterDataByPeriod,
    calculateKPIs,
    processRegionalData,
    calculateTrends,
    calculatePerformance,
    calculatePredictions,
    generateAlerts,
    formatCurrency
  };