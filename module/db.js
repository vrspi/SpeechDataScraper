const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'yourUsername',
    database: 'yourDatabase',
    password: 'yourPassword'
});

module.exports = pool.promise();
