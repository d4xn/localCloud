const express = require("express");
    fileUpload = require("express-fileupload");
    cors = require("cors");
    morgan = require("morgan");
    path = require("path");
    handler = require('serve-handler');
    dotenv = require('dotenv').config();
    session = require("express-session");
    loginRoutes = require('./routes/login');
    uploadRoutes = require('./routes/upload');
    adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sess = {
    secret: process.env.SESSION_SECRET,
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

app.use(fileUpload({
    createParentPath: true,
    useTempFiles : true,
    tempFileDir : './temp',
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true
  }));

function isAdmin(req, res, next) {
    if (req.session.token === process.env.ADMIN_TOKEN && 
        req.session.user == process.env.ADMIN_USERNAME) next();
    else res.redirect('/login');
}

app.get('/files/*', isAdmin, (req, res, next) => {
    next();
})

app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/', express.static(path.join(__dirname, '/views')));
app.use('/files', express.static(path.join(__dirname, '/../files')));

app.use(loginRoutes);
app.use(uploadRoutes);
app.use(adminRoutes);

app.get('/*', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '/views/error404.html'));
});

app.listen(port, () => {
    console.log(`App listening at http://192.168.0.49:${port}`);
});