import React, { useState } from 'react';

const ProdutoForm = ({ produto, onSubmit, onRemove }) => {
  const [formData, setFormData] = useState({ ...produto });

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
    removeButton: {
      backgroundColor: "#dc2626",
      color: "white",
      padding: "8px 16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "background-color 0.2s",
    },
    input: {
      width: "100%",
      padding: "8px",
      border: "1px solid #e5e7eb",
      borderRadius: "4px",
      marginBottom: "8px",
      outline: "none",
      fontSize: "14px",
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === "nome" ? e.target.value : (e.target.value === "" ? 0 : Number(e.target.value))
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Nome do Produto
          <input
            value={formData.nome}
            onChange={handleChange("nome")}
            style={styles.input}
            autoFocus
          />
        </label>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Valor Vendido
          <input
            type="number"
            value={formData.valorVendido}
            onChange={handleChange("valorVendido")}
            style={styles.input}
          />
        </label>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Valor Bonificado
          <input
            type="number"
            value={formData.valorBonificado}
            onChange={handleChange("valorBonificado")}
            style={styles.input}
          />
        </label>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Número de Áreas
          <input
            type="number"
            value={formData.areas}
            onChange={handleChange("areas")}
            style={styles.input}
          />
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button type="submit" style={styles.button}>
          Salvar
        </button>
        <button
          type="button"
          onClick={onRemove}
          style={styles.removeButton}
        >
          Remover Produto
        </button>
      </div>
    </form>
  );
};

export default ProdutoForm;