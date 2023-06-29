const {default:{sign, verify}} = await import('jsonwebtoken');

const {CheckFirstTime, ConfigGet, CreateSystemAdmin} = await import(`file://${process.cwd()}/server/server.service.js`);

const checkSystemAdmin = (req, res, next) => {
    let token = req.get('authorization');
    if (token){
        token = token.slice(7);
        verify(token, ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), (err) => {
            if (err){
                res.status(401).send({
                    message: '⛔'
                });
            } else {
                next();
            }
        });
        
    }else{
        res.status(401).send({
            message: '⛔'
        });
    }
};
const authSystemAdmin = (req, res) => {
    const check_user = async (username, password) => {
        const { default: {compareSync} } = await import('bcryptjs');
        const config_username = ConfigGet(6)['username'];
        const config_password = ConfigGet(6)['password'];
        if (username == config_username && compareSync(password, config_password)) {
            const jsontoken_at = sign ({tokentimstamp: Date.now()}, ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_SECRET'), {
                                expiresIn: ConfigGet(1, 'SERVICE_AUTH', 'ADMIN_TOKEN_EXPIRE_ACCESS')
                                });
            return res.status(200).json({ 
                token_at: jsontoken_at
            });
        }
        else{
            return res.status(401).send('⛔');
        }            
    };
    if(req.headers.authorization){                
        const userpass = new Buffer.from((req.headers.authorization || '').split(' ')[1] || '', 'base64').toString();
        const username = userpass.split(':')[0];
        const password = userpass.split(':')[1];
        if (CheckFirstTime())
            CreateSystemAdmin(username, password, () =>{
                check_user(username, password);
            });
        else
            check_user(username, password);
    }
    else
        return res.status(401).send('⛔');
};
export {checkSystemAdmin, authSystemAdmin};
