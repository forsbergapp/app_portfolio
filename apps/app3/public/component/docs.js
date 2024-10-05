/**
 * @module apps/app3/component/docs
 */
/**
 * @param {{docs:[{id:number, doc_type:'URL'|'IMAGE', doc_url:string, doc_image:string, doc_image_small:string, doc_title:string}]}} props
 */
const template = props => ` ${props.docs.map(doc=>
                                `<div class='doc_list_item common_row'>
                                    <div id='doc_${doc.id}' data-type='${doc.doc_type}' data-url='${doc.doc_url}' class='doc_list_item_image' style='background-image:url("${doc.doc_image_small}")'></div>
                                    <div class='doc_list_item_title'>${doc.doc_title}</div>
                                </div>`
                            ).join('')
                            }`;
/**
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      docs:[{ id:number, 
 *                              doc_type:'URL'|'IMAGE', 
 *                              doc_url:string, 
 *                              doc_image:string, 
 *                              doc_image_small:string, 
 *                              doc_title:string}]
 *                      },
 *          methods:    {COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT}}} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({docs:props.data.docs})
    };
};
export default component;