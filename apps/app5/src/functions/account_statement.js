/** @module apps/app5 */

/**
 * IBAN mod 97
 * @param {string} str 
 * @returns {number}
 */
 const IBAN_mod97 = str => {
    const first9 = str.substring(0, 9);
    const remainingStr = str.substring(9);
    const remainder = Number(first9) % 97; 
    const newString = remainder.toString() + remainingStr;
    if (newString.length > 2)
        return IBAN_mod97(newString);
    return remainder;};

/**
 * IBAN get check digit
 * @param {string} country_code 
 * @param {string} bban 
 * @returns {number}
 */
const IBAN_getCheckDigit = (country_code, bban) => {
    const checkstring = bban + (country_code.charCodeAt(0) - 55) + (country_code.charCodeAt(1) - 55); 
    for(let digit=0; digit<99;digit++){
        const remainder = IBAN_mod97(checkstring + digit.toString().padStart(2,'0')); 
        if (remainder == 1)
            return digit;
    }
    return -1;
};
/**
 * IBAN compose with optional print format
 * @param {string} country_code 
 * @param {string} bank_id 
 * @param {string} account_number 
 * @param {boolean} print_format 
 * @returns {string}
 */
const IBAN_compose = (country_code, bank_id, account_number, print_format=false) => {
    const bban = bank_id.toString() + account_number.toString();
    if (print_format){
        const bban_print_string = bban.toString().match(/.{0,4}/g);
        if (bban_print_string)
            return country_code.toUpperCase() + IBAN_getCheckDigit(country_code, bban).toString() + ' ' + bban_print_string.join(' ');
        else
            return country_code.toUpperCase() + IBAN_getCheckDigit(country_code, bban).toString() + ' ' + '';
    }
    else
        return country_code.toUpperCase() + IBAN_getCheckDigit(country_code, bban) + bban.toString();
};
/**
 * IBAN validate
 * @param {string} iban 
 * @returns {boolean}
 */
const IBAN_validate = iban => {
    const reorderedString = iban.substring(4) + iban.substring(0, 4);
    const replacedString = reorderedString.replaceAll(/[a-z]{1}/gi, match =>(match.toUpperCase().charCodeAt(0) - 55).toString(),);
    return IBAN_mod97(replacedString) === 1;
};
/**
 * 
 * @param {number} app_id 
 * @param {*} data 
 * @param {string} ip
 * @param {string} locale
 */
const getStatement = async (app_id, data, ip, locale) =>{

    /**@type{import('../../../../server/db/sql/app_data_entity.service.js')} */
    const {get:EntityGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_entity.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_master.service.js')} */
    const {get:MasterGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_master.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_detail.service.js')} */
    const {get:DetailGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail.service.js`);

    /**@type{import('../../../../server/db/sql/app_data_resource_detail_data.service.js')} */
    const {get:TransactionsGet} = await import(`file://${process.cwd()}/server/db/sql/app_data_resource_detail_data.service.js`);

    const transactions = await TransactionsGet(app_id, null, null, data.user_account_id, data.data_app_id, 
                                                'RESOURCE_TYPE', 'ACCOUNT', 
                                                'RESOURCE_TYPE', 'CUSTOMER',
                                                null, null, null, null, false);

    const Entity            = await EntityGet(app_id, null, data.data_app_id, null)
                                        .then(result=>JSON.parse(result[0].json_data));

    const AccountMetaData   = await MasterGet(app_id, null, null, data.data_app_id, 'ACCOUNT', null, null, true)
                                    .then(result=>result.map((/**@type{*}*/row)=>JSON.parse(row.json_data)));
    const CustomerAccount   = await DetailGet(app_id, null, null, data.user_account_id, data.data_app_id, 'ACCOUNT', null, null, false)
                                        .then(result=>JSON.parse(result[0].json_data));
    const currency          = await MasterGet(app_id, null, null, data.data_app_id, 'CURRENCY', null, locale, true).then(result=>JSON.parse(result[0].json_data));
    //amount_deposit and amount_withdrawal from JSON.parse(json_data) column, each app is responsible for APP_DATA json_data content
    const balance = transactions.reduce((balance, current_row)=>balance += 
                                                                    /**@ts-ignore */
                                                                    (current_row.amount_deposit ?? current_row.amount_withdrawal) ?? 0,0);
    return [{
                    //ENTITY ACCOUNT resource
                    title_sub	            :Entity.name,
                    //ACCOUNT resource
                    /**@ts-ignore */
                    title	                :AccountMetaData.filter((/**@type{*}*/row)=>'title' in row)[0].title.default_text,
                    bank_account_iban	    :IBAN_compose(Entity.country_code, Entity.bank_id, CustomerAccount.bank_account_number, true),
                    bank_account_number     :CustomerAccount.bank_account_number,
                    /**@ts-ignore */
                    currency                :currency.currency_symbol,
                    /**@ts-ignore */
                    currency_name           :currency.currency_name,
                    bank_account_balance    :Number(balance)
            }];
}; 
export default getStatement;
export {IBAN_validate};