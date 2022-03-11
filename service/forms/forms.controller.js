module.exports = {
    getForm: (app_id, username, callBack) => {
        const {getProfileUsername} = require("../db/api/user_account/user_account.service");
        function main (app_id){
            const { getApp } = require("../../apps");
            const app = getApp(app_id)
            .then(function(app_result){
                return callBack(null, app_result)
            });
        }
        if (app_id==1){
            if (username!=null){
                getProfileUsername(app_id, username, null, (err,result)=>{
                    if (result)
                        main(app_id);
                    else{
                        //return 0 meaning redirect to /
                        return callBack(0);
                    }
                  })
            }
            else
                main(app_id);
        }
        else
                main(app_id);
	},
    getManifest: (app_id, callBack) => {
        const { getParameters } = require ("../db/api/app_parameter/app_parameter.service");
        getParameters(app_id,(err, results) =>{
          if (err) {
            return callBack(err, null)
          }
          else {
            let json = JSON.parse(JSON.stringify(results));
            let pwa_short_name;
            let pwa_name;
            let pwa_description;
            let pwa_start_url;
            let pwa_display;
            let pwa_background_color;
            let pwa_theme_color;
            let pwa_orientation;
            let pwa_icons1_src;
            let pwa_icons1_type;
            let pwa_icons1_sizes;
            let pwa_icons2_src;
            let pwa_icons2_type;
            let pwa_icons2_sizes;
            let pwa_scope;
            for (var i = 0; i < json.length; i++) {
              if (json[i].parameter_name=='PWA_SHORT_NAME')
                pwa_short_name = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_NAME')
                pwa_name = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_DESCRIPTION')
                pwa_description = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_START_URL')
                pwa_start_url = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_DISPLAY')
                pwa_display = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_BACKGROUND_COLOR')
                pwa_background_color = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_THEME_COLOR')
                pwa_theme_color = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_ORIENTATION')
                pwa_orientation = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_ICONS1_SRC')
                pwa_icons1_src = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_ICONS1_TYPE')
                pwa_icons1_type = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_ICONS1_SIZES')
                pwa_icons1_sizes = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_ICONS2_SRC')
                pwa_icons2_src = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_ICONS2_TYPE')
                pwa_icons2_type = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_ICONS2_SIZES')
                pwa_icons2_sizes = json[i].parameter_value;
              if (json[i].parameter_name=='PWA_SCOPE')
                pwa_scope = json[i].parameter_value;
            }
            return callBack(null, JSON.stringify(JSON.parse(
                                `{
                                    "short_name": "${pwa_short_name}",
                                    "name": "${pwa_name}",
                                    "description": "${pwa_description}",
                                    "start_url": "${pwa_start_url}",
                                    "display": "${pwa_display}",
                                    "background_color": "${pwa_background_color}",
                                    "theme_color": "${pwa_theme_color}",
                                    "orientation": "${pwa_orientation}",
                                    "icons": [
                                    {
                                        "src": "${pwa_icons1_src}",
                                        "type": "${pwa_icons1_type}",
                                        "sizes": "${pwa_icons1_sizes}"
                                    },
                                    {
                                        "src": "${pwa_icons2_src}",
                                        "type": "${pwa_icons2_type}",
                                        "sizes": "${pwa_icons2_sizes}"
                                    }
                                    ],
                                    "scope": "${pwa_scope}"
                                }`),null,2)
                            );
          }
        });
    },
    getAdminSecure: (req, res) => {
        const { getAdmin } = require("../../apps/admin/src/secure");
            getAdmin((err, app_result)=>{
                return res.status(200).send(
                    app_result
                );
            })        
	},
    getAdmin: (callBack) => {
        const { getAdmin } = require("../../apps");
            const app = getAdmin()
            .then(function(app_result){
                return callBack(null, app_result);
            });
        
	}
}