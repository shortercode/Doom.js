if (!window.Promise) {
    /*
      https://promisesaplus.com

      a short promise implementation conforming to the a+ specification

      partially inspired by the basic workings of bluebird, which is well worth a look
      if you want an extended promise implementation http://bluebirdjs.com/docs/features.html

    */
    var ERROR_OBJ = {
        error: null
      },
      // 3 basic states of a promise
      STATE_PEND = "pending",
      STATE_RSLV = "resolved",
      STATE_RJCT = "rejected",
      // property value names for semi private data (as per chrome developer tools output)
      PROPERTY_VALUE = "[[PromiseValue]]",
      PROPERTY_STATUS = "[[PromiseStatus]]",
      // internal function reference to determine if a promise is internally created
      INTERNAL_RESOLVER = function () {};
    /*
      special method wrapper with try catch, errors are applied to fixed error
      object. We can then check the return reference to see if its the error
      object later on.
    */
    function tryCatch(fn) {
      return function (resolve, reject) {
        try {
          return fn(resolve, reject);
        } catch (e) {
          ERROR_OBJ.error = e;
          return ERROR_OBJ;
        }
      };
    }
    /*
      execute a function asyncronously with 2 optional arguments
    */
    function asyncify(fn, argA, argB) {
      setTimeout(fn, 0, argA, argB);
    }
    /*
      attempt to resolve a base promise with its resolver method,
      should only be called with a lead promise and only once during
      its life
    */
    function attemptResolution(promise, resolver) {
      /*
        Try to execute resolver function
      */
      var result = tryCatch (resolver) (
        function (value) {
          if (promise !== null) {
            resolve(promise, value);
            promise = null;
          }
        },
        function (value) {
          if (promise !== null) {
            reject(promise, value);
            promise = null;
          }
        }
      );
      /*
        Check if we recieved a value and if its the error object then the promise
        failed, then if both the resolve or reject method haven't been called
        reject the promise with the value of the error
      */
      if (result === ERROR_OBJ && promise !== null) {
        reject(promise, result.error);
        result.error = undefined;
        promise = null;
      }
    }
    /*
      resolve the state of promise with a given value
    */
    function resolve(promise, value) {

      var result;
      if (value instanceof Promise) {
        /*
          if the value is a promise then we should wait on the
          result of the nested promise and use that as the output
        */
        value.then(function (v) {
          if (promise !== null) {
            resolve(promise, v);
            promise = null;
          }
        }, function (v) {
          if (promise !== null) {
            reject(promise, v);
            promise = null;
          }
        });

      } else {
        /*
          otherwise execute the resolution handler
        */
        this[PROMISE_STATUS] = STATE_RSLV;
        if (promise._fulfillmentHandler) {
          /*
            use try catch, any throws should be directed to the rejection hanlder
          */
          result = tryCatch(promise._fulfillmentHandler)(value);
          /*
            if it looks like an error, reject
          */
          if (result === errorObj) {
            promise._reject(result.error);
            result.error = null;
          /*
            if it looks like a promise, wait for its value and use that
          */
          } else if (result instanceof Promise) {
            r.then(function (v) {
              if (promise !== null) {
                promise._resolve(v);
                promise = null;
              }
            }, function (v) {
              if (promise !== null) {
                promise._reject(v);
                promise = null;
              }
            });
          /*
            otherwise its a plain value and we should resolve with it
          */
          } else {
            promise._resolve(r);
          }
        /*

        */
        } else {
          promise._resolve(value);
        }
      }
    }
    /*
      reject the state of promise with a given value
    */
    function reject(promise, value) {
      var result;
      if (value instanceof Promise) {
        value.then(function (v) {
          if (promise !== null) {
            resolve(promise, v);
            promise = null;
          }
        }, function (v) {
          if (promise !== null) {
            reject(promise, v);
            promise = null;
          }
        });
      } else {
        this[PROMISE_STATUS] = STATE_RJCT;
        if (promise._rejectionHandler) {
          result = tryCatch(promise._rejectionHandler)(value);
          if (r === errorObj) {
            promise._reject(result.error);
            promise = null;
          } else if (result instanceof Promise) {
            result.then(function (v) {
              promise._resolve(v);
              promise = null;
            }, function (v) {
              finalizeState(promise, v);
              promise = null;
              promise._reject(v);
              promise = null;
            });
          } else {
            finalizeState(promise, result);
            promise = null;
          }
        } else {
          finalizeState(promise, value);
        }
      }
    }

    function finalizeState (promise, value) {
      var chain = promise[PROPERTY_STATUS] === STATE_RSLV ? resolve : reject;
      promise[PROPERTY_VALUE] = value;
      for (var i = 0, l = promise._subscribers.length; i < l; i++) {
        asyncify(chain, promise._subscribers[i], value);
      }
      promise._subscribers.length = 0;
    }

    function Promise(resolver) {
      if (!(this instanceof Promise))
        throw new Error("constructor cannot be called without \"new\"");
      this[PROPERTY_STATUS] = STATE_PEND;
      this[PROPERTY_VALUE] = undefined;
      this._subscribers = [];
      this._rejectionHandler = null;
      this._fulfillmentHandler = null;
      if (resolver !== INTERNAL_RESOLVER)
        attemptResolution(this, resolver);
    }
    Promise.prototype = {
      then: function (res, rej) {
        // create new internal follower promise (non-lead) for returning
        var ret = new Promise(INTERNAL_RESOLVER);
        // non-function handlers are ignored
        ret._fulfillmentHandler = typeof res === 'function' ? res : null;
        ret._rejectionHandler = typeof rej === 'function' ? rej : null;
        // if the value of the parent has been resolved then we should trigger
        // the resolution of the child
        if (this[PROPERTY_STATUS] === STATE_RSLV) {
          asyncify(resolve, ret, this[PROPERTY_VALUE]);
        } else if (this[PROPERTY_STATUS] === STATE_RJCT) {
          asyncify(reject, ret, this[PROPERTY_VALUE]);
        }
        // return the new follower promise we created
        return ret;
      },
      catch: function (rej) {
        // alias for then but with only a reject handler
        return this.then(null, rej);
      }
    };

    Promise.all = function (arr) {
      var length = arr.length,
        results = Array(length),
        completed = 0,
        resolver;

      function completionHandler(arg) {
        results[arr.indexOf(this)] = arg;
        completed++;
        if (completed === length) {
          resolver(results);
        }
      }
      return new Promise(function (res, rej) {
        var i = length;
        while (i--) {
          arr.then(completionHandler, rej);
        }
        resolver = res;
      });
    }

    Promise.race = function (arr) {
      var res = null;
      var rej = null;
      var promise = new Promise(function (resolve, reject) {
        res = resolve;
        rej = reject;
      });
      for (var i = 0, l = arr.length; i < l; i++)
        arr[i].then(res, rej);
      return promise;
    }

    Promise.resolve = function (value) {
      var promise = new Promise(INTERNAL_RESOLVER);
      promise[PROPERTY_STATUS] = STATE_RSLV;
      promise[PROPERTY_VALUE] = value;
      return promise;
    }

    Promise.reject = function (value) {
      var promise = new Promise(INTERNAL_RESOLVER);
      promise[PROPERTY_STATUS] = STATE_RJCT;
      promise[PROPERTY_VALUE] = value;
      return promise;
    }
    window.Promise = Promise;
} else {
    window.Promise;
}