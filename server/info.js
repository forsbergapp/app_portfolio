/** @module server/info */

// eslint-disable-next-line no-unused-vars
import * as Types from './../types.js';

const service = await import(`file://${process.cwd()}/server/info.service.js`);

const Info = () => service.Info();
export {Info};