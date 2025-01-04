
const express = require('express');
const router = express.Router();
const { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth');

// Login
router.get('/login', (req, res) => {
    const redirect = req.query.redirect || '/dashboard';
    res.render('newLogin', { 
        error: null, 
        email: '', 
        success: null,
        redirect 
    });
});

router.post('/login', async (req, res) => {
    const { email, password, redirect } = req.body;
    try {
        await signInWithEmailAndPassword(getAuth(), email, password);
        res.redirect(redirect || '/dashboard');
    } catch (error) {
        res.render('newLogin', {
            error: 'Email ou senha inválidos',
            email,
            success: null,
            redirect
        });
    }
});

// Recuperação de senha
router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword', { error: null, success: null });
});

router.post('/forgot-password', async (req, res) => {
    try {
        await sendPasswordResetEmail(getAuth(), req.body.email);
        res.render('forgotPassword', {
            error: null,
            success: 'Email de recuperação enviado!'
        });
    } catch (error) {
        res.render('forgotPassword', {
            error: 'Email não encontrado',
            success: null
        });
    }
});

router.get('/logout', (req, res) => {
    getAuth().signOut();
    res.redirect('/auth/login');
});

module.exports = router;