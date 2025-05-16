/** 
 * Starts the server
 * @module server/init
 */

/**@type(import('./server')) */
const {serverStart} = await import('./server.js');

serverStart();

export{};