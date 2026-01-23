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
 * @param {{user_settings:APP_user_setting_record,
 *          icons:{ theme_day:string,
 *                  theme_month:string,
 *                  theme_year:string,
 *                  papersize:string,
 *                  highlight:string,
 *                  show_weekday:string,
 *                  show_calendartype:string,
 *                  show_notes:string,
 *                  show_gps:string,
 *                  show_timezone:string,
 *                  slider_left:string,
 *                  slider_right:string}}} props
 * @returns {string}
 */
const template = props =>`  <div class='settings_row3'>
                                <div >
                                    <div id='setting_design_icon_theme_day'>${props.icons.theme_day}</div>
                                    <div id='setting_design_theme_day' class='setting_design_thumbnail' data-theme_id='${props.user_settings.DesignThemeDayId}'></div>
                                    <div id='setting_design_prev_day' class='common_app_dialogues_button setting_design_prev common_link common_icon_title'>${props.icons.slider_left}</div>
                                    <div id='setting_design_next_day' class='common_app_dialogues_button setting_design_next common_link common_icon_title'>${props.icons.slider_right}</div>
                                    <div id='setting_design_theme_day_id'>${props.user_settings.DesignThemeDayId}</div>
                                </div>
                                <div >
                                    <div id='setting_design_icon_theme_month'>${props.icons.theme_month}</div>
                                    <div id='setting_design_theme_month' class='setting_design_thumbnail' data-theme_id='${props.user_settings.DesignThemeMonthId}'></div>
                                    <div id='setting_design_prev_month' class='common_app_dialogues_button setting_design_prev common_link common_icon_title'>${props.icons.slider_left}</div>
                                    <div id='setting_design_next_month' class='common_app_dialogues_button setting_design_next common_link common_icon_title'>${props.icons.slider_right}</div>
                                    <div id='setting_design_theme_month_id'>${props.user_settings.DesignThemeMonthId}</div>
                                </div>
                                <div >
                                    <div id='setting_design_icon_theme_year'>${props.icons.theme_year}</div>
                                    <div id='setting_design_theme_year' class='setting_design_thumbnail' data-theme_id='${props.user_settings.DesignThemeYearId}'></div>
                                    <div id='setting_design_prev_year' class='common_app_dialogues_button setting_design_prev common_link common_icon_title'>${props.icons.slider_left}</div>
                                    <div id='setting_design_next_year' class='common_app_dialogues_button setting_design_next common_link common_icon_title'>${props.icons.slider_right}</div>
                                    <div id='setting_design_theme_year_id'>${props.user_settings.DesignThemeYearId}</div>
                                </div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.papersize}</div>
                                <div id='setting_select_report_papersize' ></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.highlight}</div>
                                <div id='setting_select_report_highlight_row' ></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.show_weekday}</div>
                                <div id='setting_checkbox_report_show_weekday' class='common_switch ${Number(props.user_settings.DesignColumnWeekdayChecked)?'checked':''}'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.show_calendartype}</div>
                                <div id='setting_checkbox_report_show_calendartype' class='common_switch ${Number(props.user_settings.DesignColumnCalendarTypeChecked)?'checked':''}'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.show_notes}</div>
                                <div id='setting_checkbox_report_show_notes' class='common_switch ${Number(props.user_settings.DesignColumnNotesChecked)?'checked':''}'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.show_gps}</div>
                                <div id='setting_checkbox_report_show_gps' class='common_switch ${Number(props.user_settings.DesignColumnGpsChecked)?'checked':''}'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.show_timezone}</div>
                                <div id='setting_checkbox_report_show_timezone' class='common_switch ${Number(props.user_settings.DesignColumnTimezoneChecked)?'checked':''}'></div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @param {{data:       {
 *                      commonMountdiv:string,
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
    
    //update APP_GLOBAL with themes
    /**@type{import('../js/types.js').APP_GLOBAL['themes']} */
    props.data.themes.data = (await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id))
                            .filter(setting=>
                                    setting.Name.startsWith('REPORT_THEME')
                            )
                            .map(theme=>{
                                return {type:theme.Name, value:theme.Value, text:theme.DisplayData};
                            });

    const onMounted = async () =>{
        //paper size
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_papersize',
            data:       {
                        default_data_value:props.data.user_settings.DesignPaperSize,
                        default_value:(await props.methods.COMMON.commonGetAppData( props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,
                                                                                    'PAPER_SIZE',
                                                                                    props.data.user_settings.DesignPaperSize))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'PAPER_SIZE'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //highlight row
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_highlight_row',
            data:       {
                        default_data_value:props.data.user_settings.DesignRowHighlight,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'HIGHLIGHT_ROW',
                                                                                    props.data.user_settings.DesignRowHighlight))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'HIGHLIGHT_ROW'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:'/common/component/common_select.js'});


        props.methods.appSettingThemeThumbnailsUpdate();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({
                            user_settings: props.data.user_settings,
                            icons:{ theme_day:props.methods.COMMON.commonGlobalGet('ICONS').regional_day,
                                    theme_month:props.methods.COMMON.commonGlobalGet('ICONS').regional_month,
                                    theme_year:props.methods.COMMON.commonGlobalGet('ICONS').regional_year,
                                    papersize:props.methods.COMMON.commonGlobalGet('ICONS').papersize,
                                    highlight:props.methods.COMMON.commonGlobalGet('ICONS').highlight,
                                    show_weekday:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').regional_weekday,
                                    show_calendartype:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').regional_calendartype,
                                    show_notes:props.methods.COMMON.commonGlobalGet('ICONS').show +  props.methods.COMMON.commonGlobalGet('ICONS').notes,
                                    show_gps:props.methods.COMMON.commonGlobalGet('ICONS').show +  props.methods.COMMON.commonGlobalGet('ICONS').gps_position,
                                    show_timezone:props.methods.COMMON.commonGlobalGet('ICONS').show +  props.methods.COMMON.commonGlobalGet('ICONS').regional_timezone,
                                    slider_left:props.methods.COMMON.commonGlobalGet('ICONS').slider_left,
                                    slider_right:props.methods.COMMON.commonGlobalGet('ICONS').slider_right
                            }
                        })
    };
};
export default component;