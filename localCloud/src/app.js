/*
meter auth (passport, jwt, express-session, sqlite, json, dotenv),
mejorar el frontend (vue o otros),
poder subir mas de 1 archivo a la vez (multer)
probar a hacerlo sin vue
*/

const express = require("express");
    fileUpload = require("express-fileupload");
    cors = require("cors");
    morgan = require("morgan");;
    path = require("path");
    handler = require('serve-handler');
    dotenv = require("dotenv").config();
    //loginRoutes = require('./routes/login');
    //uploadRoutes = require('./routes/upload');
    //adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());

app.options('*',cors());
var allowCrossDomain = function(req,res,next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
app.use(allowCrossDomain);

app.use(morgan('dev'))
app.use(fileUpload({
    createParentPath: true,
    useTempFiles : true,
    tempFileDir : '/temp/',
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true
  }));

app.use('/files', express.static(path.join(__dirname, '/../files')));
app.use('/', express.static(path.join(__dirname, '/views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/upload.html'));
});

app.get('/files', (req, res) => {
    return handler(req, res);
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/admin.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'));
});

app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(400).sendFile(path.join(__dirname, '/views/errorUpload.html'));
    }

    const file = req.files.myFile;

    const extensionName = path.extname(file.name); // fetch the file extension
    const blockedExtensions = ['.php','.phtml', '.php4', '.php5', '.sh', '.bat', '.cmd'];

    if(blockedExtensions.includes(extensionName)){
        return res.status(422).sendFile(path.join(__dirname, '/views/errorUpload.html'));
    }

    const filePath = __dirname + '/../files/' + file.name;

    file.mv(filePath, (err) => {
        if (err) {
            return res.status(500).sendFile(path.join(__dirname, '/views/errorUpload.html'));
        }
        return res.redirect('/');
  });
});

/*
app.get('/error/upload', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/error/404', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/index.html'));
});
*/

// Hacer rutas login (auth) y admin (cambio de username & password)

/*
app.get('/logout', (req, res) => {

});
*/

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/error404.html'));
});

app.listen(port, () => {
    console.log(`App listening at http://192.168.0.49:${port}`);
});