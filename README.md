#Doom.js

> Think DOM but with an extra 'o'

A simple library for manipulating HTML elements with an awesomely simple syntax and no dependancies.

* create an element? *
```
Doom.create({
    tagName:'div',
});
```

Passing any vanilla property as an option will add it to your element, including event listeners.

```
Doom.create({
    tagName:'div',
    innerHTML:'Click me',
    onclick: function(){
        this.innerHTML = 'Ouch! Why did you click me? ;(';
    }
});
```  
Setting the parent node property will append your new element to the document.

``
Doom.create({
    tagName:'div',
    innerHTML:'Hello World',
    parentNode:document.body
});
``` 

Child nodes can be recursivly created as well!

``
Doom.create({
    tagName:'div',
    parentNode:document.body,
    childNodes:[
        {
            tagName:'canvas',
            innerHTML: 'Your browser does not support HTML 5 canvas '
        },
        {
            tagName:'div',
            childNodes:[
                {
                    tagName:'span',
                    innerHTML:'Check out my awesome new game!'
                },
                {
                    tagName:'span',
                    innerHTML:'LEMON WARS!',
                    style:'color:yellow;'
                }
            ]
        }
    ]
});
``` 