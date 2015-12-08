Doom.remove = function (element){
	if (element.parentNode) {
		element.parentNode.removeChild(element);
	}
    return element;
};
