import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import SignUp from './components/SignUp/SignUp';
import Modal from './components/Modal/Modal';
import VendedorForm from './components/VendedorForm/VendedorForm';
import AreaForm from './components/AreaForm/AreaForm';
import ProdutoForm from './components/ProdutoForm/ProdutoForm';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import DashboardContent from './components/DashboardContent/DashboardContent';
import DashboardGeral from './components/DashboardGeral/DashboardGeral';

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

  // Navigation
  const navigate = useNavigate();
  
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
    dataAtualizacao: ""
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
    if (!value && value !== 0) return 'R$ 0,00';
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }, []);

  const formatPercent = useCallback((value) => {
    if (!value && value !== 0) return '0,0%';
    return `${Number(value).toFixed(1).replace('.', ',')}%`;
  }, []);

  // Calculated data usando useMemo
  const calculatedData = useMemo(() => {
    const getNumericValue = (value) => {
      if (value === null || value === undefined) return 0;
      const numValue = parseFloat(value);
      return isNaN(numValue) ? 0 : numValue;
    };

    const totalAreas = produtos.reduce((acc, prod) => {
      return acc + getNumericValue(prod.areas);
    }, 0);

    const mediaHectaresArea = getNumericValue(areas.mediaHectaresArea);
    const totalHectares = totalAreas * mediaHectaresArea;
    
    const totalVendido = produtos.reduce((acc, prod) => acc + getNumericValue(prod.valorVendido), 0);
    const totalBonificado = produtos.reduce((acc, prod) => acc + getNumericValue(prod.valorBonificado), 0);
    const totalGeral = totalVendido + totalBonificado;
    
    const valorMedioHectare = totalHectares > 0 ? totalGeral / totalHectares : 0;
    const areaPotencialTotal = getNumericValue(areas.areaPotencialTotal);
    const potencialVendasTotal = areaPotencialTotal * valorMedioHectare;

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
// Fetch user data function
  const fetchUserData = useCallback(async (uid) => {
    try {
      setLoading(true);
      const userRef = ref(db, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        setVendedorInfo(data.vendedorInfo || {});
        setAreas(data.areas || {});
        setProdutos(data.produtos || []);
        setImages(data.images || {});
        showToast('Dados carregados com sucesso', 'success');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showToast('Erro ao carregar dados do usuário', 'error');
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Data management functions
  const saveData = useCallback(async () => {
    if (!user) {
      showToast('Usuário não autenticado', 'error');
      return;
    }
    
    try {
      setLoading(true);
      const userRef = ref(db, `users/${user.uid}`);
      await set(userRef, {
        vendedorInfo,
        areas,
        produtos,
        images,
        role: user.role,
        lastUpdate: new Date().toISOString()
      });
      showToast('Dados salvos com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setError(error.message);
      showToast('Erro ao salvar dados', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, vendedorInfo, areas, produtos, images, showToast]);
// Authentication functions
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = ref(db, `users/${userCredential.user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUser({ 
          ...userCredential.user, 
          role: userData.role || 'user'
        });
      } else {
        setUser({ 
          ...userCredential.user, 
          role: 'user'
        });
      }
      
      showToast('Login realizado com sucesso', 'success');
      navigate('/dashboard');
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
      setUser(null);
      setVendedorInfo({
        nome: "",
        regional: "",
        businessUnit: "",
        dataAtualizacao: ""
      });
      setProdutos([]);
      setAreas({
        emAcompanhamento: 0,
        aImplantar: 0,
        mediaHectaresArea: 0,
        areaPotencialTotal: 0
      });
      navigate('/');
      showToast('Logout realizado com sucesso', 'success');
    } catch (error) {
      showToast('Erro ao fazer logout', 'error');
      console.error('Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  };
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
      setLoading(true);
      setVendedorInfo({
        ...data,
        dataAtualizacao: new Date().toLocaleString('pt-BR')
      });
      await saveData();
      setEditingSection(null);
      showToast('Informações do vendedor atualizadas', 'success');
    } catch (error) {
      console.error('Erro ao atualizar vendedor:', error);
      showToast('Erro ao atualizar informações', 'error');
    } finally {
      setLoading(false);
    }
  }, [saveData, showToast]);

  const handleAreasUpdate = useCallback(async (data) => {
    try {
      setLoading(true);
      // Converte todos os valores para número e garante que sejam valores válidos
      const formattedData = {
        ...data,
        mediaHectaresArea: Number(data.mediaHectaresArea) || 0,
        areaPotencialTotal: Number(data.areaPotencialTotal) || 0,
        emAcompanhamento: Number(data.emAcompanhamento) || 0,
        aImplantar: Number(data.aImplantar) || 0
      };
      
      setAreas(formattedData);
      await saveData();
      setEditingSection(null);
      showToast('Áreas atualizadas', 'success');
    } catch (error) {
      console.error('Erro ao atualizar áreas:', error);
      showToast('Erro ao atualizar áreas', 'error');
    } finally {
      setLoading(false);
    }
  }, [saveData, showToast]);

  const handleProdutoUpdate = useCallback(async (data, index) => {
    try {
      setLoading(true);
      const formattedData = {
        ...data,
        valorVendido: Number(data.valorVendido) || 0,
        valorBonificado: Number(data.valorBonificado) || 0,
        areas: Number(data.areas) || 0
      };
      
      const newProdutos = [...produtos];
      newProdutos[index] = formattedData;
      setProdutos(newProdutos);
      await saveData();
      setEditingItem(null);
      showToast('Produto atualizado', 'success');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      showToast('Erro ao atualizar produto', 'error');
    } finally {
      setLoading(false);
    }
  }, [produtos, saveData, showToast]);

  const handleProdutoRemove = useCallback(async (index) => {
    try {
      setLoading(true);
      const newProdutos = produtos.filter((_, idx) => idx !== index);
      setProdutos(newProdutos);
      await saveData();
      setEditingItem(null);
      showToast('Produto removido', 'success');
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      showToast('Erro ao remover produto', 'error');
    } finally {
      setLoading(false);
    }
  }, [produtos, saveData, showToast]);

  const addProduto = useCallback(() => {
    const newProduto = {
      nome: "Novo Produto",
      cliente: "",
      valorVendido: 0,
      valorBonificado: 0,
      areas: 0,
    };
    setProdutos(prev => [...prev, newProduto]);
    setEditingItem(produtos.length);
    showToast('Novo produto adicionado', 'info');
  }, [produtos.length, showToast]);

  const handleImageUpload = useCallback((area) => {
    return async (imageData) => {
      if (!imageData) {
        showToast('Nenhuma imagem selecionada', 'error');
        return;
      }

      try {
        setLoading(true);
        // Verificar se a área é válida
        if (!['area1', 'area2', 'area3', 'area4'].includes(area)) {
          throw new Error('Área inválida');
        }

        // Atualizar imagem
        setImages(prev => ({ ...prev, [area]: imageData }));
        await saveData();
        showToast('Imagem atualizada com sucesso', 'success');
      } catch (error) {
        console.error('Erro no upload da imagem:', error);
        showToast('Erro ao fazer upload da imagem', 'error');
      } finally {
        setLoading(false);
      }
    };
  }, [saveData, showToast]);
// Export functions
  const exportToExcel = useCallback(async () => {
    if (!produtos.length) {
      showToast('Não há dados para exportar', 'warning');
      return;
    }

    try {
      setLoading(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Produtos');
    
      // Add headers with formatting
      worksheet.addRow(['Produto', 'Cliente', 'Valor Vendido', 'Valor Bonificado', 'Áreas', 'Total']);
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      
      // Add data rows
      produtos.forEach(produto => {
        worksheet.addRow([
          produto.nome,
          produto.cliente || '',
          produto.valorVendido || 0,
          produto.valorBonificado || 0,
          produto.areas || 0,
          (produto.valorVendido || 0) + (produto.valorBonificado || 0)
        ]);
      });
    
      // Format currency columns
      worksheet.getColumn(3).numFmt = '"R$"#,##0.00';
      worksheet.getColumn(4).numFmt = '"R$"#,##0.00';
      worksheet.getColumn(6).numFmt = '"R$"#,##0.00';
    
      // Auto-adjust column widths
      worksheet.columns.forEach(column => {
        column.width = Math.max(12, ...worksheet.getColumn(column.number).values.map(v => String(v).length));
      });

      // Add totals row
      const lastRow = worksheet.rowCount + 1;
      worksheet.addRow([
        'TOTAL',
        '',
        `=SUM(C2:C${lastRow-1})`,
        `=SUM(D2:D${lastRow-1})`,
        `=SUM(E2:E${lastRow-1})`,
        `=SUM(F2:F${lastRow-1})`
      ]);
      worksheet.getRow(lastRow).font = { bold: true };
    
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(blob, `relatorio_${vendedorInfo.nome || 'vendedor'}_${new Date().toISOString()}.xlsx`);
      showToast('Relatório Excel exportado com sucesso', 'success');
    } catch (error) {
      console.error('Erro na exportação:', error);
      showToast('Erro ao exportar Excel', 'error');
    } finally {
      setLoading(false);
    }
  }, [produtos, vendedorInfo.nome, showToast]);

  const exportToPDF = useCallback(async () => {
    try {
      setIsExporting(true);
      setLoading(true);
      
      // Wait for state updates to reflect in the DOM
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const input = document.getElementById('dashboard');
      if (!input) {
        throw new Error('Elemento do dashboard não encontrado');
      }
      
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        onclone: (clonedDoc) => {
          // Remove elementos de controle no clone do documento
          const elementsToHide = clonedDoc.getElementsByClassName('hide-on-print');
          Array.from(elementsToHide).forEach(element => {
            element.style.display = 'none';
          });
          
          // Esconde todos os botões
          const buttons = clonedDoc.getElementsByTagName('button');
          Array.from(buttons).forEach(button => {
            button.style.display = 'none';
          });
          
          // Esconde última coluna da tabela (ações)
          const tableCells = clonedDoc.querySelectorAll('table th:last-child, table td:last-child');
          Array.from(tableCells).forEach(cell => {
            cell.style.display = 'none';
          });
        }
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
      pdf.save(`dashboard_${vendedorInfo.nome || 'vendedor'}_${new Date().toISOString()}.pdf`);
      
      showToast('PDF exportado com sucesso', 'success');
    } catch (error) {
      console.error('Erro na exportação:', error);
      showToast('Erro ao exportar PDF', 'error');
    } finally {
      setIsExporting(false);
      setLoading(false);
    }
  }, [vendedorInfo.nome, showToast]);
// Effect para autenticação
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userRef = ref(db, `users/${currentUser.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setUser({ ...currentUser, role: userData.role || 'user' });
            await fetchUserData(currentUser.uid);
          } else {
            setUser({ ...currentUser, role: 'user' });
          }
        } else {
          setUser(null);
          // Limpa os dados quando o usuário faz logout
          setVendedorInfo({
            nome: "",
            regional: "",
            businessUnit: "",
            dataAtualizacao: ""
          });
          setAreas({
            emAcompanhamento: 0,
            aImplantar: 0,
            mediaHectaresArea: 0,
            areaPotencialTotal: 0
          });
          setProdutos([]);
          setImages({
            area1: null,
            area2: null,
            area3: null,
            area4: null
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        showToast('Erro ao carregar dados do usuário', 'error');
        setError('Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchUserData, showToast]);

  // Render
  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-gray-100 p-4 ${isExporting ? 'exporting' : ''}`}>
        {loading && <LoadingSpinner />}
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
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
              )
            }
          />

          <Route 
            path="/dashboard" 
            element={
              !user ? (
                <Navigate to="/" replace />
              ) : (
                <DashboardContent 
                  user={user}
                  vendedorInfo={vendedorInfo}
                  areas={areas}
                  produtos={produtos}
                  images={images}
                  loading={loading}
                  isExporting={isExporting}
                  calculatedData={calculatedData}
                  handleLogout={handleLogout}
                  handleEditStart={handleEditStart}
                  handleImageUpload={handleImageUpload}
                  exportToExcel={exportToExcel}
                  exportToPDF={exportToPDF}
                  addProduto={addProduto}
                  formatMoney={formatMoney}
                  formatPercent={formatPercent}
                  showToast={showToast}
                />
              )
            }
          />

          <Route
            path="/dashboard-geral"
            element={
              !user || user.role !== 'admin' ? (
                <Navigate to="/" replace />
              ) : (
                <DashboardGeral />
              )
            }
          />
        </Routes>

        {/* Modais */}
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

        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;