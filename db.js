import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'mindguardian',
    password: 'th!sIs4Str0nGP455Wor!d',
    database: 'MIND_GUARDIANS_PWA'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

export default connection;
