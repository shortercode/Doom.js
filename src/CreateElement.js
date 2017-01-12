(function () {
  var attributes = {};
  var referenceStack = [];
  // ignored property names
  attributes.tag = attributes.tagName = attributes.alloy = attributes.alloyName = attributes.alloyProperties = attributes.copies = function () {
    return;
  };
  // reference mapping
  attributes.ref = attributes.reference = function (label) {
    if (!referenceStack[0]) throw new Error("No reference map defined for \"" + label + "\"");
    if (referenceStack[0][label]) throw new Error("Label \"" + label + "\" already defined for reference map");
    referenceStack[0][label] = this;
  };
  // touch events
  attributes.onTap = attributes.ontap = function (fn) {
    return Doom.touch(this, 'tap', fn);
  };
  attributes.onSwipe = attributes.onswipe = function (fn) {
    return Doom.touch(this, 'swipe', fn);
  };
  attributes.onhold = attributes.onHold = function (fn) {
    return Doom.touch(this, 'hold', fn);
  };
  attributes.onpan = attributes.onPan = function (fn) {
    return Doom.touch(this, 'pan', fn);
  };
  attributes.ontouchstart = attributes.onTouchStart = function (fn) {
    return Doom.touch(this, 'touchstart', fn);
  };
  attributes.ontouchend = attributes.onTouchEnd = function (fn) {
    return Doom.touch(this, 'touchend', fn);
  };
  // element append
  attributes.parentNode = attributes.parent = function (node) {
    return node.appendChild(this);
  };
  attributes.insertBefore = function (node) {
    node.parentNode.insertBefore(this, node);
  };
  attributes.insertAfter = function (node) {
    if (node.nextSibling) {
      node.parentNode.insertBefore(this, node.nextSibling);
    } else {
      node.parentNode.appendChild(this);
    }
  };
  attributes.insertFirst = function (node) {
    node.insertBefore(this, node.firstChild);
  };
  // style
  attributes.style = function (css) {
    if (typeof css === 'object') {
      for (var i in css) {
        this.style[i] = css[i];
      }
    } else if (typeof css === 'string') {
      this.style.cssText += css;
    } else {
      throw new Error('Style TypeError - ' + typeof css);
    }
  };
  // recursion
  attributes.childNodes = attributes.children = function (node) {
    for (var i = 0; i < node.length; i++) {
      node[i] = attributes.child.apply(this, [node[i]]);
    }
    return node;
  };
  attributes.child = function (node) {
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
      node = createElement(node);
    } else {
      throw new Error('Child TypeError - ' + typeof node);
    }
    return node;
  };
  attributes.partialNoCache = function (bool) {
    if (!this.partial) this.partial = {
      map: {},
      href: null
    };
    this.partial.noCache = !!bool;
  }
  attributes.partial = function (url) {
    var element = this;
    if (!this.partial) this.partial = {
      noCache: false
    };
    this.partial.href = url;
    this.partial.map = {};
    Doom.fetch(url).then(function (res) {
      element.innerHTML = res;
    });
  };
  // data attributes
  attributes.dataset = function dataset(data) {
    for (var i in data) {
      this.dataset[i] = data[i];
    }
  };
  /**
   *  Creates a HTML element from a stub
   *  @param {Object<string, *>} obj
   */
  function createElement(obj) {
    var i, element, ref;
    if (typeof obj !== 'object') {
      throw new Error('Element object structure is not defined');
    }
    // NOTE to control the referece stack properly during recursion we need
    // to know if a referenceMap was defined in this call to createElement,
    // so that we can remove it at the correct time
    ref = obj["refMap"] || obj["referenceMap"];
    if (ref) {
      if (typeof ref !== 'object') {
        throw new Error('Reference object is not an object');
      }
      referenceStack.unshift(ref);
    }
    if (typeof obj.alloyName === 'string' || typeof obj.alloy === 'string') { //hybrid html element, constructed using JS class
      element = createAlloy(obj.alloyName || obj.alloy, obj.alloyProperties || {});
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
    // only remove from the stack if we added during this call
    if (ref) referenceStack.shift();
    return element;
  };
  Doom.create = createElement;
}());