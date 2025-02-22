console.log('DashboardGeral loaded');
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get, onValue, off } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingDashboard from '../LoadingDashboard/LoadingDashboard';
import { hasPermission } from '../../services/authService';
import { auth, db } from '../../config/firebase';

function DashboardGeral() {
  console.log('DashboardGeral renderizando');
  const [user, setUser] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vendedores, setVendedores] = useState([]);
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalAreas, setTotalAreas] = useState(0);
  const navigate = useNavigate();

  // Otimizar funções de cálculo
  const calcularTotalVendido = useCallback((produtos) => {
    if (!produtos || !Array.isArray(produtos)) return 0;
    return produtos.reduce((acc, p) => acc + (Number(p.valorVendido) || 0), 0);
  }, []);

  const calcularTotalBonificado = useCallback((produtos) => {
    if (!produtos || !Array.isArray(produtos)) return 0;
    return produtos.reduce((acc, p) => acc + (Number(p.valorBonificado) || 0), 0);
  }, []);

  const calcularTotalAreas = useCallback((areas) => {
    if (!areas) return 0;
    return (
      (Number(areas.emAcompanhamento) || Number(areas.Acompanhamento) || Number(areas.acompanhamento) || 0) +
      (Number(areas.aImplantar) || 0) +
      (Number(areas.finalizados) || 0)
    );
  }, []);

  const fetchVendedoresData = useCallback(async () => {
    try {
      setLoading(true);
      toast.info('Carregando...', { toastId: 'loading' });
      
      // Carregar todos os usuários diretamente
      const vendedoresRef = ref(db, 'users');
      const snapshot = await get(vendedoresRef);
      
      if (!snapshot.exists()) {
        setVendedores([]);
        setTotalVendas(0);
        setTotalAreas(0);
        return;
      }

      const data = snapshot.val();
      let vendedoresList = [];
      let totalVendas = 0;
      let totalAreas = 0;

      // Processar todos os usuários
      Object.entries(data)
        .filter(([, userData]) => userData.vendedorInfo)
        .forEach(([id, userData]) => {
          const vendedor = {
            id,
            ...userData.vendedorInfo,
            totalVendido: calcularTotalVendido(userData.produtos),
            totalBonificado: calcularTotalBonificado(userData.produtos),
            totalAreas: calcularTotalAreas(userData.areas)
          };

          vendedoresList.push(vendedor);
          totalVendas += vendedor.totalVendido + vendedor.totalBonificado;
          totalAreas += vendedor.totalAreas;
        });

      // Ordenação por áreas
      vendedoresList.sort((a, b) => b.totalAreas - a.totalAreas)
        .forEach((v, i) => v.ranking = i + 1);

      setVendedores(vendedoresList);
      setTotalVendas(totalVendas);
      setTotalAreas(totalAreas);
      
      toast.dismiss('loading');
      toast.success('Dados carregados!');

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [calcularTotalVendido, calcularTotalBonificado, calcularTotalAreas]);

  // Adicionar listener de conexão
  useEffect(() => {
    const connectedRef = ref(db, '.info/connected');
    const unsubscribe = onValue(connectedRef, (snap) => {
      if (!snap.val()) {
        toast.warning('Conexão perdida. Reconectando...');
      }
    });

    return () => {
      unsubscribe();
      const vendedoresRef = ref(db, 'users');
      off(vendedoresRef);
    };
  }, []);

  useEffect(() => {
    console.log('DashboardGeral - Verificando autenticação');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Usuario atual:', currentUser);
      if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.exists() ? snapshot.val() : {};
        const userRole = userData.role || 'user';
        
        setUser({ ...currentUser, role: userRole });
        setCanEdit(hasPermission('dashboardGeral', 'edit', userRole));
      } else {
        setUser(null);
        setCanEdit(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchVendedoresData();
    }
    
    // Limpar listener quando componente for desmontado
    return () => {
      const vendedoresRef = ref(db, 'users');
      off(vendedoresRef);
    };
  }, [user, fetchVendedoresData]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleEdit = useCallback(() => {
    if (!canEdit) return;
    toast.info('Funcionalidade em desenvolvimento');
    // Implementar lógica de edição aqui
  }, [canEdit]);

  // Correção do loading
  if (loading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Geral</h1>
        <div className="flex gap-4">
          {canEdit && (
            <button
              onClick={() => handleEdit()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Editar Dados
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Voltar
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total de Vendedores</h2>
          <p className="text-3xl font-bold">{vendedores.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Vendido</h2>
          <p className="text-3xl font-bold">{formatMoney(vendedores.reduce((acc, v) => acc + (v.totalVendido || 0), 0))}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Bonificado</h2>
          <p className="text-3xl font-bold">{formatMoney(vendedores.reduce((acc, v) => acc + (v.totalBonificado || 0), 0))}</p>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Geral</h2>
          <p className="text-3xl font-bold">{formatMoney(totalVendas)}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total de Áreas</h2>
          <p className="text-3xl font-bold">{totalAreas}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 text-center">Ranking GD</th>
              <th className="py-2 px-4 text-left">Nome</th>
              <th className="py-2 px-4 text-left">Regional</th>
              <th className="py-2 px-4 text-left">Business Unit</th>
              <th className="py-2 px-4 text-right">Total Vendido</th>
              <th className="py-2 px-4 text-right">Total Bonificado</th>
              <th className="py-2 px-4 text-right">Total Geral</th>
              <th className="py-2 px-4 text-right">Total Áreas</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {vendedores.map((vendedor) => (
              <tr key={vendedor.id} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4 text-center font-bold">{vendedor.ranking}º</td>
                <td className="py-2 px-4">{vendedor.nome}</td>
                <td className="py-2 px-4">{vendedor.regional}</td>
                <td className="py-2 px-4">{vendedor.businessUnit}</td>
                <td className="py-2 px-4 text-right">{formatMoney(vendedor.totalVendido)}</td>
                <td className="py-2 px-4 text-right">{formatMoney(vendedor.totalBonificado)}</td>
                <td className="py-2 px-4 text-right">{formatMoney(vendedor.totalVendido + vendedor.totalBonificado)}</td>
                <td className="py-2 px-4 text-right">{vendedor.totalAreas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardGeral;