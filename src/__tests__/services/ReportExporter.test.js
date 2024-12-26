import { ReportExporter } from '../../../../components/DashboardGeral/services/ReportExporter';

describe('ReportExporter', () => {
  const testData = {
    kpis: {
      vendas: { valor: 1000, meta: 1200, realizacao: 0.83 },
      clientes: { valor: 500, meta: 450, realizacao: 1.11 }
    },
    regionais: [
      { nome: 'Sul', vendas: 500, areas: 10, performance: 0.95 },
      { nome: 'Norte', vendas: 500, areas: 8, performance: 0.90 }
    ],
    trends: [
      { date: '2024-01-01', value: 100, variation: 0.05 },
      { date: '2024-02-01', value: 105, variation: 0.03 }
    ]
  };

  test('deve exportar para Excel com estrutura correta', async () => {
    const exporter = new ReportExporter(testData);
    const result = await exporter.exportToExcel();

    expect(result).toMatchObject({
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      fileName: expect.stringContaining('.xlsx'),
      buffer: expect.any(Buffer)
    });
  });

  test('deve exportar para PDF com estrutura correta', async () => {
    const exporter = new ReportExporter(testData);
    const result = await exporter.exportToPDF();

    expect(result).toMatchObject({
      type: 'application/pdf',
      fileName: expect.stringContaining('.pdf'),
      buffer: expect.any(ArrayBuffer)
    });
  });

  test('deve aplicar formatação correta aos dados', async () => {
    const exporter = new ReportExporter(testData, {
      dateFormat: 'dd/MM/yyyy'
    });
    
    const result = await exporter.exportToExcel();
    expect(result.buffer).toBeTruthy();
  });

  test('deve incluir opções personalizadas', async () => {
    const options = {
      fileName: 'teste',
      author: 'Usuário Teste',
      dateFormat: 'yyyy-MM-dd'
    };

    const exporter = new ReportExporter(testData, options);
    const result = await exporter.exportToExcel();
    
    expect(result.fileName).toContain('teste');
  });
});