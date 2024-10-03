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
 * @param {{info_type:number, info:string, iframe_class:string, content:string}} props
 */
const template = props => ` <div id='common_window_info_btn_close' class='common_toolbar_button common_icon'></div>
                            ${props.info_type==0?
                                `<div id='common_window_info_info'>
                                    ${props.info?
                                        `<div id='common_window_info_info_img' style='background-image:url("${props.info}");'></div>`:
                                        ''
                                    }
                                </div>`:
                                ''
                            }
                            ${(props.info_type==0 ||props.info_type==1)?
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
                            }`
;
/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      info:number, 
 *                      url:string,
 *                      content_type:string,
 *                      frame:import('../../../common_types.js').CommonAppDocument|null,
 *                      iframe_content:string,
 *                      iframe_class:string},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      common_setTimeout:import('../../../common_types.js').CommonModuleCommon['common_setTimeout']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}
 * >}
 */
const component = async props => {
    /**
     * 
     * @param {{}} info_type
     * @returns {{  INFO:string,
     *              CONTENT:string,
     *              STYLE_INFO_OVERFLOWY:string,
     *              IFRAME_CLASS:string}}
     */
    const get_variables = info_type => {
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
            default:
                return {
                    INFO:'',
                    CONTENT:'',
                    STYLE_INFO_OVERFLOWY:'',
                    IFRAME_CLASS:''
                    };
        }
    };
    const variables = get_variables(props.data.info);
    const onMounted = async () =>{
        if (props.data.info==3){
            //print content only
            props.methods.common_document.querySelector('#common_window_info_content').contentWindow.document.open();
            props.methods.common_document.querySelector('#common_window_info_content').contentWindow.document.write(props.data.iframe_content);
            props.data.frame?props.methods.common_document.querySelector('#common_window_info_content').focus():null;
            //await delay to avoid browser render error
            await new Promise ((resolve)=>{props.methods.common_setTimeout(()=> {props.methods.common_document.querySelector('#common_window_info_content').contentWindow.print();
                                                            resolve(null);}, 100);})
            .then(()=>props.methods.common_document.querySelector('#common_window_info').innerHTML='');
        }
        else{
            props.methods.common_document.querySelector('#common_window_info').style.visibility='visible';
            props.methods.common_document.querySelector('#common_window_info').style.overflowY= variables.STYLE_INFO_OVERFLOWY;
        }
    };
    
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({  info_type:      props.data.info,
                                info:           props.data.info==3?'':variables.INFO,
                                iframe_class:   props.data.info==3?props.methods.common_document.querySelector('#paper').className:variables.IFRAME_CLASS,
                                content:        props.data.info==3?'':variables.CONTENT
        })
    };
};
export default component;