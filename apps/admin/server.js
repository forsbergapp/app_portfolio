const ADMIN_ID = 0;
//admin directories
app.use('/admin/images',express.static(__dirname + '/admin/images'));
app.use('/admin/js',express.static(__dirname + '/admin/js'));
app.use('/admin/css',express.static(__dirname + '/admin/css'));

app.get("/admin",function (req, res, next) {
    //redirect from http to https
    if (req.protocol=='http')
      return res.redirect('https://' + req.headers.host + "/admin");
    //redirect naked domain to www
    if (((req.headers.host.split('.').length - 1) == 1) &&
        req.headers.host.indexOf('localhost')==-1)
        return res.redirect('https://www.' + req.headers.host + "/admin");
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
  