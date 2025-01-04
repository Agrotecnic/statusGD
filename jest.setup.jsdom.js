require('@testing-library/jest-dom');

// Mock do DOM
const mockDOM = {
    matchMedia: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn()
    })),
    localStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
    }
};

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockDOM.matchMedia,
});

Object.defineProperty(window, 'localStorage', {
    writable: true,
    value: mockDOM.localStorage,
});

// Mock do Firebase
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
    getAuth: jest.fn()
}));

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn()
}));

// Limpar mocks após cada teste
afterEach(() => {
    jest.clearAllMocks();
});
