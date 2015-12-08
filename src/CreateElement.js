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
            this.style.cssText = css;
        } else {
            throw new Error('Style TypeError - ' + typeof css);
        }
    };

    // recursion
    attributes.childNodes =
    attributes.children =
    function (node) {
        for (var i = 0; i < node.length; i++) {
            node[i] = attributes.child.apply(this, [node[i]]);
        }
        return node;
    };
    attributes.child =
    function (node) {
        if (node instanceof HTMLElement) { //child is already element
            this.appendChild(node);
        } else if (typeof node === 'object') { //child is an element stub
            node.parentNode = this;
            node = createElement(node);
        } else {
            throw new Error('Child TypeError - ' + typeof node);
        }
        return node;
    };

    // data attributes
    attributes.dataset =
    function dataset(data) {
        for (var i in data) {
            this.dataset[i] = data[i];
        }
    };



    /**
     *  Creates a HTML element from a stub
     *  @param {Object<string, *>} obj
     */
    function createElement(obj) {
        var i, element;
        if (typeof obj !== 'object') {
            throw new Error('Element object structure is not defined');
        }
        if (typeof obj.alloyName === 'string') { //hybrid html element, constructed using JS class
            element = createAlloy( obj.alloyName, obj.alloyProperties || {} );
        } else { //normal html element, constructed using native method
            element = document.createElement(obj.tagName || 'div');
        }
        for (i in obj) {
            if (i in attributes) {
                attributes[i].apply(element, [obj[i]]);
            } else {
                element[i] = obj[i];
            }
        }
        return element;
    };
    Doom.create = createElement;
}());