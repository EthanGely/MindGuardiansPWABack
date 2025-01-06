// Importation du modèle userModel
var userModel = require('../models/modelAuth');
var roleModel = require('../models/modelRole');
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');

module.exports = {
    login: async function (req, res) {
        if (process.env.SILENT === 'false') {
            console.log('Trying to log in');
        }
        const usermail = req.body.usermail;
        const password = sha256(req.body.password ? req.body.password : '');

        const users = await userModel.getUser(usermail);

        if (users && users[0]) {
            if (password == users[0].USER_PASSWORD) {
                const role = await roleModel.getRoleById(users[0].USER_ROLE_ID);
                if (role && role[0]) {
                    if (process.env.SILENT === 'false') {
                        console.log('User logged in');
                    }
                    return res.status(200).json({
                        jwt: generateJWT(users[0].USER_ID),
                        location: role[0].ROLE_DEFAULT_LOCATION,
                    });
                } else {
                    return res.sendStatus(500);
                }
            } else {
                return res.sendStatus(403);
            }
        }
        return res.sendStatus(403);
    },
    // Sign In form
    signin: async function (req, res) {
        if (process.env.SILENT === 'false') {
            console.log('Trying to sign in :');
        }
        
        // Retreive data submitted
        const userPassword = sha256(req.body.USER_PASSWORD ? req.body.USER_PASSWORD : '');
        const userPasswordConfirm = sha256(req.body.USER_PASSWORDCONFIRM ? req.body.USER_PASSWORDCONFIRM : '');

        // Check if passwords match
        if (userPassword !== userPasswordConfirm) {
            if (process.env.SILENT === 'false') {
                console.log('passwords different');
            }
            return res.sendStatus(401);
        }

        // Retieve the rest of the data
        const userMail = req.body.USER_MAIL;
        const userFirstName = req.body.USER_FIRSTNAME;
        const userLastName = req.body.USER_LASTNAME;
        const userRoleId = req.body.USER_ROLEID;
        let userSexe = req.body.USER_SEXE;

        // Patient specific
        let userBirthDate = req.body.USER_BIRTH ? req.body.USER_BIRTH : null;
        let userFontSize = req.body.USER_FONTSIZE ? req.body.USER_FONTSIZE : null;
        let userVolume = req.body.USER_VOLUME ? req.body.USER_VOLUME : null;
        let userHeureReveil = req.body.USER_HEUREREVEIL ? req.body.USER_HEUREREVEIL : null;
        let userHeureCoucher = req.body.USER_HEURECOUCHER ? req.body.USER_HEURECOUCHER : null;

        // search if user already exists
        const users = await userModel.getUser(userMail);

        if (users && users[0]) {
            // If passwords match
            if (userPassword === users[0].USER_PASSWORD) {
                // If submitted role is the current role of the user
                if (userRoleId === users[0].USER_ROLE_ID) {
                    // Get the role of this user
                    const role = await roleModel.getRoleById(users[0].USER_ROLE_ID);
                    if (role && role[0]) {
                        // Return the new token, and the homepage location (route)
                        if (process.env.SILENT === 'false') {
                            console.log('User logged in (already exists)');
                        }
                        return res.json({
                            jwt: generateJWT(users[0].USER_ID),
                            location: role[0].ROLE_DEFAULT_LOCATION,
                        });
                    } else {
                        if (process.env.SILENT === 'false') {
                            console.log('Error getting role :', err);
                        }
                        return res.sendStatus(500);
                    }
                } else {
                    if (process.env.SILENT === 'false') {
                        console.log('User found - incorrect role');
                    }
                    // Else, if role do not match
                    return res.status(403);
                }
            } else {
                if (process.env.SILENT === 'false') {
                    console.log('User found - incorrect password');
                }
                // Else, if password do not match
                return res.status(403);
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
                userSexe,
            };

            // If the user is a patient, we add some data
            if (userRoleId == 1) {
                userData = {
                    ...userData,
                    userBirthDate,
                    userFontSize,
                    userVolume,
                    userHeureReveil,
                    userHeureCoucher
                };
            }

            await userModel.createUser(userData);
            const role = await roleModel.getRoleById(userRoleId);

            if (role && role[0]) {
                if (process.env.SILENT === 'false') {
                    console.log('User created !');
                }
                return res.json({
                    jwt: generateJWT(userData.userMail),
                    location: role[0].ROLE_DEFAULT_LOCATION,
                });
            }
        }
    },
    // Check if the token is valid - Not async because no database call
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
