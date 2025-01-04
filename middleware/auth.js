
const { auth } = require('../config/firebase');

const checkAuth = (req, res, next) => {
    if (req.path.startsWith('/auth/') || req.path === '/') {
        return next();
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
        return res.redirect(`/auth/login?redirect=${encodeURIComponent(req.path)}`);
    }
    next();
};

module.exports = { checkAuth };