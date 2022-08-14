const {execute_db_sql} = require ("../../common/database");
module.exports = {
	getThemes: (app_id,callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT	t.id,
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
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app2_theme t,
						${process.env.SERVICE_DB_DB1_NAME}.app2_theme_category tc,
						${process.env.SERVICE_DB_DB1_NAME}.app2_theme_type tt
					WHERE tc.id = t.app2_theme_category_id
					AND   tt.id = t.app2_theme_type_id 
					ORDER BY tt.title, t.id`;
			parameters = [];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	t.id "id",
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
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app2_theme t,
						${process.env.SERVICE_DB_DB2_NAME}.app2_theme_category tc,
						${process.env.SERVICE_DB_DB2_NAME}.app2_theme_type tt
					WHERE tc.id = t.app2_theme_category_id
					AND   tt.id = t.app2_theme_type_id
					ORDER BY tt.title, t.id`;
			parameters = {};
		}
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};