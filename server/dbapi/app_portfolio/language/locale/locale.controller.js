/** @module server/dbapi/app_portfolio/language/locale */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../../types.js';

const service = await import('./locale.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getLocales = (req, res) => {
	service.getLocales(getNumberValue(req.query.app_id), req.params.lang_code ?? 'en')
	.then((result)=> {
		res.status(200).json({
			locales: result
		});
	})
	.catch((/**@type{Types.error}*/error)=> {
		res.status(500).send({
			data: error
		});
	});
};
export{getLocales};