import AuthService from '../../../../components/DashboardGeral/services/AuthService';
import FirebaseRealtimeService from '../../../../components/DashboardGeral/services/FirebaseRealtimeService';
import StateManager from '../../../../components/DashboardGeral/services/StateManager';

jest.mock('../../../../components/DashboardGeral/services/FirebaseRealtimeService');
jest.mock('../../../../components/DashboardGeral/services/StateManager');

describe('AuthService', () => {
  const mockUser = {
    uid: '123',
    email: 'test@example.com',
    displayName: 'Test User'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    AuthService.clearUserData();
  });

  test('login process', async () => {
    FirebaseRealtimeService.signIn.mockResolvedValue(mockUser);
    FirebaseRealtimeService.getUserRoles.mockResolvedValue([]);
    FirebaseRealtimeService.getRolePermissions.mockResolvedValue([]);

    await AuthService.login({ email: 'test@example.com', password: 'password' });

    expect(FirebaseRealtimeService.signIn).toHaveBeenCalled();
    expect(StateManager.setState).toHaveBeenCalledWith(
      expect.objectContaining({
        auth: expect.any(Object)
      })
    );
  });

  test('permission checks', async () => {
    const mockPermissions = [
      { name: 'read_dashboard', level: 'read' },
      { name: 'edit_dashboard', level: 'write' }
    ];

    FirebaseRealtimeService.getUserRoles.mockResolvedValue(['user']);
    FirebaseRealtimeService.getRolePermissions.mockResolvedValue(mockPermissions);

    await AuthService.setCurrentUser(mockUser);

    expect(AuthService.hasPermission('read_dashboard', 'read')).toBe(true);
    expect(AuthService.hasPermission('edit_dashboard', 'admin')).toBe(false);
  });

  test('logout cleanup', async () => {
    FirebaseRealtimeService.signOut.mockResolvedValue();

    await AuthService.setCurrentUser(mockUser);
    await AuthService.logout();

    expect(FirebaseRealtimeService.signOut).toHaveBeenCalled();
    expect(AuthService.currentUser).toBeNull();
    expect(StateManager.setState).toHaveBeenCalledWith({
      auth: {
        user: null,
        permissions: []
      }
    });
  });

  test('auth state changes', async () => {
    let authCallback;
    FirebaseRealtimeService.onAuthStateChanged.mockImplementation(callback => {
      authCallback = callback;
      return jest.fn();
    });

    await AuthService.initialize();
    await authCallback(mockUser);

    expect(StateManager.setState).toHaveBeenCalled();
  });
});