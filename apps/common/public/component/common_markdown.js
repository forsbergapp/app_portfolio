/**
 * Displays markdown document
 *         
 * @module apps/common/component/common_markdown
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @param {{app_logo:string,
 *          app_title:string,
 *          app_copyright:string,
 *          markdown :string,
 *          functionMarkdownParse:function
 *          }} props
 * @returns {string}
 */
const template = props =>`  <div class='common_markdown_header' style='background-image:url("${props.app_logo}")'>${props.app_title}</div>
                                <div class='common_markdown_article'>
                                    ${props.functionMarkdownParse(props.markdown)}
                                </div>
                            <div class='common_markdown_footer'>${props.app_copyright}</div>`;
/**
 * 
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_logo:string,
 *                      app_title:string,
 *                      app_copyright:string,
 *                      markdown:string,
 *                      },
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:   null,
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    /**
     * Converts given markdown file and mounts to given div id to supported div tags without any semantic HTML
     * Converts only sections, headings, code, code inline and images
     * Images should be clickable and displayed in windows info using event delegation
     * headings:
     * must start at first position on a row
     *                                  div class       comment
     * #                                title_h1
     * ##                               title_h2
     * ###                              title_h3
     * code:
     * code block must start as first position on a row, no support for inline code
     * ```                              code            code block
     * images:
     * [![text](small img)](full size img)  markdown_image  alt text should be used here as text below image
     *                                                      hover text is not supported
     * not supported:
     * ![alt text ](img "hover text")
     *         
     * @param {string} markdown
     * @returns {string}
     */
    const MarkdownParse = markdown =>{
        //remove all '\r' in '\r\n'
        markdown = markdown.replaceAll('\r\n','\n');
        //convert headings to section
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
                                            
        //convert headings #, ## and ##
        //correct syntax 
        //#[1 space character] []text,   ex # heading 1
        //##[1 space character] []text,  ex ## heading 2
        //###[1 space character] []text, ex ### heading 3
        //# must be first character in the row or it is not part of markdown parsing
        markdown = markdown.split('\n').map(row=>row.indexOf('#####')==0?`<div class='common_markdown_title_h5'>${row.replace('#####','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('####')==0?`<div class='common_markdown_title_h4'>${row.replace('####','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('###')==0?`<div class='common_markdown_title_h3'>${row.replace('###','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('##')==0?`<div class='common_markdown_title_h2'>${row.replace('##','')}</div>`:row).join('\n');
        markdown = markdown.split('\n').map(row=>row.indexOf('#')==0?`<div class='common_markdown_title_h1'>${row.replace('#','')}</div>`:row).join('\n');
        //convert code
        //regexp for code blocks
        const regexp_code = /```([\s\S]*?)```/g;
        let match_code;
        while ((match_code = regexp_code.exec(markdown)) !==null){
            markdown = markdown.replace(match_code[0], `<div class='common_markdown_code'>${match_code[1]}</div>`);
        }
        //convert code inline
        //regexp for code blocks
        const regexp_code_inline = /`([\s\S]*?)`/g;
        let match_code_inline;
        while ((match_code_inline = regexp_code_inline.exec(markdown)) !==null){
            markdown = markdown.replace(match_code_inline[0], `<div class='common_markdown_code_inline'>${match_code_inline[1]}</div>`);
        }
        //convert image tags
        //regexp for [![text](small img)](full size img)
        const regexp = /\[!\[([^)]+)\]\(([^)]+)\)\]\(([^)]+)\)/g;
        let match;
        while ((match = regexp.exec(markdown)) !==null){
            markdown = markdown.replace(match[0], 
                                        `<div 	class='common_markdown_image' 
                                                style='background-image:url("${match[2]}")' 
                                                data-url='${match[3]}'></div><div class='common_markdown_image_text'>${match[1]}</div>`);
        }
        return markdown;
    };
    
    return {
        lifecycle:  null,
        data:       null,
        methods:    null,
        template:   template({  app_logo:props.data.app_logo,
                                app_title:props.data.app_title,
                                app_copyright:props.data.app_copyright,
                                markdown:props.data.markdown,
                                functionMarkdownParse : MarkdownParse
        })
    };
};
export default component;