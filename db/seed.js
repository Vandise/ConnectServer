var fs         = require('fs');
var db         = require('rethinkdb');
var env        = "dev";
var root       = __dirname;
var dbname     = null;
var ConfReader = require('../dist/app/core/conf/ConfReader');
var conf = new ConfReader();

if(process.argv.indexOf("-e") != -1) {
  env = process.argv[(process.argv.indexOf("-e") + 1)];
}

conf = conf.read('./dist/conf/'+env+'.yml');
dbname = conf.database.name;

var index = 0;
var migratedRecords = [];
var dir = fs.readdirSync(root+'/seeds/');

function seed(dir, conn) {
  
  var results = [];
  for (index in dir) {
  	if (dir[index].match(/[a-zA-Z0-9_]\.js/)) {
    	console.log("Running seed "+dir[index]);
  		results.push( (require('./seeds/' + dir[index])(db, conn, conf)) );
  	}
  }
  return Promise.all(results);
}

db.connect( {host: conf.database.host, port: conf.database.port}, function(err, conn) {
  if (err) throw err;
  (seed(dir, conn)).then(function(resolve){
    conn.close();
  });
});