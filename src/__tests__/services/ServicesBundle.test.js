import ErrorBoundaryService from '../../../../components/DashboardGeral/services/ErrorBoundaryService';
import PerformanceMonitorService from '../../../../components/DashboardGeral/services/PerformanceMonitorService';
import DataValidationService from '../../../../components/DashboardGeral/services/DataValidationService';
import StateManager from '../../../../components/DashboardGeral/services/StateManager';
import LoggerService from '../../../../components/DashboardGeral/services/LoggerService';

jest.mock('../../../../components/DashboardGeral/services/StateManager');
jest.mock('../../../../components/DashboardGeral/services/LoggerService');

describe('Services Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ErrorBoundaryService', () => {
    test('captura e recuperação de erros', () => {
      const mockError = new Error('Test error');
      const mockStack = 'Component stack';
      
      ErrorBoundaryService.captureError(mockError, mockStack);
      expect(LoggerService.log).toHaveBeenCalled();
      expect(StateManager.setState).toHaveBeenCalled();
    });
  });

  describe('PerformanceMonitorService', () => {
    test('monitoramento de performance', () => {
      PerformanceMonitorService.trackRender('TestComponent', 100);
      expect(StateManager.setState).toHaveBeenCalledWith(
        expect.objectContaining({
          performance: expect.any(Object)
        })
      );
    });
  });

  describe('DataValidationService', () => {
    test('validação de dados', () => {
      const schema = {
        fields: ['name', 'age'],
        required: ['name'],
        types: {
          name: 'string',
          age: 'number'
        }
      };

      DataValidationService.registerSchema('test', schema);
      
      const results = DataValidationService.validate('test', {
        name: 'Test',
        age: 25
      });

      expect(results.valid).toBe(true);
      expect(StateManager.setState).toHaveBeenCalled();
    });

    test('validação com erros', () => {
      const schema = {
        fields: ['name', 'age'],
        required: ['name'],
        types: {
          name: 'string',
          age: 'number'
        }
      };

      DataValidationService.registerSchema('test', schema);
      
      const results = DataValidationService.validate('test', {
        age: '25' // tipo errado
      });

      expect(results.valid).toBe(false);
      expect(results.errors).toHaveLength(2); // nome ausente e tipo errado
    });
  });
});