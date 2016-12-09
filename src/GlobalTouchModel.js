(function ()
{
	'use strict';

	function bind(fn, ctx)
	{
		return function ()
		{
			return fn.apply(ctx, arguments);
		};
	}

	function tryCall(fn, eventObject)
	{
		try
		{
			fn(eventObject);
		}
		catch (e)
		{
			console.error(e);
		}
	}

	var TouchModel = {
		// Public Methods
		/**
		 * Registers an element for touch events
		 * @param {HMTLElement} element
		 * @returns {TouchDelegate} Returns the TouchDelegate for an element
		 */
		register: function register(element)
		{
			if (!this.active)
				this._attachToDocument();
			if (!element.touchDelegate)
				element.touchDelegate = new touchDelegate();

			return element.touchDelegate;
		},
		/**
		 * Deregisters an element for touch events, releasing the reference to the touchDelegate
		 * @param {HTMLElement} element
		 * @returns undefined
		 */
		deregister: function deregister(element)
		{
			if (element.touchDelegate)
				element.touchDelegate = null;
		},
		// Private Variables
		_active: false,

		_handles:
		{
			touchstart: bind(function start(e)
			{
				var element = e.target,
					event;

				this._attachListener('touchmove');
				this._attachListener('touchend');

				while (element.parentNode)
				{
					if (element.touchDelegate)
					{
						if (!event)
							event = this._createEvent('touchstart', e);
						element.touchDelegate.call('touchstart', event);
					}
					element = element.parentNode;
				}
			}, this),

			touchmove: bind(function move(e)
			{
				var element = e.target,
					event;

				while (element.parentNode)
				{
					if (element.touchDelegate)
					{
						if (!event)
							event = this._createEvent('touchmove', e);
						element.touchDelegate.call('touchmove', event);
					}
					element = element.parentNode;
				}
			}, this),

			touchend: bind(function end(e)
			{
				var element = e.target,
					event;

				this._detachListener('touchmove');
				this._detachListener('touchend');

				while (element.parentNode)
				{
					if (element.touchDelegate)
					{
						if (!event)
							event = this._createEvent('touchend', e);
						element.touchDelegate.call('touchend', event);
					}
					element = element.parentNode;
				}
			}, this)
		},

		// Private Functions

		_attachToDocument: function attachToDocument()
		{
			this._attachListener('touchstart');
			this._active = true;
		},

		_attachListener: function attachListener(name)
		{
			document.body.addEventListener(name, this._handles[name], true);
		},

		_detachListener: function detachListener(name)
		{
			document.body.removeEventListener(name, this._handles[name], true);
		},

		_createEvent: function createEvent(name, e)
		{
			return e; // stubbed atm, should return custom object
		}

	};

	function TouchDelegate()
	{
		this._events = {
			touchstart: [],
			touchmove: [],
			touchend: []
		};
	}

	TouchDelegate.prototype = {
		on: function on(eventName, fn)
		{
			if (this._events[eventName])
				this._events[eventName].push(fn);
		},
		call: function call(eventName, eventObject)
		{
			var i = this._events[eventName].length;
			while (i--)
			{
				tryCall(this._events[eventName][i], eventObject);
			}
		}
	};
}());