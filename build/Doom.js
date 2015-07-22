/*

Doom.js Library
Version: 0.3.0
Copyright (c) 2015 Iain Shorter 
Licensed under MIT license

Javascript framework to simply high level JS -> DOM interaction including:
- Touch gestures
- Tree based multi node creation
- Hybrid JS/HTML element definition and creation

*/

window.Doom = (function(){  

	"use strict";
    
    var head = document.head;
    var alloys = {};
    
    //====/====/====/====/====/====/====/====/====/====/====/====/====/====/
    
    function createElement(obj){
        var i;
        var element;

        if(typeof obj.copies === 'number'){ //multiple copies of the same stub

            i = obj.copies;
            element = Array(i);
            while(i--){
                element[i](createElement(obj));
            }
            return element;
        }

        if(typeof obj !== 'object')
            throw 'Element object structure is not defined';

        if(typeof obj.alloyName === 'string'){ 
            //hybrid html element, constructed using JS class
            element = createAlloy( obj.alloyName, obj.alloyProperties || {} );
        }else{ 
            if(typeof obj.tagName === 'string'){ 
                //normal html element, constructed using native method
                element = document.createElement(obj.tagName);
            }else{ // no construction method 
                throw 'Element type not defined. element.tagName || element.alloyName';
            }
        }

        for(i in obj){
            switch(i){

                case 'tagName': 
                case 'alloyName':
                case 'alloyProperties':
                case 'copies':
                    break; //ignore
                    
                case 'ontap':
                	addTouch(element, 'tap', obj.ontap);
                	break;
                	
                case 'onswipe':
                	addTouch(element, 'swipe', obj.onswipe);
                	break;
                	
                case 'onpan':
                	addTouch(element, 'pan', obj.onpan);
                	break;

                case 'parentNode':
                    obj[i].appendChild(element);
                    break;

                case 'style':
                    if(typeof obj.style === 'object'){
                        for( i in obj.style ){
                            element.style[i] = obj.style[i];
                        }
                    }else if( typeof obj.style === 'string' ){
                        element.style.cssText = obj.style;
                    }else{
                        throw 'Style TypeError - '+ typeof obj.style;
                    }
                    break;

                case 'childNodes':
                    for(i = 0; i < obj.childNodes.length; i++){
                        if(obj.childNodes[i] instanceof HTMLElement){ 
                            //child is already element
                            element.appendChild(obj.childNodes[i]);
                        }else if(typeof obj.childNodes[i] == 'object'){ 
                            //child is an element stub
                            obj.childNodes[i].parentNode = element;
                            obj.childNodes[i] = createElement(obj.childNodes[i]);
                        }else{
                            throw 'Child '+i+' TypeError - '+ typeof obj.childNodes[i];
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

    function searchElement(selector, parent){
        parent = parent || document; //if no element selected then use document
        switch(selector[0]){
            case '.': // class
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
		
		var element = obj.element;
		var i;
		if(!element)
			throw "Element not defined ";
		
		for(i in obj){
            switch(i){

                case 'tagName': 
                case 'alloyName':
                case 'alloyProperties':
                case 'copies':
                    break; //ignore
                    
            	case 'ontap':
                	addTouch(element, 'tap', obj.ontap);
                	break;
                	
                case 'onswipe':
                	addTouch(element, 'swipe', obj.onswipe);
                	break;
                	
                case 'onpan':
                	addTouch(element, 'pan', obj.onpan);
                	break;

                case 'parentNode':
                    obj[i].appendChild(element);
                    break;
					
				case 'addClass':
					element.classList.add(obj[i]);
					break;
					
				case 'toggleClass':
					element.classList.toggle(obj[i]);
					break;

				case 'removeClass':
					element.classList.remove(obj[i]);
					break;

                case 'style':
                    if(typeof obj.style === 'object'){
                        for( i in obj.style ){
                            element.style[i] = obj.style[i];
                        }
                    }else if( typeof obj.style === 'string' ){
                        element.style.cssText += obj.style;
                    }else{
                        throw 'Style TypeError - '+ typeof obj.style;
                    }
                    break;
                    
                case 'innerHTML':
                	if(element[i] !== obj[i]) {
                		element[i] = obj[i];
                	}
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
                            throw 'Child '+i+' TypeError - '+ typeof obj.childNodes[i];
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
	
	//====/====/====/====/====/====/====/====/====/====/====/====/====/====/

    function createAlloy( key, properties ){
        if(alloys[key]){
            var alloy = new alloys[key](properties);
            alloy.element.alloy = alloy;
            return alloy.element;
        }else{
            throw "Construction Error, alloy does not exist";   
        }
    }

    function defineAlloy( key, constructor){
        key = key.toLowerCase();
        if(alloys[key])
            throw "Definition Error, alloy already exists!";
        else
            alloys[key] = constructor;
    }
    
	//====/====/====/====/====/====/====/====/====/====/====/====/====/====/
    
    function getScript(path,success,error){
        var node = document.createElement('script');
        node.done = false;
        node.success = success || false;
        node.failure = error || false;
        node.src = path;
        node.onerror = getScript_error;
        node.onload = node.onreadystatechange = getScript_success;
        head.appendChild(node);
        return node;
    }
    
    function getScript_error(){
        if(this.done)return;
        if(this.failure)this.failure();
        this.done = true;
        this.onload = this.onreadystatechange = this.onerror = null;
        this.parentNode.removeChild(this);
        this.success = this.failure = null;
    }
    
    function getScript_success(){
        if(this.done)return;
        if (!this.readyState || this.readyState == 4 || this.readyState == 'loaded'){
            if(this.success)this.success();
            this.done = true;
            this.onload = this.onreadystatechange = this.onerror = null;
            this.parentNode.removeChild(this);
            this.success = this.failure = null;
        }
    }
    
	//====/====/====/====/====/====/====/====/====/====/====/====/====/====/
	
	function addTouch(element, event , fn) {
		if(!element.touches) {
			new TouchListener(element);
		}
		element.touches.on(event, fn);
	}
    
	function TouchListener(element) {
		var that = this,
			event = null,
			style = element.style,
			config = {
				TAP_MAXTIME: 500,
				TAP_MAXDELTA: 20,
				PAN_MINDELTA: 20,
				SWIPE_MAXTIME: 400,
				SWIPE_MINSPEED: 1
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
					event && event.preventDefault && event.preventDefault();
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
						motion.direction = motion.dist_x > 0 ? "RIGHT" : "LEFT";
					} else {
						motion.direction = motion.dist_y > 0 ? "DOWN" : "UP";
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
				
				console.log();
			
				that.event('touchend', motion);
			
				if (event.type !== 'mouseleave' && event.type !== 'touchleave' && motion.pos_t_delta < config.TAP_MAXTIME && motion.pos_u_delta < config.TAP_MAXDELTA) { // Tap Recognition Logic
					that.event('tap', motion);
				}
			
				if (motion.pos_t_delta < config.SWIPE_MAXTIME && motion.vel_u > config.SWIPE_MINSPEED) {
					if (Math.abs(motion.dist_x) > Math.abs(motion.dist_y)) {
						motion.direction = motion.dist_x > 0 ? "RIGHT" : "LEFT";
					} else {
						motion.direction = motion.dist_y > 0 ? "DOWN" : "UP";
					}
					that.event('swipe', motion);
				}
			
				clear();
			}
		}
	
		function detach() {
			element.removeEventListener('touchstart', start, false);
			element.removeEventListener('mousedown', start, false);
			element.removeEventListener('touchmove', move, false);
			element.removeEventListener('mousemove', move, false);
			element.removeEventListener('touchleave', end, false);
			element.removeEventListener('mouseleave', end, false);
			document.body.removeEventListener('touchcancel', end, false);
			document.body.removeEventListener('mouseup', end, false);
			document.body.removeEventListener('touchend', end, false);
		}
	
		function attach() {
			element.addEventListener('touchstart', start, false);
			element.addEventListener('mousedown', start, false);
			element.addEventListener('touchmove', move, false);
			element.addEventListener('mousemove', move, false);
			element.addEventListener('touchleave', end, false);
			element.addEventListener('mouseleave', end, false);
			document.body.addEventListener('touchcancel', end, false);
			document.body.addEventListener('mouseup', end, false);
			document.body.addEventListener('touchend', end, false);
		}
		
		style.webkitUserSelect = 'none';
		style.mozUserSelect = 'none';
		style.msUserSelect = 'none';
		style.webkitUserDrag = 'none';
		//style.touchAction = 'none';
		style.msTouchAction = 'none';
		style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
	
		clear();
		attach();
		
		this.__eventlist__ = {};
		this.detach = detach;
		this.attach = attach;
		this.element = element;
		this.CONFIG = config;
		
		element.touches = this;
	}

	TouchListener.prototype = {
		on: function (event, func) {
			this.__eventlist__[event.toLowerCase()] = func;
		},
		event: function (event, arg) {
			if (typeof (this.__eventlist__[event]) === 'function') {
				try {
					this.__eventlist__[event].call(this, arg);
				}
				catch (error) {
					console.warn(error);
				}
			}
		}
	};
	
	//====/====/====/====/====/====/====/====/====/====/====/====/====/====/
	
    return {
        create: createElement,
        modify: modifyElement,
        search: searchElement,
        remove: removeElement,
        script: getScript,
        define: defineAlloy,
        touch: addTouch
    };
}());