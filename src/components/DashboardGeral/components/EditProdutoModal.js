import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const EditProdutoModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  produto = null, 
  onSave = () => {},
  loading = false,
  error = null 
}) => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    cliente: '',
    valorVendido: 0,
    valorBonificado: 0,
    areas: 0
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Melhorar a inicialização do formulário
  useEffect(() => {
    if (isOpen && produto) {
      console.log('Inicializando modal com produto:', produto);
      setFormData({
        nome: produto.nome || '',
        cliente: produto.cliente || '',
        valorVendido: parseFloat(produto.valorVendido) || 0,
        valorBonificado: parseFloat(produto.valorBonificado) || 0,
        areas: parseInt(produto.areas) || 0
      });
      setErrors({});
      setHasChanges(false);
    }
  }, [isOpen, produto]);

  // Handler para mudanças nos campos
  const handleFieldChange = useCallback((field, value) => {
    if (isSaving) return;

    console.log('Alterando campo:', field, 'para:', value);
    let processedValue = value;

    // Processa valores numéricos
    if (['valorVendido', 'valorBonificado', 'areas'].includes(field)) {
      const numValue = value === '' ? 0 : Number(value);
      processedValue = isNaN(numValue) ? 0 : numValue;
    }

    setFormData(prev => {
      const newData = { ...prev, [field]: processedValue };
      
      // Verifica se houve mudança real comparando com o produto original
      const hasChanged = 
        field === 'nome' ? newData.nome !== produto.nome :
        field === 'cliente' ? newData.cliente !== produto.cliente :
        Math.abs(newData[field] - (produto[field] || 0)) > 0.01;

      if (hasChanged) {
        console.log('Detectada mudança no formulário');
        setHasChanges(true);
      }

      return newData;
    });

    // Limpa erro do campo alterado
    setErrors(prev => ({
      ...prev,
      [field]: '',
      submit: ''
    }));
  }, [isSaving, produto]);

  // Validação do formulário
  const validateForm = useCallback(() => {
    console.log('Validando formulário:', formData);
    const newErrors = {};
    
    if (!formData.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.cliente?.trim()) {
      newErrors.cliente = 'Cliente é obrigatório';
    }
    
    if (formData.valorVendido < 0) {
      newErrors.valorVendido = 'Valor não pode ser negativo';
    }
    
    if (formData.valorBonificado < 0) {
      newErrors.valorBonificado = 'Valor não pode ser negativo';
    }
    
    if (formData.areas < 0) {
      newErrors.areas = 'Quantidade não pode ser negativa';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Resultado da validação:', isValid ? 'Válido' : 'Inválido', newErrors);
    return isValid;
  }, [formData]);

  // Handler de submit atualizado
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Validação inicial dos dados do produto
    if (!produto?.id) {
      console.error('Produto inválido:', produto);
      setErrors(prev => ({
        ...prev,
        submit: 'Dados do produto incompletos. Atualize a página.'
      }));
      return;
    }

    if (!validateForm()) {
      return;
    }

    const executeSave = async (retryCount = 3) => {
      try {
        setIsSaving(true);
        
        // Formatar dados com maior precisão
        const dadosAtualizados = {
          id: produto.id, // Garantir que o ID está presente
          index: produto.index, // Garantir que o index está presente
          nome: formData.nome.trim(),
          cliente: formData.cliente.trim(),
          valorVendido: Number(parseFloat(formData.valorVendido).toFixed(2)),
          valorBonificado: Number(parseFloat(formData.valorBonificado).toFixed(2)),
          areas: parseInt(formData.areas, 10)
        };

        console.log('Dados formatados para salvamento:', dadosAtualizados);

        // Tentar salvar
        await onSave(dadosAtualizados);
        console.log('Produto salvo com sucesso!');
        onClose();
      } catch (error) {
        console.error('Erro ao salvar:', {
          error,
          tentativasRestantes: retryCount - 1,
          dados: formData
        });

        if (retryCount > 1) {
          // Aguarda 1 segundo antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 1000));
          return executeSave(retryCount - 1);
        }

        // Se todas as tentativas falharem
        let mensagemErro = '';
        
        if (!navigator.onLine) {
          mensagemErro = 'Sem conexão com a internet. Verifique sua conexão e tente novamente.';
        } else if (error.response) {
          switch (error.response.status) {
            case 400:
              mensagemErro = 'Dados inválidos. Verifique os valores e tente novamente.';
              break;
            case 401:
              mensagemErro = 'Sessão expirada. Por favor, faça login novamente.';
              break;
            case 403:
              mensagemErro = 'Sem permissão para editar este produto.';
              break;
            case 404:
              mensagemErro = 'Produto não encontrado no sistema.';
              break;
            case 500:
              mensagemErro = 'Erro no servidor. Por favor, tente novamente em alguns minutos.';
              break;
            default:
              mensagemErro = 'Erro ao salvar. Por favor, tente novamente.';
          }
        } else {
          mensagemErro = 'Falha ao salvar as alterações. Verifique sua conexão e tente novamente.';
        }

        setErrors(prev => ({
          ...prev,
          submit: mensagemErro
        }));

        throw error; // Propagar o erro
      } finally {
        setIsSaving(false);
      }
    };

    try {
      await executeSave();
    } catch (error) {
      // Erro já tratado dentro de executeSave
      console.error('Falha em todas as tentativas de salvamento');
    }
  }, [formData, onSave, onClose, validateForm, produto]);

  // Handler para fechamento do modal
  const handleClose = useCallback(() => {
    if (hasChanges) {
      const confirmClose = window.confirm('Existem alterações não salvas. Deseja realmente sair?');
      if (confirmClose) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [hasChanges, onClose]);

  if (!isOpen || !produto) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Editar {produto.nome}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
            type="button"
            aria-label="Fechar modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: Nome do Produto */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto
            </label>
            <input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.nome ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSaving || loading}
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
            )}
          </div>

          {/* Campo: Cliente */}
          <div>
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <input
              id="cliente"
              type="text"
              value={formData.cliente}
              onChange={(e) => handleFieldChange('cliente', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cliente ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSaving || loading}
            />
            {errors.cliente && (
              <p className="mt-1 text-sm text-red-600">{errors.cliente}</p>
            )}
          </div>

          {/* Campo: Valor Vendido */}
          <div>
            <label htmlFor="valorVendido" className="block text-sm font-medium text-gray-700 mb-1">
              Valor Vendido (R$)
            </label>
            <input
              id="valorVendido"
              type="number"
              value={formData.valorVendido}
              onChange={(e) => handleFieldChange('valorVendido', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.valorVendido ? 'border-red-500' : 'border-gray-300'
              }`}
              step="0.01"
              min="0"
              disabled={isSaving || loading}
            />
            {errors.valorVendido && (
              <p className="mt-1 text-sm text-red-600">{errors.valorVendido}</p>
            )}
          </div>

          {/* Campo: Valor Bonificado */}
          <div>
            <label htmlFor="valorBonificado" className="block text-sm font-medium text-gray-700 mb-1">
              Valor Bonificado (R$)
            </label>
            <input
              id="valorBonificado"
              type="number"
              value={formData.valorBonificado}
              onChange={(e) => handleFieldChange('valorBonificado', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.valorBonificado ? 'border-red-500' : 'border-gray-300'
              }`}
              step="0.01"
              min="0"
              disabled={isSaving || loading}
            />
            {errors.valorBonificado && (
              <p className="mt-1 text-sm text-red-600">{errors.valorBonificado}</p>
            )}
          </div>

          {/* Campo: Quantidade de Áreas */}
          <div>
            <label htmlFor="areas" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade de Áreas
            </label>
            <input
              id="areas"
              type="number"
              value={formData.areas}
              onChange={(e) => handleFieldChange('areas', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.areas ? 'border-red-500' : 'border-gray-300'
              }`}
              min="0"
              disabled={isSaving || loading}
            />
            {errors.areas && (
              <p className="mt-1 text-sm text-red-600">{errors.areas}</p>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            {hasChanges && (
              <span className="text-yellow-600 text-sm mr-auto self-center">
                Alterações não salvas
              </span>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSaving || loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSaving || !hasChanges || loading}
            >
              {isSaving || loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditProdutoModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  produto: PropTypes.shape({
    id: PropTypes.string,
    index: PropTypes.number,
    nome: PropTypes.string,
    cliente: PropTypes.string,
    valorVendido: PropTypes.number,
    valorBonificado: PropTypes.number,
    areas: PropTypes.number
  }),
  onSave: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string
};

export default EditProdutoModal;