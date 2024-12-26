// src/components/EnhancedDataEntry/EnhancedForm.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';
import ProgressBar from './ProgressBar';
import StatusIndicator from './StatusIndicator';

const EnhancedForm = ({ onSave, initialData = null }) => {
  // Estados do formulário
  const [formData, setFormData] = useState(initialData || {
    vendedor: {
      nome: '',
      regional: '',
      businessUnit: ''
    },
    areas: {
      emAcompanhamento: 0,
      aImplantar: 0,
      finalizados: 0,
      mediaHectaresArea: 0
    },
    produtos: []
  });

  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});

  // Calcula o progresso do preenchimento
  const calculateProgress = () => {
    const fields = [
      formData.vendedor.nome,
      formData.vendedor.regional,
      formData.vendedor.businessUnit,
      formData.areas.emAcompanhamento,
      formData.areas.aImplantar,
      formData.areas.finalizados,
      formData.areas.mediaHectaresArea
    ];

    const filledFields = fields.filter(field => field !== '' && field !== 0).length;
    const requiredProducts = formData.produtos.length > 0;

    return Math.round((filledFields / (fields.length + (requiredProducts ? 1 : 0))) * 100);
  };

  // Handler para mudanças nos campos
  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Limpa erro do campo quando ele é alterado
    if (errors[section]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: null
        }
      }));
    }

    // Indica que há mudanças não salvas
    setStatus('saving');
  };

  // Adiciona um novo produto
  const handleAddProduto = () => {
    const newProduto = {
      nome: '',
      cliente: '',
      valorVendido: 0,
      valorBonificado: 0,
      areas: 0
    };

    setFormData(prev => ({
      ...prev,
      produtos: [...prev.produtos, newProduto]
    }));
  };

  // Remove um produto
  const handleRemoveProduto = (index) => {
    setFormData(prev => ({
      ...prev,
      produtos: prev.produtos.filter((_, i) => i !== index)
    }));
  };

  // Handler para mudança nos produtos
  const handleProdutoChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      produtos: prev.produtos.map((produto, i) => 
        i === index ? { ...produto, [field]: value } : produto
      )
    }));
    setStatus('saving');
  };

  // Handler para submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus('submitting');
      await onSave(formData);
      setStatus('success');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Barra de Progresso */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Progresso do Preenchimento</h2>
        <ProgressBar progress={calculateProgress()} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção Vendedor */}
        <section>
          <h3 className="text-lg font-medium mb-4">Informações do Vendedor</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Nome"
              name="nome"
              value={formData.vendedor.nome}
              onChange={(e) => handleChange('vendedor', 'nome', e.target.value)}
              error={errors.vendedor?.nome}
              help="Digite o nome completo do vendedor"
              required
            />
            <FormField
              label="Regional"
              name="regional"
              value={formData.vendedor.regional}
              onChange={(e) => handleChange('vendedor', 'regional', e.target.value)}
              error={errors.vendedor?.regional}
              help="Selecione a regional de atuação"
              required
            />
            <FormField
              label="Business Unit"
              name="businessUnit"
              value={formData.vendedor.businessUnit}
              onChange={(e) => handleChange('vendedor', 'businessUnit', e.target.value)}
              error={errors.vendedor?.businessUnit}
              help="Unidade de negócio do vendedor"
            />
          </div>
        </section>

        {/* Seção Áreas */}
        <section>
          <h3 className="text-lg font-medium mb-4">Áreas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              label="Em Acompanhamento"
              name="emAcompanhamento"
              type="number"
              value={formData.areas.emAcompanhamento}
              onChange={(e) => handleChange('areas', 'emAcompanhamento', Number(e.target.value))}
              error={errors.areas?.emAcompanhamento}
              help="Número atual de áreas em acompanhamento"
              required
            />
            <FormField
              label="A Implantar"
              name="aImplantar"
              type="number"
              value={formData.areas.aImplantar}
              onChange={(e) => handleChange('areas', 'aImplantar', Number(e.target.value))}
              error={errors.areas?.aImplantar}
              help="Número de áreas planejadas para implantação"
            />
            <FormField
              label="Finalizados"
              name="finalizados"
              type="number"
              value={formData.areas.finalizados}
              onChange={(e) => handleChange('areas', 'finalizados', Number(e.target.value))}
              error={errors.areas?.finalizados}
              help="Número de áreas já finalizadas"
            />
            <FormField
              label="Média Hectares/Área"
              name="mediaHectaresArea"
              type="number"
              value={formData.areas.mediaHectaresArea}
              onChange={(e) => handleChange('areas', 'mediaHectaresArea', Number(e.target.value))}
              error={errors.areas?.mediaHectaresArea}
              help="Média de hectares por área"
              required
            />
          </div>
        </section>

        {/* Seção Produtos */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Produtos</h3>
            <button
              type="button"
              onClick={handleAddProduto}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Adicionar Produto
            </button>
          </div>

          {formData.produtos.map((produto, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  label="Nome do Produto"
                  name={`produto-${index}-nome`}
                  value={produto.nome}
                  onChange={(e) => handleProdutoChange(index, 'nome', e.target.value)}
                  error={errors.produtos?.[index]?.nome}
                  required
                />
                {/* Outros campos do produto */}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveProduto(index)}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Remover Produto
              </button>
            </div>
          ))}
        </section>

        {/* Indicador de Status e Botões */}
        <div className="flex justify-between items-center pt-6 border-t">
          <StatusIndicator status={status} />
          <div className="space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

EnhancedForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    vendedor: PropTypes.shape({
      nome: PropTypes.string,
      regional: PropTypes.string,
      businessUnit: PropTypes.string
    }),
    areas: PropTypes.shape({
      emAcompanhamento: PropTypes.number,
      aImplantar: PropTypes.number,
      finalizados: PropTypes.number,
      mediaHectaresArea: PropTypes.number
    }),
    produtos: PropTypes.arrayOf(PropTypes.shape({
      nome: PropTypes.string,
      cliente: PropTypes.string,
      valorVendido: PropTypes.number,
      valorBonificado: PropTypes.number,
      areas: PropTypes.number
    }))
  })
};

export default EnhancedForm;