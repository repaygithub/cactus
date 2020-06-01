(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{1048:function(e,t,n){"use strict";n.r(t);n(21);var r=n(0),a=n(1067),o=n(1060),i=n(236),c=n.n(i),s=n(1061),l=n(1062);t.default=function(){return r.createElement(r.Fragment,null,r.createElement(c.a,{title:"Icons"}),r.createElement(l.b,{as:"h1",fontSize:"h1"},"Icons"),r.createElement(l.b,null,"Icons should be descriptive, simple, readable, and consistent. Use them to communicate an action, status, or help separate objects in a list. In other words, icons can represent objects, tools, actions, or desired results."),r.createElement(l.b,{as:"h2",fontSize:"h2"},"Available Icons"),r.createElement(l.b,null,"All icons are part of a category based on primary purpose. Some generic icons will by used outside the named purposed due to utility."),r.createElement(l.b,null,"To learn how to use the icons see the ",r.createElement(s.a,{href:"/icons/"},"Icons documentation"),"."),a.a.map((function(e){var t=a.b[e];return r.createElement(r.Fragment,{key:e},r.createElement(l.b,{as:"h3",fontSize:"h3",style:{textTransform:"capitalize"}},e),r.createElement(o.a,{flexWrap:"wrap",justifyContent:"start"},t.map((function(e){var t=e.name,n=e.path,a=e.Icon;return r.createElement(o.a,{key:n,m:4,flexBasis:"64px",flexDirection:"column",alignItems:"center"},r.createElement(a,{style:{fontSize:"40px"}}),r.createElement(l.b,{m:0,fontSize:"12px"},t))}))))})),r.createElement(l.b,{mt:6,mb:5,fontSize:"h3"},"Lastly, the ",r.createElement(s.a,{href:"/design-system/shared-styles/"},"shared styles")," such as shadows and spacing which round out the foundation."))}},1061:function(e,t,n){"use strict";(function(e){n(7),n(14),n(15),n(10),n(17),n(9),n(184);var r=n(151),a=n(1063),o=n(0),i=n.n(o);var c=a.a.withComponent(r.Link),s=function(t){var n=t.href,r=t.to,o=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(t,["href","to"]);return function(t){return t.startsWith("http")&&!(e.window&&t.startsWith(window.location.origin))}(r=r||n||"")?i.a.createElement(a.a,Object.assign({to:r},o)):i.a.createElement(c,Object.assign({to:r},o))};t.a=s,s&&s===Object(s)&&Object.isExtensible(s)&&Object.defineProperty(s,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Link",filename:"src/components/Link.tsx"}})}).call(this,n(82))},1062:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));n(7);var r=n(1),a=n(2),o=Object(a.default)("p").withConfig({displayName:"Text",componentId:"yhr4g7-0"})(r.y,r.o,r.i,r.j,r.n,r.q,r.A,r.p,r.u,r.t),i=o.withComponent("span");void 0!==i&&i&&i===Object(i)&&Object.isExtensible(i)&&Object.defineProperty(i,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Span",filename:"src/components/Text.tsx"}}),t.b=o,void 0!==o&&o&&o===Object(o)&&Object.isExtensible(o)&&Object.defineProperty(o,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Text",filename:"src/components/Text.tsx"}})},1063:function(e,t,n){"use strict";n.d(t,"a",(function(){return b}));n(7),n(9);var r=n(16),a=n(5),o=n(0),i=n.n(o),c=n(1),s=n(58),l=n(3),u=n.n(l),m=n(2);function f(){var e=Object(r.a)(["\n  font-style: italic;\n  outline: none;\n  position: relative;\n\n  :link {\n    color: ",";\n  }\n\n  :visited {\n    color: ",";\n  }\n\n  :hover {\n    color: ",";\n  }\n\n  :focus {\n    color: ",";\n    background-color: ",";\n  }\n\n  ",";\n"]);return f=function(){return e},e}var b=Object(m.default)((function(e){var t=Object(s.a)(e),n=t.to,r=Object(a.a)(t,["to"]);return i.a.createElement("a",Object.assign({href:n},r))})).withConfig({displayName:"Link",componentId:"sc-39zdwh-0"})(f(),(function(e){return e.theme.colors.callToAction}),(function(e){return e.theme.colors.mediumContrast}),(function(e){return e.theme.colors.base}),(function(e){return e.theme.colors.callToAction}),(function(e){return e.theme.colors.transparentCTA}),c.v);void 0!==b&&b&&b===Object(b)&&Object.isExtensible(b)&&Object.defineProperty(b,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Link",filename:"../modules/cactus-web/dist/Link/Link.js"}}),b.propTypes={to:u.a.string.isRequired};void 0!==b&&b&&b===Object(b)&&Object.isExtensible(b)&&Object.defineProperty(b,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Link",filename:"../modules/cactus-web/dist/Link/Link.js"}})},1067:function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return h}));n(7),n(36),n(26),n(37),n(22),n(17),n(69),n(14),n(15),n(10),n(237);var r=n(29),a={},o=Object.entries(r).filter((function(e){return"iconSizes"!==e[0]})),i=Array.isArray(o),c=0;for(o=i?o:o[Symbol.iterator]();;){var s;if(i){if(c>=o.length)break;s=o[c++]}else{if((c=o.next()).done)break;s=c.value}var l=s,u=l[0],m=l[1],f=u.replace(/(.)([A-Z])/,"$1-$2").toLowerCase(),b=f.split("-"),p=b[0],d=b.slice(1).join(" ");a.hasOwnProperty(p)||(a[p]=[]),a[p].push({name:d,fullName:u,path:f,category:p,Icon:m})}var h=Object.keys(a).sort();void 0!==h&&h&&h===Object(h)&&Object.isExtensible(h)&&Object.defineProperty(h,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"categories",filename:"src/helpers/iconGroups.ts"}}),void 0!==a&&a&&a===Object(a)&&Object.isExtensible(a)&&Object.defineProperty(a,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"iconsCategoryMap",filename:"src/helpers/iconGroups.ts"}})}}]);
//# sourceMappingURL=component---src-pages-design-system-icons-tsx-484b13d427cfb5c95a4f.js.map