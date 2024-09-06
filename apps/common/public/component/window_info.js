/**
 * @module apps/common/component/window_info
 */

const template =`   <div id='common_window_info_btn_close' class='common_toolbar_button common_icon'></div>
                    <div id='common_window_info_info'><INFO/></div>
                    <div id='common_window_info_toolbar'>
                        <div id='common_window_info_toolbar_btn_zoomout' class='common_toolbar_button common_icon' ></div>
                        <div id='common_window_info_toolbar_btn_zoomin' class='common_toolbar_button common_icon' ></div>
                        <div id='common_window_info_toolbar_btn_left' class='common_toolbar_button common_icon' ></div>
                        <div id='common_window_info_toolbar_btn_right' class='common_toolbar_button common_icon' ></div>
                        <div id='common_window_info_toolbar_btn_up' class='common_toolbar_button common_icon' ></div>
                        <div id='common_window_info_toolbar_btn_down' class='common_toolbar_button common_icon' ></div>
                        <div id='common_window_info_toolbar_btn_fullscreen' class='common_toolbar_button common_icon' ></div>
                    </div>
                    <iframe id='common_window_info_content' scrolling='auto' <IFRAME_CLASS/> src=<CONTENT/> ></iframe>`;
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string,
 *          url:string,
 *          content_type:string,
 *          frame:import('../../../types.js').AppDocument|null,
 *          iframe_content:string,
 *          iframe_class:string,
 *          info:number}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:   null,
 *                      template:string}>}
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
                    INFO:`<img src='${props.url}'/>`,
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
                    CONTENT:props.url,
                    STYLE_TOOLBAR_DISPLAY:'none',
                    STYLE_CONTENT_DISPLAY:'block',
                    STYLE_INFO_OVERFLOWY:'hidden',
                    STYLE_INFO_INFO_DISPLAY:'none',
                    IFRAME_CLASS:''
                    }; 
            }    
            case 2:{
                if (props.content_type == 'HTML'){
                    return {
                        INFO:'',
                        CONTENT:props.iframe_content,
                        STYLE_TOOLBAR_DISPLAY:'none',
                        STYLE_CONTENT_DISPLAY:'block',
                        STYLE_INFO_OVERFLOWY:'auto',
                        STYLE_INFO_INFO_DISPLAY:'none',
                        IFRAME_CLASS:'class=' + props.iframe_class
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
    const render_template = async () =>{
        if (props.info==3)
            return template
                        .replace('<INFO/>','')
                        .replace('<IFRAME_CLASS/>',props.common_document.querySelector('#paper').classList)
                        .replace('<CONTENT/>','');
        else{
            props.common_document.querySelector('#common_window_info').style.visibility='visible';
            return template
                    .replace('<INFO/>',variables.INFO)
                    .replace('<IFRAME_CLASS/>',variables.IFRAME_CLASS)
                    .replace('<CONTENT/>',variables.CONTENT);
        }
    };
    const post_component = async () =>{
        if (props.info==3){
            //print content only
            props.common_document.querySelector('#common_window_info_content').contentWindow.document.open();
            props.common_document.querySelector('#common_window_info_content').contentWindow.document.write(props.iframe_content);
            props.frame?props.frame.querySelector('#common_window_info_content').focus():null;
            //await delay to avoid browser render error
            await new Promise ((resolve)=>{setTimeout(()=> {props.common_document.querySelector('#common_window_info_content').contentWindow.print();
                                                            resolve(null);}, 100);})
            .then(()=>props.common_document.querySelector('#common_window_info').innerHTML='');
        }
        else{
            props.common_document.querySelector('#common_window_info_toolbar').style.display= variables.STYLE_TOOLBAR_DISPLAY;
            props.common_document.querySelector('#common_window_info_content').style.display= variables.STYLE_CONTENT_DISPLAY;
            props.common_document.querySelector('#common_window_info').style.overflowY= variables.STYLE_INFO_OVERFLOWY;
            props.common_document.querySelector('#common_window_info_info').style.display= variables.STYLE_INFO_INFO_DISPLAY;
        }
    };
    const variables = get_variables(props.info);
    const template_rendered = await render_template();    
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template_rendered
    };
};
export default component;