/*//====//====//====//====//====//====//====//====//====//====//====//====//====//====//
Doom.js
Version: 
0.1.0
Written by: Iain Shorter
MIT License
//====//====//====//====//====//====//====//====//====//====//====//====//====//====//*/

var Doom = (function(){                
    function createElement(obj){
        var i;
        var element;

        if(typeof obj.copies === 'number'){ //multiple copies of the same stub

            i = obj.copies;
            element = Array(i);
            while(i--){
                element[i](createElement(obj));
            }
            return element;
        }

        if(typeof obj !== 'object')
            throw 'Element object structure is not defined';

        if(typeof obj.alloyName === 'string'){ 
            //hybrid html element, constructed using JS class
            element = createAlloy( obj.alloyName, obj.alloyProperties || {} );
        }else{ 
            if(typeof obj.tagName === 'string'){ 
                //normal html element, constructed using native method
                element = document.createElement(obj.tagName);
            }else{ // no construction method 
                throw 'Element type not defined. element.tagName || element.alloyName';
            }
        }

        for(i in obj){
            switch(i){

                case 'tagName': 
                case 'alloyName':
                case 'alloyProperties':
                case 'copies':
                    break; //ignore

                case 'parentNode':
                    obj[i].appendChild(element);
                    break;

                case 'style':
                    if(typeof obj.style === 'object'){
                        for( i in obj.style ){
                            element.style[i] = obj.style[i];
                        }
                    }else if( typeof obj.style === 'string' ){
                        element.style.cssText = obj.style;
                    }else{
                        throw 'Style TypeError - '+ typeof obj.style;
                    }
                    break;

                case 'childNodes':
                    for(i = 0; i < obj.childNodes.length; i++){
                        if(obj.childNodes[i] instanceof HTMLElement){ 
                            //child is already element
                            element.appendChild(obj.childNodes[i]);
                        }else if(typeof obj.childNodes[i] == 'object'){ 
                            //child is an element stub
                            obj.childNodes[i].parentNode = element;
                            obj.childNodes[i] = createElement(obj.childNodes[i]);
                        }else{
                            throw 'Child '+i+' TypeError - '+ typeof obj.childNodes[i];
                        }
                    }
                    break;

                default:
                    element[i] = obj[i];
                    break;

            }
        }

        return element;
    }

    function searchElement(selector, parent){
        parent = parent || document; //if no element selected then use document
        switch(name[0]){
            case '.': // class
                return parent.getElementsByClassName(name.substr(1));
                break;
            case '#':
                return parent.getElementById(name.substr(1));
                break;
            case '?':
                return parent.querySelectorAll(name.substr(1));
            default:
                return parent.getElementsByTagName(name);
                break;
        }
    }

    function modifyElement( obj ){
		
		var element = obj.element;
		
		if(!element)
			throw "Element not defined ";
		
		for(i in obj){
            switch(i){

                case 'tagName': 
                case 'alloyName':
                case 'alloyProperties':
                case 'copies':
                    break; //ignore

                case 'parentNode':
                    obj[i].appendChild(element);
                    break;
					
				case  'addClass':
					element.classList.add(obj[i]);
					break;
					
				case 'toggleClass':
					element.classList.toggle(obj[i]);
					break;

				case 'removeClass':
					element.classList.remove(obj[i]);
					break;

                case 'style':
                    if(typeof obj.style === 'object'){
                        for( i in obj.style ){
                            element.style[i] = obj.style[i];
                        }
                    }else if( typeof obj.style === 'string' ){
                        element.style.cssText += obj.style;
                    }else{
                        throw 'Style TypeError - '+ typeof obj.style;
                    }
                    break;

                case 'childNodes':
                    for(i = 0; i < obj.childNodes.length; i++){
                        if(obj.childNodes[i] instanceof HTMLElement){ 
                            //child is already element
                            element.appendChild(obj.childNodes[i]);
                        }else if(typeof obj.childNodes[i] == 'object'){ 
                            //child is an element stub
                            obj.childNodes[i].parentNode = element;
                            obj.childNodes[i] = createElement(obj.childNodes[i]);
                        }else{
                            throw 'Child '+i+' TypeError - '+ typeof obj.childNodes[i];
                        }
                    }
                    break;

                default:
                    element[i] = obj[i];
                    break;

            }
        }

        return element;
    }
	
	function removeElement( element ){
		if(element.parentNode)
			element.parentNode.removeChild(element);
		return element;
	}

    function createAlloy( key, properties ){
        if(alloys[key]){
            var alloy = new alloys[key](properties);
            alloy.element.alloy = alloy;
            return alloy.element;
        }else{
            throw "Construction Error, alloy element does not exist";   
        }
    }

    function defineAlloy( key, constructor){
        key = key.toLowerCase();
        if(alloys[key])
            throw "Definition Error, alloy already exists!";
        else
            alloys[key] = constructor;
    }

    var alloys = {};

    return {
        create: createElement,
        modify: modifyElement,
        search: searchElement,
		remove: removeElement,
        define: defineAlloy
    };
}());

/*//====//====//====//====//====//====//====//====//====//====//====//====//====//====//
Slider Alloy for Doom.js
Version: 
0.1.0
Written by: Iain Shorter
MIT License
//====//====//====//====//====//====//====//====//====//====//====//====//====//====//*/

(function(){ //slider widget definition
    function Slider(properties){

        var tabs = properties.tabs || 0;
        var color = properties.color || 'black';

        this.element = Doom.create({
            tagName:'div',
            style:{
                position: 'relative',
                padding: '10px 0'
            },
            childNodes:[
                {
                    tagName:'div',
                    style:{
                        position: 'absolute',
                        bottom: 0, 
                        borderBottom: '2px solid '+color,
                        width: '100%', 
                        transition: 'all 0.2s'
                    }
                }
            ]
        });

        this.selectionBar = this.element.firstChild;
        this.selected = 0;
        this.tabs = [];

        while(tabs--){
            this.createTab(false); //defer update
        }

        this.updateTabs();
    }
    Slider.prototype = {
        createTab: function(bUpdate){
            var that = this;
            var tab = Doom.create({
                tagName: 'div',
                parentNode: this.element,
                style: {
                    display: 'inline-block',
                    overflow: 'hidden', 
                    verticalAlign: 'top',
                    height: '100%'
                },
                onclick: function(){
                    that.select(that.tabs.indexOf(this));
                }
            });

            this.tabs.push(tab);

            if(typeof bUpdate !== 'boolean' || bUpdate === true)
                this.updateTabs(); // if update is true or not set then update

            return tab;
        },
        updateTabs: function(){
            var i = this.tabs.length;
            var width = 100 / i;
            while(i--){
                this.tabs[i].style.width = width +'%';   
            }
            this.selectionBar.style.width = width +'%';
        },
        select: function(n){
            this.selected = n;
            this.selectionBar.style.transform = 'translate('+n+'00%,0)';
        }

    }

    Doom.define('slider',Slider);
}());