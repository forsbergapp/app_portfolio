const router = require("express").Router();
const { getCountries } = require ("./country.controller");
const { checkDataToken } = require("../../../auth/auth.controller");
const { createLogAppRI } = require("../../../log/log.controller");
router.use((req,res,next)=>{
    createLogAppRI(req, res, __appfilename, __appfunction, __appline, req.body).then(function(){
		next();
	})
})
router.get("/:lang_code",  checkDataToken, getCountries);
module.exports = router;