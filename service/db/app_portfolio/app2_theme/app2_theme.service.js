const {execute_db_sql, get_schema_name} = require (global.SERVER_ROOT + "/service/db/common/common.service");
module.exports = {
	getThemes: (app_id,callBack) => {
		let sql;
		let parameters;
		sql = `SELECT t.id "id",
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
					FROM ${get_schema_name()}.app2_theme t,
						${get_schema_name()}.app2_theme_category tc,
						${get_schema_name()}.app2_theme_type tt
				WHERE tc.id = t.app2_theme_category_id
					AND tt.id = t.app2_theme_type_id
				ORDER BY tt.title, t.id`;
		parameters = {};
		execute_db_sql(app_id, sql, parameters, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};