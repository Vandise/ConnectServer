import BunyanLogger from './concrete/BunyanLogger';
/**
* Logger Facory class
*/
export default class LoggerFactory{

  /**
  * Get a logger from its name or return null
  * @param {String} name Name of the logger
  * @param {Object} params Parameters of the logger
  * @return {Object} The logger object or null if doesn't exist
  */
  static get(name, params){
    if(name.toLowerCase() === 'bunyan'){
      return new BunyanLogger(params);
    }
    return null;
  }

}
