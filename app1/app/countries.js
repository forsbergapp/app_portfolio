const { getCountries } = require("../../service/db/api/country/country.service");

module.exports = {
  countries:(app_id) => {
    return new Promise(function (resolve, reject){
       getCountries(app_id, 'en', (err, results)  => {
        var select_countries;
        if (err){
          resolve (
                    `<select name='country' id='setting_select_country'>
                    <option value='' id='' label='…' selected='selected'>…</option>
                    </select>`
                  )
        }     
        else{
          var current_group_name;
          select_countries  =`<select name='country' id='setting_select_country'>
                              <option value='' id='' label='…' selected='selected'>…</option>`;

          results.map( (countries_map,i) => {
            if (i === 0){
              select_countries += `<optgroup label=${countries_map.group_name} />`;
              current_group_name = countries_map.group_name;
            }
            else{
              if (countries_map.group_name !== current_group_name){
                  select_countries += `<optgroup label=${countries_map.group_name} />`;
                  current_group_name = countries_map.group_name;
              }
              select_countries +=
              `<option value=${i}
                      id=${countries_map.id} 
                      country_code=${countries_map.country_code} 
                      flag_emoji=${countries_map.flag_emoji} 
                      group_name=${countries_map.group_name}>${countries_map.flag_emoji} ${countries_map.text}
              </option>`
            }
          })
          select_countries += '</select>';
          resolve (select_countries);
        }
      });
    })
  }
}
