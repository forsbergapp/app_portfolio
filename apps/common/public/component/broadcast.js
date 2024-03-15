const template =`<div id='common_broadcast_info'>
                    <div id='common_broadcast_banner'>
                        <div id='common_broadcast_header'>
                            <div id='common_broadcast_info_message'>
                                <div id='common_broadcast_info_message_item'><MESSAGE/></div>
                            </div>    
                        </div>
                        <div id='common_broadcast_footer'>
                            <div id='common_broadcast_info_logo'></div>
                            <div id='common_broadcast_info_title' class='common_icon'></div>
                            <div id='common_broadcast_close' class='common_icon'></div>
                        </div>
                    </div>
                </div>`;
/**
 * 
 * @param {*} props 
 * @returns {Promise.<void>}
 */
const method = async props => {
    switch (props.common_framework){
        case 2:{
            //Vue
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //Vue.createApp(...
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template.replace('<MESSAGE/>',props.message);
        }
        case 3:{
            //React
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //ReactDOM.createRoot(div... .render( App()
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template.replace('<MESSAGE/>',props.message);
        }
        case 1:
        default:{
            //Default Javascript
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template.replace('<MESSAGE/>',props.message);
        }
    }
}
export default method;