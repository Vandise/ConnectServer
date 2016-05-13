import io from 'socket.io-client';

let chai    = require('chai');
let sinon   = require("sinon");
let expect  = chai.expect;
let host    = 'http://localhost:44500'; 
let socket  = null;
let options = {
  transports: ['websocket'],
  'force new connection': true
};

describe("Channels::ServerList", () => {

  describe("get_active_servers", () => {

    before( () => {
      socket = io.connect(host, options);
    });

    it("should recieve retrieve active servers and their channels", (done) => {
      socket.emit("get_active_servers", {});
      socket.on("get_active_servers", (resp) => {
        let channelCounts = [2,1];
        expect(Object.keys(resp).length).to.equals(2);
        Object.keys(resp).forEach((host, index) => {
          expect(resp[host].length).to.equals(channelCounts[index]);
        });
        socket.disconnect();
        done(); 
      });
    });

  });

});