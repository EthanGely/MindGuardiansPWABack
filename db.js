import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'sql11.freesqldatabase.com',
    user: 'sql11696935',
    password: 'mAR9GaLIvG',
    database: 'sql11696935'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

export default connection;