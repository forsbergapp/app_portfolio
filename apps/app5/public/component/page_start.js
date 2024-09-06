/**
 * @module apps/app5/component/page_start
 */

/**
 *  
 * @param {{text_account:string,
 *          text_statements:string,
 *          text_directpayment:string,
 *          text_iso:string}} props 
 * @returns 
 */
const template = props => ` <div id='app_page_start_divs'>
                                <div class='app_page_start_divs_row'>
                                    <div id='app_page_start_bank_account' class='app_page_start_bank_div app_bank_div'>${props.text_account}</div>
                                    <div id='app_page_start_bank_statements' class='app_page_start_bank_div app_bank_div'>${props.text_statements}</div>
                                </div>
                                <div class='app_page_start_divs_row'>
                                    <div id='app_page_start_bank_directpayment' class='app_page_start_bank_div app_bank_div'>${props.text_directpayment}</div>
                                    <div id='app_page_start_bank_iso' class='app_page_start_bank_div app_bank_div'>${props.text_iso}</div>
                                </div>
                            </div>`;
/**
 * 
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    props;
    /**
     * @param {{text_account:string,
     *          text_statements:string,
     *          text_directpayment:string,
     *          text_iso:string}} props_template
     * @returns {string}
     */
    const render_template = props_template =>{
        return template(props_template);
    };
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template({ text_account:'BANK ACCOUNT',
                                    text_statements:'BANK STATEMENTS',
                                    text_directpayment:'DIRECT PAYMENT',
                                    text_iso:'ISO STANDARDS'})
    };
};
export default component;