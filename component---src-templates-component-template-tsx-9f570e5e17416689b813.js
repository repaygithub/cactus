(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"+Sw5":function(e,t){e.exports=function(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}},"0qAl":function(e,t){e.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}},"5WRv":function(e,t,n){var r=n("iNmH"),o=n("Qatm"),c=n("Zhxd"),i=n("kluZ");e.exports=function(e){return r(e)||o(e)||c(e)||i()}},"8lrx":function(e,t,n){var r=n("uUj8"),o=n("5WRv"),c=n("OvAC"),i=n("PE9J");function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var s=n("mXGw"),f=n("/FXl").mdx,l=n("U+ow").useMDXScope;e.exports=function(e){var t=e.scope,n=e.children,c=i(e,["scope","children"]),a=l(t),p=s.useMemo((function(){if(!n)return null;var e=u({React:s,mdx:f},a),t=Object.keys(e),c=t.map((function(t){return e[t]}));return r(Function,["_fn"].concat(o(t),[""+n])).apply(void 0,[{}].concat(o(c)))}),[n,t]);return s.createElement(p,u({},c))}},Aon3:function(e,t,n){"use strict";n.r(t),n.d(t,"query",(function(){return f}));var r=n("oYCi"),o=n("/FXl"),c=n("jRwh"),i=(n("mXGw"),n("Hrl7")),a=n("5ef+"),u={a:n("nQb1").a},s=function(e){var t=e.data,n=t.docgenDb.db,s=t.mdx,f=s.body,l=s.fields,p=[];try{p=JSON.parse(n)}catch(b){console.error(b)}return Object(r.jsxs)(r.Fragment,{children:[Object(r.jsx)(i.a,{title:""+l.title}),Object(r.jsx)(a.a,{docs:p,children:Object(r.jsx)(r.Fragment,{children:Object(r.jsx)(o.MDXProvider,{components:u,children:Object(r.jsx)(c.MDXRenderer,{children:f})})})})]})};t.default=s,void 0!==s&&s&&s===Object(s)&&Object.isExtensible(s)&&!s.hasOwnProperty("__filemeta")&&Object.defineProperty(s,"__filemeta",{configurable:!0,value:{name:"ComponentTemplate",filename:"src/templates/ComponentTemplate.tsx"}});var f="2954593704";void 0!==f&&f&&f===Object(f)&&Object.isExtensible(f)&&!f.hasOwnProperty("__filemeta")&&Object.defineProperty(f,"__filemeta",{configurable:!0,value:{name:"query",filename:"src/templates/ComponentTemplate.tsx"}})},EApT:function(e,t,n){"use strict";n.d(t,"a",(function(){return O}));var r=n("UO5U"),o=n("dV/x"),c=n("W0B4"),i=n.n(c),a=n("mXGw"),u=n.n(a),s=n("UutA"),f=n("FbDh"),l=n("U4Ox");function p(){var e=Object(r.a)(["\n  font-style: italic;\n  outline: none;\n\n  :link {\n    color: ",";\n  }\n\n  :visited {\n    color: ",";\n  }\n\n  :hover {\n    color: ",";\n  }\n\n  :focus {\n    color: ",";\n    background-color: ",";\n  }\n\n  ",";\n"]);return p=function(){return e},e}var b=u.a.forwardRef((function(e,t){var n=Object(l.a)(e),r=n.to,c=Object(o.a)(n,["to"]);return u.a.createElement("a",Object.assign({ref:t,href:r},c))})),O=Object(s.default)(b).withConfig({displayName:"Link",componentId:"sc-39zdwh-0"})(p(),(function(e){return e.theme.colors.callToAction}),(function(e){return e.theme.colors.mediumContrast}),(function(e){return e.theme.colors.base}),(function(e){return e.theme.colors.callToAction}),(function(e){return e.theme.colors.transparentCTA}),f.p);void 0!==O&&O&&O===Object(O)&&Object.isExtensible(O)&&!O.hasOwnProperty("__filemeta")&&Object.defineProperty(O,"__filemeta",{configurable:!0,value:{name:"Link",filename:"../modules/cactus-web/dist/Link/Link.js"}}),O.propTypes={to:i.a.string.isRequired};void 0!==O&&O&&O===Object(O)&&Object.isExtensible(O)&&!O.hasOwnProperty("__filemeta")&&Object.defineProperty(O,"__filemeta",{configurable:!0,value:{name:"Link",filename:"../modules/cactus-web/dist/Link/Link.js"}})},OvAC:function(e,t){e.exports=function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}},Qatm:function(e,t){e.exports=function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},WI9V:function(e,t){function n(t,r){return e.exports=n=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},n(t,r)}e.exports=n},Zhxd:function(e,t,n){var r=n("+Sw5");e.exports=function(e,t){if(e){if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}},iNmH:function(e,t,n){var r=n("+Sw5");e.exports=function(e){if(Array.isArray(e))return r(e)}},jRwh:function(e,t,n){var r=n("8lrx");e.exports={MDXRenderer:r}},kluZ:function(e,t){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},nQb1:function(e,t,n){"use strict";(function(e){var r=n("mK0O"),o=n("+I+c"),c=n("oYCi"),i=n("EApT"),a=n("Wbzz");n("mXGw");function u(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(Object(n),!0).forEach((function(t){Object(r.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var f=i.a.withComponent(a.Link),l=function(t){var n=t.href,r=t.to,a=Object(o.a)(t,["href","to"]);return function(t){return t.startsWith("http")&&!(e.window&&t.startsWith(window.location.origin))}(r=r||n||"")?Object(c.jsx)(i.a,s({to:r},a)):Object(c.jsx)(f,s({to:r},a))};t.a=l,void 0!==l&&l&&l===Object(l)&&Object.isExtensible(l)&&!l.hasOwnProperty("__filemeta")&&Object.defineProperty(l,"__filemeta",{configurable:!0,value:{name:"Link",filename:"src/components/Link.tsx"}})}).call(this,n("pCvA"))},uUj8:function(e,t,n){var r=n("WI9V"),o=n("0qAl");function c(t,n,i){return o()?e.exports=c=Reflect.construct:e.exports=c=function(e,t,n){var o=[null];o.push.apply(o,t);var c=new(Function.bind.apply(e,o));return n&&r(c,n.prototype),c},c.apply(null,arguments)}e.exports=c}}]);
//# sourceMappingURL=component---src-templates-component-template-tsx-9f570e5e17416689b813.js.map