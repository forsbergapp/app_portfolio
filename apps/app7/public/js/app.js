/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;

const path_common ='common';
/**@type {import('../../../types.js').module_common} */
const common = await import(path_common);

/**@type {import('./cube.js')}*/
const app_cube = await import('./cube.js');

/**
 * @typedef {{  cube:*,
 *              flatCube:*,
 *              controls:*,
 *              width:number,
 *              icon_robot:string,
 *              icon_human:string,
 *              icon_moves:string,
 *              icon_time:string,
 *              icon_solution:string,
 *              icon_solution_list:string}} type_APP_GLOBAL
 */
/**@type{type_APP_GLOBAL} */
const APP_GLOBAL = {
    cube : {},
    flatCube: null,
    controls: null,
    width : 360,
    icon_robot:'🤖',
    icon_human:'👤',
    icon_moves:'⤮',
    icon_time: '⌛',
    icon_solution:'💡',
    icon_solution_list:'∞'
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
 * @param {import('../../../types.js').AppEvent|null} event 
 * @returns {void}
 */
const app_event_click = (event=null) => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{import('../../../types.js').AppEvent}*/event) => {
            app_event_click(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'button_reset':{
                    init_cube();
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
                    /**@ts-ignore */
                    APP_GLOBAL.controls.cube.makeMove(event.target.getAttribute('name'));
                    break;
                }
                case 'button_solve':{
                    solve(event.target.id);
                    break;
                }
                case event.target.id.startsWith('button_solve_speed')?event_target_id:null:{
                    AppDocument.querySelectorAll('.button_solve_speed').forEach((/**@type{HTMLElement}*/content) =>content.classList.remove('button_speed_selected'));
                    event.target.classList.add('button_speed_selected');
                    /**@ts-ignore */
                    APP_GLOBAL.controls.cube.turnSpeed = event.target.getAttribute('data-speed');
                    break;
                }
                case 'button_solved_step':{
                    solve(event.target.id);
                    break;
                }
                case 'button_step_info':
                case 'button_step':
                case 'button_step_move':{
                    /**@ts-ignore */
                    APP_GLOBAL.controls.nextMove();
                    break;
                }
                case 'button_scramble':{
                    /**@ts-ignore */
                    APP_GLOBAL.controls.cube.scramble();
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
    const onmousedown = function(/**@type{import('../../../types.js').AppEvent}*/e){
		APP_GLOBAL.cube.mouseDown = true;
		if(e.touches && e.touches.length > 0){
			e = e.touches[0];
		}
		APP_GLOBAL.cube.lastPos = {x:e.clientX,y:e.clientY};
		APP_GLOBAL.cube.affinediff = app_cube.makeIdentityAffine();
        APP_GLOBAL.cube.render();
	};
	const onmouseup = function(){
		if(APP_GLOBAL.cube.mouseDown){
			APP_GLOBAL.cube.mouseDown = false;
			if(APP_GLOBAL.cube.affinediff){
				APP_GLOBAL.cube.customAffine = app_cube.multiplyAffine(APP_GLOBAL.cube.affinediff, APP_GLOBAL.cube.customAffine);
			}
			APP_GLOBAL.cube.affinediff = null;
            APP_GLOBAL.cube.render();
		}
	};
	const onmousemove = function(/**@type{import('../../../types.js').AppEvent}*/e){
		if(APP_GLOBAL.cube.mouseDown){
			e.preventDefault();
			if(e.touches && e.touches.length > 0){
				e = e.touches[0];
			}
			const moved = {x:e.clientX - APP_GLOBAL.cube.lastPos.x, y:e.clientY-APP_GLOBAL.cube.lastPos.y};
			APP_GLOBAL.cube.lastPos = {x:e.clientX,y:e.clientY};
			APP_GLOBAL.cube.affinediff = app_cube.multiplyAffine(app_cube.multiplyAffine(app_cube.makeRotateAffineX(moved.y/100), app_cube.makeRotateAffineY(-moved.x/100)),APP_GLOBAL.cube.affinediff);
            APP_GLOBAL.cube.render();
		}
	};
    AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('mousedown',(/**@type{import('../../../types.js').AppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmousedown(event);
    });
    AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('mouseup',(/**@type{import('../../../types.js').AppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmouseup();
    });
    AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('mousemove',(/**@type{import('../../../types.js').AppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmousemove(event);
    });

    AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('touchstart',(/**@type{import('../../../types.js').AppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmousedown(event);
    });
    AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('touchend',(/**@type{import('../../../types.js').AppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmouseup();
    });
    AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('touchcancel',(/**@type{import('../../../types.js').AppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmouseup();
    });
    AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('touchmove',(/**@type{import('../../../types.js').AppEvent}*/event) => {
        if (event.target.classList.contains('cube_face'))
            onmousemove(event);
    });
};
/**
 * @param {string}  result
 * @param {string}  button_id
 */
const show_solution_result = (result, button_id) =>{
    /**
     * @type{{cube_solution:string,
     *        cube_solution_time:number,
     *        cube_solution_length:number,
     *        cube_solution_model:number}[]}
     */
    const cube_result = JSON.parse(result).rows;
    if (cube_result.length>0){
        const cube_result_lov = cube_result.map(row=>{return {
            //use base64 for solution in id column
            id:btoa(row.cube_solution), 
            cube_solution: `${row.cube_solution_model==0?APP_GLOBAL.icon_robot:APP_GLOBAL.icon_human} 
                            (${APP_GLOBAL.icon_moves}:${row.cube_solution_length}, ${APP_GLOBAL.icon_time}:${row.cube_solution_time}) - ${row.cube_solution}`}; 
        });
        /**
        * @param {import('../../../types.js').AppEvent} event
        */
        const function_event = event => {
            const solution = atob(common.element_row(event.target).getAttribute('data-id') ?? '');
            if (button_id=='button_solve')
                APP_GLOBAL.cube.makeMoves(solution);
            else
                APP_GLOBAL.controls.setSolution(solution);
            common.lov_close();
        };
        common.lov_show({lov:'CUSTOM', lov_custom_list:cube_result_lov, lov_custom_value:'cube_solution', function_event:function_event});
    }
};
/**
 * @param {string} button_id
 */
const solve = button_id => {
    /**
     *  Solve parameters
     * 
     *  model               0=Robot, 1=Human
     *  preamble            0=Singmaster notation
     *  temperature         0=best solution, 1=all solutions for given model
     *  cube current state  string of cube state
     *  cube goalstate      empty to solve or to given cube state
     */
    if (APP_GLOBAL.cube.rotating == false){
        AppDocument.querySelector(`#${button_id}`).classList.add('css_spinner');
        common.FFB('/app-function/CUBE_SOLVE', null, 'POST', 'APP_DATA',
            {   model:              Number(AppDocument.querySelector('#app_select_model .common_select_dropdown_value')?.getAttribute('data-value')),
                preamble:           0,
                temperature:        Number(AppDocument.querySelector('#app_select_temperature .common_select_dropdown_value')?.getAttribute('data-value')),
                cube_currentstate: 	APP_GLOBAL.cube.getState(),
                cube_goalstate: 	null})
                .then(result=>{
                    common.ComponentRemove('common_dialogue_message', true);
                    AppDocument.querySelector(`#${button_id}`).classList.remove('css_spinner');
                    show_solution_result(result, button_id);
                })
                .catch(()=>{
                    common.ComponentRemove('common_dialogue_message', true);
                    AppDocument.querySelector(`#${button_id}`).classList.remove('css_spinner');
                });
    }
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

const init_cube = () => {
    /**@ts-ignore */
    APP_GLOBAL.cube = new app_cube.RubiksCube( APP_GLOBAL.width);
    /**@ts-ignore */
    APP_GLOBAL.controls = new app_cube.RubiksCubeControls('button_controls', APP_GLOBAL.cube);
    APP_GLOBAL.cube.render();
};
/**
 * Init app
 * @returns {Promise.<void>}
 */
const init_app = async () => {
    AppDocument.body.className = 'app_theme1';
    await common.ComponentRender(common.COMMON_GLOBAL.app_div, {icon_robot:APP_GLOBAL.icon_robot, 
                                                                icon_human:APP_GLOBAL.icon_human, 
                                                                icon_solution:APP_GLOBAL.icon_solution,
                                                                icon_solution_list:APP_GLOBAL.icon_solution_list}, '/component/app.js');
    let html = '';
    for (let i=0;i<156;i++){
        html += `<path class='cube_face' id='cube_face_${i}'/>`;
    }
    /**@ts-ignore */
    document.querySelector('#cube').innerHTML = `<svg xmlns='http://www.w3.org/2000/svg'>${html}</svg>`;
    init_cube();
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