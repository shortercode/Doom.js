(function(){
    var DEFAULTS = {
        method: 'GET',
        encode: 'json',
        timeout: 0,
        credentials: true,
        headers: {
            'Accept': '*/*',
            'Content-type': 'application/json;charset=UTF-8'
        }
    };
    function urlEncode(obj) {
        var props = [];
        for (i in obj) {
            props.push(i + "=" + escape(encodeURI(obj[i])));
        }
        return props.join("&");
    }
    function setHeaders(req, headers) {
        for (var i in DEFAULTS.headers) {
            if (headers[i] === undefined) {
                headers[i] = DEFAULTS.headers[i];
            }
        } 
        for (i in headers) {
            req.setRequestHeader(i, headers[i]);
        }
    }
    Doom.fetch = function(arg) {
        return new Doom.Promise(function(resolve, reject) {
            var req = new XMLHttpRequest(),
                url = typeof arg === "string" ? arg : arg.url,
                method = arg.method || DEFAULTS.method,
                encode = arg.encode || DEFAULTS.encode,
                timeout = arg.timeout || DEFAULTS.timeout,
                credentials = arg.withCredentials || DEFAULTS.credentials,
                headers = arg.headers || {};
            req.open(method, url);
            req.timeout = timeout;
            req.withCredentials = credentials;
            setHeaders(req, headers);
            req.onload = function() {
                if (req.status < 400 && req.status >= 200) {
                    resolve(req.response);
                } else {
                    reject(req);
                }
            };
            req.onerror = function() {
                reject(req);
            };
            req.onabort = function() {
                reject(req);
            };
            if (encode === "json") {
                req.send(arg.data ? JSON.stringify(arg.data) : null);
            } else if (encode === "url") {
                req.send(arg.data ? urlEncode(arg.data) : null);
            }
            
        });
    };
    Doom.fetch.DEFAULTS = DEFAULTS;
}());