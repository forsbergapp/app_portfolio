/** @module server/dbapi/app_portfolio/country */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./country.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getCountries = (req, res) => {
	service.getCountries(getNumberValue(req.query.app_id), req.params.lang_code ?? 'en')
	.then((result)=> {
		res.status(200).json({
			countries: result
		});
	})
	.catch((/**@type{Types.error}*/error)=> {
		res.status(500).send({
			data: error
		});
	});
};
export{getCountries};