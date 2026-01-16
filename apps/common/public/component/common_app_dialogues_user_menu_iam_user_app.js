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
 * @param {{icons:{region_locale:string,
 *                misc_design:string,
 *                regional_timezone:string,
 *                regional_direction:string,
 *                regional_script:string}}} props
 * @returns {string}
 */
const template = props =>` 
                        <div id='common_app_dialogues_user_menu_iam_user_app'>
                            <div id='common_app_dialogues_user_menu_iam_user_app_theme' class='common_app_dialogues_user_menu_iam_user_app_col1'>${props.icons.misc_design}</div>
                            <div class='common_app_dialogues_user_menu_iam_user_app_col2'>
                                <div id='common_app_dialogues_user_menu_iam_user_app_theme_select'></div>
                            </div>
                            <div id='common_app_dialogues_user_menu_iam_user_app_locale' class='common_app_dialogues_user_menu_iam_user_app_col1'>${props.icons.region_locale}</div>
                            <div class='common_app_dialogues_user_menu_iam_user_app_col2'>
                                <div id='common_app_dialogues_user_menu_iam_user_app_locale_select'></div>
                            </div>
                            <div id='common_app_dialogues_user_menu_iam_user_app_timezone' class='common_app_dialogues_user_menu_iam_user_app_col1'>${props.icons.regional_timezone}</div>
                            <div class='common_app_dialogues_user_menu_iam_user_app_col2'>
                                <div id='common_app_dialogues_user_menu_iam_user_app_timezone_select'></div>
                            </div>
                            <div id='common_app_dialogues_user_menu_iam_user_app_direction' class='common_app_dialogues_user_menu_iam_user_app_col1'>${props.icons.regional_direction}</div>
                            <div class='common_app_dialogues_user_menu_iam_user_app_col2'>
                                <div id='common_app_dialogues_user_menu_iam_user_app_direction_select'></div>
                            </div>
                            <div id='common_app_dialogues_user_menu_iam_user_app_arabic_script' class='common_app_dialogues_user_menu_iam_user_app_col1'>${props.icons.regional_script}</div>
                            <div class='common_app_dialogues_user_menu_iam_user_app_col2'>
                                <div id='common_app_dialogues_user_menu_iam_user_app_arabic_script_select'></div>
                            </div>
                        </div>`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string},
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

    const getLocales = async ()=>
        props.methods.COMMON.commonFFB({
            path:'/app-common-module/COMMON_LOCALE', 
            method:'POST', authorization_type:'APP_ID',
            body:{  type:'FUNCTION',
                    IAM_data_app_id : props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id,
                    locale: props.methods.COMMON.commonGlobalGet('UserApp').user_locale}
        })
        .then((/**@type{string}*/result)=>JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data)))

    /**@type{{locale:string, text:string}[]} */
    const locales = await getLocales();

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
        if (props.methods.COMMON.commonGlobalGet('UserApp').iam_user_app_id != null){
            const body = {
                            IAM_data_app_id: props.methods.COMMON.commonGlobalGet('UserApp').app_id,
                            IAM_iam_user_id: props.methods.COMMON.commonGlobalGet('User').iam_user_id,
                            document: 
                            {  
                                preference_locale:       props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_app_locale_select .common_select_dropdown_value')
                                                                            .getAttribute('data-value'),
                                preference_timezone:     props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_app_timezone_select .common_select_dropdown_value')
                                                                            .getAttribute('data-value'),
                                preference_direction:    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_app_direction_select .common_select_dropdown_value')
                                                                            .getAttribute('data-value'),
                                preference_arabic_script:props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_iam_user_app_arabic_script_select .common_select_dropdown_value')
                                                                            .getAttribute('data-value'),
                                custom:                  null,
                            }
                        };
            await props.methods.COMMON.commonFFB({path:`/server-db/iamuserapp/${props.methods.COMMON.commonGlobalGet('UserApp').iam_user_app_id}`, method:'PATCH', authorization_type:'APP_ACCESS', body:body});
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
                        props.methods.COMMON.commonGlobalSet('UserApp','user_locale', event.target?.getAttribute('data-value') ?? '');
                        /**
                         * @todo change COMMON_WINDOW.navigator.language using Object.defineProperties(COMMON_WINDOW.navigator, {'language': {'value':COMMON_GLOBAL.UserApp.user_locale, writable: true}});
                         */
                        await UserPreferenceSave();
                        await props.methods.COMMON.commonComponentRender({
                         mountDiv:   'common_app_dialogues_user_menu_iam_user_app_locale_select', 
                         data:       {
                                     default_data_value:props.methods.COMMON.commonGlobalGet('UserApp').user_locale,
                                     default_value:'',
                                     options: await getLocales(),
                                     column_value:'locale',
                                     column_text:'text'
                                     },
                         methods:    null,
                         path:       '/common/component/common_select.js'});
                         props.methods.COMMON.commonMiscSelectCurrentValueSet(  'common_app_dialogues_user_menu_iam_user_app_locale_select', 
                                                                                props.methods.COMMON.commonGlobalGet('UserApp').user_locale);
                         break;
                    }
                    case event_target_id == 'common_app_dialogues_user_menu_iam_user_app_timezone_select' &&
                         event.target.classList.contains('common_select_option'):{
                        props.methods.COMMON.commonGlobalSet('UserApp','user_timezone', event.target?.getAttribute('data-value') ?? '');
                        await UserPreferenceSave();
                        break;
                    }
                    case event_target_id =='common_app_dialogues_user_menu_iam_user_app_direction_select' &&
                         event.target.classList.contains('common_select_option'):{
                        if(event.target?.getAttribute('data-value')=='rtl')
                            props.methods.COMMON.COMMON_DOCUMENT.body.classList.add('rtl');
                        else
                            props.methods.COMMON.COMMON_DOCUMENT.body.classList.remove('rtl');
                        props.methods.COMMON.commonGlobalSet('UserApp','user_direction', event.target?.getAttribute('data-value') ?? '');
                        await UserPreferenceSave();
                        appThemeUpdate();
                        break;
                    }
                    case event_target_id == 'common_app_dialogues_user_menu_iam_user_app_arabic_script_select' &&
                         event.target.classList.contains('common_select_option'):{
                        props.methods.COMMON.commonGlobalSet('UserApp','user_arabic_script', event.target?.getAttribute('data-value') ?? '');
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
                       default_data_value:props.methods.COMMON.commonGlobalGet('UserApp').user_locale,
                       default_value:'',
                       options: locales,
                       column_value:'locale',
                       column_text:'text'
                       },
           methods:    null,
           path:       '/common/component/common_select.js'});
       if (props.methods.COMMON.commonGlobalGet('Parameters').admin_only!=1){
           //Timezone
           await props.methods.COMMON.commonComponentRender({
               mountDiv:  'common_app_dialogues_user_menu_iam_user_app_timezone_select', 
               data:       {
                           default_data_value:props.methods.COMMON.commonGlobalGet('UserApp').user_timezone,
                           default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'TIMEZONE', props.methods.COMMON.commonGlobalGet('UserApp').user_timezone))[0].DisplayData,
                           options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'TIMEZONE'),
                           column_value:'Value',
                           column_text:'DisplayData'
                           },
               methods:    null,
               path:'/common/component/common_select.js'});
           //Direction with default ' '
           await props.methods.COMMON.commonComponentRender({
               mountDiv:   'common_app_dialogues_user_menu_iam_user_app_direction_select', 
               data:       {
                           default_data_value:props.methods.COMMON.commonGlobalGet('UserApp').user_direction,
                           default_value:['',null].includes(props.methods.COMMON.commonGlobalGet('UserApp').user_direction)?
                                            ' ':
                                                (await props.methods.COMMON.commonGetAppData(  props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,
                                                        'DIRECTION', 
                                                        props.methods.COMMON.commonGlobalGet('UserApp').user_direction))[0].DisplayData??'',
                           options: [{Value:'', DisplayData:' '}].concat(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'DIRECTION')),
                           column_value:'Value',
                           column_text:'DisplayData'
                           },
               methods:    null,
               path:       '/common/component/common_select.js'});   
           //Arabic script with default ' '
           await props.methods.COMMON.commonComponentRender({
               mountDiv:   'common_app_dialogues_user_menu_iam_user_app_arabic_script_select', 
               data:       {
                           default_data_value:props.methods.COMMON.commonGlobalGet('UserApp').user_arabic_script,
                           default_value:['',null].includes(props.methods.COMMON.commonGlobalGet('UserApp').user_arabic_script)?
                                            ' ':
                                                (await props.methods.COMMON.commonGetAppData(  props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,
                                                        'ARABIC_SCRIPT', 
                                                        props.methods.COMMON.commonGlobalGet('UserApp').user_arabic_script))[0].DisplayData??'',
                           options: [{Value:'', DisplayData:' '}].concat(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'ARABIC_SCRIPT')),
                           column_value:'Value',
                           column_text:'DisplayData'
                           },
               methods:    null,
               path:       '/common/component/common_select.js'});
       }
       //set current value on all the selects
       props.methods.COMMON.commonMiscSelectCurrentValueSet('common_app_dialogues_user_menu_iam_user_app_locale_select', props.methods.COMMON.commonGlobalGet('UserApp').user_locale);
       
   };
   return {
       lifecycle:  {onMounted:onMounted},
       data:       null,
       methods:    null,
       events:     events,
       template:   template({icons:{region_locale:props.methods.COMMON.commonGlobalGet('ICONS')['regional_locale'],
                                    misc_design:props.methods.COMMON.commonGlobalGet('ICONS')['misc_design'],
                                    regional_timezone:props.methods.COMMON.commonGlobalGet('ICONS')['regional_timezone'],
                                    regional_direction:props.methods.COMMON.commonGlobalGet('ICONS')['regional_direction'],
                                    regional_script:props.methods.COMMON.commonGlobalGet('ICONS')['regional_script']}})

   };
};
export default component;