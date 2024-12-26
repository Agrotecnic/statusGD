import React from 'react';
import PropTypes from 'prop-types';
import { Table, Badge } from 'react-bootstrap';
import { formatCurrency } from '../../../utils/formatters';

const ProdutosTable = ({ produtos }) => {
  const getStatusBadge = (status) => {
    const statusColors = {
      'Em Estoque': 'success',
      'Baixo Estoque': 'warning',
      'Sem Estoque': 'danger'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  const getQuantityColor = (quantidade) => {
    if (quantidade <= 0) return 'text-danger';
    if (quantidade <= 10) return 'text-warning';
    return 'text-success';
  };

  return (
    <Table striped bordered hover responsive className="align-middle">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Preço</th>
          <th>Quantidade</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {produtos.map((produto) => (
          <tr key={produto.id}>
            <td>{produto.id}</td>
            <td>{produto.nome}</td>
            <td>{produto.descricao}</td>
            <td>{formatCurrency(produto.preco)}</td>
            <td className={getQuantityColor(produto.quantidade)}>
              {produto.quantidade}
            </td>
            <td>{getStatusBadge(produto.status)}</td>
            <td>
              <button className="btn btn-sm btn-primary me-2">Editar</button>
              <button className="btn btn-sm btn-danger">Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

ProdutosTable.propTypes = {
  produtos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nome: PropTypes.string.isRequired,
      descricao: PropTypes.string.isRequired,
      preco: PropTypes.number.isRequired,
      quantidade: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ProdutosTable;