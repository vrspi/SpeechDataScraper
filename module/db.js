const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '212.1.209.193',
    user: 'u669885128_Deb9t',
    database: 'u669885128_uZsNT',
    password: 'Loulouta159'
});

module.exports = pool.promise();
