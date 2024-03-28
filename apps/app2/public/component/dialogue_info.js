/**@type{{querySelector:function}} */
const AppDocument = document;
const template =`   <div id='about_logo'></div>
                    <div id='app_copyright'><APP_COPYRIGHT/></div>
                    <div id='app_link' class='common_link'></div>
                    <div id='info_link1' class='common_link'><INFO_LINK1/></div>
                    <div id='info_link2' class='common_link'><INFO_LINK2/></div>
                    <div id='info_link3' class='common_link'><INFO_LINK3/></div>
                    <div id='info_link4' class='common_link'><INFO_LINK4/></div>
                    <div id='info_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          about_logo:string,
 *          app_copyright:string,
 *          app_link_url:string,
 *          app_link_title: string,
 *          info_link_policy_name:string,
 *          info_link_disclaimer_name:string,
 *          info_link_terms_name:string,
 *          info_link_about_name:string}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    props.common_document.querySelector(`#${props.common_mountdiv}`).classList.add('common_dialogue_show0');
    props.common_document.querySelector('#dialogues').classList.add('common_dialogues_modal');
    const render_template = () =>{
        return template
                .replace('<APP_COPYRIGHT/>',props.app_copyright)
                .replace('<INFO_LINK1/>',   props.info_link_policy_name)
                .replace('<INFO_LINK2/>',   props.info_link_disclaimer_name)
                .replace('<INFO_LINK3/>',   props.info_link_terms_name)
                .replace('<INFO_LINK4/>',   props.info_link_about_name)
    }
    const post_component = () =>{
        if ((props.app_link_url ?? '')=='')
            AppDocument.querySelector('#about_logo').style.backgroundImage=`url(${props.about_logo})`;
        else
            AppDocument.querySelector('#app_link').innerHTML = props.app_link_title;
    }
    return {
        props:  {function_post:post_component},
        data:   null,
        template: render_template()
    };
}
export default method;