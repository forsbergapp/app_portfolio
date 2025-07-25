/**
 * Use worker_threads for solver1 using kociemba algorithm
 * that can take seconds or sometimes minutes to return result
 * so main NodeJs process will not be blocked.
 * Sends message using parentPort.postmessage in worker_threads
 * module when finished
 * @module apps/app8/src/functions/solver1/worker
 */

const { parentPort, workerData } = await import('node:worker_threads');
const {default:cuberSolver1} = await import('./index.js');
const result = cuberSolver1.solve(workerData);
/**@ts-ignore */
parentPort.postMessage(result);
export {};