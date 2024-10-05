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
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      user_settings:import('../js//types.js').APP_user_setting_record
 *                      },
 *          methods:    {COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    const onMounted = async () =>{
        //Image
        props.methods.COMMON_DOCUMENT.querySelector('#setting_input_reportheader_img').value = '';
        if (props.data.user_settings.image_header_image_img == null ||
            props.data.user_settings.image_header_image_img == '') {
            props.methods.COMMON_DOCUMENT.querySelector('#setting_reportheader_img').style.backgroundImage= 'url()';
            props.methods.COMMON_DOCUMENT.querySelector('#setting_reportheader_img').setAttribute('data-image','');
        } else{
            props.methods.COMMON_DOCUMENT.querySelector('#setting_reportheader_img').style.backgroundImage= props.data.user_settings.image_header_image_img?
                                                                                                    `url('${props.data.user_settings.image_header_image_img}')`:
                                                                                                    'url()';
            props.methods.COMMON_DOCUMENT.querySelector('#setting_reportheader_img').setAttribute('data-image',props.data.user_settings.image_header_image_img);
        }
            

        props.methods.COMMON_DOCUMENT.querySelector('#setting_input_reportfooter_img').value = '';
        if (props.data.user_settings.image_footer_image_img == null ||
            props.data.user_settings.image_footer_image_img == '') {
                props.methods.COMMON_DOCUMENT.querySelector('#setting_reportfooter_img').style.backgroundImage= 'url()';
                props.methods.COMMON_DOCUMENT.querySelector('#setting_reportfooter_img').setAttribute('data-image','');
        } else{
            props.methods.COMMON_DOCUMENT.querySelector('#setting_reportfooter_img').style.backgroundImage= props.data.user_settings.image_footer_image_img?
                                                                                                    `url('${props.data.user_settings.image_footer_image_img}')`:
                                                                                                    'url()';
            props.methods.COMMON_DOCUMENT.querySelector('#setting_reportfooter_img').setAttribute('data-image',props.data.user_settings.image_footer_image_img);
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default method;