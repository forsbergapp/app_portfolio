const APP3_ID = 3;
const { check_app_subdomain} = require("../apps");
//app 3 directory
app.use('/app3/css',express.static(__dirname + '/app3/css'));
app.use('/app3/images',express.static(__dirname + '/app3/images'));
app.use('/app3/js',express.static(__dirname + '/app3/js'));

app.get('/:doc', function(req, res,next) {
  if (check_app_subdomain(APP3_ID, req.headers.host)) {
    if (req.params.doc =='1' ||
        req.params.doc =='2' ||
        req.params.doc =='3' ) {
        const { getForm} = require("../service/forms/forms.controller");
        getForm(req, res, APP3_ID, null,(err, app_result)=>{
          return res.send(app_result);
        })
    }
    else
      return res.redirect('/');
  }
  else
      next();
});

app.get('/',function (req, res, next) {
  if (check_app_subdomain(APP3_ID, req.headers.host)){
    const { getForm} = require("../service/forms/forms.controller");
    getForm(req, res, APP3_ID, null,(err, app_result)=>{
        return res.send(app_result);
    })
  }
  else
    next();
});
