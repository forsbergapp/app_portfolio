const { getThemes } = require("../../../service/db/api/app1_theme/app1_theme.service");

module.exports = {
  themes:(app_id) => {
    return new Promise(function (resolve, reject){
        getThemes(app_id, (err, results)  => {
        var html_themes='';
        if (err){
            resolve (
                      `<div class='setting_horizontal_col'>
                          <label id='setting_label_report_theme_day'>Report theme day</label>
                          <div id='setting_themes_day_slider' class='slider'>
                          <div class='slider_wrapper'>
                              <div id='slides_day' class='slides'>
                              </div>
                          </div>
                          <a id='slider_prev_day' class='slider_control slider_prev'></i></a>
                          <a id='slider_next_day' class='slider_control slider_next'></a>
                          </div>
                          <div id='slider_theme_day_id'></div>
                      </div>
                      <div class='setting_horizontal_col'>
                          <label id='setting_label_report_theme_month'>Report theme month</label>
                          <div id='setting_themes_month_slider' class='slider'>
                          <div class='slider_wrapper'>
                              <div id='slides_month' class='slides'>
                              </div>
                          </div>
                          <a id='slider_prev_month' class='slider_control slider_prev'></a>
                          <a id='slider_next_month' class='slider_control slider_next'></a>
                          </div>
                          <div id='slider_theme_month_id'></div>
                      </div>
                      <div class='setting_horizontal_col'>
                          <label id='setting_label_report_theme_year'>Report theme year</label>
                          <div id='setting_themes_year_slider' class='slider'>
                          <div class='slider_wrapper'>
                              <div id='slides_year' class='slides'>
                              </div>
                          </div>
                          <a id='slider_prev_year' class='slider_control slider_prev'></a>
                          <a id='slider_next_year' class='slider_control slider_next'></a>
                          </div>
                          <div id='slider_theme_year_id'></div>
                      </div>`
                  )
        }
        else{
            var span_themes_day ='', span_themes_month='', span_themes_year='';
            //get themes and save result in three theme variables
            results.map( (themes_map,i) => {
                //Node does not like eval('span_themes_' + themes_map.type.toLowerCase()) +=
                var new_span = `<span class="slide slide_${themes_map.type.toLowerCase()}">
                                    <img id='theme_${themes_map.type.toLowerCase()}_${themes_map.id}' 
                                        src='${themes_map.image_preview_url}'
                                        data-theme_id='${themes_map.id}'
                                        data-header_image=${themes_map.image_header}
                                        data-footer_image=${themes_map.image_footer}
                                        data-background_image=${themes_map.image_background}
                                        data-category='${themes_map.category}'
                                    />
                                </span>`;
                switch (themes_map.type.toLowerCase()){
                    case 'day':{
                        span_themes_day += new_span;
                        break;
                    }
                    case 'month':{
                        span_themes_month += new_span;
                        break;
                    }
                    case 'year':{
                        span_themes_year += new_span;
                        break;
                    }
                }  
            })
            //add each theme dynamic variable to wrapping html
            const theme_type_arr = ['day','month','year'];
            theme_type_arr.forEach(themes_type => {
                html_themes += 
                `<div class='setting_horizontal_col'>
                    <label id='setting_label_report_theme_${themes_type}'>Report theme ${themes_type}</label>
                    <div id='setting_themes_${themes_type}_slider' class='slider'>
                    <div class='slider_wrapper'>
                        <div id='slides_${themes_type}' class='slides'>
                            ${eval('span_themes_' + themes_type)}
                        </div>
                    </div>
                    <a id='slider_prev_${themes_type}' class='slider_control slider_prev'></a>
                    <a id='slider_next_${themes_type}' class='slider_control slider_next'></a>
                    </div>
                    <div id='slider_theme_${themes_type}_id'></div>
                </div>`;
            })
            resolve (html_themes);
        }
      });
    })
  }
}
