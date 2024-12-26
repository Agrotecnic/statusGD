import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '../utils/dashboardDataProcessors';

class ExportService {
  constructor() {
    this.workbook = new ExcelJS.Workbook();
    this.pdf = new jsPDF();
  }

  // Excel Export Methods
  async exportToExcel(data, templateName = 'default') {
    try {
      const worksheet = this.workbook.addWorksheet(templateName);
      
      // Aplica template
      const template = this.getExcelTemplate(templateName);
      template.applyToWorksheet(worksheet, data);

      // Configurações gerais
      worksheet.properties.defaultRowHeight = 25;
      this.applyExcelStyling(worksheet);

      // Gera o arquivo
      const buffer = await this.workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      return blob;
    } catch (error) {
      console.error('Erro na exportação Excel:', error);
      throw new Error('Falha ao gerar relatório Excel');
    }
  }

  applyExcelStyling(worksheet) {
    // Estilização padrão
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.font = { name: 'Arial', size: 11 };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      });
    });

    // Estilização do cabeçalho
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.height = 30;
  }

  getExcelTemplate(templateName) {
    // Retorna o template apropriado baseado no nome
    const templates = {
      default: {
        applyToWorksheet: (worksheet, data) => {
          // Template padrão
          this.applyDefaultExcelTemplate(worksheet, data);
        }
      },
      regional: {
        applyToWorksheet: (worksheet, data) => {
          // Template específico para análise regional
          this.applyRegionalExcelTemplate(worksheet, data);
        }
      },
      performance: {
        applyToWorksheet: (worksheet, data) => {
          // Template para relatório de performance
          this.applyPerformanceExcelTemplate(worksheet, data);
        }
      }
    };

    return templates[templateName] || templates.default;
  }

  // PDF Export Methods
  async exportToPDF(data, templateName = 'default') {
    try {
      const template = this.getPDFTemplate(templateName);
      template.applyToPDF(this.pdf, data);

      return this.pdf.output('blob');
    } catch (error) {
      console.error('Erro na exportação PDF:', error);
      throw new Error('Falha ao gerar relatório PDF');
    }
  }

  getPDFTemplate(templateName) {
    const templates = {
      default: {
        applyToPDF: (pdf, data) => {
          this.applyDefaultPDFTemplate(pdf, data);
        }
      },
      regional: {
        applyToPDF: (pdf, data) => {
          this.applyRegionalPDFTemplate(pdf, data);
        }
      },
      performance: {
        applyToPDF: (pdf, data) => {
          this.applyPerformancePDFTemplate(pdf, data);
        }
      }
    };

    return templates[templateName] || templates.default;
  }

  // Template Implementation Methods
  applyDefaultExcelTemplate(worksheet, data) {
    // Headers
    worksheet.addRow(['Data', 'Regional', 'Vendedor', 'Vendas', 'Áreas', 'Performance']);

    // Data rows
    data.forEach(item => {
      worksheet.addRow([
        item.date,
        item.regional,
        item.vendedor,
        formatCurrency(item.vendas),
        item.areas,
        `${item.performance}%`
      ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = Math.max(
        15,
        ...worksheet.getColumn(column.number).values.map(v => String(v).length)
      );
    });
  }

  applyDefaultPDFTemplate(pdf, data) {
    pdf.setFontSize(16);
    pdf.text('Relatório de Performance', 14, 15);

    pdf.autoTable({
      head: [['Data', 'Regional', 'Vendedor', 'Vendas', 'Áreas', 'Performance']],
      body: data.map(item => [
        item.date,
        item.regional,
        item.vendedor,
        formatCurrency(item.vendas),
        item.areas,
        `${item.performance}%`
      ]),
      startY: 25,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });
  }

  // Utilitários para manipulação de arquivos
  downloadFile(blob, fileName) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default new ExportService();