// Importation de la connexion à la base de données
var db = require('../database');

// Exportation du modèle MySQL (requêtes...)
module.exports = {
    /**
     * Renvoie les agendas pour un utilisateur donné.
     * Si une date est positive, la comparaison sera AGN_DATE <= givenDate
     * Si une date est négative, la comparaison sera AGN_DATE >= givenDate
     * @param {function} callback Fonction callback
     * @param {int} userId Id de l'utilisateur
     * @param {int} dateDebut Unix timestamp in seconds
     * @param {int} dateFin Unix timestamp in seconds
     * @returns Agendas
     */
    getAgendasForUser: function (callback, userId, dateDebut = 0, dateFin = 0) {
        sql = 'SELECT * FROM Agenda WHERE ID_USER = ' + userId;
        if (dateDebut) {
            let signe = dateDebut > 0 ? '<=' : '>=';

            sql += ' AND AGN_DATEDEBUT ' + signe + ' ' + Math.abs(dateDebut);
        }

        if (dateFin) {
            let signe = dateFin > 0 ? '<=' : '>=';
            sql += ' AND AGN_DATEFIN ' + signe + ' ' + Math.abs(dateFin);
        }

        return query(callback, sql);
    },

    getAgenda: function (callback, userId, ID_AGENDA) {
        sql = 'SELECT * FROM Agenda WHERE ID_USER = ' + userId + ' AND ID_AGENDA = ' + ID_AGENDA;
        return query(callback, sql);
    },

    createAgenda: function (callback, userId, agendaData) {
        const sql = `INSERT INTO Agenda (
        ID_USER,
        AGN_TITLE,
        AGN_DATEDEBUT,
        AGN_DATEFIN,
        AGN_DATENOTIFICATION,
        AGN_REPETITION,
        AGN_DESCRIPTION,
        AGN_NOMBREREPETITION,
        AGN_VIBRATION,
        AGN_FLASH
        ) VALUES (
        ${userId},
        '${agendaData['AGN_TITLE']}',
        ${agendaData['AGN_DATEDEBUT']},
        ${agendaData['AGN_DATEFIN']},
        ${agendaData['AGN_DATENOTIFICATION']},
        '${agendaData['AGN_REPETITION']}',
        '${agendaData['AGN_DESCRIPTION']}',
        ${agendaData['AGN_NOMBREREPETITION']},
        ${agendaData['AGN_VIBRATION']},
        ${agendaData['AGN_FLASH']}
        )`;
        return query(callback, sql);
    },

    deleteAgenda: function (callback, userId, ID_AGENDA) {
        const sql = 'DELETE FROM Agenda WHERE ID_AGENDA=' + ID_AGENDA + ' AND ID_USER=' + userId;
        return query(callback, sql);
    },

    updateAgenda: function (callback, userId, ID_AGENDA, agendaData) {
        const sql = `UPDATE Agenda SET
            AGN_TITLE='${agendaData['AGN_TITLE']}',
            AGN_DATEDEBUT='${agendaData['AGN_DATEDEBUT']}',
            AGN_DATEFIN='${agendaData['AGN_DATEFIN']}',
            AGN_DATENOTIFICATION='${agendaData['AGN_DATENOTIFICATION']}',
            AGN_REPETITION='${agendaData['AGN_REPETITION']}',
            AGN_DESCRIPTION='${agendaData['AGN_DESCRIPTION']}',
            AGN_NOMBREREPETITION='${agendaData['AGN_NOMBREREPETITION']}',
            AGN_VIBRATION='${agendaData['AGN_VIBRATION']}',
            AGN_FLASH='${agendaData['AGN_FLASH']}'
            WHERE ID_AGENDA = ${ID_AGENDA} AND ID_USER = ${userId}`;
        return query(callback, sql);
    },

    getAllAgendas: function (callback, userId, ID_AGENDA) {
        const currentTimestamp = Date.now * 1000;
        sql = 'SELECT * FROM Agenda WHERE';
        sql += ' AGN_DATEDEBUT <= ' + currentTimestamp;
        sql += ' AND AGN_DATEFIN > ' + currentTimestamp;
        return query(callback, sql);
    },

    getAgendaType: function (callback, ID_AGENDA) {
        sql = 'SELECT at.* FROM Agenda_Type at INNER JOIN Agenda a ON a.AGN_TYPE = at.AGT_ID WHERE a.ID_AGENDA = ' + ID_AGENDA;
        return query(callback, sql);
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
