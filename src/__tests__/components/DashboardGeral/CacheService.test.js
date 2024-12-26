import CacheService from '../../../../components/DashboardGeral/services/CacheService';

describe('CacheService', () => {
  beforeEach(() => {
    CacheService.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('deve armazenar e recuperar dados', () => {
    const data = { test: 'value' };
    CacheService.set('key', data);
    expect(CacheService.get('key')).toEqual(data);
  });

  test('deve expirar dados corretamente', () => {
    CacheService.set('key', 'value');
    jest.advanceTimersByTime(6 * 60 * 1000); // Avança 6 minutos
    expect(CacheService.get('key')).toBeNull();
  });

  test('deve invalidar chaves específicas', () => {
    CacheService.set('key1', 'value1');
    CacheService.set('key2', 'value2');
    CacheService.invalidate('key1');
    expect(CacheService.get('key1')).toBeNull();
    expect(CacheService.get('key2')).toBe('value2');
  });

  test('deve verificar existência de chaves', () => {
    CacheService.set('key', 'value');
    expect(CacheService.has('key')).toBe(true);
    expect(CacheService.has('nonexistent')).toBe(false);
  });

  test('deve limpar todo o cache', () => {
    CacheService.set('key1', 'value1');
    CacheService.set('key2', 'value2');
    CacheService.clear();
    expect(CacheService.getAll()).toEqual({});
  });

  test('deve retornar todos os dados válidos', () => {
    CacheService.set('key1', 'value1');
    CacheService.set('key2', 'value2');
    const allData = CacheService.getAll();
    expect(allData).toEqual({
      key1: 'value1',
      key2: 'value2'
    });
  });
});