/**
 * Display info
 * type content
 * 0    IMAGE
 * 1    URL
 * 2    HTML
 * @module apps/common/component/common_window_info
 */
/**
 * @import {CommonModuleCommon, CommonRESTAPIMethod, CommonRESTAPIAuthorizationType, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{info:'IMAGE'|'URL'|'HTML', 
 *          url?:string|null, 
 *          class?:string, 
 *          content?:string}} props
 * @returns {string}
 */
const template = props => ` <div id='common_window_info_btn_close' class='common_toolbar_button common_icon'></div>
                            ${props.info=='IMAGE'?
                                `<div id='common_window_info_info'>
                                    ${props.url?
                                        `<div id='common_window_info_info_img' style='${props.url==null?'':`background-image:url(${props.url});`}'></div>`:
                                        ''
                                    }
                                </div>
                                <div id='common_window_info_toolbar'>
                                    <div id='common_window_info_toolbar_btn_zoomout' class='common_toolbar_button common_icon' ></div>
                                    <div id='common_window_info_toolbar_btn_zoomin' class='common_toolbar_button common_icon' ></div>
                                    <div id='common_window_info_toolbar_btn_left' class='common_toolbar_button common_icon' ></div>
                                    <div id='common_window_info_toolbar_btn_right' class='common_toolbar_button common_icon' ></div>
                                    <div id='common_window_info_toolbar_btn_up' class='common_toolbar_button common_icon' ></div>
                                    <div id='common_window_info_toolbar_btn_down' class='common_toolbar_button common_icon' ></div>
                                    <div id='common_window_info_toolbar_btn_fullscreen' class='common_toolbar_button common_icon' ></div>
                                </div>`:
                                `<div id='common_window_info_info' class='${props.class}'>
                                    ${props.content}
                                </div>`
                            }`
;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      info:'IMAGE'|'URL'|'HTML', 
 *                      url?:string|null,
 *                      class?:string
 *                      content?:string,
 *                      path?:string,
 *                      query?:string,
 *                      method?:CommonRESTAPIMethod,
 *                      body?:*,
 *                      authorization?:CommonRESTAPIAuthorizationType},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}
 * >}
 */
const component = async props => {
    const content_fetch = (props.data.info=='URL' && props.data.path && props.data.method && props.data.authorization)?
                            await props.methods.commonFFB({ path:props.data.path, 
                                                            method:props.data.method, 
                                                            query:props.data.query, 
                                                            authorization_type:props.data.authorization, 
                                                            body:props.data.body??null}):null;
    
    const onMounted = async () =>{
        props.methods.COMMON_DOCUMENT.querySelector('#common_window_info').style.visibility='visible';
        props.methods.COMMON_DOCUMENT.querySelector('#common_window_info').style.overflowY= props.data.info=='URL'?'hidden':'auto';
    };
    
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({  info:   props.data.info,
                                url:    props.data.url,
                                class:  props.data.class,
                                content:props.data.info=='URL'?content_fetch:props.data.content
        })
    };
};
export default component;