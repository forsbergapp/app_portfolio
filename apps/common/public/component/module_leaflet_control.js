/**
 * @typedef {{  id:number,
 *              description:string,
 *              display_data:string,
 *              value:string,
 *              data:string,
 *              data2:string,
 *              data3:string,
 *              data4:string,
 *              session_map_layer:*}} type_map_layer_array
 * 
 */
/**@type{{querySelector:function, querySelectorAll:function}} */
const AppDocument = document;
const template =`   <div id='common_module_leaflet_control_search' class='common_module_leaflet_control_button' title='<TITLE_SEARCH/>' role='button'>
                        <div id='common_module_leaflet_control_search_button' class='common_icon'></div>
                        <div id='common_module_leaflet_control_expand_search' class='common_module_leaflet_control_expand'>
                            <select id='common_module_leaflet_select_country'>
                                <COUNTRIES/>
                            </select>
                            <select id='common_module_leaflet_select_city'  >
                                <option value='' id='' label='…'>…</option>
                            </select>
                            <div id='common_module_leaflet_search_input_row'>
                                <div id='common_module_leaflet_search_input' contentEditable='true' class='common_input'/></div>
                                <div id='common_module_leaflet_search_icon' class='common_icon'></div>
                            </div>
                            <div id='common_module_leaflet_search_list_wrap'>
                                <div id='common_module_leaflet_search_list'></div>
                            </div>
                        </div>
                    </div>
                    <div id='common_module_leaflet_control_fullscreen_id' class='common_module_leaflet_control_button common_icon' title='<TITLE_FULLSCREEN/>' role='button'></div>
                    <LOCATION/>
                    <div id='common_module_leaflet_control_layer' class='common_module_leaflet_control_button' title='Layer' role='button'>
                        <div id='common_module_leaflet_control_layer_button' class='common_icon'></div>
                        <div id='common_module_leaflet_control_expand_layer' class='common_module_leaflet_control_expand'>
                            <select id='common_module_leaflet_select_mapstyle' >
                                <MAP_LAYER_OPTIONS/>
                            </select>
                        </div>
                    </div>`;
const template_location = `<div id='common_module_leaflet_control_my_location_id' class='common_module_leaflet_control_button common_icon' title='<TITLE_MY_LOCATION/>' role='button'></div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          data_app_id:number,
 *          locale:string,
 *          longitude:string,
 *          latitude:string,
 *          map_layer:string,
 *          map_layers:type_map_layer_array[],
 *          function_FFB:function,
 *          function_search_event:function,
 *          function_SearchAndSetSelectedIndex:function,
 *          function_map_setstyle:function,
 *          function_map_country:function,
 *          module_leaflet_container:string}} props 
 * @returns {Promise.<{ props:{function_post:function|null}, 
 *                      data:  null,
 *                      template:null}>}
 */
const component = async props => {
    /* 
        How to call 
        const custom_data = 
            ComponentRender('mapid', //outer app div
                        {   
                            data_app_id:number,
                            locale:string,
                            longitude:string,
                            latitude:string,
                            function_FFB:common.FFB,
                            function_search_event:[function] / null,
                            function_SearchAndSetSelectedIndex:common.SearchAndSetSelectedIndex,
                            function_map_setstyle:common.map_setstyle,
                            function_map_country:common.map_country,
                            //module parameter
                            module_leaflet_container:leaflet_data.leaflet_container,    //inner Leaflet div returned from Leaflet
                            },
                        '/component/module_leaflet_control.js');
        COMMON_GLOBAL.module_leaflet_map_styles =   custom_data.map_layer_array;
    */
    /**
     * 
     * @returns {string}
     */
    const get_map_layers = ()  =>{
                            
        let map_layer_options ='';

        for (const map_layer_option of props.map_layers){
            map_layer_options +=`<option id=${map_layer_option.id} value='${map_layer_option.value}'>${map_layer_option.display_data}</option>`;
        }
        return map_layer_options;
    }
    const render_template = async () =>{
        const template_result = template
                                .replace('<TITLE_SEARCH/>',         'Search')
                                .replace('<TITLE_FULLSCREEN/>',     'Fullscreen')
                                .replace('<COUNTRIES/>',            await props.function_map_country(props.locale))
                                .replace('<MAP_LAYER_OPTIONS/>',    get_map_layers())
                                .replace('<LOCATION/>',             (props.longitude == '' && props.latitude=='')?'':
                                                                        template_location.replace('<TITLE_MY_LOCATION/>',    'My location'));
        return template_result;
    }
    
    //mount custom code inside Leaflet container
    props.common_document.querySelectorAll(`#${props.common_mountdiv} #${props.module_leaflet_container} .leaflet-control`)[0].innerHTML += await render_template();
    const post_component = async () =>{
        if (props.function_search_event){
            //add search function in data-function that event delegation will use
            props.common_document.querySelector('#common_module_leaflet_search_input')['data-function'] = props.function_search_event;
        }
        //set additonal settings on rendered Leaflet module
        props.function_map_setstyle(props.map_layer);
        //set map layer 
        props.function_SearchAndSetSelectedIndex(props.map_layer, AppDocument.querySelector('#common_module_leaflet_select_mapstyle'),1);
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: null
    };
}
export default component;