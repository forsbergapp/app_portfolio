/**
 * @module apps/app2/component/settings_tab4
 */

const template = () => `<div class='setting_horizontal_row'>
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
 *          common_mountdiv:string,
 *          user_settings:import('../js//types.js').APP_user_setting_record}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    const post_component = async () =>{
        //Image
            //dont set null value, it will corrupt IMG tag
            props.common_document.querySelector('#setting_input_reportheader_img').value = '';
            if (props.user_settings.image_header_image_img == null ||
                props.user_settings.image_header_image_img == '') {
                props.common_document.querySelector('#setting_reportheader_img').style.backgroundImage= 'url()';
                props.common_document.querySelector('#setting_reportheader_img').setAttribute('data-image','');
            } else{
                props.common_document.querySelector('#setting_reportheader_img').style.backgroundImage= props.user_settings.image_header_image_img?
                                                                                                        `url('${props.user_settings.image_header_image_img}')`:
                                                                                                        'url()';
                props.common_document.querySelector('#setting_reportheader_img').setAttribute('data-image',props.user_settings.image_header_image_img);
            }
                

            props.common_document.querySelector('#setting_input_reportfooter_img').value = '';
            if (props.user_settings.image_footer_image_img == null ||
                props.user_settings.image_footer_image_img == '') {
                    props.common_document.querySelector('#setting_reportfooter_img').style.backgroundImage= 'url()';
                    props.common_document.querySelector('#setting_reportfooter_img').setAttribute('data-image','');
            } else{
                props.common_document.querySelector('#setting_reportfooter_img').style.backgroundImage= props.user_settings.image_footer_image_img?
                                                                                                        `url('${props.user_settings.image_footer_image_img}')`:
                                                                                                        'url()';
                props.common_document.querySelector('#setting_reportfooter_img').setAttribute('data-image',props.user_settings.image_footer_image_img);
            }
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template()
    };
};
export default method;