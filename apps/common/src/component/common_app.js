/**
 * @module apps/common/src/component/common_app
 */  

/**
 * @typedef {import('../../../../server/security')['securityTransportEncrypt']} securityTransportEncrypt
 * @typedef {import('../common.js')['commonConvertBinary']} commonConvertBinary
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{app_id:number,
*          app_admin_app_id:number,
*          rest_resource_bff:string,
*          app_rest_api_version:string,
*          app_request_timeout_seconds: number,
*          app_requesttimeout_admin_minutes: number,
*          idToken:string,
*          uuid:string,
*          secret:string,
*          encrypt_transport:number,
*          securityTransportEncrypt:securityTransportEncrypt,
*          cssStart:string,
*          cssCommon:string,
*          jsCommon:string,
*          cssFonts:string}} props
* @returns {string}
*/
const template = props =>`  <!DOCTYPE html>
                           <html>
                           <head>
                               <meta charset='UTF-8'>
                               <title></title>
                               <meta name="HandheldFriendly" content="true"/>
                               <meta name='mobile-web-app-capable' content='yes'>
                               <meta name='viewport' content='width=device-width, minimum-scale=1.0, maximum-scale = 1'>
                           </head>	
                           <body class='start'>
                               <script type='module'>
                                   const cssStart = '${props.cssStart}';
                                   const cssFonts = '${props.cssFonts}';
                                   const cssCommon = '${props.cssCommon}';
                                   const encrypt_transport = ${props.encrypt_transport==1?'true':'false'};

                                   const common = await import(URL.createObjectURL(  new Blob ([atob('${props.jsCommon}')],{type: 'text/javascript'})));
                                   
                                   common.commonMiscCssApply(atob(cssStart) + atob(cssFonts));

                                   /**
                                    * @description Receives server side event from BFF, decrypts message using start uuid and delegates message
                                    * @param {{socket:*, 
                                    *          uuid:string|null, 
                                    *          secret:string|null}} parameters
                                    */
                                   const FFB_SSE = async parameters =>{
                                        /**
                                         * @returns {sse_type:string,
                                         *           sse_message:string}
                                         */
                                        const getMessage = BFFmessage =>{
                                           const messageDecoded = common.commonWindowFromBase64(BFFmessage);
                                           return {sse_type:JSON.parse(messageDecoded).sse_type,
                                                   sse_message:JSON.parse(messageDecoded).sse_message};
                                        }
                                        const BFFStream = new WritableStream({
                                           async write(data, controller){
                                                const BFFmessage = encrypt_transport?
                                                                        await common.commonWindowDecrypt({  secret:parameters.secret, 
                                                                                                            data:new TextDecoder('utf-8').decode(new Uint8Array(data)).split('data: ')[1]}):
                                                                            new TextDecoder('utf-8').decode(new Uint8Array(data)).split('\\n\\n')[0].split('data: ')[1];
                                                const SSEmessage = getMessage(BFFmessage);
                                                switch (SSEmessage.sse_type){
                                                    case 'INIT':{
                                                            const INITmessage = JSON.parse(SSEmessage.sse_message);
                                                            if (x.apps && INITmessage.APP_PARAMETER.Info.x)
                                                                for (const app of INITmessage.APP_PARAMETER.Info.x)
                                                                    x.apps.push(app)
                                                            await common[Object.keys(common.default)[0]]( INITmessage.APP_PARAMETER, x);
                                                            common.commonMiscCssApply(common.commonWindowFromBase64(cssCommon));
                                                            break;
                                                    }
                                                    case 'FONT_URL':{
                                                        common.commonMiscLoadFont({ app_id:             ${props.app_id},
                                                                                    uuid:               '${props.uuid}',
                                                                                    secret:             '${props.secret}',
                                                                                    message:            SSEmessage.sse_message,
                                                                                    cssFonts:           cssFonts})
                                                        break;
                                                    }
                                                    default:{
                                                        common.commonSocketSSEShow(SSEmessage);
                                                        break
                                                    }
                                                }
                                           }
                                       //The total number of chunks that can be contained in the internal queue before backpressure is applied
                                       }, new CountQueuingStrategy({ highWaterMark: 1 }));
                                       const BFF = parameters.socket.pipeTo(BFFStream).catch(()=>common.commonWindowSetTimeout(()=>{common.commonSocketConnectOnline();}, 5000));
                                   }
                                   /**
                                    * @description Front end for backend (FFB) that receives responses 
                                    *              from backend for frontend (BFF)
                                    * @param {{app_id:number,
                                    *          uuid:string,
                                    *          secret:string,
                                    *          response_type?:'SSE'|'TEXT'|'BLOB',
                                    *          spinner_id?:string|null,
                                    *          timeout?:number|null,
                                    *          app_admin_app_id:number,
                                    *          rest_api_version: string,
                                    *          rest_bff_path   : string,
                                    *          data:{
                                    *              locale:string,
                                    *              idToken: string,
                                    *              accessToken?:string,
                                    *              query?:string|null,
                                    *              method:string,
                                    *              authorization_type:string,
                                    *              username?:string,
                                    *              password?:string,
                                    *              body?:*,
                                    *          }}} parameters
                                    */
                                   const FFB = async parameters =>{
                                       /**@type{number} */
                                       let status;
                                       let authorization = null;
                                       
                                       parameters.data.query = parameters.data.query==null?'':parameters.data.query;
                                       parameters.data.body = parameters.data.body?parameters.data.body:null;
                                       //admin uses ADMIN instead of APP_ACCESS so all ADMIN requests use separate admin token
                                       const ROLE = (parameters.app_id == parameters.app_admin_app_id && parameters.data.authorization_type =='APP_ACCESS')?
                                                       'ADMIN':parameters.data.authorization_type;
                                       switch (ROLE){
                                           case 'APP_ACCESS':
                                           case 'APP_ACCESS_VERIFICATION':
                                           case 'APP_ACCESS_EXTERNAL':
                                           case 'ADMIN':{
                                               authorization = 'Bearer ' + parameters.data.accessToken;
                                               break;
                                           }
                                           case 'IAM':{
                                               authorization = 'Basic ' + btoa(parameters.data.username + ':' + parameters.data.password);
                                               break;
                                           }
                                       }
                                       //add common query parameter
                                       parameters.data.query += '&locale=' + (parameters.data.locale??'');

                                       //encode query parameters
                                       const encodedparameters = parameters.data.query?btoa(parameters.data.query):'';
                                       const bff_path = parameters.rest_bff_path + '/' + 
                                                           ROLE.toLowerCase() + 
                                                           '/v' + (parameters.rest_api_version ??1);
                                       const url = encrypt_transport?
                                                       ('/bff/x/' + parameters.uuid):
                                                           bff_path + parameters.data.path + '?parameters=' + encodedparameters;

                                       if (parameters.spinner_id && common.COMMON_DOCUMENT?.querySelector('#' + parameters.spinner_id))
                                           common.COMMON_DOCUMENT.querySelector('#' + parameters.spinner_id).classList.add('css_spinner');
                                       const resultFetch = {finished:false};
                                       const options = encrypt_transport?
                                                           //encrypted options
                                                           {
                                                           cache:  'no-store',
                                                           method: 'POST',
                                                           headers:{
                                                                       ...(parameters.response_type =='SSE' && {'Cache-control': 'no-cache'}),
                                                                       'Content-Type': 'application/json',
                                                                       'Connection':   parameters.response_type =='SSE'?
                                                                                           'keep-alive':
                                                                                               'close',
                                                                   },
                                                           body: JSON.stringify({
                                                                   x: await common.commonWindowEncrypt({
                                                                        secret:parameters.secret,
                                                                        data:JSON.stringify({  
                                                                                headers:{
                                                                                        'app-id':       parameters.app_id,
                                                                                        'app-signature':await common.commonWindowEncrypt({ secret:parameters.secret,
                                                                                                                        data:'FFB'}),
                                                                                        'app-id-token': 'Bearer ' + parameters.data.idToken,
                                                                                        ...(authorization && {Authorization: authorization}),
                                                                                        'Content-Type': parameters.response_type =='SSE'?
                                                                                                            'text/event-stream':
                                                                                                                'application/json',
                                                                                        },
                                                                                method: parameters.data.method,
                                                                                url:    bff_path + parameters.data.path + '?parameters=' + encodedparameters,
                                                                                body:   parameters.data.body?
                                                                                            JSON.stringify({data:btoa(JSON.stringify(parameters.data.body))}):
                                                                                                null
                                                                            })
                                                                        })
                                                               })
                                                           }
                                                       :
                                                           //not encrypted options
                                                           {
                                                           cache: 'no-store',
                                                           method: parameters.data.method,
                                                           headers:{   'app-id': parameters.app_id,
                                                                       'app-signature': 'commonFFB',
                                                                       'app-id-token': 'Bearer ' + parameters.data.idToken,
                                                                       ...(parameters.response_type =='SSE' && {'Cache-control': 'no-cache'}),
                                                                       'Content-Type': parameters.response_type =='SSE'?
                                                                                           'text/event-stream':
                                                                                               'application/json',
                                                                       'Connection':   parameters.response_type =='SSE'?
                                                                                           'keep-alive':
                                                                                               'close',
                                                                       ...(authorization && {Authorization: authorization})},
                                                           body:  parameters.data.body?
                                                                       JSON.stringify({data:btoa(JSON.stringify(parameters.data.body))}):
                                                                           null
                                                           };
                                       const showError      = message   => common.commonMessageShow('ERROR_BFF', null, null, message);
                                       return parameters.response_type=='SSE'?
                                               fetch(url, options).then(result=>FFB_SSE({socket:result.body, uuid:parameters.uuid, secret:parameters.secret})):
                                                   await Promise.race([ new Promise((resolve)=>
                                                                       setTimeout(()=>{
                                                                           if (resultFetch.finished==false){
                                                                               showError('🗺⛔?');
                                                                               resolve('🗺⛔?');
                                                                               throw ('TIMEOUT');
                                                                           }
                                                                           }, parameters.app_id == parameters.app_admin_app_id?
                                                                                   (1000 * 60 * ${props.app_requesttimeout_admin_minutes}):
                                                                                   parameters.timeout || (1000 * ${props.app_request_timeout_seconds}))),
                                                                       await fetch(url, options)
                                                                           .then(response =>{
                                                                               status = response.status;
                                                                               return response.text();
                                                                            })
                                                                           .then(result => {
                                                                               return (encrypt_transport?
                                                                                    common.commonWindowDecrypt({secret:parameters.secret, data:result}):
                                                                                        async ()=>result)
                                                                               .then(result_decrypted=>{
                                                                                    switch (status){
                                                                                        case 200:
                                                                                        case 201:{
                                                                                            /**@ts-ignore */
                                                                                            return result_decrypted;
                                                                                        }
                                                                                        case 400:{
                                                                                            //Bad request
                                                                                            common.commonMessageShow('ERROR_BFF', null, 'message_text', '!');
                                                                                            throw result_decrypted;
                                                                                        }
                                                                                        case 404:   //Not found
                                                                                        case 401:   //Unauthorized, token expired
                                                                                        case 403:   //Forbidden, not allowed to login or register new user
                                                                                        case 503:   //Service unavailable or other error in microservice
                                                                                        {   
                                                                                            showError(result_decrypted);
                                                                                            throw result_decrypted;
                                                                                        }
                                                                                        case 500:{
                                                                                            //Unknown error
                                                                                            common.commonException(common.COMMON_GLOBAL.app_function_exception, result_decrypted);
                                                                                            throw result_decrypted;
                                                                                        }
                                                                                    }
                                                                                })
                                                                           })
                                                                           .catch(error=>{
                                                                               throw error;
                                                                           })
                                                                           .finally(()=>{
                                                                               resultFetch.finished=true;
                                                                               if (parameters.spinner_id && common.COMMON_DOCUMENT?.querySelector('#' + parameters.spinner_id))
                                                                                   common.COMMON_DOCUMENT.querySelector('#' + parameters.spinner_id).classList.remove('css_spinner');
                                                                           })
                                       ]);
                                   }
                                   ${props.encrypt_transport==1?
                                       `
                                       const x =   {
                                                   FFB:    FFB,
                                                   apps:   [{
                                                           app_id:  ${props.app_id},
                                                           uuid:    '${props.uuid}',
                                                           secret:  '${props.secret}'
                                                           }]
                                                   }`:
                                       'const x = {FFB:    FFB};'
                                   }
                                   await FFB({ app_id:             ${props.app_id},
                                               uuid:               '${props.uuid}',
                                               secret:             '${props.secret}',
                                               response_type:      'SSE',
                                               app_admin_app_id:   ${props.app_admin_app_id},
                                               rest_api_version:   '${props.app_rest_api_version}',
                                               rest_bff_path   :   '${props.rest_resource_bff}',
                                               data:{  
                                                       idToken:            '${props.idToken}',
                                                       authorization_type: 'APP_ID', 
                                                       path:               '/server-bff/' + '${props.uuid}', 
                                                       method:             'POST',
                                                       body:               null}});
                               </script>
                               <link id="app_link_app_css"         rel='stylesheet'  type='text/css'     href=''/>
                               <link id="app_link_app_report_css"  rel='stylesheet'  type='text/css'     href=''/>
                               <link id="app_link_favicon_32x32"   rel='icon'        type='image/png'    href='' sizes='32x32'/>
                               <link id="app_link_favicon_192x192" rel='icon'        type='image/png'    href='' sizes='192x192'/>
                               <div id='app_root'>
                                   <div id='app'></div>
                                   <div id='common_app'></div>
                               </div>
                           </body>
                           </html> `;
/**
* @name component
* @description Component
* @function
* @param {{data:       {   
*                      app_id:number,
*                      app_admin_app_id:number,
*                      rest_resource_bff:string,
*                      app_rest_api_version: string,
*                      app_request_timeout_seconds: number,
*                      app_requesttimeout_admin_minutes: number,
*                      idToken:string, 
*                      uuid:string, 
*                      secret:string
*                      encrypt_transport:number
*                      },
*        methods:      {
*                      securityTransportEncrypt:securityTransportEncrypt,
*                      commonConvertBinary:commonConvertBinary
*                      }
*      }} props 
* @returns {Promise.<string>}
*/
const component = async props =>{
   const fs = await import('node:fs');
   const common = await import ('../common.js');
   const {serverProcess} = await import('../../../../server/server.js');
   //declare css outside to keep HTML clean
   const css = Buffer.from(`body{
                               background-color: rgb(81, 171, 255);
                           }
                           .start {    
                               display:flex;
                               justify-content:center;
                               align-items:center;
                               min-height:100vh;
                               margin:0;
                           }
                           @keyframes start_spin{
                               from {transform:rotate(0deg);}
                               to {transform:rotate(360deg);}
                           }
                           .start::before{
                               content:'' !important;
                               width:25px;
                               height:25px;
                               position:absolute;
                               border:4px solid #404040;
                               border-top-color: rgb(81, 171, 255);
                               border-radius:50%;
                               animation:start_spin 1s linear infinite;
                           }
                           /*Fontawesome icons*/
                           @font-face {
                               font-family: "Font Awesome 6 Free";
                               font-style: normal;
                               font-weight: 400;
                               font-display: block;
                               src: url(${(await props.methods.commonConvertBinary(
                                                   'font/woff2',
                                                   '/apps/common/public/modules/fontawesome/webfonts/fa-regular-400.woff2'))
                                               .result.resource}) format("woff2")
                           }
                           @font-face {
                               font-family: "Font Awesome 6 Free";
                               font-style: normal;
                               font-weight: 900;
                               font-display: block;
                               src: url(${(await props.methods.commonConvertBinary(
                                                   'font/woff2',
                                                   '/apps/common/public/modules/fontawesome/webfonts/fa-solid-900.woff2'))
                                               .result.resource}) format("woff2")
                           }
                           @font-face {
                               font-family: "Font Awesome 6 Brands";
                               font-style: normal;
                               font-weight: 900;
                               font-display: block;
                               src: url(${(await props.methods.commonConvertBinary(
                                                   'font/woff2',
                                                   '/apps/common/public/modules/fontawesome/webfonts/fa-brands-400.woff2'))
                                               .result.resource}) format("woff2")
                           }
                           `).toString('base64');

   return template({   app_id:                             props.data.app_id,
                       app_admin_app_id:                   props.data.app_admin_app_id,
                       rest_resource_bff:                  props.data.rest_resource_bff,
                       app_rest_api_version:               props.data.app_rest_api_version,
                       app_request_timeout_seconds:        props.data.app_request_timeout_seconds,
                       app_requesttimeout_admin_minutes:   props.data.app_requesttimeout_admin_minutes,
                       idToken:                            props.data.idToken, 
                       uuid:                               props.data.uuid,
                       secret:                             props.data.secret,
                       encrypt_transport:                  props.data.encrypt_transport,
                       securityTransportEncrypt:           props.methods.securityTransportEncrypt,
                       cssStart:                           css,
                       cssCommon:                          Buffer.from((await fs.promises.readFile(serverProcess.cwd() + '/apps/common/public/css/common.css')).toString()).toString('base64'),
                       jsCommon:                           Buffer.from((await fs.promises.readFile(serverProcess.cwd() + '/apps/common/public/js/common.js')).toString()).toString('base64'),
                       cssFonts:                           Buffer.from(common.commonCssFonts.css
                                                                       .split('url(')
                                                                       .map(row=>{
                                                                           if (row.startsWith('/bff/x/'))
                                                                               //add app start uuid after font uuid separated with '~'
                                                                               return row.replace( row.substring(0,'/bff/x/'.length+36),
                                                                                                   row.substring(0,'/bff/x/'.length+36) + '~' + 
                                                                                                   props.data.uuid);
                                                                           else
                                                                               return row;
                                                                       }).join('url('))
                                                           .toString('base64')
                   });
};
export default component;