(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"85IP":function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"a",(function(){return d}));var r=n("tqLc");function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}for(var o,i={},c=function(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return a(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}(Object.entries(r).filter((function(e){return"iconSizes"!==e[0]})));!(o=c()).done;){var l=o.value,s=l[0],m=l[1],u=s.replace(/(.)([A-Z])/,"$1-$2").toLowerCase(),f=u.split("-"),p=f[0],b=f.slice(1).join(" ");i.hasOwnProperty(p)||(i[p]=[]),i[p].push({name:b,fullName:s,path:u,category:p,Icon:m})}var d=Object.keys(i).sort();void 0!==d&&d&&d===Object(d)&&Object.isExtensible(d)&&!d.hasOwnProperty("__filemeta")&&Object.defineProperty(d,"__filemeta",{configurable:!0,value:{name:"categories",filename:"src/helpers/iconGroups.ts"}}),void 0!==i&&i&&i===Object(i)&&Object.isExtensible(i)&&!i.hasOwnProperty("__filemeta")&&Object.defineProperty(i,"__filemeta",{configurable:!0,value:{name:"iconsCategoryMap",filename:"src/helpers/iconGroups.ts"}})},DzJA:function(e,t,n){"use strict";n.r(t);var r=n("96a4"),a=n("mXGw"),o=n("Hrl7"),i=n("UutA"),c=n("EHAY"),l=n("85IP"),s=i.default.code.withConfig({displayName:"available-icons__Code",componentId:"proks7-0"})(["white-space:nowrap;font-size:9.6px;"]),m=i.default.pre.withConfig({displayName:"available-icons__Pre",componentId:"proks7-1"})(["padding:","px;background-color:",";white-space:pre-line;"],(function(e){return e.theme.space[4]}),(function(e){return e.theme.colors.lightGray})),u="\nimport * as React from 'react'\nimport { ActionsAdd, ActionsDelete } from '@repay/cactus-icons'\n\nexport default () => (\n  <React.Fragment>\n    <ActionsAdd />\n    <ActionsDelete />\n  </React.Fragment>\n)\n".trim(),f="\nimport * as React from 'react'\nimport ActionsAdd from '@repay/cactus-icons/i/actions-add'\nimport ActionsDelete from '@repay/cactus-icons/i/actions-delete'\n\nexport default () => (\n  <React.Fragment>\n    <ActionsAdd />\n    <ActionsDelete />\n  </React.Fragment>\n)\n".trim();t.default=function(){return a.createElement(a.Fragment,null,a.createElement(o.a,{title:"Available Icons"}),a.createElement(c.b,{as:"h1",fontSize:"h1"},"Available Icons"),a.createElement(c.b,null,"The icon library allows icons to be imported in two different manners."),a.createElement(c.b,null,"From the root by name:"),a.createElement(m,null,u),a.createElement(c.b,null,"Individually by file path:"),a.createElement(m,null,f),a.createElement(c.b,null,"See below for the list of available icons and the names and paths by which they can be referenced."),l.a.map((function(e){var t=l.b[e];return a.createElement(a.Fragment,{key:e},a.createElement(c.b,{as:"h3",fontSize:"h3",style:{textTransform:"capitalize"}},e),a.createElement(r.a,{flexWrap:"wrap",justifyContent:"start"},t.map((function(e){var t=e.fullName,n=e.path,o=e.Icon;return a.createElement(r.a,{key:n,m:4,flexBasis:"64px",flexDirection:"column",alignItems:"center"},a.createElement(o,{style:{fontSize:"40px"}}),a.createElement(c.b,{m:0,fontSize:"12px"},t),a.createElement(s,null,"/i/",n))}))))})))}},EHAY:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n("UutA"),a=n("FbDh"),o=Object(r.default)("p").withConfig({displayName:"Text",componentId:"yhr4g7-0"})(a.y,a.o,a.i,a.j,a.n,a.q,a.A,a.p,a.u,a.t),i=o.withComponent("span");void 0!==i&&i&&i===Object(i)&&Object.isExtensible(i)&&!i.hasOwnProperty("__filemeta")&&Object.defineProperty(i,"__filemeta",{configurable:!0,value:{name:"Span",filename:"src/components/Text.tsx"}}),t.b=o,void 0!==o&&o&&o===Object(o)&&Object.isExtensible(o)&&!o.hasOwnProperty("__filemeta")&&Object.defineProperty(o,"__filemeta",{configurable:!0,value:{name:"Text",filename:"src/components/Text.tsx"}})}}]);
//# sourceMappingURL=component---src-pages-icons-available-icons-tsx-cabb4ef63e970052e080.js.map