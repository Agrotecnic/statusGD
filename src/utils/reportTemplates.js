import { formatCurrency } from './dashboardDataProcessors';

export const ExcelTemplates = {
  // Template para Análise Regional
  regionalTemplate: {
    setup: (worksheet) => {
      worksheet.addRow(['Análise Regional']);
      worksheet.addRow([]);
      worksheet.addRow(['Regional', 'Total Vendas', 'Total Áreas', 'Vendedores', 'Performance Média']);
    },
    formatData: (data) => data.map(item => ([
      item.regional,
      formatCurrency(item.totalVendas),
      item.totalAreas,
      item.totalVendedores,
      `${item.performanceMedia.toFixed(2)}%`
    ])),
    styling: (worksheet) => {
      // Mescla células para o título
      worksheet.mergeCells('A1:E1');
      const titleCell = worksheet.getCell('A1');
      titleCell.font = { size: 16, bold: true };
      titleCell.alignment = { horizontal: 'center' };

      // Estiliza cabeçalhos
      const headerRow = worksheet.getRow(3);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }
      };
      headerRow.alignment = { horizontal: 'center' };
    }
  },

  // Template para Análise de Performance
  performanceTemplate: {
    setup: (worksheet) => {
      worksheet.addRow(['Relatório de Performance']);
      worksheet.addRow([]);
      worksheet.addRow(['Vendedor', 'Regional', 'Vendas', 'Meta', 'Atingimento', 'Status']);
    },
    formatData: (data) => data.map(item => ([
      item.vendedor,
      item.regional,
      formatCurrency(item.vendas),
      formatCurrency(item.meta),
      `${item.atingimento.toFixed(2)}%`,
      item.status
    ])),
    styling: (worksheet) => {
      // Estilização similar ao template regional
      worksheet.mergeCells('A1:F1');
      const titleCell = worksheet.getCell('A1');
      titleCell.font = { size: 16, bold: true };
      titleCell.alignment = { horizontal: 'center' };

      // Estiliza cabeçalhos
      const headerRow = worksheet.getRow(3);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }
      };
    }
  }
};

export const PDFTemplates = {
  // Template para Análise Regional
  regionalTemplate: {
    config: {
      header: ['Regional', 'Total Vendas', 'Total Áreas', 'Vendedores', 'Performance Média'],
      title: 'Análise Regional',
      styles: {
        header: { fillColor: [79, 129, 189], textColor: 255, fontSize: 12, fontStyle: 'bold' },
        cells: { fontSize: 10 }
      }
    },
    formatData: (data) => data.map(item => ([
      item.regional,
      formatCurrency(item.totalVendas),
      item.totalAreas.toString(),
      item.totalVendedores.toString(),
      `${item.performanceMedia.toFixed(2)}%`
    ]))
  },

  // Template para Análise de Performance
  performanceTemplate: {
    config: {
      header: ['Vendedor', 'Regional', 'Vendas', 'Meta', 'Atingimento', 'Status'],
      title: 'Relatório de Performance',
      styles: {
        header: { fillColor: [79, 129, 189], textColor: 255, fontSize: 12, fontStyle: 'bold' },
        cells: { fontSize: 10 }
      }
    },
    formatData: (data) => data.map(item => ([
      item.vendedor,
      item.regional,
      formatCurrency(item.vendas),
      formatCurrency(item.meta),
      `${item.atingimento.toFixed(2)}%`,
      item.status
    ]))
  }
};

// Função auxiliar para gerar nome de arquivo
export const generateFileName = (templateName, format) => {
  const date = new Date().toISOString().split('T')[0];
  return `relatorio_${templateName}_${date}.${format}`;
};