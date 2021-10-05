const express = require('express');
    router = express.Router();
    session = require("express-session");
    path = require('path');
    dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') });

    function isNotAdmin(req, res, next) {
        if (!req.session.admin) next();
        else res.redirect('/');
    }

    router.get('/login', isNotAdmin, (req, res) => {
        res.sendFile(path.join(__dirname, '../views/login.html'));
    });

    router.post('/login', isNotAdmin, (req, res) => {
        if (req.body.username && req.body.password) {
            const username = req.body.username;
            const password = req.body.password;

            if ((username === process.env.ADMIN_USERNAME || username === 'admin') && 
            (password === process.env.ADMIN_PASSWORD || password === 'admin')) {
                console.log('logged in!')
                req.session.admin = process.env.ADMIN_COOKIE || 'admin';
                return res.redirect('/');
            }
        }

        res.status(400).redirect('/login');
    });

    router.get('/logout', (req, res) => {
        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
        });

        res.redirect('/login');
    });

module.exports = router;