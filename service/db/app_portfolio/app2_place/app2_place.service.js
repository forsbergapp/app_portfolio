const {execute_db_sql, get_schema_name} = require (global.SERVER_ROOT + "/service/db/common/common.service");
module.exports = {
	
	getPlace: (app_id, callBack) => {
		let sql;
		let parameters;
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
				 FROM	${get_schema_name()}.country      c1,
						${get_schema_name()}.app2_group_place  gp1, 
						${get_schema_name()}.app2_group_place  gp2,
						${get_schema_name()}.app2_place        p
						LEFT OUTER JOIN ${get_schema_name()}.country c2 
						ON c2.id = p.country2_id  
				WHERE   gp1.id = p.group_place1_id
				  AND   gp2.id = p.group_place2_id
				  AND   c1.id = p.country1_id`;
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