import ExportService from '../../services/ExportService';
import { formatCurrency } from '../../utils/dashboardDataProcessors';

// Mock ExcelJS
jest.mock('exceljs', () => ({
  Workbook: jest.fn().mockImplementation(() => ({
    addWorksheet: jest.fn().mockReturnValue({
      addRow: jest.fn(),
      eachRow: jest.fn(),
      columns: [],
      getCell: jest.fn(),
      mergeCells: jest.fn(),
      getColumn: jest.fn().mockReturnValue({
        width: 12,
        numFmt: '',
        values: ['Test']
      })
    }),
    xlsx: {
      writeBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
    }
  }))
}));

// Mock jsPDF
jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    addImage: jest.fn(),
    save: jest.fn(),
    output: jest.fn().mockReturnValue(new Blob(['pdf content'])),
    internal: {
      pageSize: {
        getWidth: jest.fn().mockReturnValue(210),
        getHeight: jest.fn().mockReturnValue(297)
      }
    }
  }))
}));

describe('ExportService', () => {
  const mockData = {
    vendas: [
      { date: '2024-01-01', vendedor: 'João', valor: 1000 },
      { date: '2024-01-02', vendedor: 'Maria', valor: 2000 }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Excel Export', () => {
    test('deve exportar dados para Excel corretamente', async () => {
      const result = await ExportService.exportToExcel(mockData, 'default');
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    });

    test('deve aplicar template corretamente', async () => {
      const result = await ExportService.exportToExcel(mockData, 'regional');
      expect(result).toBeInstanceOf(Blob);
    });

    test('deve lidar com erros na exportação', async () => {
      jest.spyOn(ExportService, 'applyExcelStyling').mockImplementation(() => {
        throw new Error('Excel export failed');
      });

      await expect(ExportService.exportToExcel(mockData, 'default'))
        .rejects
        .toThrow('Falha ao gerar relatório Excel');
    });
  });

  describe('PDF Export', () => {
    test('deve exportar dados para PDF corretamente', async () => {
      const result = await ExportService.exportToPDF(mockData, 'default');
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('application/pdf');
    });

    test('deve aplicar template corretamente', async () => {
      const result = await ExportService.exportToPDF(mockData, 'performance');
      expect(result).toBeInstanceOf(Blob);
    });

    test('deve lidar com erros na exportação', async () => {
      jest.spyOn(ExportService, 'applyDefaultPDFTemplate').mockImplementation(() => {
        throw new Error('PDF export failed');
      });

      await expect(ExportService.exportToPDF(mockData, 'default'))
        .rejects
        .toThrow('Falha ao gerar relatório PDF');
    });
  });

  describe('Utilitários', () => {
    test('downloadFile deve criar e clicar em link temporário', () => {
      // Mock DOM APIs
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');
      
      global.URL.createObjectURL = jest.fn();
      global.URL.revokeObjectURL = jest.fn();

      const mockBlob = new Blob(['test content']);
      const mockFileName = 'test.pdf';

      ExportService.downloadFile(mockBlob, mockFileName);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});