// @define sliderversion "0.1.0"
/*//====//====//====//====//====//====//====//====//====//====//====//====//====//====//

Slider Alloy for Doom.js
Version: 
// @comment sliderversion
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