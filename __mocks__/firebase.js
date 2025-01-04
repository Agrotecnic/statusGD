const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn()
};

const mockApp = {
  name: '[DEFAULT]',
  options: {}
};

export const getAuth = jest.fn(() => mockAuth);
export const initializeApp = jest.fn(() => mockApp);
export const signInWithEmailAndPassword = jest.fn();
export const sendPasswordResetEmail = jest.fn();
export const onAuthStateChanged = jest.fn();

// Exporta os mocks para uso nos testes
export const __auth = mockAuth;
export const __app = mockApp;
