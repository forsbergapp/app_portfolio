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
 * @param {{apps:(common['server']['ORM']['View']['AppGetInfo'])[],
 *          icons:{info:string}}} props 
 * @returns {string}
 */
const template = props =>` <div id="theme_background">
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
                        <div id='apps' class='common_app_dialogues_content'>
                            <div id='apps_list_title'>
                                <div id='apps_list_title_col_date'></div>
                                <div id='apps_list_title_col_info' class='common_link common_icon_toolbar_s'>${props.icons.info}</div>
                            </div>
                            <div id='apps_list'>
                                ${props.apps.map(row=>
                                    `<div id='app_id_${row.Id}_${Date.now()}' class='apps_app_link_row common_row'>
                                        <div data-app_id='${row.Id}' class='apps_app_link_col apps_app_logo common_icon_button'>${row.Logo}</div>
                                        <div class='apps_app_link_col apps_app_name'>${row.Name}</div>
                                    </div>`
                                ).join('')
                                }
                            </div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON:common['CommonModuleCommon']}}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      events:common['commonComponentEvents'],
 *                      template:string}>}
 */
const component = async props => {
    /**
     * @name events
     * @descption Events
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        const elementDiv = props.methods.COMMON.commonMiscElementDiv(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event_target_id=='apps_list_title_col_info':{
                        props.methods.COMMON.commonComponentRender({
                            mountDiv:   'common_app_dialogues_info',
                            data:       null,
                            methods:    null,
                            path:       '/common/component/common_app_dialogues_info.js'});
                        break;
                    }            
                    case elementDiv.classList.contains('apps_app_logo'):{
                                                            /**@ts-ignore */
                        props.methods.COMMON.commonAppMount(elementDiv.getAttribute('data-app_id'),
                                                            event_target_id);
                        break;
                    }
                }
            }
        }
    };    
    const onMounted =()=>{
        props.methods.COMMON.commonMiscShowDateUpdate('apps_list_title_col_date');
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template({apps:props.methods.COMMON.commonGlobalGet('Data').Apps
                                    .filter((/**@type{common['server']['ORM']['View']['AppGetInfo']}*/app)=>
                                            [props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id,
                                            props.methods.COMMON.commonGlobalGet('Parameters').app_admin_app_id,
                                            props.methods.COMMON.commonGlobalGet('Parameters').app_start_app_id
                                            ].includes(app.Id)==false
                                    ),
                                icons:{info:props.methods.COMMON.commonGlobalGet('ICONS')['info']}})
    };
};
export default component;