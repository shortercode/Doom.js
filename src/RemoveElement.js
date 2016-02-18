Doom.remove = function (element, delay){
    if (delay) {
        setTimeout(Doom.remove, delay, element);
    } else {
        if (typeof element === 'string') {
            element = Doom.search(element);
        }
        if (element[0]) {
            var i = element.length;
            while (i--) {
                Doom.remove(element[i]);
            }
            return element;
        }
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
	}
    return element;
};
