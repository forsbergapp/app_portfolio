/**
 * @module apps/admin/component/menu_start_chart
 */
/**
 * Displays pie chart and bar chart
 * 
 */
/**
 * @param {{spinner:string,
 *          system_admin:string|null,
 *          app_id:number|null,
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
 */
const template = props => ` <div id='box1' class='${props.spinner}'>
                                ${props.spinner==''?
                                    `<div id='box1_title' class='box_title ${props.system_admin!=null?'system_admin':'admin'} common_icon'></div>
                                    <div id='box1_chart' class='box_chart'>
                                        <div id='box1_pie' style='background-image:conic-gradient(${props.function_chart1_pie_colors(props.chart1_stat)}'></div>
                                    </div>
                                    <div id='box1_legend' class='box_legend'>
                                        ${props.chart1_stat.map((stat,index)=>
                                            `<div class='box_legend_row'>
                                                <div id='box1_legend_col1' class='box_legend_col' style='background-color:rgb(${index/props.chart1_stat.length*200},${index/props.chart1_stat.length*200},255)'></div>
                                                <div id='box1_legend_col2' class='box_legend_col'>
                                                    ${props.function_chart1_legend(stat.app_id, stat.statValue)}
                                                </div>
                                            </div>`
                                        ).join('')
                                        }    
                                    </div>`:''
                                }
                            </div>
                            <div id='box2'>
                                ${props.spinner==''?
                                    `<div id='box2_title' class='box_title ${props.system_admin!=null?'system_admin':'admin'} common_icon'></div>
                                    <div id='box2_chart' class='box_chart'>
                                        <div id='box2_bar_legendY'>
                                            <div id='box2_bar_legend_max'>${Math.max(...props.chart2_stat.map(stat=>stat.amount))}</div>
                                            <div id='box2_bar_legend_medium'>${Math.max(...props.chart2_stat.map(stat=>stat.amount))/2}</div>
                                            <div id='box2_bar_legend_min'>0</div>
                                        </div>
                                        <div id='box2_bar_data'>
                                            ${props.chart2_stat.map(stat=>
                                                `<div class='box2_barcol box2_barcol_display' style='width:${100/props.chart2_stat.length}%'>
                                                    <div class='box2_barcol_color' 
                                                        style='background-color:${props.app_id?props.chart2_color_app:props.chart2_color_app_all};height:${+stat.amount/Math.max(...props.chart2_stat.map(stat=>stat.amount))*100}%'>
                                                    </div>
                                                    <div class='box2_barcol_legendX'>${stat.day}</div>
                                                </div>`
                                            ).join('')
                                            }
                                        </div>
                                    </div>
                                    <div id='box2_legend' class='box_legend'>
                                        <div id='box2_legend_row' class='box_legend_row'>
                                            <div id='box2_legend_col1' class='box_legend_col' style='background-color:${props.app_id?props.chart2_color_app:props.chart2_color_app_all}'></div>
                                            <div id='box2_legend_col2' class='box_legend_col'>${props.chart2_legend_text}</div>
                                            ${props.system_admin!=null?
                                                `<div id='box2_legend_col3' class='box_legend_col' style='background-color:${props.app_id?props.chart2_color_app:props.chart2_color_app_all}'></div>
                                                <div id='box2_legend_col4' class='box_legend_col'>${props.chart2_legend_text_apps}</div>`:
                                                ''
                                            }
                                        </div>
                                    </div>`:''
                                }
                            </div>`;
/**
* 
* @param {{common_document:import('../../../common_types.js').CommonAppDocument,
*          common_mountdiv:string,
*          system_admin:string,
*          function_ComponentRender:function,
*          function_FFB:function}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:null,
*                      template:string}>}
*/
const component = async props => {
    const app_id = props.common_document.querySelector('#select_app_menu1 .common_select_dropdown_value').getAttribute('data-value'); 
    const year = props.common_document.querySelector('#select_year_menu1 .common_select_dropdown_value').getAttribute('data-value'); 
    const month = props.common_document.querySelector('#select_month_menu1 .common_select_dropdown_value').getAttribute('data-value'); 

    // syntax {VALUE:'[ADMIN_statGroup]#[value]#[unique 0/1]#[statgroup]',                 TEXT:['[ADMIN_STATGROUP] - [VALUE replaced '_' with ' ']']},
    const system_admin_statGroup = props.system_admin!=null?
    props.common_document.querySelector('#select_system_admin_stat .common_select_dropdown_value').getAttribute('data-value').split('#')[0].toUpperCase():null;
    const system_admin_statValues = props.system_admin!=null?
        { value: props.common_document.querySelector('#select_system_admin_stat .common_select_dropdown_value').getAttribute('data-value').split('#')[1],
            unique:props.common_document.querySelector('#select_system_admin_stat .common_select_dropdown_value').getAttribute('data-value').split('#')[2],
            statGroup:props.common_document.querySelector('#select_system_admin_stat .common_select_dropdown_value').getAttribute('data-value').split('#')[3]
        }:{value:0, unique:0, statGroup:0};
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
        if (props.system_admin!=null)
            if (system_admin_statGroup=='REQUEST')
                return stat_value;
            else
                return Array.from(props.common_document.querySelectorAll('#select_system_admin_stat .common_select_option')).filter(value=>value.getAttribute('data-value').split('#')[1]==stat_value)[0].innerText;
        else{
            return Array.from(props.common_document.querySelectorAll('#select_app_menu1 .common_select_option')).filter(app=>parseInt(app.getAttribute('data-value'))==stat_app_id)[0].innerText;
        }

    };
    const post_component = async () =>{
        let path;
        let query;
        let authorization_type;
        if (props.system_admin!=null){
            path = '/server-log/log-stat';
            if (system_admin_statGroup=='REQUEST'){
                query = `select_app_id=${app_id}&statGroup=${system_admin_statValues.statGroup}&statValue=&unique=${system_admin_statValues.unique}&year=${year}&month=${month}`;
            }
            else
                query = `select_app_id=${app_id}&statGroup=&statValue=${system_admin_statValues.value}&unique=&year=${year}&month=${month}`;
            authorization_type = 'SYSTEMADMIN';
        }
        else{
            path = '/server-db_admin/app_data_stat-log-stat';
            query = `select_app_id=${app_id}&year=${year}&month=${month}`;
            authorization_type = 'APP_ACCESS';
        }
        //return result for both charts
        /**@type{{  chart:number,
         *          app_id:number,
         *          day:number,
         *          amount:number,
         *          statValue:string}[]} */
        const charts = await props.function_FFB(path, query, 'GET', authorization_type, null).then((/**@type{string}*/result)=>JSON.parse(result).rows);

       props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({   spinner:'', 
                                                                                                        system_admin:props.system_admin, 
                                                                                                        app_id:app_id,
                                                                                                        chart1_stat:charts.filter(row=> row.chart==1),
                                                                                                        function_chart1_pie_colors:chart1_pie_colors,
                                                                                                        function_chart1_legend:chart1_legend,
                                                                                                        chart2_color_app_all:'rgb(81, 171, 255)',
                                                                                                        chart2_color_app:'rgb(197 227 255)',
                                                                                                        chart2_stat:charts.filter(row=> row.chart==2),
                                                                                                        chart2_legend_text:props.system_admin!=null?
                                                                                                                                props.common_document.querySelector('#select_system_admin_stat .common_select_dropdown_value').innerText:
                                                                                                                                props.common_document.querySelector('#select_app_menu1 .common_select_dropdown_value').innerText,
                                                                                                        chart2_legend_text_apps:props.system_admin!=null?
                                                                                                                                    props.common_document.querySelector('#select_app_menu1 .common_select_dropdown_value').innerText:
                                                                                                                                    ''});
  };
/**
* @param {{ spinner:string,
*           system_admin:string|null,
*           app_id:number|null,
*           chart1_stat:{  chart:number,
*                          app_id:number,
*                          day:number,
*                          amount:number,
*                          statValue:string}[],
*           function_chart1_pie_colors:function,
*           function_chart1_legend:function,
*           chart2_color_app_all:string,
*           chart2_color_app:string,
*           chart2_stat:{   chart:number,
*                          app_id:number,
*                          day:number,
*                          amount:number,
*                          statValue:string}[],
*           chart2_legend_text:string,
*           chart2_legend_text_apps:string}} template_props
*/
const render_template = template_props =>{
   return template({spinner:template_props.spinner,
                    system_admin:template_props.system_admin,
                    app_id:template_props.app_id,
                    chart1_stat:template_props.chart1_stat,
                    function_chart1_pie_colors:template_props.function_chart1_pie_colors,
                    function_chart1_legend:template_props.function_chart1_legend,
                    chart2_color_app_all:template_props.chart2_color_app_all,
                    chart2_color_app:template_props.chart2_color_app,
                    chart2_stat:template_props.chart2_stat,
                    chart2_legend_text:template_props.chart2_legend_text,
                    chart2_legend_text_apps:template_props.chart2_legend_text_apps
   });
};
return {
   props:  {function_post:post_component},
   data:   null,
   template: render_template({  spinner:'css_spinner', 
                                system_admin:props.system_admin, 
                                app_id:app_id,
                                chart1_stat:[],
                                function_chart1_pie_colors:chart1_pie_colors,
                                function_chart1_legend:chart1_legend,
                                chart2_color_app_all:'rgb(81, 171, 255)',
                                chart2_color_app:'rgb(197 227 255)',
                                chart2_stat:[],
                                chart2_legend_text:'',
                                chart2_legend_text_apps:''})
};
};
export default component;