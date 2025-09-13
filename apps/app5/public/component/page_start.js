/**
 * Displays page start
 * @module apps/app5/component/page_start
 */

/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{text_account:string,
 *          text_statements:string,
 *          text_directpayment:string,
 *          text_iso:string}} props 
 * @returns {string}
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
        template:   template({  text_account:'BANK ACCOUNT',
                                text_statements:'BANK STATEMENTS',
                                text_directpayment:'DIRECT PAYMENT',
                                text_iso:'ISO STANDARDS'})
    };
};
export default component;