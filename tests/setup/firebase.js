
const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn().mockResolvedValue(undefined)
};

const mockApp = {
  name: '[DEFAULT]',
  options: {}
};

module.exports = {
  getAuth: jest.fn(() => mockAuth),
  initializeApp: jest.fn(() => mockApp),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  mockAuth,
  mockApp
};