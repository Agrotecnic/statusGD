const express = require('express');
const router = express.Router();
const { signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth');
const { auth } = require('../config/firebase');

// Login
router.post('/login', async (req, res) => {
    const redirect = req.query.redirect || '/dashboard/geral';
    try {
        const { email, password } = req.body;
        await signInWithEmailAndPassword(auth, email, password);
        res.redirect(302, redirect);
    } catch (error) {
        res.status(200).render('newLogin', {
            error: 'Email ou senha inválidos',
            email: req.body.email,
            redirect,
            success: null
        });
    }
});

// Recuperação de senha
router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword', { 
        error: null, 
        success: null 
    });
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        await sendPasswordResetEmail(auth, email);
        res.status(200).render('forgotPassword', {
            success: 'Email de recuperação enviado!',
            error: null
        });
    } catch (error) {
        res.status(200).render('forgotPassword', {
            error: 'Email não encontrado',
            success: null
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    try {
        auth.signOut();
        return res.redirect('/auth/login');
    } catch (error) {
        console.error('Erro no logout:', error);
        return res.status(500).render('error', {
            message: 'Erro ao fazer logout',
            error: { status: 500 }
        });
    }
});

module.exports = router;
