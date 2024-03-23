const template =`   <div id='profile_top_app2'>
                    <div id='profile_top_row2'>
                        <div id='profile_top_row2_1' class='common_link common_icon'></div>
                        <div id='profile_top_row2_2' class='common_link common_icon'></div>
                    </div>
                    </div>`;
/**
 * 
 * @param {*} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    
    const render_template = () =>{
        return template;
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default method;
