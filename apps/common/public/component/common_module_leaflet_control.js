/**
 * @module apps/common/component/common_module_leaflet_control
 */

/**
 * @param {{
 *          title_search:string,
 *          title_fullscreen:string,
 *          title_my_location:string,
 *          longitude : string, 
 *          latitude : string}} props
 */
const template = props =>` <div id='common_module_leaflet_control_search' class='common_module_leaflet_control_button' title='${props.title_search}' role='button'>
                            <div id='common_module_leaflet_control_search_button' class='common_icon'></div>
                            <div id='common_module_leaflet_control_expand_search' class='common_module_leaflet_control_expand'>
                                <div id='common_module_leaflet_select_country'></div>
                                <div id='common_module_leaflet_select_city'></div>
                                <div id='common_module_leaflet_search_input_row'>
                                    <div id='common_module_leaflet_search_input' contentEditable='true' class='common_input'/></div>
                                    <div id='common_module_leaflet_search_icon' class='common_icon'></div>
                                </div>
                                <div id='common_module_leaflet_search_list_wrap'>
                                    <div id='common_module_leaflet_search_list'></div>
                                </div>
                            </div>
                        </div>
                        <div id='common_module_leaflet_control_fullscreen_id' class='common_module_leaflet_control_button common_icon' title='${props.title_fullscreen}' role='button'></div>
                        ${(props.longitude == '' && props.latitude=='')?'':
                            `<div   id='common_module_leaflet_control_my_location_id' 
                                    class='common_module_leaflet_control_button common_icon' 
                                    title='${props.title_my_location}' role='button'>
                            </div>`
                        }
                        <div id='common_module_leaflet_control_layer' class='common_module_leaflet_control_button' title='Layer' role='button'>
                            <div id='common_module_leaflet_control_layer_button' class='common_icon'></div>
                            <div id='common_module_leaflet_control_expand_layer' class='common_module_leaflet_control_expand'>
                                <div id='common_module_leaflet_select_mapstyle' ></div>
                            </div>
                        </div>`;
/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      data_app_id:number,
 *                      locale:string,
 *                      longitude:string,
 *                      latitude:string,
 *                      map_layer:string,
 *                      map_layers:import('../../../common_types.js').CommonModuleLeafletMapLayer_array[]},
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender'],
 *                      map_country:import('../../../common_types.js').CommonModuleCommon['map_country'],
 *                      map_city_empty:import('../../../common_types.js').CommonModuleCommon['map_city_empty'],
 *                      FFB:import('../../../common_types.js').CommonModuleCommon['FFB'],
 *                      function_search_event:function,
 *                      map_setstyle:import('../../../common_types.js').CommonModuleCommon['map_setstyle'],
 *                      moduleLeafletContainer:function
 *                      },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:  null,
 *                      methods:null,
 *                      template:null}>}
 */
const component = async props => {
    
    const onMounted = async () =>{
        

        //mount custom code inside Leaflet container
        props.methods.common_document.querySelectorAll(`#${props.data.common_mountdiv} #${props.methods.moduleLeafletContainer()._container.id} .leaflet-control`)[0].innerHTML += 
            template({
                        title_search:'Search',
                        title_fullscreen:'Fullscreen',
                        title_my_location:'My location',
                        longitude :props.data.latitude,
                        latitude :props.data.longitude
                    });
        //country
        await props.methods.ComponentRender({
            mountDiv:   'common_module_leaflet_select_country', 
            data:       {
                        default_data_value:'',
                        default_value:'...',
                        options:await props.methods.map_country(props.data.locale),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:null,
            path:'/common/component/common_select.js'});
        //cities, caal function that sets empty record
        props.methods.map_city_empty();

        //map layers
        await props.methods.ComponentRender({
            mountDiv:   'common_module_leaflet_select_mapstyle', 
            data:       {
                        default_data_value:props.data.map_layers[0].value,
                        default_value:props.data.map_layers[0].display_data,
                        options:props.data.map_layers,
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {FFB:null},
            lifecycle:null,
            path:'/common/component/common_select.js'});
        
        if (props.methods.function_search_event){
            //add search function in data-function that event delegation will use            
            props.methods.common_document.querySelector('#common_module_leaflet_search_input')['data-function'] = props.methods.function_search_event;
        }
        //set additonal settings on rendered Leaflet module
        props.methods.map_setstyle(props.data.map_layer);
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: null
    };
};
export default component;