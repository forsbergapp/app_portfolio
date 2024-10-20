/**
 * @module apps/common/component/common_iam_avatar
 */
const template = () =>` <div id='common_iam_avatar'>
                            <div id='common_iam_avatar_logged_in'>
                                <div id='common_iam_avatar_avatar'>
                                    <div id='common_iam_avatar_avatar_img' class='common_image common_image_avatar'></div>
                                </div>
                            </div>
                            <div id='common_iam_avatar_logged_out'>
                                <div id='common_iam_avatar_default_avatar' class='common_icon'></div>
                            </div>
                        </div>`;
/**
 * 
 * @param {{data:       {commonMountdiv:string},
 *          methods:    {COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;