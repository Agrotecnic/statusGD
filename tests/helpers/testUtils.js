const mockFirebaseAuth = {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn().mockResolvedValue(undefined)
};

const setupTestAuth = (currentUser = null) => {
    mockFirebaseAuth.currentUser = currentUser;
    return mockFirebaseAuth;
};

const createTestUser = (overrides = {}) => ({
    uid: 'test-uid',
    email: 'test@example.com',
    role: 'user',
    ...overrides
});

module.exports = {
    setupTestAuth,
    createTestUser,
    mockFirebaseAuth
};
