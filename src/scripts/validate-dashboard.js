import LoggerService from '../services/LoggerService';
import StaticDataService from '../services/StaticDataService';

const validateDashboard = async () => {
  try {
    // Verificar dados estáticos
    const produtos = await StaticDataService.getProdutos();
    const marcas = await StaticDataService.getMarcas();
    const categorias = await StaticDataService.getCategorias();

    const validations = [
      {
        name: 'Produtos',
        condition: produtos && produtos.length > 0,
        message: 'Nenhum produto encontrado'
      },
      {
        name: 'Marcas',
        condition: marcas && marcas.length > 0,
        message: 'Nenhuma marca encontrada'
      },
      {
        name: 'Categorias',
        condition: categorias && categorias.length > 0,
        message: 'Nenhuma categoria encontrada'
      }
    ];

    const failedValidations = validations.filter(val => !val.condition);

    if (failedValidations.length > 0) {
      failedValidations.forEach(val => {
        LoggerService.log('warn', `Validação falhou: ${val.name}`, { message: val.message });
      });
      return false;
    }

    LoggerService.log('info', 'Validação do dashboard concluída com sucesso');
    return true;
  } catch (error) {
    LoggerService.error('Erro na validação do dashboard', error);
    return false;
  }
};

export default validateDashboard;