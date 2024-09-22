/**
 * @module apps/admin/component/menu_config_detail
 */
/**
 * Displays config
 * 
 */
/**
 * @param {{spinner:string,
 *          server_group:number[],
 *          file:'SERVER'|'IAM_BLOCKIP'|'IAM_USERAGENT'|'IAM_POLICY',
 *          config:[]}} props
 */
const template = props => ` ${props.file=='SERVER'?
                                `<div id='list_config' class='common_list_scrollbar ${props.spinner}'>
                                    <div id='list_config_row_title' class='list_config_row'>
                                        <div id='list_config_col_title1' class='list_config_col list_title'>PARAMETER NAME</div>
                                        <div id='list_config_col_title2' class='list_config_col list_title'>PARAMETER VALUE</div>
                                        <div id='list_config_col_title3' class='list_config_col list_title'>COMMENT</div>
                                    </div>
                                    ${  //create div groups with parameters, each group with a title
                                        //first 5 attributes in config json contains array of parameter records
                                        //metadata is saved last in config
                                        props.spinner=='' && props.server_group.map(i_group=>
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
                                `<div id='list_config_edit' contentEditable = 'true' class='${props.spinner}'>${JSON.stringify(props.config, undefined, 2)}</div>`
                            }`;
/**
* 
* @param {{common_document:import('../../../common_types.js').CommonAppDocument,
*          common_mountdiv:string,
*          file:'SERVER'|'IAM_BLOCKIP'|'IAM_USERAGENT'|'IAM_POLICY',
*          function_FFB:function}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:null, 
*                      template:string}>}
*/
const component = async props => {
const server_groups = [0,1,2,3,4];
   const post_component = async () =>{
        const config_server = await props.function_FFB(`/server-config/config/${props.file}`, 'saved=1', 'GET', 'SYSTEMADMIN', null).then((/**@type{string}*/result)=>JSON.parse(result).data);
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template({ spinner:'',
                                                                                                server_group:server_groups,
                                                                                                file:props.file,
                                                                                                config:config_server});
        if (props.file=='SERVER'){
            //set focus first column in first row
            props.common_document.querySelectorAll('#list_config .common_input')[0].focus();
        }
 };
 
 return {
     props:  {function_post:post_component},
     data:   null,
     template: template({   spinner:'css_spinner',
                            server_group:server_groups, 
                            file:props.file,
                            config:[]})
 };
};
export default component;