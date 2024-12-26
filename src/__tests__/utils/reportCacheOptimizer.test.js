import { reportOptimizer } from '../../utils/reportCacheOptimizer';
import { dashboardCache } from '../../utils/dataCache';
import ExportService from '../../services/ExportService';

// Mock dependencies
jest.mock('../../utils/dataCache');
jest.mock('../../services/ExportService');

describe('ReportCacheOptimizer', () => {
  const mockFilters = {
    regional: 'sul',
    period: 'ultimo_mes'
  };

  const mockData = {
    kpis: {},
    regionais: [],
    trends: {},
    performance: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
    dashboardCache.get.mockReturnValue(mockData);
    ExportService.exportToPDF.mockResolvedValue(new Blob(['pdf']));
    ExportService.exportToExcel.mockResolvedValue(new Blob(['xlsx']));
    ExportService.downloadFile.mockImplementation(() => {});
  });

  describe('Exportação de Relatórios', () => {
    test('deve exportar PDF com cache', async () => {
      await reportOptimizer.exportReport(mockFilters, 'performance', 'pdf');
      
      expect(ExportService.exportToPDF).toHaveBeenCalled();
      expect(ExportService.downloadFile).toHaveBeenCalled();
    });

    test('deve exportar Excel com cache', async () => {
      await reportOptimizer.exportReport(mockFilters, 'performance', 'xlsx');
      
      expect(ExportService.exportToExcel).toHaveBeenCalled();
      expect(ExportService.downloadFile).toHaveBeenCalled();
    });

    test('deve lidar com erros na exportação', async () => {
      ExportService.exportToPDF.mockRejectedValue(new Error('Export failed'));

      await expect(
        reportOptimizer.exportReport(mockFilters, 'performance', 'pdf')
      ).rejects.toThrow('Export failed');
    });
  });

  describe('Pré-carregamento', () => {
    test('deve agendar pré-carregamento corretamente', async () => {
      reportOptimizer.schedulePreload(mockFilters, 'performance');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(ExportService.exportToPDF).toHaveBeenCalled();
      expect(ExportService.exportToExcel).toHaveBeenCalled();
    });

    test('não deve duplicar pré-carregamentos', async () => {
      reportOptimizer.schedulePreload(mockFilters, 'performance');
      reportOptimizer.schedulePreload(mockFilters, 'performance');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(ExportService.exportToPDF).toHaveBeenCalledTimes(1);
      expect(ExportService.exportToExcel).toHaveBeenCalledTimes(1);
    });

    test('deve limpar fila após processamento', async () => {
      reportOptimizer.schedulePreload(mockFilters, 'performance');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(reportOptimizer.preloadQueue.size).toBe(0);
    });
  });

  describe('Limpeza de Cache', () => {
    test('deve chamar cleanup do dashboardCache', () => {
      reportOptimizer.cleanup();
      expect(dashboardCache.cleanup).toHaveBeenCalled();
    });
  });
});