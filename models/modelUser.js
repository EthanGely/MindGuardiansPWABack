// Importation de la connexion à la base de données
var query = require('../database');

// Exportation du modèle MySQL (requêtes...)
module.exports = {
    getUserById: async function (usermail) {
        return await query('SELECT * FROM Users WHERE USER_ID = ?', [usermail]);
    },

    getUsersByRole: async function (USER_ROLE_ID) {
        return await query('SELECT * FROM Users WHERE USER_ROLE_ID = ?', [USER_ROLE_ID]);
    },

    setUserPushSubscription: async function (userId, subscription) {
        return await query("UPDATE Users SET USER_PUSH_SUBSCRIPTION = ? WHERE USER_ID = ?", [subscription, userId]);
    },

    removeUserPushSubscription: async function (userId) {
        return await query('UPDATE Users SET USER_PUSH_SUBSCRIPTION = NULL WHERE USER_ID = ?', [userId]);
    },

    getUsersForDoctor: async function (userId) {
        return await query('SELECT u.* FROM Users as u INNER JOIN Lien_Patient as l ON u.USER_ID = l.ID_PATIENT WHERE l.ID_USERLIE = ? AND u.USER_ROLE_ID = 1 AND TYPE_LIENPATIENT = "LIEN_DOCTEUR"', [userId]);
    },

    getUserForDoctor: async function (userId, patientId) {
        return await query('SELECT u.* FROM Users as u INNER JOIN Lien_Patient as l ON u.USER_ID = l.ID_PATIENT WHERE l.ID_USERLIE = ? AND u.USER_ROLE_ID = 1 AND TYPE_LIENPATIENT = "LIEN_DOCTEUR" AND u.USER_ID = ?', [userId, patientId]);
    }
};
