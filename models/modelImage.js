// Importation de la connexion à la base de données
var query = require('../database');

module.exports = {
    getAllForUser: async function (userID, type) {
        let sql = 'SELECT * FROM UPLOADS WHERE ID_USER = ?';
        const params = [userID];
    
        if (type) {
            sql += ' AND UP_TYPE = ?';
            params.push(type);
        }
        return await query(sql, params);
    }
};
