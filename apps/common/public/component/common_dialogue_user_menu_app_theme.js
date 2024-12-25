/**
 * Displays user menu app theme
 * @module apps/common/component/common_dialogue_user_menu_app_theme
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 * @typedef {CommonModuleCommon['commonMiscThemeDefaultList']} commonMiscThemeDefaultList
 */

/**
 * @name template
 * @description Template
 * @function
 * @returns {string}
 */
const template = () => '';
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      commonMiscThemeDefaultList:commonMiscThemeDefaultList,
 *                      commonComponentRender:commonComponentRender,
 *                      app_theme_update:function}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const themes = props.methods.commonMiscThemeDefaultList();

    const onMounted = async () =>{
        await props.methods.commonComponentRender({
            mountDiv:   props.data.commonMountdiv, 
            data:       {
                        default_data_value:themes[0].VALUE,
                        default_value:themes[0].TEXT,
                        options:themes,
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'VALUE',
                        column_text:'TEXT'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //set app theme
        props.methods.app_theme_update();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;