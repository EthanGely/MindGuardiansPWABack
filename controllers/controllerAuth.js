// Importation du modèle userModel
var userModel = require('../models/modelAuth');
var roleModel = require('../models/modelRole');
const sha256 = require("sha256");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {

    login: function (req, res) {
        const usermail = req.body.usermail;
        const password = sha256(req.body.password ? req.body.password : "");

        userModel.getUser(function (err, user) {
            if (err) {
                return res.sendStatus(500);
            } else {
                if (user[0]) {
                    if (password == user[0].USER_PASSWORD) {
                        roleModel.getRoleById(function (err, role) {
                            if (!err && role[0]) {
                                return res.json({jwt: generateJWT(user[0].USER_ID), location: role[0].ROLE_DEFAULT_LOCATION});
                            } else {
                                return res.sendStatus(500);
                            }
                        }, user[0].USER_ROLE_ID)
                        
                    } else {
                        return res.sendStatus(403);
                    }
                } else {
                    return res.sendStatus(404);
                }
            }
        }, usermail);
    },
    signin: function (req, res) {
        const usermail = req.body.usermail;
        const password = sha256(req.body.password ? req.body.password : "");

        userModel.getUser(function (err, user) {
            if (err) {
                return res.sendStatus(500);
            } else {
                if (user[0]) {
                    if (password == user[0].USER_PASSWORD) {
                        roleModel.getRoleById(function (err, role) {
                            if (!err && role[0]) {
                                return res.json({jwt: generateJWT(user[0].USER_ID), location: role[0].ROLE_DEFAULT_LOCATION});
                            } else {
                                return res.sendStatus(500);
                            }
                        }, user[0].USER_ROLE_ID)
                    } else {
                        return res.sendStatus(403);
                    }
                } else {
                    const userFirstName = req.body.userFirstName;
                    const userLastName = req.body.userLastName;
                    const roleId = req.body.userRoleId;
                    userModel.createUser(function (err, user) {
                        if (err) {
                            return res.sendStatus(500);
                        } else {
                            roleModel.getRoleById(function (err, role) {
                                if (!err && role[0]) {
                                    return res.json({jwt: generateJWT(user[0].USER_ID), location: role[0].ROLE_DEFAULT_LOCATION});
                                } else {
                                    return res.sendStatus(500);
                                }
                            }, roleId)
                            return res.json({jwt: generateJWT(user[0].USER_ID)});
                        }
                    }, userFirstName, userLastName, usermail, password, roleId)
                }
            }
        }, usermail);
    },
    checkToken: function (req, res) {
        // Get user token
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.TOKEN_SECRET, (err) => {

            if (err) return res.sendStatus(403);

            return res.sendStatus(200);
        })
    }
};

function generateJWT(userId) {
    const payload = { userId: userId };
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}