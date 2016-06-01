/*
 * @preserve
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 *
 * By Eli Grey, http://eligrey.com
 * Modified by Iain Shorter
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */
if (!"indexOf" in Array.prototype) {
	// This polyfill isn't 100% to spec, but will behave correctly in resonable use cases
	// (ie not attempting to use it with something other than an array)
	Object.defineProperty(Array.prototype, "indexOf", {
		value: function indexOf (item, start) {
			for (var i = +start || 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) {
                    return i;
                }
            }
            return -1;
		}
	});
}
if (!"trim" in String.prototype) {
	Object.defineProperty(String.prototype, "trim", {
		value: function trim () {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		}
	});
}
if (!("classList" in document.createElement("_")) && ('Element' in window)) {
	function DOMEx(type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
    }

	DOMEx.prototype = Error.prototype;
	
	function checkTokenAndGetIndex(classList, token) {
        if (token === "") {
            throw new DOMEx(
                "SYNTAX_ERR", "The token provided must not be empty"
            );
        }
        if (/\s/.test(token)) {
            throw new DOMEx(
                "INVALID_CHARACTER_ERR", "The token provided ('" + token + "') contains HTML space characters, which are not valid in tokens"
            );
        }
        return classList.indexOf(token);
    }
	
	function updateFromClassName(classList, className) {
		var trimmedClasses = className.trim(),
            classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [];
		classList.length = 0;
        for (var i = 0, l = classes.length; i < l; i++) {
            classList.push(classes[i]);
        }
	}

    function ClassList(element) {
        updateFromClassName(this, element.className);
		this._updateClassName = function () {
			element.className = this + "";
		};
    }
	
    ClassList.prototype = [];
	
	ClassList.prototype.item = function(i) {
        return this[i] || null;
    };
	
    ClassList.prototype.contains = function(token) {
        return checkTokenAndGetIndex(this, token + "") !== -1;
    };
	
    ClassList.prototype.add = function() {
		var update = false;
		for (var i = 0, l = arguments.length, token; i < l; i++) {
			token = arguments[i] + "";
			if (checkTokenAndGetIndex(this, token) === -1) {
	            this.push(token);
				update = true;
	        }
		}
        update && this._updateClassName(this);
    };
	
    ClassList.prototype.remove = function() {
		for (var i = 0, l = arguments.length, token, index; i < l; i++) {
			token = arguments[i] + "";
			index = checkTokenAndGetIndex(this, token);
			while (index !== -1) {
	            this.splice(index, 1);
	            index = checkTokenAndGetIndex(this, token);
	        }
		}
		this._updateClassName();
    };
	
    ClassList.prototype.toggle = function(token) {
        token += "";
        var result = this.contains(token);
        this[(result ? "remove" : "add")](token);
        return !result;
    };
	
    ClassList.prototype.toString = function() {
        return this.join(" ");
    };
	
    function classListGetter() {
		var classList = new ClassList(this);
		Object.defineProperty(this, "classList", {
			get: function () {
				updateFromClassName(classList, this.className);
				return classList;
			}
		});
		return classList;
    }
    
    if (Object.defineProperty) {
        var classListPropDesc = {
            get: classListGetter,
            enumerable: true,
            configurable: true
        };
        try {
            Object.defineProperty(Element.prototype, 'classList', classListPropDesc);
        } catch (ex) { // IE 8 doesn't support enumerable:true
            if (ex.number === -0x7FF5EC54) {
                classListPropDesc.enumerable = false;
                Object.defineProperty(Element.prototype, 'classList', classListPropDesc);
            }
        }
    } else if (Object.prototype.__defineGetter__) {
        elemCtrProto.__defineGetter__('classList', classListGetter);
    } else {
		console.warn("Failed to add classlist polyfill");
	}
}