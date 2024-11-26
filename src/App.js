import React, { useState, useEffect, useCallback } from "react";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import netlifyIdentity from 'netlify-identity-widget';
import ImageUploader from './components/ImageUploader';
import Modal from './components/Modal';
import VendedorForm from './components/VendedorForm';
import AreaForm from './components/AreaForm';
import ProdutoForm from './components/ProdutoForm';
import './styles/print.css';


netlifyIdentity.init();

// Estilos comuns
const styles = {
  button: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "8px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  card: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "16px",
  },
  photoContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
    gridColumn: "span 2",
  },
  photoBox: {
    backgroundColor: "#f3f4f6",
    padding: "16px",
    borderRadius: "8px",
    textAlign: "center",
    minHeight: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed #d1d5db",
  },
};

export default function App() {
  // Estados
  const [isExporting, setIsExporting] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  // Estado das imagens
  const [images, setImages] = useState(() => {
    const savedImages = localStorage.getItem('dashboardImages');
    return savedImages ? JSON.parse(savedImages) : {
      area1: null,
      area2: null
    };
  });

  // Estado do vendedor
  const [vendedorInfo, setVendedorInfo] = useState(() => {
    const savedInfo = localStorage.getItem('vendedorInfo');
    return savedInfo ? JSON.parse(savedInfo) : {
      nome: "João Silva",
      regional: "Centro-Oeste",
      businessUnit: "Especialidades",
      dataAtualizacao: "Novembro 2024",
    };
  });

  // Estado das áreas
  const [areas, setAreas] = useState(() => {
    const savedAreas = localStorage.getItem('areas');
    return savedAreas ? JSON.parse(savedAreas) : {
      emAcompanhamento: 5,
      aImplantar: 10,
      hectaresPorArea: 30,
    };
  });

  // Estado dos produtos
  const [produtos, setProdutos] = useState(() => {
    const savedProdutos = localStorage.getItem('produtos');
    return savedProdutos ? JSON.parse(savedProdutos) : [
      {
        nome: "Nutrifull",
        valorVendido: 24430.0,
        valorBonificado: 24430.0,
        areas: 2,
      },
      {
        nome: "DimiLOM",
        valorVendido: 10000.0,
        valorBonificado: 10000.0,
        areas: 2,
      },
      {
        nome: "Dimitônico Full",
        valorVendido: 16347.0,
        valorBonificado: 0,
        areas: 1,
      },
      {
        nome: "TMSP Power",
        valorVendido: 0,
        valorBonificado: 18030.0,
        areas: 1
      },
      {
        nome: "DimiForm Plus + K400 Full",
        valorVendido: 12200.0,
        valorBonificado: 0,
        areas: 1,
      },
    ];
  });
  // Estado para dados calculados
  const [calculatedData, setCalculatedData] = useState({
    totalVendido: 0,
    totalBonificado: 0,
    totalGeral: 0,
    percentualVendido: 0,
    percentualBonificado: 0,
    totalAreas: 0,
    totalHectares: 0,
    valorMedioHectare: 0,
    percentualImplantacao: 0,
    ticketMedio: 0,
    ticketMedioVendido: 0,
    ticketMedioBonificado: 0,
  });

  // Efeitos para localStorage
  useEffect(() => {
    localStorage.setItem('vendedorInfo', JSON.stringify(vendedorInfo));
  }, [vendedorInfo]);

  useEffect(() => {
    localStorage.setItem('areas', JSON.stringify(areas));
  }, [areas]);

  useEffect(() => {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem('dashboardImages', JSON.stringify(images));
  }, [images]);

  // Efeito para recalcular valores
  useEffect(() => {
    const totalVendido = produtos.reduce((acc, prod) => acc + prod.valorVendido, 0);
    const totalBonificado = produtos.reduce((acc, prod) => acc + prod.valorBonificado, 0);
    const totalGeral = totalVendido + totalBonificado;
    const totalAreas = produtos.reduce((acc, prod) => acc + prod.areas, 0);
    const totalHectares = totalAreas * areas.hectaresPorArea;
  
    const produtosVendidos = produtos.filter((p) => p.valorVendido > 0);
    const produtosBonificados = produtos.filter((p) => p.valorBonificado > 0);
  
    setCalculatedData({
      totalVendido,
      totalBonificado,
      totalGeral,
      percentualVendido: totalGeral ? (totalVendido / totalGeral) * 100 : 0,
      percentualBonificado: totalGeral ? (totalBonificado / totalGeral) * 100 : 0,
      totalAreas,
      totalHectares,
      valorMedioHectare: totalHectares ? totalGeral / totalHectares : 0,
      percentualImplantacao: (areas.emAcompanhamento / (areas.emAcompanhamento + areas.aImplantar)) * 100,
      ticketMedio: produtos.length ? totalGeral / produtos.length : 0,
      ticketMedioVendido: produtosVendidos.length ? totalVendido / produtosVendidos.length : 0,
      ticketMedioBonificado: produtosBonificados.length ? totalBonificado / produtosBonificados.length : 0,
    });
  }, [produtos, areas]);

  // Funções utilitárias
  const formatMoney = useCallback((value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }, []);

  const formatPercent = useCallback((value) => {
    return `${value.toFixed(1)}%`;
  }, []);

  // Manipuladores de formulário
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

  // Manipulador de imagens
  const handleImageUpload = useCallback((area) => (imageData) => {
    setImages(prev => ({ ...prev, [area]: imageData }));
  }, []);

  // Função para adicionar produto
  const addProduto = useCallback(() => {
    const newProduto = {
      nome: "Novo Produto",
      valorVendido: 0,
      valorBonificado: 0,
      areas: 0,
    };
    setProdutos((prev) => [...prev, newProduto]);
    setEditingItem(produtos.length);
  }, [produtos.length]);

  // Funções de exportação
  const exportToExcel = useCallback(() => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Produtos');
  
    // Adicionar cabeçalhos
    worksheet.addRow(['Produto', 'Valor Vendido', 'Valor Bonificado', 'Áreas', 'Total']);
  
    // Adicionar dados
    produtos.forEach(produto => {
      worksheet.addRow([
        produto.nome,
        produto.valorVendido,
        produto.valorBonificado,
        produto.areas,
        produto.valorVendido + produto.valorBonificado
      ]);
    });
  
    // Formatar células
    worksheet.getColumn(2).numFmt = '"R$"#,##0.00';
    worksheet.getColumn(3).numFmt = '"R$"#,##0.00';
    worksheet.getColumn(5).numFmt = '"R$"#,##0.00';
  
    // Gerar o arquivo Excel
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(blob, 'produtos.xlsx');
    });
  }, [produtos]);

  const exportToPDF = useCallback(() => {
    setIsExporting(true); // Coloca isso primeiro para esconder botões
  
    // Pequeno delay para garantir que os botões sumiram
    setTimeout(() => {
      const input = document.getElementById('dashboard');
      
      html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      }).then((canvas) => {
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
        pdf.save('dashboard.pdf');
        
        setIsExporting(false);
      });
    }, 100); // 100ms de delay
  }, []);
  // LoginButton component
const LoginButton = () => {
  const handleLogin = () => {
    console.log("Login button clicked");
    setTimeout(() => {
      console.log("Attempting to open Netlify Identity widget");
      netlifyIdentity.open();
    }, 100);
  };
  const handleLogout = () => {
    console.log("Logout button clicked");
    netlifyIdentity.logout();
  };

  return (
    <button 
      onClick={netlifyIdentity.currentUser() ? handleLogout : handleLogin}
      style={{
        backgroundColor: "#4CAF50", // Cor verde, você pode mudar para a cor que preferir
        color: "white",
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        position: 'fixed',
        top: '20px',
        left: '20px', // Mudado para o lado esquerdo
        zIndex: 1000
      }}
    >
      {netlifyIdentity.currentUser() ? 'Log Out' : 'Log In'}
    </button>
  );
};

return (
    <div>
      {!isExporting && <LoginButton />}
      {/* Modais */}
      {editingSection === "info" && (
        <Modal title="Editar Informações" onClose={handleEditCancel}>
          <VendedorForm 
            initialData={vendedorInfo} 
            onSubmit={(data) => {
              setVendedorInfo(data);
              setEditingSection(null);
            }} 
          />
        </Modal>
      )}
      {editingSection === "areas" && (
        <Modal title="Editar Áreas" onClose={handleEditCancel}>
          <AreaForm 
            initialData={areas} 
            onSubmit={(data) => {
              setAreas(data);
              setEditingSection(null);
            }} 
          />
        </Modal>
      )}
      {editingItem !== null && (
        <Modal title="Editar Produto" onClose={handleEditCancel}>
          <ProdutoForm 
            produto={produtos[editingItem]}
            onSubmit={(data) => {
              const newProdutos = [...produtos];
              newProdutos[editingItem] = data;
              setProdutos(newProdutos);
              setEditingItem(null);
            }}
            onRemove={() => {
              setProdutos(produtos.filter((_, idx) => idx !== editingItem));
              setEditingItem(null);
            }}
          />
        </Modal>
      )}

      {/* Dashboard Principal */}
      <div
  id="dashboard"
  className="print-dashboard"
  style={{
    padding: "24px",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    position: "relative", // Adicionado
    width: "100%",       // Adicionado
    margin: "0 auto"     // Adicionado
  }}
>
        {/* Barra de Ações */}
        {!isExporting && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              display: "flex",
              gap: "8px",
              zIndex: 900,
            }}
          >
            <button className="edit-button"onClick={addProduto} style={styles.button}>
              Adicionar Produto
            </button>
            <button
              onClick={() => handleEditStart("areas", areas)}
              style={styles.button}
            >
              Editar Áreas
            </button>
            <button className="edit-button" onClick={exportToExcel} style={styles.button}>
              Exportar para Excel
            </button>
            <button className="edit-button" onClick={exportToPDF} style={styles.button}>
              Exportar para PDF
            </button>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {/* Cabeçalho */}
          <div
            style={{
              marginBottom: "24px",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "16px",
              position: "relative",
            }}
          >
            <button
              onClick={() => handleEditStart("info", vendedorInfo)}
              style={{
                ...styles.button,
                position: "absolute",
                right: "0",
                top: "0",
              }}

            >
              Editar
            </button>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "16px",
                color: "#1f2937",
              }}
            >
              Status Geração de Demanda
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "32px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                  Representante
                </p>
                <p style={{ color: "#1f2937", fontWeight: "600" }}>
                  {vendedorInfo.nome}
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#6b7280", fontSize: "14px" }}>Regional</p>
                <p style={{ color: "#1f2937", fontWeight: "600" }}>
                  {vendedorInfo.regional}
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                  Business Unit
                </p>
                <p style={{ color: "#1f2937", fontWeight: "600" }}>
                  {vendedorInfo.businessUnit}
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                  Atualizado em
                </p>
                <p style={{ color: "#1f2937", fontWeight: "600" }}>
                  {vendedorInfo.dataAtualizacao}
                </p>
              </div>
            </div>
          </div>

          {/* Grid de Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* Card - Status das Áreas */}
            <div style={styles.card}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Status das Áreas
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f0f9ff",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#0369a1",
                    }}
                  >
                    {areas.emAcompanhamento}
                  </p>
                  <p style={{ color: "#1f2937" }}>Em Acompanhamento</p>
                  <p style={{ color: "#64748b", fontSize: "12px" }}>
                    {areas.emAcompanhamento * areas.hectaresPorArea} hectares
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: "#fef9c3",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#ca8a04",
                    }}
                  >
                    {areas.aImplantar}
                  </p>
                  <p style={{ color: "#1f2937" }}>A Implantar</p>
                  <p style={{ color: "#64748b", fontSize: "12px" }}>
                    {areas.aImplantar * areas.hectaresPorArea} hectares
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    Progresso da Implantação
                  </span>
                  <span style={{ fontSize: "14px" }}>
                    {formatPercent(calculatedData.percentualImplantacao)}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "9999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${calculatedData.percentualImplantacao}%`,
                      height: "100%",
                      backgroundColor: "#0369a1",
                      borderRadius: "9999px",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Card - Distribuição de Valores */}
            <div style={styles.card}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Distribuição de Valores
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ color: "#2563eb" }}>Vendido</span>
                    <span style={{ fontWeight: "bold" }}>
                      {formatMoney(calculatedData.totalVendido)}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "9999px",
                    }}
                  >
                    <div
                      style={{
                        width: `${calculatedData.percentualVendido}%`,
                        backgroundColor: "#2563eb",
                        height: "100%",
                        borderRadius: "9999px",
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ color: "#16a34a" }}>Bonificado</span>
                    <span style={{ fontWeight: "bold" }}>
                      {formatMoney(calculatedData.totalBonificado)}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "9999px",
                    }}
                  >
                    <div
                      style={{
                        width: `${calculatedData.percentualBonificado}%`,
                        backgroundColor: "#16a34a",
                        height: "100%",
                        borderRadius: "9999px",
                      }}
                    ></div>
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "8px",
                    padding: "12px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                  }}
                >
                  <p style={{ color: "#6b7280", marginBottom: "4px" }}>
                    Valor Total
                  </p>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#1f2937",
                    }}
                  >
                    {formatMoney(calculatedData.totalGeral)}
                  </p>
                </div>
              </div>
            </div>

            {/* Card - Tabela de Produtos */}
            <div style={{ ...styles.card, gridColumn: "span 2" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Detalhamento por Produto
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom: "2px solid #e5e7eb",
                        }}
                      >
                        Produto
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "12px",
                          borderBottom: "2px solid #e5e7eb",
                        }}
                      >
                        Valor Vendido
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "12px",
                          borderBottom: "2px solid #e5e7eb",
                        }}
                      >
                        Valor Bonificado
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "12px",
                          borderBottom: "2px solid #e5e7eb",
                        }}
                      >
                        Áreas
                      </th>
                      <th
                        style={{
                          textAlign: "right",
                          padding: "12px",
                          borderBottom: "2px solid #e5e7eb",
                        }}
                      >
                        Total
                      </th>
                      {!isExporting && (
                        <th
                          style={{
                            textAlign: "center",
                            padding: "12px",
                            borderBottom: "2px solid #e5e7eb",
                          }}
                        >
                          Ações
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map((produto, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor: index % 2 === 0 ? "white" : "#f8fafc",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {produto.nome}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            borderBottom: "1px solid #e5e7eb",
                            color: "#2563eb",
                          }}
                        >
                          {produto.valorVendido > 0
                            ? formatMoney(produto.valorVendido)
                            : "-"}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            borderBottom: "1px solid #e5e7eb",
                            color: "#16a34a",
                          }}
                        >
                          {produto.valorBonificado > 0
                            ? formatMoney(produto.valorBonificado)
                            : "-"}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          {produto.areas}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            borderBottom: "1px solid #e5e7eb",
                            fontWeight: "bold",
                          }}
                        >
                          {formatMoney(
                            produto.valorVendido + produto.valorBonificado
                          )}
                        </td>
                        {!isExporting && (
                          <td
                            style={{
                              padding: "12px",
                              textAlign: "center",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            <button
                              onClick={() =>
                                handleEditStart("produto", { ...produto, index })
                              }
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                            >
                              Editar
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: "#f8fafc", fontWeight: "bold" }}>
                      <td style={{ padding: "12px" }}>Total Geral</td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          color: "#2563eb",
                        }}
                      >
                        {formatMoney(calculatedData.totalVendido)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          color: "#16a34a",
                        }}
                      >
                        {formatMoney(calculatedData.totalBonificado)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        {calculatedData.totalAreas}
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        {formatMoney(calculatedData.totalGeral)}
                      </td>
                      {!isExporting && <td></td>}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card - Indicadores */}
            <div style={{ ...styles.card, gridColumn: "span 2" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Indicadores Chave
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f0f9ff",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "#1f2937" }}>Valor Médio/Hectare</p>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#0369a1",
                    }}
                  >
                    {formatMoney(calculatedData.valorMedioHectare)}
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "#1f2937" }}>Total Hectares</p>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#16a34a",
                    }}
                  >
                    {calculatedData.totalHectares}
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor: "#fef9c3",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <p style={{ color: "#1f2937" }}>Ticket Médio</p>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#ca8a04",
                    }}
                  >
                    {formatMoney(calculatedData.ticketMedio)}
                  </p>
                </div>
              </div>
            </div>

            {/* Seção de Fotos */}
            <div style={styles.photoContainer}>
              <div style={styles.photoBox}>
                <ImageUploader
                  onImageUpload={handleImageUpload('area1')}
                  currentImage={images.area1}
                />
              </div>
              <div style={styles.photoBox}>
                <ImageUploader
                  onImageUpload={handleImageUpload('area2')}
                  currentImage={images.area2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

