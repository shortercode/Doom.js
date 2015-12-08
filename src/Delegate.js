/**
 * Delegate Service Class
 * Creates a pub sub model
 * @constructor
 */
function Service() {
	this.delegates = [];
	this.eventlist = {};
}
Service.prototype = {
	on: function (event, func) {
		this.eventlist[event] = func;
	},
	fire: function (event, arg) {
		if (typeof (this.eventlist[event]) === 'function') {
			this.eventlist[event].call(this, arg);
		}
	},
	register: function(context) {
		var delegate = new Delegate(this, context);
		this.delegates.push(delegate);
		if (this.delegates.length === 1) {
			this.fire("start");
		}
		this.fire("register", delegate);
		return delegate;
	},
	deregister: function(delegate) {
		var index = this.delegates.indexOf(delegate);
		this.delegates.splice(index, 1);
		this.fire("deregister", delegate);
		if (this.delegates.length === 0) {
			this.fire("stop");
		}
	},
	callDelegates: function (event, arg) {
		var i = this.delegates.length;
		while (i--) {
			this.delegates[i].fire(event, arg);
		}
	}
};
/**
 * Delegate Class
 * Creates a delegate of a pub sub model
 * @constructor
 */
function Delegate(service, context) {
	this.eventlist = {};
	this.service = service;
	this.context = context;
}
Delegate.prototype = {
	on: function (event, func) {
		this.eventlist[event] = func;
		this.service.fire("listen", [event, this]);
	},
	fire: function (event, arg) {
		if (typeof (this.eventlist[event]) === 'function') {
			this.eventlist[event].call(this.context, arg);
		}
	}
};
Doom.service = function (){
	return new Service();
};
