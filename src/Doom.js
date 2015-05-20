// @define version "0.1.0"
// @define commentstart "/*//====//====//====//====//====//====//====//====//====//====//====//====//====//====//"
// @define commentend "//====//====//====//====//====//====//====//====//====//====//====//====//====//====//*/"
// @comment commentstart
Doom.js
Version: 
// @comment version
Written by: Iain Shorter
MIT License
// @comment commentend

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

    function modifyElement(){

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
        define: defineAlloy
    };
}());

// @import src/alloys/slider.js