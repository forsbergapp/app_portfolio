/** 
 * Cube app
 * @module apps/app8/app
 */

/**
 * @import {commonMetadata, CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 * @import {APP_GLOBAL} from './types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

/**@type {CommonModuleCommon} */
let common;

/**@type{APP_GLOBAL} */
const APP_GLOBAL = {
    cube :{},
    cube_controls:{},
    cube_init:()=>null,
    cube_show_solution:()=>null,
    cube_solve:()=>null,
    cube_makeIdentityAffine:()=>null,
    cube_multiplyAffine:()=>null,
    cube_makeRotateAffineX:()=>null,
    cube_makeRotateAffineY:()=>null,
    width : 360
};

/**
 * @name appException
 * @description App exception function
 * @function
 * @param {Error} error 
 * @returns {void}
 */
const appException = error => {
    common.commonMessageShow('EXCEPTION', null, null, error);
};
/**
 * @name appEventClick
 * @description App event click
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventClick = event => {
    const event_target_id = common.commonMiscElementId(event.target);    
    switch (event_target_id){
        case 'button_reset':{
            const init_cube = APP_GLOBAL.cube_init();
            APP_GLOBAL.cube = init_cube.cube;
            APP_GLOBAL.cube_controls = init_cube.controls;
            break;
        }
        case 'button_L':
        case 'button_R':
        case 'button_U':
        case 'button_D':
        case 'button_F':
        case 'button_B':
        case 'button_L2':
        case 'button_R2':
        case 'button_U2':
        case 'button_D2':
        case 'button_F2':
        case 'button_B2':{
            APP_GLOBAL.cube_controls.cube.makeMove(event.target.getAttribute('name'));
            break;
        }
        case 'button_solve':
        case 'button_solved_step':{
            APP_GLOBAL.cube_solve(APP_GLOBAL.cube, APP_GLOBAL.cube_controls, event.target.id);
            break;
        }
        case 'button_solve_cubestate':
        case 'button_solved_step_cubestate':{
            const cubestate = common.commonWindowPrompt('?');
            if (cubestate && cubestate.split(' ').length==20)
                APP_GLOBAL.cube_solve(APP_GLOBAL.cube, APP_GLOBAL.cube_controls, event.target.id, cubestate.split(' '));
            else
                if (cubestate)
                    common.commonMessageShow('INFO', null, 'message_text','!');
            break;
        }
        case 'button_info':{
            common.commonMessageShow('INFO', null, null,APP_GLOBAL.cube.getState());
            break;
        }
        case event.target.id.startsWith('button_solve_speed')?event_target_id:null:{
            COMMON_DOCUMENT.querySelectorAll('.button_solve_speed').forEach((/**@type{HTMLElement}*/content) =>content.classList.remove('button_speed_selected'));
            event.target.classList.add('button_speed_selected');
            APP_GLOBAL.cube_controls.cube.turnSpeed = event.target.getAttribute('data-speed');
            break;
        }
        case 'button_step_info':
        case 'button_step':
        case 'button_step_move':{
            APP_GLOBAL.cube_controls.nextMove();
            break;
        }
        case 'button_scramble':{
            APP_GLOBAL.cube_controls.cube.scramble(null, common.commonWindowSetTimeout);
            break;
        }
        /*Dialogue user start */
        case 'common_dialogue_iam_start_login_button':{
            common.commonUserLogin().catch(()=>null);
            break;
        }                
    }
};
/**
 * @name appEventMouseDown
 * @description App event mouse down
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventMouseDown = event =>{
    if (event.target.classList.contains('cube_face')){
        APP_GLOBAL.cube.mouseDown = true;
        if(event.touches && event.touches.length > 0){
            event = event.touches[0];
        }
        APP_GLOBAL.cube.lastPos = {x:event.clientX,y:event.clientY};
        APP_GLOBAL.cube.affinediff = APP_GLOBAL.cube_makeIdentityAffine();
        APP_GLOBAL.cube.render();
    }
};
/**
 * @name appEventMouseUp
 * @description App event mouse up
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventMouseUp = event =>{
    if (event.target.classList.contains('cube_face')){
        if(APP_GLOBAL.cube.mouseDown){
            APP_GLOBAL.cube.mouseDown = false;
            if(APP_GLOBAL.cube.affinediff){
                APP_GLOBAL.cube.customAffine = APP_GLOBAL.cube_multiplyAffine(APP_GLOBAL.cube.affinediff, APP_GLOBAL.cube.customAffine);
            }
            APP_GLOBAL.cube.affinediff = null;
            APP_GLOBAL.cube.render();
        }
    }
};
/**
 * @name appEventMouseMove
 * @description App event mouse move
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventMouseMove = event =>{
    if (event.target.classList.contains('cube_face')){
        if(APP_GLOBAL.cube.mouseDown){
            event.preventDefault();
            if(event.touches && event.touches.length > 0){
                event = event.touches[0];
            }
            const moved = {x:event.clientX - APP_GLOBAL.cube.lastPos.x, y:event.clientY-APP_GLOBAL.cube.lastPos.y};
            APP_GLOBAL.cube.lastPos = {x:event.clientX,y:event.clientY};
            APP_GLOBAL.cube.affinediff = APP_GLOBAL.cube_multiplyAffine(APP_GLOBAL.cube_multiplyAffine(APP_GLOBAL.cube_makeRotateAffineX(moved.y/100), APP_GLOBAL.cube_makeRotateAffineY(-moved.x/100)),APP_GLOBAL.cube.affinediff);
            APP_GLOBAL.cube.render();
        }
    } 
};

/**
 * @name appInit
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    COMMON_DOCUMENT.body.className = 'app_theme1';
    await common.commonComponentRender({
        mountDiv:   common.COMMON_GLOBAL.app_div, 
        data:       null,
        methods:    null,
        path:       '/component/app.js'});
    await common.commonComponentRender({
        mountDiv:   'app_main_page', 
        data:       {
                    cube_width:APP_GLOBAL.width,
                    app_id:common.COMMON_GLOBAL.app_id,
                    common_app_id:common.COMMON_GLOBAL.app_common_app_id
                    },
        methods:    {
                    commonWindowSetTimeout:common.commonWindowSetTimeout,
                    commonMiscImport:common.commonMiscImport,
                    commonMiscElementRow:common.commonMiscElementRow,
                    commonLovShow:common.commonLovShow,
                    commonLovClose:common.commonLovClose,
                    commonMessageShow:common.commonMessageShow,
                    commonComponentRemove:common.commonComponentRemove,
                    commonWindowToBase64:common.commonWindowToBase64,
                    commonWindowFromBase64:common.commonWindowFromBase64,
                    commonFFB:common.commonFFB},
        path:       '/component/cube.js'})
    .then((/**@type{{   data:null,
                        methods:{   cube_init:                  function, 
                                    cube_show_solution:         function,
                                    cube_solve:                 function,
                                    cube_makeIdentityAffine:    function,
                                    cube_multiplyAffine:        function,
                                    cube_makeRotateAffineX:     function,
                                    cube_makeRotateAffineY:     function}}}*/component)=>{
        APP_GLOBAL.cube_init =                  component.methods.cube_init;
        APP_GLOBAL.cube_show_solution =         component.methods.cube_show_solution;
        APP_GLOBAL.cube_solve =                 component.methods.cube_solve;
        APP_GLOBAL.cube_makeIdentityAffine =    component.methods.cube_makeIdentityAffine;
        APP_GLOBAL.cube_multiplyAffine =        component.methods.cube_multiplyAffine;
        APP_GLOBAL.cube_makeRotateAffineX =     component.methods.cube_makeRotateAffineX;
        APP_GLOBAL.cube_makeRotateAffineY =     component.methods.cube_makeRotateAffineY;
        const init_cube = APP_GLOBAL.cube_init();
        APP_GLOBAL.cube = init_cube.cube;
        APP_GLOBAL.cube_controls = init_cube.controls;
    });
};
/**RubiksCube
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {CommonModuleCommon} commonLib
 * @param {Object.<String,*>} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, parameters) => {
    parameters;
    common = commonLib;
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    appInit();
};
/**
 * @name appMetadata
 * @description App metadata for event delegataion and lifecycle events
 * @function
 * @returns {commonMetadata}
 */
const appMetadata = () =>{
    return { 
        events:{  
            click:      appEventClick,
            mousedown:  appEventMouseDown,
            mouseup:    appEventMouseUp,
            mousemove:  appEventMouseMove,
            touchmove:  appEventMouseMove,
            touchend:   appEventMouseUp,
            touchcancel:appEventMouseUp,
            touchstart: appEventMouseDown},
        lifeCycle:{onMounted:null}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;