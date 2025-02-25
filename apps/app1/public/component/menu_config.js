/**
 * Displays config
 * @module apps/app1/component/menu_config
 */
/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => ` <div id='menu_config_content_widget1' class='widget'>
                            <div id='menu_config' class='list_nav'>
                                <div id='menu_config_config_server'     data-table='ConfigServer'  class='list_nav_list list_button common_icon list_nav_selected_tab'></div>
                                <div id='menu_config_config_iam_policy' data-table='ConfigIamPolicy'  class='list_nav_list list_button common_icon'></div>
                            </div>
                            <div id='menu_config_detail_container'></div>
                            <div id='menu_config_buttons' class="save_buttons">
                                <div id='menu_config_save' class='common_dialogue_button button_save common_icon' ></div>
                            </div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{ data:{      commonMountdiv:string},
 *           methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT},
 *           lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const onMounted = () =>{
        props.methods.COMMON_DOCUMENT.querySelector('#menu_config_config_server').click();
    };
 
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;