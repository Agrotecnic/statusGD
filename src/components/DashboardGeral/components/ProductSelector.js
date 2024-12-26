// src/components/DashboardGeral/components/ProductSelector.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import StaticDataService from '../../../services/StaticDataService';

const ProductSelector = ({ 
  selectedProduct, 
  onProductSelect, 
  selectedMarca, 
  onMarcaSelect,
  selectedCategoria,
  onCategoriaSelect
}) => {
  const [produtos, setProdutos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        setLoading(true);
        const [produtosData, marcasData, categoriasData] = await Promise.all([
          StaticDataService.getProdutos(),
          StaticDataService.getMarcas(),
          StaticDataService.getCategorias()
        ]);

        setProdutos(produtosData || []);
        setMarcas(marcasData || []);
        setCategorias(categoriasData || []);
      } catch (error) {
        console.error('Erro ao carregar dados estáticos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStaticData();
  }, []);

  const filteredProdutos = produtos.filter(produto => {
    const matchMarca = !selectedMarca || produto.marca === selectedMarca;
    const matchCategoria = !selectedCategoria || produto.categoria === selectedCategoria;
    return matchMarca && matchCategoria;
  });

  if (loading) {
    return <div className="text-center">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <select
            value={selectedMarca || ''}
            onChange={(e) => onMarcaSelect(e.target.value || null)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todas as Marcas</option>
            {marcas.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            value={selectedCategoria || ''}
            onChange={(e) => onCategoriaSelect(e.target.value || null)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todas as Categorias</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Produto
          </label>
          <select
            value={selectedProduct || ''}
            onChange={(e) => onProductSelect(e.target.value || null)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Selecione um Produto</option>
            {filteredProdutos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

ProductSelector.propTypes = {
  selectedProduct: PropTypes.string,
  onProductSelect: PropTypes.func.isRequired,
  selectedMarca: PropTypes.string,
  onMarcaSelect: PropTypes.func.isRequired,
  selectedCategoria: PropTypes.string,
  onCategoriaSelect: PropTypes.func.isRequired
};

export default ProductSelector;