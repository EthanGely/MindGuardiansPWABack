const cron = require('node-cron');
const cronParser = require('cron-parser');
const modelUser = require('./models/modelUser');
const modelAgenda = require('./models/modelAgenda');
const modelAgendaValidation = require('./models/modelAgendaValidation');
const webPush = require('web-push');
const dotenv = require('dotenv');
const moment = require('moment');

dotenv.config();

webPush.setVapidDetails('https://ethan-server.com/', process.env.PUBLICKEYPUSH, process.env.PRIVATEKEYPUSH);

//cron.schedule('*/30 * * * *', async () => {
cron.schedule('* * * * *', async () => {
    // Check database for upcoming reminders and send notifications as needed
    await notification();
});

/*
async function calendarNotification() {
    if (process.env.SILENT === 'false') {
        console.log('-----START OF FUNCTION------');
    }
    modelUser.getUsersByRole(function (err, users) {
        if (err) {
            console.log(err);

            return false;
        } else {
            if (users) {
                const currentTimestamp = Math.floor(Date.now() / 1000);
                if (process.env.SILENT === 'false') {
                    console.log('Current Unix Timestamp :', currentTimestamp, ' --- ', printDate(currentTimestamp));
                    console.log('--------------');
                    console.log('Users found !');
                }
                for (const user of users) {
                    if (process.env.SILENT === 'false') {
                        console.log('---------------------------------------------------------');
                        console.log('Current user : ', user['USER_ID'], '-', user['USER_MAIL']);
                    }

                    if (user['USER_PUSHSUBSCRIPTION'] === null) {
                        if (process.env.SILENT === 'false') {
                            console.log('User has no push subscription');
                        }
                        continue;
                    }

                    const subscription = JSON.parse(user['USER_PUSHSUBSCRIPTION']);

                    if (subscription.expirationTime && subscription.expirationTime < currentTimestamp) {
                        if (process.env.SILENT === 'false') {
                            console.log('User has an expired push subscription');
                        }
                        continue;
                    }

                    if (user['USER_HEUREREVEIL'] && user) {

                    modelAgenda.getAgendasForUser(
                        function (err, agendas) {
                            if (err) {
                                return res.sendStatus(500);
                            } else {
                                if (typeof agendas !== 'undefined' && agendas.length > 0) {
                                    if (process.env.SILENT === 'false') {
                                        console.log('\tAgendas found !');
                                    }

                                    for (const agenda of agendas) {
                                        if (process.env.SILENT === 'false') {
                                            console.log('\t--__--__--__--__--');
                                            console.log('\tCurrent Agenda :', agenda['ID_AGENDA'], '-', agenda['AGN_TITLE']);
                                            console.log('\t\tAgenda repetition : ' + agenda['AGN_REPETITION']);
                                        }

                                        const interval = cronParser.parseExpression(agenda['AGN_REPETITION'], {
                                            currentDate: new Date(currentTimestamp * 1000 - 1),
                                            endDate: new Date(agenda['AGN_DATEFIN'] * 1000),
                                        });

                                        const nextRun = Math.floor(interval.next().getTime() / 1000);
                                        if (process.env.SILENT === 'false') {
                                            console.log('\t\tNext run of agenda :', nextRun, ' --- ', printDate(nextRun));
                                        }

                                        if (nextRun > currentTimestamp) continue; // Not the right time

                                        const hasValidation = modelAgendaValidation.getAgendaValidationByAgenda(
                                            function (err, agendasValidation) {
                                                if (err) {
                                                    return true;
                                                }
                                                return agendasValidation ? true : false;
                                            },
                                            agenda['ID_AGENDA'],
                                            nextRun
                                        );

                                        if (process.env.SILENT === 'false') {
                                            console.log('\t\tAgenda ' + (hasValidation ? 'has already been notified' : 'will be notified'));
                                        }
                                        if (hasValidation) continue;

                                        modelAgenda.getAgendaType(
                                            function (err, agendaType) {
                                                if (err) {
                                                    return false;
                                                }

                                                sendNotification(agenda, subscription, agendaType);
                                                modelAgendaValidation.createAgendaValidation(function (err, res) {}, agenda['ID_AGENDA'], nextRun, 0);
                                            },
                                            user['USER_ID'],
                                            agenda['ID_AGENDA']
                                        );
                                    }
                                    if (process.env.SILENT === 'false') {
                                        console.log('-----END OF FUNCTION------');
                                    }
                                } else {
                                    return;
                                }
                            }
                        },
                        user['USER_ID'],
                        currentTimestamp,
                        -currentTimestamp
                    );
                }
            } else {
                if (process.env.SILENT === 'false') {
                    console.log('NO USERS FOUND');
                }
                return;
            }
        }
    }, 1);
}
*/

async function notification() {
    if (process.env.SILENT === 'false') {
        console.log('-----START OF FUNCTION------');
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    console.log('got here');

    getUsers()
        .then((users) => {
            users = filterUsers(users, currentTimestamp);

            if (users && users.length > 0) {
                if (process.env.SILENT === 'false') {
                    console.log('Found users !');
                }
                for (const user of users) {
                    getAgendasForUser(user['USER_ID'], currentTimestamp, -currentTimestamp)
                        .then((agendas) => {
                            agendas = filterAgendas(agendas, currentTimestamp);
                            if (agendas && agendas.length > 0) {
                                if (process.env.SILENT === 'false') {
                                    console.log('Found agendas !');
                                }
                                for (const agenda of agendas) {
                                    getAgendaValidationByAgenda(agenda, currentTimestamp)
                                        .then((agendaValidation) => {
                                            if (!agendaValidation || agendaValidation.length === 0) {
                                                if (process.env.SILENT === 'false') {
                                                    console.log('Agenda found : ', agenda['ID_AGENDA'], '-', agenda['AGN_TITLE']);
                                                }
                                                getAgendaType(agenda['ID_AGENDA'])
                                                    .then((agendaType) => {
                                                        sendNotification(agenda, user['USER_PUSHSUBSCRIPTION'], agendaType);
                                                    })
                                                    .catch((err) => {
                                                        console.log(err);
                                                    });
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        });
                                }
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function printDate(timestamp) {
    const date = new Date(timestamp * 1000);

    // Extract hours, minutes, and seconds
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure 2 digits
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure 2 digits
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Ensure 2 digits

    // Format the time as "hh:mm:ss"
    return `${hours}:${minutes}:${seconds}`;
}

function sendNotification(agenda, subscription, agendaType) {
    if (process.env.SILENT === 'false') {
        console.log('agenda type : ', agendaType);
    }
    const title = agendaType['AGT_LIBELLE'] + ' - ' + agenda['AGN_TITLE'];
    const payload = agenda['AGN_DESCRIPTION'];
    const image = agendaType['AGT_IMAGE'];
    console.log(subscription);

    const response = JSON.stringify({ title: title, payload: payload, image: image });

    const options = {
        topic: 'notification' + agendaType['AGT_LIBELLE'],
    };

    webPush
        .sendNotification(JSON.stringify(subscription), response, options)
        .then(function (result) {
            if (process.env.SILENT === 'false') {
                console.log('Notification sent successfully:', result);
            }
        })
        .catch(function (error) {
            if (process.env.SILENT === 'false') {
                console.log('Error sending notification:', error);
            }
        });
}

function getUsers() {
    return new Promise((resolve, reject) => {
        modelUser.getUsersByRole(function (err, users) {
            if (err) {
                reject(err);
            } else {
                resolve(users);
            }
        }, 1);
    });
}

function filterUsers(users, timestamp) {
    return filterUsersTime(filterUsersSubscription(users), timestamp);
}

function filterUsersSubscription(users) {
    return users.filter((user) => user['USER_PUSHSUBSCRIPTION'] !== null);
}

function filterUsersTime(users, timestamp) {
    const currentHour = printDate(timestamp).slice(0, -3);
    return users.filter((user) => {
        const wakeHour = user['USER_HEUREREVEIL'];
        const sleepHour = user['USER_HEURECOUCHER'];
        return compareHours(currentHour, wakeHour) === 1 && compareHours(sleepHour, currentHour) === 1;
    });
}

function compareHours(time1, time2) {
    // Split the strings into hours and minutes
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    // Compare hours first
    if (hours1 < hours2) return -1;
    if (hours1 > hours2) return 1;

    // If hours are equal, compare minutes
    if (minutes1 < minutes2) return -1;
    if (minutes1 > minutes2) return 1;

    // If both hours and minutes are equal
    return 0;
}

function getAgendasForUser(userId, currentTimestamp, offset) {
    return new Promise((resolve, reject) => {
        modelAgenda.getAgendasForUser(
            function (err, agendas) {
                if (err) {
                    reject(err);
                } else {
                    resolve(agendas);
                }
            },
            userId,
            currentTimestamp,
            offset
        );
    });
}

function getAgendaValidationByAgenda(agenda, timestamp) {
    return new Promise((resolve, reject) => {
        modelAgendaValidation.getAgendaValidationByAgenda(
            function (err, agendasValidation) {
                if (err) {
                    reject(err);
                } else {
                    resolve(agendasValidation);
                }
            },
            agenda['ID_AGENDA'],
            timestamp
        );
    });
}

function filterAgendas(agendas, timestamp) {
    return filterAgendasCron(agendas, timestamp);
}

function filterAgendasCron(agendas, timestamp) {
    return agendas.filter((agenda) => {
        const interval = cronParser.parseExpression(agenda['AGN_REPETITION'], {
            currentDate: new Date(timestamp * 1000 - 1),
            endDate: new Date(agenda['AGN_DATEFIN'] * 1000),
        });

        const nextRun = Math.floor(interval.next().getTime() / 1000);
        return nextRun <= timestamp;
    });
}

function filterAgendaByValidation(agenda, nextRun) {
    const agendaValidation = getAgendaValidationByAgenda(agenda['ID_AGENDA'], nextRun)
        .then((agendaValidation) => {
            return agendaValidation ? true : false;
        })
        .catch((err) => {
            console.log(err);
        });
    console.log(agendaValidation);

    return agendaValidation;
}

function getAgendaType(agendaId) {
    return new Promise((resolve, reject) => {
        modelAgenda.getAgendaType(function (err, agendaType) {
            if (err) {
                reject(err);
            } else {
                resolve(agendaType[0]);
            }
        }, agendaId);
    });
}
