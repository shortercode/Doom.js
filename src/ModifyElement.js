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
        var clsArr = cls.split(' ');
        for (var i = 0; i < clsArr.length; i++)
            this.classList.add( clsArr[i] );
    }
    attributes.toggleClass = 
    function (cls) {
        var clsArr = cls.split(' ');
        for (var i = 0; i < clsArr.length; i++)
            this.classList.toggle( clsArr[i] );
    }
    attributes.removeClass = 
    function (cls) {
        var clsArr = cls.split(' ');
        for (var i = 0; i < clsArr.length; i++)
            this.classList.remove( clsArr[i] );
    }
    // Accepts only arrays of classes
    attributes.addClasses =
    function (clsArr) {
        for (var i = 0; i < clsArr.length; i++)
            this.classList.add( clsArr[i] );
    }
    attributes.toggleClasses = 
    function (clsArr) {
        for (var i = 0; i < clsArr.length; i++)
            this.classList.toggle( clsArr[i] );
    }
    attributes.removeClasses = 
    function (clsArr) {
        for (var i = 0; i < clsArr.length; i++)
            this.classList.remove( clsArr[i] );
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