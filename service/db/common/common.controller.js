const { execute_db_sql } = require ("./common.service");
module.exports = {
	execute_db_sql: (req, res) => {
		execute_db_sql(req.body.app_id,
                       req.body.sql,
                       req.body.parameters,
                       req.body.admin,
                       req.body.app_filename,
                       req.body.app_function, 
                       req.body.app_line, (err, results) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			return res.status(200).json(
				results
			);
		});
	},
}