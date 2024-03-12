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
                    <iframe id='common_window_info_content' scrolling='auto' class=<IFRAME_CLASS/> src=<CONTENT/> ></iframe>`;
/**
 * 
 * @param {*} props 
 */
const method = async props => {
    /**
     * 
     * @param {{}} info 
     * @returns 
     */
    const get_variables = async info => {
        return new Promise((resolve)=>{
            switch(info){
                case 0:{
                    //show image
                    resolve({
                        INFO:`<img src='${props.url}'/>`,
                        CONTENT:'',
                        STYLE_TOOLBAR_DISPLAY:'flex',
                        STYLE_CONTENT_DISPLAY:'none',
                        STYLE_INFO_OVERFLOWY:'auto',
                        STYLE_INFO_INFO_DISPLAY:'inline-block',
                        IFRAME_CLASS:''
                        }); 
                    break;
                }
                case 1:{
                    //show url in iframe, use overflowY=hidden
                    resolve({
                        INFO:'',
                        CONTENT:props.url,
                        STYLE_TOOLBAR_DISPLAY:'none',
                        STYLE_CONTENT_DISPLAY:'block',
                        STYLE_INFO_OVERFLOWY:'hidden',
                        STYLE_INFO_INFO_DISPLAY:'none',
                        IFRAME_CLASS:''
                        }); 
                    break;
                }    
                case 2:{
                    if (props.content_type == 'HTML'){
                        resolve({
                            INFO:'',
                            CONTENT:props.iframe_content,
                            STYLE_TOOLBAR_DISPLAY:'none',
                            STYLE_CONTENT_DISPLAY:'block',
                            STYLE_INFO_OVERFLOWY:'auto',
                            STYLE_INFO_INFO_DISPLAY:'none',
                            IFRAME_CLASS:props.iframe_class
                            });
                    }
                    else
                        if (props.content_type=='PDF'){
                            //show empty component with spinner
                            props.common_document.querySelector(`#${props.mountdiv}`).innerHTML = template.replace('<INFO/>','').replace('<CONTENT/>','');
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
                                    resolve({
                                            INFO:'',
                                            CONTENT:base64PDF,
                                            STYLE_TOOLBAR_DISPLAY:'none',
                                            STYLE_CONTENT_DISPLAY:'block',
                                            STYLE_INFO_OVERFLOWY:'auto',
                                            STYLE_INFO_INFO_DISPLAY:'none',
                                            IFRAME_CLASS:props.iframe_class
                                            });
                                };
                            });
                        }
                        else
                            resolve(null);
                    break;
                }
                default:
                    resolve(null);
            }
        })
    }
    if (props.info==3){
        //print content only
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template.replace('<INFO/>','').replace('<IFRAME_CLASS/>',props.common_document.querySelector('#paper').classList).replace('<CONTENT/>','');
        props.common_document.querySelector('#common_window_info_content').contentWindow.document.open();
        props.common_document.querySelector('#common_window_info_content').contentWindow.document.write(props.iframe_content);
        props.frame.querySelector('#common_window_info_content').focus();
        //await delay to avoid browser render error
        await new Promise ((resolve)=>{setTimeout(()=> {props.common_document.querySelector('#common_window_info_content').contentWindow.print();
                                                        resolve(null);}, 500);});
        return null;
    }
    else{
        props.common_document.querySelector('#common_window_info').style.visibility='visible';
        const  variables = await get_variables(props.info);
        
        props.common_document.querySelector(':root').style.setProperty('--common_app_component_window_info_toolbar_style_display',  variables.STYLE_TOOLBAR_DISPLAY);
        props.common_document.querySelector(':root').style.setProperty('--common_app_component_window_info_content_style_display',  variables.STYLE_CONTENT_DISPLAY);
        props.common_document.querySelector(':root').style.setProperty('--common_app_component_window_info_overflowY',              variables.STYLE_INFO_OVERFLOWY);
        props.common_document.querySelector(':root').style.setProperty('--common_app_component_window_info_info_style_display',     variables.STYLE_INFO_INFO_DISPLAY);
        switch (props.common_framework){
            case 2:{
                //Vue
                //Use tempmount div to be able to return pure HTML
                //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
                //Vue.createApp(...
                //return props.common_document.querySelector('#tempmount').innerHTML;
                return template.replace('<INFO/>',variables.INFO).replace('<IFRAME_CLASS/>',variables.IFRAME_CLASS).replace('<CONTENT/>',variables.CONTENT);
            }
            case 3:{
                //React
                //Use tempmount div to be able to return pure HTML
                //props.document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
                //ReactDOM.createRoot(div... .render( App()
                //return props.common_document.querySelector('#tempmount').innerHTML;
                return template.replace('<INFO/>',variables.INFO).replace('<IFRAME_CLASS/>',variables.IFRAME_CLASS).replace('<CONTENT/>',variables.CONTENT);
            }
            case 1:
            default:{
                //Default Javascript
                return template.replace('<INFO/>',variables.INFO).replace('<IFRAME_CLASS/>',variables.IFRAME_CLASS).replace('<CONTENT/>',variables.CONTENT);
            }
        }
    }
}
export default method;