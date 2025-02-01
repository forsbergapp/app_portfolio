/**
 * Displays document with wrapped metadata divs header and footer
 *         
 * @module apps/common/component/common_document
 */
/**
 * @import {CommonModuleCommon, commonDocumentType, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_logo:string,
 *          app_copyright:string,
 *          app_name:string,
 *          document :string,
 *          documentType:commonDocumentType,
 *          document_href:string
 *          }} props
 * @returns {string}
 */
const template = props =>`  <div class='common_document_header' style='${props.app_logo==null?'':`background-image:url(${props.app_logo});`}'>${props.app_name}</div>
                               <div class='common_document_article ${props.documentType=='MODULE_CODE'?'common_markdown code':'common_markdown'}'>${
                                    props.documentType=='MODULE_CODE'?
                                        props.document
                                        .replaceAll('\r\n','\n').split('\n')
                                        .map((/**@type{string}*/row,/**@type{number}*/index)=>{
                                            const selected_class = (props.document_href.split('#line')[1] == (index+1).toString())?'code_line_selected':'';
                                            //split rows into two columns and highlight selected line if #line is used in link
                                            return `<div data-line='${index+1}' class='code_line ${selected_class}'>${index+1}</div><div data-line='${index+1}' class='code_text ${selected_class}'>${row.replaceAll('<','&lt;').replaceAll('>','&gt;')}</div>`;
                                        }).join('\n') ?? '':
                                            props.document
                                }</div>
                           <div class='common_document_footer'>${props.app_copyright}</div>`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      common_app_id:number
 *                      app_logo:string,
 *                      app_copyright:string,
 *                      app_name:string,
 *                      href:string,
 *                      title:string,
 *                      documentType:commonDocumentType
 *                      },
 *          methods:    {
 *                       COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonFFB:CommonModuleCommon['commonFFB']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    
    const onMounted = () =>{
        if (props.data.href.split('#')[1]){
            //set focus on highlighted row
            Array.from(props.methods.COMMON_DOCUMENT.querySelectorAll(`[data-line='${props.data.href.split('#line')[1]}'`))[0].setAttribute('tabindex',0);
            Array.from(props.methods.COMMON_DOCUMENT.querySelectorAll(`[data-line='${props.data.href.split('#line')[1]}'`))[0].focus();
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({app_logo:props.data.app_logo,
                      app_copyright:props.data.app_copyright,
                      app_name:props.data.app_name,
                      document:await props.methods.commonFFB({  path:'/app-module/COMMON_DOC', 
                                                                method:'POST', 
                                                                authorization_type:'APP_ID',
                                                                body:{  type:'FUNCTION',
                                                                        documentType:props.data.documentType,
                                                                        IAM_data_app_id:props.data.common_app_id,
                                                                        doc:(props.data.href.split('#').length>1?props.data.href.split('#')[0]:props.data.href)} })
                                                .catch(()=>null),
                      documentType:props.data.documentType,
                      document_href:props.data.href
                    })
    };
};
export default component;