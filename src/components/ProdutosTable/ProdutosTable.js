import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ProdutoForm from '../../../src/components/ProdutoForm/ProdutoForm'; // Importe o componente ProdutoForm
import Modal from '../../../src/components/Modal/Modal'; // Importe o componente Modal

const ProdutosTable = ({ produtos, onEdit, formatMoney, disabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState(null);

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

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
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
          {produtos.map((produto, index) => (
            <tr key={index}>
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
  produtos: PropTypes.arrayOf(
    PropTypes.shape({
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