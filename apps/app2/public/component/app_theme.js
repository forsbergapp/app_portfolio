/**
 * Displays app theme
 * @module apps/app1/component/app_theme
 */

/**
 * @import {COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
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
 * 
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      appPreferencesPostMount:import('../js/app.js')['appPreferencesPostMount']
 *                      }}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
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