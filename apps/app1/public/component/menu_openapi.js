/**
 * @module apps/app1/component/open_api
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
const template = () => ` <div id='menu_openapi_content_widget1' class='widget'>
                                <div id='menu_openapi_detail_title' class='list_nav'>
                                    <div id='menu_openapi_detail_config'  class='list_nav_list list_button common_icon'></div>
                                    <div id='menu_openapi_detail_servers' class='list_nav_list list_button common_icon list_nav_selected_tab'></div>
                                </div>
                                <div id='menu_openapi_detail' class='common_list_scrollbar'></div>
                                <div id='menu_openapi_buttons' class="save_buttons">
                                    <div id='menu_openapi_save' class='common_app_dialogues_button button_save common_icon'></div>
                                </div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{ data:{      commonMountdiv:string},
 *           methods:{   appSecureCommonButtonSave:(arg0:string)=>void,
 *                       COMMON:common['CommonModuleCommon']},
 *           lifecycle:  null}} props 
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
        switch (true){
            case event_type=='click' && event_target_id == 'menu_openapi_save':{
                props.methods.appSecureCommonButtonSave('menu_openapi_save');
                break;
            }
            case event_type=='click' && event_target_id == 'menu_openapi_detail_config':
            case event_type=='click' && event_target_id == 'menu_openapi_detail_servers':{
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_openapi_content_widget1 .list_nav_selected_tab').classList.remove('list_nav_selected_tab');
                props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('list_nav_selected_tab');
                props.methods.COMMON.commonComponentRender({
                    mountDiv:   'menu_openapi_detail',
                    data:       {
                                detail:event_target_id,
                                },
                    methods:    null,
                    path:       '/component/menu_openapi_detail.js'});
                break;
            }
        }
    }
    const onMounted = () =>{
        //show default config
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_openapi_detail_config').click();
    };
 
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template()
    };
};
export default component;