
export const mockStateManager = {
  getState: jest.fn(),
  setState: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn()
};

export const mockFirebaseService = {
  initializeApp: jest.fn(),
  getAuth: jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn().mockResolvedValue(undefined)
  })),
  getDatabase: jest.fn()
};

export const mockWebSocketService = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  send: jest.fn(),
  onMessage: jest.fn()
};

export * from './firebase.mock';
export * from './auth.mock';
export * from './database.mock';