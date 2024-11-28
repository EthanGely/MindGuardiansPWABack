// Importation du modèle userModel
var roleModel = require('../models/modelRole');

module.exports = {
    getAll: function (req, res) {
        roleModel.getAll(function (err, roles) {
            if (err) {
                return res.sendStatus(500);
            } else {
                if (roles) {
                    res.json(roles);
                } else {
                    return res.status(403).json('NO ROLES FOUND');
                }
            }
        });
    },
};
