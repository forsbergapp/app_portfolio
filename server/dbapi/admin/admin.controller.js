/** @module server/dbapi/admin */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import('./admin.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
/**
 * DB Info
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const DBInfo = (req, res) => {
	service.DBInfo(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.db_result_admin_DBInfo[]}*/result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		else{
			const db_use = ConfigGet('SERVICE_DB', 'USE');
			if (db_use == 4){
				const hostname = JSON.parse(result[0].hostname.toLowerCase()).public_domain_name + 
								' (' + JSON.parse(result[0].hostname.toLowerCase()).outbound_ip_address + ')';
				result[0].database_schema += ' (' + JSON.parse(result[0].hostname.toLowerCase()).database_name + ')';
				result[0].hostname = hostname;
			}
			return res.status(200).json({
				data: result[0]
			});
		}
		
	});	
};
/**
 * DB Info space
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const DBInfoSpace = (req, res) => {
	service.DBInfoSpace(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.db_result_admin_DBInfoSpace}*/result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: result
		});
	});
};
/**
 * DB Info space sum
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const DBInfoSpaceSum = (req, res) => {
	service.DBInfoSpaceSum(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.db_result_admin_DBInfoSpaceSum[]}*/result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: result[0]
		});
	});
};
/**
 * DB demo add
 * @param {Types.req} req 
 * @param {Types.res} res 
 */

const demo_add = async (req, res)=> {
	service.demo_add(getNumberValue(req.query.app_id), req.body.demo_password, req.query.lang_code, (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_result}*/result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json(result);
	});
};
/**
 * DB demo delete
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const demo_delete = async (req, res)=> {
	service.demo_delete(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{number}*/result_demo_users_length) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			count_deleted: result_demo_users_length
		});
	});
};
/**
 * DB demo get
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const demo_get = async (req, res)=> {
	service.demo_get(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.db_result_user_account_getDemousers}*/result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: result
		});
	});
};
/**
 * DB install
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const install_db = (req, res) =>{
	service.install_db(getNumberValue(req.query.app_id),getNumberValue(req.query.optional), (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_result}*/result) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(result);
	});
};
/**
 * DB install check
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const install_db_check = (req, res) =>{
	service.install_db_check(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_db_check}*/result) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(result);
	});
};
/**
 * DB install delete
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const install_db_delete = (req, res) =>{
	service.install_db_delete(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_delete_result}*/result) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(result);
	});
};

export{
	DBInfo, DBInfoSpace, DBInfoSpaceSum, 
	demo_add, demo_delete, demo_get, 
	install_db, install_db_check, install_db_delete
};