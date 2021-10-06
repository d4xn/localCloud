const express = require('express');
    router = express.Router();
    session = require("express-session");
    path = require('path');
    dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') });

    function isNotAdmin(req, res, next) {
        if (req.session.token === process.env.ADMIN_TOKEN && 
            req.session.user == process.env.ADMIN_USERNAME) res.redirect('/');
        else next();
    }

    router.get('/login', isNotAdmin, (req, res) => {
        res.sendFile(path.join(__dirname, '../views/login.html'));
    });

    router.post('/login', isNotAdmin, (req, res) => {
        if (req.body.username && req.body.password) {
            const username = req.body.username;
            const password = req.body.password;

            if (username === process.env.ADMIN_USERNAME && 
            password === process.env.ADMIN_PASSWORD) {
                console.log('logged in!')
                req.session.user = process.env.ADMIN_USERNAME;
                req.session.token = process.env.ADMIN_TOKEN;
                return res.redirect('/');
            }
        }

        res.status(400).redirect('/login');
    });

    router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/login');
    });

module.exports = router;