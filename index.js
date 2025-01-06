//___________________________________________________________//
/////////////////////////-- IMPORTS --/////////////////////////
// Sentry
require('./instrument.js');
const Sentry = require('@sentry/node');
// Base imports
const express = require('express');
const { createServer } = require('node:http');
const cors = require('cors');
const Socket = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('./database');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Routers imports
const RouterDefault = require('./routes/routeDefault');
const RouterAuth = require('./routes/routeAuth');
const RouterUser = require('./routes/routeUser');
const RouterRole = require('./routes/routeRole');
const RouterChat = require('./routes/routeChat');
const RouterAgenda = require('./routes/routeAgenda');
const RouterAgendaValidation = require('./routes/routeAgendaValidation');
const RouterPushNotif = require('./routes/routePushNotif');
const RouterImage = require('./routes/routeImage');

//___________________________________________________________//
/////////////////////////-- LOGS SETTINGS --/////////////////////////
// process.env.SILENT mode
const minimumLog = true;

//_________________________________________________________________//
/////////////////////////-- SERVER CONFIG --/////////////////////////
// Env variables
dotenv.config();

// Certificates
var https = require('https');
var privateKey = fs.readFileSync('/etc/apache2/private.key', 'utf8');
var certificate = fs.readFileSync('/etc/apache2/certificate.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

webPush.setVapidDetails('https://ethan-server.com/', process.env.PUBLICKEYPUSH, process.env.PRIVATEKEYPUSH);

// Https server
const app = express();
var httpsServer = https.createServer(credentials, app);

// Port
const port = 8443;

// Socket IO
const io = new Socket.Server(httpsServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// File upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.params.folder; // Get folder name from route parameter
        const uploadPath = path.join('/var/www/MindGuardians/Uploads', folder);

        // Ensure the folder exists
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }
            cb(null, uploadPath);
        });
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Default uses
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('body-parser').json());
app.use(cors());

//__________________________________________________________//
/////////////////////////-- ROUTES --/////////////////////////
app.get('/index.ico', function (req, res) {
    res.sendFile('index.ico', { root: __dirname });
});

// Default route -- public
app.use('/', RouterDefault);

// Auth route -- public
app.use('/auth', RouterAuth);

// User route -- private
app.use('/user', (req, res, next) => {
    authMiddleware(req, res, next);
});
app.use('/user', RouterUser);

// Role route -- public ?
app.use('/role', RouterRole);

// Chat route -- private
app.use('/chat', (req, res, next) => {
    authMiddleware(req, res, next);
});
app.use('/chat', RouterChat);

// Agenda route -- private
app.use('/agenda', (req, res, next) => {
    authMiddleware(req, res, next);
});
app.use('/agenda', RouterAgenda);

// AgendaValidation route -- private
app.use('/agendaValidation', (req, res, next) => {
    authMiddleware(req, res, next);
});
app.use('/agendaValidation', RouterAgendaValidation);

app.use('/pushNotif', (req, res, next) => {
    authMiddleware(req, res, next);
});
app.use('/pushNotif', RouterPushNotif);

app.use('/upload/puzzle', (req, res, next) => {
    authMiddleware(req, res, next);
});

app.post('/upload/puzzle', upload.single('puzzle'), (req, res) => {
    res.sendStatus(200);
});

app.use('/uploads', express.static(path.join('/var/www/MindGuardians/Uploads')));

app.use('/images', (req, res, next) => {
    authMiddleware(req, res, next);
});

app.use('/images', RouterImage);

//_____________________________________________________________//
/////////////////////////-- UTILITIES --/////////////////////////
function authMiddleware(req, res, next) {
    if (req && req.headers && req.headers.authorization) {
        const token = req.headers.authorization;
        if (token) {
            const decodedToken = authenticateToken(token);
            if (decodedToken) {
                req.userId = decodedToken.userId;
                req.newToken = generateJWT(decodedToken.userId);
                res.token = req.newToken;
                next();
            } else {
                if (process.env.SILENT === 'false') {
                    console.log('Could not decode token');
                }
                res.status(500).json('Token expired');
            }
        } else {
            if (process.env.SILENT === 'false') {
                console.log('No token found');
            }
            res.sendStatus(400);
        }
    } else {
        if (process.env.SILENT === 'false') {
            console.log('Issue in request for token');
        }
        res.sendStatus(400);
    }
}

function authenticateToken(completeToken) {
    const token = completeToken && completeToken.split(' ')[1];

    if (token == null) {
        if (process.env.SILENT === 'false') {
            console.log('Error reading token : NO TOKEN');
        }
        return false;
    }

    return jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            if (process.env.SILENT === 'false') {
                console.log('Error checking token :', err);
            }
            return false;
        }
        return decoded;
    });
}

function generateJWT(userId) {
    const payload = { userId: userId };
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

//_______________________________________________________________________//
/////////////////////////-- Socket IO functions --/////////////////////////
io.on('connection', (socket) => {
    socket.on('getMessages', (token, roomId) => {
        if (token) {
            const decodedToken = authenticateToken(token);
            const userId = decodedToken ? decodedToken.userId : null;

            if (userId) {
                const messages = db.query('SELECT c.CHAT_LIBELLE, cm.ID_USER, cm.MESSAGE, cm.MESSAGE_TIME, u.USER_FIRSTNAME, u.USER_LASTNAME FROM Chat c INNER JOIN Chat_User cu ON c.ID_CHAT = cu.ID_CHAT INNER JOIN Chat_Message cm ON c.ID_CHAT = cm.ID_CHAT INNER JOIN Users u ON cm.ID_USER = u.USER_ID WHERE c.ID_CHAT = ' + roomId + ' AND cu.ID_USER = ' + userId + ' ORDER BY cm.MESSAGE_TIME ASC');
                if (process.env.SILENT === 'false') {
                    console.log(messages);
                }
            }
        }
    });

    socket.on('sendMessage', (token, roomId, message) => {
        if (token) {
            const decodedToken = authenticateToken(token);
            const userId = decodedToken ? decodedToken.userId : null;

            if (userId) {
                const sql = `SELECT ID_ROOM_USER FROM Room_User WHERE ID_ROOM = ${roomId} AND ID_USER = ${userId}`;
                const result = db.query(sql);

                if (result && result[0] && result[0].ID_ROOM_USER) {
                    db.query(callback, `INSERT INTO Room_Message (ID_ROOM_USER, MESSAGE, MESSAGE_TIME) values (${result[0].ID_ROOM_USER}, '${message}', ${Date.now()})`);
                    socket.emit();
                }
            }
        }
    });

    socket.on('disconnect', () => {});
});

if (process.env.PRODUCTION === 'true') {
    Sentry.setupExpressErrorHandler(app);
}

//_________________________________________________________________//
/////////////////////////-- SERVER START --/////////////////////////
httpsServer.listen(port, () => {
    if (process.env.SILENT === 'false') {
        console.log('server running on port :' + port);
    } else if (minimumLog) {
        console.log('Running');
    }
});

//________________________________________________________//
/////////////////////////-- EOF --/////////////////////////
