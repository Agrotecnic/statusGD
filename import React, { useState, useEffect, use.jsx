import React, { useState, useEffect, useCallback } from "react";

export default function App() {
  // Estados principais
  const [vendedorInfo, setVendedorInfo] = useState({
    nome: "João Silva",
    regional: "Centro-Oeste",
    businessUnit: "Especialidades",
    dataAtualizacao: "Novembro 2024",
  });

  const [areas, setAreas] = useState({
    emAcompanhamento: 5,
    aImplantar: 10,
    hectaresPorArea: 30,
  });

  const [produtos, setProdutos] = useState([
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
    { nome: "TMSP Power", valorVendido: 0, valorBonificado: 18030.0, areas: 1 },
    {
      nome: "DimiForm Plus + K400 Full",
      valorVendido: 12200.0,
      valorBonificado: 0,
      areas: 1,
    },
  ]);

  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [_tempFormData, setTempFormData] = useState({});


  // Cálculos derivados
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

  // Efeito para recalcular valores
  useEffect(() => {
    const totalVendido = produtos.reduce(
      (acc, prod) => acc + prod.valorVendido,
      0
    );
    const totalBonificado = produtos.reduce(
      (acc, prod) => acc + prod.valorBonificado,
      0
    );
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
      percentualBonificado: totalGeral
        ? (totalBonificado / totalGeral) * 100
        : 0,
      totalAreas,
      totalHectares,
      valorMedioHectare: totalHectares ? totalGeral / totalHectares : 0,
      percentualImplantacao:
        (areas.emAcompanhamento / (areas.emAcompanhamento + areas.aImplantar)) *
        100,
      ticketMedio: produtos.length ? totalGeral / produtos.length : 0,
      ticketMedioVendido: produtosVendidos.length
        ? totalVendido / produtosVendidos.length
        : 0,
      ticketMedioBonificado: produtosBonificados.length
        ? totalBonificado / produtosBonificados.length
        : 0,
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
    setTempFormData(data);
    if (type === "produto") {
      setEditingItem(data.index);
    } else {
      setEditingSection(type);
    }
  }, []);

  const handleEditCancel = useCallback(() => {
    setTempFormData(null);
    setEditingItem(null);
    setEditingSection(null);
  }, []);
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
    input: {
      width: "100%",
      padding: "8px",
      border: "1px solid #e1e1e1",
      borderRadius: "4px",
      marginBottom: "8px",
      outline: "none",
      fontSize: "14px",
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

  // Componente Input Controlado
  const ControlledInput = React.memo(
    ({ value, onChange, type = "text", autoFocus = false }) => {
      const [localValue, setLocalValue] = React.useState(value);

      React.useEffect(() => {
        setLocalValue(value);
      }, [value]);

      const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onChange(
          type === "number"
            ? newValue === ""
              ? 0
              : Number(newValue)
            : newValue
        );
      };

      return (
        <input
          type={type}
          value={localValue}
          onChange={handleChange}
          style={styles.input}
          autoFocus={autoFocus}
        />
      );
    }
  );

  // Modal Component
  const Modal = React.memo(({ title, children, onClose }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  ));

  // Formulário do Vendedor
  const VendedorForm = React.memo(() => {
    const [formData, setFormData] = useState({ ...vendedorInfo });

    const handleSubmit = (e) => {
      e.preventDefault();
      setVendedorInfo(formData);
      setEditingSection(null);
    };

    const handleFieldChange = (field) => (value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Nome do Representante
            <ControlledInput
              value={formData.nome}
              onChange={handleFieldChange("nome")}
              autoFocus
            />
          </label>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Regional
            <ControlledInput
              value={formData.regional}
              onChange={handleFieldChange("regional")}
            />
          </label>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Business Unit
            <ControlledInput
              value={formData.businessUnit}
              onChange={handleFieldChange("businessUnit")}
            />
          </label>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Data de Atualização
            <ControlledInput
              value={formData.dataAtualizacao}
              onChange={handleFieldChange("dataAtualizacao")}
            />
          </label>
        </div>
        <button type="submit" style={styles.button}>
          Salvar
        </button>
      </form>
    );
  });
  // Formulário de Áreas
  const AreaForm = React.memo(() => {
    const [formData, setFormData] = useState({ ...areas });

    const handleSubmit = (e) => {
      e.preventDefault();
      setAreas(formData);
      setEditingSection(null);
    };

    const handleFieldChange = (field) => (value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Áreas em Acompanhamento
            <ControlledInput
              type="number"
              value={formData.emAcompanhamento}
              onChange={handleFieldChange("emAcompanhamento")}
              autoFocus
            />
          </label>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Áreas a Implantar
            <ControlledInput
              type="number"
              value={formData.aImplantar}
              onChange={handleFieldChange("aImplantar")}
            />
          </label>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
             Média hectares das Area
            <ControlledInput
              type="number"
              value={formData.hectaresPorArea}
              onChange={handleFieldChange("hectaresPorArea")}
            />
          </label>
        </div>
        <button type="submit" style={styles.button}>
          Salvar
        </button>
      </form>
    );
  });

  // Formulário de Produto
  const ProdutoForm = React.memo(() => {
    const produto = produtos[editingItem];
    const [formData, setFormData] = useState({ ...produto });

    if (!produto) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      const newProdutos = [...produtos];
      newProdutos[editingItem] = formData;
      setProdutos(newProdutos);
      setEditingItem(null);
    };

    const handleFieldChange = (field) => (value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRemove = () => {
      setProdutos(produtos.filter((_, idx) => idx !== editingItem));
      setEditingItem(null);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Nome do Produto
            <ControlledInput
              value={formData.nome}
              onChange={handleFieldChange("nome")}
              autoFocus
            />
          </label>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Valor Vendido
            <ControlledInput
              type="number"
              value={formData.valorVendido}
              onChange={handleFieldChange("valorVendido")}
            />
          </label>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Valor Bonificado
            <ControlledInput
              type="number"
              value={formData.valorBonificado}
              onChange={handleFieldChange("valorBonificado")}
            />
          </label>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            Número de Áreas
            <ControlledInput
              type="number"
              value={formData.areas}
              onChange={handleFieldChange("areas")}
            />
          </label>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit" style={styles.button}>
            Salvar
          </button>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              ...styles.button,
              backgroundColor: "#dc2626",
            }}
          >
            Remover Produto
          </button>
        </div>
      </form>
    );
  });

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
  // Layout Principal - Return
  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      {/* Modais */}
      {editingSection === "info" && (
        <Modal title="Editar Informações" onClose={handleEditCancel}>
          <VendedorForm />
        </Modal>
      )}
      {editingSection === "areas" && (
        <Modal title="Editar Áreas" onClose={handleEditCancel}>
          <AreaForm />
        </Modal>
      )}
      {editingItem !== null && (
        <Modal title="Editar Produto" onClose={handleEditCancel}>
          <ProdutoForm />
        </Modal>
      )}

      {/* Barra de Ações */}
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
        <button onClick={addProduto} style={styles.button}>
          Adicionar Produto
        </button>
        <button
          onClick={() => handleEditStart("areas", areas)}
          style={styles.button}
        >
          Editar Áreas
        </button>
      </div>

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
          button
            onClick={() => handleEditStart("info", vendedorInfo)}
            style={{
              ...styles.button,
              position: "absolute",
              right: "0",
              top: "0",
            }}
            Editar
          button{">"}
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
                    <th
                      style={{
                        textAlign: "center",
                        padding: "12px",
                        borderBottom: "2px solid #e5e7eb",
                      }}
                    >
                      Ações
                    </th>
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
                    </tr>
                  ))}
                  <tr
                    style={{ backgroundColor: "#f8fafc", fontWeight: "bold" }}
                  >
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
                    <td></td>
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
              <p>Foto da Área 1</p>
            </div>
            <div style={styles.photoBox}>
              <p>Foto da Área 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
