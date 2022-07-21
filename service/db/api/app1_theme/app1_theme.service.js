const {oracledb, get_pool} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.controller");
module.exports = {
	getThemes: (app_id,callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
				`SELECT
						t.id,
						t.title,
						t.author,
						t.author_url,
						CONVERT(t.image_preview USING UTF8) image_preview,
						t.image_preview_url,
						CONVERT(t.image_background USING UTF8) image_background,
						t.image_background_url,
						CONVERT(t.image_header USING UTF8) image_header,
						t.image_header_url,
						CONVERT(t.image_footer USING UTF8) image_footer,
						t.image_footer_url,
						t.premium,
						tc.title category,
						tt.title type
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_theme t,
					 ${process.env.SERVICE_DB_DB1_NAME}.app1_theme_category tc,
					 ${process.env.SERVICE_DB_DB1_NAME}.app1_theme_type tt
				WHERE tc.id = t.app1_theme_category_id
				AND   tt.id = t.app1_theme_type_id 
				ORDER BY tt.title, t.id`,
				[],
				(error, results, fields) => {
					if (error){
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}
			);
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`SELECT
							t.id "id",
							t.title "title",
							t.author "author",
							t.author_url "author_url",
							t.image_preview "image_preview",
							t.image_preview_url "image_preview_url",
							t.image_background "image_background",
							t.image_background_url "image_background_url",
							t.image_header "image_header",
							t.image_header_url "image_header_url",
							t.image_footer "image_footer",
							t.image_footer_url "image_footer_url",
							t.premium "premium",
							tc.title "category",
							tt.title "type"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_theme t,
						 ${process.env.SERVICE_DB_DB2_NAME}.app1_theme_category tc,
						 ${process.env.SERVICE_DB_DB2_NAME}.app1_theme_type tt
					WHERE tc.id = t.app1_theme_category_id
					AND   tt.id = t.app1_theme_type_id
					ORDER BY tt.title, t.id`,
					{},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
				}catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	}
};