(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{283:function(e,t,a){"use strict";a.r(t);var n=a(0),r=(a(4),a(32),a(1)),l=a(34),o=a(285),i=a(12),c=a(291),s=a.n(c),m=a(124),d=a(78),h=a(3),u=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},b={textAlign:"right"};function E(e){var t,a=e.displayName,r=e.color,o=e.textColor,c=Boolean(a);t=function(e){return i.a.colors.hasOwnProperty(e)}(r)?i.a.colors[r]:r;var m=s()(t),d=m.array(),h=d[0],u=d[1],E=d[2],p=d[3],f=0===h&&0===u&&100===E;return n.createElement(l.a,{pt:c?4:3,px:3,pb:3,mb:c?0:"-4px",width:"105%",color:o,bg:r,borderWidth:"1px",borderStyle:"solid",borderColor:f?i.a.colors.mediumGray:r,borderRadius:"4px",style:b},c&&n.createElement(n.Fragment,null,n.createElement("span",null,"#",a),n.createElement("br",null)),n.createElement("span",null,"Hex ",m.hex().slice(1)),n.createElement("br",null),n.createElement("span",null,"H",h," S",u," L",E," A",p))}function p(e){var t=e.name,a=e.title,r=e.children,o=a||u(t),c=i.a.colorStyles[t];return n.createElement(l.a,{px:4,py:3,width:"240px"},n.createElement(E,{displayName:o,color:c.backgroundColor,textColor:c.color}),r)}function f(e){var t=e.colors,a=e.title,r=e.children;return n.createElement(l.a,{px:4,py:3,width:"240px"},t.map(function(e,r){return n.createElement(E,{displayName:r===t.length?a:void 0,color:e.bg,textColor:e.color})}),r)}p&&p===Object(p)&&Object.isExtensible(p)&&Object.defineProperty(p,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"ColorBox",filename:"src/components/Color.tsx"}}),f&&f===Object(f)&&Object.isExtensible(f)&&Object.defineProperty(f,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"PaletteBox",filename:"src/components/Color.tsx"}});var g=Object(h.default)("td")(r.e,r.l,r.j,r.f,r.h,r.m,r.k,r.g,r.U,r.W);g.defaultProps={px:3,pt:3},g=Object(h.default)(g).withConfig({displayName:"Color__Cell",componentId:"c61msz-0"})(["position:relative;width:20%;@media only screen and (max-width:500px){font-size:16px;min-height:40px;padding:5px 0 5px 25px;display:block;}"]);var x=Object(h.default)(g).withConfig({displayName:"Color__HCell",componentId:"c61msz-1"})(["position:relative;width:20%;@media only screen and (max-width:500px){font-size:16px;display:block;padding:3px;width:85px;height:50px;}"]);x.defaultProps={px:2,pt:3,pb:3};var w=Object(h.default)(g).withConfig({displayName:"Color__VertHCell",componentId:"c61msz-2"})(["position:relative;width:20%;@media only screen and (max-width:500px){text-align:left;display:block;width:100%;height:50px;}"]),y=Object(h.default)(l.b).withConfig({displayName:"Color__AccessibilityFlex",componentId:"c61msz-3"})(["max-width:500px;margin:16px;@media only screen and (max-width:500px){max-width:95%;}"]),C=Object(h.default)(o.a).withConfig({displayName:"Color__SmallTitle",componentId:"c61msz-4"})(["@media only screen and (max-width:500px){font-size:18px;padding:0 5px 0 0;}"]),A=h.default.table.withConfig({displayName:"Color__Table",componentId:"c61msz-5"})(["width:100%;tr:first-child{border-bottom:1px solid;}@media only screen and (max-width:500px){th,td{border:none;}table,tbody{display:grid;border:none;}tbody{grid-row-gap:20%;grid-template-columns:85px 85px 85px;align:left;}tr{text-align:center;border-left:1px solid;&:nth-child(1){border-left:none;}}th:first-child{border-bottom:1px solid;}td:first-child{border-bottom:1px solid;}tr:first-child{border-bottom:none;}"]),k=new s.a(i.a.colors.white),v=new s.a(i.a.colors.darkestContrast);function S(e){var t=e.contrast,a=e.isDark,r=function(e,t,a){return"AA"===t?"normal"===a?e>4.5:e>3:"AAA"===t?"normal"===a?e>7:e>4.5:e>3}(t,e.level,e.textSize),i=null,c=null;return a?(i="white",c=r?"success":"error"):(i=r?"success":"error",c="white"),n.createElement(n.Fragment,null,n.createElement(l.a,{display:"inline-block",borderRadius:"50%",width:"24px",height:"24px",p:1,bg:i,color:c,style:{lineHeight:"1em",fontSize:"16px",textAlign:"center"}},r?n.createElement(m.a,null):n.createElement(d.a,null)),n.createElement("br",null),n.createElement(o.a,{color:a?"white":"darkestContrast",fontSize:"small",lineHeight:"1em",fontWeight:300},r?"Pass":"Fail"))}function z(e){var t=e.color,a=e.title,r=e.isDark,c=r?"white":"darkestContrast",m=i.a.colors[c],d="1px solid "+m,h=i.a.colors[t],u=new s.a(h),b=u.contrast(k),E=u.contrast(v);return n.createElement(y,{p:4,m:4,borderRadius:"2px",bg:t,color:c,style:"white"===t?{border:d}:{}},n.createElement(A,{style:{borderCollapse:"collapse",borderColor:m}},n.createElement("tbody",null,n.createElement("tr",null,n.createElement(x,{as:"th",textAlign:"left"},n.createElement(C,{fontSize:"h4",fontWeight:400},a)),n.createElement(w,{as:"th",borderRight:d},n.createElement(o.a,{fontWeight:300,fontSize:"small"},"Ratio")),n.createElement(w,{as:"th"},n.createElement(o.a,{fontSize:"h3",fontWeight:400},"Aa")),n.createElement(w,{as:"th",borderRight:d},n.createElement(o.a,{fontSize:"small",fontWeight:400},"Aa")),n.createElement(w,{as:"th"},n.createElement(o.a,{fontSize:"h3",fontWeight:400},"Aa")),n.createElement(w,{as:"th",borderRight:d},n.createElement(o.a,{fontSize:"small",fontWeight:400},"Aa")),n.createElement(w,{as:"th",pl:3},n.createElement(l.a,{display:"inline-block",width:"20px",height:"20px",borderRadius:"3px",borderWidth:"1px",borderStyle:"solid",borderColor:c,bg:"transparent"}))),n.createElement("tr",null,n.createElement(x,null,n.createElement(o.a,{color:"white",fontSize:"small"},"White")),n.createElement(g,{borderRight:d,textAlign:"center"},n.createElement(o.a,null," ",b.toFixed(2))),n.createElement(g,{textAlign:"center"},n.createElement(S,{isDark:r,contrast:b,level:"AA",textSize:"large"})),n.createElement(g,{textAlign:"center",borderRight:d},n.createElement(S,{isDark:r,contrast:b,level:"AA",textSize:"normal"})),n.createElement(g,{textAlign:"center"},n.createElement(S,{isDark:r,contrast:b,level:"AAA",textSize:"large"})),n.createElement(g,{textAlign:"center",borderRight:d},n.createElement(S,{isDark:r,contrast:b,level:"AAA",textSize:"normal"})),n.createElement(g,{textAlign:"center"},n.createElement(S,{isDark:r,contrast:b,level:"interface"}))),n.createElement("tr",null,n.createElement(x,{"data-name":a},n.createElement(o.a,{color:"darkestContrast",fontSize:"small"},"Darkest Contrast")),n.createElement(g,{borderRight:d,textAlign:"center"},n.createElement(o.a,null,E.toFixed(2)," ")),n.createElement(g,{textAlign:"center"},n.createElement(S,{isDark:r,contrast:E,level:"AA",textSize:"large"})),n.createElement(g,{textAlign:"center",borderRight:d},n.createElement(S,{isDark:r,contrast:E,level:"AA",textSize:"normal"})),n.createElement(g,{textAlign:"center"},n.createElement(S,{isDark:r,contrast:E,level:"AAA",textSize:"large"})),n.createElement(g,{textAlign:"center",borderRight:d},n.createElement(S,{isDark:r,contrast:E,level:"AAA",textSize:"normal"})),n.createElement(g,{textAlign:"center"},n.createElement(S,{isDark:r,contrast:E,level:"interface"}))))))}z&&z===Object(z)&&Object.isExtensible(z)&&Object.defineProperty(z,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"AccessibilityBox",filename:"src/components/Color.tsx"}});var W=a(119),j=a.n(W),D=a(284);t.default=function(){return n.createElement(n.Fragment,null,n.createElement(j.a,{title:"Color"}),n.createElement("h1",null,"Color"),n.createElement("p",null,"The first foundation is Color, which is one of the most important aspects of our platform. Based on REPAY having many white-labelled products, we carefully thought of a strategy so we can achieve the same look and feel while meeting accessibility standards."),n.createElement(l.b,{display:"flex",justifyContent:"center",flexWrap:"wrap",maxWidth:"1200px",m:"0 auto"},n.createElement(p,{name:"base"}),n.createElement(p,{name:"callToAction"}),n.createElement(p,{name:"standard",title:"White"}),n.createElement(p,{name:"lightContrast"}),n.createElement(p,{name:"darkestContrast"}),n.createElement(p,{name:"success"}),n.createElement(p,{name:"error"}),n.createElement(p,{name:"warning"}),n.createElement(p,{name:"disable"})),n.createElement("h2",null,"Color Scheme"),n.createElement("p",null,"The standard Cactus color scheme is based on a monochromatic palette and a complementary action scheme. All the colors of the monochromatic scheme are based on one factor (HUE) and the rest will be variations (brightness and saturation)."),n.createElement("h3",{style:{fontWeight:400}},"Monochromatic Scheme"),n.createElement(l.b,{display:"flex",justifyContent:"center",flexWrap:"wrap",maxWidth:"1200px",m:"0 auto"},n.createElement(p,{name:"base"},n.createElement("h4",null,"Base Color"),n.createElement(o.b,{fontSize:"small"},"This color is the brand color or base color of the scheme. It will be prominent throughout the product.")),n.createElement(p,{name:"callToAction"},n.createElement("h4",null,"Call to Action"),n.createElement(o.b,{fontSize:"small"},"This color is a lighter variation of the base color. This accent color will be used in small amounts in order to stand out.")),n.createElement(p,{name:"standard",title:"White"},n.createElement("h4",null,"White"),n.createElement(o.b,{fontSize:"small"},"White is a common color included in a color scheme. It provides balance and harmonizes the scheme.")),n.createElement(p,{name:"lightContrast"},n.createElement("h4",null,"Light Contrast"),n.createElement(o.b,{fontSize:"small"},"Contrast colors are founded on the base color, but desaturated and built on a scale.")),n.createElement(p,{name:"darkestContrast"},n.createElement("h4",null,"Darkest Contrast"),n.createElement(o.b,{fontSize:"small"},"A dark and desaturated version of the base color.")),n.createElement(p,{name:"success"},n.createElement("h4",null,"Green"),n.createElement(o.b,{fontSize:"small"},"This color is part of our intuitive scheme. Green will mean success and positive outcomes.")),n.createElement(p,{name:"error"},n.createElement("h4",null,"Red"),n.createElement(o.b,{fontSize:"small"},"This color is part of our intuitive scheme. Red will mean error and destructive outcomes.")),n.createElement(p,{name:"warning"},n.createElement("h4",null,"Yellow"),n.createElement(o.b,{fontSize:"small"},"This color is part of our intuitive scheme. Yellow will indicate warning and bringing to attention.")),n.createElement(p,{name:"disable"},n.createElement("h4",null,"Gray"),n.createElement(o.b,{fontSize:"small"},"This color is part of our intuitive scheme. Gray color indicates disabled or not yet available."))),n.createElement("h2",null,"Color Application"),n.createElement("p",null,"Colors must be used in a consistent manor throughout the application to solidify the design language and guide the user."),n.createElement(l.b,{display:"flex",justifyContent:"center",flexWrap:"wrap",maxWidth:"1200px",margin:"0 auto"},n.createElement(p,{name:"base"},n.createElement("h4",null,"Base Color"),n.createElement(o.b,{fontSize:"small"},"Headers, standard buttons, selection controls, hover states")),n.createElement(p,{name:"callToAction"},n.createElement("h4",null,"Call to Action"),n.createElement(o.b,{fontSize:"small"},"Call to action buttons, Icons, hover and focus states")),n.createElement(p,{name:"standard",title:"White"},n.createElement("h4",null,"White"),n.createElement(o.b,{fontSize:"small"},"Surfaces, text for dark backgrounds, and creating contrast")),n.createElement(f,{title:"LightContrast",colors:[{bg:"darkContrast",color:"white"},{bg:"mediumContrast",color:"white"},{bg:"lightContrast",color:"darkestContrast"}]},n.createElement("h4",null,"Light Contrast"),n.createElement(o.b,{fontSize:"small"},"Zebra contrast, shadows, text field placeholder")),n.createElement(p,{name:"darkestContrast"},n.createElement("h4",null,"Darkest Contrast"),n.createElement(o.b,{fontSize:"small"},"Text")),n.createElement(p,{name:"success"},n.createElement("h4",null,"Green"),n.createElement(o.b,{fontSize:"small"},"Positive indicators, alert messages, action buttons, text fields, headlines, and icons")),n.createElement(p,{name:"error"},n.createElement("h4",null,"Red"),n.createElement(o.b,{fontSize:"small"},"Negative indicators, alert messages, action buttons, text fields, headlines, and icons")),n.createElement(p,{name:"warning"},n.createElement("h4",null,"Yellow"),n.createElement(o.b,{fontSize:"small"},"Moderate indicators, alert messages, action buttons, text fields, headlines, and icons")),n.createElement(f,{title:"Disable",colors:[{bg:"darkGray",color:"white"},{bg:"mediumGray",color:"white"},{bg:"lightGray",color:"darkestContrast"}]},n.createElement("h4",null,"Gray"),n.createElement(o.b,{fontSize:"small"},"Neutral indicators, alert messages, action buttons, text fields, headlines, and icons"))),n.createElement("h2",null,"Accessibility Standards"),n.createElement(o.b,null,'Beware of foreground and background contrast issues and ensure the text always passes minimum WCAG AA guidance. We can quantify contrast in a "contrast ratio" of the background color and the text color.'),n.createElement(o.b,null,n.createElement(o.a,{fontWeight:600},"Level AA")," requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. ",n.createElement("br",null),"Graphics and user ",n.createElement(o.a,{fontWeight:600},"interface")," components (such as form input borders) also require a 3:1. ",n.createElement("br",null),n.createElement(o.a,{fontWeight:600},"Level AAA")," requires a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text."),n.createElement(o.b,{fontStyle:"italic"},"Large text is defined as 14 point (18.66px) and bold or 18 point (24px) and larger and not bold. Note that these requirements don't apply to decorative elements like logos and illustrations."),n.createElement(l.b,{display:"flex",justifyContent:"center",flexWrap:"wrap",maxWidth:"1200px",margin:"0 auto"},n.createElement(z,{color:"base",title:"Base",isDark:!0}),n.createElement(z,{color:"callToAction",title:"CTA",isDark:!0}),n.createElement(z,{color:"white",title:"White",isDark:!1}),n.createElement(z,{color:"darkestContrast",title:"Darkest Contrast",isDark:!0}),n.createElement(z,{color:"darkContrast",title:"Dark Contrast",isDark:!0}),n.createElement(z,{color:"mediumContrast",title:"Medium Contrast",isDark:!0}),n.createElement(z,{color:"lightContrast",title:"Light Contrast",isDark:!1}),n.createElement(z,{color:"success",title:"Success",isDark:!0}),n.createElement(z,{color:"error",title:"Error",isDark:!0}),n.createElement(z,{color:"warning",title:"Warning",isDark:!1}),n.createElement(z,{color:"lightGray",title:"Light Gray",isDark:!1}),n.createElement(z,{color:"mediumGray",title:"Medium Gray",isDark:!0}),n.createElement(z,{color:"darkGray",title:"Dark Gray",isDark:!0})),n.createElement(o.b,{as:"h4",fontSize:"h4"},"Exceptions to contrast requirements:"),n.createElement(o.b,null,n.createElement(o.a,{fontWeight:600},"Large Text:")," Large-scale text and images of large-scale text have a contrast ratio of at least 3:1."),n.createElement(o.b,null,n.createElement(o.a,{fontWeight:600},"Incidental:")," Text or images of text that are part of an inactive user interface component, pure decoration, not visible to users, or within a picture that contains significant other visual content all have no contrast requirements."),n.createElement(o.b,null,n.createElement(o.a,{fontWeight:600},"Logos:")," Text that is part of a logo or brand name has no minimum contrast requirement."),n.createElement("p",null,"Now we'll review ",n.createElement(D.a,{to:"/design-system/typography/"},"typography")," decisions."))}},284:function(e,t,a){"use strict";(function(e){a(4),a(5);var n=a(16),r=a.n(n),l=(a(120),a(68)),o=a(34),i=a(0),c=a.n(i),s=o.d.withComponent(l.a),m=function(t){var a=t.href,n=t.to,l=r()(t,["href","to"]);return function(t){return t.startsWith("http")&&!(e.window&&t.startsWith(window.location.origin))}(n=n||a||"")?c.a.createElement(o.d,Object.assign({to:n},l)):c.a.createElement(s,Object.assign({to:n},l))};t.a=m,m&&m===Object(m)&&Object.isExtensible(m)&&Object.defineProperty(m,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Link",filename:"src/components/Link.tsx"}})}).call(this,a(67))},285:function(e,t,a){"use strict";a.d(t,"a",function(){return o});a(4);var n=a(1),r=a(3),l=Object(r.default)("p")(n.U,n.x,n.o,n.p,n.w,n.z,n.W,n.y,n.H,n.G),o=l.withComponent("span");void 0!==o&&o&&o===Object(o)&&Object.isExtensible(o)&&Object.defineProperty(o,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Span",filename:"src/components/Text.tsx"}}),t.b=l,void 0!==l&&l&&l===Object(l)&&Object.isExtensible(l)&&Object.defineProperty(l,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Text",filename:"src/components/Text.tsx"}})}}]);
//# sourceMappingURL=component---src-pages-design-system-color-tsx-c3641053043e8c476282.js.map