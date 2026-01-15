/**
 * Displays Javascript code with code line or parsed Markdown document in document container
 *         
 * @module apps/common/component/common_document
 */
/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{app_logo:string,
 *          app_copyright:string,
 *          app_name:string,
 *          document :string,
 *          documentType:common['commonDocumentType'],
 *          document_href:string,
 *          functionMarkdownParse:(arg0:string)=>string
 *          }} props
 * @returns {string}
 */
const template = props =>`  <div id='${'common_document_' + Date.now()}' class='common_document'>
                                <div class='common_document_header'>
                                    <div>${props.app_logo}</div><div>${props.app_name}</div>
                                </div>
                                <div class='common_document_body ${props.documentType=='MODULE_CODE'?'common_md common_code':'common_md'}'>
                                    ${props.documentType=='MODULE_CODE'?
                                        props.document
                                        .replaceAll('\r\n','\n').split('\n')
                                        .map((/**@type{string}*/row,/**@type{number}*/index)=>{
                                            const selected_class = (props.document_href.split('#line')[1] == (index+1).toString())?'common_code_line_selected':'';
                                            //split rows into two columns and highlight selected line if #line is used in link
                                            return `<div    data-line='${index+1}' class='common_code_line ${selected_class}'>${index+1}</div><div    data-line='${index+1}' class='common_code_text ${selected_class}'>${row.replaceAll('<','&lt;').replaceAll('>','&gt;')}</div>`;
                                        }).join('\n') ?? '':
                                        props.functionMarkdownParse(props.document)
                                    }
                                </div>
                                <div class='common_document_footer'>${props.app_copyright}</div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      common_app_id:number
 *                      app_logo:string,
 *                      app_copyright:string,
 *                      app_name:string,
 *                      href:string,
 *                      title:string,
 *                      documentType:common['commonDocumentType']
 *                      },
 *          methods:    {
 *                       COMMON:common['CommonModuleCommon']
 *                      }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:   null,
 *                      methods:null,
 *                      events:  common['commonComponentEvents'],
 *                      template:string}>}
 */
const component = async props => {
    /**
     * Converts given markdown file and mounts to given div id to supported div tags without any semantic HTML
     * Converts following in this order:
     * 1.headings:
     *   # character must start at first position on a row
     *          div class
     *   #      title_h1
     *   ##     title_h2
     *   ###    title_h3
     *   ####   title_h4
     *   #####  title_h5
     * 
     * 2.code block:
     *   ```` must start as first position on a row and ends with ```` on a new row
     *   all text within is a code block
     * 
     * 3.code inline:
     *   text should be wrapped with `` and is processed after code block
     * 
     * 4.notes:
     *   > **Note:** must start as first position and text after must be on one row
     * 
     * 5.images:
     *   [![text](small img)](full size img)  
     *   creates class common_md_image  
     *   alt text should be used here as text below image
     *   hover text is not supported
     *   images should be clickable and displayed in windows info using event delegation
     * 
     *   not supported:
     *   ![alt text ](img "hover text")
     * 6.links
     *   [text](url)
     * 7.tables:
     *   | must start as first position on a row
     *   unlimited columns supported
     *   unlimited rows supported
     * 
     *   |Header|Header|    header row
     *   |------|------|    alignment row, must contain at least --- 
     *   |Data  |Data  |    Data rows the rest
     *   |...   |...   |
     * 
     *   alignment row syntax
     *   
     *   center: :- and -: in cell
     *   start : :- in cell
     *   end   : -: in cell
     *   ''    : no : found in cell 
     *   css used:
     *   style:text-align: center|start|end|'' start and end is used to support RTL and LTR direction
     * 8.bold and italic
     *   ***text*** anywhere in text
     * 9.bold
     *   **text** anywhere in text
     * 10. correct all HTML entities after parsing
     * @param {string} markdown
     * @returns {string}
     */
    const MarkdownParse = markdown =>{
        //remove all '\r' in '\r\n'
        let html = markdown.replaceAll('\r\n','\n');
                                            
        //1.headings        
        html = html.split('\n').map(row=>row.indexOf('#####')==0?`<div class='common_md_title_h5'>${row.replace('#####','')}</div>`:row).join('\n');
        html = html.split('\n').map(row=>row.indexOf('####')==0?`<div class='common_md_title_h4'>${row.replace('####','')}</div>`:row).join('\n');
        html = html.split('\n').map(row=>row.indexOf('###')==0?`<div class='common_md_title_h3'>${row.replace('###','')}</div>`:row).join('\n');
        html = html.split('\n').map(row=>row.indexOf('##')==0?`<div class='common_md_title_h2'>${row.replace('##','')}</div>`:row).join('\n');
        html = html.split('\n').map(row=>row.indexOf('#')==0?`<div class='common_md_title_h1'>${row.replace('#','')}</div>`:row).join('\n');
        //2. code blocks
        //regexp for code blocks
        const regexp_code = /```([\s\S]*?)```/g;
        let match_code;
        while ((match_code = regexp_code.exec(html)) !==null){
            html = html.replace(match_code[0], `<div class='common_md_code'>${match_code[1]}</div>`);
        }
        //3.code inline
        //regexp for code blocks
        const regexp_code_inline = /`([\s\S]*?)`/g;
        let match_code_inline;
        while ((match_code_inline = regexp_code_inline.exec(html)) !==null){
            html = html.replace(match_code_inline[0], `<div class='common_md_code_inline'>${match_code_inline[1]}</div>`);
        }
        //4.notes
        html = html.split('\n').map(row=>row.indexOf('> **Note:**')==0?`<div class='common_md_note'><div class='common_md_note_info'>${props.methods.COMMON.commonGlobalGet('ICONS')['info'] + '</div>' + row.replace('> **Note:**','')}</div>`:row).join('\n');
        
        //5.images
        //regexp for [![text](small img)](full size img)
        const regexp = /\[!\[([^)]+)\]\(([^)]+)\)\]\(([^)]+)\)/g;
        let match;
        while ((match = regexp.exec(html)) !==null){
            html = html.replace(match[0], 
                                        `   <div class='common_md_image' data-url_small='${match[2]==null?'':match[2]}' data-url='${match[3]}'></div><div class='common_md_image_text'>${match[1]}</div>`);
        }
        //6.links
        //regexp for [text](url)
        const regexp_links = /\[([^)]+)\]\(([^)]+)\)/g;
        let match_links;
        while ((match_links = regexp_links.exec(html)) !==null){
            html = html.replace(match_links[0], 
                                        `<div class='common_link' data-href='${match_links[2]}' data-url='${match_links[2]}'>${match_links[2]}</div>`);
        }
        //7.tables
        let table_new = true;
        const tables = html.split('\n').
                        map(row=>{
                            if (row.indexOf('|')==0)
                                if (table_new){
                                    table_new = false;
                                    return '*TABLE*' + row;
                                }
                                else
                                    return row;
                            else{
                                table_new = true;
                                return '';
                            }
                        }).filter(row=>row!='').join('\n').split('*TABLE*');
        for (const table of tables.filter(row=>row!='')){
            const align = table.split('\n').filter(row=>row.indexOf('---')>-1)[0].split('|').slice(1, -1).map(row=>
                (row.indexOf(':-')>-1 && row.indexOf('-:')>-1)?
                    'center':
                        row.indexOf(':-')>-1?
                            'start':
                                row.indexOf('-:')>-1?
                                    'end':
                                        ''
            );
            html = html.replace(table, 
                    //add extra extended markdown syntax: if first table row starts width |{#kv} or |{#2kv} then apply corresponding class with specific columns widths
                    `<div class='common_md_tab ${table.split('\n')[0].startsWith('|{#kv}')?
                                                    'common_md_tab_kv':
                                                        table.split('\n')[0].startsWith('|{#2kv}')?
                                                            'common_md_tab_2kv':
                                                                ''}'>${
                                table.split('\n')
                                //remove alignment row 
                                .filter(row=>row.indexOf('---')<0)
                                .map((row, index_row)=>
                                    `<div class='common_md_tab_row ${(index_row % 2)==0?
                                                                                'common_md_tab_row_odd':
                                                                                    'common_md_tab_row_even'} ${index_row==0?
                                                                                                                            'common_md_tab_row_title':
                                                                                                                                ''}'>${row
                                            .split('|').slice(1, -1)
                                            .map((text, index_col) =>
                                                    `<div class='common_md_tab_col${index_col+1}' ${align[index_col]==''?'':`style='text-align:${align[index_col]}'`}>${text}</div>`
                                            ).join('')
                                        }
                                    </div>`
                                ).join('')}
                        </div>`);
        }
        //8.bold and italic
        //regexp for ***text***
        const regexp_bold_italic = /\*\*\*([\s\S]*?)\*\*\*/g;
        let match_bold_italic;
        while ((match_bold_italic = regexp_bold_italic.exec(html)) !==null){
            html = html.replace(match_bold_italic[0], `<div class='common_md_bold_italic'>${match_bold_italic[1]}</div>`);
        }
        //9.bold
        //regexp for **text**
        const regexp_bold = /\*\*([\s\S]*?)\*\*/g;
        let match_bold;
        while ((match_bold = regexp_bold.exec(html)) !==null){
            html = html.replace(match_bold[0], `<div class='common_md_bold'>${match_bold[1]}</div>`);
        }
        //10. correct all HTML entities after parsing
        return html
                //use in code block in table columns
                .replaceAll('&crarr;','\n')
                //use in code blocks so it does not intefere with bold
                .replaceAll('&Star;','*')
                //use in table title and inside first column and first value 
                //to add key value class for 2 column tables or double key value class for 3 column tables
                .replaceAll('{#kv}','')
                .replaceAll('{#2kv}','');
    };
    
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
        
        switch (true){
            case event_type== 'click' && 
                ((typeof event.target.className=='string'?event.target.className.indexOf('common_md_tab_col')>-1:false) && 
                    props.methods.COMMON.commonMiscElementRow(event.target, 'common_md_tab_row').classList?.contains('common_md_tab_row_title')):{
                //hide and show feature in document
                if (props.methods.COMMON.commonMiscElementRow(event.target, 'common_md_tab').classList?.contains('hide'))
                    props.methods.COMMON.commonMiscElementRow(event.target, 'common_md_tab').classList?.remove('hide');
                else
                    props.methods.COMMON.commonMiscElementRow(event.target, 'common_md_tab').classList?.add('hide');
                break;
            }
            case event_type== 'click' && event.target.classList.contains('common_md_image'):{
                //markdown document tags
                if (event.target.getAttribute('data-url_link'))
                    props.methods.COMMON.commonComponentRender({
                        mountDiv:   'common_app_window_info',
                        data:       {
                                    info:'IMAGE',
                                    url:event.target.getAttribute('data-url_link'),
                                    },
                        methods:    null,
                        path:       '/common/component/common_app_window_info.js'});
                break;
            }
            case event_type== 'click' && props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.contains('common_document'):{
                //display document except common_link that uses its own event
                if (!event.target.classList.contains('common_link'))
                    props.methods.COMMON.commonComponentRender({
                        mountDiv:   'common_app_window_info',
                        data:       {
                                    info:'HTML',
                                    content:props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${event_target_id}`).outerHTML,
                                    },
                        methods:    null,
                        path:       '/common/component/common_app_window_info.js'});
                break;
            }
        }
    }

    const onMounted = async () =>{
        if (props.data.href.split('#')[1]){
            //set focus on highlighted row
            Array.from(props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll(`[data-line='${props.data.href.split('#line')[1]}'`))[0].setAttribute('tabindex',0);
            Array.from(props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll(`[data-line='${props.data.href.split('#line')[1]}'`))[0].focus();
        }
        for (const image_div of props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll(`#${props.data.commonMountdiv} .common_md_image`)){
            (image_div.getAttribute('data-url_small')==''||image_div.getAttribute('data-url_small')==null)?
                null:
                    props.methods.COMMON.commonMiscResourceFetch(image_div.getAttribute('data-url_small')??'', image_div,'image/webp');
            (image_div.getAttribute('data-url')==''||image_div.getAttribute('data-url')==null)?
                null:
                    //set attribute that is read by image click event
                    image_div.setAttribute('data-url_link', 
                                            await props.methods.COMMON.commonMiscResourceFetch(image_div.getAttribute('data-url')??'', null,'image/webp'));
        }

    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        events:     events,
        template:   template({  app_logo:props.methods.COMMON.commonGetApp().Logo,
                                app_copyright:props.methods.COMMON.commonGetApp().Copyright,
                                app_name:props.methods.COMMON.commonGetApp().Name,
                                document:await props.methods.COMMON.commonFFB({  path:'/app-common-module/COMMON_DOC', 
                                                                        method:'POST', 
                                                                        authorization_type:'APP_ID',
                                                                        body:{  type:'FUNCTION',
                                                                                documentType:props.data.documentType,
                                                                                IAM_data_app_id:props.methods.COMMON.commonGlobalGet('app_common_app_id'),
                                                                                doc:(props.data.href.split('#').length>1?props.data.href.split('#')[0]:props.data.href)} })
                                                        .catch(()=>null),
                                documentType:props.data.documentType,
                                document_href:props.data.href,
                                functionMarkdownParse : MarkdownParse
                            })
    };
};
export default component;