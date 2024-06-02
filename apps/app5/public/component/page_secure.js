/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;

/**
 *  
 * @param {{}} props 
 * @returns 
 */
const template = props => ` <div id='app_page_secure'>
                                <div id='app_page_secure_nav'>
                                    <div id='tab1' class='app_page_secure_tab common_link common_icon'></div>
                                    <div id='tab2' class='app_page_secure_tab common_link common_icon'></div>
                                    <div id='tab3' class='app_page_secure_tab common_link common_icon'></div>
                                </div>
                                <div id='app_page_secure_tab_content' class='app_bank_div <SPINNER_CLASS/>' >
                                </div>
                            </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          function_FFB:function}} props,
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    let spinner = `css_spinner'`;
    /**
     * @param {{}} props_template
     * @returns {string}
     */
    const render_template = props_template =>{
        return template(props_template)
                .replace('<SPINNER_CLASS/>', spinner);
    }
    const post_component = async () =>{
        spinner = '';        
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({});
        props.common_document.querySelector('#tab1').click();
        //props.common_document.querySelector('#tab1').dispatchEvent(new Event('click'));
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template({})
    };
}
export default component;