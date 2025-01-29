/**
 * Display info
 * type content
 * 0    image
 * 1    url
 * 2    HTML
 * 3    print only
 * @module apps/common/component/common_window_info
 */
/**
 * @import {CommonModuleCommon, CommonRESTAPIMethod, CommonRESTAPIAuthorizationType, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{info_type:number, info:string, iframe_class:string, content:string}} props
 * @returns {string}
 */
const template = props => ` <div id='common_window_info_btn_close' class='common_toolbar_button common_icon'></div>
                            ${props.info_type==0?
                                `<div id='common_window_info_info'>
                                    ${props.info?
                                        `<div id='common_window_info_info_img' style='${props.info==null?'':`background-image:url(${props.info});`}'></div>`:
                                        ''
                                    }
                                </div>`:
                                ''
                            }
                            ${(props.info_type==0)?
                                `<div id='common_window_info_toolbar'>
                                    ${props.info_type==0?
                                        `   <div id='common_window_info_toolbar_btn_zoomout' class='common_toolbar_button common_icon' ></div>
                                            <div id='common_window_info_toolbar_btn_zoomin' class='common_toolbar_button common_icon' ></div>
                                            <div id='common_window_info_toolbar_btn_left' class='common_toolbar_button common_icon' ></div>
                                            <div id='common_window_info_toolbar_btn_right' class='common_toolbar_button common_icon' ></div>
                                            <div id='common_window_info_toolbar_btn_up' class='common_toolbar_button common_icon' ></div>
                                            <div id='common_window_info_toolbar_btn_down' class='common_toolbar_button common_icon' ></div>`:
                                        ''
                                    }
                                    <div id='common_window_info_toolbar_btn_fullscreen' class='common_toolbar_button common_icon' ></div>
                                </div>`:''
                            }
                            ${(props.info_type==1 ||props.info_type==2 ||props.info_type==3)?
                                `<iframe id='common_window_info_content' scrolling='auto' class='${props.iframe_class}' src='${props.content}' ></iframe>`:
                                ''
                            }
                            ${props.info_type==4?
                                `<div id='common_window_info_info' class='${props.iframe_class}'>
                                    ${props.content}
                                </div>`:
                                ''
                            }`
;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      info:number, 
 *                      url:string,
 *                      content_type:string,
 *                      frame:COMMON_DOCUMENT|null,
 *                      iframe_content:string,
 *                      path:string,
 *                      method:CommonRESTAPIMethod,
 *                      body:*,
 *                      authorization_type:CommonRESTAPIAuthorizationType,
 *                      iframe_class:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonWindowSetTimeout:CommonModuleCommon['commonWindowSetTimeout'],
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}
 * >}
 */
const component = async props => {
    /**
     * 
     * @param {{}} info_type
     * @returns {Promise.<{  INFO:string,
     *              CONTENT:string,
     *              STYLE_INFO_OVERFLOWY:string,
     *              IFRAME_CLASS:string}>}
     */
    const get_variables = async info_type => {
        switch(info_type){
            case 0:{
                //show image
                return {
                    INFO:props.data.url,
                    CONTENT:'',
                    STYLE_INFO_OVERFLOWY:'auto',
                    IFRAME_CLASS:''
                    }; 
            }
            case 1:{
                //show url in iframe, use overflowY=hidden
                return {
                    INFO:'',
                    CONTENT:props.data.url,
                    STYLE_INFO_OVERFLOWY:'hidden',
                    IFRAME_CLASS:''
                    }; 
            }    
            case 2:{
                if (props.data.content_type == 'HTML'){
                    return {
                        INFO:'',
                        CONTENT:props.data.iframe_content,
                        STYLE_INFO_OVERFLOWY:'auto',
                        IFRAME_CLASS:props.data.iframe_class
                        };
                }
                else
                    return {
                        INFO:'',
                        CONTENT:'',
                        STYLE_INFO_OVERFLOWY:'',
                        IFRAME_CLASS:''
                        };
            }
            case 4:{
                const html = await props.methods.commonFFB({path:props.data.path, method:props.data.method, authorization_type:props.data.authorization_type, body:props.data.body});
                return {
                    INFO:'',
                    CONTENT:html,
                    STYLE_INFO_OVERFLOWY:'auto',
                    IFRAME_CLASS:props.data.iframe_class
                    };
            }
            default:
                return {
                    INFO:'',
                    CONTENT:'',
                    STYLE_INFO_OVERFLOWY:'',
                    IFRAME_CLASS:''
                    };
        }
    };
    const variables = await get_variables(props.data.info);
    const onMounted = async () =>{
        if (props.data.info==3){
            //print content only
            props.methods.COMMON_DOCUMENT.querySelector('#common_window_info_content').contentWindow.document.open();
            props.methods.COMMON_DOCUMENT.querySelector('#common_window_info_content').contentWindow.document.write(props.data.iframe_content);
            props.data.frame?props.methods.COMMON_DOCUMENT.querySelector('#common_window_info_content').focus():null;
            //await delay to avoid browser render error
            await new Promise ((resolve)=>{props.methods.commonWindowSetTimeout(()=> {props.methods.COMMON_DOCUMENT.querySelector('#common_window_info_content').contentWindow.print();
                                                            resolve(null);}, 100);})
            .then(()=>props.methods.COMMON_DOCUMENT.querySelector('#common_window_info').textContent='');
        }
        else{
            props.methods.COMMON_DOCUMENT.querySelector('#common_window_info').style.visibility='visible';
            props.methods.COMMON_DOCUMENT.querySelector('#common_window_info').style.overflowY= variables.STYLE_INFO_OVERFLOWY;
        }
    };
    
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({  info_type:      props.data.info,
                                info:           props.data.info==3?'':variables.INFO,
                                iframe_class:   props.data.info==3?props.methods.COMMON_DOCUMENT.querySelector('#paper').className:variables.IFRAME_CLASS,
                                content:        props.data.info==3?'':variables.CONTENT
        })
    };
};
export default component;