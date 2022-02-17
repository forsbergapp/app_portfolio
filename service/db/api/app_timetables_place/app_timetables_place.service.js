const {oracle_options,get_pool} = require ("../../config/database");

module.exports = {
	
	getPlace: (app_id, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
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
							${process.env.SERVICE_DB_DB1_NAME}.country      c1,
							${process.env.SERVICE_DB_DB1_NAME}.group_place  gp1, 
							${process.env.SERVICE_DB_DB1_NAME}.group_place  gp2,
							${process.env.SERVICE_DB_DB1_NAME}.app_timetables_place        p
							LEFT OUTER JOIN ${process.env.SERVICE_DB_DB1_NAME}.country c2 
							ON c2.id = p.country2_id  
						WHERE gp1.id = p.group_place1_id
							AND   gp2.id = p.group_place2_id
							AND   c1.id = p.country1_id `,
				[],
				(error, results, fields) => {
					if (error){
						console.log('getPlace err:' + error);
						return callBack(error);
					}
					return callBack(null, results);
				}
			);
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await get_pool(app_id).getConnection();
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
							${process.env.SERVICE_DB_DB2_NAME}.country      c1,
							${process.env.SERVICE_DB_DB2_NAME}.group_place  gp1, 
							${process.env.SERVICE_DB_DB2_NAME}.group_place  gp2,
							${process.env.SERVICE_DB_DB2_NAME}.app_timetables_place        p
							LEFT OUTER JOIN ${process.env.SERVICE_DB_DB2_NAME}.country c2 
							ON c2.id = p.country2_id  
						WHERE gp1.id = p.group_place1_id
							AND   gp2.id = p.group_place2_id
							AND   c1.id = p.country1_id`,
					{},
					oracle_options, (err,result) => {
						if (err) {
							console.log('getPlace err:' + err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
				}catch (err) {
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							console.error(err);
						}
					}
				}
			}
			execute_sql();
		}
	}
};