// Importation du modèle
var agendaValidationModel = require('../models/modelAgendaValidation');

module.exports = {
    getAll: async function (req, res) {
        if (req.userId) {
            const agendaValidation = await agendaValidationModel.getAllAgendaValidationForUser(req.userId, req.body.dateDebut ?? null, req.body.dateFin ?? null);
            return res.json(agendaValidation);
        }
        res.sendStatus(500);
    },

    get: async function (req, res) {
        if (req.userId && req.body.ID_AGENDAVALIDATION) {
            const agendaValidation = await agendaValidationModel.getAgendaValidation(req.userId, req.body.ID_AGENDAVALIDATION);
            return res.json(agendaValidation);
        }
        res.sendStatus(500);
    },

    create: async function (req, res) {
        if ((req.body.ID_AGENDA, req.body.AGV_DATEAGENDA)) {
            const agendaValidation = await agendaValidationModel.createAgendaValidation(req.body.ID_AGENDA, req.body.AGV_DATEAGENDA, Date.now());
            return res.json(agendaValidation.insertId);
        }
        res.sendStatus(500);
    },

    delete: async function (req, res) {
        if (req.body.ID_AGENDAVALIDATION) {
            const agendaValidation = await agendaValidationModel.deleteAgendaValidation(req.body.ID_AGENDAVALIDATION);
            return res.json('Deleted Agenda : ' + agendaValidation.affectedRows);
        }
        res.sendStatus(500);
    },
};
