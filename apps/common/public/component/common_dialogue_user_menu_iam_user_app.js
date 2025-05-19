/**
 * Displays user menu iam user app content
 * @module apps/common/component/common_dialogue_user_menu_iam_user_app
 */

/**
 * @import {CommonAppDataRecord, CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
*/
const template = () =>` <div id='common_dialogue_user_menu_app_theme'></div>
                        <div id='common_dialogue_user_menu_iam_user_app'>
                            <div id='common_dialogue_user_menu_iam_user_app_locale' class='common_dialogue_user_menu_iam_user_app_col1 common_icon'></div>
                            <div class='common_dialogue_user_menu_iam_user_app_col2'>
                                <div id='common_dialogue_user_menu_iam_user_app_locale_select'></div>
                            </div>
                            <div id='common_dialogue_user_menu_iam_user_app_timezone' class='common_dialogue_user_menu_iam_user_app_col1 common_icon'></div>
                            <div class='common_dialogue_user_menu_iam_user_app_col2'>
                                <div id='common_dialogue_user_menu_iam_user_app_timezone_select'></div>
                            </div>
                            <div id='common_dialogue_user_menu_iam_user_app_direction' class='common_dialogue_user_menu_iam_user_app_col1 common_icon'></div>
                            <div class='common_dialogue_user_menu_iam_user_app_col2'>
                                <div id='common_dialogue_user_menu_iam_user_app_direction_select'></div>
                            </div>
                            <div id='common_dialogue_user_menu_iam_user_app_arabic_script' class='common_dialogue_user_menu_iam_user_app_col1 common_icon'></div>
                            <div class='common_dialogue_user_menu_iam_user_app_col2'>
                                <div id='common_dialogue_user_menu_iam_user_app_arabic_script_select'></div>
                            </div>
                        </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      app_id:number,
*                      common_app_id:number,
*                      admin_app_id:number,
*                      admin_only:number,
*                      user_locale:string,
*                      user_timezone:string,
*                      user_direction:string,
*                      user_arabic_script:string},
*          methods:    {
*                      COMMON_DOCUMENT:COMMON_DOCUMENT,
*                      commonMiscSelectCurrentValueSet:CommonModuleCommon['commonMiscSelectCurrentValueSet'],
*                      commonWindowFromBase64:CommonModuleCommon['commonWindowFromBase64'],
*                      commonFFB:CommonModuleCommon['commonFFB'],
*                      commonComponentRender:CommonModuleCommon['commonComponentRender']
*                      }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:   null,
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {

    //fetch all settings for common app id
   /**@type{CommonAppDataRecord[]} */
   const settings = props.data.admin_only == 1?[]:await props.methods.commonFFB({  path:'/server-db/appdata/', 
                                                                                   query:`IAM_data_app_id=${props.data.common_app_id}`, 
                                                                                   method:'GET', 
                                                                                   authorization_type:'APP_ID'})
                                                               .then((/**@type{string}*/result)=>JSON.parse(props.methods.commonWindowFromBase64(JSON.parse(result).rows[0].data)));

   /**@type{{locale:string, text:string}[]} */
   const locales = await props.methods.commonFFB({
                                                   path:'/app-common-module/COMMON_LOCALE', 
                                                   query:`locale=${props.data.user_locale}`, 
                                                   method:'POST', authorization_type:'APP_ID',
                                                   body:{type:'FUNCTION',IAM_data_app_id : props.data.common_app_id}
                                               })
                                               .then((/**@type{string}*/result)=>JSON.parse(props.methods.commonWindowFromBase64(JSON.parse(result).rows[0].data)));
   const onMounted = async () =>{                                                               
       
       //mount select
       //Locale
       await props.methods.commonComponentRender({
           mountDiv:   'common_dialogue_user_menu_iam_user_app_locale_select', 
           data:       {
                       default_data_value:props.data.user_locale,
                       default_value:'',
                       options: locales,
                       path:null,
                       query:null,
                       method:null,
                       authorization_type:null,
                       column_value:'locale',
                       column_text:'text'
                       },
           methods:    {commonFFB:props.methods.commonFFB},
           path:       '/common/component/common_select.js'});
       if (props.data.admin_only!=1){
           //Timezone
           await props.methods.commonComponentRender({
               mountDiv:  'common_dialogue_user_menu_iam_user_app_timezone_select', 
               data:       {
                           default_data_value:props.data.user_timezone,
                           default_value:'',
                           options: settings.filter(setting=>setting.name=='TIMEZONE'),
                           path:null,
                           query:null,
                           method:null,
                           authorization_type:null,
                           column_value:'value',
                           column_text:'display_data'
                           },
               methods:    {commonFFB:props.methods.commonFFB},
               path:'/common/component/common_select.js'});
           //Direction with default ' '
           await props.methods.commonComponentRender({
               mountDiv:   'common_dialogue_user_menu_iam_user_app_direction_select', 
               data:       {
                           default_data_value:props.data.user_direction,
                           default_value:' ',
                           options: [{value:'', display_data:' '}].concat(settings.filter(setting=>setting.name=='DIRECTION')),
                           path:null,
                           query:null,
                           method:null,
                           authorization_type:null,
                           column_value:'value',
                           column_text:'display_data'
                           },
               methods:    {commonFFB:props.methods.commonFFB},
               path:       '/common/component/common_select.js'});   
           //Arabic script with default ' '
           await props.methods.commonComponentRender({
               mountDiv:   'common_dialogue_user_menu_iam_user_app_arabic_script_select', 
               data:       {
                           default_data_value:props.data.user_arabic_script,
                           default_value:' ',
                           options: [{value:'', display_data:' '}].concat(settings.filter(setting=>setting.name=='ARABIC_SCRIPT')),
                           path:null,
                           query:null,
                           method:null,
                           authorization_type:null,
                           column_value:'value',
                           column_text:'display_data'
                           },
               methods:    {commonFFB:props.methods.commonFFB},
               path:       '/common/component/common_select.js'});
       }
       //set current value on all the selects
       props.methods.commonMiscSelectCurrentValueSet('common_dialogue_user_menu_iam_user_app_locale_select', props.data.user_locale);
       if ((props.data.admin_only == 1)==false){
           props.methods.commonMiscSelectCurrentValueSet('common_dialogue_user_menu_iam_user_app_timezone_select', props.data.user_timezone);
           props.methods.commonMiscSelectCurrentValueSet('common_dialogue_user_menu_iam_user_app_direction_select', props.data.user_direction ?? '');
           props.methods.commonMiscSelectCurrentValueSet('common_dialogue_user_menu_iam_user_app_arabic_script_select', props.data.user_arabic_script ?? '');
       }
       
   };
   return {
       lifecycle:  {onMounted:onMounted},
       data:       null,
       methods:    null,
       template:   template()
   };
};
export default component;