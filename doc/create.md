# WARNING - THIS PAGE IS OUT OF DATE

### We are planning to revamp our documentation soon, in the mean time please refer to the code...

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