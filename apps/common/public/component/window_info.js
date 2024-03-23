const template =`   <div id='common_window_info_btn_close' class='common_toolbar_button common_icon'></div>
                    <div id='common_window_info_info'><INFO/></div>
                    <div id=common_window_info_toolbar>
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
 * @param {*} props 
 * @returns {Promise.<{ props:{function_post:function|null}, 
 *                      data:   null,
 *                      template:string}>}
 */
const component = async props => {
    /**
     * 
     * @param {{}} info 
     * @returns
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
                break;
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
                break;
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
                    if (props.content_type=='PDF'){
                        return {
                            INFO:'',
                            CONTENT:null,
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
                            CONTENT:null,
                            STYLE_TOOLBAR_DISPLAY:null,
                            STYLE_CONTENT_DISPLAY:null,
                            STYLE_INFO_OVERFLOWY:null,
                            STYLE_INFO_INFO_DISPLAY:null,
                            IFRAME_CLASS:''
                            };
                break;
            }
            default:
                return {
                    INFO:'',
                    CONTENT:null,
                    STYLE_TOOLBAR_DISPLAY:null,
                    STYLE_CONTENT_DISPLAY:null,
                    STYLE_INFO_OVERFLOWY:null,
                    STYLE_INFO_INFO_DISPLAY:null,
                    IFRAME_CLASS:''
                    };
        }
    }
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
    }
    const post_component = async () =>{
        if (props.info==3){
            //print content only
            props.common_document.querySelector('#common_window_info_content').contentWindow.document.open();
            props.common_document.querySelector('#common_window_info_content').contentWindow.document.write(props.iframe_content);
            props.frame.querySelector('#common_window_info_content').focus();
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
            if (props.info==2 && props.content_type=='PDF'){
                //show empty component with spinner
                props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template.replace('<INFO/>','').replace('<CONTENT/>','');
                props.common_document.querySelector('#common_window_info_info').classList.add('css_spinner');
                fetch (props.iframe_content,
                    {
                        headers: {
                            'Content-Type': 'application/pdf;charset=UTF-8'
                        }
                    }
                )
                .then((response) => {
                    return response.blob();
                })
                .then((pdf) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(pdf); 
                    reader.onloadend = () => {
                        const base64PDF = reader.result;
                        props.common_document.querySelector('#common_window_info_info').classList.remove('css_spinner');
                        props.common_document.querySelector('#common_window_info_content').src = base64PDF;
                    };
                });
            }
        }
    }
    const variables = get_variables(props.info);
    const template_rendered = await render_template()    
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template_rendered
    };
}
export default component;