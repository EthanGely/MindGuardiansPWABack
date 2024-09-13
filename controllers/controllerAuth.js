// Importation du modèle userModel
var userModel = require('../models/modelAuth');
var roleModel = require('../models/modelRole');
const sha256 = require("sha256");
const jwt = require('jsonwebtoken');

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
                                return res.json({ jwt: generateJWT(user[0].USER_ID), location: role[0].ROLE_DEFAULT_LOCATION });
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
    // Sign In form
    signin: function (req, res) {
        // Retreive data submitted
        console.log("Retreive data submitted...");
        const userPassword = sha256(req.body.password ? req.body.password : "");
        const userPasswordConfirm = sha256(req.body.passwordConfirm ? req.body.passwordConfirm : "");
        console.log("Success");
        console.log("----------------------------");

        // Check if passwords match
        console.log("Check if passwords match");
        if (userPassword !== userPasswordConfirm) {
            console.log("FAIL");
            console.log("----------------------------");
            return res.sendStatus(401);
        }
        console.log("Success");
        console.log("----------------------------");

        // Retieve the rest of the data
        console.log("Retieve the rest of the data...");
        const userMail = req.body.usermail;
        const userFirstName = req.body.userFirstName;
        const userLastName = req.body.userLastName;
        const userRoleId = req.body.userRoleId;
        console.log("Success");
        console.log("----------------------------");

        // Patient specific
        console.log("Patient specific data...");
        let userAge = req.body.userAge ? req.body.userAge : null;
        let userFontSize = req.body.fontSize ? req.body.fontSize : null;
        console.log("Success");
        console.log("----------------------------");

        // Search if this user already exists
        console.log("Searching for existing user...");
        userModel.getUser(function (err, user) {
            if (err) {
                console.log("FAIL :", err);
                console.log("----------------------------");
                return res.sendStatus(500);
            } else {
                // If user exists
                if (user[0]) {
                    console.log("User match!");
                    // If passwords match
                    if (userPassword == user[0].USER_PASSWORD) {
                        console.log("Passwords match!");
                        // If submitted role is the current role of the user
                        if (userRoleId === user[0].USER_ROLE_ID) {
                            console.log("Roles match!");
                            console.log("----------------------------");
                            // Get the role of this user
                            roleModel.getRoleById(function (err, role) {
                                if (!err && role[0]) {
                                    console.log("Role found : sending token and location");
                                    // Return the new token, and the homepage location (route)
                                    return res.json({ jwt: generateJWT(user[0].USER_ID), location: role[0].ROLE_DEFAULT_LOCATION });
                                } else {
                                    console.log("FAIL :", err);
                                    return res.sendStatus(500);
                                }
                            }, user[0].USER_ROLE_ID);
                        }
                    } else {
                        // Else, if password do not match
                        console.log("FAIL : Passwords do NOT match")
                        return res.status(403).json("User found - incorrect password");
                    }
                } else {
                    console.log("User not found.");
                    console.log("----------------------------");
                    console.log("Gathering data...");
                    // Else, if the user is not yet created,
                    // We create it
                    let userData = {
                        userFirstName,
                        userLastName,
                        userMail,
                        userRoleId,
                        userPassword
                    };

                    // If the user is a patient, we add some data
                    if (userRoleId == 1) {
                        userData = {
                            ...userData,
                            userAge,
                            userFontSize,
                            userVolume: 50
                        };
                    }

                    console.log("Success");
                    console.log("----------------------------");

                    // User creation
                    console.log("User creation...")
                    userModel.createUser(function (err, user) {
                        if (err) {
                            console.log("FAIL :", err)
                            return res.sendStatus(500);
                        } else {
                            console.log("User created!")
                            // Retreive the role (for the home page route)
                            console.log("Retreive role...")
                            roleModel.getRoleById(function (err, role) {
                                if (!err && role[0]) {
                                    console.log("Role found!\nSending data back.\nSUCCESS!")
                                    // Send the new token and home page route
                                    return res.json({ jwt: generateJWT(user[0].USER_ID), location: role[0].ROLE_DEFAULT_LOCATION });
                                } else {
                                    console.log("FAIL :", err)
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
        })
    }
};

function generateJWT(userId) {
    const payload = { userId: userId };
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}