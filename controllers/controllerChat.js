// Importation du modèle userModel
var chatModel = require('../models/modelChat');

module.exports = {
    getRooms: async function (req, res) {
        if (req.userId) {
            const rooms = await chatModel.getRoomsForUser(req.userId);
            if (rooms) {
                return res.json(rooms);
            }
        }
        res.sendStatus(500);
    },

    createRoom: async function (req, res) {
        if (req.userId && req.body.roomTitle) {
            const room = await chatModel.createRoom(req.userId, req.body.roomTitle);
            if (room) {
                return res.json(room);
            }
        }
        res.sendStatus(500);
    },

    getMessages: async function (req, res) {
        if (req.userId && req.body.roomId) {
            const messages = await chatModel.getMessages(req.userId, req.body.roomId);
            if (messages) {
                return res.json(messages);
            }
        }
        res.sendStatus(500);
    },

    postMessage: async function (req, res) {
        if (req.userId && req.body.roomId && req.body.message) {
            const message = await chatModel.postMessage(req.userId, req.body.roomId, req.body.message);
            if (message) {
                return res.sendStatus(200);
            }
        }
        res.sendStatus(500);
    },
};
