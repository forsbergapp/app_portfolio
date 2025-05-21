/**
 * Displays config
 * @module apps/app1/component/menu_config
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @import {server_db_document_ConfigServer}  from '../js/types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{config:server_db_document_ConfigServer}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_config_content_widget1' class='widget'>
                                <div id='menu_config' class='common_list_scrollbar'>
                                    <div id='menu_config_row_title' class='menu_config_row'>
                                        <div class='menu_config_col list_title'>PARAMETER NAME</div>
                                        <div class='menu_config_col list_title'>PARAMETER VALUE</div>
                                        <div class='menu_config_col list_title'>COMMENT</div>
                                    </div>
                                    ${  Object.keys(props.config).filter(row=>row!='METADATA').map(i_group=>
                                        `<div class='menu_config_group' >
                                            <div class='menu_config_col menu_config_group_title'>
                                                <div class='list_readonly'>${i_group}</div>
                                            </div>
                                            ${  /**@ts-ignore*/
                                                props.config[i_group].map(row=>
                                                `<div class='menu_config_row' >
                                                    <div class='menu_config_col'>
                                                        <div class='list_readonly'>${Object.keys(row)[0]}</div>
                                                    </div>
                                                    <div class='menu_config_col'>
                                                        <div contentEditable='true' class='common_input'/>${Object.values(row)[0]}</div>
                                                    </div>
                                                    <div class='menu_config_col'>
                                                        <div class='list_readonly'>${Object.values(row)[1]}</div>
                                                    </div>
                                                </div>`).join('')
                                            }
                                        </div>`
                                    ).join('')}
                                </div>
                                <div id='menu_config_buttons' class="save_buttons">
                                    <div id='menu_config_save' class='common_dialogue_button button_save common_icon' ></div>
                                </div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{ data:{      commonMountdiv:string},
 *           methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonFFB:CommonModuleCommon['commonFFB']},
 *           lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    /**@type{server_db_document_ConfigServer} */
    const config_server = await props.methods.commonFFB({   path:'/server-db/configserver', 
                                                            method:'GET', 
                                                            authorization_type:'ADMIN'})
                                    .then(result=>JSON.parse(result).rows);

    const onMounted = () =>{
        //set focus first column in first row
        props.methods.COMMON_DOCUMENT.querySelectorAll('#menu_config .common_input')[0].focus();
    };
 
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({config:config_server})
    };
};
export default component;