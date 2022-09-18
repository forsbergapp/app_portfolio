const APP3_ID = 3;
//app 3 directory
app.use('/app3/css',express.static(__dirname + '/apps/app3/css'));
app.use('/app3/images',express.static(__dirname + '/apps/app3/images'));
app.use('/app3/js',express.static(__dirname + '/apps/app3/js'));

app.get('/:doc', function(req, res,next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app3' &&  
    req.params.doc!=='' &&
    req.params.doc!=='robots.txt' &&
    req.params.doc!=='favicon.ico' &&
    req.params.doc!=='css' &&
    req.params.doc!=='images' &&
    req.params.doc!=='js') {
    if (req.params.doc =='1' ||
        req.params.doc =='2' ||
        req.params.doc =='3' ) {
        if (req.protocol=='http')
          return res.redirect('https://' + req.headers.host);
        else{
          const { getForm} = require("./service/forms/forms.controller");
          getForm(req, res, APP3_ID, null,(err, app_result)=>{
            return res.send(app_result);
          })
        }
    }
    else
      return res.redirect('/');
  }
  else
      next();
});

app.get('/',function (req, res, next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app3'){
    //redirect from http to https
    if (req.protocol=='http')
      return res.redirect('https://' + req.headers.host);
    const { getForm} = require("./service/forms/forms.controller");
    getForm(req, res, APP3_ID, null,(err, app_result)=>{
        return res.send(app_result);
    })
  }
  else
    next();
});
