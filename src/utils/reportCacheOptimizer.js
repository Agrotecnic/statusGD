import { dashboardCache, withReportCache } from './dataCache';
import ExportService from '../services/ExportService';
import { generateFileName } from './reportTemplates';

class ReportCacheOptimizer {
  constructor() {
    this.preloadQueue = new Set();
    this.isProcessingQueue = false;
  }

  // Agenda pré-carregamento de relatório
  schedulePreload(filters, reportType) {
    this.preloadQueue.add(JSON.stringify({ filters, reportType }));
    this.processQueue();
  }

  // Processa fila de pré-carregamento
  async processQueue() {
    if (this.isProcessingQueue || this.preloadQueue.size === 0) return;

    this.isProcessingQueue = true;
    try {
      for (const itemStr of this.preloadQueue) {
        const { filters, reportType } = JSON.parse(itemStr);
        
        // Gera tanto PDF quanto Excel em background
        await this.preloadReport(filters, reportType, 'pdf');
        await this.preloadReport(filters, reportType, 'xlsx');
        
        this.preloadQueue.delete(itemStr);
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  // Pré-carrega um relatório específico
  async preloadReport(filters, reportType, format) {
    try {
      const exportFunction = format === 'pdf' 
        ? () => ExportService.exportToPDF(dashboardCache.get(filters), reportType)
        : () => ExportService.exportToExcel(dashboardCache.get(filters), reportType);

      await withReportCache(exportFunction, filters, reportType, format);
    } catch (error) {
      console.error(`Erro no pré-carregamento do relatório ${reportType}:`, error);
    }
  }

  // Exporta relatório com otimização de cache
  async exportReport(filters, reportType, format) {
    try {
      const exportFunction = format === 'pdf' 
        ? () => ExportService.exportToPDF(dashboardCache.get(filters), reportType)
        : () => ExportService.exportToExcel(dashboardCache.get(filters), reportType);

      const blob = await withReportCache(exportFunction, filters, reportType, format);
      ExportService.downloadFile(blob, generateFileName(reportType, format));

      // Pré-carrega o outro formato após download
      const otherFormat = format === 'pdf' ? 'xlsx' : 'pdf';
      this.schedulePreload(filters, reportType, otherFormat);

      return true;
    } catch (error) {
      console.error('Erro na exportação do relatório:', error);
      throw error;
    }
  }

  // Limpa cache de relatórios antigos
  cleanup() {
    dashboardCache.cleanup();
  }
}

export const reportOptimizer = new ReportCacheOptimizer();