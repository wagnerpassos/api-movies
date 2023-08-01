import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123senha',
    database: 'api_movies'
});

export default db;