//___________________________________________________________//
/////////////////////////-- IMPORTS --/////////////////////////
// Base imports
const express = require('express');
const { createServer } = require('node:http');
const cors = require('cors');
const Socket = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('./database');
const bodyParser = require("body-parser");

// Routers imports
const RouterDefault = require("./routes/routeDefault");
const RouterAuth = require("./routes/routeAuth");
const RouterUser = require("./routes/routeUser");
const RouterRole = require("./routes/routeRole");
const RouterChat = require("./routes/routeChat");

//_________________________________________________________________//
/////////////////////////-- SERVER CONFIG --/////////////////////////
// Env variables
dotenv.config();

// Certificates
var fs = require('fs');
var https = require('https');
var privateKey = fs.readFileSync('/etc/apache2/private.key', 'utf8');
var certificate = fs.readFileSync('/etc/apache2/certificate.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

// Https server
const app = express();
var httpsServer = https.createServer(credentials, app);

// Port
const port = 8443;

// Socket IO
const io = new Socket.Server(httpsServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Default uses
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('body-parser').json())
app.use(cors());

//__________________________________________________________//
/////////////////////////-- ROUTES --/////////////////////////
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

app.use('/chat', (req, res, next) => {
    authMiddleware(req, res, next);
})

app.use('/chat', RouterChat);

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
                next();
            } else {
                console.log("Could not decode token");
                res.sendStatus(500);
            }
        } else {
            console.log("No token found")
            res.sendStatus(400);
        }
    } else {
        console.log("Issue in request for token")
        res.sendStatus(400);
    }
}

function authenticateToken(completeToken) {
    const token = completeToken && completeToken.split(' ')[1]

    if (token == null) {
        console.log("Error reading token : NO TOKEN");
        return false;
    }

    return jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log("Error checking token :", err);
            return false;
        }
        return decoded;
    })
}

function generateJWT(userId) {
    const payload = { userId: userId };
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

//_______________________________________________________________________//
/////////////////////////-- Socket IO functions --/////////////////////////
io.on('connection', (socket) => {
    socket.on("getMessages", (token, roomId) => {
        if (token) {
            const decodedToken = authenticateToken(token);
            const userId = decodedToken ? decodedToken.userId : null;

            if (userId) {
                const messages = db.query("SELECT c.CHAT_LIBELLE, cm.ID_USER, cm.MESSAGE, cm.MESSAGE_TIME, u.USER_FIRSTNAME, u.USER_LASTNAME FROM Chat c INNER JOIN Chat_User cu ON c.ID_CHAT = cu.ID_CHAT INNER JOIN Chat_Message cm ON c.ID_CHAT = cm.ID_CHAT INNER JOIN Users u ON cm.ID_USER = u.USER_ID WHERE c.ID_CHAT = " + roomId + " AND cu.ID_USER = " + userId + " ORDER BY cm.MESSAGE_TIME ASC");
                console.log(messages);
            }
        }
    });

    socket.on("sendMessage", (token, roomId, message) => {
        if (token) {
            const decodedToken = authenticateToken(token);
            const userId = decodedToken ? decodedToken.userId : null;

            if (userId) {
                const sql = `SELECT ID_ROOM_USER FROM Room_User WHERE ID_ROOM = ${roomId} AND ID_USER = ${userId}`;
                const result = db.query(sql);

                if (result && result[0] && result[0].ID_ROOM_USER) {
                    db.query(callback, `INSERT INTO Room_Message (ID_ROOM_USER, MESSAGE, MESSAGE_TIME) values (${result[0].ID_ROOM_USER}, '${message}', ${Date.now()})`);
                    socket.emit()
                }
            }
        }
    });

    socket.on('disconnect', () => {
    });

});

//_________________________________________________________________//
/////////////////////////-- SERVER START --/////////////////////////
httpsServer.listen(port, () => {
    console.log('server running on port :' + port);
});

//________________________________________________________//
/////////////////////////-- EOF --/////////////////////////