const cron = require('node-cron');
const cronParser = require('cron-parser');
//const notificationManager = require('./path-to-your-notification-function');
const modelUser = require('./models/modelUser');
const modelAgenda = require('./models/modelAgenda');
const modelAgendaValidation = require('./models/modelAgendaValidation');

//cron.schedule('*/30 * * * *', async () => {
cron.schedule('* * * * *', async () => {
    // Check database for upcoming reminders and send notifications as needed
    await calendarNotification();
});

async function calendarNotification() {
    console.log('-----START OF FUNCTION------');
    modelUser.getUsersByRole(function (err, users) {
        if (err) {
            console.log(err);

            return false;
        } else {
            if (users) {
                const currentTimestamp = Math.floor(Date.now() / 1000);
                console.log('Current Unix Timestamp :', currentTimestamp, ' --- ', printDate(currentTimestamp));
                console.log('--------------');
                console.log('Users found !');
                for (const user of users) {
                    console.log('---------------------------------------------------------');
                    console.log('Current user : ', user['USER_ID'], '-', user['USER_MAIL']);

                    modelAgenda.getAgendasForUser(
                        function (err, agendas) {
                            if (err) {
                                return res.sendStatus(500);
                            } else {
                                if (typeof agendas !== 'undefined' && agendas.length > 0) {
                                    console.log('\tAgendas found !');

                                    for (const agenda of agendas) {
                                        console.log('\t--__--__--__--__--');
                                        console.log('\tCurrent Agenda :', agenda['ID_AGENDA'], '-', agenda['AGN_TITLE']);
                                        console.log('\t\tAgenda repetition : ' + agenda['AGN_REPETITION']);

                                        const interval = cronParser.parseExpression(agenda['AGN_REPETITION'], {
                                            currentDate: new Date(currentTimestamp * 1000 - 1),
                                            endDate: new Date(agenda['AGN_DATEFIN'] * 1000),
                                        });

                                        const nextRun = Math.floor(interval.next().getTime() / 1000);
                                        console.log('\t\tNext run of agenda :', nextRun, ' --- ', printDate(nextRun));

                                        if (nextRun > currentTimestamp) {
                                            console.log('\tEND FOR AGENDA : ', agenda['ID_AGENDA']);
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

                                        console.log('\t\tAgenda ' + (hasValidation ? 'has already been notified' : 'will be notified'));
                                        if (hasValidation) continue;

                                        console.log('\t\tWill send notification for agenda :', agenda['ID_AGENDA'], ', with the date :', nextRun);

                                        //sendNotification(agenda);
                                        console.log('\t\tWill create new agenda_validation with ID :', agenda['ID_AGENDA'], ', with the date :', nextRun);
                                        modelAgendaValidation.createAgendaValidation(function (err, res) {}, agenda['ID_AGENDA'], nextRun, 0);
                                    }
                                    console.log('-----END OF FUNCTION------');
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
                console.log('NO USERS FOUND');
                return;
            }
        }
    }, 1);
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
