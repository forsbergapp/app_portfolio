/**
 * Displays markdown document
 * Returns markdown document converted to HTML wrapped with metadata divs header, article and footer
 *         
 * @module apps/common/component/common_markdown
 */
/**
 * @import { server_db_file_app, server_db_file_app_translation} from '../../../../server/types.js' 
 */

/**
 * @param {{markdown :string,
 *          functionMarkdownParse:function
 *          }} props
 * @returns {string}
 */
const template = props =>`  ${props.functionMarkdownParse(props.markdown)}`;
/**
 * 
 * @param {{data:       {
 *                      app_translation:server_db_file_app_translation|null,
 *                      app:server_db_file_app|null,
 *                      type:'GUIDE'|'APP'|'JSDOC_MODULE',
 *                      markdown:string,
 *                      code:string|null,
 *                      module:string|null
 *                      },
 *          methods:    null}} props
 * @returns {Promise.<string>}
 */
const component = async props => {
    /**
     * Return supported characters as HTML Entities for tables
     * @param {string} text
     * @returns {string}
     */
    const HTMLEntities = text => text
                                    .replaceAll('|','&vert;')
                                    .replaceAll('[','&#91;')
                                    .replaceAll(']','&#93;')
                                    .replaceAll('<','&lt;')
                                    .replaceAll('>','&gt;');
    /**
     * Converts given markdown file and mounts to given div id to supported div tags without any semantic HTML
     * Converts following in this order:
     * 1. variables for APP template and JSDOC MODULE
     * 2.sections
     *   # character must start at first position on a  row
     *   creates div with class common_markdown_section for all sections
     *   so all sections will have the correct indentations
     *   supports unlimited amount of heading levels although implemented h1-h5
     * 
     * 3.headings:
     *   # character must start at first position on a row
     *          div class
     *   #      title_h1
     *   ##     title_h2
     *   ###    title_h3
     *   ####   title_h4
     *   #####  title_h5
     * 
     * 4.code block:
     *   ```` must start as first position on a row and ends with ```` on a new row
     *   all text within is a code block
     * 
     * 5.code inline:
     *   text should be wrapped with `` and is processed after code block
     * 
     * 6.notes:
     *   > **Note:** must start as first position and text after must be on one row
     * 
     * 7.images:
     *   [![text](small img)](full size img)  
     *   creates class common_markdown_image  
     *   alt text should be used here as text below image
     *   hover text is not supported
     *   images should be clickable and displayed in windows info using event delegation
     * 
     *   not supported:
     *   ![alt text ](img "hover text")
     * 8.links
     *   [text](url)
     * 9.tables:
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
     * 
     * @param {string} markdown
     * @returns {string}
     */
    const MarkdownParse = markdown =>{
        //remove all '\r' in '\r\n'
        markdown = markdown.replaceAll('\r\n','\n');
        //1.replace variables for APP template
        if (props.data.type=='APP' && props.data.app){
            //replace APP_NAME
            markdown = markdown.replaceAll('@{APP_NAME}', props.data.app.name);
            //replace SCREENSHOT_START
            markdown = markdown.replaceAll('@{SCREENSHOT_START}', props.data.app_translation?props.data.app_translation.json_data.screenshot_start:'');
            //replace DESCRIPTION
            markdown = markdown.replaceAll('@{DESCRIPTION}', props.data.app_translation?props.data.app_translation.json_data.description:'');
            //replace REFERENCE
            markdown = markdown.replaceAll('@{REFERENCE}', props.data.app_translation?props.data.app_translation.json_data.reference:'');
            //replace TECHNOLOGY
            markdown = markdown.replaceAll('@{TECHNOLOGY}', props.data.app_translation?props.data.app_translation.json_data.technology:'');
            //replace SECURITY
            markdown = markdown.replaceAll('@{SECURITY}', props.data.app_translation?props.data.app_translation.json_data.security:'');
            //replace PATTERN
            markdown = markdown.replaceAll('@{PATTERN}', props.data.app_translation?props.data.app_translation.json_data.pattern:'');
            //replace SOLUTION
            markdown = markdown.replaceAll('@{SOLUTION}', props.data.app_translation?props.data.app_translation.json_data.solution:'');
            //replace SCREENSHOT_END
            //images are saved in an array
            markdown = markdown.replaceAll('@{SCREENSHOT_END}', props.data.app_translation?props.data.app_translation.json_data.screenshot_end.join('\n'):'');    
        }
        if (props.data.type=='JSDOC_MODULE'){
            markdown = markdown.replaceAll('@{MODULE_NAME}', props.data.module ?? '');
            markdown = markdown.replaceAll('@{MODULE}',props.data.module ??'');
            markdown = markdown.replaceAll('@{SOURCE_LINK}',props.data.module ??'');
                                        
            //search all JSDoc comments
            const regexp_module_function = /\/\*\*([\s\S]*?)\*\//g;
            
            const module_functions =[];
            let match_module_function;

            //JSDOC module table with variables
            const HEADER            = '|@{TYPE}         |@{FUNCTION_NAME}                       |';
            const ALIGNMENT         = '|:---------------|:--------------------------------------|';
            const FUNCTION_TAG      = '|@{FUNCTION_TAG} |@{FUNCTION_TEXT}                       |';
            const SOURCE_LINE_TAG   = '|Source line     |[@{MODULE_LINE}](@{SOURCE_LINE_LINK)   |';
            
            const REGEXP_TAG = /@\w+/g;
            props.data.code = props.data.code?.replaceAll('\r\n','\n') ??'';
            while ((match_module_function = regexp_module_function.exec(props.data.code ?? '')) !==null){
                //JSDoc must have @function tag or @module tag
                if (match_module_function[0].indexOf('@function')>-1 ||match_module_function[0].indexOf('@module')>-1){
                    const function_tags = match_module_function[1].split('\n')
                                            .map(row=>{
                                                        //reset regexp so regexp will work in loop
                                                        REGEXP_TAG.lastIndex = 0;
                                                        const tag = REGEXP_TAG.exec(row)?.[0]??'';
                                                        return FUNCTION_TAG
                                                        .replace(   '@{FUNCTION_TAG}',
                                                                    tag)
                                                        .replace(   '@{FUNCTION_TEXT}',
                                                                    //check if tag exists
                                                                    (tag!='' && row.indexOf(tag)>-1)?
                                                                        //return part after tag
                                                                        HTMLEntities(row.substring(row
                                                                                        .indexOf(tag)+tag.length)
                                                                                        .trimStart()):
                                                                            //no tag, return after first '*', remove start space characters
                                                                            HTMLEntities(row
                                                                                .substring(row.indexOf('*')+1)));
                                                        }).join('\n');
                    //calculate source line: row match found + match row length
                    const source_line = (props.data.code?props.data.code.substring(0,props.data.code.indexOf(match_module_function[1])).split('\n').length:0)  + 
                                        match_module_function[1].split('\n').length;

                    module_functions.push(
                                    HEADER
                                        .replace('@{TYPE}',match_module_function[1].indexOf('@module')>-1?'Module':'Function')
                                        .replace('@{FUNCTION_NAME}',match_module_function[1].split('\n').filter(row=>row.indexOf('@name')>-1).length>0?
                                                                    match_module_function[1].split('\n').filter(row=>row.indexOf('@name'))[1]:'')
                                    + '\n' +
                                    ALIGNMENT+ '\n' +
                                    function_tags + '\n' +
                                    SOURCE_LINE_TAG
                                        .replace('@{MODULE_LINE}',props.data.module ??'')
                                        .replace('@{SOURCE_LINE_LINK',`${props.data.module}#line${source_line}`));
                }
                
            }
            //replace all found JSDoc comments with markdown formatted module functions
            markdown = markdown.replace('@{MODULE_FUNCTION}', module_functions.join('\n'+'\n'));
        }
        //2.sections
        let current_section = -1;
        let old_section = -1;
        markdown = markdown.split('\n').map((row, /**@type{number}*/index)=>{
            let div = '';
            if (row.indexOf('#')==0){
                current_section = row.split('#').length;
                if (index==0)
                    div = '<div class=\'common_markdown_section\'>' + '\n' + row;
                else
                    switch (true){
                        case current_section == old_section:{
                            div =   '</div>' + '\n' +
                                    '<div class=\'common_markdown_section\'>' + '\n' + row;
                            break;
                        }
                        case current_section < old_section:{
                            div +='</div>' + '\n';
                            for (let i=1;i<=(old_section - current_section);i++){
                                div +='</div>' + '\n';
                            }
                            div +=  '<div class=\'common_markdown_section\'>' + '\n' + row;
                            break;
                        }
                        case current_section > old_section:{
                            div =   '\n' +
                                    '<div class=\'common_markdown_section\'>' + '\n' + row;
                            break;
                        }
                    }   
                old_section = row.split('#').length;
                return div;
            }
            else
                return row;
        }).join('\n') + '</div>';
                                            
        //3.headings        
        markdown = markdown.split('\n').map(row=>row.indexOf('#####')==0?`<div class='common_markdown_title_h5'>${row.replace('#####','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('####')==0?`<div class='common_markdown_title_h4'>${row.replace('####','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('###')==0?`<div class='common_markdown_title_h3'>${row.replace('###','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('##')==0?`<div class='common_markdown_title_h2'>${row.replace('##','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('#')==0?`<div class='common_markdown_title_h1'>${row.replace('#','')}</div>`:row).join('\n');
        //4. code blocks
        //regexp for code blocks
        const regexp_code = /```([\s\S]*?)```/g;
        let match_code;
        while ((match_code = regexp_code.exec(markdown)) !==null){
            markdown = markdown.replace(match_code[0], `<div class='common_markdown_code'>${match_code[1]}</div>`);
        }
        //5.code inline
        //regexp for code blocks
        const regexp_code_inline = /`([\s\S]*?)`/g;
        let match_code_inline;
        while ((match_code_inline = regexp_code_inline.exec(markdown)) !==null){
            markdown = markdown.replace(match_code_inline[0], `<div class='common_markdown_code_inline'>${match_code_inline[1]}</div>`);
        }
        //6.notes
        markdown = markdown.split('\n').map(row=>row.indexOf('> **Note:**')==0?`<div class='common_markdown_note'>${row.replace('> **Note:**','')}</div>`:row).join('\n');
        
        //7.images
        //regexp for [![text](small img)](full size img)
        const regexp = /\[!\[([^)]+)\]\(([^)]+)\)\]\(([^)]+)\)/g;
        let match;
        while ((match = regexp.exec(markdown)) !==null){
            markdown = markdown.replace(match[0], 
                                        `<div 	class='common_markdown_image' 
                                                style='background-image:url("${match[2]}")' 
                                                data-url='${match[3]}'></div><div class='common_markdown_image_text'>${match[1]}</div>`);
        }
        //8.links
        //regexp for [text](url)
        const regexp_links = /\[([^)]+)\]\(([^)]+)\)/g;
        let match_links;
        while ((match_links = regexp_links.exec(markdown)) !==null){
            markdown = markdown.replace(match_links[0], 
                                        `<div class='common_link' href='${match_links[2]}' data-url='${match_links[2]}'>${match_links[2]}</div>`);
        }
        //9.tables
        let table_new = true;
        const tables = markdown.split('\n').
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
                (row.indexOf(':-')>-1 && row.indexOf('-:')>-1)?'center':row.indexOf(':-')>-1?'start':row.indexOf('-:')>-1?'end':''
            );
            //get max length of first column and set max length 40em (half width)
            //use number to calculate width/80
            const width = Math.min(Math.max(...table.split('\n').map(row=>(row.split('|')[1]??'').length)),40);
            //return with HTML Entities for tables
            markdown = markdown.replace(table, 
                    `<div class='common_markdown_table'>${table.split('\n').filter(row=>row.indexOf('---')<0).map((row, index_row)=>
                        `<div class='common_markdown_table_row ${(index_row % 2)==0?'common_markdown_table_row_odd':'common_markdown_table_row_even'} ${index_row==0?'common_markdown_table_row_title':''}'>${
                            row.split('|').slice(1, -1).map((text, index_col) =>`<div class='common_markdown_table_col' style='${index_col==0?`min-width:${width}em;`:''}text-align:${align[index_col]}'>${text}</div>`).join('')
                        }</div>`
                    ).join('')}</div>`);
        }
        return markdown;
    };
    
    return template({   markdown:props.data.markdown,
                        functionMarkdownParse : MarkdownParse
                    });
};
export default component;