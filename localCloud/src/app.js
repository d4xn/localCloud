const express = require("express");
    fileUpload = require("express-fileupload");
    cors = require("cors");
    morgan = require("morgan");;
    path = require("path");
    handler = require('serve-handler');
    dotenv = require('dotenv').config({ path: path.join(__dirname, './env') });
    session = require("express-session");
    loginRoutes = require('./routes/login');
    uploadRoutes = require('./routes/upload');
    adminRoutes = require('./routes/admin');

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

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sess = {
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
  }
  
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }

app.use(session(sess));

function isAdmin(req, res, next) {
    if (req.session.admin) next();
    else res.redirect('/login');
}

//app.use(isAdmin);

app.use(fileUpload({
    createParentPath: true,
    useTempFiles : true,
    tempFileDir : './temp',
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true
  }));

app.use('/files', express.static(path.join(__dirname, '/../files')));
app.use('/', express.static(path.join(__dirname, '/views')));

app.use(loginRoutes);
app.use(uploadRoutes);
app.use(adminRoutes);

app.get('/*', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '/views/error404.html'));
});

app.listen(port, () => {
    console.log(`App listening at http://192.168.0.49:${port}`);
});