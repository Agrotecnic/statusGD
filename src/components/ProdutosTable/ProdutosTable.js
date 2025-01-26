import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProdutoForm from '../../../src/components/ProdutoForm/ProdutoForm'; // Importe o componente ProdutoForm
import Modal from '../../../src/components/Modal/Modal'; // Importe o componente Modal

const ProdutosTable = ({ userId, produtos, onEdit, formatMoney, disabled, handleProdutoUpdateLocal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Produtos recebidos:', produtos);
  }, [produtos]);

  const handleEdit = (produto, index) => {
    console.log('Produto selecionado para edição:', produto);
    setSelectedProduto(produto);
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduto(null);
    setSelectedIndex(null);
  };

  const handleFormSubmit = (formData) => {
    console.log('Dados do formulário submetidos:', formData);
    console.log('Produto selecionado:', selectedProduto);
    console.log('Índice do produto selecionado:', selectedIndex);
    if (selectedIndex !== null) {
      handleProdutoUpdateLocal(formData, selectedIndex);
    }
    handleCloseModal();
  };

  let filteredProdutos = [];
  try {
    filteredProdutos = produtos.filter((produto) =>
      produto.cliente.toLowerCase().includes(searchTerm.toLowerCase()) &&
      ((produto.nome && produto.nome.trim() !== '') || (Array.isArray(produto.produtos) && produto.produtos.some(p => p.nome.trim() !== '')))
    );
  } catch (err) {
    console.error('Erro ao filtrar produtos:', err);
    setError('Erro ao carregar a tabela de produtos.');
  }

  useEffect(() => {
    console.log('Produtos filtrados:', filteredProdutos);
  }, [filteredProdutos]);

  const renderProdutos = (produto) => {
    if (produto.nome && produto.nome.trim() !== '') {
      return produto.nome;
    } else if (Array.isArray(produto.produtos)) {
      return produto.produtos.map(p => p.nome).join(', ');
    }
    return 'N/A';
  };

  if (error) {
    console.error('Erro ao renderizar a tabela de produtos:', error);
    return <div className="text-red-500">{error}</div>;
  }

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
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Cliente</th>
              <th className="py-2 px-4 text-left">Produtos</th>
              <th className="py-2 px-4 text-right">Valor Vendido</th>
              <th className="py-2 px-4 text-right">Valor Bonificado</th>
              <th className="py-2 px-4 text-right">Áreas</th>
              <th className="py-2 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredProdutos.map((produto, index) => (
              <tr key={index}>
                <td className="py-2 px-4">{produto.cliente || 'N/A'}</td>
                <td className="py-2 px-4 break-words">{renderProdutos(produto)}</td>
                <td className="py-2 px-4 text-right">{formatMoney(produto.valorVendido)}</td>
                <td className="py-2 px-4 text-right">{formatMoney(produto.valorBonificado)}</td>
                <td className="py-2 px-4 text-right">{produto.areas}</td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleEdit(produto, index)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    disabled={disabled}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
      id: PropTypes.string,
      cliente: PropTypes.string,
      valorVendido: PropTypes.number,
      valorBonificado: PropTypes.number,
      areas: PropTypes.number,
      nome: PropTypes.string, // Adicione o campo nome
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
  formatMoney: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  handleProdutoUpdateLocal: PropTypes.func.isRequired
};

export default ProdutosTable;