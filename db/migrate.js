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
var dir = fs.readdirSync(root+'/migrations/');
  
function migrate(dir, conn) {
  
  var results = [];
  for (index in dir) {
  	if (dir[index].match(/[a-zA-Z0-9_]\.js/)) {
    	console.log("Running migration "+dir[index]);
  		results.push( (require('./migrations/' + dir[index])(db, conn, conf)) );
  	}
  }
  migratedRecords = dir;
  return Promise.all(results);
  
}

db.connect( {host: conf.database.host, port: conf.database.port}, function(err, conn) {
  if (err) throw err;

  db.dbList().run(conn).then(function(results){
    
    return results.indexOf(dbname) > -1;
    
  }).then(function(dbExists){
    
    if(dbExists) {
      return db.db(dbname).table("migrations").run(conn).then(function(cursor){
        var results = [];
        var queried = false;
        return cursor.each(function(err, row){
          queried = true;
          if(dir.indexOf(row.migration) == -1) {
            results.push(row);
          }
        }).then(function(err, resp){
          if(results.length == 0 && !queried) {
            results = dir;
          }
          return results;
        });
      });
    } else {
      return db.dbCreate(conf.database.name).run(conn).then(function(err, result){
        return db.db(conf.database.name).tableCreate("migrations").run(conn).then(function(err, result){
          return dir;
        });
      });
    }
    
  }).then(function(migrations){
    
    migrate(migrations, conn);
    
  }).then(function(migrated){
    
    var results = [];
    for (index in migratedRecords) {
      results.push(db.db(dbname).table("migrations").insert({migration: migratedRecords[index]}).run(conn));
    }
    return Promise.all(results);
    
  }).then(function(resolved){
    
    conn.close();
    
  });
  
});
