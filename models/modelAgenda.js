// Importation de la connexion à la base de données
var query = require('../database');

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
    getAgendasForUser: async function (userId, dateDebut = 0, dateFin = 0) {
        sql = 'SELECT * FROM Agenda WHERE ID_USER = ?';
        const params = [userId];
        let condition = '';
        if (dateDebut) {
            let signe = dateDebut > 0 ? '<=' : '>=';

            condition += 'AGN_DATEDEBUT ' + signe + ' ?';
            params.push(Math.abs(dateDebut));
        }
        if (condition) {
            condition = ' AND (' + condition;
        }
        let conditionFin = '';
        if (dateFin) {
            let signe = dateFin > 0 ? '<=' : '>=';
            conditionFin += 'AGN_DATEFIN ' + signe + ' ?';
            params.push(Math.abs(dateFin));
        }

        if (conditionFin) {
            if (condition) {
                condition += ' OR ' + conditionFin + ')';
            } else {
                condition = ' AND ' + conditionFin;
            }
        }
        return await query(sql + condition, params);
    },

    getAgenda: async function (userId, ID_AGENDA) {
        sql = 'SELECT * FROM Agenda WHERE ID_USER = ? AND ID_AGENDA = ?';
        return await query(sql, [userId, ID_AGENDA]);
    },

    createAgenda: async function (userId, agendaData) {
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
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
        )`;
        return await query(sql, [userId, agendaData['AGN_TITLE'], agendaData['AGN_DATEDEBUT'], agendaData['AGN_DATEFIN'], agendaData['AGN_DATENOTIFICATION'], agendaData['AGN_REPETITION'], agendaData['AGN_DESCRIPTION'], agendaData['AGN_NOMBREREPETITION'], agendaData['AGN_VIBRATION'], agendaData['AGN_FLASH']]);
    },

    deleteAgenda: async function (userId, ID_AGENDA) {
        const sql = 'DELETE FROM Agenda WHERE ID_AGENDA=? AND ID_USER=?';
        return await query(sql, [ID_AGENDA, userId]);
    },

    updateAgenda: async function (userId, ID_AGENDA, agendaData) {
        const sql = `UPDATE Agenda SET
            AGN_TITLE=?,
            AGN_DATEDEBUT=?,
            AGN_DATEFIN=?,
            AGN_DATENOTIFICATION=?,
            AGN_REPETITION=?,
            AGN_DESCRIPTION=?,
            AGN_NOMBREREPETITION=?,
            AGN_VIBRATION=?,
            AGN_FLASH=?
            WHERE ID_AGENDA = ? AND ID_USER = ?`;
        return await query(sql, [agendaData['AGN_TITLE'], agendaData['AGN_DATEDEBUT'], agendaData['AGN_DATEFIN'], agendaData['AGN_DATENOTIFICATION'], agendaData['AGN_REPETITION'], agendaData['AGN_DESCRIPTION'], agendaData['AGN_NOMBREREPETITION'], agendaData['AGN_VIBRATION'], agendaData['AGN_FLASH'], ID_AGENDA, userId]);
    },

    getAllAgendas: async function () {
        const currentTimestamp = Date.now * 1000;
        sql = 'SELECT * FROM Agenda WHERE';
        sql += ' AGN_DATEDEBUT <= ' + currentTimestamp;
        sql += ' AND AGN_DATEFIN > ' + currentTimestamp;
        return await query(sql);
    },

    getAgendaType: function (ID_AGENDA) {
        sql = 'SELECT at.* FROM Agenda_Type at INNER JOIN Agenda a ON a.AGN_TYPE = at.AGT_ID WHERE a.ID_AGENDA = ?';
        return query(sql, [ID_AGENDA]);
    },
};
