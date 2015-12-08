/** @dict */
var alloys = {};
function createAlloy( key, properties ){
	if (alloys[key]) {
		var alloy = new alloys[key](properties);
		alloy.alloyName = key;
		alloy.element.alloy = alloy;
		return alloy.element;
	} else {
		throw new Error("Construction Error, alloy does not exist");
	}
}
Doom.define = function(key, constructor) {
	key = key.toLowerCase();
	if (alloys[key]) {
		throw new Error("Definition Error, alloy already exists!");
	} else {
		alloys[key] = constructor;
	}
};
