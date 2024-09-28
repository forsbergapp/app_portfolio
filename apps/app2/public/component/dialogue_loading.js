/**
 * @module apps/app2/component/dialogue_loading
 */

const template = () => ' <div id=\'dialogue_loading_content\'></div>';
/**
 * 
 * @param {{data:       {common_mountdiv:string},
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument},
 *          lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:{onMounted:function},
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.methods.common_document.querySelector('#dialogues').classList.add('common_dialogues_modal');

    const onMounted = async () =>{
        props.methods.common_document.querySelector('#dialogue_loading_content').classList.add('css_spinner');
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template()
    };
};
export default method;