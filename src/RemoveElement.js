Doom.remove = function (element, delay){
    if (delay) {
        setTimeout(Doom.remove, delay, element);
    } else if (element.parentNode) {
		element.parentNode.removeChild(element);
	}
    return element;
};
