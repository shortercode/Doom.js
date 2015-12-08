/**
 * Searches for an element using a given selector
 * @param {string} selector
 * @param {Object|undefined} parent
 */
Doom.search = function (selector, parent){
	parent = parent || document; //if no element selected then use document
	switch(selector.charAt(0)){
        case '.':
            return parent.getElementsByClassName(selector.substr(1));
        case '#':
            return parent.getElementById(selector.substr(1));
        case '?':
            return parent.querySelectorAll(selector.substr(1));
        default:
            return parent.getElementsByTagName(selector);
	}
};
