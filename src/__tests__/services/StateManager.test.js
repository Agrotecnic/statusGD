import StateManager from '../../../../components/DashboardGeral/services/StateManager';
import AdvancedCacheService from '../../../../components/DashboardGeral/services/AdvancedCacheService';
import LoggerService from '../../../../components/DashboardGeral/services/LoggerService';

jest.mock('../../../../components/DashboardGeral/services/AdvancedCacheService');
jest.mock('../../../../components/DashboardGeral/services/LoggerService');

describe('StateManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    StateManager.initialize();
  });

  test('init with initial state', () => {
    const initialState = { metrics: { value: 100 } };
    const state = StateManager.initialize(initialState);
    expect(state.metrics).toEqual(initialState.metrics);
  });

  test('state update with changes', () => {
    const update = { metrics: { value: 200 } };
    StateManager.setState(update);
    expect(StateManager.getState().metrics).toEqual(update.metrics);
  });

  test('subscriber notification', () => {
    const callback = jest.fn();
    StateManager.subscribe(state => state.metrics, callback);
    
    StateManager.setState({ metrics: { value: 300 } });
    expect(callback).toHaveBeenCalled();
  });

  test('middleware execution', () => {
    const middleware = jest.fn(() => true);
    StateManager.addMiddleware(middleware);
    
    StateManager.setState({ test: 'value' });
    expect(middleware).toHaveBeenCalled();
  });

  test('cache update on state change', () => {
    StateManager.setState({ metrics: { value: 400 } });
    expect(AdvancedCacheService.setCacheStrategy).toHaveBeenCalled();
  });

  test('selective subscription updates', () => {
    const callback = jest.fn();
    const selector = state => state.specific;
    
    StateManager.subscribe(selector, callback);
    StateManager.setState({ unrelated: 'value' });
    
    expect(callback).not.toHaveBeenCalled();
  });
});