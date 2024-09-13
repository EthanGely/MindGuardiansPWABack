// Importation de la connexion à la base de données
var db = require('../database');

// Exportation du modèle MySQL (requêtes...)
module.exports = {
    getRoomsForUser: function (callback, userId) {
        return query(callback, "SELECT Room.ROOM_LIBELLE, Room.ID_ROOM FROM Room INNER JOIN Room_User ru ON Room.ID_ROOM = ru.ID_ROOM WHERE ru.ID_USER = " + userId);
    },

    createRoom: function (callback, userId, roomName) {
        const sql = "INSERT INTO Room (ROOM_LIBELLE) VALUES ('" + roomName + "')";

        return db.query(sql, function (err, result) {
            if (err) {
                // En cas d'erreur, transmettez l'erreur au callback
                return callback(err, null);
            } else {
                // En cas de succès, transmettez les résultats au callback
                return query(callback, "INSERT INTO Room_User (ID_ROOM, ID_USER) VALUES (" + result.insertId + ", " + userId + ")");
            }
        });
    },

    getMessages: function (callback, userId, roomId) {
        return query(callback, "SELECT Room.ROOM_LIBELLE, rm.ID_USER, rm.MESSAGE, rm.MESSAGE_TIME, u.USER_FIRSTNAME, u.USER_LASTNAME FROM Room INNER JOIN Room_User ru ON Room.ID_ROOM = ru.ID_ROOM INNER JOIN Room_Message rm ON Room.ID_ROOM = rm.ID_ROOM INNER JOIN Users u ON rm.ID_USER = u.USER_ID WHERE Room.ID_ROOM = " + roomId + " AND ru.ID_USER = " + userId + " ORDER BY rm.MESSAGE_TIME ASC");
    },

    postMessage: function (callback, userId, roomId, message) {
        const sql = `SELECT ID_ROOM_USER FROM Room_User WHERE ID_ROOM = ${roomId} AND ID_USER = ${userId}`;

        return db.query(sql, function (err, result) {
            if (err) {
                // En cas d'erreur, transmettez l'erreur au callback
                return callback(err, null);
            } else {
                // En cas de succès, transmettez les résultats au callback
                return query(callback, `INSERT INTO Room_Message (ID_ROOM_USER, MESSAGE, MESSAGE_TIME) values (${result[0].ID_ROOM_USER}, '${message}', ${Date.now()})`);
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