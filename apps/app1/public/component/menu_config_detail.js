/**
 * Displays config
 * @module apps/app1/component/menu_config_detail
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{file:'ConfigServer'|'CONFIG_IAM_POLICY',
 *          config:[]}} props
 * @returns {string}
 */
const template = props => ` ${props.file=='ConfigServer'?
                                `<div id='menu_config_detail' class='common_list_scrollbar'>
                                    <div id='menu_config_detail_row_title' class='menu_config_detail_row'>
                                        <div class='menu_config_detail_col list_title'>PARAMETER NAME</div>
                                        <div class='menu_config_detail_col list_title'>PARAMETER VALUE</div>
                                        <div class='menu_config_detail_col list_title'>COMMENT</div>
                                    </div>
                                    ${  Object.keys(props.config).filter(row=>row!='METADATA').map(i_group=>
                                        `<div class='menu_config_detail_row menu_config_detail_group' >
                                            <div class='menu_config_detail_col menu_config_detail_group_title'>
                                                <div class='list_readonly'>${i_group}</div>
                                            </div>
                                            ${  /**@ts-ignore*/
                                                props.config[i_group].map(row=>
                                                `<div class='menu_config_detail_row' >
                                                    <div class='menu_config_detail_col'>
                                                        <div class='list_readonly'>${Object.keys(row)[0]}</div>
                                                    </div>
                                                    <div class='menu_config_detail_col'>
                                                        <div contentEditable='true' class='common_input'/>${Object.values(row)[0]}</div>
                                                    </div>
                                                    <div class='menu_config_detail_col'>
                                                        <div class='list_readonly'>${Object.values(row)[1]}</div>
                                                    </div>
                                                </div>`).join('')
                                            }
                                        </div>`
                                    ).join('')}
                                </div>`:
                                `<div id='menu_config_detail_edit' contentEditable = 'true'>${JSON.stringify(props.config, undefined, 2)}</div>`
                            }`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:{       commonMountdiv:string,
 *                       file:'ConfigServer'|'CONFIG_IAM_POLICY'},
 *          methods:{    COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonFFB:CommonModuleCommon['commonFFB']},
 *          lifecycle:   null}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const config_server = await props.methods.commonFFB({path:`/server-db/config/${props.data.file}`, query:'saved=1', method:'GET', authorization_type:'ADMIN'})
                                    .then((/**@type{string}*/result)=>JSON.parse(result));

   const onMounted = async () =>{        
        if (props.data.file=='ConfigServer'){
            //set focus first column in first row
            props.methods.COMMON_DOCUMENT.querySelectorAll('#menu_config_detail .common_input')[0].focus();
        }
 };
 
 return {
     lifecycle: {onMounted:onMounted},
     data:      null,
     methods:   null,
     template:  template({  file:props.data.file,
                            config:config_server})
 };
};
export default component;