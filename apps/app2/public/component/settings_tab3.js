/**
 * @module apps/app2/component/settings_tab3
 */
/**
 * @param {{spinner:string,
 *          theme_id_day:string,
 *          theme_id_month:string,
 *          theme_id_year:string}} props
 */
const template = props =>`  <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_design_icon_theme_day' class='common_icon ${props.spinner}'></div>
                                    <div id='setting_design_theme_day' class='setting_design_thumbnail' data-theme_id='${props.theme_id_day}'></div>
                                    <div id='setting_design_prev_day' class='common_dialogue_button setting_design_prev common_icon'></div>
                                    <div id='setting_design_next_day' class='common_dialogue_button setting_design_next common_icon'></div>
                                    <div id='setting_design_theme_day_id'>${props.theme_id_day}</div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_design_icon_theme_month' class='common_icon ${props.spinner}'></div>
                                    <div id='setting_design_theme_month' class='setting_design_thumbnail' data-theme_id='${props.theme_id_month}'></div>
                                    <div id='setting_design_prev_month' class='common_dialogue_button setting_design_prev common_icon'></div>
                                    <div id='setting_design_next_month' class='common_dialogue_button setting_design_next common_icon'></div>
                                    <div id='setting_design_theme_month_id'>${props.theme_id_month}</div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_design_icon_theme_year' class='common_icon ${props.spinner}'></div>
                                    <div id='setting_design_theme_year' class='setting_design_thumbnail' data-theme_id='${props.theme_id_year}'></div>
                                    <div id='setting_design_prev_year' class='common_dialogue_button setting_design_prev common_icon'></div>
                                    <div id='setting_design_next_year' class='common_dialogue_button setting_design_next common_icon'></div>
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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      app_id:number,
 *                      user_settings:import('../js//types.js').APP_user_setting_record,
 *                      themes:import('../js//types.js').APP_GLOBAL['themes']
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      set_current_value:import('../../../common_types.js').CommonModuleCommon['set_current_value'],
 *                      update_all_theme_thumbnails:function
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender'],
 *                      app_settings_get:import('../../../common_types.js').CommonModuleCommon['app_settings_get']},
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:{onMounted:function}, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    const onMounted = async () =>{
        const settings = await props.methods.app_settings_get();
        //update APP_GLOBAL with themes
        /**@type{import('../js//types.js').APP_GLOBAL['themes']} */
        props.data.themes.data = settings.filter(setting=>
                                setting.app_id == props.data.app_id && 
                                setting.app_setting_type_name.startsWith('REPORT_THEME'))
                                .map(theme=>{
                                    return {type:theme.app_setting_type_name, value:theme.value, text:theme.text};
                                });
        props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).innerHTML = template({ spinner:'', 
                                                                                                theme_id_day:props.data.user_settings.design_theme_day_id,
                                                                                                theme_id_month:props.data.user_settings.design_theme_month_id,
                                                                                                theme_id_year:props.data.user_settings.design_theme_year_id});
        //
        //paper size
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_report_papersize',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>
                                                setting.app_setting_type_name.startsWith('PAPER_SIZE'))[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>
                                        setting.app_setting_type_name.startsWith('PAPER_SIZE'))[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>
                                    setting.app_setting_type_name.startsWith('PAPER_SIZE')),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/select.js'});
        //highlight row
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_report_highlight_row',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>
                                                setting.app_id == props.data.app_id && 
                                                setting.app_setting_type_name.startsWith('HIGHLIGHT_ROW'))[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>
                                        setting.app_id == props.data.app_id && 
                                        setting.app_setting_type_name.startsWith('HIGHLIGHT_ROW'))[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>
                                    setting.app_id == props.data.app_id && 
                                    setting.app_setting_type_name.startsWith('HIGHLIGHT_ROW')),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:null,
            path:'/common/component/select.js'});

        props.methods.set_current_value('setting_select_report_papersize', props.data.user_settings.design_paper_size);
        
        props.methods.common_document.querySelector('#paper').className=props.data.user_settings.design_paper_size;

        props.methods.set_current_value('setting_select_report_highlight_row', props.data.user_settings.design_row_highlight);

        if (Number(props.data.user_settings.design_column_weekday_checked))
            props.methods.common_document.querySelector('#setting_checkbox_report_show_weekday').classList.add('checked');
        else
            props.methods.common_document.querySelector('#setting_checkbox_report_show_weekday').classList.remove('checked');
        if (Number(props.data.user_settings.design_column_calendartype_checked))
            props.methods.common_document.querySelector('#setting_checkbox_report_show_calendartype').classList.add('checked');
        else
            props.methods.common_document.querySelector('#setting_checkbox_report_show_calendartype').classList.remove('checked');
        if (Number(props.data.user_settings.design_column_notes_checked))
            props.methods.common_document.querySelector('#setting_checkbox_report_show_notes').classList.add('checked');
        else
            props.methods.common_document.querySelector('#setting_checkbox_report_show_notes').classList.remove('checked');
        if (Number(props.data.user_settings.design_column_gps_checked))
            props.methods.common_document.querySelector('#setting_checkbox_report_show_gps').classList.add('checked');
        else
            props.methods.common_document.querySelector('#setting_checkbox_report_show_gps').classList.remove('checked');
        if (Number(props.data.user_settings.design_column_timezone_checked))
            props.methods.common_document.querySelector('#setting_checkbox_report_show_timezone').classList.add('checked');
        else
            props.methods.common_document.querySelector('#setting_checkbox_report_show_timezone').classList.remove('checked');

        props.methods.update_all_theme_thumbnails();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({spinner:'css_spinner',
                            theme_id_day:props.data.user_settings.design_theme_day_id,
                            theme_id_month:props.data.user_settings.design_theme_month_id,
                            theme_id_year:props.data.user_settings.design_theme_year_id})
    };
};
export default method;