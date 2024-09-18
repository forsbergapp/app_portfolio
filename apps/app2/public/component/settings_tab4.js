/**
 * @module apps/app2/component/settings_tab4
 */

const template =`   <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_paper_preview_image' class='setting_paper_preview'>
                                <div id='setting_paper_preview_header_image' class='setting_paper_preview_header'>
                                    <div id='setting_reportheader_img'></div>                                    
                                </div>
                                <div id='setting_paper_preview_header_buttons'>
                                    <input id='setting_input_reportheader_img' type='file' />
                                    <div id='setting_icon_image_header_img' class='setting_button common_icon' ></div>
                                    <div id='setting_icon_image_header_clear' class='setting_button common_icon' ></div>
                                </div>
                                <div class='setting_paper_preview_space'></div>
                                <div id='setting_paper_preview_footer_buttons'>
                                    <input id='setting_input_reportfooter_img' type='file' />
                                    <div id='setting_icon_image_footer_img' class='setting_button common_icon' ></div>
                                    <div id='setting_icon_image_footer_clear' class='setting_button common_icon' ></div>
                                </div>
                                <div id='setting_paper_preview_footer_image' class='setting_paper_preview_footer'>
                                    <div id='setting_reportfooter_img'></div>
                                </div>
                            </div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
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