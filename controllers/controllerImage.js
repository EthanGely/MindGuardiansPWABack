// Importation du modèle userModel
var imageModel = require('../models/modelImage');

module.exports = {
    getAllForUser: async function (req, res) {
        const userId = req.userId;
        const type = req.body.type ?? null;
        try {
            const images = await imageModel.getAllForUser(userId, type);
            res.json(images);
        } catch (err) {
            if (process.env.SILENT === 'false') {
                console.log('Error getting images for user :', err);
            }
            res.sendStatus(500);
        }
    },
};
