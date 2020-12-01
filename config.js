var mysql = require('mysql');

var pool = mysql.createPool({
  host: 'hebner.brant.dreamhost.com',
  database: 'ppsi',
  user: 'ppsi',
  password: 'utnfra2020'
});

module.exports = pool;