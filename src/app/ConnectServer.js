import ConfReader    from './core/conf/ConfReader';
import LoggerFactory from './core/logger/LoggerFactory';
import express       from 'express';
import http          from 'http';
import fs            from 'fs';
import events        from 'events';
import socketio      from 'socket.io';

export default class ConnectServer {

  constructor(argv) {
    this.r        = null;
    this.fs       = fs;
    this.io       = null;
    this.env      = "dev";
    this.app      = express();
    this.conn     = null;
    this.root     = __dirname;
    this.port     = 44500;
    this.server   = http.createServer(this.app);
    this.session  = {};
    this.express  = express;
    
    if(argv.indexOf("-e") != -1) { this.env = argv[(argv.indexOf("-e") + 1)]; }
    if(argv.indexOf("-p") != -1) { this.port = argv[(argv.indexOf("-p") + 1)]; }

    this.configuration = new ConfReader().read('dist/conf/'+this.env+'.yml');
    this.logger = LoggerFactory.get('bunyan', {name:'ConnectServer', level: this.configuration.logger.level});
  }

  start() {
    this.app.set('port', this.port);
    this.io = socketio.listen(this.server);
    
    let dir = this.fs.readdirSync(this.root+'/extensions/');
    let index = 0;

  	for (index in dir) {
  		if (dir[index].match(/[a-z]\.js/)) {
  			require('./extensions/' + dir[index])(this);
  		}
  	}
    
    this.server.listen(this.app.get('port'), () => {
      this.logger.info('ConnectServer listening on port '+this.app.get('port')+' in '+this.env+' mode');
    });
  }

  close() {
    this.conn.close();
    this.server.close();
  }

}