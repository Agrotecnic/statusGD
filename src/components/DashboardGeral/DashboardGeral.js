console.log('DashboardGeral loaded');
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, get, onValue, off } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingDashboard from '../LoadingDashboard/LoadingDashboard';

function DashboardGeral() {
  console.log('DashboardGeral renderizando');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vendedores, setVendedores] = useState([]);
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalAreas, setTotalAreas] = useState(0);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();

  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

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
      
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        setVendedores([]);
        return;
      }

      const userData = userSnapshot.val();
      const isAdmin = userData.role === 'admin';

      // Cache local para evitar recálculos
      let vendedoresCache = new Map();

      // Listener otimizado
      const vendedoresRef = ref(db, isAdmin ? 'users' : `users/${auth.currentUser.uid}`);
      onValue(vendedoresRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setVendedores([]);
          setTotalVendas(0);
          setTotalAreas(0);
          return;
        }

        let vendedoresList = [];
        let totalVendas = 0;
        let totalAreas = 0;

        Object.entries(data)
          .filter(([_, userData]) => userData.vendedorInfo)
          .forEach(([id, userData]) => {
            // Verificar cache
            const cacheKey = `${id}-${JSON.stringify(userData)}`;
            if (vendedoresCache.has(cacheKey)) {
              const cachedData = vendedoresCache.get(cacheKey);
              vendedoresList.push(cachedData);
              totalVendas += cachedData.totalVendido + cachedData.totalBonificado;
              totalAreas += cachedData.totalAreas;
              return;
            }

            // Calcular apenas se não estiver em cache
            const vendedor = {
              id,
              ...userData.vendedorInfo,
              totalVendido: calcularTotalVendido(userData.produtos),
              totalBonificado: calcularTotalBonificado(userData.produtos),
              totalAreas: calcularTotalAreas(userData.areas)
            };

            vendedoresCache.set(cacheKey, vendedor);
            vendedoresList.push(vendedor);
            totalVendas += vendedor.totalVendido + vendedor.totalBonificado;
            totalAreas += vendedor.totalAreas;
          });

        // Ordenação simplificada
        vendedoresList.sort((a, b) => b.totalAreas - a.totalAreas)
          .forEach((v, i) => v.ranking = i + 1);

        setVendedores(vendedoresList);
        setTotalVendas(totalVendas);
        setTotalAreas(totalAreas);
        
        toast.dismiss('loading');
      }, {
        onlyOnce: !isAdmin // Se não for admin, carrega apenas uma vez
      });

    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [db, auth.currentUser, calcularTotalVendido, calcularTotalBonificado, calcularTotalAreas]);

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
  }, [db]);

  useEffect(() => {
    console.log('DashboardGeral - Verificando autenticação');
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Usuario atual:', currentUser);
      if (currentUser) {
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log('Dados do usuário:', userData);
          setUser({ ...currentUser, role: userData.role });
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    if (user && auth.currentUser) {
      fetchVendedoresData();
    }
    
    // Limpar listener quando componente for desmontado
    return () => {
      const vendedoresRef = ref(db, 'users');
      off(vendedoresRef);
    };
  }, [user, auth.currentUser, fetchVendedoresData]);

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