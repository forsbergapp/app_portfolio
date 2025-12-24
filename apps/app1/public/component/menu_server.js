/**
 * Displays stat of users
 * @module apps/app1/component/menu_server
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{function_seconds_to_time:function,
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
 * @returns {string}
 */
const template = props => ` <div id='menu_server_content_widget1' class='widget'>
                                <div id='menu_server_os_title' class='common_icon common_title'></div>
                                <div id='menu_server_os_info'>
                                    ${props.server_info?
                                        `<div id='menu_server_os_info_hostname_title'>HOSTNAME</div><div id='menu_server_os_info_hostname_data'>${props.server_info.os.hostname}</div>
                                        <div id='menu_server_os_info_cpus_title'>${'CPUS'}</div><div id='menu_server_os_info_cpus_data'>${props.server_info.os.cpus.length}</div>
                                        <div id='menu_server_os_info_arch_title'>${'ARCH'}</div><div id='menu_server_os_info_arch_data'>${props.server_info.os.arch}</div>
                                        <div id='menu_server_os_info_freemem_title'>${'FREEMEM'}</div><div id='menu_server_os_info_freemem_data'>${props.server_info.os.freemem}</div>
                                        <div id='menu_server_os_info_totalmem_title'>${'TOTALMEM'}</div><div id='menu_server_os_info_totalmem_data'>${props.server_info.os.totalmem}</div>
                                        <div id='menu_server_os_info_platform_title'>${'PLATFORM'}</div><div id='menu_server_os_info_platform_data'>${props.server_info.os.platform}</div>
                                        <div id='menu_server_os_info_type_title'>${'TYPE'}</div><div id='menu_server_os_info_type_data'>${props.server_info.os.type}</div>
                                        <div id='menu_server_os_info_release_title'>${'RELEASE'}</div><div id='menu_server_os_info_release_data'>${props.server_info.os.release}</div>
                                        <div id='menu_server_os_info_version_title'>${'VERSION'}</div><div id='menu_server_os_info_version_data'>${props.server_info.os.version}</div>
                                        <div id='menu_server_os_info_uptime_title'>${'UPTIME'}</div><div id='menu_server_os_info_uptime_data'>${props.function_seconds_to_time(props.server_info.os.uptime)}</div>
                                        <div id='menu_server_os_info_homedir_title'>${'HOMEDIR'}</div><div id='menu_server_os_info_homedir_data'>${props.server_info.os.homedir}</div>
                                        <div id='menu_server_os_info_tmpdir_title'>${'TMPDIR'}</div><div id='menu_server_os_info_tmpdir_data'>${props.server_info.os.tmpdir}</div>
                                        <div id='menu_server_os_info_userinfo_username_title'>${'USERNAME'}</div><div id='menu_server_os_info_userinfo_username_data'>${props.server_info.os.userinfo.username}</div>
                                        <div id='menu_server_os_info_userinfo_homedir_title'>${'USER HOMEDIR'}</div><div id='menu_server_os_info_userinfo_homedir_data'>${props.server_info.os.userinfo.homedir}</div>`:''
                                    }
                                </div>
                            </div>
                            <div id='menu_server_content_widget2' class='widget'>
                                <div id='menu_server_process_title' class='common_icon common_icon_title'></div>
                                <div id='menu_server_process_info'>
                                ${props.server_info?
                                    `<div id='menu_server_process_info_memoryusage_rss_title'>${'MEMORY RSS'}</div><div id='menu_server_process_info_memoryusage_rss_data'>${props.server_info.process.memoryusage_rss}</div>
                                    <div id='menu_server_process_info_memoryusage_heaptotal_title'>${'MEMORY HEAPTOTAL'}</div><div id='menu_server_process_info_memoryusage_heaptotal_data'>${props.server_info.process.memoryusage_heaptotal}</div>
                                    <div id='menu_server_process_info_memoryusage_heapused_title'>${'MEMORY HEAPUSED'}</div><div id='menu_server_process_info_memoryusage_heapused_data'>${props.server_info.process.memoryusage_heapused}</div>
                                    <div id='menu_server_process_info_memoryusage_external_title'>${'MEMORY EXTERNAL'}</div><div id='menu_server_process_info_memoryusage_external_data'>${props.server_info.process.memoryusage_external}</div>
                                    <div id='menu_server_process_info_memoryusage_arraybuffers_title'>${'MEMORY ARRAYBUFFERS'}</div><div id='menu_server_process_info_memoryusage_arraybuffers_data'>${props.server_info.process.memoryusage_arraybuffers}</div>
                                    <div id='menu_server_process_info_uptime_title'>${'UPTIME'}</div><div id='menu_server_process_info_uptime_data'>${props.function_seconds_to_time(props.server_info.process.uptime)}</div>
                                    <div id='menu_server_process_info_version_title'>${'NODEJS VERSION'}</div><div id='menu_server_process_info_version_data'>${props.server_info.process.version}</div>
                                    <div id='menu_server_process_info_path_title'>${'PATH'}</div><div id='menu_server_process_info_path_data'>${props.server_info.process.path}</div>
                                    <div id='menu_server_process_info_start_arg_0_title'>${'START ARG 0'}</div><div id='menu_server_process_info_start_arg_0_data'>${props.server_info.process.start_arg_0}</div>
                                    <div id='menu_server_process_info_start_arg_1_title'>${'START ARG 1'}</div><div id='menu_server_process_info_start_arg_1_data'>${props.server_info.process.start_arg_1}</div>`:''
                                }
                                </div>
                            </div>` ;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{ data:{      commonMountdiv:string},
 *           methods:{   COMMON:common['CommonModuleCommon']},
 *           lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
   
    const server_info = await props.methods.COMMON.commonFFB({path:'/server-info', method:'GET', authorization_type:'ADMIN'})
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows);

   
   return {
       lifecycle:   null,
       data:        null,
       methods:     null,
       template:    template({  function_seconds_to_time:props.methods.COMMON.commonMiscSecondsToTime,
                                server_info:server_info,
                            })
   };
};
export default component;