/**
 * Displays markdown document
 * Returns markdown document converted to HTML wrapped with metadata divs header, article and footer
 *         
 * @module apps/common/component/common_markdown
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{markdown :string,
 *          functionMarkdownParse:function
 *          }} props
 * @returns {string}
 */
const template = props =>`  ${props.functionMarkdownParse(props.markdown)}`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      markdown:string,
 *                      },
 *          methods:    null}} props
 * @returns {Promise.<string>}
 */
const component = async props => {
    
    /**
     * Converts given markdown file and mounts to given div id to supported div tags without any semantic HTML
     * Converts following in this order:
     * 1.sections
     *   # character must start at first position on a  row
     *   creates div with class common_markdown_section for all sections
     *   so all sections will have the correct indentations
     *   supports unlimited amount of heading levels although implemented h1-h5
     * 
     * 2.headings:
     *   # character must start at first position on a row
     *          div class
     *   #      title_h1
     *   ##     title_h2
     *   ###    title_h3
     *   ####   title_h4
     *   #####  title_h5
     * 
     * 3.code block:
     *   ```` must start as first position on a row and ends with ```` on a new row
     *   all text within is a code block
     * 
     * 4.code inline:
     *   text should be wrapped with `` and is processed after code block
     * 
     * 5.notes:
     *   > **Note:** must start as first position and text after must be on one row
     * 
     * 6.images:
     *   [![text](small img)](full size img)  
     *   creates class common_markdown_image  
     *   alt text should be used here as text below image
     *   hover text is not supported
     *   images should be clickable and displayed in windows info using event delegation
     * 
     *   not supported:
     *   ![alt text ](img "hover text")
     * 7.links
     *   [text](url)
     * 8.tables:
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
        //1.sections
        let current_section = -1;
        let old_section = -1;
        let sections = false;
        markdown = markdown.split('\n').map((row, /**@type{number}*/index)=>{
            let div = '';
            if (row.indexOf('#')==0){
                current_section = row.split(' ')[0].length;
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
                            sections = true;
                            div =   '\n' +
                                    '<div class=\'common_markdown_section\'>' + '\n' + row;
                            break;
                        }
                    }   
                old_section = row.split(' ')[0].length;
                return div;
            }
            else
                return row;
        }).join('\n') + '</div>' + (sections?'</div>':'');
                                            
        //2.headings        
        markdown = markdown.split('\n').map(row=>row.indexOf('#####')==0?`<div class='common_markdown_title_h5'>${row.replace('#####','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('####')==0?`<div class='common_markdown_title_h4'>${row.replace('####','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('###')==0?`<div class='common_markdown_title_h3'>${row.replace('###','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('##')==0?`<div class='common_markdown_title_h2'>${row.replace('##','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('#')==0?`<div class='common_markdown_title_h1'>${row.replace('#','')}</div>`:row).join('\n');
        //3. code blocks
        //regexp for code blocks
        const regexp_code = /```([\s\S]*?)```/g;
        let match_code;
        while ((match_code = regexp_code.exec(markdown)) !==null){
            markdown = markdown.replace(match_code[0], `<div class='common_markdown_code'>${match_code[1]}</div>`);
        }
        //4.code inline
        //regexp for code blocks
        const regexp_code_inline = /`([\s\S]*?)`/g;
        let match_code_inline;
        while ((match_code_inline = regexp_code_inline.exec(markdown)) !==null){
            markdown = markdown.replace(match_code_inline[0], `<div class='common_markdown_code_inline'>${match_code_inline[1]}</div>`);
        }
        //5.notes
        markdown = markdown.split('\n').map(row=>row.indexOf('> **Note:**')==0?`<div class='common_markdown_note'>${row.replace('> **Note:**','')}</div>`:row).join('\n');
        
        //6.images
        //regexp for [![text](small img)](full size img)
        const regexp = /\[!\[([^)]+)\]\(([^)]+)\)\]\(([^)]+)\)/g;
        let match;
        while ((match = regexp.exec(markdown)) !==null){
            markdown = markdown.replace(match[0], 
                                        `   <div class='common_markdown_image' data-url_small='${match[2]==null?'':match[2]}' data-url='${match[3]}'></div><div class='common_markdown_image_text'>${match[1]}</div>`);
        }
        //7.links
        //regexp for [text](url)
        const regexp_links = /\[([^)]+)\]\(([^)]+)\)/g;
        let match_links;
        while ((match_links = regexp_links.exec(markdown)) !==null){
            markdown = markdown.replace(match_links[0], 
                                        `<div class='common_link' data-href='${match_links[2]}' data-url='${match_links[2]}'>${match_links[2]}</div>`);
        }
        //8.tables
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
                    //add class for @method if not inside table with @metadata tag
                    `   <div class='common_markdown_table ${(table.indexOf('@method')>-1 && table.indexOf('@metadata')<0)?'common_markdown_table_method':''}'>
                            ${table.split('\n')
                                //remove alignemnt row and @method tag used to add css class for table but already presented in title
                                .filter(row=>row.indexOf('---')<0)
                                .filter(row=>(row.indexOf('@method')<0 && table.indexOf('@metadata')<0)||table.indexOf('@metadata')>-1)
                                .filter(row=>row.indexOf('@metadata')<0)
                                .map((row, index_row)=>
                                    `<div class='common_markdown_table_row ${(index_row % 2)==0?
                                                                                'common_markdown_table_row_odd':
                                                                                    'common_markdown_table_row_even'} ${index_row==0?
                                                                                                                            'common_markdown_table_row_title':
                                                                                                                                ''}'>${row
                                            .split('|').slice(1, -1)
                                            .map((text, index_col) =>
                                                    `<div class='common_markdown_table_col' style='${index_col==0?
                                                                                                        `min-width:
                                                                                                            ${width}em;`:
                                                                                                                ''}text-align:${align[index_col]}'>${text}</div>`
                                            ).join('')
                                        }
                                    </div>`
                                ).join('')}
                        </div>`);
        }
        return markdown;
    };
    
    return template({   markdown:props.data.markdown,
                        functionMarkdownParse : MarkdownParse
                    });
};
export default component;