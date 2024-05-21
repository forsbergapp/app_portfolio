/** @module server */
/**
 * Starts the server.
 */
/**@type{import('./server/server.service.js')} */
const {serverStart} = await import(`file://${process.cwd()}/server/server.service.js`);
serverStart();
export{};