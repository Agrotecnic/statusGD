import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../../../../components/DashboardGeral/hooks/useAuth';
import AuthService from '../../../../components/DashboardGeral/services/AuthService';

jest.mock('../../../../components/DashboardGeral/services/AuthService');

describe('useAuth', () => {
  const mockUser = {
    uid: '123',
    email: 'test@example.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login functionality', async () => {
    AuthService.login.mockResolvedValue(mockUser);
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
    });

    expect(AuthService.login).toHaveBeenCalled();
  });

  test('permission checking', () => {
    AuthService.hasPermission.mockReturnValue(true);
    
    const { result } = renderHook(() => useAuth());
    
    const hasPermission = result.current.checkPermission('read_dashboard', 'read');
    expect(hasPermission).toBe(true);
    expect(AuthService.hasPermission).toHaveBeenCalledWith('read_dashboard', 'read');
  });

  test('logout process', async () => {
    AuthService.logout.mockResolvedValue();
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.logout();
    });

    expect(AuthService.logout).toHaveBeenCalled();
  });
});