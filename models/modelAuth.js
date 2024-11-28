// Importation de la connexion à la base de données
var db = require('../database');

// Exportation du modèle MySQL (requêtes...)
module.exports = {
    getUser: function (callback, usermail) {
        // Requête SELECT pour sélectionner tous les utilisateurs
        return query(callback, "SELECT * FROM Users WHERE USER_MAIL = '" + usermail + "'");
    },

    createUser: function (callback, userData) {
        let sql = "INSERT INTO Users (USER_MAIL, USER_FIRSTNAME, USER_LASTNAME, USER_PASSWORD, USER_ROLE_ID) VALUES ('" + userData.userMail + "', '" + userData.userFirstName + "', '" + userData.userLastName + "', '" + userData.userPassword + "', " + userData.userRoleId + ')';
        if (userData.userRoleId == 1) {
            sql = "INSERT INTO Users (USER_MAIL, USER_FIRSTNAME, USER_LASTNAME, USER_PASSWORD, USER_ROLE_ID, USER_FONTSIZE, USER_VOLUME, USER_BIRTH) VALUES ('" + userData.userMail + "', '" + userData.userFirstName + "', '" + userData.userLastName + "', '" + userData.userPassword + "', " + userData.userRoleId + ', ' + userData.userFontSize + ', ' + userData.userVolume + ', ' + userData.userAge + ')';
        }

        return db.query(sql, function (err, result) {
            if (err) {
                // En cas d'erreur, transmettez l'erreur au callback
                return callback(err, null);
            } else {
                // En cas de succès, transmettez les résultats au callback
                return query(callback, "SELECT USER_ID FROM Users WHERE USER_MAIL = '" + userData.userMail + "'");
            }
        });
    },
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
