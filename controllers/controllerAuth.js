// Importation du modèle userModel
var userModel = require('../models/modelAuth');
var roleModel = require('../models/modelRole');
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');

module.exports = {
    login: function (req, res) {
        if (process.env.SILENT === 'false') {
            console.log('Trying to log in');
        }
        const usermail = req.body.usermail;
        const password = sha256(req.body.password ? req.body.password : '');

        userModel.getUser(function (err, user) {
            if (err) {
                return res.sendStatus(500);
            } else {
                if (user[0]) {
                    if (password == user[0].USER_PASSWORD) {
                        roleModel.getRoleById(function (err, role) {
                            if (!err && role[0]) {
                                if (process.env.SILENT === 'false') {
                                    console.log('User logged in');
                                }
                                return res.status(200).json({
                                    jwt: generateJWT(user[0].USER_ID),
                                    location: role[0].ROLE_DEFAULT_LOCATION,
                                });
                            } else {
                                return res.sendStatus(500);
                            }
                        }, user[0].USER_ROLE_ID);
                    } else {
                        return res.sendStatus(403);
                    }
                } else {
                    return res.sendStatus(404);
                }
            }
        }, usermail);
    },
    // Sign In form
    signin: function (req, res) {
        // Retreive data submitted
        const userPassword = sha256(req.body.password ? req.body.password : '');
        const userPasswordConfirm = sha256(req.body.passwordConfirm ? req.body.passwordConfirm : '');

        // Check if passwords match
        if (userPassword !== userPasswordConfirm) {
            return res.sendStatus(401);
        }

        // Retieve the rest of the data
        const userMail = req.body.usermail;
        const userFirstName = req.body.userFirstName;
        const userLastName = req.body.userLastName;
        const userRoleId = req.body.userRoleId;

        // Patient specific
        let userAge = req.body.userAge ? req.body.userAge : null;
        let userFontSize = req.body.fontSize ? req.body.fontSize : null;

        // Search if this user already exists
        userModel.getUser(function (err, user) {
            if (err) {
                return res.sendStatus(500);
            } else {
                // If user exists
                if (user[0]) {
                    // If passwords match
                    if (userPassword == user[0].USER_PASSWORD) {
                        // If submitted role is the current role of the user
                        if (userRoleId === user[0].USER_ROLE_ID) {
                            // Get the role of this user
                            roleModel.getRoleById(function (err, role) {
                                if (!err && role[0]) {
                                    // Return the new token, and the homepage location (route)
                                    return res.json({
                                        jwt: generateJWT(user[0].USER_ID),
                                        location: role[0].ROLE_DEFAULT_LOCATION,
                                    });
                                } else {
                                    return res.sendStatus(500);
                                }
                            }, user[0].USER_ROLE_ID);
                        }
                    } else {
                        // Else, if password do not match
                        return res.status(403).json('User found - incorrect password');
                    }
                } else {
                    // Else, if the user is not yet created,
                    // We create it
                    let userData = {
                        userFirstName,
                        userLastName,
                        userMail,
                        userRoleId,
                        userPassword,
                    };

                    // If the user is a patient, we add some data
                    if (userRoleId == 1) {
                        userData = {
                            ...userData,
                            userAge,
                            userFontSize,
                            userVolume: 50,
                        };
                    }

                    // User creation
                    userModel.createUser(function (err, user) {
                        if (err) {
                            return res.sendStatus(500);
                        } else {
                            // Retreive the role (for the home page route)
                            roleModel.getRoleById(function (err, role) {
                                if (!err && role[0]) {
                                    // Send the new token and home page route
                                    return res.json({
                                        jwt: generateJWT(user[0].USER_ID),
                                        location: role[0].ROLE_DEFAULT_LOCATION,
                                    });
                                } else {
                                    return res.sendStatus(500);
                                }
                            }, userRoleId);
                        }
                    }, userData);
                }
            }
        }, userMail);
    },
    checkToken: function (req, res) {
        // Get user token
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
            if (err) return res.sendStatus(403);

            return res.sendStatus(200);
        });
    },
};

function generateJWT(userId) {
    const payload = { userId: userId };
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '180000000s',
    });
}
