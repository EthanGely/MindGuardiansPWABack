// Importation du modèle
var agendaModel = require('../models/modelAgenda');

module.exports = {
    getAllForUser: async function (req, res) {
        if (req.userId) {
            const result = await agendaModel.getAgendasForUser(req.userId, req.body.dateDebut ?? null, req.body.dateFin ?? null);
            if (!result) {
                if (process.env.SILENT === 'false') {
                    console.log(result);
                }
                return res.sendStatus(500);
            } else {
                return res.json(result);
            }
        }
        return res.sendStatus(500);
    },

    get: async function (req, res) {
        if (req.userId && req.body.ID_AGENDA) {
            const result = await agendaModel.getAgenda(req.userId, req.body.ID_AGENDA);
            if (!result) {
                if (process.env.SILENT === 'false') {
                    console.log(result);
                }
                return res.sendStatus(500);
            } else {
                return res.json(result);
            }
        }
        res.sendStatus(500);
    },

    create: async function (req, res) {
        if (req.userId && checkAgendaFields(req.body.agendaData)) {
            const result = await agendaModel.createAgenda(req.userId, req.body.agendaData);
            if (!result) {
                if (process.env.SILENT === 'false') {
                    console.log(result);
                }
                return res.sendStatus(500);
            } else {
                return res.json(result.insertedId);
            }
        } else {
            if (process.env.SILENT === 'false') {
                console.log('missing attributes in query');
            }
            res.sendStatus(500);
        }
    },

    delete: async function (req, res) {
        if (req.userId && req.body.ID_AGENDA) {
            const result = await agendaModel.deleteAgenda(req.userId, req.body.ID_AGENDA);
            if (!result) {
                return res.sendStatus(500);
            } else {
                res.json('Deleted Agenda : ' + result.affectedRows);
            }
        } else {
            res.sendStatus(500);
        }
    },

    update: async function (req, res) {
        if (process.env.SILENT === 'false') {
            console.log('Try updating agenda');
        }
        if (req.userId && req.body.ID_AGENDA && req.body.agendaData && checkAgendaFields(req.body.agendaData)) {
            if (process.env.SILENT === 'false') {
                console.log('Updating agenda');
            }

            const result = await agendaModel.updateAgenda(req.userId, req.body.ID_AGENDA, req.body.agendaData);

            if (!result) {
                return res.sendStatus(500);
            } else {
                res.json('Deleted Agenda : ' + result.affectedRows);
            }
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
