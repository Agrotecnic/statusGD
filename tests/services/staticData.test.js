const staticDataService = require('../../src/services/StaticDataService').default;

describe('StaticDataService', () => {
  describe('getProdutos', () => {
    it('deve retornar lista de produtos', async () => {
      const produtos = await staticDataService.getProdutos();
      expect(Array.isArray(produtos)).toBe(true);
      expect(produtos.length).toBeGreaterThan(0);
      expect(produtos[0]).toHaveProperty('id');
      expect(produtos[0]).toHaveProperty('nome');
    });
  });

  describe('getProdutosByMarca', () => {
    it('deve retornar produtos filtrados por marca', async () => {
      const produtos = await staticDataService.getProdutosByMarca('AMINOAGRO');
      expect(Array.isArray(produtos)).toBe(true);
      expect(produtos.every(p => p.marca === 'AMINOAGRO')).toBe(true);
    });
  });

  describe('getProdutosByCategoria', () => {
    it('deve retornar produtos filtrados por categoria', async () => {
      const produtos = await staticDataService.getProdutosByCategoria('BIOZ');
      expect(Array.isArray(produtos)).toBe(true);
      expect(produtos.every(p => p.categoria === 'BIOZ')).toBe(true);
    });
  });
});
