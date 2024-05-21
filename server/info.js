/** @module server/info */

/**@type{import('./info.service.js')} */
const service = await import(`file://${process.cwd()}/server/info.service.js`);

const Info = () => service.Info();
export {Info};