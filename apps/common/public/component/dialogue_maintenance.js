const template =`   <div id='common_dialogue_maintenance_content' class='common_dialogue_content'>
                        <div id='common_maintenance_logo'></div>
                        <div id='common_maintenance_message'></div>
                        <div id='common_maintenance_countdown'></div>
                        <div id='common_maintenance_footer'></div>
                    </div>`;
/**
 * 
 * @param {*} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    /**
     * Maintenance countdown
     * @param {number|null} remaining 
     */
    const maintenance_countdown = (remaining = null) => {
        props.common_document.querySelector('#common_maintenance_countdown').innerHTML = remaining;
        setTimeout(()=>{ maintenance_countdown((remaining ?? 60) - 1); }, 1000);
    };    
    const render_template = () =>{
        return template;
    }
    return {
        props:  {function_post:maintenance_countdown},
        data:   null,
        template: render_template()
    };
}
export default component;
