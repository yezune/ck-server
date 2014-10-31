require('./CONFIG.js');

var mysql = require('mysql');
var db = exports;

var connection = mysql.createConnection ({
  host : MYSQL_HOST,
  port : MYSQL_PORT,
  user : MYSQL_USER,
  password : MYSQL_PASS,
  database : MYSQL_DATABASE
});

connection.connect(function(err) {
  if (err) {
    console.error('mysql connection error');
    console.error(err);
    throw err;
  }
});

db.executeQuery = function( queryString, callback ) {
	console.log( "[mysql]", queryString );
	connection.query( queryString, function( err, result, fields ) {
		if( err ){
			callback( err, null );
		}else{
			callback( null, result );
		}
	});
}
