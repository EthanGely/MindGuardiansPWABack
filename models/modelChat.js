// Importation de la connexion à la base de données
var query = require('../database');

// Exportation du modèle MySQL (requêtes...)
module.exports = {
    getRoomsForUser: async function (userId) {
        return await query('SELECT Room.ROOM_LIBELLE, Room.ID_ROOM FROM Room INNER JOIN Room_User ru ON Room.ID_ROOM = ru.ID_ROOM WHERE ru.ID_USER = ?', [userId]);
    },

    createRoom: async function (userId, roomName) {
        const sql = "INSERT INTO Room (ROOM_LIBELLE) VALUES ('?')";
        const result = await query(sql, [roomName]);
        return await query('INSERT INTO Room_User (ID_ROOM, ID_USER) VALUES (?, ?)', [result.insertId, userId]);
    },

    getMessages: async function (userId, roomId) {
        return await query('SELECT Room.ROOM_LIBELLE, rm.ID_USER, rm.MESSAGE, rm.MESSAGE_TIME, u.USER_FIRSTNAME, u.USER_LASTNAME FROM Room INNER JOIN Room_User ru ON Room.ID_ROOM = ru.ID_ROOM INNER JOIN Room_Message rm ON Room.ID_ROOM = rm.ID_ROOM INNER JOIN Users u ON rm.ID_USER = u.USER_ID WHERE Room.ID_ROOM = ? AND ru.ID_USER = ? ORDER BY rm.MESSAGE_TIME ASC', [roomId, userId]);
    },

    postMessage: async function (userId, roomId, message) {
        const sql = `SELECT ID_ROOM_USER FROM Room_User WHERE ID_ROOM = ? AND ID_USER = ?`;
        const room = await query(sql, [roomId, userId]);
        if (room.length === 0) {
            return null;
        }
        return await query('INSERT INTO Room_Message (ID_ROOM, ID_USER, MESSAGE, MESSAGE_TIME) VALUES (?, ?, ?, ?)', [roomId, userId, message, Date.now()]);

    },
};
