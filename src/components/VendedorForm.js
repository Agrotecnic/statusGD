import React, { useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

const VendedorForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({ ...initialData });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = netlifyIdentity.currentUser();

    if (!user) {
      alert('Por favor, faça login primeiro');
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/saveData', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token.access_token}`
        }
      });

      if (response.ok) {
        alert('Dados salvos com sucesso!');
        onSubmit(formData);
      } else {
        alert('Erro ao salvar dados');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar dados');
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Nome do Representante
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
          Regional
          <input
            value={formData.regional}
            onChange={handleChange("regional")}
            style={styles.input}
          />
        </label>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Business Unit
          <input
            value={formData.businessUnit}
            onChange={handleChange("businessUnit")}
            style={styles.input}
          />
        </label>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Data de Atualização
          <input
            value={formData.dataAtualizacao}
            onChange={handleChange("dataAtualizacao")}
            style={styles.input}
          />
        </label>
      </div>
      <button type="submit" style={styles.button}>
        Salvar
      </button>
    </form>
  );
};

export default VendedorForm;