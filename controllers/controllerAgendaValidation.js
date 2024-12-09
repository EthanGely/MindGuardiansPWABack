// Importation du modèle
var agendaValidationModel = require('../models/modelAgendaValidation');

module.exports = {
    getAll: function (req, res) {
        if (req.userId) {
            agendaValidationModel.getAllAgendaValidationForUser(
                function (err, messages) {
                    if (err) {
                        if (process.env.SILENT === 'false') {
                            console.log(err);
                        }
                        return res.sendStatus(500);
                    } else {
                        res.json(messages);
                    }
                },
                req.userId,
                req.body.dateDebut ?? null,
                req.body.dateFin ?? null
            );
        } else {
            res.sendStatus(500);
        }
    },

    get: function (req, res) {
        if (req.userId && req.body.ID_AGENDAVALIDATION) {
            agendaValidationModel.getAgendaValidation(
                function (err, messages) {
                    if (err) {
                        if (process.env.SILENT === 'false') {
                            console.log(err);
                        }
                        return res.sendStatus(500);
                    } else {
                        res.json(messages);
                    }
                },
                req.userId,
                req.body.ID_AGENDAVALIDATION
            );
        } else {
            res.sendStatus(500);
        }
    },

    create: function (req, res) {
        if ((req.body.ID_AGENDA, req.body.AGV_DATEAGENDA)) {
            agendaValidationModel.createAgendaValidation(
                function (err, result) {
                    if (err) {
                        if (process.env.SILENT === 'false') {
                            console.log(err);
                        }
                        return res.sendStatus(500);
                    } else {
                        res.json(result.insertId);
                    }
                },
                req.body.ID_AGENDA,
                req.body.AGV_DATEAGENDA,
                Date.now()
            );
        } else {
            if (process.env.SILENT === 'false') {
                console.log('missing attributes in query');
            }
            res.sendStatus(500);
        }
    },

    delete: function (req, res) {
        if (req.body.ID_AGENDAVALIDATION) {
            agendaValidationModel.deleteAgendaValidation(function (err, result) {
                if (err) {
                    if (process.env.SILENT === 'false') {
                        console.log(err);
                    }
                    return res.sendStatus(500);
                } else {
                    res.json('Deleted Agenda : ' + result.affectedRows);
                }
            }, req.body.ID_AGENDAVALIDATION);
        } else {
            res.sendStatus(500);
        }
    },
};
