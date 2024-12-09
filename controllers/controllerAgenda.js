// Importation du modèle
var agendaModel = require('../models/modelAgenda');

module.exports = {
    getAllForUser: function (req, res) {
        if (req.userId) {
            agendaModel.getAgendasForUser(
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
        if (req.userId && req.body.ID_AGENDA) {
            agendaModel.getAgenda(
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
                req.body.ID_AGENDA
            );
        } else {
            res.sendStatus(500);
        }
    },

    create: function (req, res) {
        if (req.userId && checkAgendaFields(req.body.agendaData)) {
            agendaModel.createAgenda(
                function (err, message) {
                    if (err) {
                        if (process.env.SILENT === 'false') {
                            console.log(err);
                        }
                        return res.sendStatus(500);
                    } else {
                        res.json(message.insertId);
                    }
                },
                req.userId,
                req.body.agendaData
            );
        } else {
            if (process.env.SILENT === 'false') {
                console.log('missing attributes in query');
            }
            res.sendStatus(500);
        }
    },

    delete: function (req, res) {
        if (req.userId && req.body.ID_AGENDA) {
            agendaModel.deleteAgenda(
                function (err, result) {
                    if (err) {
                        if (process.env.SILENT === 'false') {
                            console.log(err);
                        }
                        return res.sendStatus(500);
                    } else {
                        res.json('Deleted Agenda : ' + result.affectedRows);
                    }
                },
                req.userId,
                req.body.ID_AGENDA
            );
        } else {
            res.sendStatus(500);
        }
    },

    update: function (req, res) {
        if (req.userId && req.body.ID_AGENDA && req.body.agendaData && checkAgendaFields(req.body.agendaData)) {
            agendaModel.updateAgenda(
                function (err, result) {
                    if (err) {
                        if (process.env.SILENT === 'false') {
                            console.log(err);
                        }
                        return res.sendStatus(500);
                    } else {
                        res.json('Updated Agenda : ' + result.affectedRows);
                    }
                },
                req.userId,
                req.body.ID_AGENDA,
                req.body.agendaData
            );
        } else {
            if (process.env.SILENT === 'false') {
                console.log('missing attributes in query');
            }
            res.sendStatus(500);
        }
    },

    getForNotif: function () {},
};

function checkAgendaFields(agendaData) {
    if (!agendaData) {
        return false;
    }

    const requiredFields = ['AGN_TITLE', 'AGN_DATEDEBUT', 'AGN_DATEFIN', 'AGN_DATENOTIFICATION'];

    const isRequiredOk = requiredFields.every((field) => agendaData[field]);

    const optionalFields = {
        AGN_REPETITION: '0 0 0 0 0',
        AGN_DESCRIPTION: '',
        AGN_NOMBREREPETITION: 1,
        AGN_VIBRATION: 1,
        AGN_FLASH: 0,
    };

    Object.keys(optionalFields).forEach((field) => {
        if (!agendaData.hasOwnProperty(field)) {
            agendaData[field] = optionalFields[field];
        }
    });

    return isRequiredOk;
}
