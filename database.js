// Imports
const mysql = require('mysql');
const iniparser = require('iniparser');
const util = require('util');

// Convertion du fichier DB.ini en objet javascript
let configDB = iniparser.parseSync('./DB.ini');

// Création de la connexion à la bdd
let db = mysql.createConnection({
    host: configDB['MindGuardians']['HOST'],
    user: configDB['MindGuardians']['USERNAME'],
    password: configDB['MindGuardians']['PASSWORD'],
    database: configDB['MindGuardians']['DATABASE'],
});
// Connexion à la bdd
db.connect((err) => {
    if (!err) {
        if (process.env.SILENT === 'false') {
            console.log('BDD connectée.');
        }
    } else {
        if (process.env.SILENT === 'false') {
            console.log('BDD connexion échouée \n Erreur: ' + JSON.stringify(err));
        }
    }
});

const query = util.promisify(db.query).bind(db);

// Exportation du module de connexion à la bdd
module.exports = query;
