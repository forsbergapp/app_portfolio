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
 *              width:number}} type_APP_GLOBAL
 */
/**@type{type_APP_GLOBAL} */
const APP_GLOBAL = {
    cube : {},
    flatCube: null,
    controls: null,
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
                case event.target.id.startsWith('flatsticker_flatface_cube')?event_target_id:null:{
                    /**@ts-ignore */
                    if(APP_GLOBAL.cube.flatCube.getColor()){
                        /**@ts-ignore */
                        const stickers = APP_GLOBAL.cube.flatCube.faces.filter(face=>event.target.id.startsWith('flatsticker_' + face.container.id))[0].stickers;
                        const sticker = stickers.filter((/**@type{{container:{id:string}}}*/sticker)=>event.target.id == sticker.container.id)[0];
                        /**@ts-ignore */
                        sticker.setColor(APP_GLOBAL.cube.flatCube.getColor());
                        /**@ts-ignore */
                        APP_GLOBAL.cube.flatCube.update(show_message_cube);
                    }
                    break;
                }
                case event.target.id.startsWith('flatsticker_flatcolorpicker_cube')?event_target_id:null:{
                    /**@ts-ignore */
                    APP_GLOBAL.cube.flatCube.picker.setSelection(Number(event.target.id.slice(-1)));
                    event.stopPropagation();
                    break;
                }
                case 'button_reset':
                    /**@ts-ignore */{
                    APP_GLOBAL.cube.customAffine = app_cube.makeIdentityAffine();
                    /**@ts-ignore */
                    APP_GLOBAL.controls.solve();
                    /**@ts-ignore */
                    APP_GLOBAL.cube.flatCube.update(show_message_cube);
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
                    /**@ts-ignore */
                    APP_GLOBAL.controls.solve();
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
                    /**@ts-ignore */
                    APP_GLOBAL.controls.cube.getSolutionAsync(function(solution){APP_GLOBAL.controls.setSolution(solution);},function(data){
                        /**@ts-ignore */
                        APP_GLOBAL.controls.setProgress(data);
                    });
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
                    /**@ts-ignore */
                    APP_GLOBAL.cube.flatCube.update(show_message_cube);
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
 * @param {string} message
 */
const show_message_cube = message =>{
    common.show_message('INFO', null, null, null,message, common.COMMON_GLOBAL.common_app_id);
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
    APP_GLOBAL.flatCube = new app_cube.FlatCube('flat-cube', APP_GLOBAL.width);
    /**@ts-ignore */
    APP_GLOBAL.controls = new app_cube.RubiksCubeControls('button_controls', APP_GLOBAL.cube, APP_GLOBAL.width);
    /**@ts-ignore */
    APP_GLOBAL.cube.flatCube = APP_GLOBAL.flatCube;
    /**@ts-ignore */
    APP_GLOBAL.flatCube.cube = APP_GLOBAL.cube;

    APP_GLOBAL.cube.flatCube.update();
    APP_GLOBAL.cube.render();
    
};
/**
 * Init app
 * @returns {Promise.<void>}
 */
const init_app = async () => {
    AppDocument.body.className = 'app_theme1';
    await common.ComponentRender(common.COMMON_GLOBAL.app_div, {}, '/component/app.js');
    let html = '';
    for (let i=0;i<156;i++){
        html += `<path class='cube_face' id='cube_face_${i}'/>`;
    }
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