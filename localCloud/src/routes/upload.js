const express = require('express');
    router = express.Router();
    session = require("express-session");
    path = require('path');

    function isAdmin(req, res, next) {
        if (req.session.admin) next();
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

        for (let i = 0; i < req.files.myFiles.length; i++) {
            const file = req.files.myFiles[i];
    
            const extensionName = path.extname(file.name); // fetch the file extension
        
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

        return res.redirect('/');
    });

    router.get('/files', isAdmin, (req, res) => {
        return handler(req, res);
    });

module.exports = router;