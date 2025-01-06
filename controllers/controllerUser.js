// Importation du modèle userModel
var userModel = require('../models/modelUser');

module.exports = {
    getUser: async function (req, res) {
        const userId = req.userId;

        const users = await userModel.getUserById(userId);
        if (users && users[0]) {
            res.json({ jwt: req.newToken, userFirstName: users[0]['USER_FIRSTNAME'], userLastName: users[0]['USER_LASTNAME'], libelleRole: '', user: users[0] });
        } else {
            return res.status(403).json('NO USER FOUND');
        }
    },
    getUsersForDoctor: async function (req, res) {
        if (process.env.SILENT === 'false') {
            console.log('Trying to get users for doctor');
        }
        const userId = req.userId;
        const users = await userModel.getUsersForDoctor(userId);
        if (users) {
            res.json({ jwt: req.newToken, users: users });
        } else {
            return res.status(403).json('NO USER FOUND');
        }
    },

    getUserForDoctor: async function (req, res) {
        if (process.env.SILENT === 'false') {
            console.log('Trying to get user for doctor');
        }
        const userId = req.userId;
        const patientId = req.body.patientId;
        
        if (!userId || !patientId) {
            if (process.env.SILENT === 'false') {
                console.log('Missing parameters :', userId, patientId);
            }
            return res.sendStatus(400);
        }

        const users = await userModel.getUserForDoctor(userId, patientId);
        if (users && users[0]) {
            res.json({ jwt: req.newToken, user: users[0] });
        } else {
            return res.status(403).json('NO USER FOUND');
        }
    }
};
