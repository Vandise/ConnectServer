/*************************************************************************
 *
 * Server.js
 *  Passes arguments and boots up the Gameserver.
 *
 *************************************************************************/

import ConnectServer from './app/ConnectServer';

let CS = new ConnectServer(process.argv);
CS.start();