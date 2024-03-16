const template =`   <div id='common_dialogue_maintenance_content' class='common_dialogue_content'>
                    <div id='common_maintenance_logo'></div>
                    <div id='common_maintenance_message'></div>
                    <div id='common_maintenance_countdown'></div>
                    <div id='common_maintenance_footer'></div>
                    </div>`;
/**
 * 
 * @param {*} props 
 * @returns {Promise.<void>}
 */
const method = async props => {
    const countdown_timer = 60;
    /**
     * Maintenance countdown
     * @param {number} remaining 
     */
    const maintenance_countdown = (remaining) => {
        if(remaining <= 0)
            location.reload();
        props.common_document.querySelector('#common_maintenance_countdown').innerHTML = remaining;
        setTimeout(()=>{ maintenance_countdown(remaining - 1); }, 1000);
    };
    
    const render_template = () =>{
        return template;
    }
    switch (props.common_framework){
        case 2:{
            //Vue
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //Vue.createApp(...
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template();
            maintenance_countdown(countdown_timer);
        }
        case 3:{
            //React
            //Use tempmount div to be able to return pure HTML
            //props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = `<div id='tempmount'></div>`;
            //ReactDOM.createRoot(div... .render( App()
            //return props.common_document.querySelector('#tempmount').innerHTML;
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template();
            maintenance_countdown(countdown_timer);
        }
        case 1:
        default:{
            //Default Javascript
            props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template();
            maintenance_countdown(countdown_timer);
        }
    }
}
export default method;
