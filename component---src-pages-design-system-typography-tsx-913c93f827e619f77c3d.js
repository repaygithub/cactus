(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{276:function(e,t,n){"use strict";n.r(t);var l=n(0),a=n(38),i=n(11),r=n(120),c=n.n(r),o=n(281),s=n(2),m=n(282),h=n(298),d=n.n(h),u=n(299),f=n.n(u),p=Object(s.default)("table").withConfig({displayName:"typography__Table",componentId:"paha36-0"})(['th,td{padding:16px;}@media only screen and (max-width:500px){table,thead,tbody,th,td{display:block;align:left;}thead tr{display:none;}td{border:none;position:relative;padding:0 10% 10% 35%;border-bottom:1px solid #eee;overflow-x:auto;}td:before{position:absolute;top:2px;left:2px;width:30%;}td:nth-of-type(1):before{content:" Scale";}td:nth-of-type(2):before{content:" Rem";}td:nth-of-type(3):before{content:"PX";}td:nth-of-type(4):before{content:"Line Height";}td:nth-of-type(5){border-bottom:2px solid #131313;}}']);t.default=function(){return l.createElement(l.Fragment,null,l.createElement(c.a,{title:"Typography"}),l.createElement("h1",null,"Typography"),l.createElement(m.b,null,"Cactus uses Helvetica as the principal font. It is classic, clean, and practical. Unix and Apple computers have always had Helvetica, and it is a native font on PostScript printers. In the case were Helvetica is missing, the fallback is Arial. Arial is a near-copy of Helvetica, updated slightly, and installed on Windows in place of Helvetica."),l.createElement(a.b,{alignItems:"center"},l.createElement("img",{src:f.a,alt:"Helvetica font example",style:{width:"50%",minWidth:"300px",maxWidth:"600px"}}),l.createElement("img",{src:d.a,alt:"Arial font example",style:{width:"50%",maxWidth:"600px",minWidth:"300px",paddingTop:"20px"}})),l.createElement("h2",null,"Scale"),l.createElement(p,null,l.createElement("thead",null,l.createElement("tr",null,l.createElement("th",null,l.createElement(m.a,null,"SCALE")),l.createElement("th",null,l.createElement(m.a,null,"REM")),l.createElement("th",null,l.createElement(m.a,null,"PX")),l.createElement("th",null,l.createElement(m.a,null,"LINE HEIGHT")),l.createElement("th",null))),l.createElement("tbody",null,l.createElement("tr",null,l.createElement("td",null,l.createElement(m.a,{fontSize:"h1"},"H1")),l.createElement("td",null,(i.a.fontSizes[5]/18).toFixed(3)," em"),l.createElement("td",null,i.a.fontSizes[5]," px"),l.createElement("td",null,Math.round(1.5*i.a.fontSizes[5])," px"),l.createElement("td",null,l.createElement(m.a,{fontSize:"h1"},"The quick brown fox..."))),l.createElement("tr",null,l.createElement("td",null,l.createElement(m.a,{fontSize:"h2"},"H2")),l.createElement("td",null,(i.a.fontSizes[4]/18).toFixed(3)," em"),l.createElement("td",null,i.a.fontSizes[4]," px"),l.createElement("td",null,Math.round(1.54*i.a.fontSizes[4])," px"),l.createElement("td",null,l.createElement(m.a,{fontSize:"h2"},"The quick brown fox jumps..."))),l.createElement("tr",null,l.createElement("td",null,l.createElement(m.a,{fontSize:"h3"},"H3")),l.createElement("td",null,(i.a.fontSizes[3]/18).toFixed(2)," em"),l.createElement("td",null,i.a.fontSizes[3]," px"),l.createElement("td",null,Math.round(1.54*i.a.fontSizes[3])," px"),l.createElement("td",null,l.createElement(m.a,{fontSize:"h3"},"The quick brown fox jumps over..."))),l.createElement("tr",null,l.createElement("td",null,l.createElement(m.a,{fontSize:"h4"},"H4")),l.createElement("td",null,(i.a.fontSizes[2]/18).toFixed(1)," em"),l.createElement("td",null,i.a.fontSizes[2]," px"),l.createElement("td",null,Math.round(1.5*i.a.fontSizes[2])," px"),l.createElement("td",null,l.createElement(m.a,{fontSize:"h4"},"The quick brown fox jumps over the..."))),l.createElement("tr",null,l.createElement("td",null,l.createElement(m.a,{fontSize:"p"},"P")),l.createElement("td",null,(i.a.fontSizes[1]/18).toFixed(1)," em"),l.createElement("td",null,i.a.fontSizes[1]," px"),l.createElement("td",null,Math.round(1.54*i.a.fontSizes[1])," px"),l.createElement("td",null,l.createElement(m.a,{fontSize:"p"},"The quick brown fox jumps over the lazy dog."))),l.createElement("tr",null,l.createElement("td",null,l.createElement(m.a,{fontSize:"small"},"small")),l.createElement("td",null,(i.a.fontSizes[0]/18).toFixed(1)," em"),l.createElement("td",null,i.a.fontSizes[0]," px"),l.createElement("td",null,Math.round(1.54*i.a.fontSizes[0])," px"),l.createElement("td",null,l.createElement(m.a,{fontSize:"small"},"The quick brown fox jumps over the lazy dog."))))),l.createElement("h2",null,"Weight"),l.createElement(m.b,null,"We use different weights to convey a visual rhythm and hierarchy."),l.createElement(a.b,{justifyContent:"space-between"},l.createElement(a.b,{flexDirection:"column",alignItems:"center",p:4},l.createElement(m.a,{fontSize:"h1",fontWeight:300},"w300"),l.createElement(m.a,{fontSize:"h1",fontWeight:300},"Light Weight")),l.createElement(a.b,{flexDirection:"column",alignItems:"center",p:4},l.createElement(m.a,{fontSize:"h1",fontWeight:400},"w400"),l.createElement(m.a,{fontSize:"h1",fontWeight:400},"Regular Weight")),l.createElement(a.b,{flexDirection:"column",alignItems:"center",p:4},l.createElement(m.a,{fontSize:"h1",fontWeight:600},"w600"),l.createElement(m.a,{fontSize:"h1",fontWeight:600},"Bold Weight"))),l.createElement(m.b,{fontStyle:"italic"},"The Light Weight should only be used at sizes greater than or equal to 18px / 1 rem. Additionally, Arial doesn't have a 300 weight by default and therefore will not be differentiated on Windows operating systems."),l.createElement(m.b,{as:"h2",my:"5"},"Hierarchy"),l.createElement(m.b,null,"Content hierarchy informs the user how to classify what they see. This clarity improves how quickly the user can navigate the interface."),l.createElement(m.b,null,"Line lengths are ideally limited to 50-60 characters on desktop and 30-40 characters on mobile. Additionally, light text weights are avoided especially at small font sizes."),l.createElement("table",null,l.createElement("tbody",null,l.createElement("tr",null,l.createElement("th",{style:{textAlign:"right",paddingRight:"16px"}},l.createElement(m.a,{fontSize:"h1",fontWeight:600},"H1")),l.createElement("td",null,l.createElement(m.b,{as:"h1"},"Heading"))),l.createElement("tr",null,l.createElement("th",{style:{textAlign:"right",paddingRight:"16px"}},l.createElement(m.a,{fontSize:"h4",fontWeight:400},"H4")),l.createElement("td",null,l.createElement(m.b,{as:"h4",fontSize:"h4",m:0,fontWeight:400},"SubHeading"))),l.createElement("tr",null,l.createElement("th",{style:{verticalAlign:"text-top",paddingTop:"16px",paddingRight:"16px",textAlign:"right"}},l.createElement(m.a,{fontWeight:400},"P")),l.createElement("td",null,l.createElement(m.b,null,"Stilton who moved my cheese blue castello. Lancashire cow mascarpone say cheese parmesan cauliflower cheese melted cheese cheesy feet. Mozzarella pecorino hard cheese rubber cheese squirty cheese the big cheese feta melted cheese. Stilton danish fontina jarlsberg cheesy feet queso boursin edam monterey jack. Cheese strings fromage frais stinking bishop cheese slices cheese and biscuits bavarian bergkase parmesan melted cheese. Halloumi croque monsieur hard cheese say cheese port-salut cheeseburger pepper jack cheese on toast. Mascarpone feta swiss cauliflower cheese manchego."))))),l.createElement(m.b,{mt:6,mb:5,fontSize:"h3"},"Next, we'll review all the ",l.createElement(o.a,{href:"/design-system/icons/"},"icons"),"."))}},281:function(e,t,n){"use strict";(function(e){n(3),n(4);var l=n(16),a=n.n(l),i=(n(119),n(88)),r=n(38),c=n(0),o=n.n(c),s=r.d.withComponent(i.a),m=function(t){var n=t.href,l=t.to,i=a()(t,["href","to"]);return function(t){return t.startsWith("http")&&!(e.window&&t.startsWith(window.location.origin))}(l=l||n||"")?o.a.createElement(r.d,Object.assign({to:l},i)):o.a.createElement(s,Object.assign({to:l},i))};t.a=m,m&&m===Object(m)&&Object.isExtensible(m)&&Object.defineProperty(m,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Link",filename:"src/components/Link.tsx"}})}).call(this,n(69))},282:function(e,t,n){"use strict";n.d(t,"a",function(){return r});n(3);var l=n(1),a=n(2),i=Object(a.default)("p")(l.U,l.x,l.o,l.p,l.w,l.z,l.W,l.y,l.H,l.G),r=i.withComponent("span");void 0!==r&&r&&r===Object(r)&&Object.isExtensible(r)&&Object.defineProperty(r,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Span",filename:"src/components/Text.tsx"}}),t.b=i,void 0!==i&&i&&i===Object(i)&&Object.isExtensible(i)&&Object.defineProperty(i,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Text",filename:"src/components/Text.tsx"}})},298:function(e,t,n){e.exports=n.p+"static/font-arial-6c563e680fab071dd1ac7776acb12fcf.png"},299:function(e,t,n){e.exports=n.p+"static/font-helvetica-77d3d633c1abf20453c890cff81be4b5.png"}}]);
//# sourceMappingURL=component---src-pages-design-system-typography-tsx-913c93f827e619f77c3d.js.map