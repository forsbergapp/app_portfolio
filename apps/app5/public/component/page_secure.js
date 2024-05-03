/**@type{{querySelector:function}} */
const AppDocument = document;
/**
 * @typedef {{  date:string,
 *              time:string,
 *              logo:string,
 *              origin:string,
 *              amount_deposit:number|null,
 *              amount_withdrawal:number|null}} transaction_type
 */
/**
 *  
 * @param {{bank_name:string,
 *          bank_account:string,
 *          bank_statement_date:string,
 *          bank_currency_symbol:string,
 *          bank_currency_text:string,
 *          function_account_balance:function,
 *          function_format_number:function,
 *          transactions:transaction_type[]|[]}} props 
 * @returns 
 */
const template = props => ` <div id='app_page_secure_account' class='app_bank_div'>
                                <div id='app_page_secure_bank_statement_row'>
                                    <div class='app_page_secure_bank_statement_col'>
                                        <div id='app_page_secure_account'>${props.bank_account}</div>
                                        <div id='app_page_secure_statement_date'>${props.bank_statement_date}</div>
                                        <div id='app_page_secure_balance'>${props.transactions.length>0? 
                                                                                props.bank_currency_symbol + 
                                                                                props.function_format_number(props.function_account_balance(props.transactions)):''}</div>
                                        <div id='app_page_secure_currency'>${props.bank_currency_text}</div>
                                        <div id='app_page_secure_refresh' class='common_reload common_link'></div>
                                    </div>
                                    <div class='app_page_secure_bank_statement_col'>
                                        <div id='app_page_secure_bank_name'>${props.bank_name}</div>
                                    </div>
                                </div>
                                <div id='app_page_secure_transactions'>
                                    <div id='app_page_secure_transactions_search' class='common_search'>
                                        <div id='app_page_secure_transactions_search_input' contenteditable='true' class='common_input common_search_input'></div>
                                        <div id='app_page_secure_transactions_search_icon' class='common_icon common_search_icon'> </div>
                                    </div>
                                    <div id='app_page_secure_transactions_title_row'>
                                        <div id='app_page_secure_transactions_title_date'></div>
                                        <div id='app_page_secure_transactions_title_time'></div>
                                        <div id='app_page_secure_transactions_title_logo'></div>
                                        <div id='app_page_secure_transactions_title_origin'></div>
                                        <div id='app_page_secure_transactions_title_amount_deposit'></div>
                                        <div id='app_page_secure_transactions_title_amount_withdrawal'></div>
                                    </div>
                                    <div id='app_page_secure_transactions_list' <SPINNER_CLASS/>>
                                        ${props.transactions.map(row=>
                                            `<div class='app_page_secure_transactions_row'>
                                                <div class='app_page_secure_transactions_date'>${row.date}</div>
                                                <div class='app_page_secure_transactions_time'>${row.time}</div>
                                                <div class='app_page_secure_transactions_logo'>${row.logo}</div>
                                                <div class='app_page_secure_transactions_origin'>${row.origin}</div>
                                                <div class='app_page_secure_transactions_amount_deposit'>${props.function_format_number(row.amount_deposit)}</div>
                                                <div class='app_page_secure_transactions_amount_withdrawal'>${props.function_format_number(row.amount_withdrawal)}</div>
                                            </div>`
                                            ).join('')
                                        }
                                    </div>
                                </div>
                            </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          locale:string,
 *          app_data_bank_id:number,
 *          app_data_bank_name:string,
 *          app_data_bank_country_code:string,
 *          app_data_bank_account_currency: string,
 *          app_data_bank_account_currency_name:string,
 *          app_data_customer_bban:string,
 *          user_timezone:string,
 *          function_IBAN_compose:function,
 *          function_FFB:function}} props,
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const component = async props => {
    let spinner = `class='css_spinner'`;
    /**
     * 
     * @param {number} value 
     * @returns {string}
     */
    const format_number = value => value?value.toLocaleString(props.locale).padStart(2,(0).toLocaleString(props.locale)):'';
    
    /**
     * 
     * @param {transaction_type[]} transactions 
     * @returns {number}
     */
    const account_balance = transactions => transactions.reduce((balance, current_row)=>balance += (current_row.amount_deposit ?? current_row.amount_withdrawal) ?? 0,0)
    /**
     * @param {{bank_name:string,
     *          bank_account:string,
     *          bank_statement_date:string,
     *          bank_currency_symbol:string,
     *          bank_currency_text:string,
     *          function_account_balance:function, 
     *          function_format_number:function,
     *          transactions:transaction_type[]|[]}} props_template
     * @returns {string}
     */
    const render_template = props_template =>{
        return template(props_template)
                .replace('<SPINNER_CLASS/>', spinner);
    }
    const post_component = async () =>{
        let path = '';
        spinner = '';
        //demo transactions
        let transactions = [];
        //create 10 random generated transactions
        for (const dummy of Array(30)){
            const new_date = new Date();
            const transaction_date = new Date(	new_date.getUTCFullYear(),new_date.getUTCMonth(),new_date.getUTCDate())
                                        .toLocaleString(props.locale, {timeZone: 'UTC', year:'numeric', month:'numeric', day:'numeric'});
            const transaction_time = new Date(	new_date.getUTCFullYear(),new_date.getUTCMonth(),new_date.getUTCDate(), new_date.getUTCHours(), new_date.getUTCMinutes())
                                        .toLocaleString(props.locale, {timeZone: 'UTC', hour:'numeric', hour12:false, minute:'2-digit'});
            const amount = Number((10000 + Math.random() * 10000).toFixed(2));
            const deposit_withdrawal = (0 + Math.random() * 1)>1/2;
            transactions.push(
                {date:transaction_date, time:transaction_time,logo:'',origin:'ORIGIN ' + Math.random().toString(36).substring(2),amount_deposit:deposit_withdrawal?amount:null,amount_withdrawal:deposit_withdrawal?null:amount},
            );
            //delay 10 ms
            await new Promise ((resolve)=>{setTimeout(()=> resolve(null),10)});
        }
        //const transactions = await props.function_FFB('DB_API', path, 'GET', 'APP_DATA', null)
        //                                    .then((/**@type{string}*/result)=>JSON.parse(result))
        //                                    .catch((/**@type{Error}*/error)=>{throw error});
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = 
            render_template({   bank_name:                  props.app_data_bank_name,
                                bank_account:               props.function_IBAN_compose(props.app_data_bank_country_code, props.app_data_bank_id, props.app_data_customer_bban, true),
                                bank_statement_date:        new Date().toLocaleString(props.locale, {timeZone: props.user_timezone, year:'numeric', month:'numeric', day:'numeric'}),
                                bank_currency_symbol:       props.app_data_bank_account_currency,
                                bank_currency_text:         props.app_data_bank_account_currency_name,
                                function_account_balance:   account_balance,
                                function_format_number:     format_number,
                                transactions:               transactions});
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template({ bank_name:'',
                                    bank_account:'',
                                    bank_statement_date:'',
                                    bank_currency_symbol: '',
                                    bank_currency_text:'',
                                    function_account_balance:account_balance,
                                    function_format_number:format_number,
                                    transactions:[]})
    };
}
export default component;