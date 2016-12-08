(function(){
	var EVENT_NAMES = ["adopt", "connect", "disconnect"];
	var MAX_REPEAT = 10; // iterations
	var MIN_UPDATE_INT = 16; // ms
	var MAX_UPDATE_INT = 100; // ms
	
	var observedElements = [];
	var timerRef = null;

	var requestCallback = function  () {
		var executionTime = MIN_UPDATE_INT;
		var time = Date.now || function () {
			return +new Date;
		};
		function clamp (val, min, max) {
			return Math.round(Math.min(Math.max(val, min), max));
		}
		return requestAnimationFrame || function (callback) {
			setTimeout(function () {
				var start = time();
				callback();
				executionTime += (time() - start - executionTime) * 0.1;
				executionTime = clamp(executionTime, MIN_UPDATE_INT, MAX_UPDATE_INT);
			}, executionTime);
		}
	}();
	
	/*
		To prevent the mutation events using too much of the processing time
		the poll uses a variable interval based on the average execution time.
		This means that it should only be able to use half the processing time
		maximum. MIN_UPDATE_INT and MAX_UPDATE_INT are cap values for the interval.
	*/
	function setFrameInterval (callback) {
		var handler = function () {
			if (!ref)
				return;
			callback();
			ref = requestCallback(handler);
		};
		var ref = requestCallback(handler);
		return function cancel () {
			ref = null;
		}
	}

	/*
		Returns our status obect, which is a snapshot of the element at the
		last update. If it does not exist yet, and shouldCreate is set then it
		will be created. Will start the timer if it isn't running yet.
	*/
	function getStatus (element, shouldCreate) {
		var i = 0;
		var l = observedElements.length;
		var status = null;
		
		for (; i < l; i++)
		{
			if (observedElements[i].element === element) {
				status = observedElements[i];
				break;
			}
		}
		
		if (!status && shouldCreate) {
			status = {
				element: element,
				root: getRoot(element),
				parent: element.parentNode,
				handlers: {
					"connect": [],
					"disconnect": [],
					"adopt": [],
					length: 0
				}
			};
			observedElements.push(status);
			start();
		}
		
		return status;
	}

	function addHandler(element, eventName, callback) {
		
		if (!(element instanceof HTMLElement))
			throw new TypeError("Cannot observer non-HTMLElement based objects");
		if (!(callback instanceof Function))
			throw new TypeError("Callback handler is not a Function");
		if (EVENT_NAMES.indexOf(eventName) === -1)
			throw new Error("Unknown mutation event \"" + eventName + "\"");
			
		var status = getStatus(element, true);
		
		if (status.handlers[eventName].indexOf(callback) === -1) {
			status.handlers[eventName].push(callback);
			status.handlers.length++;
		}
	}

	function removeHandler (element, eventName, callback) {
		
		if (!(element instanceof HTMLElement))
			throw new TypeError("Cannot observer non-HTMLElement based objects");
		if (!(callback instanceof Function))
			throw new TypeError("Callback handler is not a Function");
		if (EVENT_NAMES.indexOf(eventName) === -1)
			throw new Error("Unknown mutation event \"" + eventName + "\"");
			
		var status = getStatus(element, false);
		
		if (status) {
			var index = status.handlers[eventName].indexOf(callback);
			if (index !== -1) {
				if (status.handlers.length === 1) {
					ignoreElement(element);
				} else {
					status.handlers[eventName].splice(index, 1);
					status.handlers.length--;
				}
			}
		}
	}

	/*
		Get the root element for an element
	*/
	function getRoot(element) {
		var root = null;
		while (element.parentNode)
			root = element = element.parentNode;
		
		return root;
	}

	/*
		Executes a collection of handlers, with the element as the context. Can pass
		an eventObject for extra information.
	*/
	function fireEvent (status, eventName, eventObject) {
		var handlers = status.handlers[eventName];
		var element = status.element;
		
		for (var i = 0, l = handlers.length; i < l; i++) {
			handlers[i].call(element, eventObject);
		}
	}

	/*
		Removes an element from the observation list, will stop the timer if its the
		last element on the list.
	*/
	function ignoreElement (element) {
		var i = 0;
		var l = observedElements.length;
		
		for (; i < l; i++)
		{
			if (observedElements[i].element === element) {
				observedElements.splice(i, 1);
				break;
			}
		}
		
		if (observedElements.length === 0)
			stop();
	}

	/*
		Checks for modifications to elements on the observation list and calls the
		relevent handlers.
	*/
	function poll (repeat) {
		
		repeat = ~~repeat; // should start with 0
			
		var i = 0;
		var l = observedElements.length;
		var status = null;
		var element = null;
		var didChange = false;
		
		for (; i < l; i++) {
			status = observedElements[i];
			element = status.element;
			
			// would prefer to use contains here, then only calculate the new root if required
			// but when status.root = null we would have to pregenerate the new root for 
			// comparison here anyway
			
			var newRoot = getRoot(element);
			
			if (status.root !== newRoot) {
				
		    	fireEvent(status, "adopt", {
					type: "adopt",
					element: element,
					oldRoot: status.root,
					newRoot: newRoot
				});
		    	status.root = newRoot;
				didChange = true;
			}
			
			if (status.parent !== element.parentNode) {
				fireEvent(status, "disconnect", {
					type: "disconnect",
					element: element,
					from: status.parent
				});
				if (element.parentNode) {
					fireEvent(status, "connect", {
						type: "connect",
						element: element,
						to: element.parentNode
					});
				}
				status.parent = element.parentNode;
				didChange = true;
			}
		}
		
		// if we triggered an event, we should repeat to see if it changed anything
		// itself. Should also throw if we exceed our maximum level of recursion
		if (didChange) {
			if (repeat >= MAX_REPEAT)
				throw new Error("Observed element mutation exceeded maximum cyclic changes");
				
			poll(repeat + 1);
		}
	}

	/*
		Starts the timer if it isn't running.
	*/
	function start () {
		if (timerRef)
			return;
			
		timerRef = setFrameInterval(poll);
	}

	/*
		Stops the timer if it is running.
	*/
	function stop () {
		if (!timerRef)
			return;
			
		timerRef();
		timerRef = null;
	}
	Doom.addMutationEvent = addHandler;
	Doom.removeMutationEvent = removeHandler;
	// Doom.expressMutation = function () {
	// 	poll(0);
	// };
}());