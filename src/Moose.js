function Moose(element){
    var that = this;
    
    var getpos = function(){
          
    };
    
    var start = function(){
        
    };
    
    var move = function(){
        
    };
    
    var end = function(){
        
    };
    
    var destroy = function(){
        
    };
    
    element.addEventListener('touchstart',start,false);
    element.addEventListener('mousedown',start,false);
    element.addEventListener('touchmove',move,false);
    element.addEventListener('mousemove',move,false);
    document.body.addEventListener('mouseup',end,false);
    document.body.addEventListener('touchend',end,false);
    
    that.destroy = destroy;
    that.element = element;
}
Moose.prototype = {
	constructor: Moose,
	__init__: Moose,
	on: function( event, func ){
        if(!this.__eventlist__)
            this.__eventlist__ = {};
        this.__eventlist__[event] = func;
    },
    event: function( event, arg ){
        if(this.__eventlist__ && typeof ( this.__eventlist__[event] ) === 'function' ){
            this.__eventlist__[event].call(this,arg);   
        }
    },
	super: function(k){
		this.__superclass__.prototype.constructor();
	}
}
Moose.extend = function(prototype){

    var fn;
    var k;

    prototype = prototype || {};
    fn = prototype.__init__ = prototype.__init__ || function(){this.super();}; //if no initialiser use create a constructor that just wraps the super constructor

    fn.__superclass__ = this; //pass reference to the super class to the new class

    fn.prototype = Object.create(this.prototype); //copy the proto of the super class

    fn.prototype.constructor = fn; //enforce the constructor property
    fn.prototype.__superclass__ = this; //add the super class to the prototype as well

    for(k in prototype){ 
        fn.prototype[k] = prototype[k]; //append new attributes to class
    }

    fn.extend = this.extend; //add create subclass method to new class

    return fn; // return constructor
}
