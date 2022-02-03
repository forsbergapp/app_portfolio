const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	
	getPlace: callBack => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
				` SELECT	p.id,
							p.title,
							p.latitude,
							p.longitude,
							p.timezone,
							c1.country_code	   country,
							c1.flag_emoji      country_flag,
							c2.country_code    country2,
							c2.flag_emoji      country2_flag,
							gp1.group_name     group1,
							gp1.icon_emoji     group1_icon,
							gp2.group_name     group2,
							gp2.icon_emoji     group2_icon
						FROM
							country      c1,
							group_place  gp1, 
							group_place  gp2,
							app_timetables_place        p
							LEFT OUTER JOIN country c2 
							ON c2.id = p.country2_id  
						WHERE gp1.id = p.group_place1_id
							AND   gp2.id = p.group_place2_id
							AND   c1.id = p.country1_id `,
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
					`SELECT	p.id "id",
							p.title "title",
							p.latitude "latitude",
							p.longitude "longitude",
							p.timezone "timezone",
							c1.country_code	   "country",
							c1.flag_emoji      "country_flag",
							c2.country_code    "country2",
							c2.flag_emoji      "country2_flag",
							gp1.group_name     "group1",
							gp1.icon_emoji     "group1_icon",
							gp2.group_name     "group2",
							gp2.icon_emoji     "group2_icon"
						FROM
							country      c1,
							group_place  gp1, 
							group_place  gp2,
							app_timetables_place        p
							LEFT OUTER JOIN country c2 
							ON c2.id = p.country2_id  
						WHERE gp1.id = p.group_place1_id
							AND   gp2.id = p.group_place2_id
							AND   c1.id = p.country1_id`,
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