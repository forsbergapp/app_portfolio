const { getSettings } = require("../../../service/db/app_portfolio/regional_setting/regional_setting.service");

module.exports = {
  regional_setting:(app_id, lang_code, regional_type) => {
    return new Promise(function (resolve, reject){
        //get options for SELECT list
        //used by 2 SELECT
        getSettings(app_id,lang_code, regional_type, (err, results)  => {
        var select_settings ='';
        if (err){
          resolve (
                      `<option id='' value=''></option>`
                  )
        } 
        else{
          results.map( (settings_map,i) => {
              select_settings +=
              `<option id=${settings_map.id} value=${settings_map.data}>${settings_map.text}</option>`;
          })
          resolve (select_settings);
        }
      });
    })
  }
}
