const ADMIN_ID = 0;
//admin directories
app.use('/admin/images',express.static(__dirname + '/admin/images'));
app.use('/admin/js',express.static(__dirname + '/admin/js'));
app.use('/admin/css',express.static(__dirname + '/admin/css'));

app.get("/admin",function (req, res, next) {
    if (req.headers.host.substring(0,req.headers.host.indexOf('.'))=='' ||
        req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www'){
        const { getFormAdmin } = require ("../service/forms/forms.controller");
        getFormAdmin(req, res, ADMIN_ID, (err, app_result)=>{
            return res.send(app_result);
        })
    }
    else
        next();
});
app.get("/admin/:sub",function (req, res, next) {
    return res.redirect('https://' + req.headers.host + "/admin");
});
//common directories
app.use('/common/audio',express.static(__dirname + '/common/audio'));
app.use('/common/css',express.static(__dirname + '/common/css'));
app.use('/common/images',express.static(__dirname + '/common/images'));
app.use('/common/js',express.static(__dirname + '/common/js'));
app.use('/common/modules',express.static(__dirname + '/common/modules'));
