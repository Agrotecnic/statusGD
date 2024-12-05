import React from 'react';
import useUserProfile from '../../hooks/useUserProfile';
import LoadingSpinner from '../LoadingSpinner';

const UserProfile = () => {
  const { userData, loading, error } = useUserProfile();  // Removido saveUserData já que não está sendo usado

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Erro ao carregar dados: {error.message}</div>;
  if (!userData) return <div>Nenhum dado encontrado</div>;

  const formatNumber = (number) => {
    return typeof number === 'number' ? number.toLocaleString('pt-BR') : '-';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value || 0);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Perfil do Usuário</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Informações do Vendedor</h3>
            <p>Nome: {userData.vendedorInfo?.nome || '-'}</p>
            <p>Regional: {userData.vendedorInfo?.regional || '-'}</p>
            <p>BU: {userData.vendedorInfo?.businessUnit || '-'}</p>
            <p>Última Atualização: {userData.vendedorInfo?.dataAtualizacao || '-'}</p>
          </div>

          <div>
            <h3 className="font-semibold">Áreas</h3>
            <p>Acompanhamento: {formatNumber(userData.areas?.Acompanhamento)}</p>
            <p>A Implantar: {formatNumber(userData.areas?.aImplantar)}</p>
            <p>Média Hectare das Áreas: {
              userData.areas?.hectaresPorArea 
                ? userData.areas.hectaresPorArea.toFixed(2) 
                : '-'
            }</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Produtos</h3>
          <div className="mt-2 space-y-2">
            {userData.produtos?.length > 0 ? (
              <div className="grid gap-4">
                {userData.produtos.map((produto, index) => (
                  <div key={index} className="border p-4 rounded-lg bg-gray-50">
                    <p className="font-medium">{produto.nome || 'Sem nome'}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <p>Valor Vendido: {formatCurrency(produto.valorVendido)}</p>
                      <p>Valor Bonificado: {formatCurrency(produto.valorBonificado)}</p>
                      <p>Áreas: {formatNumber(produto.areas)}</p>
                      <p>Total: {formatCurrency((produto.valorVendido || 0) + (produto.valorBonificado || 0))}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum produto cadastrado</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Imagens</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.entries(userData.images || {}).map(([key, value]) => (
              value && (
                <div key={key} className="border rounded-lg p-2">
                  <p className="font-medium mb-2">{key}</p>
                  <div className="aspect-video relative">
                    <img 
                      src={value} 
                      alt={key} 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Última sincronização: {new Date(userData.lastUpdated || Date.now()).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;