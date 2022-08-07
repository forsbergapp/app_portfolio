const {execute_db_sql} = require ("../../common/database");
module.exports = {
	
	getPlace: (app_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = ` SELECT	p.id,
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
							${process.env.SERVICE_DB_DB1_NAME}.app1_group_place  gp1, 
							${process.env.SERVICE_DB_DB1_NAME}.app1_group_place  gp2,
							${process.env.SERVICE_DB_DB1_NAME}.app1_place        p
							LEFT OUTER JOIN ${process.env.SERVICE_DB_DB1_NAME}.country c2 
							ON c2.id = p.country2_id  
						WHERE gp1.id = p.group_place1_id
							AND   gp2.id = p.group_place2_id
							AND   c1.id = p.country1_id `;
			parameters = [];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	p.id "id",
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
							${process.env.SERVICE_DB_DB2_NAME}.app1_group_place  gp1, 
							${process.env.SERVICE_DB_DB2_NAME}.app1_group_place  gp2,
							${process.env.SERVICE_DB_DB2_NAME}.app1_place        p
							LEFT OUTER JOIN ${process.env.SERVICE_DB_DB2_NAME}.country c2 
							ON c2.id = p.country2_id  
						WHERE gp1.id = p.group_place1_id
							AND   gp2.id = p.group_place2_id
							AND   c1.id = p.country1_id`;
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