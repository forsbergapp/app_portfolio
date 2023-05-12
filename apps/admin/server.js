const {default:express} = await import('express');
const server = (app) =>{
    const ADMIN_ID = 0;
    app.use('/admin',express.static(process.cwd() + '/apps/admin/public'));
    app.use('/common',express.static(process.cwd() + '/apps/common/public'));
    //routes
    app.get("/",(req, res, next) => {
        import(`file://${process.cwd()}/apps/apps.service.js`).then(({check_app_subdomain}) => {
            if (check_app_subdomain(ADMIN_ID, req.headers.host)){
                import(`file://${process.cwd()}/apps/apps.controller.js`).then(({ getAppAdmin}) => {
                    getAppAdmin(req, res, ADMIN_ID, (err, app_result)=>{
                        return res.send(app_result);
                    })
                })
            }
            else
                next();
        })
    });
    app.get("/:sub",(req, res, next) => {
        import(`file://${process.cwd()}/apps/apps.service.js`).then(({check_app_subdomain}) => {
            if (check_app_subdomain(ADMIN_ID, req.headers.host)){
                return res.redirect('/');
            }
            else
                next();
        })
    });
}
export {server}