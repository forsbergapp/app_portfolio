/**
 * @module apps/admin/component/menu_config_detail
 */
/**
 * Displays config
 * 
 */
/**
 * @param {{server_group:number[],
 *          file:'CONFIG_SERVER'|'CONFIG_IAM_BLOCKIP'|'CONFIG_IAM_POLICY'|'CONFIG_IAM_USERAGENT',
 *          config:[]}} props
 */
const template = props => ` ${props.file=='CONFIG_SERVER'?
                                `<div id='list_config' class='common_list_scrollbar'>
                                    <div id='list_config_row_title' class='list_config_row'>
                                        <div id='list_config_col_title1' class='list_config_col list_title'>PARAMETER NAME</div>
                                        <div id='list_config_col_title2' class='list_config_col list_title'>PARAMETER VALUE</div>
                                        <div id='list_config_col_title3' class='list_config_col list_title'>COMMENT</div>
                                    </div>
                                    ${  //create div groups with parameters, each group with a title
                                        //first 5 attributes in config json contains array of parameter records
                                        //metadata is saved last in config
                                        props.server_group.map(i_group=>
                                        `<div id='list_config_row_${i_group}' class='list_config_row list_config_group' >
                                            <div class='list_config_col list_config_group_title'>
                                                <div class='list_readonly'>${Object.keys(props.config)[i_group]}</div>
                                            </div>
                                            ${  /**@ts-ignore*/
                                                props.config[Object.keys(props.config)[i_group]].map(row=>
                                                `<div id='list_config_row_${i_group}' class='list_config_row' >
                                                    <div class='list_config_col'>
                                                        <div class='list_readonly'>${Object.keys(row)[0]}</div>
                                                    </div>
                                                    <div class='list_config_col'>
                                                        <div contentEditable='true' class='common_input'/>${Object.values(row)[0]}</div>
                                                    </div>
                                                    <div class='list_config_col'>
                                                        <div class='list_readonly'>${Object.values(row)[1]}</div>
                                                    </div>
                                                </div>`).join('')
                                            }
                                        </div>`
                                    ).join('')}
                                </div>`:
                                `<div id='list_config_edit' contentEditable = 'true'>${JSON.stringify(props.config, undefined, 2)}</div>`
                            }`;
/**
* 
* @param {{data:{       commonMountdiv:string,
*                       file:'CONFIG_SERVER'|'CONFIG_IAM_BLOCKIP'|'CONFIG_IAM_POLICY'|'CONFIG_IAM_USERAGENT'},
*          methods:{    COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
*                       commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB']},
*          lifecycle:   null}} props 
* @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
*                      data:null, 
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
    const server_groups = [0,1,2,3,4];
    const config_server = await props.methods.commonFFB({path:`/server-config/config/${props.data.file}`, query:'saved=1', method:'GET', authorization_type:'SYSTEMADMIN'})
                                    .then((/**@type{string}*/result)=>JSON.parse(result).data);

   const onMounted = async () =>{        
        if (props.data.file=='CONFIG_SERVER'){
            //set focus first column in first row
            props.methods.COMMON_DOCUMENT.querySelectorAll('#list_config .common_input')[0].focus();
        }
 };
 
 return {
     lifecycle: {onMounted:onMounted},
     data:      null,
     methods:   null,
     template:  template({  server_group:server_groups, 
                            file:props.data.file,
                            config:config_server})
 };
};
export default component;