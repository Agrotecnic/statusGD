import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProdutoForm from '../../../src/components/ProdutoForm/ProdutoForm'; // Importe o componente ProdutoForm
import Modal from '../../../src/components/Modal/Modal'; // Importe o componente Modal
import { deleteProduto } from '../../../src/api/produtos'; // Importe a função deleteProduto

const ProdutosTable = ({ userId, produtos, onEdit, onDelete, formatMoney, disabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [selectedProdutos, setSelectedProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (produto) => {
    setSelectedProduto(produto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduto(null);
  };

  const handleFormSubmit = (formData) => {
    onEdit(formData);
    handleCloseModal();
  };

  const handleSelect = (produtoId) => {
    setSelectedProdutos((prev) =>
      prev.includes(produtoId) ? prev.filter((id) => id !== produtoId) : [...prev, produtoId]
    );
  };

  const handleDelete = async (produtoId) => {
    console.log('Chamando handleDelete com userId:', userId, 'e produtoId:', produtoId);
    try {
      await deleteProduto(userId, produtoId);
      console.log('id do produto:', produtoId);
      console.log('userId:', userId);
      onDelete(produtoId);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const handleDeleteSelected = () => {
    selectedProdutos.forEach((produtoId) => handleDelete(produtoId));
    setSelectedProdutos([]);
  };

  const filteredProdutos = produtos.filter((produto) =>
    produto.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4 w-full">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="px-4 py-2 border rounded w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {selectedProdutos.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Excluir Selecionados
            </button>
          )}
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProdutos(filteredProdutos.map((_, index) => index));
                  } else {
                    setSelectedProdutos([]);
                  }
                }}
                checked={selectedProdutos.length === filteredProdutos.length}
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produtos
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor Vendido
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor Bonificado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Áreas
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProdutos.map((produto, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedProdutos.includes(index)}
                  onChange={() => handleSelect(index)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.cliente}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {produto.produtos && Array.isArray(produto.produtos)
                  ? produto.produtos.map(p => p.nome).join(', ')
                  : produto.produtos
                  ? JSON.parse(produto.produtos).map(p => p.nome).join(', ')
                  : ''}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMoney(produto.valorVendido)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMoney(produto.valorBonificado)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{produto.areas}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleEdit(produto)}
                  className="text-indigo-600 hover:text-indigo-900"
                  disabled={disabled}
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    console.log('Produto ID:', index);
                    handleDelete(index);
                  }}
                  className="text-red-600 hover:text-red-900 ml-3"
                  disabled={disabled}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <ProdutoForm
            initialData={selectedProduto}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            isLoading={disabled}
          />
        </Modal>
      )}
    </>
  );
};

ProdutosTable.propTypes = {
  userId: PropTypes.string.isRequired,
  produtos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      cliente: PropTypes.string,
      valorVendido: PropTypes.number,
      valorBonificado: PropTypes.number,
      areas: PropTypes.number,
      produtos: PropTypes.oneOfType([
        PropTypes.string, // JSON string
        PropTypes.arrayOf(
          PropTypes.shape({
            nome: PropTypes.string
          })
        )
      ])
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  formatMoney: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default ProdutosTable;