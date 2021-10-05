const express = require('express');
    router = express.Router();
    session = require("express-session");
    path = require('path');

    function isAdmin(req, res, next) {
        if (req.session.admin) next();
        else res.redirect('/login');
    }

    router.get('/admin', isAdmin, (req, res) => {
        res.sendFile(path.join(__dirname, '../views/admin.html'));
    });

module.exports = router;