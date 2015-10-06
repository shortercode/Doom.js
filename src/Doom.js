/**
 * @preserve
 * Doom.js Library
 * Version: 1.1.0
 * Copyright (c) 2015 Iain Shorter 
 * Licensed under MIT license
 *
 * Javascript framework to simplify high level JS -> DOM interaction including:
 * - Touch gestures
 * - Tree based multi node creation
 * - Hybrid JS/HTML element definition and creation
 *
 */
(function(view) {
	"use strict";
	if (!("classList" in document.createElement("_")) && ('Element' in view)) {
		var classListProp = "classList",
			protoProp = "prototype",
			elemCtrProto = view.Element[protoProp],
			objCtr = Object,
			strTrim = String[protoProp].trim || function() {
				return this.replace(/^\s+|\s+$/g, "");
			},
			arrIndexOf = Array[protoProp].indexOf || function(item) {
				var i = 0,
					len = this.length;
				for (; i < len; i++) {
					if (i in this && this[i] === item) {
						return i;
					}
				}
				return -1;
			},
			// Vendors: please allow content code to instantiate DOMExceptions
			DOMEx = function(type, message) {
				this.name = type;
				this.code = DOMException[type];
				this.message = message;
			},
			checkTokenAndGetIndex = function(classList, token) {
				if (token === "") {
					throw new DOMEx(
						"SYNTAX_ERR", "An invalid or illegal string was specified"
					);
				}
				if (/\s/.test(token)) {
					throw new DOMEx(
						"INVALID_CHARACTER_ERR", "String contains an invalid character"
					);
				}
				return arrIndexOf.call(classList, token);
			},
			ClassList = function(elem) {
				var trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
					classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
					i = 0,
					len = classes.length;
				for (; i < len; i++) {
					this.push(classes[i]);
				}
				this._updateClassName = function() {
					elem.setAttribute("class", this.toString());
				};
			},
			classListProto = ClassList[protoProp] = [],
			classListGetter = function() {
				return new ClassList(this);
			};
		// Most DOMException implementations don't allow calling DOMException's toString()
		// on non-DOMExceptions. Error's toString() is sufficient here.
		DOMEx[protoProp] = Error[protoProp];
		classListProto.item = function(i) {
			return this[i] || null;
		};
		classListProto.contains = function(token) {
			token += "";
			return checkTokenAndGetIndex(this, token) !== -1;
		};
		classListProto.add = function(token) {
			token += "";
			if (checkTokenAndGetIndex(this, token) === -1) {
				this.push(token);
				this._updateClassName();
			}
		};
		classListProto.remove = function(token) {
			var index;
			token += "";
			index = checkTokenAndGetIndex(this, token);
			while (index !== -1) {
				this.splice(index, 1);
				this._updateClassName();
				index = checkTokenAndGetIndex(this, token);
			}
		};
		classListProto.toggle = function(token) {
			token += "";
			var result = this.contains(token);
			this[(result ? "remove" : "add")](token);
			return !result;
		};
		classListProto.toString = function() {
			return this.join(" ");
		};
		if (objCtr.defineProperty) {
			var classListPropDesc = {
				get: classListGetter,
				enumerable: true,
				configurable: true
			};
			try {
				objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
			} catch (ex) { // IE 8 doesn't support enumerable:true
				if (ex.number === -0x7FF5EC54) {
					classListPropDesc.enumerable = false;
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				}
			}
		} else if (objCtr[protoProp].__defineGetter__) {
			elemCtrProto.__defineGetter__(classListProp, classListGetter);
		}	
	}
}(self));
(function(){  
	"use strict";
    /** @const */
    var head = document.head;
    /** @dict */
    var alloys = {};
    /** 
     * Touch Listener Class
     * Wraps recognisor logic for all gesture types
     * @constructor
     */
    function TouchListener(element) {
		var that = this,
			event = null,
            timer = null,
			style = element.style,
			config = {
				TAP_MAXTIME: 500,
				TAP_MAXDELTA: 20,
				PAN_MINDELTA: 20,
                HOLD_MINTIME: 1000,
                HOLD_MAXDELTA: 20,
				SWIPE_MAXTIME: 400,
				SWIPE_MINSPEED: 1,
                END_ON_LEAVE: false
			},
			pos = {
				x: null,
				y: null,
				t: null
			},
			motion = {
				pos: pos,
				event: null,
				preventDefault: function() {
					event && event.cancellable && event.preventDefault();
				},
				stopProgagation: function() {
					event && event.stopProgagation && event.stopProgagation();
				}
			};
		function clear() {
			event = null;
			pos.x = null;
			pos.y = null;
			pos.t = null;
			motion.event = null;
            motion.gesture = null;
			motion.pos_t_start = null;
			motion.pos_t_previous = null;
			motion.pos_t_end = null;
			motion.pos_t_delta = null;
			motion.pos_x_start = null;
			motion.pos_x_previous = null;
			motion.pos_x_end = null;
			motion.pos_x_delta = null;
			motion.pos_y_start = null;
			motion.pos_y_previous = null;
			motion.pos_y_end = null;
			motion.pos_y_delta = null;
			motion.pos_u_delta = null;
			motion.vel_x = null;
			motion.vel_y = null;
			motion.vel_u = null;
			motion.dist_x = null;
			motion.dist_y = null;
			motion.dist_u = null;
			motion.direction = null;
            clearTimeout(timer);
            timer = null;
		}
		function getpos() {
			pos.x = event.pageX || event.changedTouches[0].pageX;
			pos.y = event.pageY || event.changedTouches[0].pageY;
			pos.t = event.timeStamp;
		}
		function start(e) {
			if (!event) {
				motion.event = event = e;
				getpos();
				motion.pos_t_start = pos.t;
				motion.pos_x_start = pos.x;
				motion.pos_y_start = pos.y;
				motion.pos_t_delta = 0;
				motion.pos_x_delta = 0;
				motion.pos_y_delta = 0;
				motion.pos_u_delta = 0;
                timer = setTimeout(timeout, config.HOLD_MINTIME);
				that.event('touchstart', motion);
			}
		}
		function move(e) {
			if (event) {
				var x_delta, y_delta;
				motion.event = event = e;
				motion.pos_t_previous = pos.t;
				motion.pos_x_previous = pos.x;
				motion.pos_y_previous = pos.y;
				getpos();
				motion.pos_t_delta = pos.t - motion.pos_t_start;
				x_delta = pos.x - motion.pos_x_previous;
				y_delta = pos.y - motion.pos_y_previous;
				motion.pos_x_delta += Math.abs(x_delta);
				motion.pos_y_delta += Math.abs(y_delta);
				motion.pos_u_delta += Math.sqrt(x_delta * x_delta + y_delta * y_delta);	
				motion.dist_x = pos.x - motion.pos_x_start;
				motion.dist_y = pos.y - motion.pos_y_start;
				motion.dist_u = Math.sqrt(motion.dist_x * motion.dist_x + motion.dist_y * motion.dist_y);
				motion.vel_x = motion.dist_x / motion.pos_t_delta;
				motion.vel_y = motion.dist_y / motion.pos_t_delta;
				motion.vel_u = motion.dist_u / motion.pos_t_delta;
				that.event('touchmove', motion);
				if (motion.pos_u_delta > config.PAN_MINDELTA) { // Pan Recognition Logic
					if (Math.abs(motion.dist_x) > Math.abs(motion.dist_y)) {
						motion.direction = x_delta > 0 ? 'RIGHT' : 'LEFT';
                        that.event('pan' + motion.direction.toLowerCase(), motion);
                        that.event('pan' + 'horizontal', motion);
					} else {
						motion.direction = y_delta > 0 ? 'DOWN' : 'UP';
                        that.event('pan' + motion.direction.toLowerCase(), motion);
                        that.event('pan' + 'vertical', motion);
					}
					that.event('pan', motion);
				}
			}
		}
		function end(e) {
			if (event) {
				var x_delta, y_delta;
				motion.event = event = e;
				getpos();
				motion.pos_t_end = pos.t;
				motion.pos_x_end = pos.x;
				motion.pos_y_end = pos.y;
				motion.pos_t_delta = pos.t - motion.pos_t_start;
				x_delta = motion.pos_x_previous === null ? 0 : pos.x - motion.pos_x_previous;
				y_delta = motion.pos_y_previous === null ? 0 : pos.y - motion.pos_y_previous;
				motion.pos_x_delta += Math.abs(x_delta);
				motion.pos_y_delta += Math.abs(y_delta);
				motion.pos_u_delta += Math.sqrt(x_delta * x_delta + y_delta * y_delta);
				motion.dist_x = pos.x - motion.pos_x_start;
				motion.dist_y = pos.y - motion.pos_y_start;
				motion.dist_u = Math.sqrt(motion.dist_x * motion.dist_x + motion.dist_y * motion.dist_y);
				motion.vel_x = motion.dist_x / motion.pos_t_delta;
				motion.vel_y = motion.dist_y / motion.pos_t_delta;
				motion.vel_u = motion.dist_u / motion.pos_t_delta;
				that.event('touchend', motion);
				if (event.type !== 'mouseleave' && event.type !== 'touchleave' && motion.pos_t_delta < config.TAP_MAXTIME && motion.pos_u_delta < config.TAP_MAXDELTA) { // Tap Recognition Logic
					that.event('tap', motion);
					event.preventDefault();
				}
				if (motion.pos_t_delta < config.SWIPE_MAXTIME && motion.vel_u > config.SWIPE_MINSPEED) {
					if (Math.abs(motion.dist_x) > Math.abs(motion.dist_y)) {
						motion.direction = motion.dist_x > 0 ? 'RIGHT' : 'LEFT';
                        that.event('swipe' + motion.direction.toLowerCase(), motion);
                        that.event('swipe' + 'horizontal', motion);
					} else {
						motion.direction = motion.dist_y > 0 ? 'DOWN' : 'UP';
                        that.event('swipe' + motion.direction.toLowerCase(), motion);
                        that.event('swipe' + 'vertical', motion);
					}
					that.event('swipe', motion);
				}
				clear();
			}
		}
        function leave(e) {
            if (event && config.END_ON_LEAVE) {   
                end(e);
            }
        }
        function timeout() {
            if (event) {
                getpos();
				motion.pos_t_delta = pos.t - motion.pos_t_start;
                if (motion.dist_u) {
                    motion.vel_x = motion.dist_x / motion.pos_t_delta;
                    motion.vel_y = motion.dist_y / motion.pos_t_delta;
                    motion.vel_u = motion.dist_u / motion.pos_t_delta;
                }
                if (motion.pos_u_delta < config.HOLD_MAXDELTA) { // Hold Recognition Logic
					that.event('hold', motion);
				}
            }
        }
		function detach() {
			element.removeEventListener('touchstart', start, false);
			element.removeEventListener('mousedown', start, false);
			element.removeEventListener('touchmove', move, false);
			element.removeEventListener('mousemove', move, false);
			element.removeEventListener('touchleave', leave, false);
			element.removeEventListener('mouseleave', leave, false);
			document.body.removeEventListener('touchcancel', end, false);
			document.body.removeEventListener('mouseup', end, false);
			document.body.removeEventListener('touchend', end, false);
		}
		function attach() {
			element.addEventListener('touchstart', start, false);
			element.addEventListener('mousedown', start, false);
			element.addEventListener('touchmove', move, false);
			element.addEventListener('mousemove', move, false);
			element.addEventListener('touchleave', leave, false);
			element.addEventListener('mouseleave', leave, false);
			document.body.addEventListener('touchcancel', end, false);
			document.body.addEventListener('mouseup', end, false);
			document.body.addEventListener('touchend', end, false);
		}
		style.webkitUserSelect = 'none';
		style.mozUserSelect = 'none';
		style.msUserSelect = 'none';
		style.webkitUserDrag = 'none';
		//style.touchAction = 'none';
		//style.msTouchAction = 'none';
		style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
		clear();
		attach();
        /** @dict */
		this.__eventlist__ = {};
		this["detach"] = detach;
		this["attach"] = attach;
		this["element"] = element;
		this["CONFIG"] = config;
		element["touches"] = this;
	}
	TouchListener.prototype = {
		on: function (event, func) {
			this.__eventlist__[event.toLowerCase()] = func;
		},
		event: function (event, arg) {
			if (typeof (this.__eventlist__[event]) === 'function') {
                arg.gesture = event;
				try {
					this.__eventlist__[event].call(this, arg);
				}
				catch (error) {
					console.warn(error.stack || error);
				}
			}
		}
	};
    /**
     *  Creates a HTML element from a stub
     *  @param {Object<string, *>} obj 
     */
    function createElement(obj){
        var i,
            prop,
            element;
        if (typeof obj !== 'object') {
            throw new Error('Element object structure is not defined');
        }
        if (typeof obj.alloyName === 'string') { 
            //hybrid html element, constructed using JS class
            element = createAlloy( obj["alloyName"], obj["alloyProperties"] || {} );
        } else { 
            if (typeof obj.tagName === 'string') { 
                //normal html element, constructed using native method
                element = document.createElement(obj.tagName);
            } else { // no construction method 
            	element = document.createElement('div'); //default to div
                //throw new Error('Element type not defined. element.tagName || element.alloyName');
            }
        }
        for (i in obj) {
            prop = obj[i];
            switch (i) {
            case 'tagName': 
            case 'alloyName':
            case 'alloyProperties':
            case 'copies':
                break; //ignore 
            case 'ontap':
                addTouch(element, 'tap', prop);
                break;	
            case 'onswipe':
                addTouch(element, 'swipe', prop);
                break; 	
            case 'onpan':
                addTouch(element, 'pan', prop);
                break;
            case 'onhold':
                addTouch(element, 'hold', prop);
                break;
            case 'parentNode':
                prop.appendChild(element);
                break;
            case 'style':
                if (typeof prop === 'object') {
                    for( i in prop ){
                        element.style[i] = prop[i];
                    }
                } else if ( typeof prop === 'string' ) {
                    element.style.cssText = prop;
                } else {
                    throw new Error('Style TypeError - ' + typeof prop);
                }
                break;
            case 'dataset':
            	for (i in prop) {
            		element.dataset[i] = prop[i];
            	}
            	break;
            case 'childNodes':
                for (i = 0; i < prop.length; i++) {
                    if (prop[i] instanceof HTMLElement) { 
                        //child is already element
                        element.appendChild(prop[i]);
                    } else if (typeof prop[i] === 'object') { 
                        //child is an element stub
                        prop[i].parentNode = element;
                        prop[i] = createElement(prop[i]);
                    } else {
                        throw new Error('Child ' + i + ' TypeError - ' + typeof prop[i]);
                    }
                }
                break;
            case 'childNode':
            	if (prop instanceof HTMLElement) { 
					//child is already element
					element.appendChild(prop);
				} else if (typeof prop === 'object') { 
					//child is an element stub
					prop.parentNode = element;
					prop = createElement(prop);
				} else {
					throw new Error('Child TypeError - ' + typeof prop);
				}
            	break;
            default:
                element[i] = prop;
                break;
            }
        }
        return element;
    }
    /** 
     * Searches for an element using a given selector
     * @param {string} selector
     * @param {Object|undefined} parent
     */
    function searchElement(selector, parent){
        parent = parent || document; //if no element selected then use document
        switch(selector.charAt(0)){
        case '.': 
            return parent.getElementsByClassName(selector.substr(1));
            break;
        case '#':
            return parent.getElementById(selector.substr(1));
            break;
        case '?':
            return parent.querySelectorAll(selector.substr(1));
        default:
            return parent.getElementsByTagName(selector);
            break;
        }
    }
    function modifyElement( obj ){
		var element = obj["element"],
            prop,
            i;
		if (!element) {
			throw new Error("Element not defined");
        }
		for (i in obj) {
            prop = obj[i];
            switch(i){
                case 'tagName': 
                case 'alloyName':
                case 'alloyProperties':
                case 'copies':
                    break; //ignore  
            	case 'ontap':
                	addTouch(element, 'tap', prop);
                	break;              	
                case 'onswipe':
                	addTouch(element, 'swipe', prop);
                	break;              	
                case 'onpan':
                	addTouch(element, 'pan', prop);
                	break;
                case 'onhold':
                    addTouch(element, 'hold', prop);
                    break;
                case 'parentNode':
                    prop.appendChild(element);
                    break;				
				case 'addClass':
					element.classList.add(prop);
					break;				
				case 'toggleClass':
					element.classList.toggle(prop);
					break;
				case 'removeClass':
					element.classList.remove(prop);
					break;
				case 'dataset':
					for (i in prop) {
						element.dataset[i] = prop[i];
					}
					break;
                case 'style':
                    if(typeof prop === 'object'){
                        for( i in obj.style ){
                            element.style[i] = obj.style[i];
                        }
                    }else if( typeof obj.style === 'string' ){
                        element.style.cssText += obj.style;
                    }else{
                        throw new Error('Style TypeError - '+ typeof obj.style);
                    }
                    break;
                    
                case 'innerHTML':
                	if(element[i] !== obj[i]) {
                		element[i] = obj[i];
                	}
                	break;
                    
                case 'removeChild':
                    if(typeof obj[i] === 'number') {
                        element.removeChild(element.childNodes[obj[i]]);
                    } else {
                        element.removeChild(obj[i]);
                    }
                    break;
                case 'removeChildren':
                    var n = obj[i].length;
                    while(i--) {
                        if(typeof obj[i][n] === 'number') {
                            obj[i][n] = element.childNodes[obj[i][n]];
                        }
                    }
                    n = obj[i].length;
                    while(i--) {
                        element.removeChild(obj[i][n]);
                    }
                    break;
                case 'appendChild':
                    break;

                case 'childNodes':
                	while (element.firstChild) {
					   element.removeChild(element.firstChild);
					}
					
                    for(i = 0; i < obj.childNodes.length; i++){
                        if(obj.childNodes[i] instanceof HTMLElement){ 
                            //child is already element
                            element.appendChild(obj.childNodes[i]);
                        }else if(typeof obj.childNodes[i] == 'object'){ 
                            //child is an element stub
                            obj.childNodes[i].parentNode = element;
                            obj.childNodes[i] = createElement(obj.childNodes[i]);
                        }else{
                            throw new Error('Child '+i+' TypeError - '+ typeof obj.childNodes[i]);
                        }
                    }
                    break;

                default:
                    element[i] = obj[i];
                    break;

            }
        }
        return element;
    }
    function removeElement( element ){
		if(element.parentNode)
			element.parentNode.removeChild(element);
		return element;
	}
    function createAlloy( key, properties ){
        if (alloys[key]) {
            var alloy = new alloys[key](properties);
            alloy.alloyName = key;
            alloy.element.alloy = alloy;
            return alloy.element;
        } else {
            throw new Error("Construction Error, alloy does not exist");   
        }
    }
    function defineAlloy( key, constructor){
        key = key.toLowerCase();
        if (alloys[key]) {
            throw new Error("Definition Error, alloy already exists!");
        } else {
            alloys[key] = constructor;
        }
    }
	function addTouch(element, event , fn) {
		if (!element.touches) {
			new TouchListener(element);
		}
        if (event && event.constructor === Array) {
            for (var i = 0, l = event.length; i < l; i++) {
                element.touches.on(event[i], fn);   
            }
        } else {
            element.touches.on(event, fn);
        }
	}
	window["Doom"] = {
        create: createElement,
        modify: modifyElement,
        search: searchElement,
        remove: removeElement,
        define: defineAlloy,
        touch: addTouch
    };
}());