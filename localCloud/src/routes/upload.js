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

    router.get('/', isAdmin, (req, res) => {
        res.sendFile(path.join(__dirname, '../views/upload.html'));
    });

    router.post('/upload', isAdmin, (req, res) => {
        if (!req.files) {
            return res.status(400).sendFile(path.join(__dirname, '../views/errorUpload.html'));
        }

        const blockedExtensions = ['.php','.phtml', '.php4', '.php5', '.sh', '.bat', '.cmd'];

        const len = req.files.myFiles.length;

        if (len === undefined) { // only 1 file
            const file = req.files.myFiles;
        
            const extensionName = path.extname(file.name);
            
            if (blockedExtensions.includes(extensionName)) {
                return res.status(422).sendFile(path.join(__dirname, '../views/errorUpload.html'));
            }
            
            const filePath = __dirname + '/../../files/' + file.name;
            
            file.mv(filePath, (err) => {
                if (err) {
                    return res.status(500).sendFile(path.join(__dirname, '../views/errorUpload.html'));
                }
            });
            
        } else {
            for (let i = 0; i < req.files.myFiles.length; i++) {
                const file = req.files.myFiles[i];
        
                const extensionName = path.extname(file.name);
            
                if (blockedExtensions.includes(extensionName)) {
                    return res.status(422).sendFile(path.join(__dirname, '../views/errorUpload.html'));
                }
            
                const filePath = __dirname + '/../../files/' + file.name;
            
                file.mv(filePath, (err) => {
                    if (err) {
                        return res.status(500).sendFile(path.join(__dirname, '../views/errorUpload.html'));
                    }
                });
            }
        }

        return res.redirect('/');
    });

    router.get('/files', isAdmin, (req, res) => {
        return handler(req, res);
    });

module.exports = router;