// Importation de la connexion à la base de données
var query = require('../database');

const Agenda = require('./modelAgenda'); // Import the Agenda model

module.exports = {
    getAllAgendaValidationForUser: async function (userId, dateDebut = 0, dateFin = 0) {
        // Use the getAll function from the Agenda model to get all Agendas for the user
        const agendas = await Agenda.getAgendasForUser(userId, dateDebut, dateFin);

        if (agendas.length === 0) {
            return []; // No agendas found, return an empty array
        }

        let sql = 'SELECT * FROM Agenda_validation WHERE ID_AGENDA IN (' + agendas.map(() => '?').join(',') + ')';
        const params = agendas.map((agenda) => agenda.ID_AGENDA); // Extract agenda IDs

        // Optionally filter by dates
        if (dateDebut) {
            sql += ' AND AGV_DATEAGENDA >= ?';
            params.push(dateDebut);
        }

        if (dateFin) {
            sql += ' AND AGV_DATEAGENDA <= ?';
            params.push(dateFin);
        }

        // Execute the query
        return await query(sql, params);
    },

    getAgendaValidationByAgenda: async function (ID_AGENDA, dateNotification = 0) {
        let clause = '';
        const parameters = [ID_AGENDA];

        if (dateNotification) {
            clause = ' AND AGV_DATEAGENDA = ' + dateNotification;
            parameters.push(dateNotification);
        }
        const sql = `SELECT * FROM Agenda_validation WHERE ID_AGENDA = ?` + clause;
        return await query(sql, parameters);
    },

    getAgendaValidation: async function (userId, ID_AGENDAVALIDATION) {
        sql = `SELECT av.* FROM Agenda_validation av INNER JOIN Agenda ag ON av.ID_AGENDA = ag.ID_AGENDA WHERE ag.ID_USER = ? AND av.ID_AGENDAVALIDATION = ?`;
        return await query(sql, [userId, ID_AGENDAVALIDATION]);
    },

    createAgendaValidation: async function (ID_AGENDA, AGV_DATEAGENDA, AGV_DATEVALIDATION) {
        sql = `INSERT INTO Agenda_validation (
        ID_AGENDA,
        AGV_DATEAGENDA,
        AGV_DATEVALIDATION
        ) values (
         ?,
         ?,
         ?)`;
        return await query(sql, [ID_AGENDA, AGV_DATEAGENDA, AGV_DATEVALIDATION]);
    },

    deleteAgendaValidation: async function (ID_AGENDAVALIDATION) {
        const sql = `DELETE FROM Agenda_validation WHERE ID_AGENDAVALIDATION=?`;
        return await query(sql, [ID_AGENDAVALIDATION]);
    },

    updateAgendaValidation: async function (AGV_DATEAGENDA = null, AGV_DATEVALIDATION = null) {
        if (AGV_DATEAGENDA === null && AGV_DATEVALIDATION === null) {
            return false;
        }

        let sql = 'UPDATE Agenda_validation SET ';
        params = [];
        if (AGV_DATEAGENDA !== null) {
            sql += ' AGV_DATEAGENDA = ?';
            params.push(AGV_DATEAGENDA);
        }

        if (AGV_DATEVALIDATION !== null) {
            if (params.length > 0) {
                sql += ',';
            }

            sql += ' AGV_DATEVALIDATION = ?';
            params.push(AGV_DATEVALIDATION);
        }
        return await query(sql, params);
    },
};
