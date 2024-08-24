const { parentPort, workerData } = await import('node:worker_threads');
/**@type{import('./index.js')} */
const {default:cuberSolver1} = await import('./index.js');
const result = cuberSolver1.solve(workerData, 'kociemba');
/**@ts-ignore */
parentPort.postMessage(result);
export {};