let Responses = {
  internalError: "(0) An unknown error has occured when retrieving the server lists."
};

let statusCode = (key) => {
  return Object.keys(Responses).indexOf(key) > -1 ? Object.keys(Responses).indexOf(key) : 0;
};

export default (server, session) => {
  const socket = session.socket;
  socket.on('get_active_servers', () => {
    let activeServers = {};

    return server.r.table('servers').filter({
      parent: null,
      is_offline: false
    }).pluck('name').run(server.conn).then((cursor) => {

      return cursor.toArray();
      
    }).then((results) => {

      results.forEach((s) => {
        activeServers[s.name] = [];
      });
      
      return activeServers;
      
    }).then((servers) => {

      let channelArr = Object.keys(servers).map((s) => {

        return server.r.table('servers').filter({
            parent: s,
            is_offline: false
          }).run(server.conn).then((cursor) => {
          
            return cursor.toArray();
          
          }).then((channels) => {

            activeServers[s] = channels;
            return channels;

          }).error((err) => {

            server.logger.error(`Internal Server Error: ${err}`);
            socket.emit('error', {'message': Responses.internalError, 'code': statusCode("internalError")});
            return false;
          });
      });

      return Promise.all(channelArr);

    }).then((results) =>{

      server.logger.info(`Sending Active Servers: ${activeServers}`);
      socket.emit('get_active_servers', activeServers);
      return;

    }).error((err) => {

      server.logger.error(`Internal Server Error: ${err}`);
      socket.emit('error', {'message': Responses.internalError, 'code': statusCode("internalError")});

    });
  });
};