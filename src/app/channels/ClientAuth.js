import io from 'socket.io-client';

const options = {
  transports: ['websocket'],
  timeout: 1000
};
  
export default (server, session) => {
  const socket = session.socket;
  socket.on('authenticate_client', (data) => {

    let authSocket = io.connect(`http://${data.host}:${data.port}`, options);

    let gsTimer = null;
    let pingCount = 0;

    server.logger.info(`Attempting to connect to GS: ${data.host}:${data.port}`);

    // give 1.5s to see if the game server times out
    gsTimer = setInterval(() => {
      if (authSocket.connected) {
        clearInterval(gsTimer);
        return;
      }
      if (!authSocket.connected && pingCount % 5 === 0) {
        server.logger.info(`Unable to connect to GS: ${data.host}:${data.port}`);
        socket.emit('server_error', {
          message: '(999) Connection refused.',
          code: 999
        });
        authSocket.destroy();
        clearInterval(gsTimer);
        return;
      }
      pingCount++;
    }, 250);

    authSocket.on('connect', () => {
      server.logger.info(`Connected to GS: ${data.host}:${data.port}`);
      // emit the client version
      authSocket.emit('authenticate_client_version', {
        version: data.version
      });

      authSocket.on('authenticate_response', (data) => {

        // if the status is 1 - client/server version match
        if (data.status === 1) {

          socket.emit('authenticate_client', {
            status: 1
          });  
          authSocket.destroy();

        } else {

          socket.emit('authenticate_client', {
            status: 0
          });  
          authSocket.destroy();

        }
      });

    });
  
  });
};