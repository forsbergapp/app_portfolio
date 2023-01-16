const {default:{sign, verify}} = await import("jsonwebtoken");

const {CheckFirstTime, ConfigGet, CreateSystemAdmin} = await import(`file://${process.cwd()}/server/server.service.js`);
const {createLogAppCI} = await import(`file://${process.cwd()}/service/log/log.controller.js`);

function checkAdmin(req, res, next){
    let token = req.get("authorization");
    if (token){
        token = token.slice(7);
        verify(token, ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), (err, decoded) => {
            if (err){
                createLogAppCI(req, res, __appfilename(import.meta.url), __appfunction(), __appline(), 'SYSTEM ADMIN CheckAdmin token verify error: ' + err).then(function(){
                    res.status(401).send({
                        message: '⛔'
                    });
                });
            } else {
                next();
            }
        });
        
    }else{
        createLogAppCI(req, res, __appfilename(import.meta.url), __appfunction(), __appline(), 'SYSTEM ADMIN CheckAdmin token missing').then(function(){
            res.status(401).send({
                message: '⛔'
            });
        });
    }
}
function authAdmin(req, res){
    function check_user(username, password){
        let config_username = ConfigGet(6)['username'];
        let config_password = ConfigGet(6)['password'];
        if (username == config_username &&
            password == config_password) {
            let jsontoken_at;
            jsontoken_at = sign ({tokentimstamp: Date.now()}, ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), {
                                expiresIn: ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_EXPIRE_ACCESS')
                                });
            createLogAppCI(req, res, __appfilename(import.meta.url), __appfunction(), __appline(), 'SYSTEM ADMIN login OK:' + ConfigGet(1, 'SERVER', 'ADMIN_NAME')).then(function(){
                return res.status(200).json({ 
                    token_at: jsontoken_at
                });
            });
        }
        else
            createLogAppCI(req, res, __appfilename(import.meta.url), __appfunction(), __appline(), 'SYSTEM ADMIN login FAIL:' + ConfigGet(1, 'SERVER', 'ADMIN_NAME')).then(function(){
                return res.status(401).send({ 
                    message: '⛔'
                });
            })
    }
    if(req.headers.authorization){                
        let userpass = new Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
        let username = userpass.split(':')[0];
        let password = userpass.split(':')[1];
        if (CheckFirstTime())
            CreateSystemAdmin(username, password, (err, result) =>{
                check_user(username, password);
            })
        else
            check_user(username, password);
    }
    else
        return res.status(401).send({ 
            message: '⛔'
        });
}
export {checkAdmin, authAdmin}
