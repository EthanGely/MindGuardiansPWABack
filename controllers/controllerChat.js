// Importation du modèle userModel
var chatModel = require('../models/modelChat');

module.exports = {
    getRooms: function (req, res) {
        if (req.userId) {
            chatModel.getRoomsForUser(function (err, chatRooms) {
                if (err) {
                    if (process.env.SILENT === 'false') {
                        console.log(err);
                    }
                    return res.sendStatus(500);
                } else {
                    if (chatRooms) {
                        res.json(chatRooms);
                    } else {
                        return res.status(403).json('NO ROOMS FOUND');
                    }
                }
            }, req.userId);
        } else {
            res.sendStatus(500);
        }
    },

    createRoom: function (req, res) {
        if (req.userId && req.body.roomTitle) {
            chatModel.createRoom(
                function (err, success) {
                    if (err) {
                        if (process.env.SILENT === 'false') {
                            console.log(err);
                        }
                        return res.sendStatus(500);
                    } else {
                        if (success) {
                            res.json(success);
                        } else {
                            return res.status(403).json('ROOM CANNOT BE CREATED');
                        }
                    }
                },
                req.userId,
                req.body.roomTitle
            );
        } else {
            res.sendStatus(500);
        }
    },

    getMessages: function (req, res) {
        if (req.userId && req.body.roomId) {
            chatModel.getMessages(
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
                req.body.roomId
            );
        } else {
            res.sendStatus(500);
        }
    },

    postMessage: function (req, res) {
        if (req.userId && req.body.roomId && req.body.message) {
            chatModel.postMessage(
                function (err, result) {
                    if (err) {
                        if (process.env.SILENT === 'false') {
                            console.log(err);
                        }
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                },
                req.userId,
                req.body.roomId,
                req.body.message
            );
        } else {
            res.sendStatus(500);
        }
    },
};
