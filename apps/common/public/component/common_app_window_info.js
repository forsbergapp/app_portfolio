/**
 * Display info
 * type content
 * 0    IMAGE
 * 1    URL
 * 2    HTML
 * @module apps/common/component/common_app_window_info
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{info:'IMAGE'|'URL'|'HTML', 
 *          url?:string|null, 
 *          class?:string, 
 *          content?:string,
 *          icons:{ close: string,
 *                  print:string,
 *                  zoomout: string,
 *                  zoomin: string,
 *                  left: string,
 *                  right: string,
 *                  up: string,
 *                  down: string,
 *                  fullscreen: string}}} props
 * @returns {string}
 */
const template = props => ` 
                            <div id='common_app_window_info_toolbar' >
                                <div id='common_app_window_info_toolbar_btn_zoomout' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.zoomout}</div>
                                <div id='common_app_window_info_toolbar_btn_zoomin' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.zoomin}</div>
                                <div id='common_app_window_info_toolbar_btn_left' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.left}</div>
                                <div id='common_app_window_info_toolbar_btn_right' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.right}</div>
                                <div id='common_app_window_info_toolbar_btn_up' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.up}</div>
                                <div id='common_app_window_info_toolbar_btn_down' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.down}</div>
                                <div id='common_app_window_info_toolbar_btn_fullscreen' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.fullscreen}</div>
                                <div id='common_app_window_info_toolbar_btn_print' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.print}</div>
                                <div id='common_app_window_info_toolbar_btn_close' class='common_toolbar_button common_link common_icon_toolbar_m' >${props.icons.close}</div>
                            </div>
                            <div id='common_app_window_info_info' class='${props.class}'>
                                ${props.info=='IMAGE'?
                                    (props.url?
                                        `<div id='common_app_window_info_info_img' style='${props.url==null?'':`background-image:url(${props.url});`}'></div>`:
                                        ''):
                                        props.content
                                }
                            </div>`
;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      info:'IMAGE'|'URL'|'HTML', 
 *                      url?:string|null,
 *                      class?:string
 *                      content?:string,
 *                      path?:string,
 *                      query?:string,
 *                      method?:common['CommonRESTAPIMethod'],
 *                      body?:*,
 *                      authorization?:common['CommonRESTAPIAuthorizationType']},
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:   null,
 *                      methods:{WindoInfoClose:function},
 *                      events:common['commonComponentEvents'],
 *                      template:string}
 * >}
 */
const component = async props => {
    
    const content_fetch = (props.data.info=='URL' && props.data.path && props.data.method && props.data.authorization)?
                                await props.methods.COMMON.commonFFB({ path:props.data.path, 
                                                                method:props.data.method, 
                                                                query:props.data.query, 
                                                                authorization_type:props.data.authorization, 
                                                                body:props.data.body??null})
                                .then(result=>JSON.parse(result).resource):
                                    null;
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show0');
    /**
     * @name WindoInfoClose
     * @description Close window info
     * @function
     * @returns {void}
     */
    const WindoInfoClose = () =>{
        props.methods.COMMON.commonComponentRemove('common_app_window_info');
        props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.remove('common_app_dialogues_show0');
        if (props.methods.COMMON.COMMON_DOCUMENT.fullscreenElement)
            props.methods.COMMON.COMMON_DOCUMENT.exitFullscreen();
    };

    /**
     * @name WindoInfoToolbarShowHide
     * @description Show or hide window info toolbar
     * @function
     * @returns {void}
     */
    const WindoInfoToolbarShowHide = () => {
        if (props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_window_info_toolbar').style.display=='inline-block' ||
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_window_info_toolbar').style.display=='')
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_window_info_toolbar').style.display='none';
        else
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_window_info_toolbar').style.display='inline-block';
    };
    /**
     * @name ZoomInfo
     * @description Window zoom info
     * @function
     * @param {number|null} zoomvalue 
     * @returns {void}
     */
    const ZoomInfo = (zoomvalue = null) => {
        let old;
        let old_scale;
        const div = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_window_info_info > div');
        //called with null as argument at init() then used for zooming
        //even if css set, this property is not set at startup
        if (zoomvalue == null) {
            div.style.transform = 'scale(1)';
        } else {
            old = div.style.transform==''? 'scale(1)':div.style.transform;
            old_scale = parseFloat(old.substr(old.indexOf('(') + 1, old.indexOf(')') - 1));
            div.style.transform = 'scale(' + (old_scale + ((zoomvalue*5) / 10)) + ')';
        }
    };
    /**
     * @name MoveInfo
     * @description Window move info
     * @function
     * @param {number|null} move1 
     * @param {number|null} move2 
     * @returns {void}
     */
    const MoveInfo = (move1=null, move2=null) => {
        let old;
        const div = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_app_window_info_info > div');
        if (move1==null || move2==null) {
            div.style.transformOrigin = '50% 50%';
        } else {
            old = div.style.transformOrigin==''? '50% 50%':div.style.transformOrigin;
            const old_move1 = parseFloat(old.substr(0, old.indexOf('%')));
            const old_move2 = parseFloat(old.substr(old.indexOf('%') +1, old.length -1));
            div.style.transformOrigin =  `${old_move1 + (move1*5)}% ${old_move2 + (move2*5)}%`;
        }
    };

    /**
     * @name events
     * @descption Events
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        switch (event_type){
            case 'click':{
                switch (true){
                    case event_target_id=='common_app_window_info':{
                        WindoInfoToolbarShowHide();
                        break;
                    }
                    case event_target_id=='common_app_window_info_toolbar_btn_zoomout':{
                        ZoomInfo(-1);
                        break;
                    }
                    case event_target_id=='common_app_window_info_toolbar_btn_zoomin':{
                        ZoomInfo(1);
                        break;
                    }
                    case event_target_id=='common_app_window_info_toolbar_btn_left':{
                        MoveInfo(-1,0);
                        break;
                    }
                    case event_target_id=='common_app_window_info_toolbar_btn_right':{
                        MoveInfo(1,0);
                        break;
                    }
                    case event_target_id=='common_app_window_info_toolbar_btn_up':{
                        MoveInfo(0,-1);
                        break;
                    }
                    case event_target_id=='common_app_window_info_toolbar_btn_down':{
                        MoveInfo(0,1);
                        break;
                    }
                    case event_target_id=='common_app_window_info_toolbar_btn_fullscreen':{
                        if (props.methods.COMMON.COMMON_DOCUMENT.fullscreenElement)
                            props.methods.COMMON.COMMON_DOCUMENT.exitFullscreen();
                        else
                            props.methods.COMMON.COMMON_DOCUMENT.body.requestFullscreen();
                        break;
                    }
                    case event_target_id=='common_app_window_info_toolbar_btn_print':{
                        props.methods.COMMON.commonMiscPrint('common_app_window_info_info');
                        break;
                    }
                    case event_target_id=='common_app_window_info_toolbar_btn_close':{
                        WindoInfoClose();
                        break;
                    }
                }
            }
        }
    };
    const onUnmounted = ()=>
        props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.remove('common_app_dialogues_show0');
    
    return {
        lifecycle:  {onUnmounted:onUnmounted},
        data:       null,
        methods:    {WindoInfoClose:WindoInfoClose},
        events:     events,
        template:   template({  info:   props.data.info,
                                url:    props.data.url,
                                class:  props.data.class??'',
                                content:props.data.info=='URL'?content_fetch:props.data.content,
                                icons: {close: props.methods.COMMON.commonGlobalGet('ICONS').close,
                                        print: props.methods.COMMON.commonGlobalGet('ICONS').print,
                                        zoomout: props.methods.COMMON.commonGlobalGet('ICONS').zoomout,
                                        zoomin: props.methods.COMMON.commonGlobalGet('ICONS').zoomin,
                                        left: props.methods.COMMON.commonGlobalGet('ICONS').left,
                                        right: props.methods.COMMON.commonGlobalGet('ICONS').right,
                                        up: props.methods.COMMON.commonGlobalGet('ICONS').up,
                                        down: props.methods.COMMON.commonGlobalGet('ICONS').down,
                                        fullscreen: props.methods.COMMON.commonGlobalGet('ICONS').fullscreen
                                    }
        })
    };
};
export default component;