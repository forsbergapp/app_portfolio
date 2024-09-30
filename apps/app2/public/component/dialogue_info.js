/**
 * @module apps/app2/component/dialogue_info
 */
/**
 * @param {{app_copyright:string,
 *          info_link1:string,
 *          info_link2:string,
 *          info_link3:string,
 *          info_link4:string,
 * }} props
 */
const template = props => ` <div id='about_logo'></div>
                            <div id='app_copyright'>${props.app_copyright}</div>
                            <div id='app_link' class='common_link'></div>
                            <div id='info_link1' class='common_link'>${props.info_link1}</div>
                            <div id='info_link2' class='common_link'>${props.info_link2}</div>
                            <div id='info_link3' class='common_link'>${props.info_link3}</div>
                            <div id='info_link4' class='common_link'>${props.info_link4}</div>
                            <div id='info_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      about_logo:string,
 *                      app_copyright:string,
 *                      app_link_url:string,
 *                      app_link_title: string,
 *                      info_link_policy_name:string,
 *                      info_link_disclaimer_name:string,
 *                      info_link_terms_name:string,
 *                      info_link_about_name:string
 *                      },
 *          methods:    {common_document:import('../../../common_types.js').CommonAppDocument}}} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:null,
 *                      methods:null, 
 *                      template:string}>}
 */
const method = async props => {
    props.methods.common_document.querySelector(`#${props.data.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.methods.common_document.querySelector('#dialogues').classList.add('common_dialogues_modal');
    const onMounted = async () =>{
        if ((props.data.app_link_url ?? '')=='')
            props.methods.common_document.querySelector('#about_logo').style.backgroundImage=`url(${props.data.about_logo})`;
        else
            props.methods.common_document.querySelector('#app_link').innerHTML = props.data.app_link_title;
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({app_copyright:props.data.app_copyright,
                            info_link1:props.data.info_link_policy_name,
                            info_link2:props.data.info_link_disclaimer_name,
                            info_link3:props.data.info_link_terms_name,
                            info_link4:props.data.info_link_about_name
        })
    };
};
export default method;