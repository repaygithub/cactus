(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"3hrQ":function(e,t,l){"use strict";l.r(t);var n=l("q1tI"),a=l("LE0B"),r=l("k6pe"),c=l("qt1M"),d=l.n(c),o=l("LrRz"),i=l.n(o),m=l("TJpk"),s=l.n(m),p=l("UutA"),u=l("EHAY"),h=Object(p.default)(a.a).withConfig({displayName:"shared-styles__ShadowBox",componentId:"sc-16egxey-0"})(["box-shadow:",";"],(function(e){return e.shadow+" "+e.theme.colors.callToAction}));h.defaultProps={display:"flex",alignItems:"center",justifyContent:"center",margin:5,width:"150px",height:"150px"};var E=Object(p.default)("table").withConfig({displayName:"shared-styles__Table",componentId:"sc-16egxey-1"})(['border-collapse:collapse;th{border:1px solid black;text-align:left;padding:3px;}td{border:1px solid black;font-weight:200;padding:3px;}@media only screen and (max-width:500px){table,thead,tbody,th,td{display:block;align:left;}thead tr{display:none;}td{border:none;position:relative;border-bottom:1px solid #eee;padding:2px 0 10px 225px;}td:before{position:absolute;text-align:left;top:2px;left:2px;}td:nth-of-type(1):before{content:"Breaking Points";}td:nth-of-type(2):before{content:"Responsive Sizes";}td:nth-of-type(3):before{content:"Content Size";}td:nth-of-type(4):before{content:"Column Size";}td:nth-of-type(5):before{content:"Columns";}td:nth-of-type(6):before{content:"Margin";}td:nth-of-type(7):before{content:"Gutter";}td:nth-of-type(7){border-bottom:2px solid #131313;}}']),b=Object(p.default)("table").withConfig({displayName:"shared-styles__ColumnKey",componentId:"sc-16egxey-2"})(["padding:5% 0 0 2%;th{padding:20px 0 0 0;font-weight:600;text-align:left;}td{padding:5px 0 0 0;font-weight:200;text-align:left;}@media only screen and (max-width:1000px){width:100%;}"]),g=Object(p.default)("table").withConfig({displayName:"shared-styles__TableSpacing",componentId:"sc-16egxey-3"})(["border-collapse:collapse;font-weight:200;td{text-align:right;}"]),f=function(e){return n.createElement(a.a,{margin:"0",width:"50px",height:"50px",bg:"white",justifyContent:"center",alignItems:"center",borderColor:e.color,borderStyle:"solid",borderWidth:e.padding,style:{boxSizing:"content-box"}},n.createElement("span",null,e.padding))},x=Object(p.default)("img").withConfig({displayName:"shared-styles__Img",componentId:"sc-16egxey-4"})(["width:auto;max-width:75%;heght:auto;"]),y=Object(p.default)(r.a).withConfig({displayName:"shared-styles__Clear",componentId:"sc-16egxey-5"})(["::after{content:'';display:block;clear:both;}"]);t.default=function(){return n.createElement(n.Fragment,null,n.createElement(s.a,{title:"Shared Styles"}),n.createElement(u.b,{as:"h1",fontSize:"h1"},"Shared Styles"),n.createElement(u.b,{as:"h2",fontSize:"h2"},"Shadow"),n.createElement(a.a,null,n.createElement(h,{shadow:"0 0 3px"},n.createElement(r.a,{as:"h2"},"S0")),n.createElement(h,{shadow:"0 3px 8px"},n.createElement(r.a,{as:"h2"},"S1")),n.createElement(h,{shadow:"0 9px 24px"},n.createElement(r.a,{as:"h2"},"S2")),n.createElement(h,{shadow:"0 12px 24px"},n.createElement(r.a,{as:"h2"},"S3")),n.createElement(h,{shadow:"0 30px 42px"},n.createElement(r.a,{as:"h2"},"S4")),n.createElement(h,{shadow:"0 45px 48px"},n.createElement(r.a,{as:"h2"},"S5"))),n.createElement(u.b,{as:"h2",fontSize:"h2"},"Base Grid"),n.createElement(u.b,null,"The base grid is the reference from which the rest of the layout structures are built. It defines the starting point of the dimensions, as well as the paddings and margins of the elements of the interface."),n.createElement(u.b,null,"The grid is built from a base 8 pixel module so that both the sizes of the elements and the spaces between them will always be multiples of 8: 16, 24, 32, 40, 48."),n.createElement(u.b,null,"There may be situations, however where a value smaller than 8px is required; the 4px unit is available for these cases."),n.createElement(u.b,null,"This grid enables the creation of a standard interface by defining the abstract composition of an page and how individual components associate within an interface."),n.createElement(u.b,null," The main bar, footer, and action bar use the 8pt grid for placement."),n.createElement(y,null,n.createElement(x,{src:i.a,alt:"Columns",style:{padding:"1% 0 0 0 "}}),n.createElement(u.b,{style:{float:"left",padding:"5% 5% 0 5%"}},"Our product is composed of ",n.createElement("br",null)," 1) Main Bar (Quickline Bar) ",n.createElement("br",null),"2) Action Bar",n.createElement("br",null)," 3) Side panel ",n.createElement("br",null)," 4) Content ",n.createElement("br",null)," 5) Footer")),n.createElement("br",null),n.createElement(y,null,n.createElement(x,{src:d.a,alt:"Grid",style:{float:"left",padding:"4% 3% 0 2% "}}),n.createElement(b,null,n.createElement("thead",null,n.createElement("tr",null,n.createElement("th",null,n.createElement(a.a,{width:"20px",height:"20px",style:{backgroundColor:"hsl(200, 50%, 89%)"}},n.createElement(r.a,{m:"0 0 0 30px"}," Column"))))),n.createElement("tbody",null,n.createElement("tr",null,n.createElement("td",{style:{width:"275px"}},"The columns are fluid, having a responsive width which conforms to the size of their parent container.")),n.createElement("th",null,n.createElement(a.a,{width:"20px",height:"20px",style:{backgroundColor:"hsl(200, 52%, 54%)"}},n.createElement(r.a,{m:"0 0 0 30px"}," Margin"))),n.createElement("tr",null,n.createElement("td",{style:{width:"150px"}},"Margins are the negative space between the edge of the format and the outer edge of the content.")),n.createElement("th",null,n.createElement(a.a,{width:"20px",height:"20px",style:{backgroundColor:"hsl(200, 51%, 77%)"}},n.createElement(r.a,{m:"0 0 0 30px"}," Gutter"))),n.createElement("tr",null,n.createElement("td",{style:{width:"150px"}},'Grid columns are seperated by areas of white space referred to as "gutters". Gutters improve legibility by providing negative space between page elements.'))))),n.createElement(u.b,{as:"h2",fontSize:"h2",textAlign:"left",style:{padding:"5% 0 0 0"}},"Break-points"),n.createElement(u.b,null,"The different column sizes automatically change dimensions if they reach a breakpoint."),n.createElement(E,null,n.createElement("thead",null,n.createElement("tr",null,n.createElement("th",null,"Breaking Points"),n.createElement("th",null,"Responsive Sizes"),n.createElement("th",null,"Content Size"),n.createElement("th",null,"Column Size"),n.createElement("th",null,"Columns"),n.createElement("th",null,"Margin"),n.createElement("th",null,"Gutter"))),n.createElement("tbody",null,n.createElement("tr",null,n.createElement("td",null,"mini"),n.createElement("td",null," >320px"),n.createElement("td",null," 320"),n.createElement("td",null," 64"),n.createElement("td",null," 4"),n.createElement("td",null," 8"),n.createElement("td",null," 16")),n.createElement("tr",null,n.createElement("td",null,"small"),n.createElement("td",null," >768px"),n.createElement("td",null," 708"),n.createElement("td",null," 102"),n.createElement("td",null," 6"),n.createElement("td",null," 8"),n.createElement("td",null," 16")),n.createElement("tr",null,n.createElement("td",null,"medium"),n.createElement("td",null," >1024px"),n.createElement("td",null," 964"),n.createElement("td",null," 104"),n.createElement("td",null," 8"),n.createElement("td",null," 10"),n.createElement("td",null," 16")),n.createElement("tr",null,n.createElement("td",null,"large"),n.createElement("td",null," >1200px"),n.createElement("td",null," 1140"),n.createElement("td",null," 79"),n.createElement("td",null," 12"),n.createElement("td",null," 8"),n.createElement("td",null," 16")),n.createElement("tr",null,n.createElement("td",null,"extra large"),n.createElement("td",null," >1440px"),n.createElement("td",null," 1380"),n.createElement("td",null," 99"),n.createElement("td",null," 12"),n.createElement("td",null," 6"),n.createElement("td",null," 16")))),n.createElement(u.b,{as:"h2",fontSize:"h2"},"Spacing"),n.createElement(u.b,null,"The 8px base grid is also used as a baseline to determine the spacing between elements."),n.createElement(g,null,n.createElement("tbody",null,n.createElement("tr",null,n.createElement("td",null," Extra Small "),n.createElement("td",{style:{padding:"0 0 0 100px"}},n.createElement(f,{padding:"4px",color:"hsl(200, 48%, 94%)"}))),n.createElement("tr",null,n.createElement("td",null," Mini "),n.createElement("td",{style:{padding:"20px 0 0 100px"}},n.createElement(f,{padding:"8px",color:"hsl(200, 48%, 94%)"}))),n.createElement("tr",null,n.createElement("td",null," Small "),n.createElement("td",{style:{padding:"20px 0 0 100px"}},n.createElement(f,{padding:"16px",color:"hsl(200, 47%, 88%)"}))),n.createElement("tr",null,n.createElement("td",null," Medium "),n.createElement("td",{style:{padding:"20px 0 0 100px"}},n.createElement(f,{padding:"24px",color:"hsl(200, 48%, 76%)"}))),n.createElement("tr",null,n.createElement("td",null," Large "),n.createElement("td",{style:{padding:"20px 0 0 100px"}},n.createElement(f,{padding:"32px",color:"hsl(200, 50%, 70%)"}))),n.createElement("tr",null,n.createElement("td",null," Extra Large "),n.createElement("td",{style:{padding:"20px 0 0 100px "}},n.createElement(f,{padding:"40px",color:"hsl(200, 50%, 70%)"}))))))}},EHAY:function(e,t,l){"use strict";l.d(t,"a",(function(){return c}));l("bNpn");var n=l("za5s"),a=l("UutA"),r=Object(a.default)("p").withConfig({displayName:"Text",componentId:"yhr4g7-0"})(n.y,n.o,n.i,n.j,n.n,n.q,n.A,n.p,n.u,n.t),c=r.withComponent("span");void 0!==c&&c&&c===Object(c)&&Object.isExtensible(c)&&Object.defineProperty(c,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Span",filename:"src/components/Text.tsx"}}),t.b=r,void 0!==r&&r&&r===Object(r)&&Object.isExtensible(r)&&Object.defineProperty(r,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"Text",filename:"src/components/Text.tsx"}})},LrRz:function(e,t,l){e.exports=l.p+"static/grid-numbered-9a48a176588446b2e24371cbc5e43de9.png"},qt1M:function(e,t,l){e.exports=l.p+"static/grid-columns-52f5541bacc3ff18a14586219ab5c92b.png"}}]);
//# sourceMappingURL=component---src-pages-design-system-shared-styles-tsx-e62c483cd9065c686dfe.js.map