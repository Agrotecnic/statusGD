// src/components/SelectProduto/SelectProduto.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import staticDataService from '../../services/StaticDataService';

const SelectProduto = ({ 
  value,
  onChange,
  error,
  disabled = false,
  showCategoria = true
}) => {
  const [produtos, setProdutos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [produtosData, marcasData, categoriasData] = await Promise.all([
          staticDataService.getProdutos(),
          staticDataService.getMarcas(),
          staticDataService.getCategorias()
        ]);

        setProdutos(produtosData);
        setMarcas(marcasData);
        setCategorias(categoriasData);

        // Se há um valor inicial, seleciona marca e categoria
        if (value) {
          const produto = produtosData.find(p => p.id === value);
          if (produto) {
            setMarcaSelecionada(produto.marca);
            setCategoriaSelecionada(produto.categoria);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [value]);

  // Filtrar produtos baseado na marca e categoria selecionadas
  const produtosFiltrados = produtos.filter(produto => {
    const matchMarca = !marcaSelecionada || produto.marca === marcaSelecionada;
    const matchCategoria = !categoriaSelecionada || produto.categoria === categoriaSelecionada;
    return matchMarca && matchCategoria;
  });

  const handleMarcaChange = (e) => {
    const novaMarca = e.target.value;
    setMarcaSelecionada(novaMarca);
    setCategoriaSelecionada('');
    onChange(''); // Limpa seleção do produto
  };

  const handleCategoriaChange = (e) => {
    const novaCategoria = e.target.value;
    setCategoriaSelecionada(novaCategoria);
    onChange(''); // Limpa seleção do produto
  };

  const handleProdutoChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Select Marca */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Marca</label>
        <select
          value={marcaSelecionada}
          onChange={handleMarcaChange}
          disabled={disabled || isLoading}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Selecione uma marca</option>
          {marcas.map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>
      </div>

      {/* Select Categoria (opcional) */}
      {showCategoria && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoria</label>
          <select
            value={categoriaSelecionada}
            onChange={handleCategoriaChange}
            disabled={disabled || isLoading || !marcaSelecionada}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Todas as categorias</option>
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
        </div>
      )}

      {/* Select Produto */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Produto</label>
        <select
          value={value || ''}
          onChange={handleProdutoChange}
          disabled={disabled || isLoading || !marcaSelecionada}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Selecione um produto</option>
          {produtosFiltrados.map(produto => (
            <option key={produto.id} value={produto.id}>
              {produto.nome}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-sm text-gray-500">Carregando produtos...</div>
      )}
    </div>
  );
};

SelectProduto.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  showCategoria: PropTypes.bool
};

SelectProduto.defaultProps = {
  disabled: false,
  showCategoria: true
};

export default SelectProduto;