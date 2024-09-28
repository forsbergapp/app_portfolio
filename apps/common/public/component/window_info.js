/**
 * @module apps/common/component/window_info
 */

/**
 * @param {{info:string, iframe_class:string, content:string}} props
 */
const template = props => ` <div id='common_window_info_btn_close' class='common_toolbar_button common_icon'></div>
                            <div id='common_window_info_info'>
                                ${props.info?
                                    `<div id='common_window_info_info_img' style='background-image:url("${props.info}");'></div>`:
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
                            </div>
                            <iframe id='common_window_info_content' scrolling='auto' class='${props.iframe_class}' src='${props.content}' ></iframe>`;
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
 *                      },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}
 * >}
 */
const component = async props => {
    /**
     * 
     * @param {{}} info 
     * @returns {{  INFO:string,
     *              CONTENT:string,
     *              STYLE_TOOLBAR_DISPLAY:string,
     *              STYLE_CONTENT_DISPLAY:string,
     *              STYLE_INFO_OVERFLOWY:string,
     *              STYLE_INFO_INFO_DISPLAY:string,
     *              IFRAME_CLASS:string}}
     */
    const get_variables = info => {
        switch(info){
            case 0:{
                //show image
                return {
                    INFO:props.data.url,
                    CONTENT:'',
                    STYLE_TOOLBAR_DISPLAY:'flex',
                    STYLE_CONTENT_DISPLAY:'none',
                    STYLE_INFO_OVERFLOWY:'auto',
                    STYLE_INFO_INFO_DISPLAY:'inline-block',
                    IFRAME_CLASS:''
                    }; 
            }
            case 1:{
                //show url in iframe, use overflowY=hidden
                return {
                    INFO:'',
                    CONTENT:props.data.url,
                    STYLE_TOOLBAR_DISPLAY:'none',
                    STYLE_CONTENT_DISPLAY:'block',
                    STYLE_INFO_OVERFLOWY:'hidden',
                    STYLE_INFO_INFO_DISPLAY:'none',
                    IFRAME_CLASS:''
                    }; 
            }    
            case 2:{
                if (props.data.content_type == 'HTML'){
                    return {
                        INFO:'',
                        CONTENT:props.data.iframe_content,
                        STYLE_TOOLBAR_DISPLAY:'none',
                        STYLE_CONTENT_DISPLAY:'block',
                        STYLE_INFO_OVERFLOWY:'auto',
                        STYLE_INFO_INFO_DISPLAY:'none',
                        IFRAME_CLASS:props.data.iframe_class
                        };
                }
                else
                    return {
                        INFO:'',
                        CONTENT:'',
                        STYLE_TOOLBAR_DISPLAY:'',
                        STYLE_CONTENT_DISPLAY:'',
                        STYLE_INFO_OVERFLOWY:'',
                        STYLE_INFO_INFO_DISPLAY:'',
                        IFRAME_CLASS:''
                        };
            }
            default:
                return {
                    INFO:'',
                    CONTENT:'',
                    STYLE_TOOLBAR_DISPLAY:'',
                    STYLE_CONTENT_DISPLAY:'',
                    STYLE_INFO_OVERFLOWY:'',
                    STYLE_INFO_INFO_DISPLAY:'',
                    IFRAME_CLASS:''
                    };
        }
    };
    const render_template = () =>{
        if (props.data.info==3)
            return template({   info:'', 
                                iframe_class:props.methods.common_document.querySelector('#paper').className, 
                                content:''});
        else{
            props.methods.common_document.querySelector('#common_window_info').style.visibility='visible';
            return template({   info:variables.INFO, 
                                iframe_class:variables.IFRAME_CLASS, 
                                content:variables.CONTENT});
        }
    };
    const onMounted = async () =>{
        if (props.data.info==3){
            //print content only
            props.methods.common_document.querySelector('#common_window_info_content').contentWindow.document.open();
            props.methods.common_document.querySelector('#common_window_info_content').contentWindow.document.write(props.data.iframe_content);
            props.data.frame?props.data.frame.querySelector('#common_window_info_content').focus():null;
            //await delay to avoid browser render error
            await new Promise ((resolve)=>{props.methods.common_setTimeout(()=> {props.methods.common_document.querySelector('#common_window_info_content').contentWindow.print();
                                                            resolve(null);}, 100);})
            .then(()=>props.methods.common_document.querySelector('#common_window_info').innerHTML='');
        }
        else{
            props.methods.common_document.querySelector('#common_window_info_toolbar').style.display= variables.STYLE_TOOLBAR_DISPLAY;
            props.methods.common_document.querySelector('#common_window_info_content').style.display= variables.STYLE_CONTENT_DISPLAY;
            props.methods.common_document.querySelector('#common_window_info').style.overflowY= variables.STYLE_INFO_OVERFLOWY;
            props.methods.common_document.querySelector('#common_window_info_info').style.display= variables.STYLE_INFO_INFO_DISPLAY;
        }
    };
    const variables = get_variables(props.data.info);
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: render_template()
    };
};
export default component;