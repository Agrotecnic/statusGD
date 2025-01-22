// src/components/DataEntry/DataEntryForm.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DataEntryForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    vendedor: {
      nome: initialData?.vendedor?.nome || '',
      regional: initialData?.vendedor?.regional || '',
      businessUnit: initialData?.vendedor?.businessUnit || ''
    },
    areas: {
      emAcompanhamento: initialData?.areas?.emAcompanhamento || 0,
      aImplantar: initialData?.areas?.aImplantar || 0,
      finalizados: initialData?.areas?.finalizados || 0,
      mediaHectaresArea: initialData?.areas?.mediaHectaresArea || 0,
      areaPotencialTotal: initialData?.areas?.areaPotencialTotal || 0
    },
    produtos: initialData?.produtos || []
  });

  const [currentProduto, setCurrentProduto] = useState({
    nome: '',
    cliente: '',
    valorVendido: 0,
    valorBonificado: 0,
    areas: 0
  });

  const handleVendedorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vendedor: {
        ...prev.vendedor,
        [name]: value
      }
    }));
  };

  const handleAreasChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      areas: {
        ...prev.areas,
        [name]: Number(value) || 0
      }
    }));
  };

  const handleProdutoChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduto(prev => ({
      ...prev,
      [name]: name.includes('valor') || name === 'areas' ? Number(value) || 0 : value
    }));
  };

  const addProduto = () => {
    if (!currentProduto.nome || !currentProduto.cliente) {
      alert('Nome do produto e cliente são obrigatórios');
      return;
    }

    setFormData(prev => ({
      ...prev,
      produtos: [...prev.produtos, currentProduto]
    }));

    setCurrentProduto({
      nome: '',
      cliente: '',
      valorVendido: 0,
      valorBonificado: 0,
      areas: 0
    });
  };

  const removeProduto = (index) => {
    setFormData(prev => ({
      ...prev,
      produtos: prev.produtos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validações básicas
    if (!formData.vendedor.nome || !formData.vendedor.regional) {
      alert('Informações do vendedor são obrigatórias');
      return;
    }
    if (formData.produtos.length === 0) {
      alert('Adicione pelo menos um produto');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações do Vendedor */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Informações do Vendedor</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="nome"
                value={formData.vendedor.nome}
                onChange={handleVendedorChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Regional
              </label>
              <input
                type="text"
                name="regional"
                value={formData.vendedor.regional}
                onChange={handleVendedorChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Unit
              </label>
              <input
                type="text"
                name="businessUnit"
                value={formData.vendedor.businessUnit}
                onChange={handleVendedorChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
        </section>

        {/* Informações das Áreas */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Áreas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Em Acompanhamento
              </label>
              <input
                type="number"
                name="emAcompanhamento"
                value={formData.areas.emAcompanhamento}
                onChange={handleAreasChange}
                className="w-full border rounded-md p-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                A Implantar
              </label>
              <input
                type="number"
                name="aImplantar"
                value={formData.areas.aImplantar}
                onChange={handleAreasChange}
                className="w-full border rounded-md p-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Finalizados
              </label>
              <input
                type="number"
                name="finalizados"
                value={formData.areas.finalizados}
                onChange={handleAreasChange}
                className="w-full border rounded-md p-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Média Hectares por Área
              </label>
              <input
                type="number"
                name="mediaHectaresArea"
                value={formData.areas.mediaHectaresArea}
                onChange={handleAreasChange}
                className="w-full border rounded-md p-2"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área Potencial Total
              </label>
              <input
                type="number"
                name="areaPotencialTotal"
                value={formData.areas.areaPotencialTotal}
                onChange={handleAreasChange}
                className="w-full border rounded-md p-2"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </section>

        {/* Produtos */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Produtos</h3>
          
          {/* Lista de Produtos */}
          <div className="mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Produto</th>
                  <th className="px-4 py-2 text-left">Cliente</th>
                  <th className="px-4 py-2 text-right">Valor Vendido</th>
                  <th className="px-4 py-2 text-right">Valor Bonificado</th>
                  <th className="px-4 py-2 text-right">Áreas</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {formData.produtos.map((produto, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{produto.nome}</td>
                    <td className="px-4 py-2">{produto.cliente}</td>
                    <td className="px-4 py-2 text-right">
                      {produto.valorVendido.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {produto.valorBonificado.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </td>
                    <td className="px-4 py-2 text-right">{produto.areas}</td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => removeProduto(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Formulário de Novo Produto */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium mb-3">Adicionar Novo Produto</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <input
                  type="text"
                  name="nome"
                  value={currentProduto.nome}
                  onChange={handleProdutoChange}
                  placeholder="Nome do Produto"
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="cliente"
                  value={currentProduto.cliente}
                  onChange={handleProdutoChange}
                  placeholder="Cliente"
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="valorVendido"
                  value={currentProduto.valorVendido}
                  onChange={handleProdutoChange}
                  placeholder="Valor Vendido"
                  className="w-full border rounded-md p-2"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="valorBonificado"
                  value={currentProduto.valorBonificado}
                  onChange={handleProdutoChange}
                  placeholder="Valor Bonificado"
                  className="w-full border rounded-md p-2"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="areas"
                  value={currentProduto.areas}
                  onChange={handleProdutoChange}
                  placeholder="Áreas"
                  className="w-full border rounded-md p-2"
                  min="0"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addProduto}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Adicionar Produto
            </button>
          </div>
        </section>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Salvar Dados
          </button>
        </div>
      </form>
    </div>
  );
};

DataEntryForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default DataEntryForm;