import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProdutoForm from '../../../src/components/ProdutoForm/ProdutoForm'; // Importe o componente ProdutoForm
import Modal from '../../../src/components/Modal/Modal'; // Importe o componente Modal

const ProdutosTable = ({ userId, produtos, onEdit, formatMoney, disabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('Produtos recebidos:', produtos);
  }, [produtos]);

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

  const filteredProdutos = produtos.filter((produto) =>
    produto.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    console.log('Produtos filtrados:', filteredProdutos);
  }, [filteredProdutos]);

  const renderProdutos = (produtos) => {
    if (typeof produtos === 'string') {
      try {
        const parsedProdutos = JSON.parse(produtos);
        if (Array.isArray(parsedProdutos)) {
          return parsedProdutos.map(p => p.nome).join(', ');
        }
      } catch (error) {
        console.error('Erro ao parsear JSON:', error);
        return produtos;
      }
    } else if (Array.isArray(produtos)) {
      return produtos.map(p => p.nome).join(', ');
    }
    return produtos;
  };

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
            {filteredProdutos.map((produto) => (
              <tr key={produto.id}>
                <td className="py-2 px-4">{produto.cliente}</td>
                <td className="py-2 px-4">{renderProdutos(produto.produtos)}</td>
                <td className="py-2 px-4 text-right">{formatMoney(produto.valorVendido)}</td>
                <td className="py-2 px-4 text-right">{formatMoney(produto.valorBonificado)}</td>
                <td className="py-2 px-4 text-right">{produto.areas}</td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleEdit(produto)}
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
  formatMoney: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default ProdutosTable;