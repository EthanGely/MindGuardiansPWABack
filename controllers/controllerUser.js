// Importation du modèle userModel
var userModel = require('../models/modelUser');
const jwt = require('jsonwebtoken');

module.exports = {

    getUser: function (req, res) {
        const decodedToken = authenticateToken(req);
        if (decodedToken) {
            const userId = decodedToken.userId;

            userModel.getUserById(function (err, user) {
                if (err) {
                    return res.sendStatus(500);
                } else {
                    if (user[0]) {
                        res.json({userFirstName: user[0]["USER_FIRSTNAME"], userLastName: user[0]["USER_LASTNAME"], libelleRole: ""});
                    } else {
                        return res.status(403).json("NO USER FOUND");
                    }
                }
            }, userId);
        } else {
            console.log("got here (no good)");
            return res.status(500).json("DEV IS DOGSHIT")
        }
    }
};

function authenticateToken(req) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return false;
    }

    return jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return false;
        }
        return decoded;
    })
}