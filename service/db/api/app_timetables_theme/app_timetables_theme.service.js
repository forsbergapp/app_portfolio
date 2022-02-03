const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	getThemes: callBack => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
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
				FROM app_timetables_theme t,
					theme_category tc,
					theme_type tt
				WHERE tc.id = t.theme_category_id
				AND   tt.id = t.theme_type_id 
				ORDER BY tt.title, t.id`,
				[],
				(error, results, fields) => {
					if (error){
						return callBack(error);
					}
					return callBack(null, results);
				}
			);
		}else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
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
					FROM app_timetables_theme t,
						theme_category tc,
						theme_type tt
					WHERE tc.id = t.theme_category_id
					AND   tt.id = t.theme_type_id
					ORDER BY tt.title, t.id`,
					{},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
					await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	}
};