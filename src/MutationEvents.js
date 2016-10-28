var observedElements = [];
var timerRef = null;

// TODO rAF polyfill here

function setFrameInterval (callback) {
	var handler = function () {
		if (!ref)
			return;
		ref = requestAnimationFrame(handler);
		callback();
	};
	var ref = requestAnimationFrame(handler);
	
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
				
			}
		};
		observedElements.push(status);
		start();
	}
	
	return status;
}

function addHandler(element, eventName, callback) {
	var status = getStatus(element, true);
	
	if (status[eventName].indexOf(callback) === -1) {
		status[eventName].push(callback);
		status.handler++;
	}
}

function removeConnectionHandler (element, eventName, callback) {
	var status = getStatus(element, false);
	
	if (status) {
		var index = status[eventName].indexOf(callback);
		if (index !== -1) {
			if (status.handlers.length === 1) {
				ignoreElement(element);
			} else {
				status[eventName].splice(index, 1);
				status.handler--;
			}
		}
	}
}

/*
	Get the root element for an element
*/
function getRoot(element) {
	while (element.parentNode)
		element = element.parentNode;
	
	return element;
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
function poll () {
	var i = 0;
	var l = observedElements.length;
	var status = null;
	var element = null;
	
	for (; i < l; i++) {
		status = observedElements[i];
		element = status.element;
		
		if (status.root.contains(element) === false) {
	    	fireEvent(element, status.adoptedHandler);
	    	status.root = getRoot(element);
		}
		
		if (status.parent !== element.parentNode) {
			fireEvent(element, status.disconnectHandler);
			if (element.parentNode) {
				fireEvent(element, status.connectHandler);
			}
			status.parent = element.parentNode;
		}
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