(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{220:function(e,t,a){"use strict";a.r(t);a(84);var n=a(0),l=a(222),r=a.n(l),o=a(235),s=a.n(o),c=a(55),i=a(2),m=a(3),d=Object(i.default)("p")(m.z,m.p,m.h,m.i,m.o,m.q,m.A,m.v,m.u),h=(d.withComponent("span"),d),u=a(42),E=a(105),p=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},f={textAlign:"right",borderRadius:"4px"};function b(e){var t,a=e.displayName,l=e.color,r=e.textColor,o=Boolean(a);t=function(e){return E.a.colors.hasOwnProperty(e)}(l)?E.a.colors[l]:l;var i=s()(t),m=i.array(),d=m[0],h=m[1],u=m[2],p=m[3],b=0===d&&0===h&&100===u;return n.createElement(c.a,{pt:o?4:3,px:3,pb:3,mb:o?0:"-4px",width:"100%",color:r,bg:l,borderWidth:"1px",borderStyle:"solid",borderColor:b?E.a.colors.mediumGray:l,style:f},o&&n.createElement(n.Fragment,null,n.createElement("span",null,"#",a),n.createElement("br",null)),n.createElement("span",null,"Hex ",i.hex().slice(1)),n.createElement("br",null),n.createElement("span",null,"H",d," S",h," L",u," A",p))}function g(e){var t=e.name,a=e.title,l=e.children,r=a||p(t),o=E.a.colorStyles[t];return n.createElement(c.a,{px:4,py:3,width:"240px"},n.createElement(b,{displayName:r,color:o.backgroundColor,textColor:o.color}),l)}function w(e){var t=e.colors,a=e.title,l=e.children;return n.createElement(c.a,{px:4,py:3,width:"240px"},t.map(function(e,l){return n.createElement(b,{displayName:l===t.length?a:void 0,color:e.bg,textColor:e.color})}),l)}t.default=function(){return n.createElement(n.Fragment,null,n.createElement(r.a,{title:"Color"}),n.createElement("h1",null,"Color"),n.createElement("p",null,"The first foundation is Color which is one of the most important aspects of our platform. Based on REPAY having many white-labelled products, we carefully thought of a strategy so we can achieve the same look and feel and meet the accessibility standards."),n.createElement(c.a,{display:"flex",justifyContent:"center",flexWrap:"wrap",maxWidth:"1200px",m:"0 auto"},n.createElement(g,{name:"base"}),n.createElement(g,{name:"callToAction"}),n.createElement(g,{name:"standard",title:"White"}),n.createElement(g,{name:"lightContrast"}),n.createElement(g,{name:"darkestContrast"}),n.createElement(g,{name:"success"}),n.createElement(g,{name:"error"}),n.createElement(g,{name:"warning"}),n.createElement(g,{name:"disable"})),n.createElement("h2",null,"Color Scheme"),n.createElement("p",null,"The standard Cactus color scheme is based on a monochromatic palette and a complementary action scheme. All the colors of the monochromatic scheme are based on one factor (HUE) and the rest will be variations (brightness and saturation)."),n.createElement("h3",{style:{fontWeight:400}},"Monochromatic Scheme"),n.createElement(c.a,{display:"flex",justifyContent:"center",flexWrap:"wrap",maxWidth:"1200px",m:"0 auto"},n.createElement(g,{name:"base"},n.createElement("h4",null,"Base Color"),n.createElement(h,{fontSize:"small"},"This color will be the base of the color scheme and will be common throughout the product. As the base, it will define the rest of the palette.")),n.createElement(g,{name:"callToAction"},n.createElement("h4",null,"Call to Action"),n.createElement(h,{fontSize:"small"},"It is a variation of our base color; the standard scheme has a dark base and this color as additional luminosity / lightness. This is an accent color and is used infrequently to draw attention and imply an action.")),n.createElement(g,{name:"standard",title:"White"},n.createElement("h4",null,"White"),n.createElement(h,{fontSize:"small"},"White is a common color and will be used throughout to balance and harmonize the scheme.")),n.createElement(g,{name:"lightContrast"},n.createElement("h4",null,"Light Contrast"),n.createElement(h,{fontSize:"small"},"Contrast colors are founded on the base color, but desaturated and built on a scale.")),n.createElement(g,{name:"darkestContrast"},n.createElement("h4",null,"Darkest Contrast"),n.createElement(h,{fontSize:"small"},"A dark and desaturated version of the base color.")),n.createElement(g,{name:"success"},n.createElement("h4",null,"Green"),n.createElement(h,{fontSize:"small"},"This color is part of our intuitive scheme, so green will mean success and positive outcomes.")),n.createElement(g,{name:"error"},n.createElement("h4",null,"Red"),n.createElement(h,{fontSize:"small"},"This color is part of our intuitive scheme, so red will mean error and negative.")),n.createElement(g,{name:"warning"},n.createElement("h4",null,"Yellow"),n.createElement(h,{fontSize:"small"},"This color is part of our intuitive scheme, yellow will indicate warning and bringing to attention but moderate.")),n.createElement(g,{name:"disable"},n.createElement("h4",null,"Gray"),n.createElement(h,{fontSize:"small"},"The fully desaturated gray color indicates disabled or not yet available."))),n.createElement("h2",null,"Color Application"),n.createElement("p",null,"Colors must be used in a consistent manor throughout the application to solidify the design language and guide the user."),n.createElement(c.a,{display:"flex",justifyContent:"center",flexWrap:"wrap",maxWidth:"1200px",margin:"0 auto"},n.createElement(g,{name:"base"},n.createElement("h4",null,"Base Color"),n.createElement(h,{fontSize:"small"},"Headers, standard buttons, selection controls, hover states")),n.createElement(g,{name:"callToAction"},n.createElement("h4",null,"Call to Action"),n.createElement(h,{fontSize:"small"},"Call to action buttons, Icons, hover and focus states")),n.createElement(g,{name:"standard",title:"White"},n.createElement("h4",null,"White"),n.createElement(h,{fontSize:"small"},"Surfaces, text for dark backgrounds, and creating contrast")),n.createElement(w,{title:"LightContrast",colors:[{bg:"darkContrast",color:"white"},{bg:"mediumContrast",color:"white"},{bg:"lightContrast",color:"darkestContrast"}]},n.createElement("h4",null,"Light Contrast"),n.createElement(h,{fontSize:"small"},"Zebra contrast, shadows, text field placeholder")),n.createElement(g,{name:"darkestContrast"},n.createElement("h4",null,"Darkest Contrast"),n.createElement(h,{fontSize:"small"},"Text")),n.createElement(g,{name:"success"},n.createElement("h4",null,"Green"),n.createElement(h,{fontSize:"small"},"Positive indicators, alert messages, action buttons, text fields, headlines, and icons")),n.createElement(g,{name:"error"},n.createElement("h4",null,"Red"),n.createElement(h,{fontSize:"small"},"Negative indicators, alert messages, action buttons, text fields, headlines, and icons")),n.createElement(g,{name:"warning"},n.createElement("h4",null,"Yellow"),n.createElement(h,{fontSize:"small"},"Moderate indicators, alert messages, action buttons, text fields, headlines, and icons")),n.createElement(w,{title:"Disable",colors:[{bg:"darkGray",color:"white"},{bg:"mediumGray",color:"white"},{bg:"lightGray",color:"darkestContrast"}]},n.createElement("h4",null,"Gray"),n.createElement(h,{fontSize:"small"},"Neutral indicators, alert messages, action buttons, text fields, headlines, and icons"))),n.createElement("p",null,"TODO: Accessibility charts"),n.createElement("p",null,"Next, we will review the ",n.createElement(u.Link,{to:"/design-system/typography/"},"typography"),"."))}}}]);
//# sourceMappingURL=component---src-pages-design-system-color-tsx-6b048f063837d8c39365.js.map