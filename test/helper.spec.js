/** 
 * Helper file for Jasmine test
 * @module test/helper.spec
 */
/**
 * @import {server_server_res, server_bff_parameters, server_db_table_App, 
 *          server_db_db_pool_parameters, server_db_db_pool_connection_1_2} from '../server/types.js'
 */
/**
 * @name beforeAll
 * @description  sets file cache so test can be performed without server started
 * @function
 * @returns {void}
 */
beforeAll(async ()=>{
    /**@type{import('../server/db/ORM.js')} */
    const {fileDbInit} = await import(`file://${process.cwd()}/server/db/ORM.js`);

    //sets file cache so test can be performed without server started
    await fileDbInit();
});