// Importation de la connexion à la base de données
var query = require('../database');

// Exportation du modèle MySQL (requêtes...)
module.exports = {
    getUser: async function (usermail) {
        return await query("SELECT * FROM Users WHERE USER_MAIL = ?", [usermail]);
    },

    getUserById: async function (userId) {
        return await query('SELECT * FROM Users WHERE USER_ID = ?', [userId]);
    },

    createUser: async function (userData) {
        if (userData.userRoleId == 1) {
            let sql = 'INSERT INTO Users (USER_MAIL, USER_FIRSTNAME, USER_LASTNAME, USER_PASSWORD, USER_ROLE_ID, USER_SEXE, USER_FONTSIZE, USER_VOLUME, USER_BIRTH, USER_HEUREREVEIL, USER_HEURECOUCHER) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            return await query(sql, [userData.userMail, userData.userFirstName, userData.userLastName, userData.userPassword, userData.userRoleId, userData.userSexe, userData.userFontSize, userData.userVolume, userData.userBirth, userData.userHeureReveil, userData.userHeureCoucher]);
        }
        let sql = 'INSERT INTO Users (USER_MAIL, USER_FIRSTNAME, USER_LASTNAME, USER_PASSWORD, USER_ROLE_ID, USER_SEXE) VALUES (?, ?, ?, ?, ?, ?)';
        return await query(sql, [userData.userMail, userData.userFirstName, userData.userLastName, userData.userPassword, userData.userRoleId, userData.userSexe]);
    },
};
