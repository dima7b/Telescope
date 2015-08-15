(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MeteorX = Package['meteorhacks:meteorx'].MeteorX;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var DDP = Package.ddp.DDP;
var DDPServer = Package.ddp.DDPServer;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Email = Package.email.Email;
var Random = Package.random.Random;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var Kadira, BaseErrorModel, Retry, HaveAsyncCallback, UniqueId, DefaultUniqueId, OptimizedApply, Ntp, WaitTimeBuilder, KadiraModel, MethodsModel, PubsubModel, collectionName, SystemModel, ErrorModel, OplogCheck, Tracer, TracerStore, wrapServer, wrapSession, wrapSubscription, wrapOplogObserveDriver, wrapPollingObserveDriver, wrapMultiplexer, wrapForCountingObservers, hijackDBOps, TrackUncaughtExceptions, TrackMeteorDebug, setLabels;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/common/unify.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Kadira = {};                                                                                                          // 1
Kadira.options = {};                                                                                                  // 2
                                                                                                                      // 3
if(Meteor.wrapAsync) {                                                                                                // 4
  Kadira._wrapAsync = Meteor.wrapAsync;                                                                               // 5
} else {                                                                                                              // 6
  Kadira._wrapAsync = Meteor._wrapAsync;                                                                              // 7
}                                                                                                                     // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/models/base_error.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
BaseErrorModel = function(options) {                                                                                  // 1
  this._filters = [];                                                                                                 // 2
};                                                                                                                    // 3
                                                                                                                      // 4
BaseErrorModel.prototype.addFilter = function(filter) {                                                               // 5
  if(typeof filter === 'function') {                                                                                  // 6
    this._filters.push(filter);                                                                                       // 7
  } else {                                                                                                            // 8
    throw new Error("Error filter must be a function");                                                               // 9
  }                                                                                                                   // 10
};                                                                                                                    // 11
                                                                                                                      // 12
BaseErrorModel.prototype.removeFilter = function(filter) {                                                            // 13
  var index = this._filters.indexOf(filter);                                                                          // 14
  if(index >= 0) {                                                                                                    // 15
    this._filters.splice(index, 1);                                                                                   // 16
  }                                                                                                                   // 17
};                                                                                                                    // 18
                                                                                                                      // 19
BaseErrorModel.prototype.applyFilters = function(type, message, error, subType) {                                     // 20
  for(var lc=0; lc<this._filters.length; lc++) {                                                                      // 21
    var filter = this._filters[lc];                                                                                   // 22
    try {                                                                                                             // 23
      var validated = filter(type, message, error, subType);                                                          // 24
      if(!validated) return false;                                                                                    // 25
    } catch (ex) {                                                                                                    // 26
      // we need to remove this filter                                                                                // 27
      // we may ended up in a error cycle                                                                             // 28
      this._filters.splice(lc, 1);                                                                                    // 29
      throw new Error("an error thrown from a filter you've suplied", ex.message);                                    // 30
    }                                                                                                                 // 31
  }                                                                                                                   // 32
                                                                                                                      // 33
  return true;                                                                                                        // 34
};                                                                                                                    // 35
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/jobs.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Jobs = Kadira.Jobs = {};                                                                                          // 1
Jobs.getAsync = function(id, callback) {                                                                              // 2
  var payload = {                                                                                                     // 3
    action: 'get',                                                                                                    // 4
    params: {                                                                                                         // 5
      id: id                                                                                                          // 6
    }                                                                                                                 // 7
  };                                                                                                                  // 8
                                                                                                                      // 9
  Kadira.send(payload, '/jobs', callback);                                                                            // 10
};                                                                                                                    // 11
                                                                                                                      // 12
Jobs.setAsync = function(id, changes, callback) {                                                                     // 13
  var payload = {                                                                                                     // 14
    action: 'set',                                                                                                    // 15
    params: {                                                                                                         // 16
      id: id                                                                                                          // 17
    }                                                                                                                 // 18
  };                                                                                                                  // 19
  _.extend(payload.params, changes);                                                                                  // 20
                                                                                                                      // 21
  Kadira.send(payload, '/jobs', callback);                                                                            // 22
};                                                                                                                    // 23
                                                                                                                      // 24
                                                                                                                      // 25
Jobs.get = Kadira._wrapAsync(Jobs.getAsync);                                                                          // 26
Jobs.set = Kadira._wrapAsync(Jobs.setAsync);                                                                          // 27
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/retry.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Retry logic with an exponential backoff.                                                                           // 1
//                                                                                                                    // 2
// options:                                                                                                           // 3
//  baseTimeout: time for initial reconnect attempt (ms).                                                             // 4
//  exponent: exponential factor to increase timeout each attempt.                                                    // 5
//  maxTimeout: maximum time between retries (ms).                                                                    // 6
//  minCount: how many times to reconnect "instantly".                                                                // 7
//  minTimeout: time to wait for the first `minCount` retries (ms).                                                   // 8
//  fuzz: factor to randomize retry times by (to avoid retry storms).                                                 // 9
                                                                                                                      // 10
//TODO: remove this class and use Meteor Retry in a later version of meteor.                                          // 11
                                                                                                                      // 12
Retry = function (options) {                                                                                          // 13
  var self = this;                                                                                                    // 14
  _.extend(self, _.defaults(_.clone(options || {}), {                                                                 // 15
    baseTimeout: 1000, // 1 second                                                                                    // 16
    exponent: 2.2,                                                                                                    // 17
    // The default is high-ish to ensure a server can recover from a                                                  // 18
    // failure caused by load.                                                                                        // 19
    maxTimeout: 5 * 60000, // 5 minutes                                                                               // 20
    minTimeout: 10,                                                                                                   // 21
    minCount: 2,                                                                                                      // 22
    fuzz: 0.5 // +- 25%                                                                                               // 23
  }));                                                                                                                // 24
  self.retryTimer = null;                                                                                             // 25
};                                                                                                                    // 26
                                                                                                                      // 27
_.extend(Retry.prototype, {                                                                                           // 28
                                                                                                                      // 29
  // Reset a pending retry, if any.                                                                                   // 30
  clear: function () {                                                                                                // 31
    var self = this;                                                                                                  // 32
    if(self.retryTimer)                                                                                               // 33
      clearTimeout(self.retryTimer);                                                                                  // 34
    self.retryTimer = null;                                                                                           // 35
  },                                                                                                                  // 36
                                                                                                                      // 37
  // Calculate how long to wait in milliseconds to retry, based on the                                                // 38
  // `count` of which retry this is.                                                                                  // 39
  _timeout: function (count) {                                                                                        // 40
    var self = this;                                                                                                  // 41
                                                                                                                      // 42
    if(count < self.minCount)                                                                                         // 43
      return self.minTimeout;                                                                                         // 44
                                                                                                                      // 45
    var timeout = Math.min(                                                                                           // 46
      self.maxTimeout,                                                                                                // 47
      self.baseTimeout * Math.pow(self.exponent, count));                                                             // 48
    // fuzz the timeout randomly, to avoid reconnect storms when a                                                    // 49
    // server goes down.                                                                                              // 50
    timeout = timeout * ((Random.fraction() * self.fuzz) +                                                            // 51
                         (1 - self.fuzz/2));                                                                          // 52
    return Math.ceil(timeout);                                                                                        // 53
  },                                                                                                                  // 54
                                                                                                                      // 55
  // Call `fn` after a delay, based on the `count` of which retry this is.                                            // 56
  retryLater: function (count, fn) {                                                                                  // 57
    var self = this;                                                                                                  // 58
    var timeout = self._timeout(count);                                                                               // 59
    if(self.retryTimer)                                                                                               // 60
      clearTimeout(self.retryTimer);                                                                                  // 61
                                                                                                                      // 62
    self.retryTimer = setTimeout(fn, timeout);                                                                        // 63
    return timeout;                                                                                                   // 64
  }                                                                                                                   // 65
                                                                                                                      // 66
});                                                                                                                   // 67
                                                                                                                      // 68
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/utils.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 1
                                                                                                                      // 2
HaveAsyncCallback = function(args) {                                                                                  // 3
  var lastArg = args[args.length -1];                                                                                 // 4
  return (typeof lastArg) == 'function';                                                                              // 5
};                                                                                                                    // 6
                                                                                                                      // 7
UniqueId = function(start) {                                                                                          // 8
  this.id = 0;                                                                                                        // 9
}                                                                                                                     // 10
                                                                                                                      // 11
UniqueId.prototype.get = function() {                                                                                 // 12
  return "" + this.id++;                                                                                              // 13
};                                                                                                                    // 14
                                                                                                                      // 15
DefaultUniqueId = new UniqueId();                                                                                     // 16
                                                                                                                      // 17
// Optimized version of apply which tries to call as possible as it can                                               // 18
// Then fall back to apply                                                                                            // 19
// This is because, v8 is very slow to invoke apply.                                                                  // 20
OptimizedApply = function OptimizedApply(context, fn, args) {                                                         // 21
  var a = args;                                                                                                       // 22
  switch(a.length) {                                                                                                  // 23
    case 0:                                                                                                           // 24
      return fn.call(context);                                                                                        // 25
    case 1:                                                                                                           // 26
      return fn.call(context, a[0]);                                                                                  // 27
    case 2:                                                                                                           // 28
      return fn.call(context, a[0], a[1]);                                                                            // 29
    case 3:                                                                                                           // 30
      return fn.call(context, a[0], a[1], a[2]);                                                                      // 31
    case 4:                                                                                                           // 32
      return fn.call(context, a[0], a[1], a[2], a[3]);                                                                // 33
    case 5:                                                                                                           // 34
      return fn.call(context, a[0], a[1], a[2], a[3], a[4]);                                                          // 35
    default:                                                                                                          // 36
      return fn.apply(context, a);                                                                                    // 37
  }                                                                                                                   // 38
}                                                                                                                     // 39
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/ntp.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var logger = getLogger();                                                                                             // 1
                                                                                                                      // 2
Ntp = function (endpoint) {                                                                                           // 3
  this.setEndpoint(endpoint);                                                                                         // 4
  this.diff = 0;                                                                                                      // 5
  this.synced = false;                                                                                                // 6
  this.reSyncCount = 0;                                                                                               // 7
  this.reSync = new Retry({                                                                                           // 8
    baseTimeout: 1000*60,                                                                                             // 9
    maxTimeout: 1000*60*10,                                                                                           // 10
    minCount: 0                                                                                                       // 11
  });                                                                                                                 // 12
}                                                                                                                     // 13
                                                                                                                      // 14
Ntp._now = function() {                                                                                               // 15
  var now = Date.now();                                                                                               // 16
  if(typeof now == 'number') {                                                                                        // 17
    return now;                                                                                                       // 18
  } else if(now instanceof Date) {                                                                                    // 19
    // some extenal JS libraries override Date.now and returns a Date object                                          // 20
    // which directly affect us. So we need to prepare for that                                                       // 21
    return now.getTime();                                                                                             // 22
  } else {                                                                                                            // 23
    // trust me. I've seen now === undefined                                                                          // 24
    return (new Date()).getTime();                                                                                    // 25
  }                                                                                                                   // 26
};                                                                                                                    // 27
                                                                                                                      // 28
Ntp.prototype.setEndpoint = function(endpoint) {                                                                      // 29
  this.endpoint = endpoint + '/simplentp/sync';                                                                       // 30
};                                                                                                                    // 31
                                                                                                                      // 32
Ntp.prototype.getTime = function() {                                                                                  // 33
  return Ntp._now() + Math.round(this.diff);                                                                          // 34
};                                                                                                                    // 35
                                                                                                                      // 36
Ntp.prototype.syncTime = function(localTime) {                                                                        // 37
  return localTime + Math.ceil(this.diff);                                                                            // 38
};                                                                                                                    // 39
                                                                                                                      // 40
Ntp.prototype.sync = function() {                                                                                     // 41
  logger('init sync');                                                                                                // 42
  var self = this;                                                                                                    // 43
  var retryCount = 0;                                                                                                 // 44
  var retry = new Retry({                                                                                             // 45
    baseTimeout: 1000*20,                                                                                             // 46
    maxTimeout: 1000*60,                                                                                              // 47
    minCount: 1,                                                                                                      // 48
    minTimeout: 0                                                                                                     // 49
  });                                                                                                                 // 50
  syncTime();                                                                                                         // 51
                                                                                                                      // 52
  function syncTime () {                                                                                              // 53
    if(retryCount<5) {                                                                                                // 54
      logger('attempt time sync with server', retryCount);                                                            // 55
      // if we send 0 to the retryLater, cacheDns will run immediately                                                // 56
      retry.retryLater(retryCount++, cacheDns);                                                                       // 57
    } else {                                                                                                          // 58
      logger('maximum retries reached');                                                                              // 59
      self.reSync.retryLater(self.reSyncCount++, function () {                                                        // 60
        var args = [].slice.call(arguments);                                                                          // 61
        self.sync.apply(self, args);                                                                                  // 62
      });                                                                                                             // 63
    }                                                                                                                 // 64
  }                                                                                                                   // 65
                                                                                                                      // 66
  // first attempt is to cache dns. So, calculation does not                                                          // 67
  // include DNS resolution time                                                                                      // 68
  function cacheDns () {                                                                                              // 69
    self.getServerTime(function(err) {                                                                                // 70
      if(!err) {                                                                                                      // 71
        calculateTimeDiff();                                                                                          // 72
      } else {                                                                                                        // 73
        syncTime();                                                                                                   // 74
      }                                                                                                               // 75
    });                                                                                                               // 76
  }                                                                                                                   // 77
                                                                                                                      // 78
  function calculateTimeDiff () {                                                                                     // 79
    var startTime = (new Date()).getTime();                                                                           // 80
    self.getServerTime(function(err, serverTime) {                                                                    // 81
      if(!err && serverTime) {                                                                                        // 82
        // (Date.now() + startTime)/2 : Midpoint between req and res                                                  // 83
        self.diff = serverTime - ((new Date()).getTime() + startTime)/2;                                              // 84
        self.synced = true;                                                                                           // 85
        // we need to send 1 into retryLater.                                                                         // 86
        self.reSync.retryLater(self.reSyncCount++, function () {                                                      // 87
          var args = [].slice.call(arguments);                                                                        // 88
          self.sync.apply(self, args);                                                                                // 89
        });                                                                                                           // 90
        logger('successfully updated diff value', self.diff);                                                         // 91
      } else {                                                                                                        // 92
        syncTime();                                                                                                   // 93
      }                                                                                                               // 94
    });                                                                                                               // 95
  }                                                                                                                   // 96
}                                                                                                                     // 97
                                                                                                                      // 98
Ntp.prototype.getServerTime = function(callback) {                                                                    // 99
  var self = this;                                                                                                    // 100
                                                                                                                      // 101
  if(Meteor.isServer) {                                                                                               // 102
    var Fiber = Npm.require('fibers');                                                                                // 103
    new Fiber(function() {                                                                                            // 104
      HTTP.get(self.endpoint, function (err, res) {                                                                   // 105
        if(err) {                                                                                                     // 106
          callback(err);                                                                                              // 107
        } else {                                                                                                      // 108
          var serverTime = parseInt(res.content)                                                                      // 109
          callback(null, serverTime);                                                                                 // 110
        }                                                                                                             // 111
      });                                                                                                             // 112
    }).run();                                                                                                         // 113
  } else {                                                                                                            // 114
    $.ajax({                                                                                                          // 115
      type: 'GET',                                                                                                    // 116
      url: self.endpoint,                                                                                             // 117
      success: function(serverTime) {                                                                                 // 118
        callback(null, parseInt(serverTime));                                                                         // 119
      },                                                                                                              // 120
      error: function(err) {                                                                                          // 121
        callback(err);                                                                                                // 122
      }                                                                                                               // 123
    });                                                                                                               // 124
  }                                                                                                                   // 125
};                                                                                                                    // 126
                                                                                                                      // 127
function getLogger() {                                                                                                // 128
  if(Meteor.isServer) {                                                                                               // 129
    return Npm.require('debug')("kadira:ntp");                                                                        // 130
  } else {                                                                                                            // 131
    return function(message) {                                                                                        // 132
      var canLogKadira =                                                                                              // 133
        Meteor._localStorage.getItem('LOG_KADIRA') !== null                                                           // 134
        && typeof console !== 'undefined';                                                                            // 135
                                                                                                                      // 136
      if(canLogKadira) {                                                                                              // 137
        if(message) {                                                                                                 // 138
          message = "kadira:ntp " + message;                                                                          // 139
          arguments[0] = message;                                                                                     // 140
        }                                                                                                             // 141
        console.log.apply(console, arguments);                                                                        // 142
      }                                                                                                               // 143
    }                                                                                                                 // 144
  }                                                                                                                   // 145
}                                                                                                                     // 146
                                                                                                                      // 147
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/wait_time_builder.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var WAITON_MESSAGE_FIELDS = ['msg', 'id', 'method', 'name', 'waitTime'];                                              // 1
                                                                                                                      // 2
// This is way how we can build waitTime and it's breakdown                                                           // 3
WaitTimeBuilder = function() {                                                                                        // 4
  this._waitListStore = {};                                                                                           // 5
  this._currentProcessingMessages = {};                                                                               // 6
  this._messageCache = {};                                                                                            // 7
};                                                                                                                    // 8
                                                                                                                      // 9
WaitTimeBuilder.prototype.register = function(session, msgId) {                                                       // 10
  var self = this;                                                                                                    // 11
  var mainKey = self._getMessageKey(session.id, msgId);                                                               // 12
                                                                                                                      // 13
  var inQueue = session.inQueue || [];                                                                                // 14
  if(typeof inQueue.toArray === 'function') {                                                                         // 15
    // latest version of Meteor uses a double-ended-queue for the inQueue                                             // 16
    // info: https://www.npmjs.com/package/double-ended-queue                                                         // 17
    inQueue = inQueue.toArray();                                                                                      // 18
  }                                                                                                                   // 19
                                                                                                                      // 20
  var waitList = inQueue.map(function(msg) {                                                                          // 21
    var key = self._getMessageKey(session.id, msg.id);                                                                // 22
    return self._getCacheMessage(key, msg);                                                                           // 23
  });                                                                                                                 // 24
                                                                                                                      // 25
  waitList = waitList || [];                                                                                          // 26
                                                                                                                      // 27
  //add currently processing ddp message if exists                                                                    // 28
  var currentlyProcessingMessage = this._currentProcessingMessages[session.id];                                       // 29
  if(currentlyProcessingMessage) {                                                                                    // 30
    var key = self._getMessageKey(session.id, currentlyProcessingMessage.id);                                         // 31
    waitList.unshift(this._getCacheMessage(key, currentlyProcessingMessage));                                         // 32
  }                                                                                                                   // 33
                                                                                                                      // 34
  this._waitListStore[mainKey] = waitList;                                                                            // 35
};                                                                                                                    // 36
                                                                                                                      // 37
WaitTimeBuilder.prototype.build = function(session, msgId) {                                                          // 38
  var mainKey = this._getMessageKey(session.id, msgId);                                                               // 39
  var waitList = this._waitListStore[mainKey] || [];                                                                  // 40
  delete this._waitListStore[mainKey];                                                                                // 41
                                                                                                                      // 42
  var filteredWaitList =  waitList.map(this._cleanCacheMessage.bind(this));                                           // 43
  return filteredWaitList;                                                                                            // 44
};                                                                                                                    // 45
                                                                                                                      // 46
WaitTimeBuilder.prototype._getMessageKey = function(sessionId, msgId) {                                               // 47
  return sessionId + "::" + msgId;                                                                                    // 48
};                                                                                                                    // 49
                                                                                                                      // 50
WaitTimeBuilder.prototype._getCacheMessage = function(key, msg) {                                                     // 51
  var self = this;                                                                                                    // 52
  var cachedMessage = self._messageCache[key];                                                                        // 53
  if(!cachedMessage) {                                                                                                // 54
    self._messageCache[key] = cachedMessage = _.pick(msg, WAITON_MESSAGE_FIELDS);                                     // 55
    cachedMessage._key = key;                                                                                         // 56
    cachedMessage._registered = 1;                                                                                    // 57
  } else {                                                                                                            // 58
    cachedMessage._registered++;                                                                                      // 59
  }                                                                                                                   // 60
                                                                                                                      // 61
  return cachedMessage;                                                                                               // 62
};                                                                                                                    // 63
                                                                                                                      // 64
WaitTimeBuilder.prototype._cleanCacheMessage = function(msg) {                                                        // 65
  msg._registered--;                                                                                                  // 66
  if(msg._registered == 0) {                                                                                          // 67
    delete this._messageCache[msg._key];                                                                              // 68
  }                                                                                                                   // 69
                                                                                                                      // 70
  // need to send a clean set of objects                                                                              // 71
  // otherwise register can go with this                                                                              // 72
  return _.pick(msg, WAITON_MESSAGE_FIELDS);                                                                          // 73
};                                                                                                                    // 74
                                                                                                                      // 75
WaitTimeBuilder.prototype.trackWaitTime = function(session, msg, unblock) {                                           // 76
  var self = this;                                                                                                    // 77
  var started = Date.now();                                                                                           // 78
  self._currentProcessingMessages[session.id] = msg;                                                                  // 79
                                                                                                                      // 80
  var unblocked = false;                                                                                              // 81
  var wrappedUnblock = function() {                                                                                   // 82
    if(!unblocked) {                                                                                                  // 83
      var waitTime = Date.now() - started;                                                                            // 84
      var key = self._getMessageKey(session.id, msg.id);                                                              // 85
      var cachedMessage = self._messageCache[key];                                                                    // 86
      if(cachedMessage) {                                                                                             // 87
        cachedMessage.waitTime = waitTime;                                                                            // 88
      }                                                                                                               // 89
      delete self._currentProcessingMessages[session.id];                                                             // 90
      unblocked = true;                                                                                               // 91
      unblock();                                                                                                      // 92
    }                                                                                                                 // 93
  };                                                                                                                  // 94
                                                                                                                      // 95
  return wrappedUnblock;                                                                                              // 96
};                                                                                                                    // 97
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/models/0model.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
KadiraModel = function() {                                                                                            // 1
                                                                                                                      // 2
};                                                                                                                    // 3
                                                                                                                      // 4
KadiraModel.prototype._getDateId = function(timestamp) {                                                              // 5
  var remainder = timestamp % (1000 * 60);                                                                            // 6
  var dateId = timestamp - remainder;                                                                                 // 7
  return dateId;                                                                                                      // 8
};                                                                                                                    // 9
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/models/methods.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var METHOD_METRICS_FIELDS = ['wait', 'db', 'http', 'email', 'async', 'compute', 'total'];                             // 1
                                                                                                                      // 2
MethodsModel = function (metricsThreshold) {                                                                          // 3
  var self = this;                                                                                                    // 4
                                                                                                                      // 5
  this.methodMetricsByMinute = {};                                                                                    // 6
  this.errorMap = {};                                                                                                 // 7
                                                                                                                      // 8
  this._metricsThreshold = _.extend({                                                                                 // 9
    "wait": 100,                                                                                                      // 10
    "db": 100,                                                                                                        // 11
    "http": 1000,                                                                                                     // 12
    "email": 100,                                                                                                     // 13
    "async": 100,                                                                                                     // 14
    "compute": 100,                                                                                                   // 15
    "total": 200                                                                                                      // 16
  }, metricsThreshold || {});                                                                                         // 17
                                                                                                                      // 18
  //store max time elapsed methods for each method, event(metrics-field)                                              // 19
  this.maxEventTimesForMethods = {};                                                                                  // 20
                                                                                                                      // 21
  this.tracerStore = new TracerStore({                                                                                // 22
    interval: 1000 * 60, //process traces every minute                                                                // 23
    maxTotalPoints: 30, //for 30 minutes                                                                              // 24
    archiveEvery: 5 //always trace for every 5 minutes,                                                               // 25
  });                                                                                                                 // 26
                                                                                                                      // 27
  this.tracerStore.start();                                                                                           // 28
};                                                                                                                    // 29
                                                                                                                      // 30
_.extend(MethodsModel.prototype, KadiraModel.prototype);                                                              // 31
                                                                                                                      // 32
MethodsModel.prototype.processMethod = function(methodTrace) {                                                        // 33
  var dateId = this._getDateId(methodTrace.at);                                                                       // 34
                                                                                                                      // 35
  //append metrics to previous values                                                                                 // 36
  this._appendMetrics(dateId, methodTrace);                                                                           // 37
  if(methodTrace.errored) {                                                                                           // 38
    this.methodMetricsByMinute[dateId].methods[methodTrace.name].errors ++                                            // 39
  }                                                                                                                   // 40
                                                                                                                      // 41
  this.tracerStore.addTrace(methodTrace);                                                                             // 42
};                                                                                                                    // 43
                                                                                                                      // 44
MethodsModel.prototype._appendMetrics = function(id, methodTrace) {                                                   // 45
  //initialize meteric for this time interval                                                                         // 46
  if(!this.methodMetricsByMinute[id]) {                                                                               // 47
    this.methodMetricsByMinute[id] = {                                                                                // 48
      // startTime needs to be converted into serverTime before sending                                               // 49
      startTime: methodTrace.at,                                                                                      // 50
      methods: {}                                                                                                     // 51
    };                                                                                                                // 52
  }                                                                                                                   // 53
                                                                                                                      // 54
  var methods = this.methodMetricsByMinute[id].methods;                                                               // 55
                                                                                                                      // 56
  //initialize method                                                                                                 // 57
  if(!methods[methodTrace.name]) {                                                                                    // 58
    methods[methodTrace.name] = {                                                                                     // 59
      count: 0,                                                                                                       // 60
      errors: 0                                                                                                       // 61
    };                                                                                                                // 62
                                                                                                                      // 63
    METHOD_METRICS_FIELDS.forEach(function(field) {                                                                   // 64
      methods[methodTrace.name][field] = 0;                                                                           // 65
    });                                                                                                               // 66
  }                                                                                                                   // 67
                                                                                                                      // 68
  //merge                                                                                                             // 69
  METHOD_METRICS_FIELDS.forEach(function(field) {                                                                     // 70
    var value = methodTrace.metrics[field];                                                                           // 71
    if(value > 0) {                                                                                                   // 72
      methods[methodTrace.name][field] += value;                                                                      // 73
    }                                                                                                                 // 74
  });                                                                                                                 // 75
                                                                                                                      // 76
  methods[methodTrace.name].count++;                                                                                  // 77
  this.methodMetricsByMinute[id].endTime = methodTrace.metrics.at;                                                    // 78
};                                                                                                                    // 79
                                                                                                                      // 80
/*                                                                                                                    // 81
  There are two types of data                                                                                         // 82
                                                                                                                      // 83
  1. methodMetrics - metrics about the methods (for every 10 secs)                                                    // 84
  2. methodRequests - raw method request. normally max, min for every 1 min and errors always                         // 85
*/                                                                                                                    // 86
MethodsModel.prototype.buildPayload = function(buildDetailedInfo) {                                                   // 87
  var payload = {                                                                                                     // 88
    methodMetrics: [],                                                                                                // 89
    methodRequests: []                                                                                                // 90
  };                                                                                                                  // 91
                                                                                                                      // 92
  //handling metrics                                                                                                  // 93
  var methodMetricsByMinute = this.methodMetricsByMinute;                                                             // 94
  this.methodMetricsByMinute = {};                                                                                    // 95
                                                                                                                      // 96
  //create final paylod for methodMetrics                                                                             // 97
  for(var key in methodMetricsByMinute) {                                                                             // 98
    var methodMetrics = methodMetricsByMinute[key];                                                                   // 99
    // converting startTime into the actual serverTime                                                                // 100
    var startTime = methodMetrics.startTime;                                                                          // 101
    methodMetrics.startTime = Kadira.syncedDate.syncTime(startTime);                                                  // 102
                                                                                                                      // 103
    for(var methodName in methodMetrics.methods) {                                                                    // 104
      METHOD_METRICS_FIELDS.forEach(function(field) {                                                                 // 105
        methodMetrics.methods[methodName][field] /=                                                                   // 106
          methodMetrics.methods[methodName].count;                                                                    // 107
      });                                                                                                             // 108
    }                                                                                                                 // 109
                                                                                                                      // 110
    payload.methodMetrics.push(methodMetricsByMinute[key]);                                                           // 111
  }                                                                                                                   // 112
                                                                                                                      // 113
  //collect traces and send them with the payload                                                                     // 114
  payload.methodRequests = this.tracerStore.collectTraces();                                                          // 115
                                                                                                                      // 116
  return payload;                                                                                                     // 117
};                                                                                                                    // 118
                                                                                                                      // 119
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/models/pubsub.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var logger = Npm.require('debug')('kadira:pubsub');                                                                   // 1
                                                                                                                      // 2
PubsubModel = function() {                                                                                            // 3
  this.metricsByMinute = {};                                                                                          // 4
  this.subscriptions = {};                                                                                            // 5
                                                                                                                      // 6
  this.tracerStore = new TracerStore({                                                                                // 7
    interval: 1000 * 60, //process traces every minute                                                                // 8
    maxTotalPoints: 30, //for 30 minutes                                                                              // 9
    archiveEvery: 5 //always trace for every 5 minutes,                                                               // 10
  });                                                                                                                 // 11
                                                                                                                      // 12
  this.tracerStore.start();                                                                                           // 13
}                                                                                                                     // 14
                                                                                                                      // 15
PubsubModel.prototype._trackSub = function(session, msg) {                                                            // 16
  logger('SUB:', session.id, msg.id, msg.name, msg.params);                                                           // 17
  var publication = this._getPublicationName(msg.name);                                                               // 18
  var subscriptionId = msg.id;                                                                                        // 19
  var timestamp = Ntp._now();                                                                                         // 20
  var metrics = this._getMetrics(timestamp, publication);                                                             // 21
                                                                                                                      // 22
  metrics.subs++;                                                                                                     // 23
  this.subscriptions[msg.id] = {                                                                                      // 24
    // We use localTime here, because when we used synedTime we might get                                             // 25
    // minus or more than we've expected                                                                              // 26
    //   (before serverTime diff changed overtime)                                                                    // 27
    startTime: timestamp,                                                                                             // 28
    publication: publication,                                                                                         // 29
    params: msg.params,                                                                                               // 30
    id: msg.id                                                                                                        // 31
  };                                                                                                                  // 32
                                                                                                                      // 33
  //set session startedTime                                                                                           // 34
  session._startTime = session._startTime || timestamp;                                                               // 35
};                                                                                                                    // 36
                                                                                                                      // 37
_.extend(PubsubModel.prototype, KadiraModel.prototype);                                                               // 38
                                                                                                                      // 39
PubsubModel.prototype._trackUnsub = function(session, sub) {                                                          // 40
  logger('UNSUB:', session.id, sub._subscriptionId);                                                                  // 41
  var publication = this._getPublicationName(sub._name);                                                              // 42
  var subscriptionId = sub._subscriptionId;                                                                           // 43
  var subscriptionState = this.subscriptions[subscriptionId];                                                         // 44
                                                                                                                      // 45
  var startTime = null;                                                                                               // 46
  //sometime, we don't have these states                                                                              // 47
  if(subscriptionState) {                                                                                             // 48
    startTime = subscriptionState.startTime;                                                                          // 49
  } else {                                                                                                            // 50
    //if this is null subscription, which is started automatically                                                    // 51
    //hence, we don't have a state                                                                                    // 52
    startTime = session._startTime;                                                                                   // 53
  }                                                                                                                   // 54
                                                                                                                      // 55
  //in case, we can't get the startTime                                                                               // 56
  if(startTime) {                                                                                                     // 57
    var timestamp = Ntp._now();                                                                                       // 58
    var metrics = this._getMetrics(timestamp, publication);                                                           // 59
    //track the count                                                                                                 // 60
    if(sub._name != null) {                                                                                           // 61
      // we can't track subs for `null` publications.                                                                 // 62
      // so we should not track unsubs too                                                                            // 63
      metrics.unsubs++;                                                                                               // 64
    }                                                                                                                 // 65
    //use the current date to get the lifeTime of the subscription                                                    // 66
    metrics.lifeTime += timestamp - startTime;                                                                        // 67
    //this is place we can clean the subscriptionState if exists                                                      // 68
    delete this.subscriptions[subscriptionId];                                                                        // 69
  }                                                                                                                   // 70
};                                                                                                                    // 71
                                                                                                                      // 72
PubsubModel.prototype._trackReady = function(session, sub, trace) {                                                   // 73
  logger('READY:', session.id, sub._subscriptionId);                                                                  // 74
  //use the current time to track the response time                                                                   // 75
  var publication = this._getPublicationName(sub._name);                                                              // 76
  var subscriptionId = sub._subscriptionId;                                                                           // 77
  var timestamp = Ntp._now();                                                                                         // 78
  var metrics = this._getMetrics(timestamp, publication);                                                             // 79
                                                                                                                      // 80
  var subscriptionState = this.subscriptions[subscriptionId];                                                         // 81
  if(subscriptionState && !subscriptionState.readyTracked) {                                                          // 82
    metrics.resTime += timestamp - subscriptionState.startTime;                                                       // 83
    subscriptionState.readyTracked = true;                                                                            // 84
  }                                                                                                                   // 85
                                                                                                                      // 86
  if(trace) {                                                                                                         // 87
    this.tracerStore.addTrace(trace);                                                                                 // 88
  }                                                                                                                   // 89
};                                                                                                                    // 90
                                                                                                                      // 91
PubsubModel.prototype._trackError = function(session, sub, trace) {                                                   // 92
  logger('ERROR:', session.id, sub._subscriptionId);                                                                  // 93
  //use the current time to track the response time                                                                   // 94
  var publication = this._getPublicationName(sub._name);                                                              // 95
  var subscriptionId = sub._subscriptionId;                                                                           // 96
  var timestamp = Ntp._now();                                                                                         // 97
  var metrics = this._getMetrics(timestamp, publication);                                                             // 98
                                                                                                                      // 99
  metrics.errors++;                                                                                                   // 100
                                                                                                                      // 101
  if(trace) {                                                                                                         // 102
    this.tracerStore.addTrace(trace);                                                                                 // 103
  }                                                                                                                   // 104
};                                                                                                                    // 105
                                                                                                                      // 106
PubsubModel.prototype._getMetrics = function(timestamp, publication) {                                                // 107
  var dateId = this._getDateId(timestamp);                                                                            // 108
                                                                                                                      // 109
  if(!this.metricsByMinute[dateId]) {                                                                                 // 110
    this.metricsByMinute[dateId] = {                                                                                  // 111
      // startTime needs to be convert to serverTime before sending to the server                                     // 112
      startTime: timestamp,                                                                                           // 113
      pubs: {}                                                                                                        // 114
    };                                                                                                                // 115
  }                                                                                                                   // 116
                                                                                                                      // 117
  if(!this.metricsByMinute[dateId].pubs[publication]) {                                                               // 118
    this.metricsByMinute[dateId].pubs[publication] = {                                                                // 119
      subs: 0,                                                                                                        // 120
      unsubs: 0,                                                                                                      // 121
      resTime: 0,                                                                                                     // 122
      activeSubs: 0,                                                                                                  // 123
      activeDocs: 0,                                                                                                  // 124
      lifeTime: 0,                                                                                                    // 125
      totalObservers: 0,                                                                                              // 126
      cachedObservers: 0,                                                                                             // 127
      createdObservers: 0,                                                                                            // 128
      deletedObservers: 0,                                                                                            // 129
      errors: 0                                                                                                       // 130
    };                                                                                                                // 131
  }                                                                                                                   // 132
                                                                                                                      // 133
  return this.metricsByMinute[dateId].pubs[publication];                                                              // 134
};                                                                                                                    // 135
                                                                                                                      // 136
PubsubModel.prototype._getPublicationName = function(name) {                                                          // 137
  return name || "null(autopublish)";                                                                                 // 138
};                                                                                                                    // 139
                                                                                                                      // 140
PubsubModel.prototype._getSubscriptionInfo = function() {                                                             // 141
  var self = this;                                                                                                    // 142
  var activeSubs = {};                                                                                                // 143
  var activeDocs = {};                                                                                                // 144
  var totalDocsSent = {};                                                                                             // 145
  var totalDataSent = {};                                                                                             // 146
  var totalObservers = {};                                                                                            // 147
  var cachedObservers = {};                                                                                           // 148
                                                                                                                      // 149
  for(var sessionId in Meteor.default_server.sessions) {                                                              // 150
    var session = Meteor.default_server.sessions[sessionId];                                                          // 151
    _.each(session._namedSubs, countSubData);                                                                         // 152
    _.each(session._universalSubs, countSubData);                                                                     // 153
  }                                                                                                                   // 154
                                                                                                                      // 155
  var avgObserverReuse = {};                                                                                          // 156
  _.each(totalObservers, function(value, publication) {                                                               // 157
    avgObserverReuse[publication] = cachedObservers[publication] / totalObservers[publication];                       // 158
  });                                                                                                                 // 159
                                                                                                                      // 160
  return {                                                                                                            // 161
    activeSubs: activeSubs,                                                                                           // 162
    activeDocs: activeDocs,                                                                                           // 163
    avgObserverReuse: avgObserverReuse                                                                                // 164
  };                                                                                                                  // 165
                                                                                                                      // 166
  function countSubData (sub) {                                                                                       // 167
    var publication = self._getPublicationName(sub._name);                                                            // 168
    countSubscriptions(sub, publication);                                                                             // 169
    countDocuments(sub, publication);                                                                                 // 170
    countObservers(sub, publication);                                                                                 // 171
  }                                                                                                                   // 172
                                                                                                                      // 173
  function countSubscriptions (sub, publication) {                                                                    // 174
    activeSubs[publication] = activeSubs[publication] || 0;                                                           // 175
    activeSubs[publication]++;                                                                                        // 176
  }                                                                                                                   // 177
                                                                                                                      // 178
  function countDocuments (sub, publication) {                                                                        // 179
    activeDocs[publication] = activeDocs[publication] || 0;                                                           // 180
    for(collectionName in sub._documents) {                                                                           // 181
      activeDocs[publication] += _.keys(sub._documents[collectionName]).length;                                       // 182
    }                                                                                                                 // 183
  }                                                                                                                   // 184
                                                                                                                      // 185
  function countObservers(sub, publication) {                                                                         // 186
    totalObservers[publication] = totalObservers[publication] || 0;                                                   // 187
    cachedObservers[publication] = cachedObservers[publication] || 0;                                                 // 188
                                                                                                                      // 189
    totalObservers[publication] += sub._totalObservers;                                                               // 190
    cachedObservers[publication] += sub._cachedObservers;                                                             // 191
  }                                                                                                                   // 192
}                                                                                                                     // 193
                                                                                                                      // 194
PubsubModel.prototype.buildPayload = function(buildDetailInfo) {                                                      // 195
  var metricsByMinute = this.metricsByMinute;                                                                         // 196
  this.metricsByMinute = {};                                                                                          // 197
                                                                                                                      // 198
  var payload = {                                                                                                     // 199
    pubMetrics: []                                                                                                    // 200
  };                                                                                                                  // 201
                                                                                                                      // 202
  var subscriptionData = this._getSubscriptionInfo();                                                                 // 203
  var activeSubs = subscriptionData.activeSubs;                                                                       // 204
  var activeDocs = subscriptionData.activeDocs;                                                                       // 205
  var avgObserverReuse = subscriptionData.avgObserverReuse;                                                           // 206
                                                                                                                      // 207
  //to the averaging                                                                                                  // 208
  for(var dateId in metricsByMinute) {                                                                                // 209
    var dateMetrics = metricsByMinute[dateId];                                                                        // 210
    // We need to convert startTime into actual serverTime                                                            // 211
    dateMetrics.startTime = Kadira.syncedDate.syncTime(dateMetrics.startTime);                                        // 212
                                                                                                                      // 213
    for(var publication in metricsByMinute[dateId].pubs) {                                                            // 214
      var singlePubMetrics = metricsByMinute[dateId].pubs[publication];                                               // 215
      // We only calculate resTime for new subscriptions                                                              // 216
      singlePubMetrics.resTime /= singlePubMetrics.subs;                                                              // 217
      singlePubMetrics.resTime = singlePubMetrics.resTime || 0;                                                       // 218
      // We only track lifeTime in the unsubs                                                                         // 219
      singlePubMetrics.lifeTime /= singlePubMetrics.unsubs;                                                           // 220
      singlePubMetrics.lifeTime = singlePubMetrics.lifeTime || 0;                                                     // 221
                                                                                                                      // 222
      // This is a very efficient solution. We can come up with another solution                                      // 223
      // which maintains the count inside the API.                                                                    // 224
      // But for now, this is the most reliable method.                                                               // 225
                                                                                                                      // 226
      // If there are two ore more dateIds, we will be using the currentCount for all of them.                        // 227
      // We can come up with a better solution later on.                                                              // 228
      singlePubMetrics.activeSubs = activeSubs[publication] || 0;                                                     // 229
      singlePubMetrics.activeDocs = activeDocs[publication] || 0;                                                     // 230
      singlePubMetrics.avgObserverReuse = avgObserverReuse[publication] || 0;                                         // 231
    }                                                                                                                 // 232
    payload.pubMetrics.push(metricsByMinute[dateId]);                                                                 // 233
  }                                                                                                                   // 234
                                                                                                                      // 235
  //collect traces and send them with the payload                                                                     // 236
  payload.pubRequests = this.tracerStore.collectTraces();                                                             // 237
                                                                                                                      // 238
  return payload;                                                                                                     // 239
};                                                                                                                    // 240
                                                                                                                      // 241
PubsubModel.prototype.incrementHandleCount = function(trace, isCached) {                                              // 242
  var publicationName = trace.name;                                                                                   // 243
  var timestamp = Ntp._now();                                                                                         // 244
  var publication = this._getMetrics(timestamp, publicationName);                                                     // 245
                                                                                                                      // 246
  var session = Meteor.default_server.sessions[trace.session];                                                        // 247
  if(session) {                                                                                                       // 248
    var sub = session._namedSubs[trace.id];                                                                           // 249
    if(sub) {                                                                                                         // 250
      sub._totalObservers = sub._totalObservers || 0;                                                                 // 251
      sub._cachedObservers = sub._cachedObservers || 0;                                                               // 252
    }                                                                                                                 // 253
  }                                                                                                                   // 254
  // not sure, we need to do this? But I don't need to break the however                                              // 255
  sub = sub || {_totalObservers:0 , _cachedObservers: 0};                                                             // 256
                                                                                                                      // 257
  publication.totalObservers++;                                                                                       // 258
  sub._totalObservers++;                                                                                              // 259
  if(isCached) {                                                                                                      // 260
    publication.cachedObservers++;                                                                                    // 261
    sub._cachedObservers++;                                                                                           // 262
  }                                                                                                                   // 263
}                                                                                                                     // 264
                                                                                                                      // 265
PubsubModel.prototype.trackCreatedObserver = function(info) {                                                         // 266
  var timestamp = Ntp._now();                                                                                         // 267
  var publication = this._getMetrics(timestamp, info.name);                                                           // 268
  publication.createdObservers++;                                                                                     // 269
}                                                                                                                     // 270
                                                                                                                      // 271
PubsubModel.prototype.trackDeletedObserver = function(info) {                                                         // 272
  var timestamp = Ntp._now();                                                                                         // 273
  var publication = this._getMetrics(timestamp, info.name);                                                           // 274
  publication.deletedObservers++;                                                                                     // 275
}                                                                                                                     // 276
                                                                                                                      // 277
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/models/system.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var os = Npm.require('os');                                                                                           // 1
var usage = Npm.require('pidusage');                                                                                  // 2
                                                                                                                      // 3
SystemModel = function () {                                                                                           // 4
  var self = this;                                                                                                    // 5
  this.startTime = Ntp._now();                                                                                        // 6
  this.newSessions = 0;                                                                                               // 7
  this.sessionTimeout = 1000 * 60 * 30; //30 min                                                                      // 8
                                                                                                                      // 9
  this.usageLookup = Kadira._wrapAsync(usage.stat.bind(usage));                                                       // 10
}                                                                                                                     // 11
                                                                                                                      // 12
_.extend(SystemModel.prototype, KadiraModel.prototype);                                                               // 13
                                                                                                                      // 14
SystemModel.prototype.buildPayload = function() {                                                                     // 15
  var metrics = {};                                                                                                   // 16
  var now = Ntp._now();                                                                                               // 17
  metrics.startTime = Kadira.syncedDate.syncTime(this.startTime);                                                     // 18
  metrics.endTime = Kadira.syncedDate.syncTime(now);                                                                  // 19
                                                                                                                      // 20
  metrics.sessions = _.keys(Meteor.default_server.sessions).length;                                                   // 21
  metrics.memory = process.memoryUsage().rss / (1024*1024);                                                           // 22
  metrics.newSessions = this.newSessions;                                                                             // 23
  this.newSessions = 0;                                                                                               // 24
                                                                                                                      // 25
  var usage = this.getUsage();                                                                                        // 26
  metrics.pcpu = usage.cpu;                                                                                           // 27
  if(usage.cpuInfo) {                                                                                                 // 28
    metrics.cputime = usage.cpuInfo.cpuTime;                                                                          // 29
    metrics.pcpuUser = usage.cpuInfo.pcpuUser;                                                                        // 30
    metrics.pcpuSystem = usage.cpuInfo.pcpuSystem;                                                                    // 31
  }                                                                                                                   // 32
                                                                                                                      // 33
  this.startTime = now;                                                                                               // 34
  return {systemMetrics: [metrics]};                                                                                  // 35
};                                                                                                                    // 36
                                                                                                                      // 37
SystemModel.prototype.getUsage = function() {                                                                         // 38
  return this.usageLookup(process.pid) || {};                                                                         // 39
};                                                                                                                    // 40
                                                                                                                      // 41
SystemModel.prototype.handleSessionActivity = function(msg, session) {                                                // 42
  if(msg.msg === 'connect' && !msg.session) {                                                                         // 43
    this.countNewSession(session);                                                                                    // 44
  } else if(['sub', 'method'].indexOf(msg.msg) != -1) {                                                               // 45
    if(!this.isSessionActive(session)) {                                                                              // 46
      this.countNewSession(session);                                                                                  // 47
    }                                                                                                                 // 48
  }                                                                                                                   // 49
  session._activeAt = Date.now();                                                                                     // 50
}                                                                                                                     // 51
                                                                                                                      // 52
SystemModel.prototype.countNewSession = function(session) {                                                           // 53
  if(!isLocalAddress(session.socket)) {                                                                               // 54
    this.newSessions++;                                                                                               // 55
  }                                                                                                                   // 56
}                                                                                                                     // 57
                                                                                                                      // 58
SystemModel.prototype.isSessionActive = function(session) {                                                           // 59
  var inactiveTime = Date.now() - session._activeAt;                                                                  // 60
  return inactiveTime < this.sessionTimeout;                                                                          // 61
}                                                                                                                     // 62
                                                                                                                      // 63
// ------------------------------------------------------------------------- //                                       // 64
                                                                                                                      // 65
// http://regex101.com/r/iF3yR3/2                                                                                     // 66
var isLocalHostRegex = /^(?:.*\.local|localhost)(?:\:\d+)?|127(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}$/;
                                                                                                                      // 68
// http://regex101.com/r/hM5gD8/1                                                                                     // 69
var isLocalAddressRegex = /^127(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}$/;
                                                                                                                      // 71
function isLocalAddress (socket) {                                                                                    // 72
  var host = socket.headers['host'];                                                                                  // 73
  if(host) return isLocalHostRegex.test(host);                                                                        // 74
  var address = socket.headers['x-forwarded-for'] || socket.remoteAddress;                                            // 75
  if(address) return isLocalAddressRegex.test(address);                                                               // 76
}                                                                                                                     // 77
                                                                                                                      // 78
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/models/errors.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
ErrorModel = function (appId) {                                                                                       // 1
  BaseErrorModel.call(this);                                                                                          // 2
  var self = this;                                                                                                    // 3
  this.appId = appId;                                                                                                 // 4
  this.errors = {};                                                                                                   // 5
  this.startTime = Date.now();                                                                                        // 6
  this.maxErrors = 10;                                                                                                // 7
}                                                                                                                     // 8
                                                                                                                      // 9
_.extend(ErrorModel.prototype, KadiraModel.prototype);                                                                // 10
_.extend(ErrorModel.prototype, BaseErrorModel.prototype);                                                             // 11
                                                                                                                      // 12
ErrorModel.prototype.buildPayload = function() {                                                                      // 13
  var metrics = _.values(this.errors);                                                                                // 14
  this.startTime = Date.now();                                                                                        // 15
  this.errors = {};                                                                                                   // 16
  return {errors: metrics};                                                                                           // 17
};                                                                                                                    // 18
                                                                                                                      // 19
ErrorModel.prototype.errorCount = function () {                                                                       // 20
  return _.values(this.errors).length;                                                                                // 21
};                                                                                                                    // 22
                                                                                                                      // 23
ErrorModel.prototype.trackError = function(ex, trace) {                                                               // 24
  var key = trace.type + ':' + ex.message;                                                                            // 25
  if(this.errors[key]) {                                                                                              // 26
    this.errors[key].count++;                                                                                         // 27
  } else if (this.errorCount() < this.maxErrors) {                                                                    // 28
    var errorDef = this._formatError(ex, trace);                                                                      // 29
    if(this.applyFilters(errorDef.type, errorDef.name, ex, errorDef.subType)) {                                       // 30
      this.errors[key] = this._formatError(ex, trace);                                                                // 31
    }                                                                                                                 // 32
  }                                                                                                                   // 33
};                                                                                                                    // 34
                                                                                                                      // 35
ErrorModel.prototype._formatError = function(ex, trace) {                                                             // 36
  var time = Date.now();                                                                                              // 37
  var stack = ex.stack;                                                                                               // 38
                                                                                                                      // 39
  // to get Meteor's Error details                                                                                    // 40
  if(ex.details) {                                                                                                    // 41
    stack = "Details: " + ex.details + "\r\n" + stack;                                                                // 42
  }                                                                                                                   // 43
                                                                                                                      // 44
  // Update trace's error event with the next stack                                                                   // 45
  var errorEvent = trace.events && trace.events[trace.events.length -1];                                              // 46
  var errorObject = errorEvent && errorEvent[2] && errorEvent[2].error;                                               // 47
                                                                                                                      // 48
  if(errorObject) {                                                                                                   // 49
    errorObject.stack = stack;                                                                                        // 50
  }                                                                                                                   // 51
                                                                                                                      // 52
  return {                                                                                                            // 53
    appId: this.appId,                                                                                                // 54
    name: ex.message,                                                                                                 // 55
    type: trace.type,                                                                                                 // 56
    startTime: time,                                                                                                  // 57
    subType: trace.subType || trace.name,                                                                             // 58
    trace: trace,                                                                                                     // 59
    stacks: [{stack: stack}],                                                                                         // 60
    count: 1,                                                                                                         // 61
  }                                                                                                                   // 62
};                                                                                                                    // 63
                                                                                                                      // 64
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/kadira.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var request = Npm.require('request');                                                                                 // 1
var hostname = Npm.require('os').hostname();                                                                          // 2
var logger = Npm.require('debug')('kadira:apm');                                                                      // 3
var Fibers = Npm.require('fibers');                                                                                   // 4
                                                                                                                      // 5
Kadira.models = {};                                                                                                   // 6
Kadira.options = {};                                                                                                  // 7
Kadira.env = {                                                                                                        // 8
  currentSub: null, // keep current subscription inside ddp                                                           // 9
  kadiraInfo: new Meteor.EnvironmentVariable(),                                                                       // 10
};                                                                                                                    // 11
Kadira.waitTimeBuilder = new WaitTimeBuilder();                                                                       // 12
Kadira.errors = [];                                                                                                   // 13
Kadira.errors.addFilter = Kadira.errors.push.bind(Kadira.errors);                                                     // 14
                                                                                                                      // 15
Kadira.connect = function(appId, appSecret, options) {                                                                // 16
  options = options || {};                                                                                            // 17
  options.appId = appId;                                                                                              // 18
  options.appSecret = appSecret;                                                                                      // 19
  options.payloadTimeout = options.payloadTimeout || 1000 * 20;                                                       // 20
  options.endpoint = options.endpoint || "https://enginex.kadira.io";                                                 // 21
  options.clientEngineSyncDelay = options.clientEngineSyncDelay || 10000;                                             // 22
  options.thresholds = options.thresholds || {};                                                                      // 23
  options.isHostNameSet = !!options.hostname;                                                                         // 24
  options.hostname = options.hostname || hostname;                                                                    // 25
  options.proxy = options.proxy || null;                                                                              // 26
                                                                                                                      // 27
  // remove trailing slash from endpoint url (if any)                                                                 // 28
  if(_.last(options.endpoint) === '/') {                                                                              // 29
    options.endpoint = options.endpoint.substr(0, options.endpoint.length - 1);                                       // 30
  }                                                                                                                   // 31
                                                                                                                      // 32
  // error tracking is enabled by default                                                                             // 33
  if(options.enableErrorTracking === undefined) {                                                                     // 34
    options.enableErrorTracking = true;                                                                               // 35
  }                                                                                                                   // 36
                                                                                                                      // 37
  Kadira.options = options;                                                                                           // 38
  Kadira.options.authHeaders = {                                                                                      // 39
    'KADIRA-APP-ID': Kadira.options.appId,                                                                            // 40
    'KADIRA-APP-SECRET': Kadira.options.appSecret                                                                     // 41
  };                                                                                                                  // 42
                                                                                                                      // 43
  Kadira.syncedDate = new Ntp(options.endpoint);                                                                      // 44
  Kadira.syncedDate.sync();                                                                                           // 45
  Kadira.models.methods = new MethodsModel(options.thresholds.methods);                                               // 46
  Kadira.models.pubsub = new PubsubModel();                                                                           // 47
  Kadira.models.system = new SystemModel();                                                                           // 48
  Kadira.models.error = new ErrorModel(appId);                                                                        // 49
                                                                                                                      // 50
  // handle pre-added filters                                                                                         // 51
  var addFilterFn = Kadira.models.error.addFilter.bind(Kadira.models.error);                                          // 52
  Kadira.errors.forEach(addFilterFn);                                                                                 // 53
  Kadira.errors = Kadira.models.error;                                                                                // 54
                                                                                                                      // 55
  // setting runtime info, which will be sent to kadira                                                               // 56
  __meteor_runtime_config__.kadira = {                                                                                // 57
    appId: appId,                                                                                                     // 58
    endpoint: options.endpoint,                                                                                       // 59
    clientEngineSyncDelay: options.clientEngineSyncDelay,                                                             // 60
  };                                                                                                                  // 61
                                                                                                                      // 62
  // send hostname to client only is users sets a custom hostname                                                     // 63
  if(options.isHostNameSet) {                                                                                         // 64
    __meteor_runtime_config__.kadira.hostname = options.hostname;                                                     // 65
  }                                                                                                                   // 66
                                                                                                                      // 67
  if(options.enableErrorTracking) {                                                                                   // 68
    Kadira.enableErrorTracking();                                                                                     // 69
  } else {                                                                                                            // 70
    Kadira.disableErrorTracking();                                                                                    // 71
  }                                                                                                                   // 72
                                                                                                                      // 73
  if(appId && appSecret) {                                                                                            // 74
    options.appId = options.appId.trim();                                                                             // 75
    options.appSecret = options.appSecret.trim();                                                                     // 76
    Kadira._pingToCheckAuth(function(){                                                                               // 77
      // it takes time to calculate version 'sha' values                                                              // 78
      // it'll be ready when Meteor.startup is called                                                                 // 79
      Meteor.startup(Kadira._sendAppStats);                                                                           // 80
      Kadira._schedulePayloadSend();                                                                                  // 81
    });                                                                                                               // 82
    logger('connected to app: ', appId);                                                                              // 83
  } else {                                                                                                            // 84
    throw new Error('Kadira: required appId and appSecret');                                                          // 85
  }                                                                                                                   // 86
                                                                                                                      // 87
  // start tracking errors                                                                                            // 88
  Meteor.startup(function () {                                                                                        // 89
    TrackUncaughtExceptions();                                                                                        // 90
    TrackMeteorDebug();                                                                                               // 91
  })                                                                                                                  // 92
                                                                                                                      // 93
  //start wrapping Meteor's internal methods                                                                          // 94
  Kadira._startInstrumenting(function() {                                                                             // 95
    console.log('Kadira: completed instrumenting the app')                                                            // 96
    Kadira.connected = true;                                                                                          // 97
  });                                                                                                                 // 98
                                                                                                                      // 99
  Meteor.publish(null, function () {                                                                                  // 100
    var options = __meteor_runtime_config__.kadira;                                                                   // 101
    this.added('kadira_settings', Random.id(), options);                                                              // 102
    this.ready();                                                                                                     // 103
  });                                                                                                                 // 104
};                                                                                                                    // 105
                                                                                                                      // 106
//track how many times we've sent the data (once per minute)                                                          // 107
Kadira._buildPayload = function () {                                                                                  // 108
  var payload = {host: Kadira.options.hostname};                                                                      // 109
  var buildDetailedInfo = Kadira._isDetailedInfo();                                                                   // 110
  _.extend(payload, Kadira.models.methods.buildPayload(buildDetailedInfo));                                           // 111
  _.extend(payload, Kadira.models.pubsub.buildPayload(buildDetailedInfo));                                            // 112
  _.extend(payload, Kadira.models.system.buildPayload());                                                             // 113
  if(Kadira.options.enableErrorTracking) {                                                                            // 114
    _.extend(payload, Kadira.models.error.buildPayload());                                                            // 115
  }                                                                                                                   // 116
                                                                                                                      // 117
  return payload;                                                                                                     // 118
}                                                                                                                     // 119
                                                                                                                      // 120
Kadira._countDataSent = 0;                                                                                            // 121
Kadira._detailInfoSentInterval = Math.ceil((1000*60) / Kadira.options.payloadTimeout);                                // 122
Kadira._isDetailedInfo = function () {                                                                                // 123
  return (Kadira._countDataSent++ % Kadira._detailInfoSentInterval) == 0;                                             // 124
}                                                                                                                     // 125
                                                                                                                      // 126
Kadira.authCheckFailures = 0;                                                                                         // 127
Kadira._pingToCheckAuth = function (callback) {                                                                       // 128
  var httpOptions = {headers: Kadira.options.authHeaders, data: {}};                                                  // 129
  var endpoint = Kadira.options.endpoint + '/ping';                                                                   // 130
  var authRetry = new Retry({                                                                                         // 131
    minCount: 0, // don't do any immediate retries                                                                    // 132
    baseTimeout: 5 * 1000                                                                                             // 133
  });                                                                                                                 // 134
                                                                                                                      // 135
  Kadira._postData(endpoint, httpOptions, function(err, response){                                                    // 136
    if(response) {                                                                                                    // 137
      if(response.statusCode == 200) {                                                                                // 138
        console.log('Kadira: successfully authenticated');                                                            // 139
        authRetry.clear();                                                                                            // 140
        callback();                                                                                                   // 141
      } else if(response.statusCode == 401) {                                                                         // 142
        console.error('Kadira: authentication failed - check your appId & appSecret')                                 // 143
      } else {                                                                                                        // 144
        retryPingToCheckAuth({message: "unidentified error code: " + response.statusCode});                           // 145
      }                                                                                                               // 146
    } else {                                                                                                          // 147
      retryPingToCheckAuth(err);                                                                                      // 148
    }                                                                                                                 // 149
  });                                                                                                                 // 150
                                                                                                                      // 151
  function retryPingToCheckAuth(err){                                                                                 // 152
    console.log('Kadira: retrying to authenticate (error: %s)', err.message);                                         // 153
    authRetry.retryLater(Kadira.authCheckFailures, function(){                                                        // 154
      Kadira._pingToCheckAuth(callback);                                                                              // 155
    });                                                                                                               // 156
  }                                                                                                                   // 157
}                                                                                                                     // 158
                                                                                                                      // 159
Kadira._sendAppStats = function () {                                                                                  // 160
  var appStats = {};                                                                                                  // 161
  appStats.release = Meteor.release;                                                                                  // 162
  appStats.packageVersions = [];                                                                                      // 163
  appStats.appVersions = {                                                                                            // 164
    webapp: __meteor_runtime_config__['autoupdateVersion'],                                                           // 165
    refreshable: __meteor_runtime_config__['autoupdateVersionRefreshable'],                                           // 166
    cordova: __meteor_runtime_config__['autoupdateVersionCordova']                                                    // 167
  }                                                                                                                   // 168
                                                                                                                      // 169
  // TODO get version number for installed packages                                                                   // 170
  _.each(Package, function (v, name) {                                                                                // 171
    appStats.packageVersions.push({name: name, version: null});                                                       // 172
  });                                                                                                                 // 173
                                                                                                                      // 174
  Kadira._send({                                                                                                      // 175
    host: Kadira.options.hostname,                                                                                    // 176
    startTime: new Date(),                                                                                            // 177
    appStats: appStats                                                                                                // 178
  });                                                                                                                 // 179
}                                                                                                                     // 180
                                                                                                                      // 181
Kadira._schedulePayloadSend = function () {                                                                           // 182
  setTimeout(function () {                                                                                            // 183
    Kadira._sendPayload(Kadira._schedulePayloadSend);                                                                 // 184
  }, Kadira.options.payloadTimeout);                                                                                  // 185
}                                                                                                                     // 186
                                                                                                                      // 187
Kadira._sendPayload = function (callback) {                                                                           // 188
  new Fibers(function() {                                                                                             // 189
    var payload = Kadira._buildPayload();                                                                             // 190
    Kadira._send(payload, function (err) {                                                                            // 191
      if(err) {                                                                                                       // 192
        console.error('Kadira: Error sending payload (dropped after 5 tries)', err.message);                          // 193
      }                                                                                                               // 194
                                                                                                                      // 195
      callback && callback();                                                                                         // 196
    });                                                                                                               // 197
  }).run();                                                                                                           // 198
}                                                                                                                     // 199
                                                                                                                      // 200
Kadira._send = function (payload, callback) {                                                                         // 201
  var endpoint = Kadira.options.endpoint;                                                                             // 202
  var httpOptions = {headers: Kadira.options.authHeaders, data: payload};                                             // 203
  var payloadRetries = 0;                                                                                             // 204
  var payloadRetry = new Retry({                                                                                      // 205
    minCount: 0, // don't do any immediate payloadRetries                                                             // 206
    baseTimeout: 5*1000,                                                                                              // 207
    maxTimeout: 60000                                                                                                 // 208
  });                                                                                                                 // 209
                                                                                                                      // 210
  callHTTP();                                                                                                         // 211
                                                                                                                      // 212
  function callHTTP() {                                                                                               // 213
    Kadira._postData(endpoint, httpOptions, function(err, response){                                                  // 214
      if(response && response.statusCode === 401) {                                                                   // 215
        // do not retry if authentication fails                                                                       // 216
        throw new Error('Kadira: AppId, AppSecret combination is invalid');                                           // 217
      }                                                                                                               // 218
                                                                                                                      // 219
      if(response && response.statusCode == 200) {                                                                    // 220
        if(payloadRetries > 0) {                                                                                      // 221
          logger('connected again and payload sent.')                                                                 // 222
        }                                                                                                             // 223
        cleaPayloadRetry();                                                                                           // 224
        callback && callback();                                                                                       // 225
      } else {                                                                                                        // 226
        if(!err) {                                                                                                    // 227
          err = new Error("Status code: " + response.statusCode);                                                     // 228
        }                                                                                                             // 229
        tryAgain(err);                                                                                                // 230
      }                                                                                                               // 231
    });                                                                                                               // 232
  }                                                                                                                   // 233
                                                                                                                      // 234
  function tryAgain(err) {                                                                                            // 235
    err = err || {};                                                                                                  // 236
    logger('retrying to send payload to server')                                                                      // 237
    if(++payloadRetries < 5) {                                                                                        // 238
      payloadRetry.retryLater(payloadRetries, callHTTP);                                                              // 239
    } else {                                                                                                          // 240
      cleaPayloadRetry();                                                                                             // 241
      callback && callback(err);                                                                                      // 242
    }                                                                                                                 // 243
  }                                                                                                                   // 244
                                                                                                                      // 245
  function cleaPayloadRetry() {                                                                                       // 246
    payloadRetries = 0;                                                                                               // 247
    payloadRetry.clear();                                                                                             // 248
  }                                                                                                                   // 249
}                                                                                                                     // 250
                                                                                                                      // 251
// this return the __kadiraInfo from the current Fiber by default                                                     // 252
// if called with 2nd argument as true, it will get the kadira info from                                              // 253
// Meteor.EnvironmentVariable                                                                                         // 254
//                                                                                                                    // 255
// WARNNING: returned info object is the reference object.                                                            // 256
//  Changing it might cause issues when building traces. So use with care                                             // 257
Kadira._getInfo = function(currentFiber, useEnvironmentVariable) {                                                    // 258
  currentFiber = currentFiber || Fibers.current;                                                                      // 259
  if(currentFiber) {                                                                                                  // 260
    if(useEnvironmentVariable) {                                                                                      // 261
      return Kadira.env.kadiraInfo.get();                                                                             // 262
    }                                                                                                                 // 263
    return currentFiber.__kadiraInfo;                                                                                 // 264
  }                                                                                                                   // 265
};                                                                                                                    // 266
                                                                                                                      // 267
// this does not clone the info object. So, use with care                                                             // 268
Kadira._setInfo = function(info) {                                                                                    // 269
  Fibers.current.__kadiraInfo = info;                                                                                 // 270
};                                                                                                                    // 271
                                                                                                                      // 272
Kadira.enableErrorTracking = function () {                                                                            // 273
  __meteor_runtime_config__.kadira.enableErrorTracking = true;                                                        // 274
  Kadira.options.enableErrorTracking = true;                                                                          // 275
};                                                                                                                    // 276
                                                                                                                      // 277
Kadira.disableErrorTracking = function () {                                                                           // 278
  __meteor_runtime_config__.kadira.enableErrorTracking = false;                                                       // 279
  Kadira.options.enableErrorTracking = false;                                                                         // 280
};                                                                                                                    // 281
                                                                                                                      // 282
Kadira.trackError = function (type, message, options) {                                                               // 283
  if(Kadira.options.enableErrorTracking && type && message) {                                                         // 284
    options = options || {};                                                                                          // 285
    options.subType = options.subType || 'server';                                                                    // 286
    options.stacks = options.stacks || '';                                                                            // 287
    var error = {message: message, stack: options.stacks};                                                            // 288
    var trace = {                                                                                                     // 289
      type: type,                                                                                                     // 290
      subType: options.subType,                                                                                       // 291
      name: message,                                                                                                  // 292
      errored: true,                                                                                                  // 293
      at: Kadira.syncedDate.getTime(),                                                                                // 294
      events: [['start', 0, {}], ['error', 0, {error: error}]],                                                       // 295
      metrics: {total: 0}                                                                                             // 296
    };                                                                                                                // 297
    Kadira.models.error.trackError(error, trace);                                                                     // 298
  }                                                                                                                   // 299
}                                                                                                                     // 300
                                                                                                                      // 301
Kadira.ignoreErrorTracking = function (err) {                                                                         // 302
  err._skipKadira = true;                                                                                             // 303
}                                                                                                                     // 304
                                                                                                                      // 305
Kadira._postData = function (endpoint, options, callback) {                                                           // 306
  var content = JSON.stringify(options.data);                                                                         // 307
                                                                                                                      // 308
  var headers = options.headers;                                                                                      // 309
  headers['Content-Type'] = 'application/json';                                                                       // 310
                                                                                                                      // 311
  var options = {                                                                                                     // 312
    url: endpoint,                                                                                                    // 313
    method: 'POST',                                                                                                   // 314
    encoding: 'utf8',                                                                                                 // 315
    body: content,                                                                                                    // 316
    headers: headers                                                                                                  // 317
  };                                                                                                                  // 318
                                                                                                                      // 319
  if(Kadira.options.proxy) {                                                                                          // 320
    options.proxy = Kadira.options.proxy;                                                                             // 321
  }                                                                                                                   // 322
                                                                                                                      // 323
  request(options, function (error, res, body) {                                                                      // 324
    if(error) {                                                                                                       // 325
      console.error('Kadira:', error.message);                                                                        // 326
      return callback(error);                                                                                         // 327
    }                                                                                                                 // 328
                                                                                                                      // 329
    var response = {};                                                                                                // 330
    response.statusCode = res.statusCode;                                                                             // 331
    callback(null, response);                                                                                         // 332
  });                                                                                                                 // 333
}                                                                                                                     // 334
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/check_for_oplog.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// expose for testing purpose                                                                                         // 1
OplogCheck = {};                                                                                                      // 2
                                                                                                                      // 3
OplogCheck._070 = function(cursorDescription) {                                                                       // 4
  var options = cursorDescription.options;                                                                            // 5
  if (options.limit) {                                                                                                // 6
    return {                                                                                                          // 7
      code: "070_LIMIT_NOT_SUPPORTED",                                                                                // 8
      reason: "Meteor 0.7.0 does not support limit with oplog.",                                                      // 9
      solution: "Upgrade your app to Meteor version 0.7.2 or later."                                                  // 10
    }                                                                                                                 // 11
  };                                                                                                                  // 12
                                                                                                                      // 13
  var exists$ = _.any(cursorDescription.selector, function (value, field) {                                           // 14
    if (field.substr(0, 1) === '$')                                                                                   // 15
      return true;                                                                                                    // 16
  });                                                                                                                 // 17
                                                                                                                      // 18
  if(exists$) {                                                                                                       // 19
    return {                                                                                                          // 20
      code: "070_$_NOT_SUPPORTED",                                                                                    // 21
      reason: "Meteor 0.7.0 supports only equal checks with oplog.",                                                  // 22
      solution: "Upgrade your app to Meteor version 0.7.2 or later."                                                  // 23
    }                                                                                                                 // 24
  };                                                                                                                  // 25
                                                                                                                      // 26
  var onlyScalers = _.all(cursorDescription.selector, function (value, field) {                                       // 27
    return typeof value === "string" ||                                                                               // 28
      typeof value === "number" ||                                                                                    // 29
      typeof value === "boolean" ||                                                                                   // 30
      value === null ||                                                                                               // 31
      value instanceof Meteor.Collection.ObjectID;                                                                    // 32
  });                                                                                                                 // 33
                                                                                                                      // 34
  if(!onlyScalers) {                                                                                                  // 35
    return {                                                                                                          // 36
      code: "070_ONLY_SCALERS",                                                                                       // 37
      reason: "Meteor 0.7.0 only supports scalers as comparators.",                                                   // 38
      solution: "Upgrade your app to Meteor version 0.7.2 or later."                                                  // 39
    }                                                                                                                 // 40
  }                                                                                                                   // 41
                                                                                                                      // 42
  return true;                                                                                                        // 43
};                                                                                                                    // 44
                                                                                                                      // 45
OplogCheck._071 = function(cursorDescription) {                                                                       // 46
  var options = cursorDescription.options;                                                                            // 47
  var matcher = new Minimongo.Matcher(cursorDescription.selector);                                                    // 48
  if (options.limit) {                                                                                                // 49
    return {                                                                                                          // 50
      code: "071_LIMIT_NOT_SUPPORTED",                                                                                // 51
      reason: "Meteor 0.7.1 does not support limit with oplog.",                                                      // 52
      solution: "Upgrade your app to Meteor version 0.7.2 or later."                                                  // 53
    }                                                                                                                 // 54
  };                                                                                                                  // 55
                                                                                                                      // 56
  return true;                                                                                                        // 57
};                                                                                                                    // 58
                                                                                                                      // 59
                                                                                                                      // 60
OplogCheck.env = function() {                                                                                         // 61
  if(!process.env.MONGO_OPLOG_URL) {                                                                                  // 62
    return {                                                                                                          // 63
      code: "NO_ENV",                                                                                                 // 64
      reason: "You haven't added oplog support for your the Meteor app.",                                             // 65
      solution: "Add oplog support for your Meteor app. see: http://goo.gl/Co1jJc"                                    // 66
    }                                                                                                                 // 67
  } else {                                                                                                            // 68
    return true;                                                                                                      // 69
  }                                                                                                                   // 70
};                                                                                                                    // 71
                                                                                                                      // 72
OplogCheck.disableOplog = function(cursorDescription) {                                                               // 73
  if(cursorDescription.options._disableOplog) {                                                                       // 74
    return {                                                                                                          // 75
      code: "DISABLE_OPLOG",                                                                                          // 76
      reason: "You've disable oplog for this cursor explicitly with _disableOplog option."                            // 77
    };                                                                                                                // 78
  } else {                                                                                                            // 79
    return true;                                                                                                      // 80
  }                                                                                                                   // 81
};                                                                                                                    // 82
                                                                                                                      // 83
// when creating Minimongo.Matcher object, if that's throws an exception                                              // 84
// meteor won't do the oplog support                                                                                  // 85
OplogCheck.miniMongoMatcher = function(cursorDescription) {                                                           // 86
  if(Minimongo.Matcher) {                                                                                             // 87
    try {                                                                                                             // 88
      var matcher = new Minimongo.Matcher(cursorDescription.selector);                                                // 89
      return true;                                                                                                    // 90
    } catch(ex) {                                                                                                     // 91
      return {                                                                                                        // 92
        code: "MINIMONGO_MATCHER_ERROR",                                                                              // 93
        reason: "There's something wrong in your mongo query: " +  ex.message,                                        // 94
        solution: "Check your selector and change it accordingly."                                                    // 95
      };                                                                                                              // 96
    }                                                                                                                 // 97
  } else {                                                                                                            // 98
    // If there is no Minimongo.Matcher, we don't need to check this                                                  // 99
    return true;                                                                                                      // 100
  }                                                                                                                   // 101
};                                                                                                                    // 102
                                                                                                                      // 103
OplogCheck.miniMongoSorter = function(cursorDescription) {                                                            // 104
  var matcher = new Minimongo.Matcher(cursorDescription.selector);                                                    // 105
  if(Minimongo.Sorter && cursorDescription.options.sort) {                                                            // 106
    try {                                                                                                             // 107
      var sorter = new Minimongo.Sorter(                                                                              // 108
        cursorDescription.options.sort,                                                                               // 109
        { matcher: matcher }                                                                                          // 110
      );                                                                                                              // 111
      return true;                                                                                                    // 112
    } catch(ex) {                                                                                                     // 113
      return {                                                                                                        // 114
        code: "MINIMONGO_SORTER_ERROR",                                                                               // 115
        reason: "Some of your sort specifiers are not supported: " + ex.message,                                      // 116
        solution: "Check your sort specifiers and chage them accordingly."                                            // 117
      }                                                                                                               // 118
    }                                                                                                                 // 119
  } else {                                                                                                            // 120
    return true;                                                                                                      // 121
  }                                                                                                                   // 122
};                                                                                                                    // 123
                                                                                                                      // 124
OplogCheck.fields = function(cursorDescription) {                                                                     // 125
  var options = cursorDescription.options;                                                                            // 126
  if(options.fields) {                                                                                                // 127
    try {                                                                                                             // 128
      LocalCollection._checkSupportedProjection(options.fields);                                                      // 129
      return true;                                                                                                    // 130
    } catch (e) {                                                                                                     // 131
      if (e.name === "MinimongoError") {                                                                              // 132
        return {                                                                                                      // 133
          code: "NOT_SUPPORTED_FIELDS",                                                                               // 134
          reason: "Some of the field filters are not supported: " + e.message,                                        // 135
          solution: "Try removing those field filters."                                                               // 136
        };                                                                                                            // 137
      } else {                                                                                                        // 138
        throw e;                                                                                                      // 139
      }                                                                                                               // 140
    }                                                                                                                 // 141
  }                                                                                                                   // 142
  return true;                                                                                                        // 143
};                                                                                                                    // 144
                                                                                                                      // 145
OplogCheck.skip = function(cursorDescription) {                                                                       // 146
  if(cursorDescription.options.skip) {                                                                                // 147
    return {                                                                                                          // 148
      code: "SKIP_NOT_SUPPORTED",                                                                                     // 149
      reason: "Skip does not support with oplog.",                                                                    // 150
      solution: "Try to avoid using skip. Use range queries instead: http://goo.gl/b522Av"                            // 151
    };                                                                                                                // 152
  }                                                                                                                   // 153
                                                                                                                      // 154
  return true;                                                                                                        // 155
};                                                                                                                    // 156
                                                                                                                      // 157
OplogCheck.where = function(cursorDescription) {                                                                      // 158
  var matcher = new Minimongo.Matcher(cursorDescription.selector);                                                    // 159
  if(matcher.hasWhere()) {                                                                                            // 160
    return {                                                                                                          // 161
      code: "WHERE_NOT_SUPPORTED",                                                                                    // 162
      reason: "Meteor does not support queries with $where.",                                                         // 163
      solution: "Try to remove $where from your query. Use some alternative."                                         // 164
    }                                                                                                                 // 165
  };                                                                                                                  // 166
                                                                                                                      // 167
  return true;                                                                                                        // 168
};                                                                                                                    // 169
                                                                                                                      // 170
OplogCheck.geo = function(cursorDescription) {                                                                        // 171
  var matcher = new Minimongo.Matcher(cursorDescription.selector);                                                    // 172
                                                                                                                      // 173
  if(matcher.hasGeoQuery()) {                                                                                         // 174
    return {                                                                                                          // 175
      code: "GEO_NOT_SUPPORTED",                                                                                      // 176
      reason: "Meteor does not support queries with geo partial operators.",                                          // 177
      solution: "Try to remove geo partial operators from your query if possible."                                    // 178
    }                                                                                                                 // 179
  };                                                                                                                  // 180
                                                                                                                      // 181
  return true;                                                                                                        // 182
};                                                                                                                    // 183
                                                                                                                      // 184
OplogCheck.limitButNoSort = function(cursorDescription) {                                                             // 185
  var options = cursorDescription.options;                                                                            // 186
                                                                                                                      // 187
  if((options.limit && !options.sort)) {                                                                              // 188
    return {                                                                                                          // 189
      code: "LIMIT_NO_SORT",                                                                                          // 190
      reason: "Meteor oplog implementation does not support limit without a sort specifier.",                         // 191
      solution: "Try adding a sort specifier."                                                                        // 192
    }                                                                                                                 // 193
  };                                                                                                                  // 194
                                                                                                                      // 195
  return true;                                                                                                        // 196
};                                                                                                                    // 197
                                                                                                                      // 198
OplogCheck.olderVersion = function(cursorDescription, driver) {                                                       // 199
  if(driver && !driver.constructor.cursorSupported) {                                                                 // 200
    return {                                                                                                          // 201
      code: "OLDER_VERSION",                                                                                          // 202
      reason: "Your Meteor version does not have oplog support.",                                                     // 203
      solution: "Upgrade your app to Meteor version 0.7.2 or later."                                                  // 204
    };                                                                                                                // 205
  }                                                                                                                   // 206
  return true;                                                                                                        // 207
};                                                                                                                    // 208
                                                                                                                      // 209
OplogCheck.gitCheckout = function(cursorDescription, driver) {                                                        // 210
  if(!Meteor.release) {                                                                                               // 211
    return {                                                                                                          // 212
      code: "GIT_CHECKOUT",                                                                                           // 213
      reason: "Seems like your Meteor version is based on a Git checkout and it doesn't have the oplog support.",     // 214
      solution: "Try to upgrade your Meteor version."                                                                 // 215
    };                                                                                                                // 216
  }                                                                                                                   // 217
  return true;                                                                                                        // 218
};                                                                                                                    // 219
                                                                                                                      // 220
var preRunningMatchers = [                                                                                            // 221
  OplogCheck.env,                                                                                                     // 222
  OplogCheck.disableOplog,                                                                                            // 223
  OplogCheck.miniMongoMatcher                                                                                         // 224
];                                                                                                                    // 225
                                                                                                                      // 226
var globalMatchers = [                                                                                                // 227
  OplogCheck.fields,                                                                                                  // 228
  OplogCheck.skip,                                                                                                    // 229
  OplogCheck.where,                                                                                                   // 230
  OplogCheck.geo,                                                                                                     // 231
  OplogCheck.limitButNoSort,                                                                                          // 232
  OplogCheck.miniMongoSorter,                                                                                         // 233
  OplogCheck.olderVersion,                                                                                            // 234
  OplogCheck.gitCheckout                                                                                              // 235
];                                                                                                                    // 236
                                                                                                                      // 237
var versionMatchers = [                                                                                               // 238
  [/^0\.7\.1/, OplogCheck._071],                                                                                      // 239
  [/^0\.7\.0/, OplogCheck._070],                                                                                      // 240
];                                                                                                                    // 241
                                                                                                                      // 242
Kadira.checkWhyNoOplog = function(cursorDescription, observerDriver) {                                                // 243
  if(typeof Minimongo == 'undefined') {                                                                               // 244
    return {                                                                                                          // 245
      code: "CANNOT_DETECT",                                                                                          // 246
      reason: "You are running an older Meteor version and Kadira can't check oplog state.",                          // 247
      solution: "Try updating your Meteor app"                                                                        // 248
    }                                                                                                                 // 249
  }                                                                                                                   // 250
                                                                                                                      // 251
  var result = runMatchers(preRunningMatchers, cursorDescription, observerDriver);                                    // 252
  if(result !== true) {                                                                                               // 253
    return result;                                                                                                    // 254
  }                                                                                                                   // 255
                                                                                                                      // 256
  var meteorVersion = Meteor.release;                                                                                 // 257
  for(var lc=0; lc<versionMatchers.length; lc++) {                                                                    // 258
    var matcherInfo = versionMatchers[lc];                                                                            // 259
    if(matcherInfo[0].test(meteorVersion)) {                                                                          // 260
      var matched = matcherInfo[1](cursorDescription, observerDriver);                                                // 261
      if(matched !== true) {                                                                                          // 262
        return matched;                                                                                               // 263
      }                                                                                                               // 264
    }                                                                                                                 // 265
  }                                                                                                                   // 266
                                                                                                                      // 267
  result = runMatchers(globalMatchers, cursorDescription, observerDriver);                                            // 268
  if(result !== true) {                                                                                               // 269
    return result;                                                                                                    // 270
  }                                                                                                                   // 271
                                                                                                                      // 272
  return {                                                                                                            // 273
    code: "OPLOG_SUPPORTED",                                                                                          // 274
    reason: "This query should support oplog. It's weird if it's not.",                                               // 275
    solution: "Please contact Kadira support and let's discuss."                                                      // 276
  };                                                                                                                  // 277
};                                                                                                                    // 278
                                                                                                                      // 279
function runMatchers(matcherList, cursorDescription, observerDriver) {                                                // 280
  for(var lc=0; lc<matcherList.length; lc++) {                                                                        // 281
    var matcher = matcherList[lc];                                                                                    // 282
    var matched = matcher(cursorDescription, observerDriver);                                                         // 283
    if(matched !== true) {                                                                                            // 284
      return matched;                                                                                                 // 285
    }                                                                                                                 // 286
  }                                                                                                                   // 287
  return true;                                                                                                        // 288
}                                                                                                                     // 289
                                                                                                                      // 290
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/tracer/tracer.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fibers = Npm.require('fibers');                                                                                   // 1
var eventLogger = Npm.require('debug')('kadira:tracer');                                                              // 2
var REPITITIVE_EVENTS = {'db': true, 'http': true, 'email': true, 'wait': true, 'async': true};                       // 3
                                                                                                                      // 4
Tracer = function Tracer() {                                                                                          // 5
  this._filters = [];                                                                                                 // 6
};                                                                                                                    // 7
                                                                                                                      // 8
//In the future, we might wan't to track inner fiber events too.                                                      // 9
//Then we can't serialize the object with methods                                                                     // 10
//That's why we use this method of returning the data                                                                 // 11
Tracer.prototype.start = function(session, msg) {                                                                     // 12
  var traceInfo = {                                                                                                   // 13
    _id: session.id + "::" + msg.id,                                                                                  // 14
    session: session.id,                                                                                              // 15
    userId: session.userId,                                                                                           // 16
    id: msg.id,                                                                                                       // 17
    events: []                                                                                                        // 18
  };                                                                                                                  // 19
                                                                                                                      // 20
  if(msg.msg == 'method') {                                                                                           // 21
    traceInfo.type = 'method';                                                                                        // 22
    traceInfo.name = msg.method;                                                                                      // 23
  } else if(msg.msg == 'sub') {                                                                                       // 24
    traceInfo.type = 'sub';                                                                                           // 25
    traceInfo.name = msg.name;                                                                                        // 26
  } else {                                                                                                            // 27
    return null;                                                                                                      // 28
  }                                                                                                                   // 29
                                                                                                                      // 30
  return traceInfo;                                                                                                   // 31
};                                                                                                                    // 32
                                                                                                                      // 33
Tracer.prototype.event = function(traceInfo, type, data) {                                                            // 34
  // do not allow to proceed, if already completed or errored                                                         // 35
  var lastEvent = this.getLastEvent(traceInfo);                                                                       // 36
  if(lastEvent && ['complete', 'error'].indexOf(lastEvent.type) >= 0) {                                               // 37
    return false;                                                                                                     // 38
  }                                                                                                                   // 39
                                                                                                                      // 40
  //expecting a end event                                                                                             // 41
  var eventId = true;                                                                                                 // 42
                                                                                                                      // 43
  //specially handling for repitivive events like db, http                                                            // 44
  if(REPITITIVE_EVENTS[type]) {                                                                                       // 45
    //can't accept a new start event                                                                                  // 46
    if(traceInfo._lastEventId) {                                                                                      // 47
      return false;                                                                                                   // 48
    }                                                                                                                 // 49
    eventId = traceInfo._lastEventId = DefaultUniqueId.get();                                                         // 50
  }                                                                                                                   // 51
                                                                                                                      // 52
  var event = {type: type, at: Ntp._now()};                                                                           // 53
  if(data) {                                                                                                          // 54
    event.data = this._applyFilters(type, data, "start");;                                                            // 55
  }                                                                                                                   // 56
                                                                                                                      // 57
  traceInfo.events.push(event);                                                                                       // 58
                                                                                                                      // 59
  eventLogger("%s %s", type, traceInfo._id);                                                                          // 60
  return eventId;                                                                                                     // 61
};                                                                                                                    // 62
                                                                                                                      // 63
Tracer.prototype.eventEnd = function(traceInfo, eventId, data) {                                                      // 64
  if(traceInfo._lastEventId && traceInfo._lastEventId == eventId) {                                                   // 65
    var lastEvent = this.getLastEvent(traceInfo);                                                                     // 66
    var type = lastEvent.type + 'end';                                                                                // 67
    var event = {type: type, at: Ntp._now()};                                                                         // 68
    if(data) {                                                                                                        // 69
      event.data = this._applyFilters(type, data, "end");;                                                            // 70
    }                                                                                                                 // 71
    traceInfo.events.push(event);                                                                                     // 72
    eventLogger("%s %s", type, traceInfo._id);                                                                        // 73
                                                                                                                      // 74
    traceInfo._lastEventId = null;                                                                                    // 75
    return true;                                                                                                      // 76
  } else {                                                                                                            // 77
    return false;                                                                                                     // 78
  }                                                                                                                   // 79
};                                                                                                                    // 80
                                                                                                                      // 81
Tracer.prototype.getLastEvent = function(traceInfo) {                                                                 // 82
  return traceInfo.events[traceInfo.events.length -1]                                                                 // 83
};                                                                                                                    // 84
                                                                                                                      // 85
Tracer.prototype.endLastEvent = function(traceInfo) {                                                                 // 86
  var lastEvent = this.getLastEvent(traceInfo);                                                                       // 87
  if(lastEvent && !/end$/.test(lastEvent.type)) {                                                                     // 88
    traceInfo.events.push({                                                                                           // 89
      type: lastEvent.type + 'end',                                                                                   // 90
      at: Ntp._now()                                                                                                  // 91
    });                                                                                                               // 92
    return true;                                                                                                      // 93
  }                                                                                                                   // 94
  return false;                                                                                                       // 95
};                                                                                                                    // 96
                                                                                                                      // 97
Tracer.prototype.buildTrace = function(traceInfo) {                                                                   // 98
  var firstEvent = traceInfo.events[0];                                                                               // 99
  var lastEvent = traceInfo.events[traceInfo.events.length - 1];                                                      // 100
  var processedEvents = [];                                                                                           // 101
                                                                                                                      // 102
  if(firstEvent.type != 'start') {                                                                                    // 103
    console.warn('Kadira: trace is not started yet');                                                                 // 104
    return null;                                                                                                      // 105
  } else if(lastEvent.type != 'complete' && lastEvent.type != 'error') {                                              // 106
    //trace is not completed or errored yet                                                                           // 107
    console.warn('Kadira: trace is not completed or errored yet');                                                    // 108
    return null;                                                                                                      // 109
  } else {                                                                                                            // 110
    //build the metrics                                                                                               // 111
    traceInfo.errored = lastEvent.type == 'error';                                                                    // 112
    traceInfo.at = firstEvent.at;                                                                                     // 113
                                                                                                                      // 114
    var metrics = {                                                                                                   // 115
      total: lastEvent.at - firstEvent.at,                                                                            // 116
    };                                                                                                                // 117
                                                                                                                      // 118
    var totalNonCompute = 0;                                                                                          // 119
                                                                                                                      // 120
    firstEvent = ['start', 0];                                                                                        // 121
    if(traceInfo.events[0].data) firstEvent.push(traceInfo.events[0].data);                                           // 122
    processedEvents.push(firstEvent);                                                                                 // 123
                                                                                                                      // 124
    for(var lc=1; lc < traceInfo.events.length - 1; lc += 2) {                                                        // 125
      var prevEventEnd = traceInfo.events[lc-1];                                                                      // 126
      var startEvent = traceInfo.events[lc];                                                                          // 127
      var endEvent = traceInfo.events[lc+1];                                                                          // 128
      var computeTime = startEvent.at - prevEventEnd.at;                                                              // 129
      if(computeTime > 0) processedEvents.push(['compute', computeTime]);                                             // 130
      if(!endEvent) {                                                                                                 // 131
        console.error('Kadira: no end event for type: ', startEvent.type);                                            // 132
        return null;                                                                                                  // 133
      } else if(endEvent.type != startEvent.type + 'end') {                                                           // 134
        console.error('Kadira: endevent type mismatch: ', startEvent.type, endEvent.type, JSON.stringify(traceInfo)); // 135
        return null;                                                                                                  // 136
      } else {                                                                                                        // 137
        var elapsedTimeForEvent = endEvent.at - startEvent.at                                                         // 138
        var currentEvent = [startEvent.type, elapsedTimeForEvent];                                                    // 139
        currentEvent.push(_.extend({}, startEvent.data, endEvent.data));                                              // 140
        processedEvents.push(currentEvent);                                                                           // 141
        metrics[startEvent.type] = metrics[startEvent.type] || 0;                                                     // 142
        metrics[startEvent.type] += elapsedTimeForEvent;                                                              // 143
        totalNonCompute += elapsedTimeForEvent;                                                                       // 144
      }                                                                                                               // 145
    }                                                                                                                 // 146
                                                                                                                      // 147
    computeTime = lastEvent.at - traceInfo.events[traceInfo.events.length - 2];                                       // 148
    if(computeTime > 0) processedEvents.push(['compute', computeTime]);                                               // 149
                                                                                                                      // 150
    var lastEventData = [lastEvent.type, 0];                                                                          // 151
    if(lastEvent.data) lastEventData.push(lastEvent.data);                                                            // 152
    processedEvents.push(lastEventData);                                                                              // 153
                                                                                                                      // 154
    metrics.compute = metrics.total - totalNonCompute;                                                                // 155
    traceInfo.metrics = metrics;                                                                                      // 156
    traceInfo.events = processedEvents;                                                                               // 157
    traceInfo.isEventsProcessed = true;                                                                               // 158
    return traceInfo;                                                                                                 // 159
  }                                                                                                                   // 160
};                                                                                                                    // 161
                                                                                                                      // 162
Tracer.prototype.addFilter = function(filterFn) {                                                                     // 163
  this._filters.push(filterFn);                                                                                       // 164
};                                                                                                                    // 165
                                                                                                                      // 166
Tracer.prototype._applyFilters = function(eventType, data) {                                                          // 167
  this._filters.forEach(function(filterFn) {                                                                          // 168
    data = filterFn(eventType, _.clone(data));                                                                        // 169
  });                                                                                                                 // 170
                                                                                                                      // 171
  return data;                                                                                                        // 172
};                                                                                                                    // 173
                                                                                                                      // 174
Kadira.tracer = new Tracer();                                                                                         // 175
// need to expose Tracer to provide default set of filters                                                            // 176
Kadira.Tracer = Tracer;                                                                                               // 177
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/tracer/default_filters.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// strip sensitive data sent to kadia engine.                                                                         // 1
// possible to limit types by providing an array of types to strip                                                    // 2
// possible types are: "start", "db", "http", "email"                                                                 // 3
Tracer.stripSensitive = function stripSensitive(typesToStrip) {                                                       // 4
  typesToStrip =  typesToStrip || [];                                                                                 // 5
                                                                                                                      // 6
  var allowedTypes = {};                                                                                              // 7
  typesToStrip.forEach(function(type) {                                                                               // 8
    allowedTypes[type] = true;                                                                                        // 9
  });                                                                                                                 // 10
                                                                                                                      // 11
  return function (type, data) {                                                                                      // 12
    if(typesToStrip.length > 0 && !allowedTypes[type]) return data;                                                   // 13
                                                                                                                      // 14
    if(type == "start") {                                                                                             // 15
      data.params = "[stripped]";                                                                                     // 16
    } else if(type == "db") {                                                                                         // 17
      data.selector = "[stripped]";                                                                                   // 18
    } else if(type == "http") {                                                                                       // 19
      data.url = "[stripped]";                                                                                        // 20
    } else if(type == "email") {                                                                                      // 21
      ["from", "to", "cc", "bcc", "replyTo"].forEach(function(item) {                                                 // 22
        if(data[item]) {                                                                                              // 23
          data[item] = "[stripped]";                                                                                  // 24
        }                                                                                                             // 25
      });                                                                                                             // 26
    }                                                                                                                 // 27
                                                                                                                      // 28
    return data;                                                                                                      // 29
  };                                                                                                                  // 30
};                                                                                                                    // 31
                                                                                                                      // 32
// strip selectors only from the given list of collection names                                                       // 33
Tracer.stripSelectors = function stripSelectors(collectionList) {                                                     // 34
  collectionList = collectionList || [];                                                                              // 35
                                                                                                                      // 36
  var collMap = {};                                                                                                   // 37
  collectionList.forEach(function(collName) {                                                                         // 38
    collMap[collName] = true;                                                                                         // 39
  });                                                                                                                 // 40
                                                                                                                      // 41
  return function(type, data) {                                                                                       // 42
    if(type == "db" && data && collMap[data.coll]) {                                                                  // 43
      data.selector = "[stripped]";                                                                                   // 44
    }                                                                                                                 // 45
                                                                                                                      // 46
    return data;                                                                                                      // 47
  };                                                                                                                  // 48
}                                                                                                                     // 49
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/tracer/tracer_store.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var logger = Npm.require('debug')('kadira:ts');                                                                       // 1
                                                                                                                      // 2
TracerStore = function TracerStore(options) {                                                                         // 3
  options = options || {};                                                                                            // 4
                                                                                                                      // 5
  this.maxTotalPoints = options.maxTotalPoints || 30;                                                                 // 6
  this.interval = options.interval || 1000 * 60;                                                                      // 7
  this.archiveEvery = options.archiveEvery || this.maxTotalPoints / 6;                                                // 8
                                                                                                                      // 9
  //store max total on the past 30 minutes (or past 30 items)                                                         // 10
  this.maxTotals = {};                                                                                                // 11
  //store the max trace of the current interval                                                                       // 12
  this.currentMaxTrace = {};                                                                                          // 13
  //archive for the traces                                                                                            // 14
  this.traceArchive = [];                                                                                             // 15
                                                                                                                      // 16
  this.processedCnt = {};                                                                                             // 17
                                                                                                                      // 18
  //group errors by messages between an interval                                                                      // 19
  this.errorMap = {};                                                                                                 // 20
};                                                                                                                    // 21
                                                                                                                      // 22
TracerStore.prototype.addTrace = function(trace) {                                                                    // 23
  var kind = [trace.type, trace.name].join('::');                                                                     // 24
  if(!this.currentMaxTrace[kind]) {                                                                                   // 25
    this.currentMaxTrace[kind] = EJSON.clone(trace);                                                                  // 26
  } else if(this.currentMaxTrace[kind].metrics.total < trace.metrics.total) {                                         // 27
    this.currentMaxTrace[kind] = EJSON.clone(trace);                                                                  // 28
  } else if(trace.errored) {                                                                                          // 29
    this._handleErrors(trace);                                                                                        // 30
  }                                                                                                                   // 31
};                                                                                                                    // 32
                                                                                                                      // 33
TracerStore.prototype.collectTraces = function() {                                                                    // 34
  var traces = this.traceArchive;                                                                                     // 35
  this.traceArchive = [];                                                                                             // 36
                                                                                                                      // 37
  // convert at(timestamp) into the actual serverTime                                                                 // 38
  traces.forEach(function(trace) {                                                                                    // 39
    trace.at = Kadira.syncedDate.syncTime(trace.at);                                                                  // 40
  });                                                                                                                 // 41
  return traces;                                                                                                      // 42
};                                                                                                                    // 43
                                                                                                                      // 44
TracerStore.prototype.start = function() {                                                                            // 45
  this._timeoutHandler = setInterval(this.processTraces.bind(this), this.interval);                                   // 46
};                                                                                                                    // 47
                                                                                                                      // 48
TracerStore.prototype.stop = function() {                                                                             // 49
  if(this._timeoutHandler) {                                                                                          // 50
    clearInterval(this._timeoutHandler);                                                                              // 51
  }                                                                                                                   // 52
};                                                                                                                    // 53
                                                                                                                      // 54
TracerStore.prototype._handleErrors = function(trace) {                                                               // 55
  // sending error requests as it is                                                                                  // 56
  var lastEvent = trace.events[trace.events.length -1];                                                               // 57
  if(lastEvent && lastEvent[2]) {                                                                                     // 58
    var error = lastEvent[2].error;                                                                                   // 59
                                                                                                                      // 60
    // grouping errors occured (reset after processTraces)                                                            // 61
    var errorKey = [trace.type, trace.name, error.message].join("::");                                                // 62
    if(!this.errorMap[errorKey]) {                                                                                    // 63
      var erroredTrace = EJSON.clone(trace);                                                                          // 64
      this.errorMap[errorKey] = erroredTrace;                                                                         // 65
                                                                                                                      // 66
      this.traceArchive.push(erroredTrace);                                                                           // 67
    }                                                                                                                 // 68
  } else {                                                                                                            // 69
    logger('last events is not an error: ', JSON.stringify(trace.events));                                            // 70
  }                                                                                                                   // 71
};                                                                                                                    // 72
                                                                                                                      // 73
TracerStore.prototype.processTraces = function() {                                                                    // 74
  var self = this;                                                                                                    // 75
  var kinds = _.union(                                                                                                // 76
    _.keys(this.maxTotals),                                                                                           // 77
    _.keys(this.currentMaxTrace)                                                                                      // 78
  );                                                                                                                  // 79
                                                                                                                      // 80
  kinds.forEach(function(kind) {                                                                                      // 81
    self.processedCnt[kind] = self.processedCnt[kind] || 0;                                                           // 82
    var currentMaxTrace = self.currentMaxTrace[kind];                                                                 // 83
    var currentMaxTotal = currentMaxTrace? currentMaxTrace.metrics.total : 0;                                         // 84
                                                                                                                      // 85
    self.maxTotals[kind] = self.maxTotals[kind] || [];                                                                // 86
    //add the current maxPoint                                                                                        // 87
    self.maxTotals[kind].push(currentMaxTotal);                                                                       // 88
    var exceedingPoints = self.maxTotals[kind].length - self.maxTotalPoints;                                          // 89
    if(exceedingPoints > 0) {                                                                                         // 90
      self.maxTotals[kind].splice(0, exceedingPoints);                                                                // 91
    }                                                                                                                 // 92
                                                                                                                      // 93
    var archiveDefault = (self.processedCnt[kind] % self.archiveEvery) == 0;                                          // 94
    self.processedCnt[kind]++;                                                                                        // 95
                                                                                                                      // 96
    var canArchive = archiveDefault                                                                                   // 97
      || self._isTraceOutlier(kind, currentMaxTrace);                                                                 // 98
                                                                                                                      // 99
    if(canArchive && currentMaxTrace) {                                                                               // 100
      self.traceArchive.push(currentMaxTrace);                                                                        // 101
    }                                                                                                                 // 102
                                                                                                                      // 103
    //reset currentMaxTrace                                                                                           // 104
    self.currentMaxTrace[kind] = null;                                                                                // 105
  });                                                                                                                 // 106
                                                                                                                      // 107
  //reset the errorMap                                                                                                // 108
  self.errorMap = {};                                                                                                 // 109
};                                                                                                                    // 110
                                                                                                                      // 111
TracerStore.prototype._isTraceOutlier = function(kind, trace) {                                                       // 112
  if(trace) {                                                                                                         // 113
    var dataSet = this.maxTotals[kind];                                                                               // 114
    return this._isOutlier(dataSet, trace.metrics.total, 3);                                                          // 115
  } else {                                                                                                            // 116
    return false;                                                                                                     // 117
  }                                                                                                                   // 118
};                                                                                                                    // 119
                                                                                                                      // 120
/*                                                                                                                    // 121
  Data point must exists in the dataSet                                                                               // 122
*/                                                                                                                    // 123
TracerStore.prototype._isOutlier = function(dataSet, dataPoint, maxMadZ) {                                            // 124
  var median = this._getMedian(dataSet);                                                                              // 125
  var mad = this._calculateMad(dataSet, median);                                                                      // 126
  var madZ = this._funcMedianDeviation(median)(dataPoint) / mad;                                                      // 127
                                                                                                                      // 128
  return madZ > maxMadZ;                                                                                              // 129
};                                                                                                                    // 130
                                                                                                                      // 131
TracerStore.prototype._getMedian = function(dataSet) {                                                                // 132
  var sortedDataSet = _.clone(dataSet).sort(function(a, b) {                                                          // 133
    return a-b;                                                                                                       // 134
  });                                                                                                                 // 135
  return this._pickQuartile(sortedDataSet, 2);                                                                        // 136
};                                                                                                                    // 137
                                                                                                                      // 138
TracerStore.prototype._pickQuartile = function(dataSet, num) {                                                        // 139
  var pos = ((dataSet.length + 1) * num) / 4;                                                                         // 140
  if(pos % 1 == 0) {                                                                                                  // 141
    return dataSet[pos -1];                                                                                           // 142
  } else {                                                                                                            // 143
    pos = pos - (pos % 1);                                                                                            // 144
    return (dataSet[pos -1] + dataSet[pos])/2                                                                         // 145
  }                                                                                                                   // 146
};                                                                                                                    // 147
                                                                                                                      // 148
TracerStore.prototype._calculateMad = function(dataSet, median) {                                                     // 149
  var medianDeviations = _.map(dataSet, this._funcMedianDeviation(median));                                           // 150
  var mad = this._getMedian(medianDeviations);                                                                        // 151
                                                                                                                      // 152
  return mad;                                                                                                         // 153
};                                                                                                                    // 154
                                                                                                                      // 155
TracerStore.prototype._funcMedianDeviation = function(median) {                                                       // 156
  return function(x) {                                                                                                // 157
    return Math.abs(median - x);                                                                                      // 158
  };                                                                                                                  // 159
};                                                                                                                    // 160
                                                                                                                      // 161
TracerStore.prototype._getMean = function(dataPoints) {                                                               // 162
  if(dataPoints.length > 0) {                                                                                         // 163
    var total = 0;                                                                                                    // 164
    dataPoints.forEach(function(point) {                                                                              // 165
      total += point;                                                                                                 // 166
    });                                                                                                               // 167
    return total/dataPoints.length;                                                                                   // 168
  } else {                                                                                                            // 169
    return 0;                                                                                                         // 170
  }                                                                                                                   // 171
};                                                                                                                    // 172
                                                                                                                      // 173
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/wrap_server.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 1
                                                                                                                      // 2
wrapServer = function(serverProto) {                                                                                  // 3
  var originalHandleConnect = serverProto._handleConnect                                                              // 4
  serverProto._handleConnect = function(socket, msg) {                                                                // 5
    originalHandleConnect.call(this, socket, msg);                                                                    // 6
    var session = socket._meteorSession;                                                                              // 7
    // sometimes it is possible for _meteorSession to be undefined                                                    // 8
    // one such reason would be if DDP versions are not matching                                                      // 9
    // if then, we should not process it                                                                              // 10
    if(Kadira.connected && session) {                                                                                 // 11
      Kadira.models.system.handleSessionActivity(msg, socket._meteorSession);                                         // 12
    }                                                                                                                 // 13
  };                                                                                                                  // 14
};                                                                                                                    // 15
                                                                                                                      // 16
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/wrap_session.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
wrapSession = function(sessionProto) {                                                                                // 1
  var originalProcessMessage = sessionProto.processMessage;                                                           // 2
  sessionProto.processMessage = function(msg) {                                                                       // 3
    if(Kadira.connected) {                                                                                            // 4
      var kadiraInfo = {                                                                                              // 5
        session: this.id,                                                                                             // 6
        userId: this.userId                                                                                           // 7
      };                                                                                                              // 8
                                                                                                                      // 9
      if(msg.msg == 'method' || msg.msg == 'sub') {                                                                   // 10
        kadiraInfo.trace = Kadira.tracer.start(this, msg);                                                            // 11
        Kadira.waitTimeBuilder.register(this, msg.id);                                                                // 12
                                                                                                                      // 13
        //use JSON stringify to save the CPU                                                                          // 14
        var startData = { userId: this.userId, params: JSON.stringify(msg.params) };                                  // 15
        Kadira.tracer.event(kadiraInfo.trace, 'start', startData);                                                    // 16
        var waitEventId = Kadira.tracer.event(kadiraInfo.trace, 'wait', {}, kadiraInfo);                              // 17
        msg._waitEventId = waitEventId;                                                                               // 18
        msg.__kadiraInfo = kadiraInfo;                                                                                // 19
                                                                                                                      // 20
        if(msg.msg == 'sub') {                                                                                        // 21
          // start tracking inside processMessage allows us to indicate                                               // 22
          // wait time as well                                                                                        // 23
          Kadira.models.pubsub._trackSub(this, msg);                                                                  // 24
        }                                                                                                             // 25
      }                                                                                                               // 26
                                                                                                                      // 27
      // Update session last active time                                                                              // 28
      Kadira.models.system.handleSessionActivity(msg, this);                                                          // 29
    }                                                                                                                 // 30
                                                                                                                      // 31
    return originalProcessMessage.call(this, msg);                                                                    // 32
  };                                                                                                                  // 33
                                                                                                                      // 34
  //adding the method context to the current fiber                                                                    // 35
  var originalMethodHandler = sessionProto.protocol_handlers.method;                                                  // 36
  sessionProto.protocol_handlers.method = function(msg, unblock) {                                                    // 37
    var self = this;                                                                                                  // 38
    //add context                                                                                                     // 39
    var kadiraInfo = msg.__kadiraInfo;                                                                                // 40
    if(kadiraInfo) {                                                                                                  // 41
      Kadira._setInfo(kadiraInfo);                                                                                    // 42
                                                                                                                      // 43
      // end wait event                                                                                               // 44
      var waitList = Kadira.waitTimeBuilder.build(this, msg.id);                                                      // 45
      Kadira.tracer.eventEnd(kadiraInfo.trace, msg._waitEventId, {waitOn: waitList});                                 // 46
                                                                                                                      // 47
      unblock = Kadira.waitTimeBuilder.trackWaitTime(this, msg, unblock);                                             // 48
      var response = Kadira.env.kadiraInfo.withValue(kadiraInfo, function () {                                        // 49
        return originalMethodHandler.call(self, msg, unblock);                                                        // 50
      });                                                                                                             // 51
      unblock();                                                                                                      // 52
    } else {                                                                                                          // 53
      var response = originalMethodHandler.call(self, msg, unblock);                                                  // 54
    }                                                                                                                 // 55
                                                                                                                      // 56
    return response;                                                                                                  // 57
  };                                                                                                                  // 58
                                                                                                                      // 59
  //to capture the currently processing message                                                                       // 60
  var orginalSubHandler = sessionProto.protocol_handlers.sub;                                                         // 61
  sessionProto.protocol_handlers.sub = function(msg, unblock) {                                                       // 62
    var self = this;                                                                                                  // 63
    //add context                                                                                                     // 64
    var kadiraInfo = msg.__kadiraInfo;                                                                                // 65
    if(kadiraInfo) {                                                                                                  // 66
      Kadira._setInfo(kadiraInfo);                                                                                    // 67
                                                                                                                      // 68
      // end wait event                                                                                               // 69
      var waitList = Kadira.waitTimeBuilder.build(this, msg.id);                                                      // 70
      Kadira.tracer.eventEnd(kadiraInfo.trace, msg._waitEventId, {waitOn: waitList});                                 // 71
                                                                                                                      // 72
      unblock = Kadira.waitTimeBuilder.trackWaitTime(this, msg, unblock);                                             // 73
      var response = Kadira.env.kadiraInfo.withValue(kadiraInfo, function () {                                        // 74
        return orginalSubHandler.call(self, msg, unblock);                                                            // 75
      });                                                                                                             // 76
      unblock();                                                                                                      // 77
    } else {                                                                                                          // 78
      var response = orginalSubHandler.call(self, msg, unblock);                                                      // 79
    }                                                                                                                 // 80
                                                                                                                      // 81
    return response;                                                                                                  // 82
  };                                                                                                                  // 83
                                                                                                                      // 84
  //to capture the currently processing message                                                                       // 85
  var orginalUnSubHandler = sessionProto.protocol_handlers.unsub;                                                     // 86
  sessionProto.protocol_handlers.unsub = function(msg, unblock) {                                                     // 87
    unblock = Kadira.waitTimeBuilder.trackWaitTime(this, msg, unblock);                                               // 88
    var response = orginalUnSubHandler.call(this, msg, unblock);                                                      // 89
    unblock();                                                                                                        // 90
    return response;                                                                                                  // 91
  };                                                                                                                  // 92
                                                                                                                      // 93
  //track method ending (to get the result of error)                                                                  // 94
  var originalSend = sessionProto.send;                                                                               // 95
  sessionProto.send = function(msg) {                                                                                 // 96
    if(msg.msg == 'result') {                                                                                         // 97
      var kadiraInfo = Kadira._getInfo();                                                                             // 98
      if(kadiraInfo) {                                                                                                // 99
        if(msg.error) {                                                                                               // 100
          var error = _.pick(msg.error, ['message', 'stack']);                                                        // 101
                                                                                                                      // 102
          // pick the error from the wrapped method handler                                                           // 103
          if(kadiraInfo && kadiraInfo.currentError) {                                                                 // 104
            // the error stack is wrapped so Meteor._debug can identify                                               // 105
            // this as a method error.                                                                                // 106
            error = _.pick(kadiraInfo.currentError, ['message', 'stack']);                                            // 107
            // see wrapMethodHanderForErrors() method def for more info                                               // 108
            if(error.stack && error.stack.stack) {                                                                    // 109
              error.stack = error.stack.stack;                                                                        // 110
            }                                                                                                         // 111
          }                                                                                                           // 112
                                                                                                                      // 113
          Kadira.tracer.endLastEvent(kadiraInfo.trace);                                                               // 114
          Kadira.tracer.event(kadiraInfo.trace, 'error', {error: error});                                             // 115
        } else {                                                                                                      // 116
          var isForced = Kadira.tracer.endLastEvent(kadiraInfo.trace);                                                // 117
          if (isForced) {                                                                                             // 118
            console.warn('Kadira endevent forced complete', JSON.stringify(kadiraInfo.trace.events));                 // 119
          };                                                                                                          // 120
          Kadira.tracer.event(kadiraInfo.trace, 'complete');                                                          // 121
        }                                                                                                             // 122
                                                                                                                      // 123
        //processing the message                                                                                      // 124
        var trace = Kadira.tracer.buildTrace(kadiraInfo.trace);                                                       // 125
        Kadira.models.methods.processMethod(trace);                                                                   // 126
                                                                                                                      // 127
        // error may or may not exist and error tracking can be disabled                                              // 128
        if(error && Kadira.options.enableErrorTracking) {                                                             // 129
          Kadira.models.error.trackError(error, trace);                                                               // 130
        }                                                                                                             // 131
                                                                                                                      // 132
        //clean and make sure, fiber is clean                                                                         // 133
        //not sure we need to do this, but a preventive measure                                                       // 134
        Kadira._setInfo(null);                                                                                        // 135
      }                                                                                                               // 136
    }                                                                                                                 // 137
                                                                                                                      // 138
    return originalSend.call(this, msg);                                                                              // 139
  };                                                                                                                  // 140
};                                                                                                                    // 141
                                                                                                                      // 142
// wrap existing method handlers for capturing errors                                                                 // 143
_.each(Meteor.default_server.method_handlers, function(handler, name) {                                               // 144
  wrapMethodHanderForErrors(name, handler, Meteor.default_server.method_handlers);                                    // 145
});                                                                                                                   // 146
                                                                                                                      // 147
// wrap future method handlers for capturing errors                                                                   // 148
var originalMeteorMethods = Meteor.methods;                                                                           // 149
Meteor.methods = function(methodMap) {                                                                                // 150
  _.each(methodMap, function(handler, name) {                                                                         // 151
    wrapMethodHanderForErrors(name, handler, methodMap);                                                              // 152
  });                                                                                                                 // 153
  originalMeteorMethods(methodMap);                                                                                   // 154
};                                                                                                                    // 155
                                                                                                                      // 156
                                                                                                                      // 157
function wrapMethodHanderForErrors(name, originalHandler, methodMap) {                                                // 158
  methodMap[name] = function() {                                                                                      // 159
    try{                                                                                                              // 160
      return originalHandler.apply(this, arguments);                                                                  // 161
    } catch(ex) {                                                                                                     // 162
      if(Kadira._getInfo()) {                                                                                         // 163
        // Now we are marking this error to get tracked via methods                                                   // 164
        // But, this also triggers a Meteor.debug call and                                                            // 165
        // it only gets the stack                                                                                     // 166
        // We also track Meteor.debug errors and want to stop                                                         // 167
        // tracking this error. That's why we do this                                                                 // 168
        // See Meteor.debug error tracking code for more                                                              // 169
        ex.stack = {stack: ex.stack, source: 'method'};                                                               // 170
        Kadira._getInfo().currentError = ex;                                                                          // 171
      }                                                                                                               // 172
      throw ex;                                                                                                       // 173
    }                                                                                                                 // 174
  }                                                                                                                   // 175
}                                                                                                                     // 176
                                                                                                                      // 177
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/wrap_subscription.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 1
                                                                                                                      // 2
wrapSubscription = function(subscriptionProto) {                                                                      // 3
  // If the ready event runs outside the Fiber, Kadira._getInfo() doesn't work.                                       // 4
  // we need some other way to store kadiraInfo so we can use it at ready hijack.                                     // 5
  var originalRunHandler = subscriptionProto._runHandler;                                                             // 6
  subscriptionProto._runHandler = function() {                                                                        // 7
    var kadiraInfo = Kadira._getInfo();                                                                               // 8
    if (kadiraInfo) {                                                                                                 // 9
      this.__kadiraInfo = kadiraInfo;                                                                                 // 10
    };                                                                                                                // 11
    originalRunHandler.call(this);                                                                                    // 12
  }                                                                                                                   // 13
                                                                                                                      // 14
  var originalReady = subscriptionProto.ready;                                                                        // 15
  subscriptionProto.ready = function() {                                                                              // 16
    // meteor has a field called `_ready` which tracks this                                                           // 17
    // but we need to make it future proof                                                                            // 18
    if(!this._apmReadyTracked) {                                                                                      // 19
      var kadiraInfo = Kadira._getInfo() || this.__kadiraInfo;                                                        // 20
      delete this.__kadiraInfo;                                                                                       // 21
      //sometime .ready can be called in the context of the method                                                    // 22
      //then we have some problems, that's why we are checking this                                                   // 23
      //eg:- Accounts.createUser                                                                                      // 24
      if(kadiraInfo && this._subscriptionId == kadiraInfo.trace.id) {                                                 // 25
        var isForced = Kadira.tracer.endLastEvent(kadiraInfo.trace);                                                  // 26
        if (isForced) {                                                                                               // 27
          console.warn('Kadira endevent forced complete', JSON.stringify(kadiraInfo.trace.events));                   // 28
        };                                                                                                            // 29
        Kadira.tracer.event(kadiraInfo.trace, 'complete');                                                            // 30
        var trace = Kadira.tracer.buildTrace(kadiraInfo.trace);                                                       // 31
      }                                                                                                               // 32
                                                                                                                      // 33
      Kadira.models.pubsub._trackReady(this._session, this, trace);                                                   // 34
      this._apmReadyTracked = true;                                                                                   // 35
    }                                                                                                                 // 36
                                                                                                                      // 37
    // we still pass the control to the original implementation                                                       // 38
    // since multiple ready calls are handled by itself                                                               // 39
    originalReady.call(this);                                                                                         // 40
  };                                                                                                                  // 41
                                                                                                                      // 42
  var originalError = subscriptionProto.error;                                                                        // 43
  subscriptionProto.error = function(err) {                                                                           // 44
    var kadiraInfo = Kadira._getInfo();                                                                               // 45
                                                                                                                      // 46
    if(kadiraInfo && this._subscriptionId == kadiraInfo.trace.id) {                                                   // 47
      Kadira.tracer.endLastEvent(kadiraInfo.trace);                                                                   // 48
                                                                                                                      // 49
      var errorForApm = _.pick(err, 'message', 'stack');                                                              // 50
      Kadira.tracer.event(kadiraInfo.trace, 'error', {error: errorForApm});                                           // 51
      var trace = Kadira.tracer.buildTrace(kadiraInfo.trace);                                                         // 52
                                                                                                                      // 53
      Kadira.models.pubsub._trackError(this._session, this, trace);                                                   // 54
                                                                                                                      // 55
      // error tracking can be disabled and if there is a trace                                                       // 56
      // trace should be avaialble all the time, but it won't                                                         // 57
      // if something wrong happened on the trace building                                                            // 58
      if(Kadira.options.enableErrorTracking && trace) {                                                               // 59
        Kadira.models.error.trackError(err, trace);                                                                   // 60
      }                                                                                                               // 61
    }                                                                                                                 // 62
                                                                                                                      // 63
    // wrap error stack so Meteor._debug can identify and ignore it                                                   // 64
    err.stack = {stack: err.stack, source: 'subscription'};                                                           // 65
    originalError.call(this, err);                                                                                    // 66
  };                                                                                                                  // 67
                                                                                                                      // 68
  var originalDeactivate = subscriptionProto._deactivate;                                                             // 69
  subscriptionProto._deactivate = function() {                                                                        // 70
    Kadira.models.pubsub._trackUnsub(this._session, this);                                                            // 71
    originalDeactivate.call(this);                                                                                    // 72
  };                                                                                                                  // 73
                                                                                                                      // 74
  //adding the currenSub env variable                                                                                 // 75
  ['added', 'changed', 'removed'].forEach(function(funcName) {                                                        // 76
    var originalFunc = subscriptionProto[funcName];                                                                   // 77
    subscriptionProto[funcName] = function(collectionName, id, fields) {                                              // 78
      var self = this;                                                                                                // 79
                                                                                                                      // 80
      //we need to run this code in a fiber and that's how we track                                                   // 81
      //subscription info. May be we can figure out, some other way to do this                                        // 82
      Kadira.env.currentSub = self;                                                                                   // 83
      var res = originalFunc.call(self, collectionName, id, fields);                                                  // 84
      Kadira.env.currentSub = null;                                                                                   // 85
                                                                                                                      // 86
      return res;                                                                                                     // 87
    };                                                                                                                // 88
  });                                                                                                                 // 89
};                                                                                                                    // 90
                                                                                                                      // 91
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/wrap_observers.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
wrapOplogObserveDriver = function(proto) {                                                                            // 1
  var originalRunQuery = proto._runQuery;                                                                             // 2
  proto._runQuery = function() {                                                                                      // 3
    var start = Date.now();                                                                                           // 4
    originalRunQuery.call(this);                                                                                      // 5
    this._lastPollTime = Date.now() - start;                                                                          // 6
  };                                                                                                                  // 7
                                                                                                                      // 8
  var originalStop = proto.stop;                                                                                      // 9
  proto.stop = function() {                                                                                           // 10
    if(this._ownerInfo && this._ownerInfo.type === 'sub') {                                                           // 11
      Kadira.models.pubsub.trackDeletedObserver(this._ownerInfo);                                                     // 12
    }                                                                                                                 // 13
                                                                                                                      // 14
    return originalStop.call(this);                                                                                   // 15
  };                                                                                                                  // 16
};                                                                                                                    // 17
                                                                                                                      // 18
wrapPollingObserveDriver = function(proto) {                                                                          // 19
  var originalPollMongo = proto._pollMongo;                                                                           // 20
  proto._pollMongo = function() {                                                                                     // 21
    var start = Date.now();                                                                                           // 22
    originalPollMongo.call(this);                                                                                     // 23
    this._lastPollTime = Date.now() - start;                                                                          // 24
  };                                                                                                                  // 25
                                                                                                                      // 26
  var originalStop = proto.stop;                                                                                      // 27
  proto.stop = function() {                                                                                           // 28
    if(this._ownerInfo && this._ownerInfo.type === 'sub') {                                                           // 29
      Kadira.models.pubsub.trackDeletedObserver(this._ownerInfo);                                                     // 30
    }                                                                                                                 // 31
                                                                                                                      // 32
    return originalStop.call(this);                                                                                   // 33
  };                                                                                                                  // 34
};                                                                                                                    // 35
                                                                                                                      // 36
wrapMultiplexer = function(proto) {                                                                                   // 37
  var originalInitalAdd = proto.addHandleAndSendInitialAdds;                                                          // 38
   proto.addHandleAndSendInitialAdds = function(handle) {                                                             // 39
    if(!this._firstInitialAddTime) {                                                                                  // 40
      this._firstInitialAddTime = Date.now();                                                                         // 41
    }                                                                                                                 // 42
                                                                                                                      // 43
    handle._wasMultiplexerReady = this._ready();                                                                      // 44
    handle._queueLength = this._queue._taskHandles.length;                                                            // 45
                                                                                                                      // 46
    if(!handle._wasMultiplexerReady) {                                                                                // 47
      handle._elapsedPollingTime = Date.now() - this._firstInitialAddTime;                                            // 48
    }                                                                                                                 // 49
    return originalInitalAdd.call(this, handle);                                                                      // 50
  };                                                                                                                  // 51
};                                                                                                                    // 52
                                                                                                                      // 53
wrapForCountingObservers = function() {                                                                               // 54
  // to count observers                                                                                               // 55
  var mongoConnectionProto = MeteorX.MongoConnection.prototype;                                                       // 56
  var originalObserveChanges = mongoConnectionProto._observeChanges;                                                  // 57
  mongoConnectionProto._observeChanges = function(cursorDescription, ordered, callbacks) {                            // 58
    var ret = originalObserveChanges.call(this, cursorDescription, ordered, callbacks);                               // 59
    // get the Kadira Info via the Meteor.EnvironmentalVariable                                                       // 60
    var kadiraInfo = Kadira._getInfo(null, true);                                                                     // 61
                                                                                                                      // 62
    if(kadiraInfo && ret._multiplexer) {                                                                              // 63
      if(!ret._multiplexer.__kadiraTracked) {                                                                         // 64
        // new multiplexer                                                                                            // 65
        ret._multiplexer.__kadiraTracked = true;                                                                      // 66
        Kadira.models.pubsub.incrementHandleCount(kadiraInfo.trace, false);                                           // 67
        if(kadiraInfo.trace.type == 'sub') {                                                                          // 68
          var ownerInfo = {                                                                                           // 69
            type: kadiraInfo.trace.type,                                                                              // 70
            name: kadiraInfo.trace.name,                                                                              // 71
          };                                                                                                          // 72
                                                                                                                      // 73
          var observerDriver = ret._multiplexer._observeDriver;                                                       // 74
          observerDriver._ownerInfo = ownerInfo;                                                                      // 75
          Kadira.models.pubsub.trackCreatedObserver(ownerInfo);                                                       // 76
        }                                                                                                             // 77
      } else {                                                                                                        // 78
        Kadira.models.pubsub.incrementHandleCount(kadiraInfo.trace, true);                                            // 79
      }                                                                                                               // 80
    }                                                                                                                 // 81
                                                                                                                      // 82
    return ret;                                                                                                       // 83
  }                                                                                                                   // 84
};                                                                                                                    // 85
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/session.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var logger = Npm.require('debug')('kadira:hijack:session');                                                           // 1
                                                                                                                      // 2
Kadira._startInstrumenting = function(callback) {                                                                     // 3
  MeteorX.onReady(function() {                                                                                        // 4
    //instrumenting session                                                                                           // 5
    wrapServer(MeteorX.Server.prototype);                                                                             // 6
    wrapSession(MeteorX.Session.prototype);                                                                           // 7
    wrapSubscription(MeteorX.Subscription.prototype);                                                                 // 8
                                                                                                                      // 9
    if(MeteorX.MongoOplogDriver) {                                                                                    // 10
      wrapOplogObserveDriver(MeteorX.MongoOplogDriver.prototype);                                                     // 11
    }                                                                                                                 // 12
                                                                                                                      // 13
    if(MeteorX.MongoPollingDriver) {                                                                                  // 14
      wrapPollingObserveDriver(MeteorX.MongoPollingDriver.prototype);                                                 // 15
    }                                                                                                                 // 16
                                                                                                                      // 17
    if(MeteorX.Multiplexer) {                                                                                         // 18
      wrapMultiplexer(MeteorX.Multiplexer.prototype);                                                                 // 19
    }                                                                                                                 // 20
                                                                                                                      // 21
    wrapForCountingObservers();                                                                                       // 22
    hijackDBOps();                                                                                                    // 23
                                                                                                                      // 24
    setLabels();                                                                                                      // 25
    callback();                                                                                                       // 26
  });                                                                                                                 // 27
};                                                                                                                    // 28
                                                                                                                      // 29
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/db.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// This hijack is important to make sure, collections created before                                                  // 1
// we hijack dbOps, even gets tracked.                                                                                // 2
//  Meteor does not simply expose MongoConnection object to the client                                                // 3
//  It picks methods which are necessory and make a binded object and                                                 // 4
//  assigned to the Mongo.Collection                                                                                  // 5
//  so, even we updated prototype, we can't track those collections                                                   // 6
//  but, this will fix it.                                                                                            // 7
var originalOpen = MongoInternals.RemoteCollectionDriver.prototype.open;                                              // 8
MongoInternals.RemoteCollectionDriver.prototype.open = function open(name) {                                          // 9
  var self = this;                                                                                                    // 10
  var ret = originalOpen.call(self, name);                                                                            // 11
                                                                                                                      // 12
  _.each(ret, function(fn, m) {                                                                                       // 13
    // make sure, it's in the actual mongo connection object                                                          // 14
    // meteorhacks:mongo-collection-utils package add some arbitary methods                                           // 15
    // which does not exist in the mongo connection                                                                   // 16
    if(self.mongo[m]) {                                                                                               // 17
      ret[m] = function() {                                                                                           // 18
        Array.prototype.unshift.call(arguments, name);                                                                // 19
        return OptimizedApply(self.mongo, self.mongo[m], arguments);                                                  // 20
      };                                                                                                              // 21
    }                                                                                                                 // 22
  });                                                                                                                 // 23
                                                                                                                      // 24
  return ret;                                                                                                         // 25
};                                                                                                                    // 26
                                                                                                                      // 27
hijackDBOps = function hijackDBOps() {                                                                                // 28
  var mongoConnectionProto = MeteorX.MongoConnection.prototype;                                                       // 29
  //findOne is handled by find - so no need to track it                                                               // 30
  //upsert is handles by update                                                                                       // 31
  ['find', 'update', 'remove', 'insert', '_ensureIndex', '_dropIndex'].forEach(function(func) {                       // 32
    var originalFunc = mongoConnectionProto[func];                                                                    // 33
    mongoConnectionProto[func] = function(collName, selector, mod, options) {                                         // 34
      options = options || {};                                                                                        // 35
      var payload = {                                                                                                 // 36
        coll: collName,                                                                                               // 37
        func: func,                                                                                                   // 38
      };                                                                                                              // 39
                                                                                                                      // 40
      if(func == 'insert') {                                                                                          // 41
        //add nothing more to the payload                                                                             // 42
      } else if(func == '_ensureIndex' || func == '_dropIndex') {                                                     // 43
        //add index                                                                                                   // 44
        payload.index = JSON.stringify(selector);                                                                     // 45
      } else if(func == 'update' && options.upsert) {                                                                 // 46
        payload.func = 'upsert';                                                                                      // 47
        payload.selector = JSON.stringify(selector);                                                                  // 48
      } else {                                                                                                        // 49
        //all the other functions have selectors                                                                      // 50
        payload.selector = JSON.stringify(selector);                                                                  // 51
      }                                                                                                               // 52
                                                                                                                      // 53
      var kadiraInfo = Kadira._getInfo();                                                                             // 54
      if(kadiraInfo) {                                                                                                // 55
        var eventId = Kadira.tracer.event(kadiraInfo.trace, 'db', payload);                                           // 56
      }                                                                                                               // 57
                                                                                                                      // 58
      //this cause V8 to avoid any performance optimizations, but this is must to use                                 // 59
      //otherwise, if the error adds try catch block our logs get messy and didn't work                               // 60
      //see: issue #6                                                                                                 // 61
      try{                                                                                                            // 62
        var ret = originalFunc.apply(this, arguments);                                                                // 63
        //handling functions which can be triggered with an asyncCallback                                             // 64
        var endOptions = {};                                                                                          // 65
                                                                                                                      // 66
        if(HaveAsyncCallback(arguments)) {                                                                            // 67
          endOptions.async = true;                                                                                    // 68
        }                                                                                                             // 69
                                                                                                                      // 70
        if(func == 'update') {                                                                                        // 71
          // upsert only returns an object when called `upsert` directly                                              // 72
          // otherwise it only act an update command                                                                  // 73
          if(options.upsert && typeof ret == 'object') {                                                              // 74
            endOptions.updatedDocs = ret.numberAffected;                                                              // 75
            endOptions.insertedId = ret.insertedId;                                                                   // 76
          } else {                                                                                                    // 77
            endOptions.updatedDocs = ret;                                                                             // 78
          }                                                                                                           // 79
        } else if(func == 'remove') {                                                                                 // 80
          endOptions.removedDocs = ret;                                                                               // 81
        }                                                                                                             // 82
                                                                                                                      // 83
        if(eventId) {                                                                                                 // 84
          Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, endOptions);                                              // 85
        }                                                                                                             // 86
      } catch(ex) {                                                                                                   // 87
        if(eventId) {                                                                                                 // 88
          Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, {err: ex.message});                                       // 89
        }                                                                                                             // 90
        throw ex;                                                                                                     // 91
      }                                                                                                               // 92
                                                                                                                      // 93
      return ret;                                                                                                     // 94
    };                                                                                                                // 95
  });                                                                                                                 // 96
                                                                                                                      // 97
  var cursorProto = MeteorX.MongoCursor.prototype;                                                                    // 98
  ['forEach', 'map', 'fetch', 'count', 'observeChanges', 'observe', 'rewind'].forEach(function(type) {                // 99
    var originalFunc = cursorProto[type];                                                                             // 100
    cursorProto[type] = function() {                                                                                  // 101
      var cursorDescription = this._cursorDescription;                                                                // 102
      var payload = {                                                                                                 // 103
        coll: cursorDescription.collectionName,                                                                       // 104
        selector: JSON.stringify(cursorDescription.selector),                                                         // 105
        func: type,                                                                                                   // 106
        cursor: true                                                                                                  // 107
      };                                                                                                              // 108
                                                                                                                      // 109
      if(cursorDescription.options) {                                                                                 // 110
        var options = _.pick(cursorDescription.options, ['fields', 'sort', 'limit']);                                 // 111
        for(var field in options) {                                                                                   // 112
          var value = options[field]                                                                                  // 113
          if(typeof value == 'object') {                                                                              // 114
            value = JSON.stringify(value);                                                                            // 115
          }                                                                                                           // 116
          payload[field] = value;                                                                                     // 117
        }                                                                                                             // 118
      };                                                                                                              // 119
                                                                                                                      // 120
      var kadiraInfo = Kadira._getInfo();                                                                             // 121
      if(kadiraInfo) {                                                                                                // 122
        var eventId = Kadira.tracer.event(kadiraInfo.trace, 'db', payload);                                           // 123
      }                                                                                                               // 124
                                                                                                                      // 125
      try{                                                                                                            // 126
        var ret = originalFunc.apply(this, arguments);                                                                // 127
                                                                                                                      // 128
        var endData = {};                                                                                             // 129
        if(type == 'observeChanges' || type == 'observe') {                                                           // 130
          var observerDriver;                                                                                         // 131
          endData.oplog = false;                                                                                      // 132
          // get data written by the multiplexer                                                                      // 133
          endData.wasMultiplexerReady = ret._wasMultiplexerReady;                                                     // 134
          endData.queueLength = ret._queueLength;                                                                     // 135
          endData.elapsedPollingTime = ret._elapsedPollingTime;                                                       // 136
                                                                                                                      // 137
          if(ret._multiplexer) {                                                                                      // 138
            endData.noOfHandles = Object.keys(ret._multiplexer._handles).length;                                      // 139
                                                                                                                      // 140
            // older meteor versions done not have an _multiplexer value                                              // 141
            observerDriver = ret._multiplexer._observeDriver;                                                         // 142
            if(observerDriver) {                                                                                      // 143
              observerDriver = ret._multiplexer._observeDriver;                                                       // 144
              var observerDriverClass = observerDriver.constructor;                                                   // 145
              var usesOplog = typeof observerDriverClass.cursorSupported == 'function';                               // 146
              endData.oplog = usesOplog;                                                                              // 147
              var size = 0;                                                                                           // 148
              ret._multiplexer._cache.docs.forEach(function() {size++});                                              // 149
              endData.noOfCachedDocs = size;                                                                          // 150
                                                                                                                      // 151
              // if multiplexerWasNotReady, we need to get the time spend for the polling                             // 152
              if(!ret._wasMultiplexerReady) {                                                                         // 153
                endData.initialPollingTime = observerDriver._lastPollTime;                                            // 154
              }                                                                                                       // 155
            }                                                                                                         // 156
          }                                                                                                           // 157
                                                                                                                      // 158
          if(!endData.oplog) {                                                                                        // 159
            // let's try to find the reason                                                                           // 160
            var reasonInfo = Kadira.checkWhyNoOplog(cursorDescription, observerDriver);                               // 161
            endData.noOplogCode = reasonInfo.code;                                                                    // 162
            endData.noOplogReason = reasonInfo.reason;                                                                // 163
            endData.noOplogSolution = reasonInfo.solution;                                                            // 164
          }                                                                                                           // 165
        } else if(type == 'fetch' || type == 'map'){                                                                  // 166
          //for other cursor operation                                                                                // 167
          endData.docsFetched = ret.length;                                                                           // 168
        }                                                                                                             // 169
                                                                                                                      // 170
        if(eventId) {                                                                                                 // 171
          Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, endData);                                                 // 172
        }                                                                                                             // 173
        return ret;                                                                                                   // 174
      } catch(ex) {                                                                                                   // 175
        if(eventId) {                                                                                                 // 176
          Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, {err: ex.message});                                       // 177
        }                                                                                                             // 178
        throw ex;                                                                                                     // 179
      }                                                                                                               // 180
    };                                                                                                                // 181
  });                                                                                                                 // 182
};                                                                                                                    // 183
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/http.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var originalCall = HTTP.call;                                                                                         // 1
                                                                                                                      // 2
HTTP.call = function(method, url) {                                                                                   // 3
  var kadiraInfo = Kadira._getInfo();                                                                                 // 4
  if(kadiraInfo) {                                                                                                    // 5
    var eventId = Kadira.tracer.event(kadiraInfo.trace, 'http', {method: method, url: url});                          // 6
  }                                                                                                                   // 7
                                                                                                                      // 8
  try {                                                                                                               // 9
    var response = originalCall.apply(this, arguments);                                                               // 10
                                                                                                                      // 11
    //if the user supplied an asynCallback, we don't have a response object and it handled asynchronously             // 12
    //we need to track it down to prevent issues like: #3                                                             // 13
    var endOptions = HaveAsyncCallback(arguments)? {async: true}: {statusCode: response.statusCode};                  // 14
    if(eventId) {                                                                                                     // 15
      Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, endOptions);                                                  // 16
    }                                                                                                                 // 17
    return response;                                                                                                  // 18
  } catch(ex) {                                                                                                       // 19
    if(eventId) {                                                                                                     // 20
      Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, {err: ex.message});                                           // 21
    }                                                                                                                 // 22
    throw ex;                                                                                                         // 23
  }                                                                                                                   // 24
};                                                                                                                    // 25
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/email.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var originalSend = Email.send;                                                                                        // 1
                                                                                                                      // 2
Email.send = function(options) {                                                                                      // 3
  var kadiraInfo = Kadira._getInfo();                                                                                 // 4
  if(kadiraInfo) {                                                                                                    // 5
    var data = _.pick(options, 'from', 'to', 'cc', 'bcc', 'replyTo');                                                 // 6
    var eventId = Kadira.tracer.event(kadiraInfo.trace, 'email', data);                                               // 7
  }                                                                                                                   // 8
  try {                                                                                                               // 9
    var ret = originalSend.call(this, options);                                                                       // 10
    if(eventId) {                                                                                                     // 11
      Kadira.tracer.eventEnd(kadiraInfo.trace, eventId);                                                              // 12
    }                                                                                                                 // 13
    return ret;                                                                                                       // 14
  } catch(ex) {                                                                                                       // 15
    if(eventId) {                                                                                                     // 16
      Kadira.tracer.eventEnd(kadiraInfo.trace, eventId, {err: ex.message});                                           // 17
    }                                                                                                                 // 18
    throw ex;                                                                                                         // 19
  }                                                                                                                   // 20
};                                                                                                                    // 21
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/async.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fibers = Npm.require('fibers');                                                                                   // 1
                                                                                                                      // 2
var originalYield = Fibers.yield;                                                                                     // 3
Fibers.yield = function() {                                                                                           // 4
  var kadiraInfo = Kadira._getInfo();                                                                                 // 5
  if(kadiraInfo) {                                                                                                    // 6
    var eventId = Kadira.tracer.event(kadiraInfo.trace, 'async');;                                                    // 7
    if(eventId) {                                                                                                     // 8
      Fibers.current._apmEventId = eventId;                                                                           // 9
    }                                                                                                                 // 10
  }                                                                                                                   // 11
                                                                                                                      // 12
  originalYield();                                                                                                    // 13
};                                                                                                                    // 14
                                                                                                                      // 15
var originalRun = Fibers.prototype.run;                                                                               // 16
Fibers.prototype.run = function(val) {                                                                                // 17
  if(this._apmEventId) {                                                                                              // 18
    var kadiraInfo = Kadira._getInfo(this);                                                                           // 19
    if(kadiraInfo) {                                                                                                  // 20
      Kadira.tracer.eventEnd(kadiraInfo.trace, this._apmEventId);                                                     // 21
      this._apmEventId = null;                                                                                        // 22
    }                                                                                                                 // 23
  }                                                                                                                   // 24
  originalRun.call(this, val);                                                                                        // 25
};                                                                                                                    // 26
                                                                                                                      // 27
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/error.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
TrackUncaughtExceptions = function () {                                                                               // 1
  process.on('uncaughtException', function (err) {                                                                    // 2
    // skip errors with `_skipKadira` flag                                                                            // 3
    if(err._skipKadira) {                                                                                             // 4
      return;                                                                                                         // 5
    }                                                                                                                 // 6
                                                                                                                      // 7
    // let the server crash normally if error tracking is disabled                                                    // 8
    if(!Kadira.options.enableErrorTracking) {                                                                         // 9
      printErrorAndKill(err);                                                                                         // 10
    }                                                                                                                 // 11
                                                                                                                      // 12
    // looking for already tracked errors and throw them immediately                                                  // 13
    // throw error immediately if kadira is not ready                                                                 // 14
    if(err._tracked || !Kadira.connected) {                                                                           // 15
      printErrorAndKill(err);                                                                                         // 16
    }                                                                                                                 // 17
                                                                                                                      // 18
    var trace = getTrace(err, 'server-crash', 'uncaughtException');                                                   // 19
    Kadira.models.error.trackError(err, trace);                                                                       // 20
    Kadira._sendPayload(function () {                                                                                 // 21
      clearTimeout(timer);                                                                                            // 22
      throwError(err);                                                                                                // 23
    });                                                                                                               // 24
                                                                                                                      // 25
    var timer = setTimeout(function () {                                                                              // 26
      throwError(err);                                                                                                // 27
    }, 1000*10);                                                                                                      // 28
                                                                                                                      // 29
    function throwError(err) {                                                                                        // 30
      // sometimes error came back from a fiber.                                                                      // 31
      // But we don't fibers to track that error for us                                                               // 32
      // That's why we throw the error on the nextTick                                                                // 33
      process.nextTick(function() {                                                                                   // 34
        // we need to mark this error where we really need to throw                                                   // 35
        err._tracked = true;                                                                                          // 36
        printErrorAndKill(err);                                                                                       // 37
      });                                                                                                             // 38
    }                                                                                                                 // 39
  });                                                                                                                 // 40
                                                                                                                      // 41
  function printErrorAndKill(err) {                                                                                   // 42
    // since we are capturing error, we are also on the error message.                                                // 43
    // so developers think we are also reponsible for the error.                                                      // 44
    // But we are not. This will fix that.                                                                            // 45
    console.error(err.stack);                                                                                         // 46
    process.exit(7);                                                                                                  // 47
  }                                                                                                                   // 48
}                                                                                                                     // 49
                                                                                                                      // 50
TrackMeteorDebug = function () {                                                                                      // 51
  var originalMeteorDebug = Meteor._debug;                                                                            // 52
  Meteor._debug = function (message, stack) {                                                                         // 53
    if(!Kadira.options.enableErrorTracking) {                                                                         // 54
      return originalMeteorDebug.call(this, message, stack);                                                          // 55
    }                                                                                                                 // 56
                                                                                                                      // 57
    // We've changed `stack` into an object at method and sub handlers so we can                                      // 58
    // ignore them here. These errors are already tracked so don't track again.                                       // 59
    if(stack && stack.stack) {                                                                                        // 60
      stack = stack.stack                                                                                             // 61
    } else {                                                                                                          // 62
      // only send to the server, if only connected to kadira                                                         // 63
      if(Kadira.connected) {                                                                                          // 64
        var error = new Error(message);                                                                               // 65
        error.stack = stack;                                                                                          // 66
        var trace = getTrace(error, 'server-internal', 'Meteor._debug');                                              // 67
        Kadira.models.error.trackError(error, trace);                                                                 // 68
      }                                                                                                               // 69
    }                                                                                                                 // 70
                                                                                                                      // 71
    return originalMeteorDebug.apply(this, arguments);                                                                // 72
  }                                                                                                                   // 73
}                                                                                                                     // 74
                                                                                                                      // 75
function getTrace(err, type, subType) {                                                                               // 76
  return {                                                                                                            // 77
    type: type,                                                                                                       // 78
    subType: subType,                                                                                                 // 79
    name: err.message,                                                                                                // 80
    errored: true,                                                                                                    // 81
    at: Kadira.syncedDate.getTime(),                                                                                  // 82
    events: [                                                                                                         // 83
      ['start', 0, {}],                                                                                               // 84
      ['error', 0, {error: {message: err.message, stack: err.stack}}]                                                 // 85
    ],                                                                                                                // 86
    metrics: {                                                                                                        // 87
      total: 0                                                                                                        // 88
    }                                                                                                                 // 89
  };                                                                                                                  // 90
}                                                                                                                     // 91
                                                                                                                      // 92
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/hijack/set_labels.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
setLabels = function () {                                                                                             // 1
  // name Session.prototype.send                                                                                      // 2
  var originalSend = MeteorX.Session.prototype.send;                                                                  // 3
  MeteorX.Session.prototype.send = function kadira_Session_send (msg) {                                               // 4
    return originalSend.call(this, msg);                                                                              // 5
  }                                                                                                                   // 6
                                                                                                                      // 7
  // name mongodb.Connection.createDataHandler                                                                        // 8
  var mongodb = MongoInternals.NpmModule;                                                                             // 9
  var originalCreateDataHandler = mongodb.Connection.createDataHandler;                                               // 10
  mongodb.Connection.createDataHandler = function (self) {                                                            // 11
    var originalHandler = originalCreateDataHandler.call(this, self);                                                 // 12
    return function kadira_MongoDB_dataHandler (data) {                                                               // 13
      return originalHandler.call(this, data);                                                                        // 14
    }                                                                                                                 // 15
  }                                                                                                                   // 16
                                                                                                                      // 17
  // name Multiplexer initial adds                                                                                    // 18
  var originalSendAdds = MeteorX.Multiplexer.prototype._sendAdds;                                                     // 19
  MeteorX.Multiplexer.prototype._sendAdds = function kadira_Multiplexer_sendAdds (handle) {                           // 20
    return originalSendAdds.call(this, handle);                                                                       // 21
  }                                                                                                                   // 22
                                                                                                                      // 23
  // name MongoConnection insert                                                                                      // 24
  var originalMongoInsert = MeteorX.MongoConnection.prototype._insert;                                                // 25
  MeteorX.MongoConnection.prototype._insert = function kadira_MongoConnection_insert (coll, doc, cb) {                // 26
    return originalMongoInsert.call(this, coll, doc, cb);                                                             // 27
  }                                                                                                                   // 28
                                                                                                                      // 29
  // name MongoConnection update                                                                                      // 30
  var originalMongoUpdate = MeteorX.MongoConnection.prototype._update;                                                // 31
  MeteorX.MongoConnection.prototype._update = function kadira_MongoConnection_update (coll, selector, mod, options, cb) {
    return originalMongoUpdate.call(this, coll, selector, mod, options, cb);                                          // 33
  }                                                                                                                   // 34
                                                                                                                      // 35
  // name MongoConnection remove                                                                                      // 36
  var originalMongoRemove = MeteorX.MongoConnection.prototype._remove;                                                // 37
  MeteorX.MongoConnection.prototype._remove = function kadira_MongoConnection_remove (coll, selector, cb) {           // 38
    return originalMongoRemove.call(this, coll, selector, cb);                                                        // 39
  }                                                                                                                   // 40
                                                                                                                      // 41
  // name Pubsub added                                                                                                // 42
  var originalPubsubAdded = MeteorX.Session.prototype.sendAdded;                                                      // 43
  MeteorX.Session.prototype.sendAdded = function kadira_Session_sendAdded (coll, id, fields) {                        // 44
    return originalPubsubAdded.call(this, coll, id, fields);                                                          // 45
  }                                                                                                                   // 46
                                                                                                                      // 47
  // name Pubsub changed                                                                                              // 48
  var originalPubsubChanged = MeteorX.Session.prototype.sendChanged;                                                  // 49
  MeteorX.Session.prototype.sendChanged = function kadira_Session_sendChanged (coll, id, fields) {                    // 50
    return originalPubsubChanged.call(this, coll, id, fields);                                                        // 51
  }                                                                                                                   // 52
                                                                                                                      // 53
  // name Pubsub removed                                                                                              // 54
  var originalPubsubRemoved = MeteorX.Session.prototype.sendRemoved;                                                  // 55
  MeteorX.Session.prototype.sendRemoved = function kadira_Session_sendRemoved (coll, id) {                            // 56
    return originalPubsubRemoved.call(this, coll, id);                                                                // 57
  }                                                                                                                   // 58
                                                                                                                      // 59
  // name MongoCursor forEach                                                                                         // 60
  var originalCursorForEach = MeteorX.MongoCursor.prototype.forEach;                                                  // 61
  MeteorX.MongoCursor.prototype.forEach = function kadira_Cursor_forEach () {                                         // 62
    return originalCursorForEach.apply(this, arguments);                                                              // 63
  }                                                                                                                   // 64
                                                                                                                      // 65
  // name MongoCursor map                                                                                             // 66
  var originalCursorMap = MeteorX.MongoCursor.prototype.map;                                                          // 67
  MeteorX.MongoCursor.prototype.map = function kadira_Cursor_map () {                                                 // 68
    return originalCursorMap.apply(this, arguments);                                                                  // 69
  }                                                                                                                   // 70
                                                                                                                      // 71
  // name MongoCursor fetch                                                                                           // 72
  var originalCursorFetch = MeteorX.MongoCursor.prototype.fetch;                                                      // 73
  MeteorX.MongoCursor.prototype.fetch = function kadira_Cursor_fetch () {                                             // 74
    return originalCursorFetch.apply(this, arguments);                                                                // 75
  }                                                                                                                   // 76
                                                                                                                      // 77
  // name MongoCursor count                                                                                           // 78
  var originalCursorCount = MeteorX.MongoCursor.prototype.count;                                                      // 79
  MeteorX.MongoCursor.prototype.count = function kadira_Cursor_count () {                                             // 80
    return originalCursorCount.apply(this, arguments);                                                                // 81
  }                                                                                                                   // 82
                                                                                                                      // 83
  // name MongoCursor observeChanges                                                                                  // 84
  var originalCursorObserveChanges = MeteorX.MongoCursor.prototype.observeChanges;                                    // 85
  MeteorX.MongoCursor.prototype.observeChanges = function kadira_Cursor_observeChanges () {                           // 86
    return originalCursorObserveChanges.apply(this, arguments);                                                       // 87
  }                                                                                                                   // 88
                                                                                                                      // 89
  // name MongoCursor observe                                                                                         // 90
  var originalCursorObserve = MeteorX.MongoCursor.prototype.observe;                                                  // 91
  MeteorX.MongoCursor.prototype.observe = function kadira_Cursor_observe () {                                         // 92
    return originalCursorObserve.apply(this, arguments);                                                              // 93
  }                                                                                                                   // 94
                                                                                                                      // 95
  // name MongoCursor rewind                                                                                          // 96
  var originalCursorRewind = MeteorX.MongoCursor.prototype.rewind;                                                    // 97
  MeteorX.MongoCursor.prototype.rewind = function kadira_Cursor_rewind () {                                           // 98
    return originalCursorRewind.apply(this, arguments);                                                               // 99
  }                                                                                                                   // 100
                                                                                                                      // 101
  // name CrossBar listen                                                                                             // 102
  var originalCrossbarListen = DDPServer._Crossbar.prototype.listen;                                                  // 103
  DDPServer._Crossbar.prototype.listen = function kadira_Crossbar_listen (trigger, callback) {                        // 104
    return originalCrossbarListen.call(this, trigger, callback);                                                      // 105
  }                                                                                                                   // 106
                                                                                                                      // 107
  // name CrossBar fire                                                                                               // 108
  var originalCrossbarFire = DDPServer._Crossbar.prototype.fire;                                                      // 109
  DDPServer._Crossbar.prototype.fire = function kadira_Crossbar_fire (notification) {                                 // 110
    return originalCrossbarFire.call(this, notification);                                                             // 111
  }                                                                                                                   // 112
}                                                                                                                     // 113
                                                                                                                      // 114
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/environment_variables.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Kadira._parseEnv = function (env) {                                                                                   // 1
  var options = {};                                                                                                   // 2
  for(var name in env) {                                                                                              // 3
    var info = Kadira._parseEnv._options[name];                                                                       // 4
    var value = env[name];                                                                                            // 5
    if(info && value) {                                                                                               // 6
      options[info.name] = info.parser(value);                                                                        // 7
    }                                                                                                                 // 8
  }                                                                                                                   // 9
                                                                                                                      // 10
  return options;                                                                                                     // 11
};                                                                                                                    // 12
                                                                                                                      // 13
                                                                                                                      // 14
Kadira._parseEnv.parseInt = function (str) {                                                                          // 15
  var num = parseInt(str);                                                                                            // 16
  if(num || num === 0) return num;                                                                                    // 17
  throw new Error('Kadira: Match Error: "'+num+'" is not a number');                                                  // 18
};                                                                                                                    // 19
                                                                                                                      // 20
                                                                                                                      // 21
Kadira._parseEnv.parseBool = function (str) {                                                                         // 22
  str = str.toLowerCase();                                                                                            // 23
  if(str === 'true') return true;                                                                                     // 24
  if(str === 'false') return false;                                                                                   // 25
  throw new Error('Kadira: Match Error: '+str+' is not a boolean');                                                   // 26
};                                                                                                                    // 27
                                                                                                                      // 28
                                                                                                                      // 29
Kadira._parseEnv.parseUrl = function (str) {                                                                          // 30
  return str;                                                                                                         // 31
};                                                                                                                    // 32
                                                                                                                      // 33
                                                                                                                      // 34
Kadira._parseEnv.parseString = function (str) {                                                                       // 35
  return str;                                                                                                         // 36
};                                                                                                                    // 37
                                                                                                                      // 38
                                                                                                                      // 39
Kadira._parseEnv._options = {                                                                                         // 40
  // delay to send the initial ping to the kadira engine after page loads                                             // 41
  KADIRA_OPTIONS_CLIENT_ENGINE_SYNC_DELAY: {                                                                          // 42
    name: 'clientEngineSyncDelay',                                                                                    // 43
    parser: Kadira._parseEnv.parseInt,                                                                                // 44
  },                                                                                                                  // 45
  // time between sending errors to the engine                                                                        // 46
  KADIRA_OPTIONS_ERROR_DUMP_INTERVAL: {                                                                               // 47
    name: 'errorDumpInterval',                                                                                        // 48
    parser: Kadira._parseEnv.parseInt,                                                                                // 49
  },                                                                                                                  // 50
  // no of errors allowed in a given interval                                                                         // 51
  KADIRA_OPTIONS_MAX_ERRORS_PER_INTERVAL: {                                                                           // 52
    name: 'maxErrorsPerInterval',                                                                                     // 53
    parser: Kadira._parseEnv.parseInt,                                                                                // 54
  },                                                                                                                  // 55
  // a zone.js specific option to collect the full stack trace(which is not much useful)                              // 56
  KADIRA_OPTIONS_COLLECT_ALL_STACKS: {                                                                                // 57
    name: 'collectAllStacks',                                                                                         // 58
    parser: Kadira._parseEnv.parseBool,                                                                               // 59
  },                                                                                                                  // 60
  // enable error tracking (which is turned on by default)                                                            // 61
  KADIRA_OPTIONS_ENABLE_ERROR_TRACKING: {                                                                             // 62
    name: 'enableErrorTracking',                                                                                      // 63
    parser: Kadira._parseEnv.parseBool,                                                                               // 64
  },                                                                                                                  // 65
  // kadira engine endpoint                                                                                           // 66
  KADIRA_OPTIONS_ENDPOINT: {                                                                                          // 67
    name: 'endpoint',                                                                                                 // 68
    parser: Kadira._parseEnv.parseUrl,                                                                                // 69
  },                                                                                                                  // 70
  // define the hostname of the current running process                                                               // 71
  KADIRA_OPTIONS_HOSTNAME: {                                                                                          // 72
    name: 'hostname',                                                                                                 // 73
    parser: Kadira._parseEnv.parseString,                                                                             // 74
  },                                                                                                                  // 75
  // interval between sending data to the kadira engine from the server                                               // 76
  KADIRA_OPTIONS_PAYLOAD_TIMEOUT: {                                                                                   // 77
    name: 'payloadTimeout',                                                                                           // 78
    parser: Kadira._parseEnv.parseInt,                                                                                // 79
  },                                                                                                                  // 80
  // set HTTP/HTTPS proxy                                                                                             // 81
  KADIRA_OPTIONS_PROXY: {                                                                                             // 82
    name: 'proxy',                                                                                                    // 83
    parser: Kadira._parseEnv.parseUrl,                                                                                // 84
  },                                                                                                                  // 85
};                                                                                                                    // 86
                                                                                                                      // 87
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/auto_connect.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Kadira._connectWithEnv = function() {                                                                                 // 1
  if(process.env.KADIRA_APP_ID && process.env.KADIRA_APP_SECRET) {                                                    // 2
    var options = Kadira._parseEnv(process.env);                                                                      // 3
                                                                                                                      // 4
    Kadira.connect(                                                                                                   // 5
      process.env.KADIRA_APP_ID,                                                                                      // 6
      process.env.KADIRA_APP_SECRET,                                                                                  // 7
      options                                                                                                         // 8
    );                                                                                                                // 9
                                                                                                                      // 10
    Kadira.connect = function() {                                                                                     // 11
      throw new Error('Kadira has been already connected using credentials from Environment Variables');              // 12
    };                                                                                                                // 13
  }                                                                                                                   // 14
};                                                                                                                    // 15
                                                                                                                      // 16
                                                                                                                      // 17
Kadira._connectWithSettings = function () {                                                                           // 18
  if(                                                                                                                 // 19
    Meteor.settings.kadira &&                                                                                         // 20
    Meteor.settings.kadira.appId &&                                                                                   // 21
    Meteor.settings.kadira.appSecret                                                                                  // 22
  ) {                                                                                                                 // 23
    Kadira.connect(                                                                                                   // 24
      Meteor.settings.kadira.appId,                                                                                   // 25
      Meteor.settings.kadira.appSecret,                                                                               // 26
      Meteor.settings.kadira.options || {}                                                                            // 27
    );                                                                                                                // 28
                                                                                                                      // 29
    Kadira.connect = function() {                                                                                     // 30
      throw new Error('Kadira has been already connected using credentials from Meteor.settings');                    // 31
    };                                                                                                                // 32
  }                                                                                                                   // 33
};                                                                                                                    // 34
                                                                                                                      // 35
                                                                                                                      // 36
// Try to connect automatically                                                                                       // 37
Kadira._connectWithEnv();                                                                                             // 38
Kadira._connectWithSettings();                                                                                        // 39
                                                                                                                      // 40
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/common/default_error_filters.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var commonErrRegExps = [                                                                                              // 1
  /connection timeout\. no (\w*) heartbeat received/i,                                                                // 2
  /INVALID_STATE_ERR/i,                                                                                               // 3
];                                                                                                                    // 4
                                                                                                                      // 5
Kadira.errorFilters = {                                                                                               // 6
  filterValidationErrors: function(type, message, err) {                                                              // 7
    if(err && err instanceof Meteor.Error) {                                                                          // 8
      return false;                                                                                                   // 9
    } else {                                                                                                          // 10
      return true;                                                                                                    // 11
    }                                                                                                                 // 12
  },                                                                                                                  // 13
                                                                                                                      // 14
  filterCommonMeteorErrors: function(type, message) {                                                                 // 15
    for(var lc=0; lc<commonErrRegExps.length; lc++) {                                                                 // 16
      var regExp = commonErrRegExps[lc];                                                                              // 17
      if(regExp.test(message)) {                                                                                      // 18
        return false;                                                                                                 // 19
      }                                                                                                               // 20
    }                                                                                                                 // 21
    return true;                                                                                                      // 22
  }                                                                                                                   // 23
};                                                                                                                    // 24
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/meteorhacks:kadira/lib/common/send.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Kadira.send = function (payload, path, callback) {                                                                    // 1
  if(!Kadira.connected)  {                                                                                            // 2
    throw new Error("You need to connect with Kadira first, before sending messages!");                               // 3
  }                                                                                                                   // 4
                                                                                                                      // 5
  path = (path.substr(0, 1) != '/')? "/" + path : path;                                                               // 6
  var endpoint = Kadira.options.endpoint + path;                                                                      // 7
  var retryCount = 0;                                                                                                 // 8
  var retry = new Retry({                                                                                             // 9
    minCount: 1,                                                                                                      // 10
    minTimeout: 0,                                                                                                    // 11
    baseTimeout: 1000*5,                                                                                              // 12
    maxTimeout: 1000*60,                                                                                              // 13
  });                                                                                                                 // 14
                                                                                                                      // 15
  var sendFunction = Kadira._getSendFunction();                                                                       // 16
  tryToSend();                                                                                                        // 17
                                                                                                                      // 18
  function tryToSend(err) {                                                                                           // 19
    if(retryCount < 5) {                                                                                              // 20
      retry.retryLater(retryCount++, send);                                                                           // 21
    } else {                                                                                                          // 22
      console.warn('Error sending error traces to kadira server');                                                    // 23
      if(callback) callback(err);                                                                                     // 24
    }                                                                                                                 // 25
  }                                                                                                                   // 26
                                                                                                                      // 27
  function send() {                                                                                                   // 28
    sendFunction(endpoint, payload, function(err, content, statusCode) {                                              // 29
      if(err) {                                                                                                       // 30
        tryToSend(err);                                                                                               // 31
      } else if(statusCode == 200){                                                                                   // 32
        if(callback) callback(null, content);                                                                         // 33
      } else {                                                                                                        // 34
        if(callback) callback(new Meteor.Error(statusCode, content));                                                 // 35
      }                                                                                                               // 36
    });                                                                                                               // 37
  }                                                                                                                   // 38
};                                                                                                                    // 39
                                                                                                                      // 40
Kadira._getSendFunction = function() {                                                                                // 41
  return (Meteor.isServer)? Kadira._serverSend : Kadira._clientSend;                                                  // 42
};                                                                                                                    // 43
                                                                                                                      // 44
Kadira._clientSend = function (endpoint, payload, callback) {                                                         // 45
  $.ajax({                                                                                                            // 46
    type: 'POST',                                                                                                     // 47
    url: endpoint,                                                                                                    // 48
    contentType: 'application/json',                                                                                  // 49
    data: JSON.stringify(payload),                                                                                    // 50
    error: function(err) {                                                                                            // 51
      callback(err);                                                                                                  // 52
    },                                                                                                                // 53
    success: function(data) {                                                                                         // 54
      callback(null, data, 200);                                                                                      // 55
    }                                                                                                                 // 56
  });                                                                                                                 // 57
}                                                                                                                     // 58
                                                                                                                      // 59
Kadira._serverSend = function (endpoint, payload, callback) {                                                         // 60
  callback = callback || function() {};                                                                               // 61
  var Fiber = Npm.require('fibers');                                                                                  // 62
  new Fiber(function() {                                                                                              // 63
    var httpOptions = {                                                                                               // 64
      data: payload,                                                                                                  // 65
      headers: Kadira.options.authHeaders                                                                             // 66
    };                                                                                                                // 67
                                                                                                                      // 68
    HTTP.call('POST', endpoint, httpOptions, function(err, res) {                                                     // 69
      if(res) {                                                                                                       // 70
        var content = (res.statusCode == 200)? res.data : res.content;                                                // 71
        callback(null, content, res.statusCode);                                                                      // 72
      } else {                                                                                                        // 73
        callback(err);                                                                                                // 74
      }                                                                                                               // 75
    });                                                                                                               // 76
  }).run();                                                                                                           // 77
}                                                                                                                     // 78
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorhacks:kadira'] = {
  Kadira: Kadira
};

})();

//# sourceMappingURL=meteorhacks_kadira.js.map
