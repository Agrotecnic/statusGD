import React from 'react';
import PropTypes from 'prop-types';
import ProdutosList from './ProdutosList';

const DashboardContent = ({
  user,
  vendedorInfo,
  areas,
  produtos,
  setProdutos,
  handleProdutoUpdate,
  handleProdutoRemove,
  // ...other props
}) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard - {user.email}</h1>
        <div className="vendedor-info">
          <p>Vendedor: {vendedorInfo.nome}</p>
          <p>Regional: {vendedorInfo.regional}</p>
        </div>
      </header>

      <div className="areas-info">
        {/* Renderize as informações das áreas aqui */}
        <p>Em Acompanhamento: {areas.emAcompanhamento}</p>
        <p>A Implantar: {areas.aImplantar}</p>
        <p>Finalizados: {areas.finalizados}</p>
      </div>

      <ProdutosList
        produtos={produtos}
        setProdutos={setProdutos}
        handleProdutoUpdate={handleProdutoUpdate}
        handleProdutoRemove={handleProdutoRemove}
      />
    </div>
  );
};

DashboardContent.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    role: PropTypes.string
  }).isRequired,
  vendedorInfo: PropTypes.shape({
    nome: PropTypes.string,
    regional: PropTypes.string,
    businessUnit: PropTypes.string,
    dataAtualizacao: PropTypes.string
  }).isRequired,
  areas: PropTypes.shape({
    emAcompanhamento: PropTypes.number,
    aImplantar: PropTypes.number,
    finalizados: PropTypes.number,
    mediaHectaresArea: PropTypes.number,
    areaPotencialTotal: PropTypes.number
  }).isRequired,
  produtos: PropTypes.array.isRequired,
  setProdutos: PropTypes.func.isRequired,
  handleProdutoUpdate: PropTypes.func.isRequired,
  handleProdutoRemove: PropTypes.func.isRequired
};

export default DashboardContent;
