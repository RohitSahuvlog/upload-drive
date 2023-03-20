var mysql = require("mysql");
require("dotenv").config();
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "fileuploads",
  insecureAuth: true,
});

connection.connect(function (err:Error) {
  if (err) throw err;
  console.log("Connected!");
});

// create user table
// connection.query('CREATE TABLE user (' +
//        'id int(11) NOT NULL AUTO_INCREMENT,' +
//        'name varchar(255) NOT NULL,' +
//        'email varchar(255) NOT NULL,' +
//        'password varchar(255) NOT NULL,' +
//        'PRIMARY KEY (id),'+
//        'UNIQUE KEY email_UNIQUE (email),' +
//        'UNIQUE KEY password_UNIQUE (password))', function (err, result) {
//            if (err) throw err;
//            console.log("auth created");
//          }
//       );

//       //create the resetPasswordToken table

//       connection.query('CREATE TABLE ResetPasswordToken (' +
//     'id INT NOT NULL AUTO_INCREMENT,' +
//     'email VARCHAR(255) NOT NULL,' +
//     'Token_value VARCHAR(350) NOT NULL,' +
//     'created_at datetime  NOT NULL ,' +
//     'expired_at datetime  NOT NULL,' +
//     'used INT(11) NOT NULL default "0",' +
//     'inserted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
//     'PRIMARY KEY (id),' +
//     'UNIQUE INDEX id_UNIQUE (id ASC))' , function (err, result) {
//         if (err) throw err;
//         console.log("resetPasswordToken created");
//     }
// );
export default connection;