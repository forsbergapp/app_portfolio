const APP2_ID = 2;
//app 2 directory
app.use('/app2',express.static(__dirname + '/apps/app2'));

app.get('/favicon.ico', function (req, res, next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app2')
    res.sendFile(__dirname + "/apps/app2/images/favicon.ico");
  else
    next();  
});
  
app.get('/',function (req, res, next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app2'){
    //redirect from http to https
    if (req.protocol=='http')
      return res.redirect('https://' + req.headers.host);
    const { getForm} = require("./service/forms/forms.controller");
    getForm(req, res, APP2_ID, null,(err, app_result)=>{
        return res.send(app_result);
    })
  }
  else
    next();
});