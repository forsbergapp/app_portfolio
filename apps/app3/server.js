const APP3_ID = 3;
//app 3 directory
app.use('/app3/css',express.static(process.cwd() + '/apps/app3/css'));
app.use('/app3/images',express.static(process.cwd() + '/apps/app3/images'));
app.use('/app3/js',express.static(process.cwd() + '/apps/app3/js'));

app.get('/:doc', function(req, res,next) {
  import(`file://${process.cwd()}/apps/index.js`).then(function({ check_app_subdomain}){
    if (check_app_subdomain(APP3_ID, req.headers.host)) {
      if (req.params.doc =='1' ||
          req.params.doc =='2' ||
          req.params.doc =='3' ) {
          import(`file://${process.cwd()}/service/forms/forms.controller.js`).then(function({ getForm}){
            getForm(req, res, APP3_ID, null,(err, app_result)=>{
              return res.send(app_result);
            })
          })
      }
      else
        return res.redirect('/');
    }
    else
        next();
  })
});

app.get('/',function (req, res, next) {
  import(`file://${process.cwd()}/apps/index.js`).then(function({ check_app_subdomain}){
    if (check_app_subdomain(APP3_ID, req.headers.host)){
      import(`file://${process.cwd()}/service/forms/forms.controller.js`).then(function({ getForm}){
        getForm(req, res, APP3_ID, null,(err, app_result)=>{
            return res.send(app_result);
        })
      })
    }
    else
      next();
  })
});
