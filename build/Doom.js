/* Doom.js Library Version: 1.2.0 Copyright (c) 2015 Iain Shorter */if(!window.Doom){window.Doom = {}; (function() {'use strict';"indexOf"in Array.prototype||Object.defineProperty(Array.prototype,"indexOf",{value:function(c,b){for(var a=+b||0,e=this.length;a<e;a++)if(a in this&&this[a]===c)return a;return-1}});"trim"in String.prototype||Object.defineProperty(String.prototype,"trim",{value:function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}});
if(!("classList"in document.createElement("_"))&&"Element"in window){var classListGetter=function(){var c=new ClassList(this);Object.defineProperty(this,"classList",{get:function(){updateFromClassName(c,this.className);return c}});return c},ClassList=function(c){updateFromClassName(this,c.className);this._updateClassName=function(){c.className=this+""}},updateFromClassName=function(c,b){for(var a=b.trim(),a=a?a.split(/\s+/):[],e=c.length=0,l=a.length;e<l;e++)c.push(a[e])},checkTokenAndGetIndex=function(c,
b){if(""===b)throw new DOMEx("SYNTAX_ERR","The token provided must not be empty");if(/\s/.test(b))throw new DOMEx("INVALID_CHARACTER_ERR","The token provided ('"+b+"') contains HTML space characters, which are not valid in tokens");return c.indexOf(b)},DOMEx=function(c,b){this.name=c;this.code=DOMException[c];this.message=b};DOMEx.prototype=Error.prototype;ClassList.prototype=[];ClassList.prototype.item=function(c){return this[c]||null};ClassList.prototype.contains=function(c){return-1!==checkTokenAndGetIndex(this,
c+"")};ClassList.prototype.add=function(){for(var c=!1,b=0,a=arguments.length,e;b<a;b++)e=arguments[b]+"",-1===checkTokenAndGetIndex(this,e)&&(this.push(e),c=!0);c&&this._updateClassName(this)};ClassList.prototype.remove=function(){for(var c=0,b=arguments.length,a,e;c<b;c++)for(a=arguments[c]+"",e=checkTokenAndGetIndex(this,a);-1!==e;)this.splice(e,1),e=checkTokenAndGetIndex(this,a);this._updateClassName()};ClassList.prototype.toggle=function(c){c+="";var b=this.contains(c);this[b?"remove":"add"](c);
return!b};ClassList.prototype.toString=function(){return this.join(" ")};if(Object.defineProperty){var classListPropDesc={get:classListGetter,enumerable:!0,configurable:!0};try{Object.defineProperty(Element.prototype,"classList",classListPropDesc)}catch(ex){-2146823252===ex.number&&(classListPropDesc.enumerable=!1,Object.defineProperty(Element.prototype,"classList",classListPropDesc))}}else Object.prototype.__defineGetter__?elemCtrProto.__defineGetter__("classList",classListGetter):console.warn("Failed to add classlist polyfill")};if(window.Promise)Doom.Promise=window.Promise;else{var Promise=function(c){if(this instanceof Promise)this.state=STATE_INIT,this.subscriberqueue=[],this.settledValue=this.resolvehandler=this.rejectionhandler=void 0,c!==INTERNAL&&this.resolveWithResolver(c);else return new Promise(c)},tryCatch=function(c){return function(b,a){try{return c(b,a)}catch(e){return errorObj.e=e,errorObj}}},errorObj={e:null},STATE_INIT=0,STATE_PEND=1,STATE_RSLV=2,STATE_RJCT=3,INTERNAL=function(){};Promise.prototype={resolveWithResolver:function(c){var b=
this;this.state=STATE_PEND;c=tryCatch(c)(function(a){null!==b&&(b.resolveCallback(a),b=null)},function(a){null!==b&&(b.rejectCallback(a),b=null)});void 0!==c&&null!==b&&(b.rejectCallback(c.e),b=null)},resolveCallback:function(c){var b=this;c instanceof Promise?c.then(function(a){null!==b&&(b.resolveCallback(a),b=null)},function(a){null!==b&&(b.rejectCallback(a),b=null)}):(this.state=STATE_RSLV,this.resolvehandler?(c=tryCatch(this.resolvehandler)(c),c===errorObj?b.reject(c.e):c instanceof Promise?
c.then(function(a){null!==b&&(b.fulfill(a),b=null)},function(a){null!==b&&(b.reject(a),b=null)}):b.fulfill(c)):this.fulfill(c))},rejectCallback:function(c){var b=this;c instanceof Promise?c.then(function(a){null!==b&&(b.resolveCallback(a),b=null)},function(a){null!==b&&(b.rejectCallback(a),b=null)}):(this.state=STATE_RJCT,this.rejectionhandler?(c=tryCatch(this.rejectionhandler)(c),c===errorObj?(b.reject(c.e),b=null):c instanceof Promise?c.then(function(a){b.fulfill(a);b=null},function(a){b.reject(a);
b=null}):(b.fulfill(c),b=null)):this.reject(c))},fulfill:function(c){function b(e){return function(){e.resolveCallback(c);a.settledValue=c}}for(var a=this,e;this.subscriberqueue.length;)e=this.subscriberqueue.shift(),setTimeout(b(e),0)},reject:function(c,b){function a(a){return function(){a.rejectCallback(c);e.settledValue=c}}for(var e=this,l;this.subscriberqueue.length;)l=this.subscriberqueue.shift(),setTimeout(a(l),0)},then:function(c,b){var a=new Promise(INTERNAL);a.resolvehandler=c;a.rejectionhandler=
b;this.subscriberqueue.push(a);this.state===STATE_RSLV?this.fulfill(this.settledValue):this.state===STATE_RJCT&&this.reject(this.settledValue);return a},catch:function(c){return this.then(void 0,c)}};Doom.Promise=Promise};Element.prototype.contains||(Element.prototype.contains=function(c){return!!(this.compareDocumentPosition(c)&16)});var alloys={};function createAlloy(c,b){c=c.toLowerCase();if(alloys[c]){var a=new alloys[c](b);a.alloyName=c;a.element.alloy=a;return a.element}throw Error('Construction Error, alloy "'+c+'" does not exist');}Doom.define=function(c,b){c=c.toLowerCase();if(alloys[c])throw Error('Definition Error, alloy "'+c+'" already exists!');alloys[c]=b};(function(){function c(e){var c,g,f;if("object"!==typeof e)throw Error("Element object structure is not defined");if(f=e.refMap||e.referenceMap){if("object"!==typeof f)throw Error("Reference object is not an object");a.unshift(f)}g="string"===typeof e.alloyName||"string"===typeof e.alloy?createAlloy(e.alloyName||e.alloy,e.alloyProperties||{}):document.createElement(e.tagName||"div");for(c in e)c in b?b[c].apply(g,[e[c]]):g[c]=e[c];f&&a.shift();return g}var b={},a=[];b.tag=b.tagName=b.alloy=b.alloyName=
b.alloyProperties=b.copies=function(){};b.ref=b.reference=function(e){if(!a[0])throw Error('No reference map defined for "'+e+'"');if(a[0][e])throw Error('Label "'+e+'" already defined for reference map');a[0][e]=this};b.onTap=b.ontap=function(a){return Doom.touch(this,"tap",a)};b.onSwipe=b.onswipe=function(a){return Doom.touch(this,"swipe",a)};b.onhold=b.onHold=function(a){return Doom.touch(this,"hold",a)};b.onpan=b.onPan=function(a){return Doom.touch(this,"pan",a)};b.ontouchstart=b.onTouchStart=
function(a){return Doom.touch(this,"touchstart",a)};b.ontouchend=b.onTouchEnd=function(a){return Doom.touch(this,"touchend",a)};b.parentNode=b.parent=function(a){return a.appendChild(this)};b.insertBefore=function(a){a.parentNode.insertBefore(this,a)};b.insertAfter=function(a){a.nextSibling?a.parentNode.insertBefore(this,a.nextSibling):a.parentNode.appendChild(this)};b.insertFirst=function(a){a.insertBefore(this,a.firstChild)};b.style=function(a){if("object"===typeof a)for(var b in a)this.style[b]=
a[b];else if("string"===typeof a)this.style.cssText+=a;else throw Error("Style TypeError - "+typeof a);};b.childNodes=b.children=function(a){for(var c=0;c<a.length;c++)a[c]=b.child.apply(this,[a[c]]);return a};b.child=function(a){if(a instanceof HTMLElement)this.appendChild(a);else if("string"===typeof a)for(var b=Doom.create({innerHTML:a});b.firstChild;)this.appendChild(b.firstChild);else if("object"===typeof a)a.parentNode=this,a=c(a);else throw Error("Child TypeError - "+typeof a);return a};b.dataset=
function(a){for(var b in a)this.dataset[b]=a[b]};Doom.create=c})();function Service(){this.delegates=[];this.eventlist={}}
Service.prototype={on:function(c,b){this.eventlist[c]=b},fire:function(c,b){"function"===typeof this.eventlist[c]&&this.eventlist[c].call(this,b)},register:function(c){c=new Delegate(this,c);this.delegates.push(c);1===this.delegates.length&&this.fire("start");this.fire("register",c);return c},deregister:function(c){var b=this.delegates.indexOf(c);this.delegates.splice(b,1);this.fire("deregister",c);0===this.delegates.length&&this.fire("stop")},callDelegates:function(c,b){for(var a=this.delegates.length;a--;)this.delegates[a].fire(c,
b)}};function Delegate(c,b){this.eventlist={};this.service=c;this.context=b}Delegate.prototype={on:function(c,b){this.eventlist[c]=b;this.service.fire("listen",[c,this])},fire:function(c,b){"function"===typeof this.eventlist[c]&&this.eventlist[c].call(this.context,b)}};Doom.service=function(){return new Service};(function(){function c(a){var b=[];for(i in a)b.push(i+"="+escape(encodeURI(a[i])));return b.join("&")}function b(b,c){for(var g in a.headers)void 0===c[g]&&(c[g]=a.headers[g]);for(g in c)b.setRequestHeader(g,c[g])}var a={method:"GET",encode:"json",timeout:0,credentials:!0,headers:{Accept:"*/*","Content-type":"application/json;charset=UTF-8"}};Doom.fetch=function(e){return new Doom.Promise(function(l,g){var f=new XMLHttpRequest,q=e.encode||a.encode,r=e.timeout||a.timeout,t="undefined"!==typeof e.withCredentials?
e.withCredentials:a.credentials,m=e.headers||{};f.open(e.method||a.method,"string"===typeof e?e:e.url);f.timeout=r;t&&(f.withCredentials=!0);b(f,m);f.onload=function(){400>f.status&&200<=f.status?l(f.response):g(f)};f.onerror=function(){g(f)};f.onabort=function(){g(f)};0!==r&&setTimeout(f.abort.bind(f),r);"json"===q?f.send(e.data?JSON.stringify(e.data):null):"url"===q&&f.send(e.data?c(e.data):null)})};Doom.fetch.DEFAULTS=a})();(function(){function c(a){var e=a.element,l,g;if(e)if("string"===typeof e)e=Doom.search(e),a.element=e,c(a);else{if(!1===e instanceof HTMLElement&&e[0]){l=0;for(g=~~e.length;l<g;l++)a.element=e[l],c(a);return e}if(e instanceof HTMLElement)if(a.delay)l=a.delay,a.delay=null,setTimeout(c,l,a);else{for(l in a)l in b?b[l].apply(e,[a[l]]):e[l]=a[l];return e}else throw Error("Element TypeError - "+typeof e);}else throw Error("Element not defined");}var b={};b.tagName=b.alloyName=b.alloyProperties=b.copies=
function(){};b.onTap=b.ontap=function(a){return Doom.touch(this,"tap",a)};b.onSwipe=b.onswipe=function(a){return Doom.touch(this,"swipe",a)};b.onhold=b.onHold=function(a){return Doom.touch(this,"hold",a)};b.onpan=b.onPan=function(a){return Doom.touch(this,"pan",a)};b.ontouchstart=b.onTouchStart=function(a){return Doom.touch(this,"touchstart",a)};b.ontouchend=b.onTouchEnd=function(a){return Doom.touch(this,"touchend",a)};b.parentNode=b.parent=function(a){return a.appendChild(this)};b.insertBefore=
function(a){a.parentNode.insertBefore(this,a)};b.insertAfter=function(a){a.nextSibling?a.parentNode.insertBefore(this,a.nextSibling):a.parentNode.appendChild(this)};b.insertFirst=function(a){a.insertBefore(this,a.firstChild)};b.style=function(a){if("object"===typeof a)for(var b in a)this.style[b]=a[b];else if("string"===typeof a)this.style.cssText+=a;else throw Error("Style TypeError - "+typeof a);};b.addClass=function(a){this.classList.add.apply(this.classList,a.split(" "))};b.toggleClass=function(a){a=
a.split(" ");for(var b=0,c=a.length;b<c;b++)this.classList.toggle(a[b])};b.removeClass=function(a){this.classList.remove.apply(this.classList,a.split(" "))};b.addClasses=function(a){this.classList.add.apply(this.classList,a)};b.toggleClasses=function(a){for(var b=0,c=a.length;b<c;b++)this.classList.toggle(a[b])};b.removeClasses=function(a){this.classList.remove.apply(this.classList,a)};b.childNodes=b.children=function(a){for(;this.firstChild;)this.removeChild(this.firstChild);for(var b=0;b<a.length;b++)if(a[b]instanceof
HTMLElement)this.appendChild(a[b]);else if("string"===typeof a[b])for(var c=Doom.create({innerHTML:a[b]});c.firstChild;)this.appendChild(c.firstChild);else if("object"===typeof a[b])a[b].parentNode=this,a[b]=Doom.create(a[b]);else throw Error("Child TypeError - "+typeof a[b]);return a};b.child=function(a){if(1!==this.children.length||a!==this.firstChild){for(;this.firstChild;)this.removeChild(this.firstChild);if(a instanceof HTMLElement)this.appendChild(a);else if("string"===typeof a)for(var b=Doom.create({innerHTML:a});b.firstChild;)this.appendChild(b.firstChild);
else if("object"===typeof a)a.parentNode=this,a=Doom.create(a);else throw Error("Child TypeError - "+typeof a[i]);return a}};b.removeChild=function(a){"number"===typeof a?this.removeChild(this.childNodes[a]):this.removeChild(a)};b.removeChildren=b.removeChildNodes=function(a){for(var b=a.length;b--;)"number"===typeof a[b]&&(a[b]=this.childNodes[a[b]]);for(n=a.length;b--;)this.removeChild(a[b])};b.innerHTML=function(a){this.innerHTML!==a&&(this.innerHTML=a)};b.dataset=function(a){for(var b in prop)element.dataset[b]=
prop[b]};Doom.modify=c})();Doom.remove=function(c,b){if(b)setTimeout(Doom.remove,b,c);else{"string"===typeof c&&(c=Doom.search(c));if(c[0]){for(var a=c.length;a--;)Doom.remove(c[a]);return c}c.parentNode&&c.parentNode.removeChild(c)}return c};Doom.search=function(c,b){b=b||document;switch(c.charAt(0)){case ".":return b.getElementsByClassName(c.substr(1));case "#":return b.getElementById(c.substr(1));case "?":return b.querySelectorAll(c.substr(1));default:return b.getElementsByTagName(c)}};(function(){function c(a){function b(){h=null;k.x=null;k.y=null;k.t=null;d.event=null;d.gesture=null;d.pos_t_start=null;d.pos_t_previous=null;d.pos_t_end=null;d.pos_t_delta=null;d.pos_x_start=null;d.pos_x_previous=null;d.pos_x_end=null;d.pos_x_delta=null;d.pos_y_start=null;d.pos_y_previous=null;d.pos_y_end=null;d.pos_y_delta=null;d.pos_u_delta=null;d.vel_x=null;d.vel_y=null;d.vel_u=null;d.dist_x=null;d.dist_y=null;d.dist_u=null;d.direction=null;clearTimeout(u);u=null}function c(){k.x=h.pageX||h.changedTouches[0].pageX;
k.y=h.pageY||h.changedTouches[0].pageY;k.t=h.timeStamp}function g(a){h||(d.event=h=a,c(),d.pos_t_start=k.t,d.pos_x_start=k.x,d.pos_y_start=k.y,d.pos_t_delta=0,d.pos_x_delta=0,d.pos_y_delta=0,d.pos_u_delta=0,u=setTimeout(t,p.HOLD_MINTIME),m.event("touchstart",d),p.ANDRD_FIX_TOUCH_START_PREVENT_DFLT&&"touchstart"===h.type&&h.preventDefault())}function f(a){if(h){var b;d.event=h=a;d.pos_t_previous=k.t;d.pos_x_previous=k.x;d.pos_y_previous=k.y;c();d.pos_t_delta=k.t-d.pos_t_start;a=k.x-d.pos_x_previous;
b=k.y-d.pos_y_previous;d.pos_x_delta+=Math.abs(a);d.pos_y_delta+=Math.abs(b);d.pos_u_delta+=Math.sqrt(a*a+b*b);d.dist_x=k.x-d.pos_x_start;d.dist_y=k.y-d.pos_y_start;d.dist_u=Math.sqrt(d.dist_x*d.dist_x+d.dist_y*d.dist_y);d.vel_x=d.dist_x/d.pos_t_delta;d.vel_y=d.dist_y/d.pos_t_delta;d.vel_u=d.dist_u/d.pos_t_delta;m.event("touchmove",d);d.pos_u_delta>p.PAN_MINDELTA&&(Math.abs(d.dist_x)>Math.abs(d.dist_y)?(d.direction=0<a?"RIGHT":"LEFT",m.event("pan"+d.direction.toLowerCase(),d),m.event("panhorizontal",
d)):(d.direction=0<b?"DOWN":"UP",m.event("pan"+d.direction.toLowerCase(),d),m.event("panvertical",d)),m.event("pan",d))}}function q(a){if(h){var f;d.event=h=a;c();d.pos_t_end=k.t;d.pos_x_end=k.x;d.pos_y_end=k.y;d.pos_t_delta=k.t-d.pos_t_start;a=null===d.pos_x_previous?0:k.x-d.pos_x_previous;f=null===d.pos_y_previous?0:k.y-d.pos_y_previous;d.pos_x_delta+=Math.abs(a);d.pos_y_delta+=Math.abs(f);d.pos_u_delta+=Math.sqrt(a*a+f*f);d.dist_x=k.x-d.pos_x_start;d.dist_y=k.y-d.pos_y_start;d.dist_u=Math.sqrt(d.dist_x*
d.dist_x+d.dist_y*d.dist_y);d.vel_x=d.dist_x/d.pos_t_delta;d.vel_y=d.dist_y/d.pos_t_delta;d.vel_u=d.dist_u/d.pos_t_delta;m.event("touchend",d);"mouseleave"!==h.type&&"touchleave"!==h.type&&d.pos_t_delta<p.TAP_MAXTIME&&d.pos_u_delta<p.TAP_MAXDELTA&&(m.event("tap",d),p.PREVENT_DBL_CLICK&&h.preventDefault());d.pos_t_delta<p.SWIPE_MAXTIME&&d.vel_u>p.SWIPE_MINSPEED&&(Math.abs(d.dist_x)>Math.abs(d.dist_y)?(d.direction=0<d.dist_x?"RIGHT":"LEFT",m.event("swipe"+d.direction.toLowerCase(),d),m.event("swipehorizontal",
d)):(d.direction=0<d.dist_y?"DOWN":"UP",m.event("swipe"+d.direction.toLowerCase(),d),m.event("swipevertical",d)),m.event("swipe",d));b()}}function r(a){h&&p.END_ON_LEAVE&&q(a)}function t(){h&&(c(),d.pos_t_delta=k.t-d.pos_t_start,d.dist_u&&(d.vel_x=d.dist_x/d.pos_t_delta,d.vel_y=d.dist_y/d.pos_t_delta,d.vel_u=d.dist_u/d.pos_t_delta),d.pos_u_delta<p.HOLD_MAXDELTA&&m.event("hold",d))}var m=this,h=null,u=null,s=a.style,p={TAP_MAXTIME:500,TAP_MAXDELTA:20,PAN_MINDELTA:20,HOLD_MINTIME:500,HOLD_MAXDELTA:20,
SWIPE_MAXTIME:400,SWIPE_MINSPEED:1,END_ON_LEAVE:!1,PREVENT_DBL_CLICK:!1,ANDRD_FIX_TOUCH_START_PREVENT_DFLT:!1,TOUCH:"ontouchstart"in window,MOUSE:!0},k={x:null,y:null,t:null},d={pos:k,event:null,preventDefault:function(){h&&h.cancellable&&h.preventDefault()},stopProgagation:function(){h&&h.stopProgagation&&h.stopProgagation()},childIndex:function(b){b=b||a;for(var c=-1,d=0,e=b.children.length;d<e;d++)if(b.children[d].contains(h.target)){c=d;break}return c},childNode:function(b){b=b||a;for(var c,d=
0,e=b.children.length;d<e;d++)if(b.children[d].contains(h.target)){c=b.children[d];break}return c},element:a};this.detach=function(){p.TOUCH&&(a.removeEventListener("touchstart",g,!1),a.removeEventListener("touchmove",f,!1),document.body.removeEventListener("touchcancel",q,!1),document.body.removeEventListener("touchend",q,!1),a.removeEventListener("touchleave",r,!1));p.MOUSE&&(a.removeEventListener("mousedown",g,!1),a.removeEventListener("mousemove",f,!1),document.body.removeEventListener("mouseup",
q,!1),a.removeEventListener("mouseleave",r,!1))};this.attach=function(){p.TOUCH&&(a.addEventListener("touchstart",g,!1),a.addEventListener("touchmove",f,!1),document.body.addEventListener("touchcancel",q,!1),document.body.addEventListener("touchend",q,!1),a.addEventListener("touchleave",r,!1));p.MOUSE&&(a.addEventListener("mousedown",g,!1),a.addEventListener("mousemove",f,!1),document.body.addEventListener("mouseup",q,!1),a.addEventListener("mouseleave",r,!1))};s.webkitUserSelect="none";s.mozUserSelect=
"none";s.msUserSelect="none";s.webkitUserDrag="none";s.webkitTapHighlightColor="rgba(0,0,0,0)";b();this.attach();this.__eventlist__={};this.element=a;this.CONFIG=p;a.touches=this}var b=navigator.userAgent.match(/Android/i);c.prototype={on:function(a,c){"tap"===a&&(this.CONFIG.PREVENT_DBL_CLICK=!0);"pan"===a&&b&&(this.CONFIG.ANDRD_FIX_TOUCH_START_PREVENT_DFLT=!0);this.__eventlist__[a.toLowerCase()]=c},event:function(a,b){if("function"===typeof this.__eventlist__[a]){b.gesture=a;try{this.__eventlist__[a].call(this,
b)}catch(c){console.error(c.stack||c)}}}};Doom.touch=function(a,b,l){a.touches||new c(a);if(b&&b.constructor===Array)for(var g=0,f=b.length;g<f;g++)a.touches.on(b[g],l);else a.touches.on(b,l);return a.touches}})();})();}
