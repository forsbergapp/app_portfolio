/**
 * @module apps/app5/src/functions/account_statement
 */

/**
 * @import {server} from '../../../../server/types.js'
 * @import {currency, metadata_account, bank_account, bank_transaction} from './types.js'
 */
const {server} = await import('../../../../server/server.js');
/**
 * @name IBAN_mod97
 * @description IBAN mod 97
 * @function
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
 * @name IBAN_getCheckDigit
 * @description IBAN get check digit
 * @function
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
 * @name IBAN_compose
 * @description IBAN compose with optional print format
 * @function
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
 * @name IBAN_validate
 * @description IBAN validate
 * @function
 * @param {string} iban 
 * @returns {boolean}
 */
const IBAN_validate = iban => {
    const reorderedString = iban.substring(4) + iban.substring(0, 4);
    const replacedString = reorderedString.replaceAll(/[a-z]{1}/gi, match =>(match.toUpperCase().charCodeAt(0) - 55).toString(),);
    return IBAN_mod97(replacedString) === 1;
};
/**
 * @name getStatement
 * @description Get bank statement
 * @function
 * @param {{app_id:number,
 *          data:{  iam_user_id:number,
 *                  data_app_id:number},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{ TitleSub	        :string,
 *                                                              Title	            :string,
 *                                                              BankAccountIban	    :string,
 *                                                              BankAccountNumber   :string,
 *                                                              Currency            :string,
 *                                                              CurrencyName        :string,
 *                                                              BankAccountBalance:number}[]}>}
 */
const getStatement = async parameters =>{

    /**@type{server['ORM']['Object']['AppDataEntity'] & {Id:number}} */
    const Entity            = server.ORM.db.AppDataEntity.get({   app_id:parameters.app_id, 
                                                    resource_id:null, 
                                                    data:{data_app_id:parameters.data.data_app_id}}).result[0];
    /**@type{server['server']['response'] & {result?:(server['ORM']['Object']['AppDataResourceDetailData'] & {Document:bank_transaction})[]}} */
    const transactions = server.ORM.db.AppDataResourceDetailData.get({app_id:parameters.app_id, 
                                                        resource_id:null, 
                                                        data:{  iam_user_id:parameters.data.iam_user_id,
                                                                data_app_id:parameters.data.data_app_id,
                                                                resource_name:'ACCOUNT',
                                                                resource_name_master_attribute:'CUSTOMER',
                                                                resource_name_data_master_attribute:null,
                                                                app_data_resource_detail_id:null,
                                                                app_data_entity_id:Entity.Id
                                                        }});
    /**@type{(server['ORM']['Object']['AppDataResourceMaster'] & {Document:metadata_account})[]}} */
    const AccountMetaData   = server.ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  iam_user_id:null,
                                                                    data_app_id:parameters.data.data_app_id,
                                                                    resource_name:'ACCOUNT',
                                                                    app_data_entity_id:Entity.Id
                                                            }}).result;
    /**@type{(server['ORM']['Object']['AppDataResourceDetail'] & {Document:bank_account})}} */
    const CustomerAccount   = server.ORM.db.AppDataResourceDetail.get(   {app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  iam_user_id:parameters.data.iam_user_id,
                                                                    data_app_id:parameters.data.data_app_id,
                                                                    resource_name:'ACCOUNT',
                                                                    app_data_resource_master_id:null,
                                                                    app_data_entity_id:Entity.Id
                                                            }}).result[0];
    /**@type{(server['ORM']['Object']['AppDataResourceMaster'] & {Document:currency})}} */
    const currency          = server.ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                            resource_id:null, 
                                                            data:{  iam_user_id:null,
                                                                    data_app_id:parameters.data.data_app_id,
                                                                    resource_name:'CURRENCY',
                                                                    app_data_entity_id:Entity.Id
                                                            }}).result[0];
    /**@type{number} */
    const balance = transactions.result.reduce((/**@type{number}*/balance, /**@type{{Document:bank_transaction}}*/current_row)=>balance += 
                                                                    (current_row.Document.AmountDeposit ?? current_row.Document.AmountWithdrawal) ?? 0,0) ?? 0;
    return {result:[{
                    //ENTITY ACCOUNT resource
                    TitleSub	            :Entity.Document?.Name??'',
                    //ACCOUNT resource
                    Title	                :AccountMetaData.filter((/**@type{*}*/row)=>'Title' in row.Document)[0].Document.Title.DefaultText,
                    BankAccountIban	        :IBAN_compose(  /**@ts-ignore */
                                                            Entity.Document?.CountryCode, 
                                                            Entity.Document?.BankId, 
                                                            CustomerAccount.Document.BankAccountNumber, true),
                    BankAccountNumber       :CustomerAccount.Document.BankAccountNumber,
                    Currency                :currency.Document.CurrencySymbol,
                    CurrencyName            :currency.Document.CurrencyName,
                    BankAccountBalance      :Number(balance)
            }], type:'JSON'};
}; 
export default getStatement;
export {IBAN_validate};