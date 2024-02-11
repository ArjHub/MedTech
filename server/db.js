const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'medtech',
    password: 'Arjun9656',
    port: 5432,
});
/*
const tbl_qry = "create table accounts (walletaddr varchar(255) primary key not null, password varchar(255) not null, designation varchar(255) not null);"; 

pool.query(tbl_qry, (err, res) => {
    if(err) {
      console.error(err);
    } else {
      console.log('Table added successfully');
    }
    pool.end();
  });
*/
module.exports = pool;

