/** 
 * @module apps/app7/app
 */
/**@type{import('../../../common_types.js').CommonAppDocument} */
const CommonAppDocument = document;

const path_common ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(path_common);

/**@type{import('./types.js').APP_GLOBAL} */
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
 * App exception function
 * @param {Error} error 
 * @returns {void}
 */
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, null, error);
};
/**
 * App event click
 * @param {import('../../../common_types.js').CommonAppEvent|null} event 
 * @returns {void}
 */
const app_event_click = (event=null) => {
    if (event==null){
        CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_click(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
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
                    const cubestate = common.WindowPrompt('?');
                    if (cubestate && cubestate.split(' ').length==20)
                        APP_GLOBAL.cube_solve(APP_GLOBAL.cube, APP_GLOBAL.cube_controls, event.target.id, cubestate.split(' '));
                    else
                        if (cubestate)
                            common.show_message('INFO', null, null, 'message_text','!', common.COMMON_GLOBAL.common_app_id);
                    break;
                }
                case 'button_info':{
                    common.show_message('INFO', null, null, null,APP_GLOBAL.cube.getState(), common.COMMON_GLOBAL.common_app_id);
                    break;
                }
                case event.target.id.startsWith('button_solve_speed')?event_target_id:null:{
                    CommonAppDocument.querySelectorAll('.button_solve_speed').forEach((/**@type{HTMLElement}*/content) =>content.classList.remove('button_speed_selected'));
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
                    APP_GLOBAL.cube_controls.cube.scramble();
                    break;
                }
                case 'common_toolbar_framework_js':{
                   framework_set(1);
                    break;
                }
                case 'common_toolbar_framework_vue':{
                   framework_set(2);
                    break;
                }
                case 'common_toolbar_framework_react':{
                   framework_set(3);
                    break;
                }
            }
        });
    }
};
/**
 * App event other
 * @returns {void}
 */
const app_event_other = () => {
    const onmousedown = function(/**@type{import('../../../common_types.js').CommonAppEvent}*/e){
		APP_GLOBAL.cube.mouseDown = true;
		if(e.touches && e.touches.length > 0){
			e = e.touches[0];
		}
		APP_GLOBAL.cube.lastPos = {x:e.clientX,y:e.clientY};
		APP_GLOBAL.cube.affinediff = APP_GLOBAL.cube_makeIdentityAffine();
        APP_GLOBAL.cube.render();
	};
	const onmouseup = function(){
		if(APP_GLOBAL.cube.mouseDown){
			APP_GLOBAL.cube.mouseDown = false;
			if(APP_GLOBAL.cube.affinediff){
				APP_GLOBAL.cube.customAffine = APP_GLOBAL.cube_multiplyAffine(APP_GLOBAL.cube.affinediff, APP_GLOBAL.cube.customAffine);
			}
			APP_GLOBAL.cube.affinediff = null;
            APP_GLOBAL.cube.render();
		}
	};
	const onmousemove = function(/**@type{import('../../../common_types.js').CommonAppEvent}*/e){
		if(APP_GLOBAL.cube.mouseDown){
			e.preventDefault();
			if(e.touches && e.touches.length > 0){
				e = e.touches[0];
			}
			const moved = {x:e.clientX - APP_GLOBAL.cube.lastPos.x, y:e.clientY-APP_GLOBAL.cube.lastPos.y};
			APP_GLOBAL.cube.lastPos = {x:e.clientX,y:e.clientY};
			APP_GLOBAL.cube.affinediff = APP_GLOBAL.cube_multiplyAffine(APP_GLOBAL.cube_multiplyAffine(APP_GLOBAL.cube_makeRotateAffineX(moved.y/100), APP_GLOBAL.cube_makeRotateAffineY(-moved.x/100)),APP_GLOBAL.cube.affinediff);
            APP_GLOBAL.cube.render();
		}
	};
    CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('mousedown',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmousedown(event);
    });
    CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('mouseup',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmouseup();
    });
    CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('mousemove',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmousemove(event);
    });

    CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('touchstart',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmousedown(event);
    });
    CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('touchend',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmouseup();
    });
    CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('touchcancel',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmouseup();
    });
    CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('touchmove',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmousemove(event);
    });
};
/**
 * Sets framework
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
 const framework_set = async (framework=null) => {
    await common.framework_set(framework,
        {   Click: app_event_click,
            Change: null,
            KeyDown: null,
            KeyUp: null,
            Focus: null,
            Input:null,
            Other:app_event_other});
};

/**
 * Init app
 * @returns {Promise.<void>}
 */
const init_app = async () => {
    CommonAppDocument.body.className = 'app_theme1';
    await common.ComponentRender({
        mountDiv:   common.COMMON_GLOBAL.app_div, 
        data:       null,
        methods:    null,
        lifecycle:  null,
        path:       '/component/app.js'});
    await common.ComponentRender({
        mountDiv:   'app_main_page', 
        data:       {
                    cube_width:APP_GLOBAL.width,
                    common_app_id:common.COMMON_GLOBAL.common_app_id
                    },
        methods:    {
                    element_row:common.element_row,
                    lov_show:common.lov_show,
                    lov_close:common.lov_close,
                    show_message:common.show_message,
                    ComponentRemove:common.ComponentRemove,
                    FFB:common.FFB},
        lifecycle:  null,
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
    framework_set();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const init = (parameters) => {
    common.COMMON_GLOBAL.app_function_exception = app_exception;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    common.init_common(parameters).then(()=>{
        init_app();
    });
};
export{init};