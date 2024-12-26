import React from 'react';
import PropTypes from 'prop-types';
import SelectProduto from '../SelectProduto';

const ProdutosList = ({ produtos, onDelete, onEdit }) => {
  return (
    <div className="space-y-4">
      {produtos.map((produto) => (
        <div 
          key={produto.id} 
          className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
        >
          <div className="flex-1">
            <h3 className="font-medium">{produto.nome}</h3>
            <div className="text-sm text-gray-500">
              <span className="mr-4">Cliente: {produto.cliente}</span>
              <span className="mr-4">Valor Vendido: R$ {produto.valorVendido}</span>
              <span>Áreas: {produto.areas}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(produto)}
              className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                  onDelete(produto.id);
                }
              }}
              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

ProdutosList.propTypes = {
  produtos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nome: PropTypes.string.isRequired,
      cliente: PropTypes.string,
      valorVendido: PropTypes.number,
      valorBonificado: PropTypes.number,
      areas: PropTypes.number,
      marca: PropTypes.string,
      categoria: PropTypes.string
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default ProdutosList;