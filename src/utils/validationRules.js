// src/utils/validationRules.js

export const validationRules = {
    vendedor: {
      nome: {
        validate: (value) => value.length >= 3,
        message: 'Nome deve ter pelo menos 3 caracteres',
        tooltip: 'Digite o nome completo do vendedor'
      },
      regional: {
        validate: (value) => value.length >= 2,
        message: 'Regional é obrigatória',
        tooltip: 'Selecione a regional de atuação'
      },
      businessUnit: {
        validate: (value) => value.length >= 2,
        message: 'Business Unit é obrigatória',
        tooltip: 'Unidade de negócio do vendedor'
      }
    },
    areas: {
      emAcompanhamento: {
        validate: (value) => Number(value) >= 0 && Number.isInteger(Number(value)),
        message: 'Deve ser um número inteiro positivo',
        tooltip: 'Número de áreas atualmente em acompanhamento'
      },
      aImplantar: {
        validate: (value) => Number(value) >= 0 && Number.isInteger(Number(value)),
        message: 'Deve ser um número inteiro positivo',
        tooltip: 'Número de áreas a serem implantadas'
      },
      finalizados: {
        validate: (value) => Number(value) >= 0 && Number.isInteger(Number(value)),
        message: 'Deve ser um número inteiro positivo',
        tooltip: 'Número de áreas finalizadas'
      },
      mediaHectaresArea: {
        validate: (value) => Number(value) > 0,
        message: 'Deve ser maior que zero',
        tooltip: 'Média de hectares por área'
      },
      areaPotencialTotal: {
        validate: (value) => Number(value) >= 0,
        message: 'Deve ser maior ou igual a zero',
        tooltip: 'Área potencial total em hectares'
      }
    },
    produto: {
      nome: {
        validate: (value) => value.length >= 2,
        message: 'Nome do produto é obrigatório',
        tooltip: 'Nome do produto comercializado'
      },
      cliente: {
        validate: (value) => value.length >= 2,
        message: 'Cliente é obrigatório',
        tooltip: 'Nome do cliente'
      },
      valorVendido: {
        validate: (value) => Number(value) >= 0,
        message: 'Valor deve ser positivo',
        tooltip: 'Valor total vendido'
      },
      valorBonificado: {
        validate: (value) => Number(value) >= 0,
        message: 'Valor deve ser positivo',
        tooltip: 'Valor total bonificado'
      },
      areas: {
        validate: (value) => Number(value) >= 0 && Number.isInteger(Number(value)),
        message: 'Deve ser um número inteiro positivo',
        tooltip: 'Número de áreas para este produto'
      }
    }
  };
  
  export const validateForm = (data) => {
    const errors = {
      vendedor: {},
      areas: {},
      produtos: []
    };
  
    // Validar dados do vendedor
    Object.keys(validationRules.vendedor).forEach(field => {
      const rule = validationRules.vendedor[field];
      if (!rule.validate(data.vendedor[field])) {
        errors.vendedor[field] = rule.message;
      }
    });
  
    // Validar áreas
    Object.keys(validationRules.areas).forEach(field => {
      const rule = validationRules.areas[field];
      if (!rule.validate(data.areas[field])) {
        errors.areas[field] = rule.message;
      }
    });
  
    // Validar produtos
    data.produtos.forEach((produto, index) => {
      const produtoErrors = {};
      Object.keys(validationRules.produto).forEach(field => {
        const rule = validationRules.produto[field];
        if (!rule.validate(produto[field])) {
          produtoErrors[field] = rule.message;
        }
      });
      if (Object.keys(produtoErrors).length > 0) {
        errors.produtos[index] = produtoErrors;
      }
    });
  
    // Validações adicionais de negócio
    if (data.areas.emAcompanhamento + data.areas.aImplantar + data.areas.finalizados === 0) {
      errors.areas.total = 'Deve haver pelo menos uma área registrada';
    }
  
    // Verificar se há algum erro
    const hasErrors = Object.keys(errors.vendedor).length > 0 ||
                     Object.keys(errors.areas).length > 0 ||
                     errors.produtos.length > 0;
  
    return {
      isValid: !hasErrors,
      errors
    };
  };
  
  export const formatValue = (value, type) => {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      case 'number':
        return new Intl.NumberFormat('pt-BR').format(value);
      case 'percentage':
        return `${value.toFixed(2)}%`;
      default:
        return value;
    }
  };