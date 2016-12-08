(function(){
    var attributes = {};

    // ignored property names
    attributes.tagName =
    attributes.alloyName =
    attributes.alloyProperties =
    attributes.copies =
    function () {
        return;
    };

    // touch events
    attributes.onTap =
    attributes.ontap =
    function (fn) {
        return Doom.touch(this, 'tap', fn);
    };
    attributes.onSwipe =
    attributes.onswipe =
    function (fn) {
        return Doom.touch(this, 'swipe', fn);
    };
    attributes.onhold =
    attributes.onHold =
    function (fn) {
        return Doom.touch(this, 'hold', fn);
    };
    attributes.onpan =
    attributes.onPan =
    function (fn) {
        return Doom.touch(this, 'pan', fn);
    };
    attributes.ontouchstart =
    attributes.onTouchStart =
    function (fn) {
        return Doom.touch(this, 'touchstart', fn);
    };
    attributes.ontouchend =
    attributes.onTouchEnd =
    function (fn) {
        return Doom.touch(this, 'touchend', fn);
    };

    // element append
    attributes.parentNode =
    attributes.parent =
    function (node) {
        return node.appendChild(this);
    };
    attributes.insertBefore =
    function (node) {
        node.parentNode.insertBefore(this, node);
    };
    attributes.insertAfter =
    function (node) {
        if (node.nextSibling) {
            node.parentNode.insertBefore(this, node.nextSibling);
        } else {
            node.parentNode.appendChild(this);
        }
    };
    attributes.insertFirst =
    function (node) {
        node.insertBefore(this, node.firstChild);
    };

    // style
    attributes.style =
    function (css) {
        if (typeof css === 'object') {
            for (var i in css ) {
                this.style[i] = css[i];
            }
        } else if ( typeof css === 'string' ) {
            this.style.cssText += css;
        } else {
            throw new Error('Style TypeError - ' + typeof css);
        }
    };
    // Accepts a single class or a space delimited list of classes
    attributes.addClass =
    function (cls) {
		this.classList.add.apply(this.classList, cls.split(' ')); // Oh magical spread operator, I wish you were part of ES5
    }
    attributes.toggleClass =
    function (cls) {
        var clsArr = cls.split(' ');
        for (var i = 0, l = clsArr.length; i < l; i++)
            this.classList.toggle( clsArr[i] );
    }
    attributes.removeClass =
    function (cls) {
        this.classList.remove.apply(this.classList, cls.split(' '));
    }
    // Accepts only arrays of classes
    attributes.addClasses =
    function (clsArr) {
        this.classList.add.apply(this.classList, clsArr);
    }
    attributes.toggleClasses =
    function (clsArr) {
        for (var i = 0, l = clsArr.length; i < l; i++)
            this.classList.toggle( clsArr[i] );
    }
    attributes.removeClasses =
    function (clsArr) {
        this.classList.remove.apply(this.classList, clsArr);
    }

    // recursion
    attributes.childNodes =
    attributes.children =
    function (node) {
        while (this.firstChild) {
           this.removeChild(this.firstChild);
        }
        for (var i = 0; i < node.length; i++) {
            if (node[i] instanceof HTMLElement) { //child is already element
                this.appendChild(node[i]);
            }  else if (typeof node[i] === 'string') {
                var temp = Doom.create({
                    innerHTML: node[i]
                });
                while (temp.firstChild) {
                    this.appendChild(temp.firstChild);
                }
            } else if (typeof node[i] === 'object') { //child is an element stub
                node[i].parentNode = this;
                node[i] = Doom.create(node[i]);
            } else {
                throw new Error('Child TypeError - ' + typeof node[i]);
            }
        }
        return node;
    };
    attributes.child =
    function (node) {
        if (this.children.length === 1 && node === this.firstChild) {
            return;
        }
        while (this.firstChild) {
           this.removeChild(this.firstChild);
        }

        if (node instanceof HTMLElement) { //child is already element
            this.appendChild(node);
        } else if (typeof node === 'string') {
            var temp = Doom.create({
                innerHTML: node
            });
            while (temp.firstChild) {
                this.appendChild(temp.firstChild);
            }
        } else if (typeof node === 'object') { //child is an element stub
            node.parentNode = this;
            node = Doom.create(node);
        } else {
            throw new Error('Child TypeError - ' + typeof node[i]);
        }
        return node;
    };
    attributes.removeChild =
    function (node) {
        if (typeof node === 'number') {
            this.removeChild(this.childNodes[node]);
        } else {
            this.removeChild(node);
        }
    }
    attributes.removeChildren =
    attributes.removeChildNodes =
    function (nodes) {
        var i = nodes.length;
        while (i--) {
            if (typeof nodes[i] === 'number') {
                nodes[i] = this.childNodes[nodes[i]];
            }
        }
        n = nodes.length;
        while (i--) {
            this.removeChild(nodes[i]);
        }
    }
    attributes.innerHTML =
    function (str) {
        if (this.innerHTML !== str) {
            this.innerHTML = str
        }
    }
	attributes.partialNoCache =
	function (bool) {
		if (!this.partial) {
			this.partial = {
				href: null
			};
        }
		// if enabling nocache then clear the existing cache
		this.partial.map = bool ? {} : this.partial.map;
		this.partial.noCache = !!bool;
	};
	attributes.partial =
	function (url) {
		// quick reference for current elements partial object
		var part = this.partial;
		// if no partial object create one
		if (!part) {
			part = this.partial = {
				href: url,
				map: {},
				noCache: false
			};
		// else check if the partial url has actually changed
		} else if (part.href !== url) {
			// if nocache is enabled then don't store the old template
			if (part.noCache === false)
			{
				// try and reuse the previous fragment if possible, else create a new one
				var fragment = part.map[part.href] || document.createDocumentFragment();
				// move all child elements into the fragment
				while (this.firstChild)
					fragment.appendChild(this.firstChild);
				// store the fragment in the partial map
				part.map[part.href] = fragment;
			}
		// if no change, bail
		} else {
			return;
		}
		
		// update the partial url with the new one
		part.href = url;
		
		// if theres a cached fragment then append it
		if (part.map[url]) {
			this.appendChild(part.map[url]);
		// else request the partial content and append it
		} else {
			var element = this;
			Doom.fetch(url)
			.then(function (res) {
				element.innerHTML = res;
			});
		}
	};

    // data attributes
    attributes.dataset =
    function dataset(data) {
        for (var i in prop) {
            element.dataset[i] = prop[i];
        }
    };
    /**
     *  Creates a HTML element from a stub
     *  @param {Object<string, *>} obj
     */
    function modifyElement(obj) {
        var element = obj["element"], i, l;
        if (!element) { // no element
            throw new Error("Element not defined");
        } else if (typeof element === "string") {
            element = Doom.search(element);
            obj.element = element;
            modifyElement(obj);
        } else if (element instanceof HTMLElement === false && element[0]) { // presume array of elements or similar
            for (i = 0, l = ~~element.length; i < l; i++) {
                obj.element = element[i];
                modifyElement(obj);
            }
            return element;
        } else if (element instanceof HTMLElement) {
            if (obj["delay"]) {
                i = obj["delay"];
                obj["delay"] = null;
                setTimeout(modifyElement, i, obj);
                return;
            }
            for (i in obj) {
                if (i in attributes) {
                    attributes[i].apply(element, [obj[i]]);
                } else {
                    element[i] = obj[i];
                }
            }
            return element;
        } else {
            throw new Error("Element TypeError - " + typeof element);
        }
    };
    Doom.modify = modifyElement;
}())