// Environment setup
process.env.NODE_ENV = 'test';
jest.setTimeout(10000);

// Firebase mocks
const mockAuth = {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { uid: '123' } }),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(),
    signOut: jest.fn().mockResolvedValue()
};

// Setup global mocks
global.mockAuth = mockAuth;
global.testUtils = {
    mockRequest: () => ({
        query: {},
        body: {},
        params: {}
    }),
    mockResponse: () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.render = jest.fn().mockReturnValue(res);
        res.redirect = jest.fn().mockReturnValue(res);
        return res;
    }
};

// Mock implementations
jest.mock('../config/firebase', () => ({
    auth: mockAuth,
    getAuth: () => mockAuth
}));

jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    getAuth: jest.fn(() => mockAuth)
}));

// Clear mocks between tests
beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});

// Silence console during tests
console.error = jest.fn();
console.log = jest.fn();
console.warn = jest.fn();