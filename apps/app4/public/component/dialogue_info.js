/**
 * Displays dialogue info
 * @module apps/app4/component/dialogue_info
 */
/**
 * @import {COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{about_logo:String,
 *          app_copyright:string,
 *          app_link_title:string,
 *          info_link1:string,
 *          info_link2:string,
 *          info_link3:string
 * }} props
 * @returns {string}
 */
const template = props => ` <div id='about_logo' style='${props.about_logo==null?'':`background-image:url(${props.about_logo});`}'></div>
                            <div id='app_copyright'>${props.app_copyright}</div>
                            <div id='app_link' class='common_link'>${props.app_link_title}</div>
                            <div id='info_link1' class='common_link'>${props.info_link1}</div>
                            <div id='info_link2' class='common_link'>${props.info_link2}</div>
                            <div id='info_link3' class='common_link'>${props.info_link3}</div>
                            <div id='info_close' class='common_dialogue_button common_icon' ></div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      about_logo:string,
 *                      app_copyright:string,
 *                      app_link_url:string,
 *                      app_link_title: string,
 *                      info_link_policy_name:string,
 *                      info_link_disclaimer_name:string,
 *                      info_link_terms_name:string
 *                      },
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null,
 *                      methods:null, 
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_dialogue_show0');
    props.methods.COMMON_DOCUMENT.querySelector('#dialogues').classList.add('common_dialogues_modal');
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({  about_logo:props.data.about_logo,
                                app_copyright:props.data.app_copyright,
                                app_link_title:props.data.app_link_title,
                                info_link1:props.data.info_link_policy_name,
                                info_link2:props.data.info_link_disclaimer_name,
                                info_link3:props.data.info_link_terms_name
        })
    };
};
export default component;