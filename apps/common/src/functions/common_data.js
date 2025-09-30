/**
 * @module apps/common/src/functions/common_data
*/

/**
 * @import {server} from '../../../../server/types.js'
 */
const fs = await import('node:fs');
const {serverProcess} = await import('../../../../server/info.js');
const {server} = await import('../../../../server/server.js');
const BASE_DIR = '/apps/common/src/functions/data/';

/**
 * @name postData
 * @description Extract transform load
 * @function
 * @param {'COUNTRY'|'LOCALE'|'GEOLOCATION_IP'|'GEOLOCATION_PLACE'} object
 */
const postData = async object =>{

    /**
     * @param {string} dir
     * @param {boolean} directory
     */
    const getDir = async (dir, directory) =>
        fs.promises.readdir(`${serverProcess.cwd()}${dir}`,{ withFileTypes: true })
            .then(result=>
                result
                .filter(row=>row.isDirectory()==directory)
                .map((file, index)=>{
                                    return {id: index, 
                                            filename:file.name
                                            };
                                    })
            );
    /**
     * @param {string} dir
     * @param {string} file
     */
    const getFile = async (dir, file) =>
        fs.promises.readFile(   (serverProcess.cwd() + `${dir}/${file}`).replaceAll('\\','/'),
                                'utf8').then(file=>file.toString());
    
    /**
     * @param {string} fileType
     * @returns {Promise.<Object.<string,string[]>>}
     */
    const loadGeolocation = async fileType =>{
        const dir = BASE_DIR + '/geolocation';
            /**@type{Object.<string,string[]>} */
            const data = {};
            for (const file of (await getDir(dir, false))){
                if (file.filename.startsWith(fileType.toLowerCase()+'_')){
                    const partition =   file.filename
                                        .replace(fileType.toLowerCase()+'_','')
                                        .replace('.csv','');
                    data[partition] = (await getFile(dir , file.filename)).split('\n');
                }
            }
            return data;

    };
    switch (object){
        case 'COUNTRY':{
            //read data directories into variable
            //array with object keys locales
            const records = [];
            const dir = BASE_DIR + '/country-list/data';
            for (const file of (await getDir(dir, true))){
                records.push({  locale:file.filename,
                                countries:JSON.parse(await getFile(dir + '/' + file.filename, 'country.json'))
                            });
            }
            return records;
        }
        case 'LOCALE':{
            //read data directories into variable
            //array with object keys locales
            const records = [];
            const dir = BASE_DIR + '/locale-list/data';
            for (const file of (await getDir(dir, true))){
                records.push({  locale:file.filename,
                                locales:JSON.parse(await getFile(dir + '/' + file.filename, 'locales.json'))
                            });
            }
            return records;
        }
        case 'GEOLOCATION_IP':{
            /**
             *  File content:
             *  ip_start
             *      First IP v4 address in the block	
             *  ip_end
             *      Last IP v4 address in the block	
             *  latitude
             *      Decimal latitude	
             *  longitude
             *      Decimal longitude
             * 
             * Uses partition with arrays to speed up searches
             */
            return server.ORM.UtilNumberValue(server.ORM.db.ConfigServer.get({app_id:0,data:{ config_group:'SERVICE_IAM'}}).result
                    .filter((/**@type{server['ORM']['ConfigServer']['SERVICE_IAM']}*/parameter)=>
                            'ENABLE_GEOLOCATION' in parameter)[0].ENABLE_GEOLOCATION)==1?
                    await loadGeolocation(object):
                        null;
        }
        case 'GEOLOCATION_PLACE':{
            /**
             *  File content:
             *  country
             *      ISO 3166-1 alpha-2 country code	
             *  stateprov
             *      State or Province name	
             *  city
             *      City name	
             *  latitude
             *      Decimal latitude	
             *  longitude
             *      Decimal longitude	
             * 
             * Uses partition with arrays to speed up searches
             */
            return await loadGeolocation(object);
        }
    }
};

const data = {
                COUNTRY:		    await postData('COUNTRY'),
                LOCALE: 		    await postData('LOCALE'),
                GEOLOCATION_IP:     await postData('GEOLOCATION_IP'),
                GEOLOCATION_PLACE:  await postData('GEOLOCATION_PLACE')
        };

/**
 * @name getData
 * @description Extract transform load
 * @param {'COUNTRY'|'LOCALE'|'GEOLOCATION_IP'|'GEOLOCATION_PLACE'} object
 * @returns {*}
 */
const getData = object =>data[object];

/**
 * @name getDataKeys
 * @description Get keys of object
 * @param {'COUNTRY'|'LOCALE'|'GEOLOCATION_IP'|'GEOLOCATION_PLACE'} object
 * @param {string} key
 * @returns {*}
 */
const getDataKey = (object,key) =>  
                                    /**@ts-ignore */
                                    data[object][key];

/**
 * @name getDataKeys
 * @description Get keys of object
 * @param {'COUNTRY'|'LOCALE'|'GEOLOCATION_IP'|'GEOLOCATION_PLACE'} object
 * @returns {Object.<string,*>}
 */
const getDataKeys = object =>
                                /**@ts-ignore */
                                Object.keys(data[object]);

export {getData,getDataKey,getDataKeys};
