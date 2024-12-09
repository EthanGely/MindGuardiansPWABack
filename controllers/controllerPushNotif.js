var userModel = require('../models/modelUser');

module.exports = {
    vpk: function (req, res) {
        res.send(process.env.PUBLICKEYPUSH);
    },
    serviceWorker: function (req, res) {
        res.sendFile('../push_notifications/service-worker.js', { root: __dirname });
    },
    register: function (req, res) {
        if (!req.body.subscription || !req.body.subscription.endpoint) {
            return res.status(400).json({ error: 'Invalid subscription object' });
        }
        if (!req.userId) {
            return res.status(400).json({ error: 'No user id' });
        }
        userModel.setUserPushSubscription(function () {}, req.userId, req.body.subscription);
        res.sendStatus(201);
    },
};
