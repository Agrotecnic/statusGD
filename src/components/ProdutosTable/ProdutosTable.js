import React from 'react';

const ProdutosTable = ({ produtos, onEdit, formatMoney, disabled }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Valor Vendido</th>
            <th className="py-2 px-4 border-b">Valor Bonificado</th>
            <th className="py-2 px-4 border-b">Áreas</th>
            <th className="py-2 px-4 border-b no-print">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{produto.nome}</td>
              <td className="py-2 px-4 border-b">{formatMoney(produto.valorVendido)}</td>
              <td className="py-2 px-4 border-b">{formatMoney(produto.valorBonificado)}</td>
              <td className="py-2 px-4 border-b">{produto.areas}</td>
              <th className="py-2 px-4 border-b hide-on-print">Ações</th>
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

export default ProdutosTable;