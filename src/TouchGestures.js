(function(){
    var isAndroid = navigator.userAgent.match(/Android/i);
/**
     * Touch Listener Class
     * Wraps recognisor logic for all gesture types
     * @constructor
     */
    function TouchListener(element) {
        var that = this,
            event = null,
            timer = null,
            style = element.style,
            config = {
                TAP_MAXTIME: 500,
                TAP_MAXDELTA: 20,
                PAN_MINDELTA: 20,
                HOLD_MINTIME: 500,
                HOLD_MAXDELTA: 20,
                SWIPE_MAXTIME: 400,
                SWIPE_MINSPEED: 1,
                END_ON_LEAVE: false,
                PREVENT_DBL_CLICK: false,
                ANDRD_FIX_TOUCH_START_PREVENT_DFLT: false, // bug: https://code.google.com/p/android/issues/detail?id=19827
                TOUCH: 'ontouchstart' in window,
                MOUSE: true
            },
            pos = {
                x: null,
                y: null,
                t: null
            },
            motion = {
                pos: pos,
                event: null,
                preventDefault: function() {
                    if (event && event.cancellable) {
                        event.preventDefault();
                    }
                },
                stopProgagation: function() {
                    if (event && event.stopProgagation) {
                        event.stopProgagation();
                    }
                },
                childIndex: function(node) {
                    node = node || element;
                    var result = -1;
                    for (var i = 0, l = node.children.length; i < l; i++) {
                        if (node.children[i].contains(event.target)){
                            result = i;
                            break;
                        }
                    }
                    return result;
                },
                childNode: function(node) {
                    node = node || element;
                    var result;
                    for (var i = 0, l = node.children.length; i < l; i++) {
                        if (node.children[i].contains(event.target)){
                            result = node.children[i];
                            break;
                        }
                    }
                    return result;
                },
                element: element
            };
        function clear() {
            event = null;
            pos.x = null;
            pos.y = null;
            pos.t = null;
            motion.event = null;
            motion.gesture = null;
            motion.pos_t_start = null;
            motion.pos_t_previous = null;
            motion.pos_t_end = null;
            motion.pos_t_delta = null;
            motion.pos_x_start = null;
            motion.pos_x_previous = null;
            motion.pos_x_end = null;
            motion.pos_x_delta = null;
            motion.pos_y_start = null;
            motion.pos_y_previous = null;
            motion.pos_y_end = null;
            motion.pos_y_delta = null;
            motion.pos_u_delta = null;
            motion.vel_x = null;
            motion.vel_y = null;
            motion.vel_u = null;
            motion.dist_x = null;
            motion.dist_y = null;
            motion.dist_u = null;
            motion.direction = null;
            clearTimeout(timer);
            timer = null;
        }
        function getpos() {
            pos.x = event.pageX || event.changedTouches[0].pageX;
            pos.y = event.pageY || event.changedTouches[0].pageY;
            pos.t = event.timeStamp;
        }
        function start(e) {
            if (!event) {
                motion.event = event = e;
                getpos();
                motion.pos_t_start = pos.t;
                motion.pos_x_start = pos.x;
                motion.pos_y_start = pos.y;
                motion.pos_t_delta = 0;
                motion.pos_x_delta = 0;
                motion.pos_y_delta = 0;
                motion.pos_u_delta = 0;
                timer = setTimeout(timeout, config.HOLD_MINTIME);
                that.event('touchstart', motion);
                if (config.ANDRD_FIX_TOUCH_START_PREVENT_DFLT && event.type === 'touchstart') {
                    event.preventDefault();
                }
            }
        }
        function move(e) {
            if (event) {
                var x_delta, y_delta;
                motion.event = event = e;
                motion.pos_t_previous = pos.t;
                motion.pos_x_previous = pos.x;
                motion.pos_y_previous = pos.y;
                getpos();
                motion.pos_t_delta = pos.t - motion.pos_t_start;
                x_delta = pos.x - motion.pos_x_previous;
                y_delta = pos.y - motion.pos_y_previous;
                motion.pos_x_delta += Math.abs(x_delta);
                motion.pos_y_delta += Math.abs(y_delta);
                motion.pos_u_delta += Math.sqrt(x_delta * x_delta + y_delta * y_delta);
                motion.dist_x = pos.x - motion.pos_x_start;
                motion.dist_y = pos.y - motion.pos_y_start;
                motion.dist_u = Math.sqrt(motion.dist_x * motion.dist_x + motion.dist_y * motion.dist_y);
                motion.vel_x = motion.dist_x / motion.pos_t_delta;
                motion.vel_y = motion.dist_y / motion.pos_t_delta;
                motion.vel_u = motion.dist_u / motion.pos_t_delta;
                that.event('touchmove', motion);
                if (motion.pos_u_delta > config.PAN_MINDELTA) { // Pan Recognition Logic
                    if (Math.abs(motion.dist_x) > Math.abs(motion.dist_y)) {
                        motion.direction = x_delta > 0 ? 'RIGHT' : 'LEFT';
                        that.event('pan' + motion.direction.toLowerCase(), motion);
                        that.event('pan' + 'horizontal', motion);
                    } else {
                        motion.direction = y_delta > 0 ? 'DOWN' : 'UP';
                        that.event('pan' + motion.direction.toLowerCase(), motion);
                        that.event('pan' + 'vertical', motion);
                    }
                    that.event('pan', motion);
                }
            }
        }
        function end(e) {
            if (event) {
                var x_delta, y_delta;
                motion.event = event = e;
                getpos();
                motion.pos_t_end = pos.t;
                motion.pos_x_end = pos.x;
                motion.pos_y_end = pos.y;
                motion.pos_t_delta = pos.t - motion.pos_t_start;
                x_delta = motion.pos_x_previous === null ? 0 : pos.x - motion.pos_x_previous;
                y_delta = motion.pos_y_previous === null ? 0 : pos.y - motion.pos_y_previous;
                motion.pos_x_delta += Math.abs(x_delta);
                motion.pos_y_delta += Math.abs(y_delta);
                motion.pos_u_delta += Math.sqrt(x_delta * x_delta + y_delta * y_delta);
                motion.dist_x = pos.x - motion.pos_x_start;
                motion.dist_y = pos.y - motion.pos_y_start;
                motion.dist_u = Math.sqrt(motion.dist_x * motion.dist_x + motion.dist_y * motion.dist_y);
                motion.vel_x = motion.dist_x / motion.pos_t_delta;
                motion.vel_y = motion.dist_y / motion.pos_t_delta;
                motion.vel_u = motion.dist_u / motion.pos_t_delta;
                that.event('touchend', motion);
                if (event.type !== 'mouseleave' && event.type !== 'touchleave' && motion.pos_t_delta < config.TAP_MAXTIME && motion.pos_u_delta < config.TAP_MAXDELTA) { // Tap Recognition Logic
                    that.event('tap', motion);
                    if (config.PREVENT_DBL_CLICK) {
                       event.preventDefault();
                    }
                }
                if (motion.pos_t_delta < config.SWIPE_MAXTIME && motion.vel_u > config.SWIPE_MINSPEED) {
                    if (Math.abs(motion.dist_x) > Math.abs(motion.dist_y)) {
                        motion.direction = motion.dist_x > 0 ? 'RIGHT' : 'LEFT';
                        that.event('swipe' + motion.direction.toLowerCase(), motion);
                        that.event('swipe' + 'horizontal', motion);
                    } else {
                        motion.direction = motion.dist_y > 0 ? 'DOWN' : 'UP';
                        that.event('swipe' + motion.direction.toLowerCase(), motion);
                        that.event('swipe' + 'vertical', motion);
                    }
                    that.event('swipe', motion);
                }
                clear();
            }
        }
        function leave(e) {
            if (event && config.END_ON_LEAVE) {
                end(e);
            }
        }
        function timeout() {
            if (event) {
                getpos();
                motion.pos_t_delta = pos.t - motion.pos_t_start;
                if (motion.dist_u) {
                    motion.vel_x = motion.dist_x / motion.pos_t_delta;
                    motion.vel_y = motion.dist_y / motion.pos_t_delta;
                    motion.vel_u = motion.dist_u / motion.pos_t_delta;
                }
                if (motion.pos_u_delta < config.HOLD_MAXDELTA) { // Hold Recognition Logic
                    that.event('hold', motion);
                }
            }
        }
        this.detach = function () {
            if (config.TOUCH) {
                element.removeEventListener('touchstart', start, false);
                element.removeEventListener('touchmove', move, false);
                document.body.removeEventListener('touchcancel', end, false);
                document.body.removeEventListener('touchend', end, false);
                element.removeEventListener('touchleave', leave, false);
            }
            if (config.MOUSE) {
                element.removeEventListener('mousedown', start, false);
                element.removeEventListener('mousemove', move, false);
                document.body.removeEventListener('mouseup', end, false);
                element.removeEventListener('mouseleave', leave, false);
            }
        }
        this.attach = function () {
            if (config.TOUCH) {
                element.addEventListener('touchstart', start, false);
                element.addEventListener('touchmove', move, false);
                document.body.addEventListener('touchcancel', end, false);
                document.body.addEventListener('touchend', end, false);
                element.addEventListener('touchleave', leave, false);
            }
            if (config.MOUSE) {
                element.addEventListener('mousedown', start, false);
                element.addEventListener('mousemove', move, false);
                document.body.addEventListener('mouseup', end, false);
                element.addEventListener('mouseleave', leave, false);
            }
        }
        style.webkitUserSelect = 'none';
        style.mozUserSelect = 'none';
        style.msUserSelect = 'none';
        style.webkitUserDrag = 'none';
        style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
        clear();
        this.attach();
        /** @dict */
        this.__eventlist__ = {};
        this.element = element;
        this.CONFIG = config;
        element.touches = this;
    }
    TouchListener.prototype = {
        on: function (event, func) {
            if (event === "tap") {
                this.CONFIG.PREVENT_DBL_CLICK = true;
            }
            if (event === "pan" && isAndroid) {
                this.CONFIG.ANDRD_FIX_TOUCH_START_PREVENT_DFLT = true;
            }
            this.__eventlist__[event.toLowerCase()] = func;
        },
        event: function (event, arg) {
            if (typeof (this.__eventlist__[event]) === 'function') {
                arg.gesture = event;
                try {
                    this.__eventlist__[event].call(this, arg);
                }
                catch (error) {
                    console.error(error.stack || error);
                }
            }
        }
    };
    function addTouch(element, event , fn) {
        if (!element.touches) {
            new TouchListener(element);
        }
        if (event && event.constructor === Array) {
            for (var i = 0, l = event.length; i < l; i++) {
                element.touches.on(event[i], fn);
            }
        } else {
            element.touches.on(event, fn);
        }
        return element.touches;
    }
    Doom.touch = addTouch;
}());