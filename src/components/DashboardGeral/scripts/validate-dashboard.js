import IntegrationTester from '../services/IntegrationTester';
import LoggerService from '../services/LoggerService';

async function validateDashboard() {
  try {
    const result = await IntegrationTester.testIntegration();
    
    if (!result.success) {
      LoggerService.log('error', 'Falha na validação do dashboard', result.error);
      console.error('\x1b[31m%s\x1b[0m', `❌ Falha na validação: ${result.error}`);
      return false;
    }

    // Verifica cache
    const cacheStatus = await IntegrationTester.verifyCache();
    if (!cacheStatus.success) {
      LoggerService.log('warning', 'Cache incompleto', { missing: cacheStatus.missingCache });
      console.warn('\x1b[33m%s\x1b[0m', `⚠️ Cache incompleto: ${cacheStatus.missingCache.join(', ')}`);
    }

    // Inicia monitoramento
    const monitor = IntegrationTester.monitorRealtime();
    monitor.start();

    console.log('\x1b[32m%s\x1b[0m', '✅ Dashboard validado com sucesso');
    return true;

  } catch (error) {
    LoggerService.log('error', 'Erro na validação', error);
    console.error('\x1b[31m%s\x1b[0m', `❌ Erro crítico: ${error.message}`);
    return false;
  }
}

export default validateDashboard;