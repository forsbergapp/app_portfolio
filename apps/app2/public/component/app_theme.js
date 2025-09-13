/**
 * Displays app theme
 * @module apps/app2/component/app_theme
 */

/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () =>` <div id="app_themes">
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
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon'],
 *                      appPreferencesPostMount:import('../js/app.js')['appPreferencesPostMount']
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    
    const onMounted = async () =>{
        //set app theme
        props.methods.appPreferencesPostMount();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;