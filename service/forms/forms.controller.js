module.exports = {
  getForm: (app_id, params, callBack) => {
    if (app_id==0){
        const { getApp } = require("../../apps");
        const app = getApp(app_id)
        .then(function(app_result){
            return callBack(null, app_result)
        });
    }
    else{
        const { getApp } = require(`../../apps/app${app_id}/client`);
        const app = getApp(app_id, params)
        .then(function(app_result){
            return callBack(null, app_result)
        });
    }
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
        
	},
  getMaintenance: (app_id, callBack) => {
        const { getMaintenance } = require("../../apps");
            const app = getMaintenance(app_id)
            .then(function(app_result){
                return callBack(null, app_result);
            });
        
	}
}