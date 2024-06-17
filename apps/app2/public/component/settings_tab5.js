const template =`   <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_text_theme_col'>
                                <div id='setting_icon_text_theme_day' class='common_dialogue_button common_icon'></div>
                                <div id='setting_icon_text_theme_month' class='common_dialogue_button common_icon'></div>
                                <div id='setting_icon_text_theme_year' class='common_dialogue_button common_icon'></div>
                            </div>
                            <div id='setting_paper_preview_text' class='setting_paper_preview'>
                                <div id='setting_paper_preview_header_text' class='setting_paper_preview_header'>
                                    <div id='setting_input_header'>
                                        <div id='setting_input_reportheader1' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                        <div id='setting_input_reportheader2' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                        <div id='setting_input_reportheader3' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                    </div>
                                    <div id='setting_icon_text_header_aleft' class='setting_button common_icon' ></div>
                                    <div id='setting_icon_text_header_acenter' class='setting_button common_icon' ></div>
                                    <div id='setting_icon_text_header_aright' class='setting_button common_icon' ></div>
                                </div>
                                <div class='setting_paper_preview_space'></div>
                                <div id='setting_paper_preview_footer_text' class='setting_paper_preview_footer'>
                                    <div id='setting_icon_text_footer_aleft' class='setting_button common_icon' ></div>
                                    <div id='setting_icon_text_footer_acenter' class='setting_button common_icon' ></div>
                                    <div id='setting_icon_text_footer_aright' class='setting_button common_icon' ></div>
                                    <div id='setting_input_footer'>
                                        <div id='setting_input_reportfooter1' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                        <div id='setting_input_reportfooter2' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                        <div id='setting_input_reportfooter3' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                    </div>
                                </div>
                            </div>
                        </div>        
                        <div class='setting_horizontal_col'></div>
                    </div>`;
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    props;
    const render_template = () =>{
        return template;
    };
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
};
export default method;