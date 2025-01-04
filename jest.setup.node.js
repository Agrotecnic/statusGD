require('dotenv').config({ path: '.env.test' });

// Mock do Firebase
const mockFirebase = {
    auth: {
        currentUser: null,
        signInWithEmailAndPassword: jest.fn(),
        signOut: jest.fn().mockResolvedValue(undefined)
    }
};

jest.mock('firebase/app', () => ({
    initializeApp: jest.fn()
}));

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => mockFirebase.auth),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn()
}));

// Mock do Express
global.mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    render: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis()
});

global.mockRequest = (body = {}, query = {}, params = {}) => ({
    body,
    query,
    params
});

afterEach(() => {
    jest.clearAllMocks();
});
