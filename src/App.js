import React, { useState, useEffect, useCallback, useMemo } from "react";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import SignUp from './components/SignUp/SignUp';
import Modal from './components/Modal/Modal';
import ImageUploader from './components/ImageUploader/ImageUploader';
import VendedorForm from './components/VendedorForm/VendedorForm';
import AreaForm from './components/AreaForm/AreaForm';
import AreasCard from './components/AreasCard/AreasCard';
import ProdutoForm from './components/ProdutoForm/ProdutoForm';
import MetricasCard from './components/MetricasCard/MetricasCard';
import ProdutosTable from './components/ProdutosTable/ProdutosTable';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import './styles/print.css';

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyA9kxKwLEdgRUwZNuR7yu7_j_4MUjTrCfg",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "status-gd.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://status-gd-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "status-gd",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "status-gd.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "956818896523",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:956818896523:web:81509b052009fddb22468e",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-ZS16WZWMPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function App() {
  // Authentication states
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  // Data states
  const [images, setImages] = useState({
    area1: null,
    area2: null,
    area3: null,
    area4: null
  });
  const [vendedorInfo, setVendedorInfo] = useState({
    nome: "",
    regional: "",
    businessUnit: "",
    dataAtualizacao: "",
  });
  const [areas, setAreas] = useState({
    emAcompanhamento: 0,
    aImplantar: 0,
    mediaHectaresArea: 0,
    areaPotencialTotal: 0
  });
  const [produtos, setProdutos] = useState([]);

  // Utility functions
  const showToast = useCallback((message, type = 'info') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const formatMoney = useCallback((value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }, []);

  const formatPercent = useCallback((value) => {
    return `${value?.toFixed(1) || 0}%`;
  }, []);
  const calculatedData = useMemo(() => {
    console.log('Produtos:', produtos);
    console.log('Areas:', areas);
  
    const getNumericValue = (value) => {
      const numValue = parseFloat(value);
      return isNaN(numValue) ? 0 : numValue;
    };
  
    const totalAreas = produtos.reduce((acc, prod) => {
      console.log('Área do produto:', prod.areas);
      return acc + getNumericValue(prod.areas);
    }, 0);
  
    const mediaHectaresArea = getNumericValue(areas.mediaHectaresArea);
    const totalHectares = totalAreas * mediaHectaresArea;
    
    console.log('Total áreas:', totalAreas);
    console.log('Media hectares por área:', mediaHectaresArea);
    console.log('Total hectares calculado:', totalHectares);
  
    const totalVendido = produtos.reduce((acc, prod) => acc + getNumericValue(prod.valorVendido), 0);
    const totalBonificado = produtos.reduce((acc, prod) => acc + getNumericValue(prod.valorBonificado), 0);
    const totalGeral = totalVendido + totalBonificado;
    
    const valorMedioHectare = totalHectares > 0 ? totalGeral / totalHectares : 0;
    const areaPotencialTotal = getNumericValue(areas.areaPotencialTotal);
    const potencialVendasTotal = areaPotencialTotal * valorMedioHectare;
  
    console.log('Valores calculados:', {
      totalAreas,
      mediaHectaresArea,
      totalHectares,
      totalVendido,
      totalBonificado,
      totalGeral,
      valorMedioHectare,
      areaPotencialTotal,
      potencialVendasTotal
    });
  
    return {
      totalHectares,
      mediaHectaresArea,
      valorMedioHectare,
      potencialVendasTotal,
      totalVendido,
      totalBonificado,
      totalGeral,
      areaPotencialTotal
    };
  }, [produtos, areas]);

  // Data management
  const saveData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        vendedorInfo,
        areas,
        produtos,
        images
      });
      showToast('Dados salvos com sucesso', 'success');
    } catch (error) {
      setError(error.message);
      showToast('Erro ao salvar dados', 'error');
      console.error('Erro ao salvar:', error);
    } finally {
      setLoading(false);
    }
  }, [user, vendedorInfo, areas, produtos, images, showToast]);

  const fetchUserData = useCallback(async (uid) => {
    try {
      setLoading(true);
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Dados do Firebase:', data);
        setVendedorInfo(data.vendedorInfo || {});
        setAreas(data.areas || {});
        setProdutos(data.produtos || []);
        setImages(data.images || {});
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  // Export functions
  const exportToExcel = useCallback(async () => {
    try {
      setLoading(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Produtos');
    
      worksheet.addRow(['Produto', 'Valor Vendido', 'Valor Bonificado', 'Áreas', 'Total']);
      worksheet.getRow(1).font = { bold: true };
      
      produtos.forEach(produto => {
        worksheet.addRow([
          produto.nome,
          produto.valorVendido || 0,
          produto.valorBonificado || 0,
          produto.areas || 0,
          (produto.valorVendido || 0) + (produto.valorBonificado || 0)
        ]);
      });
    
      worksheet.getColumn(2).numFmt = '"R$"#,##0.00';
      worksheet.getColumn(3).numFmt = '"R$"#,##0.00';
      worksheet.getColumn(5).numFmt = '"R$"#,##0.00';
    
      worksheet.columns.forEach(column => {
        column.width = Math.max(12, ...worksheet.getColumn(column.number).values.map(v => String(v).length));
      });
    
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `relatorio_${vendedorInfo.nome}_${new Date().toISOString()}.xlsx`);
      showToast('Relatório Excel exportado com sucesso', 'success');
    } catch (error) {
      showToast('Erro ao exportar Excel', 'error');
      console.error('Erro na exportação:', error);
    } finally {
      setLoading(false);
    }
  }, [produtos, vendedorInfo.nome, showToast]);

  const exportToPDF = useCallback(async () => {
    try {
      setIsExporting(true);
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const input = document.getElementById('dashboard');
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
    
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`dashboard_${vendedorInfo.nome}_${new Date().toISOString()}.pdf`);
      showToast('PDF exportado com sucesso', 'success');
    } catch (error) {
      showToast('Erro ao exportar PDF', 'error');
      console.error('Erro na exportação:', error);
    } finally {
      setIsExporting(false);
      setLoading(false);
    }
  }, [vendedorInfo.nome, showToast]);

  // Event handlers
  const handleEditStart = useCallback((type, data) => {
    if (type === "produto") {
      setEditingItem(data.index);
    } else {
      setEditingSection(type);
    }
  }, []);

  const handleEditCancel = useCallback(() => {
    setEditingItem(null);
    setEditingSection(null);
  }, []);

  const handleVendedorUpdate = useCallback(async (data) => {
    try {
      setVendedorInfo({
        ...data,
        dataAtualizacao: new Date().toLocaleString()
      });
      await saveData();
      setEditingSection(null);
      showToast('Informações do vendedor atualizadas', 'success');
    } catch (error) {
      showToast('Erro ao atualizar informações', 'error');
    }
  }, [saveData, showToast]);
  const handleAreasUpdate = useCallback(async (data) => {
    try {
      console.log('Dados sendo salvos:', data);
      const formattedData = {
        ...data,
        mediaHectaresArea: Number(data.mediaHectaresArea),
        areaPotencialTotal: Number(data.areaPotencialTotal)
      };
      setAreas(formattedData);
      await saveData();
      setEditingSection(null);
      showToast('Áreas atualizadas', 'success');
    } catch (error) {
      showToast('Erro ao atualizar áreas', 'error');
    }
  }, [saveData, showToast]);

  const handleProdutoUpdate = useCallback(async (data, index) => {
    try {
      const newProdutos = [...produtos];
      newProdutos[index] = data;
      setProdutos(newProdutos);
      await saveData();
      setEditingItem(null);
      showToast('Produto atualizado', 'success');
    } catch (error) {
      showToast('Erro ao atualizar produto', 'error');
    }
  }, [produtos, saveData, showToast]);

  const handleProdutoRemove = useCallback(async (index) => {
    try {
      setProdutos(produtos.filter((_, idx) => idx !== index));
      await saveData();
      setEditingItem(null);
      showToast('Produto removido', 'success');
    } catch (error) {
      showToast('Erro ao remover produto', 'error');
    }
  }, [produtos, saveData, showToast]);

  const addProduto = useCallback(() => {
    const newProduto = {
      nome: "Novo Produto",
      valorVendido: 0,
      valorBonificado: 0,
      areas: 0,
    };
    setProdutos(prev => [...prev, newProduto]);
    setEditingItem(produtos.length);
    showToast('Novo produto adicionado', 'info');
  }, [produtos.length, showToast]);

  const handleImageUpload = useCallback((area) => {
    return (imageData) => {
      try {
        setLoading(true);
        setImages(prev => ({ ...prev, [area]: imageData }));
        saveData();
        showToast('Imagem atualizada com sucesso', 'success');
      } catch (error) {
        showToast('Erro ao fazer upload da imagem', 'error');
        console.error('Erro no upload:', error);
      } finally {
        setLoading(false);
      }
    };
  }, [saveData, showToast]);

  // Authentication functions
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Login realizado com sucesso', 'success');
    } catch (error) {
      const errorMessage = 
        error.code === 'auth/wrong-password' ? 'Senha incorreta' :
        error.code === 'auth/user-not-found' ? 'Usuário não encontrado' :
        error.code === 'auth/invalid-email' ? 'Email inválido' :
        'Erro ao fazer login';
      
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      showToast('Logout realizado com sucesso', 'success');
    } catch (error) {
      showToast('Erro ao fazer logout', 'error');
      console.error('Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log('Usuário logado:', currentUser.email);
        fetchUserData(currentUser.uid);
      } else {
        console.log('Nenhum usuário logado');
      }
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {isSignUp ? (
          <SignUp onToggleForm={() => setIsSignUp(false)} />
        ) : (
          <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-md w-96">
            <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
            {error && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={loading}
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={loading}
                required
              />
              <button
                type="submit"
                className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="w-full p-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Criar nova conta
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-gray-100 p-4 ${isExporting ? 'exporting' : ''}`}>
        <div id="dashboard" className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
          <header className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{vendedorInfo.nome || 'Dashboard'}</h1>
                <p className="text-gray-600">
                  {vendedorInfo.regional} - {vendedorInfo.businessUnit}
                </p>
                <p className="text-sm text-gray-500">
                  Última atualização: {vendedorInfo.dataAtualizacao}
                </p>
              </div>
              <div className="space-x-4 hide-on-print">
                <button
                  onClick={exportToExcel}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hide-on-print"
                  disabled={loading || isExporting}
                >
                  Exportar Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hide-on-print"
                  disabled={loading || isExporting}
                >
                  Exportar PDF
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 hide-on-print"
                  disabled={loading}
                >
                  Sair
                </button>
              </div>
            </div>
          </header>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Informações do Vendedor</h2>
                <button
                  onClick={() => handleEditStart('vendedor')}
                  className="text-blue-500 hover:text-blue-600 no-print"
                  disabled={loading}
                >
                  Editar
                </button>
              </div>
              <div className="space-y-2">
                <p><strong>Nome:</strong> {vendedorInfo.nome}</p>
                <p><strong>Regional:</strong> {vendedorInfo.regional}</p>
                <p><strong>Business Unit:</strong> {vendedorInfo.businessUnit}</p>
              </div>
            </div>

            <AreasCard 
              data={areas}
              formatPercent={formatPercent}
              onEdit={() => handleEditStart('areas')}
            />

<div className="border rounded-lg p-4">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold">Imagens</h2>
  </div>
  <div className="grid grid-cols-2 gap-4">
    <ImageUploader
      initialImage={images.area1}
      onUpload={handleImageUpload('area1')}
      label="Área 1"
      disabled={loading}
    />
    <ImageUploader
      initialImage={images.area2}
      onUpload={handleImageUpload('area2')}
      label="Área 2"
      disabled={loading}
    />
    <ImageUploader
      initialImage={images.area3}
      onUpload={handleImageUpload('area3')}
      label="Área 3"
      disabled={loading}
    />
    <ImageUploader
      initialImage={images.area4}
      onUpload={handleImageUpload('area4')}
      label="Área 4"
      disabled={loading}
    />
  </div>
</div>

            <MetricasCard 
              data={calculatedData}
              formatMoney={formatMoney}
              formatPercent={formatPercent}
            />
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Produtos</h2>
              <button
                onClick={addProduto}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 no-print"
                disabled={loading}
              >
                Adicionar Produto
              </button>
            </div>
            <ProdutosTable
              produtos={produtos}
              onEdit={handleEditStart}
              formatMoney={formatMoney}
              disabled={loading}
            />
          </div>
        </div>

        {editingSection === 'vendedor' && (
          <Modal onClose={handleEditCancel}>
            <VendedorForm
              initialData={vendedorInfo}
              onSubmit={handleVendedorUpdate}
              onCancel={handleEditCancel}
              isLoading={loading}
            />
          </Modal>
        )}

        {editingSection === 'areas' && (
          <Modal onClose={handleEditCancel}>
            <AreaForm
              initialData={areas}
              onSubmit={handleAreasUpdate}
              onCancel={handleEditCancel}
              isLoading={loading}
            />
          </Modal>
        )}

        {editingItem !== null && (
          <Modal onClose={handleEditCancel}>
            <ProdutoForm
              initialData={produtos[editingItem]}
              onSubmit={(data) => handleProdutoUpdate(data, editingItem)}
              onCancel={handleEditCancel}
              onDelete={() => handleProdutoRemove(editingItem)}
              isLoading={loading}
            />
          </Modal>
        )}

        {loading && <LoadingSpinner />}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;