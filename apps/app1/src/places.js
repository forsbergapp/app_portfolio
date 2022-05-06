const { getPlace } = require("../../../service/db/api/app1_place/app1_place.service");

module.exports = {
  places:(app_id) => {
    return new Promise(function (resolve, reject){
        getPlace(app_id, (err, results)  => {
        var select_places;
        if (err){
          resolve (
                      `<select id='setting_select_popular_place'>
                      <option value="" id="" latitude="0" longitude="0" timezone="" selected="selected">...</option>`
                  )
        }
        else{
            select_places  =`<select id='setting_select_popular_place'>
                             <option value="" id="" latitude="0" longitude="0" timezone="" selected="selected">...</option>`
            results.map( (places_map,i) => {
                if (places_map.country2_flag==null)
                    select_places +=
                    `<option  value='${i}' 
                                id='${places_map.id}' 
                                latitude='${places_map.latitude}' 
                                longitude='${places_map.longitude}' 
                                timezone='${places_map.timezone}'>${places_map.group1_icon} ${places_map.group2_icon} ${places_map.country_flag} ${places_map.title}
                        </option>`;
                else
                    select_places +=
                    `<option  value='${i}' 
                                id='${places_map.id}' 
                                latitude='${places_map.latitude}' 
                                longitude='${places_map.longitude}' 
                                timezone='${places_map.timezone}'>${places_map.group1_icon} ${places_map.group2_icon} ${places_map.country_flag} ${places_map.country2_flag} ${places_map.title}
                        </option>`;
          })
          select_places += '</select>';
          resolve (select_places);
        }
      });
    })
  }
}
