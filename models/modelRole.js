// Importation de la connexion à la base de données
var query = require('../database');

// Exportation du modèle MySQL (requêtes...)
module.exports = {
    getRoleById: async function (roleId) {
        // Requête SELECT pour sélectionner tous les utilisateurs
        return await query('SELECT * FROM Roles WHERE ROLE_ID = ?', [roleId]);
    },

    getAll: async function () {
        return await query('SELECT * FROM Roles');
    },
};
