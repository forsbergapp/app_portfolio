/**
 * Displays document with wrapped metadata divs header and footer
 *         
 * @module apps/common/component/common_document
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 */

/**
 * @param {{app_logo:string,
*          app_copyright:string,
*          app_name:string,
*          document :string,
*          document_class:string
*          }} props
* @returns {string}
*/
const template = props =>`  <div class='common_document_header' style='background-image:url("${props.app_logo}")'>${props.app_name}</div>
                               <div class='common_document_article ${props.document_class ?? ''}'>
                                   ${props.document}
                               </div>
                           <div class='common_document_footer'>${props.app_copyright}</div>`;
/**
* 
* @param {{data:       {
*                      commonMountdiv:string,
*                      common_app_id:number
*                      app_logo:string,
*                      app_copyright:string,
*                      app_name:string,
*                      href:string,
*                      title:string,
*                      type:'APP'|'GUIDE'|'JSDOC'
*                      },
*          methods:    {
*                       COMMON_DOCUMENT:COMMON_DOCUMENT,
*                       commonFFB:commonFFB
*                      }}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:   null,
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
    let classname = '';
    let content = await props.methods.commonFFB({path:'/app-module-function/COMMON_DOC', 
                                            method:'POST', 
                                            authorization_type:'APP_DATA',
                                            body:{  type:props.data.type,
                                                    data_app_id:props.data.common_app_id,
                                                    doc:(props.data.href.split('#').length>1?props.data.href.split('#')[0]:props.data.href)} })
                            .then(result=>JSON.parse(result).rows[0])
                            .catch(()=>null);
    if (props.data.type=='JSDOC'){
        const content_element = props.methods.COMMON_DOCUMENT.createElement('div');
        content_element.innerHTML = content;
        if (content_element.querySelector('.prettyprint.source')){
            //Code
            classname = 'code';
            content_element.innerHTML = `<div id='content_title'>${props.data.title}</div>`+ 
                                            content_element.querySelector('code').textContent.replaceAll('\r\n','\n').split('\n')
                                            .map((/**@type{string}*/row,/**@type{number}*/index)=>
                                                `<div data-line='${index+1}' class='code_line'>${index+1}</div><div data-line='${index+1}' class='code_text'>${row.replaceAll('<','&lt').replaceAll('>','&gt')}</div>`).join('\n') ?? '';
            //highlight selected line if # is used in link
            if (props.data.href.split('#')[1])
                Array.from(content_element.querySelectorAll(`[data-line='${props.data.href.split('#line')[1]}'`)).forEach((/**@type{HTMLDivElement}*/element) => element.classList.add('code_line_selected'));
            content = content_element.innerHTML;
        }
        else{
            //Module
            //can contain @example JSDoc tags with html code tags
            //replace all <code></code> tags with <div class='code'></div>
            content =   `<div id='content_title'>${props.data.title}</div>`+ content_element.innerHTML.replaceAll('<code>','<div class=\'code\'>').replaceAll('</code>','</div>');
        }
    }
    else
        classname = 'common_markdown';
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({app_logo:props.data.app_logo,
                      app_copyright:props.data.app_copyright,
                      app_name:props.data.app_name,
                      document:content,
                      document_class:classname
                    })
    };
};
export default component;