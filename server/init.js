/** 
 * Starts the server
 * @module server/init
 */

/**@type(import('./server')) */
const {serverStart} = await import('./server.js');
class ClassServerProcess {
    cwd = () => process.cwd();
}
const serverProcess = new ClassServerProcess();

serverStart();

export{serverProcess};