if (!window.Promise) {
    var errorObj = {e: null},
        STATE_INIT = 0,
        STATE_PEND = 1,
        STATE_RSLV = 2,
        STATE_RJCT = 3,
        INTERNAL = function () {};
    function tryCatch(fn) {
        return function (resolve, reject) {
            try {
                return fn(resolve, reject);
            } catch (e) {
                errorObj.e = e;
                return errorObj;
            }
        };
    }
    function Promise(resolver) {
        if (this instanceof Promise) {
            this.state = STATE_INIT;
            this.subscriberqueue = [];
            this.rejectionhandler = undefined;
            this.resolvehandler = undefined;
            this.settledValue = undefined;
            if (resolver !== INTERNAL) {
                this.resolveWithResolver(resolver);
            }
        } else {
            return new Promise(resolver);
        }
    }
   /* Promise.all = function (arr) {
        var length = arr.length,
            results = Array(length),
            completed = 0,
            resolver;
        function completionHandler (arg) {
            results[arr.indexOf(this)] = arg;
            completed++;
            if (completed === length) {
                resolver(results);
            }
        }
        return new Doom.Promise(function (res, rej) {
            var i = length;
            while (i--) {
                arr.then(completionHandler, rej);
            }
            resolver = res;
        });
    }*/
    Promise.prototype = {
        resolveWithResolver: function (resolver) {
            var promise = this, r;
            this.state = STATE_PEND;
            r = tryCatch(resolver)(function (value) {
                if (promise !== null) {
                    promise.resolveCallback(value);
                    promise = null;
                }
            }, function (reason) {
                if (promise !== null) {
                    promise.rejectCallback(reason);
                    promise = null;
                }
            });

            if (r !== undefined && promise !== null) {
                if (r === errorObj) {
                    promise.rejectCallback(r.e);
                    promise = null;
                } else {
                    promise.rejectCallback(r.e);
                    promise = null;
                }
            }
        },
        resolveCallback: function (value) {
            var promise = this, r;
            if (value instanceof Promise) {
                value.then(function (v) {
                    if (promise !== null) {
                        promise.resolveCallback(v);
                        promise = null;
                    }
                }, function (v) {
                    if (promise !== null) {
                        promise.rejectCallback(v);
                        promise = null;
                    }
                });
            } else {
                this.state = STATE_RSLV;
                if (this.resolvehandler) {
                    r = tryCatch(this.resolvehandler)(value);
                    if (r === errorObj) {
                        promise.reject(r.e);
                    } else if (r instanceof Promise) {
                        r.then(function (v) {
                            if (promise !== null) {
                                promise.fulfill(v);
                                promise = null;
                            }
                        }, function (v) {
                            if (promise !== null) {
                                promise.reject(v);
                                promise = null;
                            }
                        });
                    } else {
                        promise.fulfill(r);
                    }
                } else {
                    this.fulfill(value);
                }
            }
        },
        rejectCallback: function (value) {
            var promise = this, r;
            if (value instanceof Promise) {
                value.then(function (v) {
                    if (promise !== null) {
                        promise.resolveCallback(v);
                        promise = null;
                    }
                }, function (v) {
                    if (promise !== null) {
                        promise.rejectCallback(v);
                        promise = null;
                    }
                });
            } else {
                this.state = STATE_RJCT;
                if (this.rejectionhandler) {
                    r = tryCatch(this.rejectionhandler)(value);
                    if (r === errorObj) {
                        promise.reject(r.e);
                        promise = null;
                    } else if (r instanceof Promise) {
                        r.then(function (v) {
                            promise.fulfill(v);
                            promise = null;
                        }, function (v) {
                            promise.reject(v);
                            promise = null;
                        });
                    } else {
                        promise.fulfill(r);
                        promise = null;
                    }
                } else {
                    this.reject(value);
                }
            }
        },
        fulfill: function (value) {
            function deferredCallback(sub) {
                return function() {
                    sub.resolveCallback(value);
                    promise.settledValue = value;
                };
            }
            var promise = this, subscriber;
            while (this.subscriberqueue.length) {
                subscriber = this.subscriberqueue.shift();
                setTimeout(deferredCallback(subscriber), 0);
            }
        },
        reject: function (value, sync) {
            function deferredCallback(sub) {
                return function() {
                    sub.rejectCallback(value);
                    promise.settledValue = value;
                };
            }
            var promise = this, subscriber;
            while (this.subscriberqueue.length) {
                subscriber = this.subscriberqueue.shift();
                setTimeout(deferredCallback(subscriber), 0);
            }
        },
        then: function (res, rej) {
            var ret = new Promise(INTERNAL);
            ret.resolvehandler = res;
            ret.rejectionhandler = rej;
            this.subscriberqueue.push(ret);
            if (this.state === STATE_RSLV) {
                this.fulfill(this.settledValue);
            } else if (this.state === STATE_RJCT) {
                this.reject(this.settledValue);
            }
            return ret;
        },
        catch: function (rej) {
            return this.then(undefined, rej);
        }
    };
    Doom.Promise = Promise;
} else {
    Doom.Promise = window.Promise;
}