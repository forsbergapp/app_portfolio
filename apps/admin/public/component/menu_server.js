/**
 * @module apps/admin/component/menu_server
 */
/**
 * Displays stat of users
 * @param {{spinner:string,
 *          function_seconds_to_time:function,
 *          server_info:{os:{   hostname:string,
 *                              cpus:{length:number},
 *                              arch:string,
 *                              freemem:number,
 *                              totalmem:number,
 *                              platform:string,
 *                              type:string,
 *                              release:string,
 *                              version:string,
 *                              uptime:number,
 *                              homedir:string,
 *                              tmpdir:string,
 *                              userinfo:{username:string, homedir:string}
 *                          },
 *                       process:{  memoryusage_rss:string,
 *                                  memoryusage_heaptotal:number,
 *                                  memoryusage_heapused:number,
 *                                  memoryusage_external:number,
 *                                  memoryusage_arraybuffers:number,
 *                                  uptime:number,
 *                                  version:string,
 *                                  path:string,
 *                                  start_arg_0:string,
 *                                  start_arg_1:string}}|null}} props
*/
const template = props => ` <div id='menu_10_content_widget1' class='widget'>
                                <div id='menu_10_os_title' class='common_icon'></div>
                                <div id='menu_10_os_info' class='${props.spinner}'>
                                    ${props.server_info?
                                        `<div id='menu_10_os_info_hostname_title'>HOSTNAME</div><div id='menu_10_os_info_hostname_data'>${props.server_info.os.hostname}</div>
                                        <div id='menu_10_os_info_cpus_title'>${'CPUS'}</div><div id='menu_10_os_info_cpus_data'>${props.server_info.os.cpus.length}</div>
                                        <div id='menu_10_os_info_arch_title'>${'ARCH'}</div><div id='menu_10_os_info_arch_data'>${props.server_info.os.arch}</div>
                                        <div id='menu_10_os_info_freemem_title'>${'FREEMEM'}</div><div id='menu_10_os_info_freemem_data'>${props.server_info.os.freemem}</div>
                                        <div id='menu_10_os_info_totalmem_title'>${'TOTALMEM'}</div><div id='menu_10_os_info_totalmem_data'>${props.server_info.os.totalmem}</div>
                                        <div id='menu_10_os_info_platform_title'>${'PLATFORM'}</div><div id='menu_10_os_info_platform_data'>${props.server_info.os.platform}</div>
                                        <div id='menu_10_os_info_type_title'>${'TYPE'}</div><div id='menu_10_os_info_type_data'>${props.server_info.os.type}</div>
                                        <div id='menu_10_os_info_release_title'>${'RELEASE'}</div><div id='menu_10_os_info_release_data'>${props.server_info.os.release}</div>
                                        <div id='menu_10_os_info_version_title'>${'VERSION'}</div><div id='menu_10_os_info_version_data'>${props.server_info.os.version}</div>
                                        <div id='menu_10_os_info_uptime_title'>${'UPTIME'}</div><div id='menu_10_os_info_uptime_data'>${props.function_seconds_to_time(props.server_info.os.uptime)}</div>
                                        <div id='menu_10_os_info_homedir_title'>${'HOMEDIR'}</div><div id='menu_10_os_info_homedir_data'>${props.server_info.os.homedir}</div>
                                        <div id='menu_10_os_info_tmpdir_title'>${'TMPDIR'}</div><div id='menu_10_os_info_tmpdir_data'>${props.server_info.os.tmpdir}</div>
                                        <div id='menu_10_os_info_userinfo_username_title'>${'USERNAME'}</div><div id='menu_10_os_info_userinfo_username_data'>${props.server_info.os.userinfo.username}</div>
                                        <div id='menu_10_os_info_userinfo_homedir_title'>${'USER HOMEDIR'}</div><div id='menu_10_os_info_userinfo_homedir_data'>${props.server_info.os.userinfo.homedir}</div>`:''
                                    }
                                </div>
                            </div>
                            <div id='menu_10_content_widget2' class='widget'>
                                <div id='menu_10_process_title' class='common_icon'></div>
                                <div id='menu_10_process_info'>
                                ${props.server_info?
                                    `<div id='menu_10_process_info_memoryusage_rss_title'>${'MEMORY RSS'}</div><div id='menu_10_process_info_memoryusage_rss_data'>${props.server_info.process.memoryusage_rss}</div>
                                    <div id='menu_10_process_info_memoryusage_heaptotal_title'>${'MEMORY HEAPTOTAL'}</div><div id='menu_10_process_info_memoryusage_heaptotal_data'>${props.server_info.process.memoryusage_heaptotal}</div>
                                    <div id='menu_10_process_info_memoryusage_heapused_title'>${'MEMORY HEAPUSED'}</div><div id='menu_10_process_info_memoryusage_heapused_data'>${props.server_info.process.memoryusage_heapused}</div>
                                    <div id='menu_10_process_info_memoryusage_external_title'>${'MEMORY EXTERNAL'}</div><div id='menu_10_process_info_memoryusage_external_data'>${props.server_info.process.memoryusage_external}</div>
                                    <div id='menu_10_process_info_memoryusage_arraybuffers_title'>${'MEMORY ARRAYBUFFERS'}</div><div id='menu_10_process_info_memoryusage_arraybuffers_data'>${props.server_info.process.memoryusage_arraybuffers}</div>
                                    <div id='menu_10_process_info_uptime_title'>${'UPTIME'}</div><div id='menu_10_process_info_uptime_data'>${props.function_seconds_to_time(props.server_info.process.uptime)}</div>
                                    <div id='menu_10_process_info_version_title'>${'NODEJS VERSION'}</div><div id='menu_10_process_info_version_data'>${props.server_info.process.version}</div>
                                    <div id='menu_10_process_info_path_title'>${'PATH'}</div><div id='menu_10_process_info_path_data'>${props.server_info.process.path}</div>
                                    <div id='menu_10_process_info_start_arg_0_title'>${'START ARG 0'}</div><div id='menu_10_process_info_start_arg_0_data'>${props.server_info.process.start_arg_0}</div>
                                    <div id='menu_10_process_info_start_arg_1_title'>${'START ARG 1'}</div><div id='menu_10_process_info_start_arg_1_data'>${props.server_info.process.start_arg_1}</div>`:''
                                }
                                </div>
                            </div>` ;
/**
* 
* @param {{common_document:import('../../../common_types.js').CommonAppDocument,
*          common_mountdiv:string,
*          function_FFB:function}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:null, 
*                      template:string}>}
*/
const component = async props => {
   /**
     * Seconds to time string
     * @param {number} seconds 
     * @returns {string}
     */
   const seconds_to_time = (seconds) => {
        let ut_sec = seconds;
        let ut_min = ut_sec/60;
        let ut_hour = ut_min/60;
        
        ut_sec = Math.floor(ut_sec);
        ut_min = Math.floor(ut_min);
        ut_hour = Math.floor(ut_hour);
        
        ut_hour = ut_hour%60;
        ut_min = ut_min%60;
        ut_sec = ut_sec%60;
        return `${ut_hour} Hour(s) ${ut_min} minute(s) ${ut_sec} second(s)`;
    };
   const post_component = async () =>{
       const server_info = await props.function_FFB('/server/info', null, 'GET', 'SYSTEMADMIN', null)
                               .then((/**@type{string}*/result)=>JSON.parse(result));
       
       props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({  spinner:'',
                                                                                                        function_seconds_to_time:seconds_to_time,
                                                                                                        server_info:server_info,
                                                                                                   });
   };
   /**
    * @param {{ spinner:string,
    *           function_seconds_to_time:function,
    *           server_info:{os:{   hostname:string,
    *                               cpus:{length:number},
    *                               arch:string,
    *                               freemem:number,
    *                               totalmem:number,
    *                               platform:string,
    *                               type:string,
    *                               release:string,
    *                               version:string,
    *                               uptime:number,
    *                               homedir:string,
    *                               tmpdir:string,
    *                               userinfo:{username:string, homedir:string}
    *                          },
    *                       process:{  memoryusage_rss:string,
    *                                  memoryusage_heaptotal:number,
    *                                  memoryusage_heapused:number,
    *                                  memoryusage_external:number,
    *                                  memoryusage_arraybuffers:number,
    *                                  uptime:number,
    *                                  version:string,
    *                                  path:string,
    *                                  start_arg_0:string,
    *                                  start_arg_1:string}}|null}} template_props
    */
   const render_template = template_props =>{
       return template({   spinner:template_props.spinner, 
                            function_seconds_to_time:template_props.function_seconds_to_time, 
                            server_info:template_props.server_info
       });
   };
   return {
       props:  {function_post:post_component},
       data:   null,
       template: render_template({ spinner:'css_spinner',
                                    function_seconds_to_time:seconds_to_time,
                                    server_info:null
       })
   };
};
export default component;