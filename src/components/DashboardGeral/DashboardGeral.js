console.log('DashboardGeral loaded');
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    return (Number(areas.emAcompanhamento) || 0) + (Number(areas.aImplantar) || 0);
  }, []);

  const fetchVendedoresData = useCallback(async () => {
    const vendedoresRef = ref(db, 'users');
    const snapshot = await get(vendedoresRef);
    if (snapshot.exists()) {
      const vendedoresData = snapshot.val();
      const vendedoresList = Object.entries(vendedoresData).map(([id, data]) => ({
        id,
        ...data.vendedorInfo,
        totalVendido: calcularTotalVendido(data.produtos),
        totalBonificado: calcularTotalBonificado(data.produtos),
        totalAreas: calcularTotalAreas(data.areas)
      }));
      
      setVendedores(vendedoresList);
      setTotalVendas(vendedoresList.reduce((acc, v) => acc + (v.totalVendido || 0) + (v.totalBonificado || 0), 0));
      setTotalAreas(vendedoresList.reduce((acc, v) => acc + (v.totalAreas || 0), 0));
    }
  }, [db, calcularTotalVendido, calcularTotalBonificado, calcularTotalAreas]);

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
    console.log('Usuario atual:', user);
    if (user) {
      console.log('Buscando dados dos vendedores...');
      fetchVendedoresData();
    }
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Geral</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
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