// Importation de la connexion à la base de données
var db = require('../database');

const Agenda = require('./modelAgenda'); // Import the Agenda model

module.exports = {
    getAllAgendaValidationForUser: function (callback, userId, dateDebut = 0, dateFin = 0) {
        // Use the getAll function from the Agenda model to get all Agendas for the user
        Agenda.getAgendasForUser(
            function (err, agendas) {
                if (err) {
                    return callback(err, null); // Handle error if the Agenda query fails
                }

                if (agendas.length === 0) {
                    return callback(null, []); // No agendas found, return an empty array
                }

                // Extract all the agenda IDs
                const agendaIds = agendas.map((agenda) => agenda.ID_AGENDA);

                // Create the SQL query to get all AgendaPeriode entries for those agenda IDs
                let sql = 'SELECT * FROM Agenda_validation WHERE ID_AGENDA IN (' + agendaIds.join(',') + ')';

                // Optionally filter by dates
                if (dateDebut) {
                    sql += ' AND AGV_DATEAGENDA >= ' + dateDebut;
                }
                if (dateFin) {
                    sql += ' AND AGV_DATEAGENDA <= ' + dateFin;
                }

                // Execute the query
                return query(callback, sql);
            },
            userId,
            dateDebut,
            dateFin
        );
    },

    getAgendaValidationByAgenda: function (callback, ID_AGENDA, dateNotification = 0) {
        let clause = '';
        if (dateNotification) {
            clause = ' AND AGV_DATEAGENDA = ' + dateNotification;
        }
        const sql = `SELECT * FROM Agenda_validation WHERE ID_AGENDA = ${ID_AGENDA}` + clause;
        return query(callback, sql);
    },

    getAgendaValidation: function (callback, userId, ID_AGENDAVALIDATION) {
        sql = `SELECT av.* FROM Agenda_validation av INNER JOIN Agenda ag ON av.ID_AGENDA = ag.ID_AGENDA WHERE ag.ID_USER = ${userId} AND av.ID_AGENDAVALIDATION = ${ID_AGENDAVALIDATION}`;
        return query(callback, sql);
    },

    createAgendaValidation: function (callback, ID_AGENDA, AGV_DATEAGENDA, AGV_DATEVALIDATION) {
        sql = `INSERT INTO Agenda_validation (
        ID_AGENDA,
        AGV_DATEAGENDA,
        AGV_DATEVALIDATION
        ) values (
         ${ID_AGENDA},
         ${AGV_DATEAGENDA},
         ${AGV_DATEVALIDATION}
    )`;
        return query(callback, sql);
    },

    deleteAgendaValidation: function (callback, ID_AGENDAVALIDATION) {
        const sql = `DELETE FROM Agenda_validation WHERE ID_AGENDAVALIDATION=${ID_AGENDAVALIDATION}`;
        return query(callback, sql);
    },

    updateAgendaValidation: function (callback, AGV_DATEAGENDA = null, AGV_DATEVALIDATION = null) {
        let sql = 'UPDATE Agenda_validation SET ';
        sql += AGV_DATEAGENDA !== null ? ' AGV_DATEAGENDA = ' + AGV_DATEAGENDA : '';
        sql += AGV_DATEVALIDATION !== null ? ' AGV_DATEVALIDATION = ' + AGV_DATEVALIDATION : '';
        return query(callback, sql);
    },
};

function query(callback, sqlQuery) {
    db.query(sqlQuery, function (err, result) {
        if (err) {
            return callback(err, null); // Handle query error
        } else {
            return callback(null, result); // Return the result on success
        }
    });
}
