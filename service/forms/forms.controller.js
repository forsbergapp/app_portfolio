module.exports = {
    getForm: (app_id, username, callBack) => {
        const {getProfileUsername} = require("../db/api/user_account/user_account.service");
        function main (){
            const { getApp } = require("../../app1/app");
            const app = getApp(app_id)
            .then(function(app_result){
                return callBack(null, app_result)
            });
        }
        if (app_id==1){
            if (username!=null){
                getProfileUsername(app_id, username, null, (err,result)=>{
                    if (result)
                        main();
                    else{
                        //return 0 meaning redirect to /
                        return callBack(0);
                    }
                  })
            }
            else
                main();
        }
	},
    getAdminSecure: (req, res) => {
        const { getAdmin } = require("../../admin/app/secure");
            getAdmin((err, app_result)=>{
                return res.status(200).send(
                    app_result
                );
            })        
	},
    getAdmin: (callBack) => {
        const { getAdmin } = require("../../admin/app");
            const app = getAdmin()
            .then(function(app_result){
                return callBack(null, app_result);
            });
        
	}
}