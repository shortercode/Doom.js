# Doom.create( _parameters_ )

_Creates a HTMLelement with a given set of properties._

## Parameters

### `tagName`
_String_

specifies the type of HTMLElement to create. The default value is 'div'. This value is ignored if 'alloyName'

```javascript
Doom.create({
  tagName: "div"
});
```

### `parentNode / parent`
_HMTLElement_

appends the created element to the parentNode

```javascript
  Doom.create({
    textContent: "Hello World",
    parent: document.body
  });
```

### `children / childNodes`
_Array_

creates multiple child elements with the same behaviour as 'child'.

### `child`
_Object / HTMLElement / String_

creates a child element with the current element as a parent. Multiple types can be passed with different effect. An instance of a HTMLElement will be appended. A parameter object will call Doom.create recursively. A string will be interpreted as HTML and appended inline. Order is respected.

```javascript
// with an object
Doom.create({
  tagName: "ul",
  child: {
    tagName: "li",
    textContent: "Home"
  }
});
// with a string
Doom.create({
  tagName: "ul",
  child: "<li>Home</li>"
});
// with an element
var childElement = Doom.create({
  tagName: "li",
  textContent: "Home"
});
Doom.create({
  tagName: "ui",
  child: childElement
});

```

`style`
_String / Object_

sets the css style for the created element. When a string is passed the same format can be used as in a stylesheet. Alternatively an object can be used to specify the style, but the Javascript naming conventions must be used instead.

```javascript
Doom.create({
  style: 'color: red; font-size: 12px;'
});
// alternatively
Doom.create({
  style: {
    color: "red",
    fontSize: "12px"
  }
});
```
- property names are based on the javascript HTMLelement/Element attribute names ( see https://developer.mozilla.org/en/docs/Web/API/HTMLElement & https://developer.mozilla.org/en-US/docs/Web/API/Element )
- all non-vanilla and some vanilla property names have special behaviours associated to them ( listed below )
- properties with no special behaviours are set with the dot syntax ( Element.property = value )

- style (String cssText / Object styleMap)
sets the css style the created element
can be passed a string of the same syntax as an element's style property e.g. "color: rgb(255,0,0); font-size: 30px;"
alternatively a map of properties keyed with css rules can be used e.g. {color: "rgb(255,0,0)", fontSize: "30px"}

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