const ADMIN_ID = 0;
//admin directories
app.use('/admin/images',express.static(process.cwd() + '/apps/admin/images'));
app.use('/admin/js',express.static(process.cwd() + '/apps/admin/js'));
app.use('/admin/css',express.static(process.cwd() + '/apps/admin/css'));
//common directories
app.use('/common/audio',express.static(process.cwd() + '/apps/common/audio'));
app.use('/common/css',express.static(process.cwd() + '/apps/common/css'));
app.use('/common/images',express.static(process.cwd() + '/apps/common/images'));
app.use('/common/js',express.static(process.cwd() + '/apps/common/js'));
app.use('/common/modules',express.static(process.cwd() + '/apps/common/modules'));
//routes
app.get("/admin",(req, res, next) => {
    import(`file://${process.cwd()}/apps/index.js`).then(({ check_app_subdomain}) => {
        if (check_app_subdomain(ADMIN_ID, req.headers.host) ||
            req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www'){
            import(`file://${process.cwd()}/service/forms/forms.controller.js`).then(({ getFormAdmin }) => {
                getFormAdmin(req, res, ADMIN_ID, (err, app_result)=>{
                    return res.send(app_result);
                })
            });
        }
        else
            next();
    })
});
app.get("/admin/:sub",(req, res, next) => {
    return res.redirect('/admin');
});