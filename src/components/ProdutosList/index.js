import React from 'react';
import PropTypes from 'prop-types';

const ProdutosList = ({ produtos, onEdit, onRemove, loading }) => {
  const handleRemove = (index) => {
    if (typeof onRemove === 'function') {
      onRemove(index);
    } else {
      console.error('onRemove não é uma função');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor Vendido
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor Bonificado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Áreas
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {produtos.map((produto, index) => (
            <tr key={produto.id || index}>
              <td className="px-6 py-4 whitespace-nowrap">{produto.nome}</td>
              <td className="px-6 py-4 whitespace-nowrap">{produto.cliente}</td>
              <td className="px-6 py-4 whitespace-nowrap">{produto.valorVendido}</td>
              <td className="px-6 py-4 whitespace-nowrap">{produto.valorBonificado}</td>
              <td className="px-6 py-4 whitespace-nowrap">{produto.areas}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(index)}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemove(index)}
                  className="text-red-600 hover:text-red-900"
                  disabled={loading}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ProdutosList.propTypes = {
  produtos: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ProdutosList;
