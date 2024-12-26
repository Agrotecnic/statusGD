// src/services/StaticDataService.js
import { getDatabase } from 'firebase/database';

class StaticDataService {
  constructor() {
    this.db = getDatabase();
    this.produtos = [
      { id: 'AMINO-AD', nome: 'AMINO AD+', marca: 'AMINOAGRO', categoria: 'ADJUVANTES' },
      { id: 'AMINO-DEFESA-XTRA', nome: 'AMINO DEFESA XTRA', marca: 'AMINOAGRO', categoria: 'BIOZ' },
      { id: 'AMINO-FLOR', nome: 'AMINO FLOR', marca: 'AMINOAGRO', categoria: 'BIOZ' },
      { id: 'AMINO-FOLHA-TOP', nome: 'AMINO FOLHA TOP', marca: 'AMINOAGRO', categoria: 'ORGANICS' },
      { id: 'AMINO-MODULACAO', nome: 'AMINO MODULAÇÃO', marca: 'AMINOAGRO', categoria: 'ORGANICS' },
      { id: 'AMINO-MOL', nome: 'AMINO MOL', marca: 'AMINOAGRO', categoria: 'COND.SOLOS' },
      { id: 'AMINO-MOLTOP', nome: 'AMINO MOLTOP', marca: 'AMINOAGRO', categoria: 'COND.SOLOS' },
      { id: 'AMINO-PEGAMENTO', nome: 'AMINO PEGAMENTO', marca: 'AMINOAGRO', categoria: 'ORGANICS' },
      { id: 'AMINO-RAIZ', nome: 'AMINO RAIZ', marca: 'AMINOAGRO', categoria: 'TS' },
      { id: 'AMINO-RAIZ-PRO', nome: 'AMINO RAIZ PRO', marca: 'AMINOAGRO', categoria: 'TS' },
      { id: 'AMINO-RETENCAO', nome: 'AMINO RETENÇÃO INTENSE', marca: 'AMINOAGRO', categoria: 'ORGANICS' },
      { id: 'AMINO-VEGETACAO', nome: 'AMINO VEGETAÇÃO', marca: 'AMINOAGRO', categoria: 'BIOZ' },
      { id: 'AMINO-FRUTO-PLUS-NITRO', nome: 'AMINO FRUTO PLUS NITRO', marca: 'AMINOAGRO', categoria: 'PROG.USO' },
      { id: 'CICLO', nome: 'CICLO+', marca: 'AMINOAGRO', categoria: 'PROG.USO' },
      { id: 'DIMI-FORM-PLUS', nome: 'DIMI FORM PLUS', marca: 'DIMICRON', categoria: 'ORGANICS' },
      { id: 'DIMI-K400-FULL', nome: 'DIMI K-400 FULL', marca: 'DIMICRON', categoria: 'BIOZ' },
      { id: 'DIMI-TMSP-POWER', nome: 'DIMI TWSP POWER', marca: 'DIMICRON', categoria: 'TS' },
      { id: 'DIMI-TONICO', nome: 'DIMI TÔNICO FULL', marca: 'DIMICRON', categoria: 'ORGANICS' },
      { id: 'DIMILOM', nome: 'DIMILOM', marca: 'DIMICRON', categoria: 'COND.SOLOS' },
      { id: 'DIMI-A20', nome: 'DIMI A20+', marca: 'DIMICRON', categoria: 'ADJUVANTES' },
      { id: 'MAXI-EQUI-SOLO', nome: 'MAXI EQUI-SOLO', marca: 'DIMICRON', categoria: 'COND.SOLOS' },
      { id: 'MAXI-PROTEIN', nome: 'MAXI PROTEIN', marca: 'DIMICRON', categoria: 'BIOZ' },
      { id: 'MAXI-TURBO', nome: 'MAXI TURBO ORGAN PRO', marca: 'DIMICRON', categoria: 'ORGANICS' },
      { id: 'MAXI-ULTRA', nome: 'MAXI ULTRA', marca: 'DIMICRON', categoria: 'ORGANICS' },
      { id: 'NUTRIFULL', nome: 'NUTRIFULL', marca: 'DIMICRON', categoria: 'PROG.USO' },
      { id: 'PC360', nome: 'PC360', marca: 'DIMICRON', categoria: 'PROG.USO' }
    ];
    this.marcas = ['AMINOAGRO', 'DIMICRON'];
    this.categorias = [
      'ADJUVANTES',
      'BIOZ',
      'ORGANICS',
      'COND.SOLOS',
      'TS',
      'PROG.USO'
    ];
  }

  async getProdutos() {
    return Promise.resolve(this.produtos);
  }

  async getProdutoById(id) {
    const produto = this.produtos.find(p => p.id === id);
    return Promise.resolve(produto || null);
  }

  async getMarcas() {
    return Promise.resolve(this.marcas);
  }

  async getCategorias() {
    return Promise.resolve(this.categorias);
  }

  async getProdutosByMarca(marca) {
    const produtosFiltrados = this.produtos.filter(p => p.marca === marca);
    return Promise.resolve(produtosFiltrados);
  }

  async getProdutosByCategoria(categoria) {
    const produtosFiltrados = this.produtos.filter(p => p.categoria === categoria);
    return Promise.resolve(produtosFiltrados);
  }
}

// Exportar uma única instância
const staticDataService = new StaticDataService();
export default staticDataService;