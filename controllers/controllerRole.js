// Importation du modèle userModel
var roleModel = require('../models/modelRole');

module.exports = {
    getAll: async function (req, res) {
        const roles = await roleModel.getAll();
        if (roles) {
            return res.json(roles);
        } else {
            return res.status(403).json('NO ROLES FOUND');
        }
    },
};
