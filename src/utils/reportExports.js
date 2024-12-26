import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export class ReportExporter {
  constructor(data, options = {}) {
    this.data = data;
    this.options = {
      fileName: options.fileName || 'relatorio',
      author: options.author || 'Sistema GD',
      dateFormat: options.dateFormat || 'dd/MM/yyyy',
      ...options
    };
  }

  // Exportação para Excel
  async exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = this.options.author;
    workbook.created = new Date();

    // Adiciona planilhas específicas
    await this.addPerformanceSheet(workbook);
    await this.addRegionalSheet(workbook);
    await this.addTrendsSheet(workbook);

    // Gera o buffer do arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${this.options.fileName}_${format(new Date(), 'yyyyMMdd')}.xlsx`;

    return {
      buffer,
      fileName,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
  }

  // Adiciona planilha de performance
  async addPerformanceSheet(workbook) {
    const sheet = workbook.addWorksheet('Performance');
    
    // Configuração de colunas
    sheet.columns = [
      { header: 'Métrica', key: 'metric', width: 20 },
      { header: 'Valor', key: 'value', width: 15 },
      { header: 'Meta', key: 'target', width: 15 },
      { header: 'Realização', key: 'achievement', width: 15 }
    ];

    // Formatação do cabeçalho
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Adiciona dados
    if (this.data.kpis) {
      Object.entries(this.data.kpis).forEach(([metric, value]) => {
        sheet.addRow({
          metric,
          value: typeof value === 'number' ? value : value.valor,
          target: value.meta || '',
          achievement: value.realizacao ? `${(value.realizacao * 100).toFixed(2)}%` : ''
        });
      });
    }

    // Formatação condicional
    this.applyConditionalFormatting(sheet);
  }

  // Adiciona planilha regional
  async addRegionalSheet(workbook) {
    const sheet = workbook.addWorksheet('Análise Regional');

    sheet.columns = [
      { header: 'Regional', key: 'regional', width: 20 },
      { header: 'Vendas', key: 'vendas', width: 15 },
      { header: 'Áreas', key: 'areas', width: 15 },
      { header: 'Performance', key: 'performance', width: 15 }
    ];

    sheet.getRow(1).font = { bold: true };

    if (this.data.regionais) {
      this.data.regionais.forEach(regional => {
        sheet.addRow({
          regional: regional.nome,
          vendas: regional.vendas,
          areas: regional.areas,
          performance: `${(regional.performance * 100).toFixed(2)}%`
        });
      });
    }

    this.formatCurrencyColumns(sheet, ['vendas']);
  }

  // Adiciona planilha de tendências
  async addTrendsSheet(workbook) {
    const sheet = workbook.addWorksheet('Tendências');

    sheet.columns = [
      { header: 'Período', key: 'period', width: 15 },
      { header: 'Valor', key: 'value', width: 15 },
      { header: 'Variação', key: 'variation', width: 15 }
    ];

    sheet.getRow(1).font = { bold: true };

    if (this.data.trends) {
      this.data.trends.forEach(trend => {
        sheet.addRow({
          period: format(new Date(trend.date), this.options.dateFormat, { locale: ptBR }),
          value: trend.value,
          variation: trend.variation ? `${(trend.variation * 100).toFixed(2)}%` : ''
        });
      });
    }

    this.formatCurrencyColumns(sheet, ['value']);
  }

  // Exportação para PDF
  async exportToPDF() {
    const doc = new jsPDF();
    
    // Configurações iniciais
    doc.setProperties({
      title: this.options.fileName,
      author: this.options.author,
      creator: 'Sistema GD'
    });

    // Adiciona cabeçalho
    this.addPDFHeader(doc);

    // Adiciona seções
    let yPosition = 40;
    yPosition = this.addPerformanceSection(doc, yPosition);
    yPosition = this.addRegionalSection(doc, yPosition);
    this.addTrendsSection(doc, yPosition);

    // Gera o arquivo
    const fileName = `${this.options.fileName}_${format(new Date(), 'yyyyMMdd')}.pdf`;
    return {
      buffer: doc.output('arraybuffer'),
      fileName,
      type: 'application/pdf'
    };
  }

  // Helpers para formatação
  formatCurrencyColumns(sheet, columns) {
    columns.forEach(col => {
      sheet.getColumn(col).numFmt = '"R$ "#,##0.00';
    });
  }

  applyConditionalFormatting(sheet) {
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const achievementCell = row.getCell('achievement');
        const value = parseFloat(achievementCell.value);
        if (!isNaN(value)) {
          if (value < 80) {
            achievementCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF0000' }
            };
          } else if (value < 90) {
            achievementCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFFFF00' }
            };
          } else {
            achievementCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF00FF00' }
            };
          }
        }
      }
    });
  }
}

// Funções de exportação
export const exportToExcel = async (data, options = {}) => {
  const exporter = new ReportExporter(data, options);
  return exporter.exportToExcel();
};

export const exportToPDF = async (data, options = {}) => {
  const exporter = new ReportExporter(data, options);
  return exporter.exportToPDF();
};

export default {
  ReportExporter,
  exportToExcel,
  exportToPDF
};