import React from 'react';

interface Produto {
  id: string;
  nome: string;
  cliente: string;
  valorVendido: number;
  valorBonificado: number;
  areas: number;
}

interface ProdutosListProps {
  produtos?: Produto[];
  onDelete?: (id: string) => void;
  onEdit?: (produto: Produto) => void;
  loading?: boolean;
}

const ProdutosList: React.FC<ProdutosListProps> = ({ 
  produtos = [], 
  onDelete = () => {}, 
  onEdit = () => {}, 
  loading = false 
}) => {
  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {produtos.map((produto) => (
        <div key={produto.id} className="p-4 border rounded-lg shadow-sm">
          <h3 className="font-semibold">{produto.nome}</h3>
          <p>Cliente: {produto.cliente}</p>
          <p>Valor Vendido: R$ {produto.valorVendido.toFixed(2)}</p>
          <p>Valor Bonificado: R$ {produto.valorBonificado.toFixed(2)}</p>
          <p>Áreas: {produto.areas}</p>
          
          <div className="mt-4 space-x-2">
            <button
              onClick={() => onEdit(produto)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Editar
            </button>
            <button
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                  onDelete(produto.id);
                }
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProdutosList;
