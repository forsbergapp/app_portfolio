const {execute_db_sql, get_schema_name} = await import(`file://${process.cwd()}/service/db/common/common.service.js`);
const getThemes = (app_id,callBack) => {
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
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(({COMMON}) => {
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
export{getThemes};