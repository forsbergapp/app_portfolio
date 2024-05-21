/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;
const template =`   <div id='mapid'></div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_gps_popular_place' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_popular_place'>
                                <AppPlaces/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_gps_place' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_input_place' contentEditable='true' class='common_input'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_input_lat' contentEditable='true' class='common_input'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_input_long' contentEditable='true' class='common_input'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          AppPlaces:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    
    const render_template = () =>{
        return template
                    .replace('<AppPlaces/>',props.AppPlaces ?? '');
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default method;