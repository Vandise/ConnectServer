let r = require('rethinkdb');

export default (server, session) => {
  server.r = r;
  server.r.connect({host: server.configuration.database.host, port: server.configuration.database.port}, (err, conn) => {
    if (err) throw err;
    server.logger.info("Connected to database: " + server.configuration.database.host + " on port " + server.configuration.database.port + " with DB: "+server.configuration.database.name);
    server.conn = conn;
    server.conn.use(server.configuration.database.name);
  });
  server.logger.info("Loaded DB extension.");
};