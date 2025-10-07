/**
 * Displays user menu iam user app content
 * @module apps/common/component/common_app_dialogues_user_menu_iam_user_app
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
*/
const template = () =>` 
                        <div id='common_app_dialogues_user_menu_iam_user_app'>
                            <div id='common_app_dialogues_user_menu_iam_user_app_theme' class='common_app_dialogues_user_menu_iam_user_app_col1 common_icon'></div>
                            <div class='common_app_dialogues_user_menu_iam_user_app_col2'>
                                <div id='common_app_dialogues_user_menu_iam_user_app_theme_select'></div>
                            </div>
                            <div id='common_app_dialogues_user_menu_iam_user_app_locale' class='common_app_dialogues_user_menu_iam_user_app_col1 common_icon'></div>
                            <div class='common_app_dialogues_user_menu_iam_user_app_col2'>
                                <div id='common_app_dialogues_user_menu_iam_user_app_locale_select'></div>
                            </div>
                            <div id='common_app_dialogues_user_menu_iam_user_app_timezone' class='common_app_dialogues_user_menu_iam_user_app_col1 common_icon'></div>
                            <div class='common_app_dialogues_user_menu_iam_user_app_col2'>
                                <div id='common_app_dialogues_user_menu_iam_user_app_timezone_select'></div>
                            </div>
                            <div id='common_app_dialogues_user_menu_iam_user_app_direction' class='common_app_dialogues_user_menu_iam_user_app_col1 common_icon'></div>
                            <div class='common_app_dialogues_user_menu_iam_user_app_col2'>
                                <div id='common_app_dialogues_user_menu_iam_user_app_direction_select'></div>
                            </div>
                            <div id='common_app_dialogues_user_menu_iam_user_app_arabic_script' class='common_app_dialogues_user_menu_iam_user_app_col1 common_icon'></div>
                            <div class='common_app_dialogues_user_menu_iam_user_app_col2'>
                                <div id='common_app_dialogues_user_menu_iam_user_app_arabic_script_select'></div>
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
*                      COMMON:common['CommonModuleCommon']
*                      }}} props
* @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
*                      data:   null,
*                      methods:null,
*                      events: common['commonComponentEvents'],
*                      template:string}>}
*/
const component = async props => {

    //fetch all settings for common app id
    /**@type{common['server']['ORM']['Object']['AppData'][]} */
    const settings = props.data.admin_only == 1?[]:await props.methods.COMMON.commonFFB({  path:'/server-db/appdata/', 
                                                                                   query:`IAM_data_app_id=${props.data.common_app_id}`, 
                                                                                   method:'GET', 
                                                                                   authorization_type:'APP_ID'})
                                                               .then((/**@type{string}*/result)=>JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data)));

    /**@type{{locale:string, text:string}[]} */
    const locales = await props.methods.COMMON.commonFFB({
                                                   path:'/app-common-module/COMMON_LOCALE', 
                                                   query:`locale=${props.data.user_locale}`, 
                                                   method:'POST', authorization_type:'APP_ID',
                                                   body:{type:'FUNCTION',IAM_data_app_id : props.data.common_app_id}
                                               })
                                               .then((/**@type{string}*/result)=>JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data)));

    /**
     * @name appThemeUpdate
     * @description App theme update
     * @function
     * @returns {void}
     */
    const appThemeUpdate = () => {
        props.methods.COMMON.COMMON_DOCUMENT.body.className =   props.methods.COMMON.COMMON_DOCUMENT
                                                                    .querySelector('#common_app_dialogues_user_menu_iam_user_app_theme_select .common_select_dropdown_value')
                                                                    .getAttribute('data-value');
        props.methods.COMMON.commonMiscPreferencesUpdateBodyClassFromPreferences();
    };
    /**
     * @name MiscThemeDefaultList
     * @description Default app themes 
     * @function
     * @returns {{VALUE:*, TEXT:string}[]}
     */
    const MiscThemeDefaultList = () =>[ {VALUE:'app_theme1', TEXT:'Light'}, 
                                        {VALUE:'app_theme2', TEXT:'Dark'}, 
                                        {VALUE:'app_theme3', TEXT:'Caffè Latte'},
                                        {VALUE:'app_theme_sun', TEXT:'Sun'},
                                        {VALUE:'app_theme_moon', TEXT:'Moon'}];
    /**
     * @name MiscThemeUpdateFromBody
     * @description Common theme get
     * @function
     * @returns {void}
     */
    const MiscThemeUpdateFromBody = () => {    
        /**@type{DOMTokenList} */
        props.methods.COMMON.COMMON_DOCUMENT
            .querySelector('#common_app_dialogues_user_menu_iam_user_app_theme_select .common_select_dropdown_value').textContent = 
                MiscThemeDefaultList().filter(theme=>theme.VALUE.toString()==props.methods.COMMON.COMMON_DOCUMENT.body.classList[0])[0].TEXT;
        props.methods.COMMON.COMMON_DOCUMENT
            .querySelector('#common_app_dialogues_user_menu_iam_user_app_theme_select .common_select_dropdown_value')
            .setAttribute('data-value', props.methods.COMMON.COMMON_DOCUMENT.body.classList[0]);
    };
    /**
     * @name UserPreferenceSave
     * @description User preference save
     * @function
     * @returns {Promise.<void>}
     */
    const UserPreferenceSave = async () => {
        if (props.methods.COMMON.commonGlobalGet('iam_user_app_id') != null){
            const body = {
                            IAM_data_app_id: props.methods.COMMON.commonGlobalGet('app_id'),
                            IAM_iam_user_id: props.methods.COMMON.commonGlobalGet('iam_user_id'),
                            Document: 
                            {  
                                preference_locale:       props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_app_locale_select .common_select_dropdown_value')
                                                                            .getAttribute('data-value'),
                                preference_timezone:     props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_app_timezone_select .common_select_dropdown_value')
                                                                            .getAttribute('data-value'),
                                preference_direction:    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_app_direction_select .common_select_dropdown_value')
                                                                            .getAttribute('data-value'),
                                preference_arabic_script:props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_app_arabic_script_select .common_select_dropdown_value')
                                                                            .getAttribute('data-value'),
                            }
                        };
            await props.methods.COMMON.commonFFB({path:`/server-db/iamuserapp/${props.methods.COMMON.commonGlobalGet('iam_user_app_id')}`, method:'PATCH', authorization_type:'APP_ACCESS', body:body});
        }
    };


    /**
     * @name events
     * @descption Events
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event_target_id == 'common_app_dialogues_user_menu_iam_user_app_theme_select' &&
                        event.target.classList.contains('common_select_option'):{
                        appThemeUpdate();
                        break;
                    }
                    case event_target_id == 'common_app_dialogues_user_menu_iam_user_app_locale_select' &&
                         event.target.classList.contains('common_select_option'):{
                        props.methods.COMMON.commonGlobalSet('user_locale', event.target?.getAttribute('data-value') ?? '');
                        /**
                         * @todo change COMMON_WINDOW.navigator.language using Object.defineProperties(COMMON_WINDOW.navigator, {'language': {'value':COMMON_GLOBAL.user_locale, writable: true}});
                         */
                        await UserPreferenceSave();
                        await props.methods.COMMON.commonComponentRender({
                         mountDiv:   'common_app_dialogues_user_menu_iam_user_app_locale_select', 
                         data:       {
                                     default_data_value:props.methods.COMMON.commonGlobalGet('user_locale'),
                                     default_value:'',
                                     options: await props.methods.COMMON.commonFFB({
                                                                 path:'/app-common-module/COMMON_LOCALE', 
                                                                 method:'POST', authorization_type:'APP_ID',
                                                                 body:{type:'FUNCTION',IAM_data_app_id : props.methods.COMMON.commonGlobalGet('app_common_app_id')}
                                                             })
                                                             .then((/**@type{string}*/result)=>JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data))),
                                     path:null,
                                     query:null,
                                     method:null,
                                     authorization_type:null,
                                     column_value:'locale',
                                     column_text:'text'
                                     },
                         methods:    null,
                         path:       '/common/component/common_select.js'});
                         props.methods.COMMON.commonMiscSelectCurrentValueSet(  'common_app_dialogues_user_menu_iam_user_app_locale_select', 
                                                                                props.methods.COMMON.commonGlobalGet('user_locale'));
                         break;
                    }
                    case event_target_id == 'common_app_dialogues_user_menu_iam_user_app_timezone_select' &&
                         event.target.classList.contains('common_select_option'):{
                        props.methods.COMMON.commonGlobalSet('user_timezone', event.target?.getAttribute('data-value') ?? '');
                        await UserPreferenceSave();
                        break;
                    }
                    case event_target_id =='common_app_dialogues_user_menu_iam_user_app_direction_select' &&
                         event.target.classList.contains('common_select_option'):{
                        if(event.target?.getAttribute('data-value')=='rtl')
                            props.methods.COMMON.COMMON_DOCUMENT.body.classList.add('rtl');
                        else
                            props.methods.COMMON.COMMON_DOCUMENT.body.classList.remove('rtl');
                        props.methods.COMMON.commonGlobalSet('user_direction', event.target?.getAttribute('data-value') ?? '');
                        await UserPreferenceSave();
                        appThemeUpdate();
                        break;
                    }
                    case event_target_id == 'common_app_dialogues_user_menu_iam_user_app_arabic_script_select' &&
                         event.target.classList.contains('common_select_option'):{
                        props.methods.COMMON.commonGlobalSet('user_arabic_script', event.target?.getAttribute('data-value') ?? '');
                        //check if app theme div is using default theme with common select div
                        if (props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_app_theme_select').className?
                            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_app_theme_select').className.toLowerCase().indexOf('common_select')>-1:false){
                            appThemeUpdate();
                        }
                        await UserPreferenceSave();
                        break;
                    }           
                }
            }
        }
        
    };
    const onMounted = async () =>{                                                               
        //Theme
        const themes = MiscThemeDefaultList();
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'common_app_dialogues_user_menu_iam_user_app_theme_select', 
            data:       {
                        default_data_value:themes[0].VALUE,
                        default_value:themes[0].TEXT,
                        options:themes,
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'VALUE',
                        column_text:'TEXT'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //set app theme
        MiscThemeUpdateFromBody();

       //Locale
       await props.methods.COMMON.commonComponentRender({
           mountDiv:   'common_app_dialogues_user_menu_iam_user_app_locale_select', 
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
           methods:    null,
           path:       '/common/component/common_select.js'});
       if (props.data.admin_only!=1){
           //Timezone
           await props.methods.COMMON.commonComponentRender({
               mountDiv:  'common_app_dialogues_user_menu_iam_user_app_timezone_select', 
               data:       {
                           default_data_value:props.data.user_timezone,
                           default_value:'',
                           options: settings.filter(setting=>setting.Name=='TIMEZONE'),
                           path:null,
                           query:null,
                           method:null,
                           authorization_type:null,
                           column_value:'Value',
                           column_text:'DisplayData'
                           },
               methods:    null,
               path:'/common/component/common_select.js'});
           //Direction with default ' '
           await props.methods.COMMON.commonComponentRender({
               mountDiv:   'common_app_dialogues_user_menu_iam_user_app_direction_select', 
               data:       {
                           default_data_value:props.data.user_direction,
                           default_value:' ',
                           options: [{Value:'', DisplayData:' '}].concat(settings.filter(setting=>setting.Name=='DIRECTION')),
                           path:null,
                           query:null,
                           method:null,
                           authorization_type:null,
                           column_value:'Value',
                           column_text:'DisplayData'
                           },
               methods:    null,
               path:       '/common/component/common_select.js'});   
           //Arabic script with default ' '
           await props.methods.COMMON.commonComponentRender({
               mountDiv:   'common_app_dialogues_user_menu_iam_user_app_arabic_script_select', 
               data:       {
                           default_data_value:props.data.user_arabic_script,
                           default_value:' ',
                           options: [{Value:'', DisplayData:' '}].concat(settings.filter(setting=>setting.Name=='ARABIC_SCRIPT')),
                           path:null,
                           query:null,
                           method:null,
                           authorization_type:null,
                           column_value:'Value',
                           column_text:'DisplayData'
                           },
               methods:    null,
               path:       '/common/component/common_select.js'});
       }
       //set current value on all the selects
       props.methods.COMMON.commonMiscSelectCurrentValueSet('common_app_dialogues_user_menu_iam_user_app_locale_select', props.data.user_locale);
       if ((props.data.admin_only == 1)==false){
           props.methods.COMMON.commonMiscSelectCurrentValueSet('common_app_dialogues_user_menu_iam_user_app_timezone_select', props.data.user_timezone);
           props.methods.COMMON.commonMiscSelectCurrentValueSet('common_app_dialogues_user_menu_iam_user_app_direction_select', props.data.user_direction ?? '');
           props.methods.COMMON.commonMiscSelectCurrentValueSet('common_app_dialogues_user_menu_iam_user_app_arabic_script_select', props.data.user_arabic_script ?? '');
       }
       
   };
   return {
       lifecycle:  {onMounted:onMounted},
       data:       null,
       methods:    null,
       events:     events,
       template:   template()
   };
};
export default component;