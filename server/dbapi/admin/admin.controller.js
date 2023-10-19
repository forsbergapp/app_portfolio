/** @module server/dbapi/admin */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import('./admin.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * DB Info
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const DBInfo = (req, res) => {
	service.DBInfo(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.db_result_DBInfo}*/results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});	
};
/**
 * DB Info space
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const DBInfoSpace = (req, res) => {
	service.DBInfoSpace(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.db_result_DBInfoSpace}*/results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
/**
 * DB Info space sum
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const DBInfoSpaceSum = (req, res) => {
	service.DBInfoSpaceSum(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.db_result_DBInfoSpaceSum}*/results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
/**
 * DB demo add
 * @param {Types.req} req 
 * @param {Types.res} res 
 */

const demo_add = async (req, res)=> {
	service.demo_add(getNumberValue(req.query.app_id), req.body.demo_password, req.query.lang_code, (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_result}*/results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json(results);
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
	service.demo_get(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.db_result_getDemousers}*/results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
/**
 * DB install
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const install_db = (req, res) =>{
	service.install_db(getNumberValue(req.query.app_id),getNumberValue(req.query.optional), (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_result}*/results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(results);
	});
};
/**
 * DB install check
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const install_db_check = (req, res) =>{
	service.install_db_check(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_db_check}*/results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(results);
	});
};
/**
 * DB install delete
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const install_db_delete = (req, res) =>{
	service.install_db_delete(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, /**@type{Types.admin_db_install_delete_result}*/results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(results);
	});
};

export{
	DBInfo, DBInfoSpace, DBInfoSpaceSum, 
	demo_add, demo_delete, demo_get, 
	install_db, install_db_check, install_db_delete
};