let cookieParser = require('cookie-parser');

export default (server, session) => {
  
  server.app.use(cookieParser());
	server.app.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({
      connections: Object.keys(server.session).length
    }));
	});

  server.logger.info("Loaded API extension.");

};