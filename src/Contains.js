if (!Element.prototype.contains) {
    Element.prototype.contains = function(node) {
        return !!(this.compareDocumentPosition(node) & 16);
    };
}