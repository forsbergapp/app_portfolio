/**
 * @module apps/common/component/common_map_control_expand_search_city
 */

/**
 * @import {CommonWorldcitiesRecordType, CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle,
 *          commonEventType, CommonAppEvent}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{records:CommonWorldcitiesRecordType[]}
*          } props 
* @returns {string}
*/
const template = props =>`  <div id='common_map_control_expand_search_list'>
                               ${props.records.map(row=>
                                   `<div data-city='${row.city}' data-country='${row.admin_name + ',' + row.country}' data-latitude='${row.lat}' data-longitude='${row.lng}' class='common_map_control_expand_search_list_row common_row' tabindex=-1>
                                       <div class='common_map_control_expand_search_list_col'>
                                           <div class='common_map_control_expand_search_list_city_id'>${row.id}</div>
                                       </div>
                                       <div class='common_map_control_expand_search_list_col'>
                                           <div class='common_map_control_expand_search_list_city common_link common_map_control_expand_click_city'>${row.city}</div>
                                       </div>
                                       <div class='common_map_control_expand_search_list_col'>
                                           <div class='common_map_control_expand_search_list_country common_link common_map_control_expand_click_city'>${row.admin_name + ',' + row.country}</div>
                                       </div>
                                       <div class='common_map_control_expand_search_list_col'>
                                           <div class='common_map_control_expand_search_list_latitude'>${row.lat}</div>
                                       </div>
                                       <div class='common_map_control_expand_search_list_col'>
                                           <div class='common_map_control_expand_search_list_longitude'>${row.lng}</div>
                                       </div>
                                   </div>`).join('')
                               }
                           </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      data_app_id:number,
 *                      search:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      goTo:function,
 *                      commonMiscElementId:CommonModuleCommon['commonMiscElementId']
 *                      commonMiscElementRow:CommonModuleCommon['commonMiscElementRow']
 *                      commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      events:function,
 *                      template:string}>}
 */
const component = async props => {
    const cities = props.data.search==''?
                   []:
                       await props.methods.commonFFB({path:'/app-common-module/COMMON_WORLDCITIES', 
                               method:'POST', 
                               authorization_type:'APP_ID', 
                               body:{  type:'FUNCTION',
                                       searchType:'SEARCH',
                                       searchString:props.data.search,
                                       IAM_data_app_id:props.data.data_app_id
                                   }
                           })
                           .then(result=>JSON.parse(result).rows);

    /**
     * @param {CommonAppEvent['target']} target
     */
    const eventClickSearchList = async target =>{
        const row = props.methods.commonMiscElementRow(target);
        if (row.classList.contains('common_map_control_expand_search_list_row')){
            const data = {  city:       row.getAttribute('data-city') ?? '',
                            country:    row.getAttribute('data-country') ??'',
                            latitude:   row.getAttribute('data-latitude') ?? '',
                            longitude:  row.getAttribute('data-longitude') ?? ''
                        };
            props.methods.goTo({latitude:data.latitude, longitude:data.longitude});
        }
    };
    /**
     * @name events
     * @descption Events for map
     * @function
     * @param {commonEventType} event_type
     * @param {CommonAppEvent} event
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.commonMiscElementId(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event_target_id=='common_map_control_expand_search_list':{
                        eventClickSearchList(event.target);
                        break;
                    }
                }
                break;
            }
        }
    };
    return {
        lifecycle:  null,
        data:   null,
        methods:null,
        events:events,
        template: template({records:cities})
};
};
export default component;