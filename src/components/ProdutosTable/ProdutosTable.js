import React from 'react';

const ProdutosTable = ({ produtos, onEdit, onAdd, formatMoney, disabled }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Valor Vendido</th>
            <th className="py-2 px-4 border-b">Valor Bonificado</th>
            <th className="py-2 px-4 border-b">Áreas</th>
            <th className="py-2 px-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{produto.nome}</td>
              <td className="py-2 px-4 border-b">{formatMoney(produto.valorVendido)}</td>
              <td className="py-2 px-4 border-b">{formatMoney(produto.valorBonificado)}</td>
              <td className="py-2 px-4 border-b">{produto.areas}</td>
              <td className="py-2 px-4 border-b">
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
      <button
        onClick={onAdd}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={disabled}
      >
        Adicionar Produto
      </button>
    </div>
  );
};

export default ProdutosTable;