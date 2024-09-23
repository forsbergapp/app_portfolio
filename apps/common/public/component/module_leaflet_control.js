/**
 * @module apps/common/component/module_leaflet_control
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
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          data_app_id:number,
 *          locale:string,
 *          longitude:string,
 *          latitude:string,
 *          map_layer:string,
 *          map_layers:import('../../../common_types.js').CommonModuleLeafletMapLayer_array[],
 *          module_leaflet_container:string,
 *          function_ComponentRender:function,
 *          function_map_country:function,
 *          function_map_city_empty:function,
 *          function_FFB:function,
 *          function_search_event:function,
 *          function_map_setstyle:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:  null,
 *                      template:null}>}
 */
const component = async props => {
    
    const post_component = async () =>{
        

        //mount custom code inside Leaflet container
        props.common_document.querySelectorAll(`#${props.common_mountdiv} #${props.module_leaflet_container} .leaflet-control`)[0].innerHTML += 
            template({
                        title_search:'Search',
                        title_fullscreen:'Fullscreen',
                        title_my_location:'My location',
                        longitude :props.latitude,
                        latitude :props.longitude
                    });
        //country
        await props.function_ComponentRender('common_module_leaflet_select_country', 
            {
                default_data_value:'',
                default_value:'...',
                options:await props.function_map_country(props.locale),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        //cities, caal function that sets empty record
        props.function_map_city_empty();

        //map layers
        await props.function_ComponentRender('common_module_leaflet_select_mapstyle', 
            {
                default_data_value:props.map_layers[0].value,
                default_value:props.map_layers[0].display_data,
                options:props.map_layers,
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'display_data',
                function_FFB:null
            }, '/common/component/select.js');
        
        if (props.function_search_event){
            //add search function in data-function that event delegation will use            
            props.common_document.querySelector('#common_module_leaflet_search_input')['data-function'] = props.function_search_event;
        }
        //set additonal settings on rendered Leaflet module
        props.function_map_setstyle(props.map_layer);
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: null
    };
};
export default component;