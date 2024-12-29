console.log('DashboardGeral loaded');
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const calcularTotalVendido = useCallback((produtos) => {
    if (!produtos || !Array.isArray(produtos)) return 0;
    // Adicionar log para debug dos produtos
    console.log('Calculando total vendido para produtos:', produtos);
    const total = produtos.reduce((acc, p) => {
      const valor = Number(p.valorVendido) || 0;
      console.log(`Produto - Valor Vendido: ${valor}`);
      return acc + valor;
    }, 0);
    console.log('Total vendido calculado:', total);
    return total;
  }, []);

  const calcularTotalBonificado = useCallback((produtos) => {
    if (!produtos || !Array.isArray(produtos)) return 0;
    // Adicionar log para debug dos produtos
    console.log('Calculando total bonificado para produtos:', produtos);
    const total = produtos.reduce((acc, p) => {
      const valor = Number(p.valorBonificado) || 0;
      console.log(`Produto - Valor Bonificado: ${valor}`);
      return acc + valor;
    }, 0);
    console.log('Total bonificado calculado:', total);
    return total;
  }, []);

  const calcularTotalAreas = useCallback((areas) => {
    if (!areas) return 0;
    
    // Normaliza os campos que podem ter nomes diferentes
    const emAcompanhamento = 
      Number(areas.emAcompanhamento) || 
      Number(areas.Acompanhamento) || 
      Number(areas.acompanhamento) || 0;
    
    const aImplantar = Number(areas.aImplantar) || 0;
    const finalizados = Number(areas.finalizados) || 0;
    
    return emAcompanhamento + aImplantar + finalizados;
  }, []);

  const fetchVendedoresData = useCallback(async () => {
    console.log('Iniciando fetchVendedoresData');
    const vendedoresRef = ref(db, 'users');
    const snapshot = await get(vendedoresRef);
    if (snapshot.exists()) {
      const vendedoresData = snapshot.val();
      let vendedoresList = Object.entries(vendedoresData).map(([id, data]) => {
        // Log para debug dos dados do vendedor
        console.log(`\nProcessando vendedor ${id}:`, {
          produtos: data.produtos,
          areas: data.areas
        });

        const totalVendido = calcularTotalVendido(data.produtos);
        const totalBonificado = calcularTotalBonificado(data.produtos);

        // Log dos totais calculados
        console.log(`Totais do vendedor ${id}:`, {
          totalVendido,
          totalBonificado
        });

        // ...resto do processamento de áreas...
        const areas = data.areas || {};
        const totalAreas = calcularTotalAreas(areas);

        return {
          id,
          ...data.vendedorInfo,
          totalVendido,
          totalBonificado,
          totalAreas,
          // Manter os campos individuais de áreas...
          areasEmAcompanhamento: Number(areas.emAcompanhamento) || Number(areas.Acompanhamento) || 0,
          areasAImplantar: Number(areas.aImplantar) || 0,
          areasFinalizados: Number(areas.finalizados) || 0
        };
      });

      // Nova lógica de ordenação com múltiplos critérios
      vendedoresList = vendedoresList
        .sort((a, b) => {
          // Primeiro critério: total de áreas (decrescente)
          if (b.totalAreas !== a.totalAreas) {
            return b.totalAreas - a.totalAreas;
          }
          
          // Segundo critério: valor vendido (decrescente)
          if (b.totalVendido !== a.totalVendido) {
            return b.totalVendido - a.totalVendido;
          }
          
          // Terceiro critério: valor bonificado (decrescente)
          return b.totalBonificado - a.totalBonificado;
        })
        .map((vendedor, index) => ({
          ...vendedor,
          ranking: index + 1
        }));

      // Log da lista final processada
      console.log('Lista final de vendedores processada:', 
        vendedoresList.map(v => ({
          id: v.id,
          nome: v.nome,
          totalVendido: v.totalVendido,
          totalBonificado: v.totalBonificado,
          totalAreas: v.totalAreas
        }))
      );
      
      setVendedores(vendedoresList);
      
      const novoTotalVendas = vendedoresList.reduce((acc, v) => acc + v.totalVendido + v.totalBonificado, 0);
      console.log('Novo total geral de vendas:', novoTotalVendas);
      setTotalVendas(novoTotalVendas);
      
      const novoTotalAreas = vendedoresList.reduce((acc, v) => acc + v.totalAreas, 0);
      console.log('Novo total de áreas:', novoTotalAreas);
      setTotalAreas(novoTotalAreas);
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
                <td className="py-2 px-4 text-center font-bold">
                  {vendedor.ranking}º
                </td>
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