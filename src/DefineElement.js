{
	function define(name, props, inherits)
	{
		const prototype = Object.create((inherits || define.DIV).prototype);

		for (let propertyName in props)
		{
			switch(propertyName) {
				case 'createdCallback':
				case 'attachedCallback':
				case 'detachedCallback':
				case 'attributeChangedCallback':
					throw new Error(`Unable to create custom element, property ${propertyName} is reserved`);
					break;
				case 'constructor':
					break;
				default:
					prototype[propertyName] = props[propertyName];
					break;
			}
		}

		prototype.createdCallback = props.constructor;
		prototype.attachedCallback = function()
		{
			const event = new Event('attached');
			this.dispatchEvent(event);
		}
		prototype.detachedCallback = function()
		{
			const event = new Event('dettached');
			this.dispatchEvent(event);
		}

		return document.registerElement(name, {prototype});
	}

	define.DIV = HTMLDivElement;
	define.CANVAS = HTMLCanvasElement;
}