/**
 * Displays app
 * @module apps/app2/component/app
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
const template = () =>` <div id="theme_background">
                            <div class="moon">
                                <div class="crater crater-1"></div>
                                <div class="crater crater-2"></div>
                                <div class="crater crater-3"></div>   
                                <div class="crater crater-4"></div>
                                <div class="crater crater-5"></div>
                                <div class="crater crater-6"></div>
                                <div class="crater crater-7"></div>
                            </div>
                            <div class="sunholder">
                                <div class="sun"></div>
                                <div class="raybase ray1"><div class="ray"></div></div>
                                <div class="raybase ray2"><div class="ray"></div></div>
                                <div class="raybase ray3"><div class="ray"></div></div>
                                <div class="raybase ray4"><div class="ray"></div></div>
                                <div class="raybase ray5"><div class="ray"></div></div>
                                <div class="raybase ray6"><div class="ray"></div></div>
                                <div class="raybase ray7"><div class="ray"></div></div>
                                <div class="raybase ray8"><div class="ray"></div></div>
                            </div>
                            <div class="x1">
                                <div class="cloud">
                                </div>
                            </div>
                            <div class="x2">
                                <div class="cloud">
                                </div>
                            </div>
                            <div class="x3">
                                <div class="cloud">
                                </div>
                            </div>
                            <div class="x4">
                                <div class="cloud">
                                </div>
                            </div>
                            <div class="x5">
                                <div class="cloud">
                                </div>
                            </div>
                        </div>
                        <div id='app_profile_toolbar'></div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON:common['CommonModuleCommon']}}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;