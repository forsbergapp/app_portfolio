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
 * @param {*} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    
    const render_template = () =>{
        return template;
    }
    
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default component;