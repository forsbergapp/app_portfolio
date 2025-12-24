/**
 * Setings tab 3
 * @module apps/app4/component/settings_tab3
 */
/**
 * @import {common}  from '../../../common_types.js'
 * @import {appSettingThemeThumbnailsUpdate}  from '../js/app.js'
 * @import {APP_GLOBAL, APP_user_setting_record}  from '../js/types.js'
 */

/**
 * @name template
 * @description Template
 * @param {{theme_id_day:string,
 *          theme_id_month:string,
 *          theme_id_year:string}} props
 * @returns {string}
 */
const template = props =>`  <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_design_icon_theme_day' class='common_icon'></div>
                                    <div id='setting_design_theme_day' class='setting_design_thumbnail' data-theme_id='${props.theme_id_day}'></div>
                                    <div id='setting_design_prev_day' class='common_app_dialogues_button setting_design_prev common_icon common_icon_button'></div>
                                    <div id='setting_design_next_day' class='common_app_dialogues_button setting_design_next common_icon common_icon_button'></div>
                                    <div id='setting_design_theme_day_id'>${props.theme_id_day}</div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_design_icon_theme_month' class='common_icon'></div>
                                    <div id='setting_design_theme_month' class='setting_design_thumbnail' data-theme_id='${props.theme_id_month}'></div>
                                    <div id='setting_design_prev_month' class='common_app_dialogues_button setting_design_prev common_icon common_icon_button'></div>
                                    <div id='setting_design_next_month' class='common_app_dialogues_button setting_design_next common_icon common_icon_button'></div>
                                    <div id='setting_design_theme_month_id'>${props.theme_id_month}</div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_design_icon_theme_year' class='common_icon'></div>
                                    <div id='setting_design_theme_year' class='setting_design_thumbnail' data-theme_id='${props.theme_id_year}'></div>
                                    <div id='setting_design_prev_year' class='common_app_dialogues_button setting_design_prev common_icon common_icon_button'></div>
                                    <div id='setting_design_next_year' class='common_app_dialogues_button setting_design_next common_icon common_icon_button'></div>
                                    <div id='setting_design_theme_year_id'>${props.theme_id_year}</div>
                                </div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_papersize' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_report_papersize' ></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_highlight_row' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_report_highlight_row' ></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_show_weekday' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_checkbox_report_show_weekday' class='common_switch'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_show_calendartype' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_checkbox_report_show_calendartype' class='common_switch'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_show_notes' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_checkbox_report_show_notes' class='common_switch'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_show_gps' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_checkbox_report_show_gps' class='common_switch'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_show_timezone' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_checkbox_report_show_timezone' class='common_switch'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      common_app_id:number,
 *                      app_id:number,
 *                      user_settings:APP_user_setting_record,
 *                      themes:APP_GLOBAL['themes']
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon'],
 *                      appSettingThemeThumbnailsUpdate:appSettingThemeThumbnailsUpdate}}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    //fetch PAPER_SIZE for common app id
    /**@type{common['server']['ORM']['Object']['AppData'][]} */
    const settings_common = await props.methods.COMMON.commonFFB({path:'/server-db/appdata/',
                                                    query:`IAM_data_app_id=${props.data.common_app_id}&name=PAPER_SIZE`,
                                                    method:'GET', 
                                                    authorization_type:'APP_ID'}).then((/**@type{string}*/result)=>
                                                        JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data)));
    //fetch HIGHLIGHT_ROW and REPORT_THEME for current app id
    /**@type{common['server']['ORM']['Object']['AppData'][]} */
    const settings_app = await props.methods.COMMON.commonFFB({ path:'/server-db/appdata/',
                                                            query:`IAM_data_app_id=${props.data.app_id}`,
                                                            method:'GET', 
                                                            authorization_type:'APP_ID'}).then((/**@type{string}*/result)=>
                                                                JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data)));
    //update APP_GLOBAL with themes
    /**@type{import('../js/types.js').APP_GLOBAL['themes']} */
    props.data.themes.data = settings_app.filter(setting=>
            setting.AppId == props.data.app_id && 
            setting.Name.startsWith('REPORT_THEME'))
            .map(theme=>{
                return {type:theme.Name, value:theme.Value, text:theme.DisplayData};
            });

    const onMounted = async () =>{
        //paper size
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_papersize',
            data:       {
                        default_data_value:settings_common.filter(setting=>
                                                setting.Name.startsWith('PAPER_SIZE'))[0].Value,
                        default_value:settings_common.filter(setting=>
                                        setting.Name.startsWith('PAPER_SIZE'))[0].DisplayData,
                        options: settings_common.filter(setting=>
                                    setting.Name.startsWith('PAPER_SIZE')),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //highlight row
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_highlight_row',
            data:       {
                        default_data_value:settings_app.filter(setting=>
                                                setting.AppId == props.data.app_id && 
                                                setting.Name.startsWith('HIGHLIGHT_ROW'))[0].Value,
                        default_value:settings_app.filter(setting=>
                                        setting.AppId == props.data.app_id && 
                                        setting.Name.startsWith('HIGHLIGHT_ROW'))[0].DisplayData,
                        options: settings_app.filter(setting=>
                                    setting.AppId == props.data.app_id && 
                                    setting.Name.startsWith('HIGHLIGHT_ROW')),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:'/common/component/common_select.js'});

        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_report_papersize', props.data.user_settings.DesignPaperSize);
        
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#paper').className=props.data.user_settings.DesignPaperSize;

        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_report_highlight_row', props.data.user_settings.DesignRowHighlight);

        if (Number(props.data.user_settings.DesignColumnWeekdayChecked))
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_weekday').classList.add('checked');
        else
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_weekday').classList.remove('checked');
        if (Number(props.data.user_settings.DesignColumnCalendarTypeChecked))
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_calendartype').classList.add('checked');
        else
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_calendartype').classList.remove('checked');
        if (Number(props.data.user_settings.DesignColumnNotesChecked))
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_notes').classList.add('checked');
        else
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_notes').classList.remove('checked');
        if (Number(props.data.user_settings.DesignColumnGpsChecked))
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_gps').classList.add('checked');
        else
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_gps').classList.remove('checked');
        if (Number(props.data.user_settings.DesignColumnTimezoneChecked))
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_timezone').classList.add('checked');
        else
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_timezone').classList.remove('checked');

        props.methods.appSettingThemeThumbnailsUpdate();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({
                            theme_id_day:props.data.user_settings.DesignThemeDayId,
                            theme_id_month:props.data.user_settings.DesignThemeMonthId,
                            theme_id_year:props.data.user_settings.DesignThemeYearId})
    };
};
export default component;