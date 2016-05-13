import yaml from 'js-yaml';
import fs from 'fs';

/**
* ConfReader
* This class aims to read the yml configuration files
*/
export default class ConfReader{

  /**
  * Read method, read a yml conf files
  * @param {String} path The path of the conf file
  * @return {Object} The JSON result from the YML parsed, or null if the file is not found
  */
  read(path){
    try {
      return yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    } catch (e) {
      return null;
    }
  }
}
