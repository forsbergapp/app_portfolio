const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const { createLogAppCI } = require(global.SERVER_ROOT + "/service/log/log.controller");
module.exports = {
    checkAdmin: (req, res, next) => {
		let token = req.get("authorization");
		if (token){
            token = token.slice(7);
            verify(token, ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), (err, decoded) => {
                if (err){
                    createLogAppCI(req, res, __appfilename, __appfunction, __appline, 'SYSTEM ADMIN CheckAdmin token verify error: ' + err).then(function(){
                        res.status(401).send({
                            message: '⛔'
                        });
                    });
                } else {
                    next();
                }
            });
            
		}else{
			createLogAppCI(req, res, __appfilename, __appfunction, __appline, 'SYSTEM ADMIN CheckAdmin token missing').then(function(){
                res.status(401).send({
                    message: '⛔'
                });
            });
		}
	},
    authAdmin: (req, res) => {
        if(req.headers.authorization){                
            let userpass = new Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
            if (userpass == ConfigGet(6)['username'] + ':' + ConfigGet(6)['password']) {
                let jsontoken_at;
                jsontoken_at = sign ({tokentimstamp: Date.now()}, ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), {
                                    expiresIn: ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_EXPIRE_ACCESS')
                                    });
                createLogAppCI(req, res, __appfilename, __appfunction, __appline, 'SYSTEM ADMIN login OK:' + ConfigGet(1, 'SERVER', 'ADMIN_NAME')).then(function(){
                    return res.status(200).json({ 
                        token_at: jsontoken_at
                    });
                });
            }
            else
                createLogAppCI(req, res, __appfilename, __appfunction, __appline, 'SYSTEM ADMIN login FAIL:' + ConfigGet(1, 'SERVER', 'ADMIN_NAME')).then(function(){
                    return res.status(401).send({ 
                        message: '⛔'
                    });
                })
        }
        else
            return res.status(401).send({ 
                message: '⛔'
            });
    }
}