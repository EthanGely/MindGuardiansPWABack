//Importaion du module mysql et iniparser
const mysql = require('mysql');
const iniparser = require('iniparser');

//Convertion du fichier DB.ini en objet javascript
let configDB = iniparser.parseSync('./DB.ini');

//Création de la connexion à la bdd
let mysqlconnexion = mysql.createConnection({
    host: configDB['MindGuardians']['HOST'],
    user: configDB['MindGuardians']['USERNAME'],
    password: configDB['MindGuardians']['PASSWORD'],
    database: configDB['MindGuardians']['DATABASE'],
});
mysqlconnexion.connect((err) => {
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

//Exportation du module de connexion à la bdd
module.exports = mysqlconnexion;
