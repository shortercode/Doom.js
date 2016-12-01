# WARNING - THIS PAGE IS OUT OF DATE

We are planning to revamp our documentation soon, in the mean time please refer to the code *wince*

HTMLelement create(Object propertyMap)

- creates a HTMLelement with a given set of properties.
- property names are based on the javascript HTMLelement/Element attribute names ( see https://developer.mozilla.org/en/docs/Web/API/HTMLElement & https://developer.mozilla.org/en-US/docs/Web/API/Element )
- all non-vanilla and some vanilla property names have special behaviours associated to them ( listed below )
- properties with no special behaviours are set with the dot syntax ( Element.property = value )

Properties with custom behaviour:

- tagName (String tagName)
specifies the type of HTMLelement to create. 
defaults to 'div'
overridden by the alloyName property

- parentNode (HTMLelement parentNode)
appends the created element to the parentNode

- style (String cssText / Object styleMap)
sets the css style the created element
can be passed a string of the same syntax as an element's style property e.g. "color: rgb(255,0,0); font-size: 30px;"
alternatively a map of properties keyed with css rules can be used e.g. {color: "rgb(255,0,0)", fontSize: "30px"}

- childNodes (Array[HTMLelement / Object] children )
sets the child nodes of the element, with the order given in the array 
passing a HTMLelement will cause it to be moved to the new element
passing a propertyMap will recursively call Doom.create and append it to the new element

- dataset (Object values)
set any given number of html data-* properties e.g. {foo: "1", bar: "2"} => '<div data-foo="1" data-bar="2"></div>'

New properties:

- ontap

- onswipe

- onpan

- onhold

- child

Known issues:

- setting more than one of the following: [child/childNodes/innerHTML] will cause irregular behaviour, as these arguments all overwrite the elements children

Source: 

```javascript
function createElement(obj){
    var i,
        prop,
        element;
    if (typeof obj !== 'object') {
        throw new Error('Element object structure is not defined');
    }
    if (typeof obj.alloyName === 'string') { 
        //hybrid html element, constructed using JS class
        element = createAlloy( obj["alloyName"], obj["alloyProperties"] || {} );
    } else { 
        if (typeof obj.tagName === 'string') { 
            //normal html element, constructed using native method
            element = document.createElement(obj.tagName);
        } else { // no construction method 
            element = document.createElement('div'); //default to div
        }
    }
    for (i in obj) {
        prop = obj[i];
        switch (i) {
        case 'tagName': 
        case 'alloyName':
        case 'alloyProperties':
        case 'copies':
            break; //ignore 
            case 'ontap':
                addTouch(element, 'tap', prop);
                break;	
            case 'onswipe':
                addTouch(element, 'swipe', prop);
                break; 	
            case 'onpan':
                addTouch(element, 'pan', prop);
                break;
            case 'onhold':
                addTouch(element, 'hold', prop);
                break;
            case 'parentNode':
                prop.appendChild(element);
                break;
            case 'style':
                if (typeof prop === 'object') {
                    for( i in prop ){
                        element.style[i] = prop[i];
                    }
                } else if ( typeof prop === 'string' ) {
                    element.style.cssText = prop;
                } else {
                    throw new Error('Style TypeError - ' + typeof prop);
                }
                break;
            case 'dataset':
                for (i in prop) {
                    element.dataset[i] = prop[i];
                }
                break;
            case 'childNodes':
                for (i = 0; i < prop.length; i++) {
                    if (prop[i] instanceof HTMLElement) { 
                        //child is already element
                        element.appendChild(prop[i]);
                    } else if (typeof prop[i] === 'object') { 
                        //child is an element stub
                        prop[i].parentNode = element;
                        prop[i] = createElement(prop[i]);
                    } else {
                        throw new Error('Child ' + i + ' TypeError - ' + typeof prop[i]);
                    }
                }
                break;
            case 'child':
                if (prop instanceof HTMLElement) { 
                    //child is already element
                    element.appendChild(prop);
                } else if (typeof prop === 'object') { 
                    //child is an element stub
                    prop.parentNode = element;
                    prop = createElement(prop);
                } else {
                    throw new Error('Child TypeError - ' + typeof prop);
                }
                break;
            default:
                element[i] = prop;
                break;
            }
        }
        return element;
    }
```
