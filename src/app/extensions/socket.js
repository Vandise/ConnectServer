export default (server) => {

  var index;
  let channels = [];
	let dir = server.fs.readdirSync(server.root+'/channels');

	for (index in dir) {
		channels.push(require(server.root+'/channels/' + dir[index]));
	}

  server.io.on('connection', (socket) => {

    server.logger.info("User Connected.");
    server.session[socket.id] = {
      id: socket.id,
      socket: socket
    };
    
    socket.on('disconnect', () => {
      server.logger.info("User Disconnected.");
      delete server.session[socket.id];
    });
    
    let i = 0;
		for (i in channels) {
			channels[i](server, server.session[socket.id]);
		}
		
  });

  server.logger.info("Loaded socket extension.");
};