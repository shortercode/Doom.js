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
if (!("classList" in document.createElement("_")) && ('Element' in window)) {
    var classListProp = "classList",
        protoProp = "prototype",
        elemCtrProto = window.Element[protoProp],
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