(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;

/* Package-scope variables */
var makeErrorByStatus, encodeParams, encodeString, buildUrl, populateData;

(function () {

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/aldeed:http/http-extras-common.js                                      //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
makeErrorByStatus = function(statusCode, content) {                                // 1
  var MAX_LENGTH = 500; // if you change this, also change the appropriate test    // 2
                                                                                   // 3
  var truncate = function(str, length) {                                           // 4
    return str.length > length ? str.slice(0, length) + '...' : str;               // 5
  };                                                                               // 6
                                                                                   // 7
  var message = "failed [" + statusCode + "]";                                     // 8
  if (content) {                                                                   // 9
    try {                                                                          // 10
      message += " " + truncate(content.replace(/\n/g, " "), MAX_LENGTH);          // 11
    }                                                                              // 12
    catch (error) {                                                                // 13
      message += " Response is not of type String ";                               // 14
    }                                                                              // 15
  }                                                                                // 16
                                                                                   // 17
  return new Error(message);                                                       // 18
};                                                                                 // 19
                                                                                   // 20
encodeParams = function(params) {                                                  // 21
  var buf = [];                                                                    // 22
  _.each(params, function(value, key) {                                            // 23
    if (buf.length)                                                                // 24
      buf.push('&');                                                               // 25
    buf.push(encodeString(key), '=', encodeString(value));                         // 26
  });                                                                              // 27
  return buf.join('').replace(/%20/g, '+');                                        // 28
};                                                                                 // 29
                                                                                   // 30
encodeString = function(str) {                                                     // 31
  return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A"); // 32
};                                                                                 // 33
                                                                                   // 34
buildUrl = function(before_qmark, from_qmark, opt_query, opt_params) {             // 35
  var url_without_query = before_qmark;                                            // 36
  var query = from_qmark ? from_qmark.slice(1) : null;                             // 37
                                                                                   // 38
  if (typeof opt_query === "string")                                               // 39
    query = String(opt_query);                                                     // 40
                                                                                   // 41
  if (opt_params) {                                                                // 42
    query = query || "";                                                           // 43
    var prms = encodeParams(opt_params);                                           // 44
    if (query && prms)                                                             // 45
      query += '&';                                                                // 46
    query += prms;                                                                 // 47
  }                                                                                // 48
                                                                                   // 49
  var url = url_without_query;                                                     // 50
  if (query !== null)                                                              // 51
    url += ("?"+query);                                                            // 52
                                                                                   // 53
  return url;                                                                      // 54
};                                                                                 // 55
                                                                                   // 56
// Fill in `response.data` if the content-type is JSON.                            // 57
populateData = function(response) {                                                // 58
  // Read Content-Type header, up to a ';' if there is one.                        // 59
  // A typical header might be "application/json; charset=utf-8"                   // 60
  // or just "application/json".                                                   // 61
  var contentType = (response.headers['content-type'] || ';').split(';')[0];       // 62
                                                                                   // 63
  // Only try to parse data as JSON if server sets correct content type.           // 64
  if (_.include(['application/json', 'text/javascript'], contentType)) {           // 65
    try {                                                                          // 66
      response.data = JSON.parse(response.content);                                // 67
    } catch (err) {                                                                // 68
      response.data = null;                                                        // 69
    }                                                                              // 70
  } else {                                                                         // 71
    response.data = null;                                                          // 72
  }                                                                                // 73
};                                                                                 // 74
                                                                                   // 75
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/aldeed:http/http-extras-server.js                                      //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
var request = Npm.require('request');                                              // 1
var url_util = Npm.require('url');                                                 // 2
                                                                                   // 3
// _call always runs asynchronously; HTTP.call, defined below,                     // 4
// wraps _call and runs synchronously when no callback is provided.                // 5
var _call = function(method, url, options, callback) {                             // 6
                                                                                   // 7
  ////////// Process arguments //////////                                          // 8
                                                                                   // 9
  if (! callback && typeof options === "function") {                               // 10
    // support (method, url, callback) argument list                               // 11
    callback = options;                                                            // 12
    options = null;                                                                // 13
  }                                                                                // 14
                                                                                   // 15
  options = options || {};                                                         // 16
                                                                                   // 17
  method = (method || "").toUpperCase();                                           // 18
                                                                                   // 19
  if (! /^https?:\/\//.test(url))                                                  // 20
    throw new Error("url must be absolute and start with http:// or https://");    // 21
                                                                                   // 22
  var url_parts = url_util.parse(url);                                             // 23
                                                                                   // 24
  var headers = {};                                                                // 25
                                                                                   // 26
  var content = options.content;                                                   // 27
  if (options.data) {                                                              // 28
    content = JSON.stringify(options.data);                                        // 29
    headers['Content-Type'] = 'application/json';                                  // 30
  }                                                                                // 31
                                                                                   // 32
  var responseType = options.responseType || "string";                             // 33
  var encoding = _.isUndefined(options._encoding) ? "utf8" : options._encoding;    // 34
                                                                                   // 35
  // If responseType requires getting a Buffer back, override encoding             // 36
  // to null, which tells request to return a Buffer                               // 37
  if (_.contains(["arraybuffer", "buffer", "ejson-binary"], responseType)) {       // 38
    encoding = null;                                                               // 39
  }                                                                                // 40
                                                                                   // 41
  var params_for_url, params_for_body;                                             // 42
  if (content || method === "GET" || method === "HEAD")                            // 43
    params_for_url = options.params;                                               // 44
  else                                                                             // 45
    params_for_body = options.params;                                              // 46
                                                                                   // 47
  var new_url = buildUrl(                                                          // 48
    url_parts.protocol + "//" + url_parts.host + url_parts.pathname,               // 49
    url_parts.search, options.query, params_for_url);                              // 50
                                                                                   // 51
  if (options.auth) {                                                              // 52
    if (options.auth.indexOf(':') < 0)                                             // 53
      throw new Error('auth option should be of the form "username:password"');    // 54
    headers['Authorization'] = "Basic "+                                           // 55
      (new Buffer(options.auth, "ascii")).toString("base64");                      // 56
  }                                                                                // 57
                                                                                   // 58
  if (params_for_body) {                                                           // 59
    content = encodeParams(params_for_body);                                       // 60
    headers['Content-Type'] = "application/x-www-form-urlencoded";                 // 61
  }                                                                                // 62
                                                                                   // 63
  _.extend(headers, options.headers || {});                                        // 64
                                                                                   // 65
  // wrap callback to add a 'response' property on an error, in case               // 66
  // we have both (http 4xx/5xx error, which has a response payload)               // 67
  callback = (function(callback) {                                                 // 68
    return function(error, response) {                                             // 69
      if (error && response)                                                       // 70
        error.response = response;                                                 // 71
      callback(error, response);                                                   // 72
    };                                                                             // 73
  })(callback);                                                                    // 74
                                                                                   // 75
  // safety belt: only call the callback once.                                     // 76
  callback = _.once(callback);                                                     // 77
                                                                                   // 78
                                                                                   // 79
  ////////// Kickoff! //////////                                                   // 80
                                                                                   // 81
  var req_options = {                                                              // 82
    url: new_url,                                                                  // 83
    method: method,                                                                // 84
    encoding: encoding,                                                            // 85
    jar: false,                                                                    // 86
    timeout: options.timeout,                                                      // 87
    body: content,                                                                 // 88
    followRedirect: options.followRedirects,                                       // 89
    headers: headers                                                               // 90
  };                                                                               // 91
                                                                                   // 92
  request(req_options, function(error, res, body) {                                // 93
    var response = null;                                                           // 94
                                                                                   // 95
    if (! error) {                                                                 // 96
                                                                                   // 97
      response = {};                                                               // 98
      response.statusCode = res.statusCode;                                        // 99
                                                                                   // 100
      // Convert body into requested type                                          // 101
      switch (responseType) {                                                      // 102
        case "arraybuffer":                                                        // 103
          var len = body.length;                                                   // 104
          var ab = new ArrayBuffer(len);                                           // 105
          var view = new Uint8Array(ab);                                           // 106
          for (var i = 0; i < len; i++) {                                          // 107
            view[i] = body[i];                                                     // 108
          }                                                                        // 109
          body = ab;                                                               // 110
          break;                                                                   // 111
        case "ejson-binary":                                                       // 112
          var len = body.length;                                                   // 113
          var binary = EJSON.newBinary(len);                                       // 114
          for (var i = 0; i < len; i++) {                                          // 115
            binary[i] = body[i];                                                   // 116
          }                                                                        // 117
          body = binary;                                                           // 118
          break;                                                                   // 119
        case "json":                                                               // 120
          if (typeof body === "string") {                                          // 121
            try {                                                                  // 122
              body = JSON.parse(body);                                             // 123
            } catch (err) {                                                        // 124
              // leave it as a string                                              // 125
            }                                                                      // 126
          }                                                                        // 127
          break;                                                                   // 128
      }                                                                            // 129
                                                                                   // 130
                                                                                   // 131
      response.content = body;                                                     // 132
      response.headers = res.headers;                                              // 133
                                                                                   // 134
      populateData(response);                                                      // 135
                                                                                   // 136
      if (response.statusCode >= 400)                                              // 137
        error = makeErrorByStatus(response.statusCode, response.content);          // 138
    }                                                                              // 139
                                                                                   // 140
    callback(error, response);                                                     // 141
                                                                                   // 142
  });                                                                              // 143
};                                                                                 // 144
                                                                                   // 145
HTTP.call = Meteor.wrapAsync(_call);                                               // 146
                                                                                   // 147
                                                                                   // 148
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aldeed:http'] = {};

})();

//# sourceMappingURL=aldeed_http.js.map
