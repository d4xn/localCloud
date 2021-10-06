const express = require('express');
    router = express.Router();
    session = require("express-session");
    path = require('path');
    dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') });

    function isAdmin(req, res, next) {
        if (req.session.token === process.env.ADMIN_TOKEN && 
            req.session.user == process.env.ADMIN_USERNAME) next();
        else res.redirect('/login');
    }

    router.get('/admin', isAdmin, (req, res) => {
        res.sendFile(path.join(__dirname, '../views/admin.html'));
    });

module.exports = router;