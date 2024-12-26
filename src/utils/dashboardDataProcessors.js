import _ from 'lodash';
import { format, parseISO, isWithinInterval, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdminDataManager from '../services/AdminDataManager';

/**
 * Processa dados brutos de vendas e calcula métricas principais
 * @param {Array} rawData - Dados brutos de vendas
 * @param {Object} filters - Filtros aplicados (BU, regional, produto, etc)
 * @returns {Object} Objeto com métricas processadas
 */
export const processVendasData = async (rawData, filters) => {
  try {
    if (!Array.isArray(rawData)) {
      console.error('rawData deve ser um array');
      return null;
    }

    const filteredData = filterDataByCriteria(rawData, filters);
    const adminManager = AdminDataManager;
    
    const [regionalData, performanceData] = await Promise.all([
      adminManager.fetchRegionalData(filters),
      adminManager.fetchPerformanceData(filters)
    ]);

    return {
      totalVendas: calculateTotalVendas(filteredData),
      vendasPorRegional: await aggregateByRegional(filteredData, regionalData),
      crescimentoMensal: calculateCrescimentoMensal(filteredData),
      distribuicaoProdutos: calculateDistribuicaoProdutos(filteredData, performanceData),
      metricasBonificacao: calculateMetricasBonificacao(filteredData)
    };
  } catch (error) {
    console.error('Erro ao processar dados de vendas:', error);
    throw error;
  }
};

/**
 * Obtém a data inicial baseada no período selecionado
 * @param {number} periodo - Período em meses
 * @returns {Date} Data inicial do período
 */
const getStartDateForPeriod = (periodo) => {
  if (!periodo) return null;
  return startOfMonth(subMonths(new Date(), periodo));
};

/**
 * Filtra dados baseado em critérios específicos
 */
const filterDataByCriteria = (data, { bu, regional, produto, periodo }) => {
  try {
    const startDate = getStartDateForPeriod(periodo);
    
    return data.filter(item => {
      const matchesBU = !bu || item.bu === bu;
      const matchesRegional = !regional || item.regional === regional;
      const matchesProduto = !produto || item.produto === produto;
      const matchesPeriodo = !startDate || isWithinInterval(
        parseISO(item.data),
        { start: startDate, end: endOfMonth(new Date()) }
      );

      return matchesBU && matchesRegional && matchesProduto && matchesPeriodo;
    });
  } catch (error) {
    console.error('Erro ao filtrar dados:', error);
    return [];
  }
};

/**
 * Calcula total de vendas com diferentes métricas
 */
const calculateTotalVendas = (data) => {
  try {
    return {
      valorTotal: _.sumBy(data, 'valor') || 0,
      quantidadeTotal: _.sumBy(data, 'quantidade') || 0,
      ticketMedio: data.length ? (_.sumBy(data, 'valor') || 0) / data.length : 0,
      numeroTransacoes: data.length
    };
  } catch (error) {
    console.error('Erro ao calcular total de vendas:', error);
    return {
      valorTotal: 0,
      quantidadeTotal: 0,
      ticketMedio: 0,
      numeroTransacoes: 0
    };
  }
};

/**
 * Calcula o crescimento regional
 */
const calculateRegionalGrowth = (currentData, previousData) => {
  try {
    const currentTotal = _.sumBy(currentData, 'valor') || 0;
    const previousTotal = _.sumBy(previousData, 'valor') || 0;
    return previousTotal ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
  } catch (error) {
    console.error('Erro ao calcular crescimento regional:', error);
    return 0;
  }
};

/**
 * Calcula realização de meta regional
 */
const calculateRegionalGoalRealization = (data, meta) => {
  try {
    const total = _.sumBy(data, 'valor') || 0;
    return meta ? (total / meta) * 100 : 0;
  } catch (error) {
    console.error('Erro ao calcular realização de meta regional:', error);
    return 0;
  }
};

/**
 * Calcula taxa de crescimento
 */
const calculateGrowthRate = (currentValue, previousValue) => {
  try {
    return previousValue ? ((currentValue - previousValue) / previousValue) * 100 : 0;
  } catch (error) {
    console.error('Erro ao calcular taxa de crescimento:', error);
    return 0;
  }
};

/**
 * Calcula realização da meta
 */
const calculateGoalRealization = (actual, goal) => {
  try {
    return goal ? (actual / goal) * 100 : 0;
  } catch (error) {
    console.error('Erro ao calcular realização da meta:', error);
    return 0;
  }
};

/**
 * Calcula previsão baseada em tendência histórica
 */
const calculateForecast = (historicalData) => {
  try {
    if (!historicalData || historicalData.length < 2) return null;
    
    const sortedData = _.orderBy(historicalData, 'data');
    const growth = calculateGrowthRate(
      _.last(sortedData).valor,
      sortedData[sortedData.length - 2].valor
    );
    
    return _.last(sortedData).valor * (1 + growth / 100);
  } catch (error) {
    console.error('Erro ao calcular previsão:', error);
    return null;
  }
};

/**
 * Calcula confiança da previsão
 */
const calculateForecastConfidence = (historicalData) => {
  try {
    if (!historicalData || historicalData.length < 3) return 0;
    
    const variations = [];
    for (let i = 1; i < historicalData.length; i++) {
      variations.push(Math.abs(
        calculateGrowthRate(historicalData[i].valor, historicalData[i-1].valor)
      ));
    }
    
    const avgVariation = _.mean(variations);
    return Math.max(0, 100 - avgVariation);
  } catch (error) {
    console.error('Erro ao calcular confiança da previsão:', error);
    return 0;
  }
};

/**
 * Calcula tendência de crescimento
 */
const calculateGrowthTrend = (historicalData) => {
  try {
    if (!historicalData || historicalData.length < 3) return 'ESTÁVEL';
    
    const recentGrowth = calculateGrowthRate(
      _.last(historicalData).valor,
      historicalData[historicalData.length - 2].valor
    );
    
    if (recentGrowth > 5) return 'CRESCENTE';
    if (recentGrowth < -5) return 'DECRESCENTE';
    return 'ESTÁVEL';
  } catch (error) {
    console.error('Erro ao calcular tendência de crescimento:', error);
    return 'ESTÁVEL';
  }
};

/**
 * Agrega dados por regional com análise completa
 */
const aggregateByRegional = async (data, regionalDataFromDB) => {
  try {
    const grouped = _.groupBy(data, 'regional');
    
    return _.mapValues(grouped, (regionalItems, regionalKey) => {
      const thisYear = filterCurrentYear(regionalItems);
      const lastYear = filterLastYear(regionalItems);
      const regionalInfo = regionalDataFromDB.find(r => r.regional === regionalKey) || {};
      
      return {
        total: _.sumBy(regionalItems, 'valor') || 0,
        crescimentoYoY: calculateGrowthRate(
          _.sumBy(thisYear, 'valor'),
          _.sumBy(lastYear, 'valor')
        ),
        participacao: calculateParticipacao(regionalItems, data),
        crescimentoRegional: calculateRegionalGrowth(thisYear, lastYear),
        realizacaoMeta: calculateRegionalGoalRealization(thisYear, regionalInfo.meta || 0),
        previsao: calculateForecast(regionalItems),
        confiancaPrevisao: calculateForecastConfidence(regionalItems),
        tendenciaCrescimento: calculateGrowthTrend(regionalItems),
        performance: regionalInfo.performance || 0,
        metaAtual: regionalInfo.meta || 0
      };
    });
  } catch (error) {
    console.error('Erro ao agregar dados por regional:', error);
    return {};
  }
};

/**
 * Calcula crescimento mensal com tendências
 */
const calculateCrescimentoMensal = (data) => {
  try {
    const monthlyData = _.groupBy(data, item => 
      format(parseISO(item.data), 'yyyy-MM', { locale: ptBR })
    );
    
    const sortedMonths = Object.keys(monthlyData).sort();
    const processedData = {};
    
    sortedMonths.forEach((currentMonth, index) => {
      const currentData = monthlyData[currentMonth];
      const previousMonth = index > 0 ? monthlyData[sortedMonths[index - 1]] : null;
      
      processedData[currentMonth] = {
        valor: _.sumBy(currentData, 'valor') || 0,
        quantidade: _.sumBy(currentData, 'quantidade') || 0,
        crescimento: previousMonth 
          ? calculateGrowthRate(
              _.sumBy(currentData, 'valor'),
              _.sumBy(previousMonth, 'valor')
            )
          : 0,
        tendencia: calculateGrowthTrend(currentData)
      };
    });
    
    return processedData;
  } catch (error) {
    console.error('Erro ao calcular crescimento mensal:', error);
    return {};
  }
};

/**
 * Calcula distribuição de produtos com análise completa
 */
const calculateDistribuicaoProdutos = (data, performanceData) => {
  try {
    const produtosAgrupados = _.groupBy(data, 'produto');
    
    return _.mapValues(produtosAgrupados, (produtoData, produtoId) => {
      const performance = performanceData.find(p => p.id === produtoId) || {};
      
      return {
        quantidade: _.sumBy(produtoData, 'quantidade') || 0,
        valor: _.sumBy(produtoData, 'valor') || 0,
        margem: calculateMargem(produtoData),
        participacaoVendas: calculateParticipacao(produtoData, data),
        realizacaoMeta: calculateGoalRealization(
          _.sumBy(produtoData, 'valor'),
          performance.meta
        ),
        tendencia: calculateGrowthTrend(produtoData),
        previsao: calculateForecast(produtoData),
        bonificacao: _.sumBy(produtoData.filter(item => item.isBonificacao), 'valor') || 0
      };
    });
  } catch (error) {
    console.error('Erro ao calcular distribuição de produtos:', error);
    return {};
  }
};

/**
 * Calcula métricas detalhadas de bonificação
 */
const calculateMetricasBonificacao = (data) => {
  try {
    const bonificacoes = data.filter(item => item.isBonificacao);
    const totalVendas = _.sumBy(data, 'valor') || 0;
    const totalBonificado = _.sumBy(bonificacoes, 'valor') || 0;
    
    return {
      totalBonificado,
      percentualSobreVendas: totalVendas ? (totalBonificado / totalVendas) * 100 : 0,
      distribuicaoPorProduto: calculateBonificacaoPorProduto(data),
      distribuicaoPorRegional: calculateBonificacaoPorRegional(data)
    };
  } catch (error) {
    console.error('Erro ao calcular métricas de bonificação:', error);
    return {
      totalBonificado: 0,
      percentualSobreVendas: 0,
      distribuicaoPorProduto: {},
      distribuicaoPorRegional: {}
    };
  }
};

const calculateBonificacaoPorProduto = (data) => {
  try {
    const produtosAgrupados = _.groupBy(data, 'produto');
    
    return _.mapValues(produtosAgrupados, produtoData => {
      const bonificacoes = produtoData.filter(item => item.isBonificacao);
      const vendas = produtoData.filter(item => !item.isBonificacao);
      
      return {
        totalBonificado: _.sumBy(bonificacoes, 'valor') || 0,
        totalVendido: _.sumBy(vendas, 'valor') || 0,
        percentualBonificacao: calculatePercentualBonificacao(bonificacoes, vendas),
        tendencia: calculateGrowthTrend(bonificacoes)
      };
    });
  } catch (error) {
    console.error('Erro ao calcular bonificação por produto:', error);
    return {};
  }
};

const calculateBonificacaoPorRegional = (data) => {
  try {
    const regionaisAgrupadas = _.groupBy(data, 'regional');
    
    return _.mapValues(regionaisAgrupadas, regionalData => {
      const bonificacoes = regionalData.filter(item => item.isBonificacao);
      const vendas = regionalData.filter(item => !item.isBonificacao);
      
      return {
        totalBonificado: _.sumBy(bonificacoes, 'valor') || 0,
        totalVendido: _.sumBy(vendas, 'valor') || 0,
        percentualBonificacao: calculatePercentualBonificacao(bonificacoes, vendas),
        tendencia: calculateGrowthTrend(bonificacoes)
      };
    });
  } catch (error) {
    console.error('Erro ao calcular bonificação por regional:', error);
    return {};
  }
};

// Funções auxiliares
const filterCurrentYear = (data) => {
  try {
    return data.filter(item => parseISO(item.data).getFullYear() === new Date().getFullYear());
  }
  catch (error) {
    console.error('Erro ao filtrar dados do ano atual:', error);
    return [];
  }
};

const filterLastYear = (data) => {
  try {
    return data.filter(item => parseISO(item.data).getFullYear() === new Date().getFullYear() - 1);
  } catch (error) {
    console.error('Erro ao filtrar dados do ano anterior:', error);
    return [];
  }
};

const calculateParticipacao = (partialData, totalData) => {
  try {
    const partialSum = _.sumBy(partialData, 'valor') || 0;
    const totalSum = _.sumBy(totalData, 'valor') || 0;
    return totalSum ? (partialSum / totalSum) * 100 : 0;
  } catch (error) {
    console.error('Erro ao calcular participação:', error);
    return 0;
  }
};

const calculateMargem = (produtoData) => {
  try {
    const receita = _.sumBy(produtoData, 'valor') || 0;
    const custo = _.sumBy(produtoData, 'custo') || 0;
    return receita ? ((receita - custo) / receita) * 100 : 0;
  } catch (error) {
    console.error('Erro ao calcular margem:', error);
    return 0;
  }
};

const calculatePercentualBonificacao = (bonificacoes, vendas) => {
  try {
    const totalBonificado = _.sumBy(bonificacoes, 'valor') || 0;
    const totalVendido = _.sumBy(vendas, 'valor') || 0;
    return totalVendido ? (totalBonificado / totalVendido) * 100 : 0;
  } catch (error) {
    console.error('Erro ao calcular percentual de bonificação:', error);
    return 0;
  }
};

/**
 * Formata valor para moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado em BRL
 */
export const formatCurrency = (value) => {
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  } catch (error) {
    console.error('Erro ao formatar moeda:', error);
    return 'R$ 0,00';
  }
};

/**
 * Formata valor para percentual
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado em percentual
 */
export const formatPercentage = (value) => {
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format((value || 0) / 100);
  } catch (error) {
    console.error('Erro ao formatar percentual:', error);
    return '0,0%';
  }
};