(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{1044:function(e,t,n){"use strict";n.r(t),n.d(t,"query",(function(){return f}));n(7);var r=n(0),o=n(185),c=n(1065),i=n(236),a=n.n(i),u={a:n(1061).a,table:function(e){return r.createElement("div",{style:{overflowX:"auto"}},r.createElement("table",e))}},l=function(e){var t=e.data.mdx,n=t.fields,i=t.body;return r.createElement(r.Fragment,null,r.createElement(a.a,{title:""+n.title}),r.createElement(o.MDXProvider,{components:u},r.createElement(c.MDXRenderer,null,i)))};t.default=l,l&&l===Object(l)&&Object.isExtensible(l)&&Object.defineProperty(l,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"GenericTemplate",filename:"src/templates/GenericTemplate.tsx"}});var f="1613804180";void 0!==f&&f&&f===Object(f)&&Object.isExtensible(f)&&Object.defineProperty(f,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"query",filename:"src/templates/GenericTemplate.tsx"}})},1061:function(e,t,n){"use strict";(function(e){n(7),n(14),n(15),n(10),n(17),n(9),n(184);var r=n(151),o=n(1063),c=n(0),i=n.n(c);var a=o.a.withComponent(r.Link),u=function(t){var n=t.href,r=t.to,c=function(e,t){if(null==e)return{};var n,r,o={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(t,["href","to"]);return function(t){return t.startsWith("http")&&!(e.window&&t.startsWith(window.location.origin))}(r=r||n||"")?i.a.createElement(o.a,Object.assign({to:r},c)):i.a.createElement(a,Object.assign({to:r},c))};t.a=u,u&&u===Object(u)&&Object.isExtensible(u)&&Object.defineProperty(u,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Link",filename:"src/components/Link.tsx"}})}).call(this,n(82))},1063:function(e,t,n){"use strict";n.d(t,"a",(function(){return b}));n(7),n(9);var r=n(16),o=n(5),c=n(0),i=n.n(c),a=n(1),u=n(58),l=n(3),f=n.n(l),s=n(2);function p(){var e=Object(r.a)(["\n  font-style: italic;\n  outline: none;\n  position: relative;\n\n  :link {\n    color: ",";\n  }\n\n  :visited {\n    color: ",";\n  }\n\n  :hover {\n    color: ",";\n  }\n\n  :focus {\n    color: ",";\n    background-color: ",";\n  }\n\n  ",";\n"]);return p=function(){return e},e}var b=Object(s.default)((function(e){var t=Object(u.a)(e),n=t.to,r=Object(o.a)(t,["to"]);return i.a.createElement("a",Object.assign({href:n},r))})).withConfig({displayName:"Link",componentId:"sc-39zdwh-0"})(p(),(function(e){return e.theme.colors.callToAction}),(function(e){return e.theme.colors.mediumContrast}),(function(e){return e.theme.colors.base}),(function(e){return e.theme.colors.callToAction}),(function(e){return e.theme.colors.transparentCTA}),a.v);void 0!==b&&b&&b===Object(b)&&Object.isExtensible(b)&&Object.defineProperty(b,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Link",filename:"../modules/cactus-web/dist/Link/Link.js"}}),b.propTypes={to:f.a.string.isRequired};void 0!==b&&b&&b===Object(b)&&Object.isExtensible(b)&&Object.defineProperty(b,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Link",filename:"../modules/cactus-web/dist/Link/Link.js"}})},1064:function(e,t,n){var r=n(19),o=n(117),c=n(98),i=n(44),a=n(38),u=n(39),l=n(419),f=(n(30).Reflect||{}).construct,s=u((function(){function e(){}return!(f((function(){}),[],e)instanceof e)})),p=!u((function(){f((function(){}))}));r(r.S+r.F*(s||p),"Reflect",{construct:function(e,t){c(e),i(t);var n=arguments.length<3?e:c(arguments[2]);if(p&&!s)return f(e,t,n);if(e==n){switch(t.length){case 0:return new e;case 1:return new e(t[0]);case 2:return new e(t[0],t[1]);case 3:return new e(t[0],t[1],t[2]);case 4:return new e(t[0],t[1],t[2],t[3])}var r=[null];return r.push.apply(r,t),new(l.apply(e,r))}var u=n.prototype,b=o(a(u)?u:Object.prototype),m=Function.apply.call(e,b,t);return a(m)?m:b}})},1065:function(e,t,n){var r=n(1066);e.exports={MDXRenderer:r}},1066:function(e,t,n){function r(e,t,n){return(r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}()?Reflect.construct:function(e,t,n){var r=[null];r.push.apply(r,t);var c=new(Function.bind.apply(e,r));return n&&o(c,n.prototype),c}).apply(null,arguments)}function o(e,t){return(o=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){u(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n(54),n(15),n(17),n(51),n(116),n(37),n(22),n(14),n(64),n(23),n(10),n(1064),n(1064),n(64),n(51),n(116),n(23),n(37),n(54),n(22),n(14),n(15),n(10),n(17);var l=n(0),f=n(185),s=f.useMDXComponents,p=f.mdx,b=n(238).useMDXScope;e.exports=function(e){var t=e.scope,n=e.components,o=e.children,i=function(e,t){if(null==e)return{};var n,r,o={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,["scope","components","children"]),u=s(n),f=b(t),m=l.useMemo((function(){if(!o)return null;var e=a({React:l,mdx:p},f),t=Object.keys(e),n=t.map((function(t){return e[t]}));return r(Function,["_fn"].concat(c(t),[""+o])).apply(void 0,[{}].concat(c(n)))}),[o,t]);return l.createElement(m,a({components:u},i))}}}]);
//# sourceMappingURL=component---src-templates-generic-template-tsx-08869c9249f0ee3604f8.js.map