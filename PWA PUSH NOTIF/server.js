// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
const webPush = require('web-push');
const express = require('express');
const { createServer } = require('node:http');
const cors = require('cors');
const dotenv = require('dotenv');
const port = 8443;

dotenv.config();

// Certificates
var fs = require('fs');
var https = require('https');
const { log } = require('node:console');
var privateKey = fs.readFileSync('/etc/apache2/private.key', 'utf8');
var certificate = fs.readFileSync('/etc/apache2/certificate.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

// Https server
const app = express();
var httpsServer = https.createServer(credentials, app);

const publicKey2 = 'BCVML0Z59LjauyeJSQh5jqGXgohhzXga9YUQWFhcOPxg2XIl0zfZmnglrvieXkWuqawmbNtVAINWH9-euXBhvFE';
const privateKey2 = 'tnE1IeX8IkL-r5PH_yNGFrNbzTQ3MCaptMNkkXfKxYc';

if (!publicKey2 || !privateKey2) {
    console.log('You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY ' + 'environment variables. You can use the following ones:');

    console.log(webPush.generateVAPIDKeys());
    return;
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails('https://ethan-server.com/', publicKey2, privateKey2);

app.use(express.json());
app.use(cors());

app.get('/index.html', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/index.ico', function (req, res) {
    res.sendFile('index.ico', { root: __dirname });
});

app.get('/icon.ico', function (req, res) {
    console.log('icon.ico');
    res.sendFile('icon.ico', { root: __dirname });
});
app.get('/index.js', function (req, res) {
    res.sendFile('index.js', { root: __dirname });
});

app.get('/tools.js', function (req, res) {
    res.sendFile('tools.js', { root: __dirname });
});

app.get('/service-worker.js', function (req, res) {
    res.sendFile('service-worker.js', { root: __dirname });
});

app.get('/vapidPublicKey', function (req, res) {
    res.send(publicKey2);
});

app.post('/register', function (req, res) {
    // A real world application would store the subscription info.
    const sub = req.body.subscription;
    const stingSub = JSON.stringify(sub);
    console.log('---------------------');
    console.log(sub);
    console.log('---------------------');
    console.log(stingSub);
    console.log('---------------------');
    console.log(JSON.parse(stingSub));

    res.sendStatus(201);
});

app.post('/sendNotification', function (req, res) {
    const subscription = req.body.subscription;
    const title = req.body.title;
    const payload = req.body.payload;
    const image = '/icon.ico';

    const response = JSON.stringify({ title: title, payload: payload, image: image });

    const options = {
        topic: 'notificationtopic',
    };

    webPush
        .sendNotification(subscription, response, options)
        .then(function (result) {
            console.log('Notification sent successfully:', result);
        })
        .catch(function (error) {
            console.log('Error sending notification:', error);
        });
});

httpsServer.listen(port, () => {
    console.log('server running on port :' + port);
});
