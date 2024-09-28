/**
 * @module apps/app3/component/docs
 */
/**
 * @param {{docs:[{id:number, doc_url:string, doc_url_small:string, doc_title:string}]}} props
 */
const template = props => ` ${props.docs.map(doc=>
                                `<div class='doc_list_item common_row'>
                                    <div id='doc_${doc.id}' data-full_size='${doc.doc_url}' class='doc_list_item_image' style='background-image:url("${doc.doc_url_small}")'></div>
                                    <div class='doc_list_item_title'>${doc.doc_title}</div>
                                </div>`
                            ).join('')
                            }`;
/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      docs:[{id:number, doc_url:string, doc_url_small:string, doc_title:string}]
 *                      },
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:{onMounted:null}, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    return {
        lifecycle:  {onMounted:null},
        data:   null,
        methods:null,
        template: template({docs:props.data.docs})
    };
};
export default component;