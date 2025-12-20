/**
 * Displays app
 * @module apps/app8/component/app
 */
/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @param {{icon_robot:string,
 *          icon_human:string, 
 *          icon_solution:string,
 *          icon_solution_list:string}} props
 * @function
 * @returns {string}
 */
const template = props =>`  <div id='app_main'>
                                <div id='cube'>
                                    <svg>
                                        ${Array(...Array(156)).map((i, index)=>
                                            `<path class='cube_face' id='cube_face_${index}'/>`
                                            ).join('')
                                        }
                                    </svg>
                                </div> 
                                <div id='button_controls'>
                                    <div class='buttons_row buttons_move'>
                                        <div id='button_L' name='L' class='button_move cube_red'>↷</div>
                                        <div id='button_R' name='R' class='button_move cube_orange'>↷</div>
                                        <div id='button_U' name='U' class='button_move cube_white'>↷</div>
                                        <div id='button_D' name='D' class='button_move cube_yellow'>↷</div>
                                        <div id='button_F' name='F' class='button_move cube_blue'>↷</div>
                                        <div id='button_B' name='B' class='button_move cube_green'>↷</div>
                                    </div>
                                    <div class='buttons_row buttons_move'>
                                        <div id='button_L2' name="L'" class='button_move cube_red'>↶</div>
                                        <div id='button_R2' name="R'" class='button_move cube_orange'>↶</div>
                                        <div id='button_U2' name="U'" class='button_move cube_white'>↶</div>
                                        <div id='button_D2' name="D'" class='button_move cube_yellow'>↶</div>
                                        <div id='button_F2' name="F'" class='button_move cube_blue'>↶</div>
                                        <div id='button_B2' name="B'" class='button_move cube_green'>↶</div>
                                    </div>
                                    <div id='overlay'>
                                        <div id='button_step_info'>
                                            <div id='button_step'></div>
                                            <div id='button_step_move'></div>
                                        </div>
                                    </div>
                                    <div id='button_solve_speed'>
                                        <div id='button_solve_speed_250' data-speed=250 class='button_solve_speed common_app_dialogues_button button_speed_selected'>250</div>
                                        <div id='button_solve_speed_500' data-speed=500 class='button_solve_speed common_app_dialogues_button'>500</div>
                                        <div id='button_solve_speed_1000' data-speed=1000 class='button_solve_speed common_app_dialogues_button'>1000</div>
                                        <div id='button_solve_speed_5000' data-speed=5000 class='button_solve_speed common_app_dialogues_button'>5000</div>
                                    </div>
                                    <div class='buttons_row'>
                                        <div class='buttons_col'>
                                            <div id='button_solve' class='common_app_dialogues_button common_list_lov_click'></div>
                                        </div>
                                        <div class='buttons_col'>
                                            <div id='button_solve_cubestate' class='common_app_dialogues_button'></div>
                                        </div>
                                        <div class='buttons_col'>
                                            <div id='app_select_model' class='common_select'>
                                                <div class='common_select_dropdown'>
                                                    <div class='common_select_dropdown_value' data-value='0'>${props.icon_robot}</div>
                                                    <div class='common_select_dropdown_icon common_icon'></div>
                                                </div>
                                                <div class='common_select_options'>
                                                    <div class='common_select_option' data-value='0'>${props.icon_robot}</div>
                                                    <div class='common_select_option' data-value='1'>${props.icon_human}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='buttons_col'>
                                            <div id='button_solved_step' class='common_app_dialogues_button common_list_lov_click'></div>
                                        </div>
                                        <div class='buttons_col'>
                                            <div id='button_solved_step_cubestate' class='common_app_dialogues_button'></div>
                                        </div>
                                    </div>
                                    <div class='buttons_row'>
                                        <div class='buttons_col'>
                                            <div id='button_scramble' class='common_app_dialogues_button'></div>
                                        </div>
                                        <div class='buttons_col'></div>
                                        <div class='buttons_col'>
                                            <div id='app_select_temperature' class='common_select'>
                                                <div class='common_select_dropdown'>
                                                    <div class='common_select_dropdown_value' data-value='0'>${props.icon_solution}</div>
                                                    <div class='common_select_dropdown_icon common_icon'></div>
                                                </div>
                                                <div class='common_select_options'>
                                                    <div class='common_select_option' data-value='0'>${props.icon_solution}</div>
                                                    <div class='common_select_option' data-value='1'>${props.icon_solution_list}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='buttons_col'>
                                            <div id='button_reset' class='common_app_dialogues_button'></div>
                                        </div>
                                        <div class='buttons_col'>
                                            <div id='button_info' class='common_app_dialogues_button'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string},
 *          methods:    {COMMON:common['CommonModuleCommon']}}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:   null, 
 *                      methods:null,
 *                      events:common['commonComponentEvents'],
 *                      template:string}>}
 */
const component = async props => {
    /**@type{{cube:*, cube_controls:*, cube_width:number, cube_goalstate : string|null}} */
    const CONSTANTS = {
        cube :null,
        cube_controls:null,
        cube_width : 360,
        cube_goalstate : null
    };

    const ICONS = {
        robot:'🤖',
        human:'👤',
        moves:'⤮',
        time: '⌛',
        solution:'💡',
        solution_list:'∞'
    };
    const cube_lib = await props.methods.COMMON.commonMiscImport('/component/cube_lib.js');
    
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
        switch (true){
            case event_type=='click' && event_target_id == 'button_reset':{
                initCube();
                break;
            }
            case event_type=='click' && 
                [   'button_L', 'button_R', 'button_U', 'button_D', 'button_F', 'button_B',
                    'button_L2','button_R2','button_U2','button_D2','button_F2','button_B2'].includes(event_target_id):{
                CONSTANTS.cube_controls.cube.makeMove(event.target.getAttribute('name'));
                break;
            }
            case event_type =='click' && ['button_solve', 'button_solved_step'].includes(event_target_id):{
                //if not already solved then show lov
                if (CONSTANTS.cube.getState() != CONSTANTS.cube.getSolved().join(' '))
                    props.methods.COMMON.commonComponentRender({
                        mountDiv:   'common_app_dialogues_lov',
                        data:       {
                                    lov:                'CUSTOM',
                                    lov_custom_value:   'cube_solution'
                                    },
                        methods:    {
                                    functionData:       appCubeSolveLovData,
                                    functionRow:        event_target_id=='button_solved_step'?
                                                            appCubeSolveCubestateShowResult:
                                                                appCubeSolveShowResult,
                                    event_target:       event.target
                                    },
                        path:       '/common/component/common_app_dialogues_lov.js'});
                break;                      
            }
            case event_type=='click' && ['button_solve_cubestate', 'button_solved_step_cubestate'].includes(event_target_id):{
                CONSTANTS.cube_goalstate = props.methods.COMMON.commonWindowPrompt('?');
                if (CONSTANTS.cube_goalstate && CONSTANTS.cube_goalstate.split(' ').length==20)
                    props.methods.COMMON.commonComponentRender({
                    mountDiv:   'common_app_dialogues_lov',
                    data:       {
                                lov:                'CUSTOM',
                                lov_custom_value:   'cube_solution'
                                },
                    methods:    {
                                functionData:       appCubeSolveLovData,
                                functionRow:        appCubeSolveCubestateShowResult,
                                event_target:       event.target
                                },
                    path:       '/common/component/common_app_dialogues_lov.js'});
                else{
                    CONSTANTS.cube_goalstate = null;
                    props.methods.COMMON.commonMessageShow('INFO', null, 'message_text','!');
                }
                break;
            }
            case event_type=='click' && event_target_id=='button_info':{
                props.methods.COMMON.commonMessageShow('INFO', null, null,CONSTANTS.cube.getState());
                break;
            }
            case event_type=='click' && event.target.id.startsWith('button_solve_speed'):{
                props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll('.button_solve_speed').forEach((/**@type{HTMLElement}*/content) =>content.classList.remove('button_speed_selected'));
                event.target.classList.add('button_speed_selected');
                CONSTANTS.cube_controls.cube.turnSpeed = event.target.getAttribute('data-speed');
                break;
            }
            case event_type=='click' && ['button_step_info', 'button_step', 'button_step_move'].includes(event_target_id):{
                CONSTANTS.cube_controls.nextMove();
                break;
            }
            case event_type=='click' && event_target_id=='button_scramble':{
                CONSTANTS.cube_controls.cube.scramble(null, props.methods.COMMON.commonWindowSetTimeout);
                break;
            }
            
            case (event_type=='mousedown' || event_type=='touchstart') && event.target.classList.contains('cube_face'):{
                CONSTANTS.cube.mouseDown = true;
                if(event.touches && event.touches.length > 0){
                    event = event.touches[0];
                }
                CONSTANTS.cube.lastPos = {x:event.clientX,y:event.clientY};
                CONSTANTS.cube.affinediff = cube_lib.makeIdentityAffine();
                CONSTANTS.cube.render();
                break;
            }
            case (event_type=='mouseup' ||event_type =='touchend' ||event_type=='touchcancel') && event.target.classList.contains('cube_face'):{
                if(CONSTANTS.cube.mouseDown){
                    CONSTANTS.cube.mouseDown = false;
                    if(CONSTANTS.cube.affinediff){
                        CONSTANTS.cube.customAffine = cube_lib.multiplyAffine(CONSTANTS.cube.affinediff, CONSTANTS.cube.customAffine);
                    }
                    CONSTANTS.cube.affinediff = null;
                    CONSTANTS.cube.render();
                }
                break;
            }
            case (event_type == 'mousemove' || event_type=='touchmove') && event.target.classList.contains('cube_face'):{
                if(CONSTANTS.cube.mouseDown){
                    event.preventDefault();
                    if(event.touches && event.touches.length > 0){
                        event = event.touches[0];
                    }
                    const moved = {x:event.clientX - CONSTANTS.cube.lastPos.x, y:event.clientY-CONSTANTS.cube.lastPos.y};
                    CONSTANTS.cube.lastPos = {x:event.clientX,y:event.clientY};
                    CONSTANTS.cube.affinediff = cube_lib.multiplyAffine(cube_lib.multiplyAffine(cube_lib.makeRotateAffineX(moved.y/100), cube_lib.makeRotateAffineY(-moved.x/100)),CONSTANTS.cube.affinediff);
                    CONSTANTS.cube.render();
                }
                break;
            } 
        }
    };
    /**
     * @description Get cube solutions
     * @param {common['CommonAppEvent']['target']} event_target
     * @returns {Promise.<{
     *                      Id: string,
     *                      cube_solution: string
     *                      }[]>}
     */
    const appCubeSolveLovData = async event_target =>{
        //add class common_sse so SSE messages are displayed correctly
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_loading_progressbar_wrap')?
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#common_loading_progressbar_wrap').classList.add('common_sse'):
                null;
        if (CONSTANTS.cube.rotating == false){
            /**
             *  Solve using generative AI parameters
             * 
             *  model               0=Robot, 1=Human
             *  preamble            0=Singmaster notation
             *  temperature         0=best solution, 1=all solutions for given model
             *  cube current state  string of cube state
             *  cube goalstate      empty to solve or to given cube state
             */
            return await props.methods.COMMON.commonFFB({ path:'/app-common-module/CUBE_SOLVE', method:'POST', authorization_type:'APP_ID',
                                body:{  type:'FUNCTION',
                                        model:              Number(props.methods.COMMON.COMMON_DOCUMENT.querySelector('#app_select_model .common_select_dropdown_value')?.getAttribute('data-value')),
                                        IAM_data_app_id:    props.methods.COMMON.commonGlobalGet('app_id'),
                                        preamble:           0,
                                        temperature:        Number(props.methods.COMMON.COMMON_DOCUMENT.querySelector('#app_select_temperature .common_select_dropdown_value')?.getAttribute('data-value')),
                                        cube_currentstate: 	CONSTANTS.cube.getState(),
                                        cube_goalstate: 	CONSTANTS.cube_goalstate}, 
                                spinner_id:event_target.id,
                                //5 minutes timeout
                                timeout:1000 * 60 * 5}) 
                    .then((/**@type{string}*/result)=>{
                        /**
                         * @type{{cube_solution:string,
                         *        cube_solution_time:number,
                         *        cube_solution_length:number,
                         *        cube_solution_model:number}[]}
                         */
                        const cube_result = JSON.parse(result).rows;
                        if (cube_result.length>0){
                            return cube_result.map(row=>{return {
                                //use base64 for solution in id column
                                //replace single quote display with ’ to avoid string issues
                                Id:props.methods.COMMON.commonWindowToBase64(row.cube_solution, true), 
                                cube_solution: `${row.cube_solution_model==0?ICONS.robot:ICONS.human} 
                                                (${ICONS.moves}:${row.cube_solution_length}, ${ICONS.time}:${row.cube_solution_time}) - ${row.cube_solution.replaceAll('\'', '’')}`}; 
                            });
                        }
                        else{
                            if (event_target.id=='button_solve_cubestate' || event_target.id=='button_solved_step_cubestate')
                                props.methods.COMMON.commonMessageShow('INFO', null, 'message_text','!');
                            return [];
                        }
                    })
                    .catch(error=>{
                        props.methods.COMMON.commonComponentRemove('common_app_dialogues_lov');
                        props.methods.COMMON.commonMessageShow('ERROR_BFF', null, null,error);
                        return [];
                    })
                    .finally(()=>CONSTANTS.cube_goalstate=null);
        }
        else{
            CONSTANTS.cube_goalstate=null;
            return [];
        }
    };

    /**
     * @description Start cube moves or show step by step cube moves using solution chosen from lov
     * @param{{id:*, value:*}} record
     */
    const appCubeSolveShowResult = async record =>{
        CONSTANTS.cube_goalstate = null;
        const solution = props.methods.COMMON.commonWindowFromBase64(record.id);
        CONSTANTS.cube.makeMoves(solution);
    };
    /**
     * @param{{id:*, value:*}} record
     */
    const appCubeSolveCubestateShowResult = async record =>{
        const solution = props.methods.COMMON.commonWindowFromBase64(record.id);
        CONSTANTS.cube_controls.setSolution(solution);
    };
    const initCube = ()=>{
        CONSTANTS.cube = new cube_lib.RubiksCube( CONSTANTS.cube_width, props.methods.COMMON.commonWindowSetTimeout);
        CONSTANTS.cube.render();
        CONSTANTS.cube_controls = new cube_lib.RubiksCubeControls('button_controls', CONSTANTS.cube);
    };
    const onMounted =() =>{
        initCube();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template: template({icon_robot:ICONS.robot,
                            icon_human:ICONS.human, 
                            icon_solution:ICONS.solution,
                            icon_solution_list:ICONS.solution_list})
   };
};
export default component;