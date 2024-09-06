/**
 * @module apps/app1/component/app_theme
 */

const template =`   <div id="app_themes">
                        <div id="app_theme_checkbox" class="toggle checked">
                            <div class="toggle-button">
                                <div class="crater crater-1"></div>
                                <div class="crater crater-2"></div>
                                <div class="crater crater-3"></div>   
                                <div class="crater crater-4"></div>
                                <div class="crater crater-5"></div>
                                <div class="crater crater-6"></div>
                                <div class="crater crater-7"></div>
                            </div>
                            <div class="star star-1"></div>
                            <div class="star star-2"></div>
                            <div class="star star-3"></div>
                            <div class="star star-4"></div>
                            <div class="star star-5"></div>
                            <div class="star star-6"></div>
                            <div class="star star-7"></div>
                            <div class="star star-8"></div>
                        </div>
                    </div>`;
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string,
 *          function_app_theme_update:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    
    const render_template = () =>{
        return template;
    };
   
    const post_component = async () =>{
        //set app theme
        props.function_app_theme_update();
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template()
    };
};
export default component;