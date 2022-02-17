const { getLocales } = require("../../service/db/api/language/locale/locale.service");

module.exports = {
  locales:(app_id) => {
    return new Promise(function (resolve, reject){
        //get options for SELECT list
        //used by 2 SELECT
        getLocales(app_id,'en', (err, results)  => {
        var select_locales ='';
        if (err){
          resolve (
                      `<option id='' value='en-us' selected='selected'>English</option>`
                  )
        } 
        else{
          results.map( (locales_map,i) => {
              select_locales +=
              `<option id=${i} value=${locales_map.locale}>${locales_map.text}</option>`;
          })
          resolve (select_locales);
        }
      });
    })
  }
}
