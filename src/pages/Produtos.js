import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import ProdutosTable from '../components/DashboardGeral/components/ProdutosTable';
import api from '../services/api';

function Produtos() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get('/produtos');
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <Container>
      <h2 className="mt-4 mb-4">Lista de Produtos</h2>
      <ProdutosTable produtos={produtos} />
    </Container>
  );
}

export default Produtos;
