// Importation de la connexion à la base de données
var db = require('../database');

// Exportation du modèle MySQL (requêtes...)
module.exports = {
    getUser: function (callback, usermail) {
        // Requête SELECT pour sélectionner tous les utilisateurs
        return query(callback, "SELECT * FROM Users WHERE USER_MAIL = '" + usermail + "'");
    },

    createUser: function (callback, userFirstName, userLastName, userMail, hashedPassword, userRoleId) {
        const sql = "INSERT INTO Users (USER_MAIL, USER_FIRSTNAME, USER_LASTNAME, USER_PASSWORD, USER_ROLE_ID) VALUES ('" + userMail + "', '" + userFirstName + "', '" + userLastName + "', '" + hashedPassword + "', " + userRoleId + ")";
        
        return db.query(sql, function (err, result) {
            if (err) {
                // En cas d'erreur, transmettez l'erreur au callback
                return callback(err, null);
            } else {
                // En cas de succès, transmettez les résultats au callback
                return query(callback, "SELECT USER_ID FROM Users WHERE USER_MAIL = '" + userMail + "'");
            }
        });
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