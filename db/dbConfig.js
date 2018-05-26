var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 10,
    multipleStatements: true,
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'Blog'
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});
pool.on('connection', function (connection) {
    connection.query('SET SESSION auto_increment_increment=1')
});
pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});
pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

module.exports = pool;