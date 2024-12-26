/** 
 * Starts the server
 * @module server/init
 */

/**@type(import('./server')) */
const {serverStart} = await import(`file://${process.cwd()}/server/server.js`);
serverStart();
export{};