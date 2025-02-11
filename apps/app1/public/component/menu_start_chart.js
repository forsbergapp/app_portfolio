/**
 * Displays pie chart and bar chart
 * @module apps/app1/component/menu_start_chart
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_id:number|null,
 *          chart1_stat:{   chart:number,
 *                          app_id:number,
 *                          day:number,
 *                          amount:number,
 *                          statValue:string}[],
 *          function_chart1_pie_colors:function,
 *          function_chart1_legend:function,
 *          chart2_color_app_all:string,
 *          chart2_color_app:string,
 *          chart2_stat:{   chart:number,
 *                          app_id:number,
 *                          day:number,
 *                          amount:number,
 *                          statValue:string}[],
 *          chart2_legend_text:string,
 *          chart2_legend_text_apps:string}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_start_chart_box1'>
                                <div id='menu_start_chart_box1_title' class='menu_start_chart_box_title common_icon'></div>
                                <div id='menu_start_chart_box1_chart' class='menu_start_chart_box_chart'>
                                    <div id='menu_start_chart_box1_pie' style='background-image:conic-gradient(${props.function_chart1_pie_colors(props.chart1_stat)}'></div>
                                </div>
                                <div id='menu_start_chart_box1_legend' class='menu_start_chart_box_legend'>
                                    ${props.chart1_stat.map((stat,index)=>
                                        `<div class='menu_start_chart_box_legend_row'>
                                            <div id='menu_start_chart_box1_legend_col1' class='menu_start_chart_box_legend_col' style='background-color:rgb(${index/props.chart1_stat.length*200},${index/props.chart1_stat.length*200},255)'></div>
                                            <div id='menu_start_chart_box1_legend_col2' class='menu_start_chart_box_legend_col'>
                                                ${props.function_chart1_legend(stat.app_id, stat.statValue)}
                                            </div>
                                        </div>`
                                    ).join('')
                                    }    
                                </div>
                            </div>
                            <div id='menu_start_chart_box2'>
                                <div id='menu_start_chart_box2_title' class='menu_start_chart_box_title common_icon'></div>
                                <div id='menu_start_chart_box2_chart' class='menu_start_chart_box_chart'>
                                    <div id='menu_start_chart_box2_bar_legendY'>
                                        <div id='menu_start_chart_box2_bar_legend_max'>${Math.max(...props.chart2_stat.map(stat=>stat.amount))}</div>
                                        <div id='menu_start_chart_box2_bar_legend_medium'>${Math.max(...props.chart2_stat.map(stat=>stat.amount))/2}</div>
                                        <div id='menu_start_chart_box2_bar_legend_min'>0</div>
                                    </div>
                                    <div id='menu_start_chart_box2_bar_data'>
                                        ${props.chart2_stat.map(stat=>
                                            `<div class='menu_start_chart_box2_barcol menu_start_chart_box2_barcol_display' style='width:${100/props.chart2_stat.length}%'>
                                                <div class='menu_start_chart_box2_barcol_color' 
                                                    style='background-color:${props.app_id?props.chart2_color_app:props.chart2_color_app_all};height:${+stat.amount/Math.max(...props.chart2_stat.map(stat=>stat.amount))*100}%'>
                                                </div>
                                                <div class='menu_start_chart_box2_barcol_legendX'>${stat.day}</div>
                                            </div>`
                                        ).join('')
                                        }
                                    </div>
                                </div>
                                <div id='menu_start_chart_box2_legend' class='menu_start_chart_box_legend'>
                                    <div id='menu_start_chart_box2_legend_row' class='menu_start_chart_box_legend_row'>
                                        <div id='menu_start_chart_box2_legend_col1' class='menu_start_chart_box_legend_col' style='background-color:${props.app_id?props.chart2_color_app:props.chart2_color_app_all}'></div>
                                        <div id='menu_start_chart_box2_legend_col2' class='menu_start_chart_box_legend_col'>${props.chart2_legend_text}</div>
                                        <div id='menu_start_chart_box2_legend_col3' class='menu_start_chart_box_legend_col' style='background-color:${props.app_id?props.chart2_color_app:props.chart2_color_app_all}'></div>
                                        <div id='menu_start_chart_box2_legend_col4' class='menu_start_chart_box_legend_col'>${props.chart2_legend_text_apps}</div>
                                    </div>
                                </div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{ data:       {commonMountdiv:string},
 *           methods:    {
 *                       COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                       commonFFB:CommonModuleCommon['commonFFB']
 *                       },
 *           lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const app_id = props.methods.COMMON_DOCUMENT.querySelector('#menu_start_select_app .common_select_dropdown_value').getAttribute('data-value'); 
    const year = props.methods.COMMON_DOCUMENT.querySelector('#menu_start_select_year .common_select_dropdown_value').getAttribute('data-value'); 
    const month = props.methods.COMMON_DOCUMENT.querySelector('#menu_start_select_month .common_select_dropdown_value').getAttribute('data-value'); 

    // syntax {VALUE:'[ADMIN_statGroup]#[value]#[unique 0/1]#[statgroup]',                 TEXT:['[ADMIN_STATGROUP] - [VALUE replaced '_' with ' ']']},
    const admin_statGroup = 
        props.methods.COMMON_DOCUMENT.querySelector('#menu_start_select_stat .common_select_dropdown_value').getAttribute('data-value').split('#')[0].toUpperCase();
    const admin_statValues = 
        { value: props.methods.COMMON_DOCUMENT.querySelector('#menu_start_select_stat .common_select_dropdown_value').getAttribute('data-value').split('#')[1],
            unique:props.methods.COMMON_DOCUMENT.querySelector('#menu_start_select_stat .common_select_dropdown_value').getAttribute('data-value').split('#')[2],
            statGroup:props.methods.COMMON_DOCUMENT.querySelector('#menu_start_select_stat .common_select_dropdown_value').getAttribute('data-value').split('#')[3]
        };
    /**
     * Chart 2 pie colors
     * @param {[{amount:number}]} chart1
     * @returns {string}
     */
    const chart1_pie_colors = chart1 =>{
        let sum_amount =0;
        for (const stat of chart1) {
            sum_amount += +stat.amount;
        }
        let chart_colors = '';
        let degree_start = 0;
        let degree_stop = 0;

        let chart_color;
        chart1.forEach((stat, i)=>{
            //calculate colors and degree
            degree_stop = degree_start + +stat.amount/sum_amount*360;
            chart_color = `rgb(${i/chart1.length*200},${i/chart1.length*200},255) ${degree_start}deg ${degree_stop}deg`;
            if (i < chart1.length - 1)
                chart_colors += chart_color + ',';
            else
                chart_colors += chart_color;
            degree_start = degree_start + stat.amount/sum_amount*360;
        });
        return chart_colors; 
    };
    /**
     * Chart 1 legend
     * @param {number} stat_app_id
     * @param {string} stat_value
     * @returns {string}
     */
    const chart1_legend = (stat_app_id, stat_value) =>{
        if (admin_statGroup=='REQUEST')
            return stat_value;
        else
            return Array.from(props.methods.COMMON_DOCUMENT.querySelectorAll('#menu_start_select_stat .common_select_option')).filter(value=>value.getAttribute('data-value').split('#')[1]==stat_value)[0].textContent;

    };
    let query;
    if (admin_statGroup=='REQUEST'){
        query = `select_app_id=${app_id}&statGroup=${admin_statValues.statGroup}&statValue=&unique=${admin_statValues.unique}&year=${year}&month=${month}`;
    }
    else
        query = `select_app_id=${app_id}&statGroup=&statValue=${admin_statValues.value}&unique=&year=${year}&month=${month}`;
    
    //return result for both charts
    /**@type{{  chart:number,
     *          app_id:number,
     *          day:number,
     *          amount:number,
     *          statValue:string}[]} */
    const charts = await props.methods.commonFFB({path:'/server-db/log-stat', query:query, method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result).rows);
      
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({  app_id:app_id,
                                chart1_stat:charts.filter(row=> row.chart==1),
                                function_chart1_pie_colors:chart1_pie_colors,
                                function_chart1_legend:chart1_legend,
                                chart2_color_app_all:'rgb(81, 171, 255)',
                                chart2_color_app:'rgb(197 227 255)',
                                chart2_stat:charts.filter(row=> row.chart==2),
                                chart2_legend_text:props.methods.COMMON_DOCUMENT.querySelector('#menu_start_select_stat .common_select_dropdown_value').textContent,
                                chart2_legend_text_apps:props.methods.COMMON_DOCUMENT.querySelector('#menu_start_select_app .common_select_dropdown_value').textContent})
        };
};
export default component;