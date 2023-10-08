/** @module server */
/**
 * Starts the server.
 */
const {serverStart} = await import(`file://${process.cwd()}/server/server.service.js`);
serverStart();
export{};