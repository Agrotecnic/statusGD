import React, { useState, useEffect, useCallback } from 'react';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import PropTypes from 'prop-types';
import EditProdutoModal from '../DashboardGeral/components/EditProdutoModal';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ProdutosTable = ({ 
  selectedBU, 
  selectedRegional, 
  onSave, 
  produtos, 
  setProdutos
}) => {
  // Garantir que produtos seja sempre um array
  const produtosArray = Array.isArray(produtos) ? produtos : [];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'asc' });

  // Referências do Firebase
  const db = getDatabase();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // Função para buscar produtos do Firebase
  const fetchProdutos = useCallback(async () => {
    if (!userId) {
      setError('Usuário não autenticado. Por favor, faça login novamente.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Iniciando busca de produtos para usuário:', userId);
      const produtosRef = ref(db, `users/${userId}/produtos`);
      const snapshot = await get(produtosRef);
      
      console.log('Snapshot obtido:', snapshot.exists());
      
      let produtosData = [];
      
      if (snapshot.exists()) {
        try {
          produtosData = Object.entries(snapshot.val() || {}).map(([id, data]) => ({
            id,
            ...data,
            valorVendido: Number(data.valorVendido) || 0,
            valorBonificado: Number(data.valorBonificado) || 0,
            areas: Number(data.areas) || 0
          }));
          
          console.log('Dados processados:', produtosData);
        } catch (parseError) {
          console.error('Erro ao processar dados:', parseError);
          throw new Error('Erro ao processar dados dos produtos');
        }

        // Aplicar filtros
        produtosData = produtosData.filter(produto => {
          const matchBU = !selectedBU || produto.bu === selectedBU;
          const matchRegional = !selectedRegional || produto.regional === selectedRegional;
          return matchBU && matchRegional;
        });

        console.log('Dados filtrados:', produtosData);
      }

      setProdutos(produtosData);
      setLoading(false);
      
    } catch (error) {
      console.error('Erro detalhado ao buscar produtos:', error);
      setError('Erro ao carregar produtos. Detalhes: ' + error.message);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }, [db, selectedBU, selectedRegional, userId, setProdutos]);

  // Efeito para buscar produtos quando as dependências mudarem
  useEffect(() => {
    if (userId) {
      console.log('Iniciando busca de produtos...');
      fetchProdutos();
    }
  }, [fetchProdutos, userId]);

  // Função para formatar valores monetários
  const formatCurrency = useCallback((value) => {
    const numValue = Number(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  }, []);

  // Handler para ordenação das colunas
  const handleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Handler para edição de produto
  const handleEdit = useCallback((produto) => {
    console.log('Iniciando edição do produto:', produto);
    const produtoParaEditar = {
      ...produto,
      valorVendido: Number(produto.valorVendido) || 0,
      valorBonificado: Number(produto.valorBonificado) || 0,
      areas: Number(produto.areas) || 0
    };
    setSelectedProduto(produtoParaEditar);
    setShowEditModal(true);
  }, []);

  // Handler para fechar o modal
  const handleCloseModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedProduto(null);
    setError(null);
  }, []);

  // Handler para salvar alterações no produto
  const handleSave = useCallback(async (updatedProduto) => {
    if (!userId) {
      console.error('Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('Iniciando salvamento do produto:', updatedProduto);
    try {
      setLoading(true);
      setError(null);

      await onSave(updatedProduto);
      
      // Recarrega os dados para garantir sincronização
      await fetchProdutos();
      
      setShowEditModal(false);
      setSelectedProduto(null);
    } catch (error) {
      console.error('Erro detalhado ao salvar:', error);
      setError('Erro ao salvar alterações. Por favor, tente novamente.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId, onSave, fetchProdutos]);

  // Handler para remover produto
  const handleRemove = useCallback(async (produto) => {
    if (!userId) {
      console.error('Usuário não autenticado');
      return;
    }

    if (!window.confirm(`Deseja realmente remover o produto "${produto.nome}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const produtoRef = ref(db, `users/${userId}/produtos/${produto.id}`);
      await remove(produtoRef);
      
      setProdutos(prev => prev.filter(p => p.id !== produto.id));
      console.log('Produto removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      setError('Erro ao remover produto. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [db, userId, setProdutos]);

  // Adicionar função para novo produto
  const handleAddProduto = useCallback(() => {
    const novoProduto = {
      id: Date.now().toString(), // ID temporário
      nome: 'Novo Produto',
      cliente: '',
      valorVendido: 0,
      valorBonificado: 0,
      areas: 0
    };
    handleEdit(novoProduto);
  }, [handleEdit]);

  // Renderização condicional para estados de loading e erro
  if (loading && produtosArray.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 border border-red-200 rounded-md bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Adicionar botão no topo da tabela */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAddProduto}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          type="button"
        >
          Adicionar Produto
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              { key: 'nome', label: 'Nome' },
              { key: 'cliente', label: 'Cliente' },
              { key: 'valorVendido', label: 'Valor Vendido' },
              { key: 'valorBonificado', label: 'Valor Bonificado' },
              { key: 'areas', label: 'Áreas' }
            ].map(({ key, label }) => (
              <th 
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort(key)}
              >
                {label}
                {sortConfig.key === key && (
                  <span className="ml-2">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {produtosArray.map(produto => (
            <tr key={produto.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{produto.nome}</td>
              <td className="px-6 py-4 whitespace-nowrap">{produto.cliente}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatCurrency(produto.valorVendido)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatCurrency(produto.valorBonificado)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{produto.areas}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(produto)}
                    className="text-blue-600 hover:text-blue-900 font-medium focus:outline-none focus:underline"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleRemove(produto)}
                    className="text-red-600 hover:text-red-900 font-medium focus:outline-none focus:underline ml-3"
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {produtosArray.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                Nenhum produto encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showEditModal && (
        <EditProdutoModal
          isOpen={showEditModal}
          onClose={handleCloseModal}
          produto={selectedProduto}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

ProdutosTable.propTypes = {
  selectedBU: PropTypes.string,
  selectedRegional: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  produtos: PropTypes.array.isRequired,
  setProdutos: PropTypes.func.isRequired
};

ProdutosTable.defaultProps = {
  selectedBU: '',
  selectedRegional: '',
  produtos: [] // Garantir um array vazio como valor padrão
};

export default ProdutosTable;