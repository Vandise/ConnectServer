import io       from 'socket.io-client';
import socketio from 'socket.io';
import http     from 'http';

let chai    = require('chai');
let sinon   = require("sinon");
let expect  = chai.expect;
let host    = 'http://localhost:44500'; 
let socket  = null;
let options = {
  transports: ['websocket'],
  'force new connection': true
};

let app = require('express')();
let server = http.createServer(app);
app.set('port', 60006);

let ioserver = socketio.listen(60006);

ioserver.on('connection', (socket) => {

  socket.on('authenticate_client_version', (data) => {

    let cv = '1.02d';
    let s = 0;
  
    if (cv === data.version)
      s = 1;
  
    socket.emit('authenticate_response',{status: s});
    return;
  });

});

describe("Channels::ClientAuth", () => {

  describe("When a valid client version is supplied", () => {
  
    describe("When a valid version is supplied", () => {
  
      before( () => {
        socket = io.connect(host, options);
      });
  
      it("it should be a valid client", (done) => {
        socket.emit("authenticate_client", {
          host: 'localhost',
          port: 60006,
          version: '1.02d'
        });
        socket.on("authenticate_client", (resp) => {
          expect(resp.status).to.equals(1);
          socket.disconnect();
          done(); 
        });
      });
      
    });

    describe("When an invalid GS is supplied", () => {

      before( () => {
        socket = io.connect(host, options);
      });

      it("should send a 999 error status code", (done) => {
        socket.emit("authenticate_client", {
          host: 'localhost',
          port: 60005,
          version: '1.02d'
        });

        socket.on("server_error", (resp) => {
          expect(resp.code).to.equals(999);
          socket.disconnect();
          done();
        });
      });

    });

  });

  describe("When an invalid client version is supplied", () => {

    before( () => {
      socket = io.connect(host, options);
    });

    it("Should send a status code of 0", (done) => {
      socket.emit("authenticate_client", {
        host: 'localhost',
        port: 60006,
        version: '1.02c'
      });

      socket.on("authenticate_client", (resp) => {
        expect(resp.status).to.equals(0);
        socket.disconnect();
        ioserver.close();
        server.close();
        done();
      });
    });

  });

});
