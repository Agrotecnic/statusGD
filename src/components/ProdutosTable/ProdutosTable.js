import React from 'react';
import PropTypes from 'prop-types';

const ProdutosTable = ({ produtos, onEdit, formatMoney, disabled }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>{/* Remova espaços em branco entre as tags */}
            <th className="py-2 px-4 text-left">Nome</th>
            <th className="py-2 px-4 border-b">Cliente</th> {/* Nova coluna */}
            <th className="py-2 px-4 text-right">Valor Vendido</th>
            <th className="py-2 px-4 border-b">Valor Bonificado</th>
            <th className="py-2 px-4 border-b">Áreas</th>
            <th className="py-2 px-4 border-b hide-on-print">Ações</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {produtos.map((produto, index) => (
            <tr key={index}>{/* Remova espaços em branco entre as tags */}
              <td className="py-2 px-4">{produto.nome}</td>
              <td className="py-2 px-4 border-b">{produto.cliente || '-'}</td> {/* Nova coluna */}
              <td className="py-2 px-4 text-right">{formatMoney(produto.valorVendido)}</td>
              <td className="py-2 px-4 border-b">{formatMoney(produto.valorBonificado)}</td>
              <td className="py-2 px-4 border-b">{produto.areas}</td>
              <td className="py-2 px-4 border-b hide-on-print">
                <button
                  onClick={() => onEdit('produto', { index })}
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
  );
};

ProdutosTable.propTypes = {
  produtos: PropTypes.arrayOf(
    PropTypes.shape({
      nome: PropTypes.string,
      cliente: PropTypes.string, // Novo PropType
      valorVendido: PropTypes.number,
      valorBonificado: PropTypes.number,
      areas: PropTypes.number
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  formatMoney: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default ProdutosTable;