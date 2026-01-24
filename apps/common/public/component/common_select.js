/**
 * Common select
 * @module apps/common/component/common_select
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{default_data_value:string,
 *          default_value:string,
 *          options:[{value:string, text:string}]|[],
 *          column_value:string,
 *          column_text:string,
 *          class_dropdown_value:string|null,
 *          class_option:string|null,
 *          icons:{select:string}}} props
 * @returns {string}
 */
const template = props => ` <div class='common_select_dropdown'>
                                <div class='common_select_dropdown_value ${props.class_dropdown_value??''}' data-value='${props.default_data_value}'>${props.default_value}</div>
                                <div class='common_link common_icon_select_dropdown'>${props.icons.select}</div>
                            </div>
                            <div class='common_select_options'>
                                ${props.options.map(row=>
                                    /**@ts-ignore */
                                    `<div class='common_select_option ${props.class_option??''}' data-value='${row[props.column_value]}'>${row[props.column_text]}</div>`).join('')
                                }
                            </div>` ;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      default_data_value:string,
 *                      default_value:string,
 *                      options:[{value:string, text:string}],
 *                      column_value:string,
 *                      column_text:string,
 *                      class_dropdown_value?:string|null,
 *                      class_option?: string|null
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon']
 *                      }}} props
 * @returns {{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      events:  common['commonComponentEvents'],
 *                      template:string}}
 */
const component = props => {

    /**
     * @name events
     * @descption Events for map
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        const elementDiv = props.methods.COMMON.commonMiscElementDiv(event.target);
        
        //close all open div selects except current target
        if (event_type== 'click' && typeof props.methods.COMMON.commonMiscElementDiv(event.target)?.className=='string' && 
                ['common_select_dropdown', 
                'common_select_dropdown_value',
                'common_icon_select_dropdown',
                'common_select_options',
                'common_select_option']
                                                                    /**@ts-ignore */
                .filter(row=>elementDiv.className?.indexOf(row)>-1||elementDiv.parentNode?.className?.indexOf(row)>-1).length>0){
            Array.from(props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll(`#${props.methods.COMMON.commonGlobalGet('Parameters').app_root} .common_select_options`))
                .filter((/**@type{HTMLElement}*/element)=>props.methods.COMMON.commonMiscElementId(element) != props.methods.COMMON.commonMiscElementId(event.target))
                .forEach((/**@type{HTMLElement}*/element)=>element.style.display='none');
        }
        switch (true){
            case event_type== 'click' && props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`)?.classList?.contains('common_select') &&
                ['common_select_dropdown', 
                 'common_select_dropdown_value']
                                                                        /**@ts-ignore */
                .filter(row=>elementDiv.className?.indexOf(row)>-1 || elementDiv.parentNode?.className.indexOf(row)>-1 ).length>0:{
                //div , parent div or div with svg selected in dropdown
                props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_options`).style.display = 
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_options`).style.display=='block'?'none':'block';
                break;
            }
            case event_type== 'click' && props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`)?.classList?.contains('common_select') && 
                                                                            /**@ts-ignore */
                (elementDiv.classList.contains('common_select_option') || elementDiv.parentNode?.classList.contains('common_select_option')):{
                //div, parent div oor div with svg selected in option
                //select can show HTML, use innerHTML
                props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).innerHTML = 
                    props.methods.COMMON.commonMiscElementRow(event.target, 'common_select_option').innerHTML;
                props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`)
                    .setAttribute('data-value', props.methods.COMMON.commonMiscElementRow(event.target, 'common_select_option').getAttribute('data-value'));
                props.methods.COMMON.commonMiscElementRow(event.target, 'common_select_options').style.display = 'none';
                break;
            }
        }
    }
    const onMounted = async () =>{
        if (props.data.commonMountdiv !=null)
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_select');
   };
   
   return {
       lifecycle:  {onMounted:onMounted},
       data:   null,
       methods:null,
       events:     events,
       template: template({ 
                            default_data_value:props.data.default_data_value ?? '',
                            default_value:props.data.default_value ?? '',
                            options:props.data.options,
                            column_value:props.data.column_value,
                            column_text:props.data.column_text,
                            class_dropdown_value:props.data.class_dropdown_value??null,
                            class_option: props.data.class_option??null,
                            icons:{select:props.methods.COMMON.commonGlobalGet('ICONS')['select']}
                        })
   };
};
export default component;