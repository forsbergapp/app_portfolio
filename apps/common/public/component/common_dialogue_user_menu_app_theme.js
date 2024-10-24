/**
 * @module apps/common/component/common_dialogue_user_menu_app_theme
 */

const template = () => '';
/**
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {
 *                      COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      commonThemeDefaultList:import('../../../common_types.js').CommonModuleCommon['commonThemeDefaultList'],
 *                      commonComponentRender:import('../../../common_types.js').CommonModuleCommon['commonComponentRender'],
 *                      app_theme_update:function}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const themes = props.methods.commonThemeDefaultList();

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