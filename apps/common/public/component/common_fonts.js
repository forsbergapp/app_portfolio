/**
 * Lion to fonts
 * @module apps/common/component/common_fonts
 */

/**
 * @import {COMMON_DOCUMENT, CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{font_default:boolean|null,
 *          font_arabic:boolean|null,
 *          font_asian:boolean|null,
 *          font_prio1:boolean|null,
 *          font_prio2:boolean|null,
 *          font_prio3:boolean|null}} props 
 * @returns {string}
 */
const template = props =>`     ${props.font_default==false?'':`
                                   <!--Default font
                                       Fontawesome icons
                                       Noto Sans + Noto Sans Mono
                                   -->
                                   <link media='all' data-href='/common/css/font/font1.css' rel='stylesheet'>`
                               }
                               ${props.font_arabic==false?'':`
                                   <!--Arabic fonts
                                   Noto Sans Arabic
                                   Noto Kufi Arabic
                                   Noto Naskh Arabic
                                   Noto Nastaliq Urdu
                                   -->
                                   <link media='all' data-href='/common/css/font/font2.css' rel='stylesheet'>`
                               }
                               ${props.font_asian==false?'':`
                                   <!--Asian fonts
                                   Noto Sans JP
                                   Noto Sans KR
                                   Noto Sans HK
                                   Noto Sans SC
                                   Noto Sans TC
                                   -->
                                   <link media='all' data-href='/common/css/font/font3.css' rel='stylesheet'>`
                               }
                               ${props.font_prio1==false?'':`
                                   <!--Prio 1 fonts
                                   Noto Sans Bengali
                                   Noto Sans Gujarati
                                   Noto Sans Hebrew
                                   Noto Sans Javanese
                                   Noto Sans Kannada
                                   Noto Sans Khmer
                                   Noto Sans Malayalam
                                   Noto Sans Sinhala
                                   Noto Sans Sundanese
                                   Noto Sans Tagalog
                                   Noto Sans Tamil
                                   Noto Sans Telugu
                                   Noto Sans Thai
                                   -->
                                   <link media='all' data-href='/common/css/font/font4.css' rel='stylesheet'>`
                               }
                               ${props.font_prio2==false?'':`
                                   <!--Prio 2 fonts
                                   Noto Emoji
                                   Noto Sans Anatolian Hieroglyphs
                                   Noto Sans Egyptian Hieroglyphs
                                   Noto Sans Indic Siyaq NUmbers
                                   Noto Sans Math
                                   Noto Sans Music
                                   Noto Sans Symbols 2
                                   Noto Sans Symbols
                                   -->
                                   <link media='all' data-href='/common/css/font/font5.css' rel='stylesheet'>`
                               }
                               ${props.font_prio3==false?'':`
                                   <!--Prio 3 fonts
                                   Noto Sans Adlam Unjoined
                                   Noto Sans Adlam
                                   Noto Sans Armenian
                                   Noto Sans Avestan
                                   Noto Sans Balinese
                                   Noto Sans Bamum
                                   Noto Sans Bassa Vah
                                   Noto Sans Batak
                                   Noto Sans Bhaiksuki
                                   Noto Sans Brahmi
                                   Noto Sans Buginese
                                   Noto Sans Buhid
                                   Noto Sans Canadian Aboriginal
                                   Noto Sans Carian
                                   Noto Sans Caucasian Albanian
                                   Noto Sans Chakma
                                   Noto Sans Cham
                                   Noto Sans Cherokee
                                   Noto Sans Coptic
                                   Noto Sans Cuneiform
                                   Noto Sans Cypriot
                                   Noto Sans Deseret
                                   Noto Sans Duployan
                                   Noto Sans Elbasan
                                   Noto Sans Elymaic
                                   Noto Sans Georgian
                                   Noto Sans Glagolitic
                                   Noto Sans Gothic
                                   Noto Sans Grantha
                                   Noto Sans Gunjala Gondi
                                   Noto Sans Gurmukhi
                                   Noto Sans Hanifi Rohingya
                                   Noto Sans Hanunoo
                                   Noto Sans Hatran
                                   Noto Sans Imperial Aramaic
                                   Noto Sans Indic Devanagari
                                   Noto Sans Inscriptional Pahlavi
                                   Noto Sans Inscriptional Parthian
                                   Noto Sans Kaithi
                                   Noto Sans Kayah Li
                                   Noto Sans Kharoshthi
                                   Noto Sans Khojki
                                   Noto Sans Khudawadi
                                   Noto Sans Lao
                                   Noto Sans Lepcha
                                   Noto Sans Limbu
                                   Noto Sans Linear A
                                   Noto Sans Linear B
                                   Noto Sans Lisu
                                   Noto Sans Lycian
                                   Noto Sans Lydian
                                   Noto Sans Mahajani
                                   Noto Sans Mandaic
                                   Noto Sans Manichaean
                                   Noto Sans Marchen
                                   Noto Sans Masaram Gondi
                                   Noto Sans Mayan Numerals
                                   Noto Sans Medefaidrin
                                   Noto Sans Meetei Mayek
                                   Noto Sans Meroitic
                                   Noto Sans Miao
                                   Noto Sans Modi
                                   Noto Sans Mongolia
                                   Noto Sans Mro
                                   Noto Sans Multani
                                   Noto Sans Myanmar
                                   Noto Sans N'Ko
                                   Noto Sans Nabataean
                                   Noto Sans New Tai Lue
                                   Noto Sans Newa
                                   Noto Sans Nushu
                                   Noto Sans Ogham
                                   Noto Sans Ol Chiki
                                   Noto Sans Old Hungarian
                                   Noto Sans Old Italic
                                   Noto Sans Old North Arabian
                                   Noto Sans Old Permic
                                   Noto Sans Old Persian
                                   Noto Sans Old Sogdian
                                   Noto Sans Old South Arabian
                                   Noto Sans Old Turkic
                                   Noto Sans Oriya
                                   Noto Sans Osage
                                   Noto Sans Osmanya
                                   Noto Sans Pahawh Hmong
                                   Noto Sans Palmyrene
                                   Noto Sans Pau Cin Hau
                                   Noto Sans Phags Pa
                                   Noto Sans Phoenician
                                   Noto Sans Psalter Pahlavi
                                   Noto Sans Rejang
                                   Noto Sans Runic
                                   Noto Sans Samaritan
                                   Noto Sans Saurashtra
                                   Noto Sans Sharada
                                   Noto Sans Shavian
                                   Noto Sans Siddham
                                   Noto Sans Sogdian
                                   Noto Sans Sora Sompeng
                                   Noto Sans Soyombo
                                   Noto Sans Syloti Nagri
                                   Noto Sans Syriac
                                   Noto Sans Tagbanwa
                                   Noto Sans Tai Le
                                   Noto Sans Tai Tham
                                   Noto Sans Tai Viet
                                   Noto Sans Takri
                                   Noto Sans Tamil Supplement
                                   Noto Sans Thaana
                                   Noto Sans Tifinagh
                                   Noto Sans Tirhuta
                                   Noto Sans Traditional Nushu
                                   Noto Sans Ugaritic
                                   Noto Sans Vai
                                   Noto Sans Wancho
                                   Noto Sans Warang Citi
                                   Noto Sans Yi
                                   Noto Sans Zanabazar Square
                                   a-m
                                   font6
                                   m-
                                   font7
                                   -->
                                   <link media='all' data-href='/common/css/font/font6.css' rel='stylesheet'>
                                   <link media='all' data-href='/common/css/font/font7.css' rel='stylesheet'>`
                               }`;
/**
* @name component
* @description Component
* @function
* @param {{data:       {
*                      commonMountdiv:string,
*                      font_default:boolean|null,
*                      font_arabic:boolean|null,
*                      font_asian:boolean|null,
*                      font_prio1:boolean|null,
*                      font_prio2:boolean|null,
*                      font_prio3:boolean|null},
*          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT}}} props
* @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
*                      data:   null,
*                      methods:null,
*                      template:string}>}
*/
const component = async props => {
   
   return {
       lifecycle:  null,
       data:       null,
       methods:    null,
       template:   template({
                       font_default:   props.data.font_default,
                       font_arabic:    props.data.font_arabic,
                       font_asian:     props.data.font_asian,
                       font_prio1:     props.data.font_prio1,
                       font_prio2:     props.data.font_prio2,
                       font_prio3:     props.data.font_prio3
                   })
   };
};
export default component;