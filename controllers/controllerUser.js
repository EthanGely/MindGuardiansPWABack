// Importation du modèle userModel
var userModel = require('../models/modelUser');

module.exports = {
    getUser: function (req, res) {
        const userId = req.userId;

        userModel.getUserById(function (err, user) {
            if (err) {
                return res.sendStatus(500);
            } else {
                if (user[0]) {
                    res.json({ jwt: req.newToken, userFirstName: user[0]['USER_FIRSTNAME'], userLastName: user[0]['USER_LASTNAME'], libelleRole: '' });
                } else {
                    return res.status(403).json('NO USER FOUND');
                }
            }
        }, userId);
    },
};
