const express = require('express');
const { createServer } = require('node:http');
const cors = require('cors');
const RouterDefault = require("./routes/routeDefault");
const RouterAuth = require("./routes/routeAuth");
const RouterUser = require("./routes/routeUser");
const RouterRole = require("./routes/routeRole");
const bodyParser = require("body-parser");

var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('/etc/apache2/private.key', 'utf8');
var certificate = fs.readFileSync('/etc/apache2/certificate.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};


const app = express();
var httpsServer = https.createServer(credentials, app);
//const server = createServer(app);

const port = 8443;

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(require('body-parser').json())
app.use(cors());


app.use('/', RouterDefault);
app.use('/auth/', RouterAuth);
app.use('/user/', RouterUser);
app.use('/role/', RouterRole);



httpsServer.listen(port, () => {
    console.log('server running on port :' + port);
});
