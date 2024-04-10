// Importation de la connexion à la base de données
var db = require('../database');

// Exportation du modèle MySQL (requêtes...)
module.exports = {
    getUserById: function (callback, usermail) {
        // Requête SELECT pour sélectionner tous les utilisateurs
        return query(callback, "SELECT * FROM Users WHERE USER_ID = " + usermail);
    }
};

function query(callback, sqlQuery) {
    db.query(sqlQuery, function (err, result) {
        if (err) {
            // En cas d'erreur, transmettez l'erreur au callback
            return callback(err, null);
        } else {
            // En cas de succès, transmettez les résultats au callback
            return callback(null, result);
        }
    });
}