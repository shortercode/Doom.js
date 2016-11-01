/* Doom.js Library Version: 1.2.0 Copyright (c) 2015 Iain Shorter */if(!window.Doom){window.Doom = {}; (function() {'use strict';"indexOf"in Array.prototype||Object.defineProperty(Array.prototype,"indexOf",{value:function(b,a){for(var d=+a||0,e=this.length;d<e;d++)if(d in this&&this[d]===b)return d;return-1}});"trim"in String.prototype||Object.defineProperty(String.prototype,"trim",{value:function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}});
if(!("classList"in document.createElement("_"))&&"Element"in window){var classListGetter=function(){var b=new ClassList(this);Object.defineProperty(this,"classList",{get:function(){updateFromClassName(b,this.className);return b}});return b},ClassList=function(b){updateFromClassName(this,b.className);this._updateClassName=function(){b.className=this+""}},updateFromClassName=function(b,a){for(var d=a.trim(),d=d?d.split(/\s+/):[],e=b.length=0,f=d.length;e<f;e++)b.push(d[e])},checkTokenAndGetIndex=function(b,
a){if(""===a)throw new DOMEx("SYNTAX_ERR","The token provided must not be empty");if(/\s/.test(a))throw new DOMEx("INVALID_CHARACTER_ERR","The token provided ('"+a+"') contains HTML space characters, which are not valid in tokens");return b.indexOf(a)},DOMEx=function(b,a){this.name=b;this.code=DOMException[b];this.message=a};DOMEx.prototype=Error.prototype;ClassList.prototype=[];ClassList.prototype.item=function(b){return this[b]||null};ClassList.prototype.contains=function(b){return-1!==checkTokenAndGetIndex(this,
b+"")};ClassList.prototype.add=function(){for(var b=!1,a=0,d=arguments.length,e;a<d;a++)e=arguments[a]+"",-1===checkTokenAndGetIndex(this,e)&&(this.push(e),b=!0);b&&this._updateClassName(this)};ClassList.prototype.remove=function(){for(var b=0,a=arguments.length,d,e;b<a;b++)for(d=arguments[b]+"",e=checkTokenAndGetIndex(this,d);-1!==e;)this.splice(e,1),e=checkTokenAndGetIndex(this,d);this._updateClassName()};ClassList.prototype.toggle=function(b){b+="";var a=this.contains(b);this[a?"remove":"add"](b);
return!a};ClassList.prototype.toString=function(){return this.join(" ")};if(Object.defineProperty){var classListPropDesc={get:classListGetter,enumerable:!0,configurable:!0};try{Object.defineProperty(Element.prototype,"classList",classListPropDesc)}catch(ex){-2146823252===ex.number&&(classListPropDesc.enumerable=!1,Object.defineProperty(Element.prototype,"classList",classListPropDesc))}}else Object.prototype.__defineGetter__?elemCtrProto.__defineGetter__("classList",classListGetter):console.warn("Failed to add classlist polyfill")};if(window.Promise)Doom.Promise=window.Promise;else{var Promise=function(b){if(this instanceof Promise)this.state=STATE_INIT,this.subscriberqueue=[],this.settledValue=this.resolvehandler=this.rejectionhandler=void 0,b!==INTERNAL&&this.resolveWithResolver(b);else return new Promise(b)},tryCatch=function(b){return function(a,d){try{return b(a,d)}catch(e){return errorObj.e=e,errorObj}}},errorObj={e:null},STATE_INIT=0,STATE_PEND=1,STATE_RSLV=2,STATE_RJCT=3,INTERNAL=function(){};Promise.prototype={resolveWithResolver:function(b){var a=
this;this.state=STATE_PEND;b=tryCatch(b)(function(d){null!==a&&(a.resolveCallback(d),a=null)},function(d){null!==a&&(a.rejectCallback(d),a=null)});void 0!==b&&null!==a&&(a.rejectCallback(b.e),a=null)},resolveCallback:function(b){var a=this;b instanceof Promise?b.then(function(d){null!==a&&(a.resolveCallback(d),a=null)},function(d){null!==a&&(a.rejectCallback(d),a=null)}):(this.state=STATE_RSLV,this.resolvehandler?(b=tryCatch(this.resolvehandler)(b),b===errorObj?a.reject(b.e):b instanceof Promise?
b.then(function(d){null!==a&&(a.fulfill(d),a=null)},function(d){null!==a&&(a.reject(d),a=null)}):a.fulfill(b)):this.fulfill(b))},rejectCallback:function(b){var a=this;b instanceof Promise?b.then(function(d){null!==a&&(a.resolveCallback(d),a=null)},function(d){null!==a&&(a.rejectCallback(d),a=null)}):(this.state=STATE_RJCT,this.rejectionhandler?(b=tryCatch(this.rejectionhandler)(b),b===errorObj?(a.reject(b.e),a=null):b instanceof Promise?b.then(function(d){a.fulfill(d);a=null},function(d){a.reject(d);
a=null}):(a.fulfill(b),a=null)):this.reject(b))},fulfill:function(b){function a(a){return function(){a.resolveCallback(b);d.settledValue=b}}for(var d=this,e;this.subscriberqueue.length;)e=this.subscriberqueue.shift(),setTimeout(a(e),0)},reject:function(b,a){function d(a){return function(){a.rejectCallback(b);e.settledValue=b}}var e=this,f;if(!this.subscriberqueue.length)throw b;for(;this.subscriberqueue.length;)f=this.subscriberqueue.shift(),setTimeout(d(f),0)},then:function(b,a){var d=new Promise(INTERNAL);
d.resolvehandler=b;d.rejectionhandler=a;this.subscriberqueue.push(d);this.state===STATE_RSLV?this.fulfill(this.settledValue):this.state===STATE_RJCT&&this.reject(this.settledValue);return d},catch:function(b){return this.then(void 0,b)}};Doom.Promise=Promise};Element.prototype.contains||(Element.prototype.contains=function(b){return!!(this.compareDocumentPosition(b)&16)});var alloys={};function createAlloy(b,a){b=b.toLowerCase();if(alloys[b]){var d=new alloys[b](a);d.alloyName=b;d.element.alloy=d;return d.element}throw Error('Construction Error, alloy "'+b+'" does not exist');}Doom.define=function(b,a){b=b.toLowerCase();if(alloys[b])throw Error('Definition Error, alloy "'+b+'" already exists!');alloys[b]=a};(function(){function b(e){var b,l,g;if("object"!==typeof e)throw Error("Element object structure is not defined");if(g=e.refMap||e.referenceMap){if("object"!==typeof g)throw Error("Reference object is not an object");d.unshift(g)}l="string"===typeof e.alloyName||"string"===typeof e.alloy?createAlloy(e.alloyName||e.alloy,e.alloyProperties||{}):document.createElement(e.tagName||"div");for(b in e)b in a?a[b].apply(l,[e[b]]):l[b]=e[b];g&&d.shift();return l}var a={},d=[];a.tag=a.tagName=a.alloy=a.alloyName=
a.alloyProperties=a.copies=function(){};a.ref=a.reference=function(a){if(!d[0])throw Error('No reference map defined for "'+a+'"');if(d[0][a])throw Error('Label "'+a+'" already defined for reference map');d[0][a]=this};a.onTap=a.ontap=function(a){return Doom.touch(this,"tap",a)};a.onSwipe=a.onswipe=function(a){return Doom.touch(this,"swipe",a)};a.onhold=a.onHold=function(a){return Doom.touch(this,"hold",a)};a.onpan=a.onPan=function(a){return Doom.touch(this,"pan",a)};a.ontouchstart=a.onTouchStart=
function(a){return Doom.touch(this,"touchstart",a)};a.ontouchend=a.onTouchEnd=function(a){return Doom.touch(this,"touchend",a)};a.parentNode=a.parent=function(a){return a.appendChild(this)};a.insertBefore=function(a){a.parentNode.insertBefore(this,a)};a.insertAfter=function(a){a.nextSibling?a.parentNode.insertBefore(this,a.nextSibling):a.parentNode.appendChild(this)};a.insertFirst=function(a){a.insertBefore(this,a.firstChild)};a.style=function(a){if("object"===typeof a)for(var d in a)this.style[d]=
a[d];else if("string"===typeof a)this.style.cssText+=a;else throw Error("Style TypeError - "+typeof a);};a.childNodes=a.children=function(d){for(var b=0;b<d.length;b++)d[b]=a.child.apply(this,[d[b]]);return d};a.child=function(a){if(a instanceof HTMLElement)this.appendChild(a);else if("string"===typeof a)for(var d=Doom.create({innerHTML:a});d.firstChild;)this.appendChild(d.firstChild);else if("object"===typeof a)a.parentNode=this,a=b(a);else throw Error("Child TypeError - "+typeof a);return a};a.dataset=
function(a){for(var d in a)this.dataset[d]=a[d]};Doom.create=b})();function Service(){this.delegates=[];this.eventlist={}}
Service.prototype={on:function(b,a){this.eventlist[b]=a},fire:function(b,a){"function"===typeof this.eventlist[b]&&this.eventlist[b].call(this,a)},register:function(b){b=new Delegate(this,b);this.delegates.push(b);1===this.delegates.length&&this.fire("start");this.fire("register",b);return b},deregister:function(b){var a=this.delegates.indexOf(b);this.delegates.splice(a,1);this.fire("deregister",b);0===this.delegates.length&&this.fire("stop")},callDelegates:function(b,a){for(var d=this.delegates.length;d--;)this.delegates[d].fire(b,
a)}};function Delegate(b,a){this.eventlist={};this.service=b;this.context=a}Delegate.prototype={on:function(b,a){this.eventlist[b]=a;this.service.fire("listen",[b,this])},fire:function(b,a){"function"===typeof this.eventlist[b]&&this.eventlist[b].call(this.context,a)}};Doom.service=function(){return new Service};(function(){function b(a){var d=[];for(i in a)d.push(i+"="+escape(encodeURI(a[i])));return d.join("&")}function a(a,b){for(var l in d.headers)void 0===b[l]&&(b[l]=d.headers[l]);for(l in b)a.setRequestHeader(l,b[l])}var d={method:"GET",encode:"json",timeout:0,credentials:!0,headers:{Accept:"*/*","Content-type":"application/json;charset=UTF-8"}};Doom.fetch=function(e){return new Doom.Promise(function(f,l){var g=new XMLHttpRequest,q=e.encode||d.encode,r=e.timeout||d.timeout,m="undefined"!==typeof e.withCredentials?
e.withCredentials:d.credentials,h=e.headers||{};g.open(e.method||d.method,"string"===typeof e?e:e.url);g.timeout=r;m&&(g.withCredentials=!0);a(g,h);g.onload=function(){400>g.status&&200<=g.status?f(g.response):l(g)};g.onerror=function(){l(g)};g.onabort=function(){l(g)};0!==r&&setTimeout(g.abort.bind(g),r);"json"===q?g.send(e.data?JSON.stringify(e.data):null):"url"===q&&g.send(e.data?b(e.data):null)})};Doom.fetch.DEFAULTS=d})();(function(){function b(d){var e=d.element,f,l;if(e)if("string"===typeof e)e=Doom.search(e),d.element=e,b(d);else{if(!1===e instanceof HTMLElement&&e[0]){f=0;for(l=~~e.length;f<l;f++)d.element=e[f],b(d);return e}if(e instanceof HTMLElement)if(d.delay)f=d.delay,d.delay=null,setTimeout(b,f,d);else{for(f in d)f in a?a[f].apply(e,[d[f]]):e[f]=d[f];return e}else throw Error("Element TypeError - "+typeof e);}else throw Error("Element not defined");}var a={};a.tagName=a.alloyName=a.alloyProperties=a.copies=
function(){};a.onTap=a.ontap=function(a){return Doom.touch(this,"tap",a)};a.onSwipe=a.onswipe=function(a){return Doom.touch(this,"swipe",a)};a.onhold=a.onHold=function(a){return Doom.touch(this,"hold",a)};a.onpan=a.onPan=function(a){return Doom.touch(this,"pan",a)};a.ontouchstart=a.onTouchStart=function(a){return Doom.touch(this,"touchstart",a)};a.ontouchend=a.onTouchEnd=function(a){return Doom.touch(this,"touchend",a)};a.parentNode=a.parent=function(a){return a.appendChild(this)};a.insertBefore=
function(a){a.parentNode.insertBefore(this,a)};a.insertAfter=function(a){a.nextSibling?a.parentNode.insertBefore(this,a.nextSibling):a.parentNode.appendChild(this)};a.insertFirst=function(a){a.insertBefore(this,a.firstChild)};a.style=function(a){if("object"===typeof a)for(var b in a)this.style[b]=a[b];else if("string"===typeof a)this.style.cssText+=a;else throw Error("Style TypeError - "+typeof a);};a.addClass=function(a){this.classList.add.apply(this.classList,a.split(" "))};a.toggleClass=function(a){a=
a.split(" ");for(var b=0,f=a.length;b<f;b++)this.classList.toggle(a[b])};a.removeClass=function(a){this.classList.remove.apply(this.classList,a.split(" "))};a.addClasses=function(a){this.classList.add.apply(this.classList,a)};a.toggleClasses=function(a){for(var b=0,f=a.length;b<f;b++)this.classList.toggle(a[b])};a.removeClasses=function(a){this.classList.remove.apply(this.classList,a)};a.childNodes=a.children=function(a){for(;this.firstChild;)this.removeChild(this.firstChild);for(var b=0;b<a.length;b++)if(a[b]instanceof
HTMLElement)this.appendChild(a[b]);else if("string"===typeof a[b])for(var f=Doom.create({innerHTML:a[b]});f.firstChild;)this.appendChild(f.firstChild);else if("object"===typeof a[b])a[b].parentNode=this,a[b]=Doom.create(a[b]);else throw Error("Child TypeError - "+typeof a[b]);return a};a.child=function(a){if(1!==this.children.length||a!==this.firstChild){for(;this.firstChild;)this.removeChild(this.firstChild);if(a instanceof HTMLElement)this.appendChild(a);else if("string"===typeof a)for(var b=Doom.create({innerHTML:a});b.firstChild;)this.appendChild(b.firstChild);
else if("object"===typeof a)a.parentNode=this,a=Doom.create(a);else throw Error("Child TypeError - "+typeof a[i]);return a}};a.removeChild=function(a){"number"===typeof a?this.removeChild(this.childNodes[a]):this.removeChild(a)};a.removeChildren=a.removeChildNodes=function(a){for(var b=a.length;b--;)"number"===typeof a[b]&&(a[b]=this.childNodes[a[b]]);for(n=a.length;b--;)this.removeChild(a[b])};a.innerHTML=function(a){this.innerHTML!==a&&(this.innerHTML=a)};a.dataset=function(a){for(var b in prop)element.dataset[b]=
prop[b]};Doom.modify=b})();Doom.remove=function(b,a){if(a)setTimeout(Doom.remove,a,b);else{"string"===typeof b&&(b=Doom.search(b));if(b[0]){for(var d=b.length;d--;)Doom.remove(b[d]);return b}b.parentNode&&b.parentNode.removeChild(b)}return b};Doom.search=function(b,a){a=a||document;switch(b.charAt(0)){case ".":return a.getElementsByClassName(b.substr(1));case "#":return a.getElementById(b.substr(1));case "?":return a.querySelectorAll(b.substr(1));default:return a.getElementsByTagName(b)}};(function(){function b(a){function b(){h=null;k.x=null;k.y=null;k.t=null;c.event=null;c.gesture=null;c.pos_t_start=null;c.pos_t_previous=null;c.pos_t_end=null;c.pos_t_delta=null;c.pos_x_start=null;c.pos_x_previous=null;c.pos_x_end=null;c.pos_x_delta=null;c.pos_y_start=null;c.pos_y_previous=null;c.pos_y_end=null;c.pos_y_delta=null;c.pos_u_delta=null;c.vel_x=null;c.vel_y=null;c.vel_u=null;c.dist_x=null;c.dist_y=null;c.dist_u=null;c.direction=null;clearTimeout(t);t=null}function e(){k.x=h.pageX||h.changedTouches[0].pageX;
k.y=h.pageY||h.changedTouches[0].pageY;k.t=h.timeStamp}function f(a){h||(c.event=h=a,e(),c.pos_t_start=k.t,c.pos_x_start=k.x,c.pos_y_start=k.y,c.pos_t_delta=0,c.pos_x_delta=0,c.pos_y_delta=0,c.pos_u_delta=0,t=setTimeout(r,p.HOLD_MINTIME),m.event("touchstart",c))}function l(a){if(h){var b;c.event=h=a;c.pos_t_previous=k.t;c.pos_x_previous=k.x;c.pos_y_previous=k.y;e();c.pos_t_delta=k.t-c.pos_t_start;a=k.x-c.pos_x_previous;b=k.y-c.pos_y_previous;c.pos_x_delta+=Math.abs(a);c.pos_y_delta+=Math.abs(b);c.pos_u_delta+=
Math.sqrt(a*a+b*b);c.dist_x=k.x-c.pos_x_start;c.dist_y=k.y-c.pos_y_start;c.dist_u=Math.sqrt(c.dist_x*c.dist_x+c.dist_y*c.dist_y);c.vel_x=c.dist_x/c.pos_t_delta;c.vel_y=c.dist_y/c.pos_t_delta;c.vel_u=c.dist_u/c.pos_t_delta;m.event("touchmove",c);c.pos_u_delta>p.PAN_MINDELTA&&(Math.abs(c.dist_x)>Math.abs(c.dist_y)?(c.direction=0<a?"RIGHT":"LEFT",m.event("pan"+c.direction.toLowerCase(),c),m.event("panhorizontal",c)):(c.direction=0<b?"DOWN":"UP",m.event("pan"+c.direction.toLowerCase(),c),m.event("panvertical",
c)),m.event("pan",c))}}function g(a){if(h){var f;c.event=h=a;e();c.pos_t_end=k.t;c.pos_x_end=k.x;c.pos_y_end=k.y;c.pos_t_delta=k.t-c.pos_t_start;a=null===c.pos_x_previous?0:k.x-c.pos_x_previous;f=null===c.pos_y_previous?0:k.y-c.pos_y_previous;c.pos_x_delta+=Math.abs(a);c.pos_y_delta+=Math.abs(f);c.pos_u_delta+=Math.sqrt(a*a+f*f);c.dist_x=k.x-c.pos_x_start;c.dist_y=k.y-c.pos_y_start;c.dist_u=Math.sqrt(c.dist_x*c.dist_x+c.dist_y*c.dist_y);c.vel_x=c.dist_x/c.pos_t_delta;c.vel_y=c.dist_y/c.pos_t_delta;
c.vel_u=c.dist_u/c.pos_t_delta;m.event("touchend",c);"mouseleave"!==h.type&&"touchleave"!==h.type&&c.pos_t_delta<p.TAP_MAXTIME&&c.pos_u_delta<p.TAP_MAXDELTA&&(m.event("tap",c),p.PREVENT_DBL_CLICK&&h.preventDefault());c.pos_t_delta<p.SWIPE_MAXTIME&&c.vel_u>p.SWIPE_MINSPEED&&(Math.abs(c.dist_x)>Math.abs(c.dist_y)?(c.direction=0<c.dist_x?"RIGHT":"LEFT",m.event("swipe"+c.direction.toLowerCase(),c),m.event("swipehorizontal",c)):(c.direction=0<c.dist_y?"DOWN":"UP",m.event("swipe"+c.direction.toLowerCase(),
c),m.event("swipevertical",c)),m.event("swipe",c));b()}}function q(a){h&&p.END_ON_LEAVE&&g(a)}function r(){h&&(e(),c.pos_t_delta=k.t-c.pos_t_start,c.dist_u&&(c.vel_x=c.dist_x/c.pos_t_delta,c.vel_y=c.dist_y/c.pos_t_delta,c.vel_u=c.dist_u/c.pos_t_delta),c.pos_u_delta<p.HOLD_MAXDELTA&&m.event("hold",c))}var m=this,h=null,t=null,s=a.style,p={TAP_MAXTIME:500,TAP_MAXDELTA:20,PAN_MINDELTA:20,HOLD_MINTIME:500,HOLD_MAXDELTA:20,SWIPE_MAXTIME:400,SWIPE_MINSPEED:1,END_ON_LEAVE:!1,PREVENT_DBL_CLICK:!1,TOUCH:"ontouchstart"in
window,MOUSE:!0},k={x:null,y:null,t:null},c={pos:k,event:null,preventDefault:function(){h&&h.cancellable&&h.preventDefault()},stopProgagation:function(){h&&h.stopProgagation&&h.stopProgagation()},childIndex:function(b){b=b||a;for(var c=-1,d=0,e=b.children.length;d<e;d++)if(b.children[d].contains(h.target)){c=d;break}return c},childNode:function(b){b=b||a;for(var c,d=0,e=b.children.length;d<e;d++)if(b.children[d].contains(h.target)){c=b.children[d];break}return c},element:a};this.detach=function(){p.TOUCH&&
(a.removeEventListener("touchstart",f,!1),a.removeEventListener("touchmove",l,!1),document.body.removeEventListener("touchcancel",g,!1),document.body.removeEventListener("touchend",g,!1),a.removeEventListener("touchleave",q,!1));p.MOUSE&&(a.removeEventListener("mousedown",f,!1),a.removeEventListener("mousemove",l,!1),document.body.removeEventListener("mouseup",g,!1),a.removeEventListener("mouseleave",q,!1))};this.attach=function(){p.TOUCH&&(a.addEventListener("touchstart",f,!1),a.addEventListener("touchmove",
l,!1),document.body.addEventListener("touchcancel",g,!1),document.body.addEventListener("touchend",g,!1),a.addEventListener("touchleave",q,!1));p.MOUSE&&(a.addEventListener("mousedown",f,!1),a.addEventListener("mousemove",l,!1),document.body.addEventListener("mouseup",g,!1),a.addEventListener("mouseleave",q,!1))};s.webkitUserSelect="none";s.mozUserSelect="none";s.msUserSelect="none";s.webkitUserDrag="none";s.webkitTapHighlightColor="rgba(0,0,0,0)";b();this.attach();this.__eventlist__={};this.element=
a;this.CONFIG=p;a.touches=this}b.prototype={on:function(a,b){"tap"===a&&(this.CONFIG.PREVENT_DBL_CLICK=!0);this.__eventlist__[a.toLowerCase()]=b},event:function(a,b){if("function"===typeof this.__eventlist__[a]){b.gesture=a;try{this.__eventlist__[a].call(this,b)}catch(e){console.error(e.stack||e)}}}};Doom.touch=function(a,d,e){a.touches||new b(a);if(d&&d.constructor===Array)for(var f=0,l=d.length;f<l;f++)a.touches.on(d[f],e);else a.touches.on(d,e);return a.touches}})();})();}
