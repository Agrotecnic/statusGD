import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import SignUp from './components/SignUp/SignUp';
import VendedorForm from './components/VendedorForm/VendedorForm';
import AreaForm from './components/AreaForm/AreaForm';
import ProdutoForm from './components/ProdutoForm/ProdutoForm';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import DashboardContent from './components/DashboardContent/DashboardContent';
import DashboardGeral from './components/DashboardGeral/DashboardGeral';
import PasswordResetForm from './components/PasswordResetForm/PasswordResetForm'; // Componente de Reset de Senha
import Modal from './components/Modal/Modal'; // Componente Modal
import './styles/print.css';

// Remover importações do Firebase
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
// Importar auth e db da configuração centralizada
import { auth, db } from './config/firebase';
import { WhatsApp } from "@material-ui/icons";
import saveData from '../src/api/produtos'; // Importe a função saveData


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
  const [isPasswordResetOpen, setPasswordResetOpen] = useState(false); // Modal de redefinição de senha
  const openPasswordResetModal = () => setPasswordResetOpen(true);  // Abre o modal
  const closePasswordResetModal = () => setPasswordResetOpen(false); // Fecha o modal

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
    dataAtualizacao: "",
    WhatsApp: "" // Adicionando o campo WhatsApp
  });

  const [areas, setAreas] = useState({
    emAcompanhamento: 0,
    aImplantar: 0,
    finalizados: 0,  // Adicionando este campo
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

    // console.log('CalculatedData - Estado das Áreas:', areas);

    // Calcula o total de áreas somando todas as categorias
    const totalAreas =
      getNumericValue(areas.emAcompanhamento) +
      getNumericValue(areas.aImplantar) +
      getNumericValue(areas.finalizados);

    // console.log('CalculatedData - Total de Áreas:', {
    //   emAcompanhamento: getNumericValue(areas.emAcompanhamento),
    //   aImplantar: getNumericValue(areas.aImplantar),
    //   finalizados: getNumericValue(areas.finalizados),
    //   totalAreas
    // });

    const mediaHectaresArea = getNumericValue(areas.mediaHectaresArea);
    const totalHectares = totalAreas * mediaHectaresArea;

    // console.log('CalculatedData - Cálculo de Hectares:', {
    //   totalAreas,
    //   mediaHectaresArea,
    //   totalHectares
    // });

    // Cálculos financeiros
    const totalVendido = produtos.reduce((acc, prod) => {
      const valorVendido = getNumericValue(prod.valorVendido);
      // console.log('Valor vendido produto:', valorVendido);
      return acc + valorVendido;
    }, 0);

    const totalBonificado = produtos.reduce((acc, prod) => {
      const valorBonificado = getNumericValue(prod.valorBonificado);
      // console.log('Valor bonificado produto:', valorBonificado);
      return acc + valorBonificado;
    }, 0);

    const totalGeral = totalVendido + totalBonificado;

    // console.log('CalculatedData - Valores Financeiros:', {
    //   totalVendido,
    //   totalBonificado,
    //   totalGeral
    // });

    // Cálculo do valor médio por hectare e potencial
    const valorMedioHectare = totalHectares > 0 ? totalGeral / totalHectares : 0;
    const areaPotencialTotal = getNumericValue(areas.areaPotencialTotal);
    const potencialVendasTotal = areaPotencialTotal * valorMedioHectare;

    // console.log('CalculatedData - Métricas Finais:', {
    //   valorMedioHectare,
    //   areaPotencialTotal,
    //   potencialVendasTotal
    // });

    const resultados = {
      totalAreas,
      totalHectares,
      mediaHectaresArea,
      valorMedioHectare,
      potencialVendasTotal,
      totalVendido,
      totalBonificado,
      totalGeral,
      areaPotencialTotal,
      areasDistribuicao: {
        emAcompanhamento: getNumericValue(areas.emAcompanhamento),
        aImplantar: getNumericValue(areas.aImplantar),
        finalizados: getNumericValue(areas.finalizados)
      }
    };

    // console.log('CalculatedData - Resultado Final:', resultados);

    return resultados;
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

        // Garante que todos os campos necessários existam
        const areasData = data.areas || {};
        setAreas({
          emAcompanhamento: Number(areasData.emAcompanhamento || 0),
          aImplantar: Number(areasData.aImplantar || 0),
          finalizados: Number(areasData.finalizados || 0), // Adiciona campo finalizados
          mediaHectaresArea: Number(areasData.mediaHectaresArea || 0),
          areaPotencialTotal: Number(areasData.areaPotencialTotal || 0)
        });

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
      // Autenticação do usuário
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
      let errorMessage = 'Erro ao fazer login';

      // Tratamento de erro específico baseado no código
      switch (error.code) {
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        default:
          console.log('Erro no login:', error);
          console.log('Código do erro:', error.code);
          console.log('Mensagem do erro:', error.message);
          console.log(auth.currentUser);
          console.log(user);
          console.log(email);
          console.log(password);
          errorMessage = 'Erro desconhecido';
          break;
      }

      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false); // Finaliza o carregamento
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
      const updatedData = {
        ...data,
        dataAtualizacao: new Date().toLocaleString('pt-BR')
      };
      setVendedorInfo(updatedData);
      await saveData(updatedData); // Certifique-se de passar os dados atualizados para saveData
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
      const formattedData = {
        ...data,
        mediaHectaresArea: Number(data.mediaHectaresArea) || 0,
        areaPotencialTotal: Number(data.areaPotencialTotal) || 0,
        emAcompanhamento: Number(data.emAcompanhamento) || 0,
        aImplantar: Number(data.aImplantar) || 0,
        finalizados: Number(data.finalizados) || 0  // Mantendo a versão mais recente
      };
  
      // console.log('Atualizando áreas:', formattedData);
  
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

      // Adiciona console.log para exibir o retorno do await saveData()
      const saveResult = await saveData(formattedData);
      console.log('Resultado do saveData:', saveResult);

      setEditingItem(null);
      showToast('Produto atualizado', 'success');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      showToast('Erro ao atualizar produto', 'error');
    } finally {
      setLoading(false);
    }
  }, [produtos, saveData, showToast]);

  const handleProdutoUpdateLocal = useCallback((data, index) => {
    setProdutos((prevProdutos) => {
      const newProdutos = [...prevProdutos];
      newProdutos[index] = data;
      console.log('Produtos atualizados localmente:', newProdutos);
      return newProdutos;
    });
  }, []);


  const handleProdutoRemove = useCallback(async (produtoId) => {
    try {
      setLoading(true);
      const newProdutos = produtos.filter((produto) => produto.id !== produtoId);
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
      nome: "",
      cliente: "",
      valorVendido: 0,
      valorBonificado: 0,
      areas: 0,
    };
    console.log('Adicionando novo produto:', newProduto);
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
        `=SUM(C2:C${lastRow - 1})`,
        `=SUM(D2:D${lastRow - 1})`,
        `=SUM(E2:E${lastRow - 1})`,
        `=SUM(F2:F${lastRow - 1})`
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

      // Aguarda a atualização do DOM
      await new Promise(resolve => setTimeout(resolve, 100));

      const input = document.getElementById('dashboard');
      if (!input) {
        throw new Error('Elemento do dashboard não encontrado');
      }

      // Adicionar classe para forçar o layout de PC
      input.classList.add('pc-layout');

      const scale = 2; // Ajuste a escala conforme necessário

      const canvas = await html2canvas(input, {
        scale: scale,
        useCORS: true,
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

      // Remover a classe após a captura
      input.classList.remove('pc-layout');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // Largura A4
      const pdfHeight = pdf.internal.pageSize.getHeight(); // Altura A4
      const margin = 0; // Margem de 10 mm em cada lado

      const contentWidth = pdfWidth - margin * 2; // Largura disponível
      const contentHeight = pdfHeight - margin * 2; // Altura disponível
      const imgWidth = canvas.width / scale;
      const imgHeight = canvas.height / scale;

      // Garantir que a imagem seja escalada corretamente para o formato A4
      const ratio = Math.min(contentWidth / imgWidth, contentHeight / imgHeight);

      // Calculando a posição para alinhar ao topo
      const imgX = margin + (contentWidth - imgWidth * ratio) / 2; // Centralizado horizontalmente
      const imgY = margin; // Alinhado ao topo

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
      <div className={`min-h-screen  p-4 ${isExporting ? 'exporting' : ''}`}style={{ backgroundColor: '#e1e1e1' }}>
        {loading && <LoadingSpinner />}
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" />
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
                        <button
                          type="button"
                          onClick={openPasswordResetModal}
                          className="w-full p-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Esqueci a senha
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
                <Navigate to="/" />
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
                  onDelete={handleProdutoRemove}
                  handleProdutoUpdate={handleProdutoUpdate} // Passando a função handleProdutoUpdate
                  handleProdutoUpdateLocal={handleProdutoUpdateLocal} // Passando a função 
                />
              )
            }
          />

          <Route
            path="/dashboard-geral"
            element={
              !user ? <Navigate to="/" /> : <DashboardGeral />
            }
          />

          {/* Adicionar rota 404 */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
                <p className="mb-4">A página que você está procurando não existe.</p>
                <Link to="/" className="text-blue-500 hover:text-blue-600">
                  Voltar para a página inicial
                </Link>
              </div>
            </div>
          } />
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

        {isPasswordResetOpen && (
          <Modal isOpen={isPasswordResetOpen} onClose={closePasswordResetModal}>
            <PasswordResetForm onClose={closePasswordResetModal} />
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