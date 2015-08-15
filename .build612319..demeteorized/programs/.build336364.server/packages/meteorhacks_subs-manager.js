(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;

/* Package-scope variables */
var SubsManager;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/meteorhacks:subs-manager/lib/sub_manager.js                                     //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
SubsManager = function (options) {                                                          // 1
  var self = this;                                                                          // 2
  self.options = options || {};                                                             // 3
  // maxiumum number of subscriptions are cached                                            // 4
  self.options.cacheLimit = self.options.cacheLimit || 10;                                  // 5
  // maximum time, subscription stay in the cache                                           // 6
  self.options.expireIn = self.options.expireIn || 5;                                       // 7
                                                                                            // 8
  self._cacheMap = {};                                                                      // 9
  self._cacheList = [];                                                                     // 10
  self.ready = false;                                                                       // 11
  self.dep = new Deps.Dependency();                                                         // 12
                                                                                            // 13
  self.computation = self._registerComputation();                                           // 14
};                                                                                          // 15
                                                                                            // 16
SubsManager.prototype.subscribe = function() {                                              // 17
  var self = this;                                                                          // 18
  if(Meteor.isClient) {                                                                     // 19
    this._addSub(arguments);                                                                // 20
                                                                                            // 21
    return {                                                                                // 22
      ready: function() {                                                                   // 23
        self.dep.depend();                                                                  // 24
        return self.ready;                                                                  // 25
      }                                                                                     // 26
    };                                                                                      // 27
  } else {                                                                                  // 28
    // to support fast-render                                                               // 29
    if(Meteor.subscribe) {                                                                  // 30
      return Meteor.subscribe.apply(Meteor, arguments);                                     // 31
    }                                                                                       // 32
  }                                                                                         // 33
};                                                                                          // 34
                                                                                            // 35
SubsManager.prototype._addSub = function(args) {                                            // 36
  var self = this;                                                                          // 37
  var hash = EJSON.stringify(args);                                                         // 38
  args = _.toArray(args);                                                                   // 39
  if(!self._cacheMap[hash]) {                                                               // 40
    var sub = {                                                                             // 41
      args: args,                                                                           // 42
      hash: hash                                                                            // 43
    };                                                                                      // 44
                                                                                            // 45
    this._handleError(sub);                                                                 // 46
                                                                                            // 47
    self._cacheMap[hash] = sub;                                                             // 48
    self._cacheList.push(sub);                                                              // 49
                                                                                            // 50
    self.ready = false;                                                                     // 51
    // no need to interfere with the current computation                                    // 52
    self._reRunSubs();                                                                      // 53
  }                                                                                         // 54
                                                                                            // 55
  // add the current sub to the top of the list                                             // 56
  var sub = self._cacheMap[hash];                                                           // 57
  sub.updated = (new Date).getTime();                                                       // 58
                                                                                            // 59
  var index = _.indexOf(self._cacheList, sub);                                              // 60
  self._cacheList.splice(index, 1);                                                         // 61
  self._cacheList.push(sub);                                                                // 62
};                                                                                          // 63
                                                                                            // 64
SubsManager.prototype._reRunSubs = function() {                                             // 65
  var self = this;                                                                          // 66
                                                                                            // 67
  if(Deps.currentComputation) {                                                             // 68
    Deps.afterFlush(function() {                                                            // 69
      self.computation.invalidate();                                                        // 70
    });                                                                                     // 71
  } else {                                                                                  // 72
    self.computation.invalidate();                                                          // 73
  }                                                                                         // 74
};                                                                                          // 75
                                                                                            // 76
SubsManager.prototype._applyCacheLimit = function () {                                      // 77
  var self = this;                                                                          // 78
  var overflow = self._cacheList.length - self.options.cacheLimit;                          // 79
  if(overflow > 0) {                                                                        // 80
    var removedSubs = self._cacheList.splice(0, overflow);                                  // 81
    _.each(removedSubs, function(sub) {                                                     // 82
      delete self._cacheMap[sub.hash];                                                      // 83
    });                                                                                     // 84
  }                                                                                         // 85
};                                                                                          // 86
                                                                                            // 87
SubsManager.prototype._applyExpirations = function() {                                      // 88
  var self = this;                                                                          // 89
  var newCacheList = [];                                                                    // 90
                                                                                            // 91
  var expirationTime = (new Date).getTime() - self.options.expireIn * 60 * 1000;            // 92
  _.each(self._cacheList, function(sub) {                                                   // 93
    if(sub.updated >= expirationTime) {                                                     // 94
      newCacheList.push(sub);                                                               // 95
    } else {                                                                                // 96
      delete self._cacheMap[sub.hash];                                                      // 97
    }                                                                                       // 98
  });                                                                                       // 99
                                                                                            // 100
  self._cacheList = newCacheList;                                                           // 101
};                                                                                          // 102
                                                                                            // 103
SubsManager.prototype._registerComputation = function() {                                   // 104
  var self = this;                                                                          // 105
  var computation = Deps.autorun(function() {                                               // 106
    self._applyExpirations();                                                               // 107
    self._applyCacheLimit();                                                                // 108
                                                                                            // 109
    var ready = true;                                                                       // 110
    _.each(self._cacheList, function(sub) {                                                 // 111
      sub.ready = Meteor.subscribe.apply(Meteor, sub.args).ready();                         // 112
      ready = ready && sub.ready;                                                           // 113
    });                                                                                     // 114
                                                                                            // 115
    if(ready) {                                                                             // 116
      self.ready = true;                                                                    // 117
      self.dep.changed();                                                                   // 118
    }                                                                                       // 119
  });                                                                                       // 120
                                                                                            // 121
  return computation;                                                                       // 122
};                                                                                          // 123
                                                                                            // 124
SubsManager.prototype._createIdentifier = function(args) {                                  // 125
  var tmpArgs = _.map(args, function(value) {                                               // 126
    if(typeof value == "string") {                                                          // 127
      return '"' + value + '"';                                                             // 128
    } else {                                                                                // 129
      return value;                                                                         // 130
    }                                                                                       // 131
  });                                                                                       // 132
                                                                                            // 133
  return tmpArgs.join(', ');                                                                // 134
};                                                                                          // 135
                                                                                            // 136
SubsManager.prototype._handleError = function(sub) {                                        // 137
  var args = sub.args;                                                                      // 138
  var lastElement = _.last(args);                                                           // 139
  sub.identifier = this._createIdentifier(args);                                            // 140
                                                                                            // 141
  if(!lastElement) {                                                                        // 142
    args.push({onError: errorHandlingLogic});                                               // 143
  } else if(typeof lastElement == "function") {                                             // 144
    args.pop();                                                                             // 145
    args.push({onReady: lastElement, onError: errorHandlingLogic});                         // 146
  } else if(typeof lastElement.onError == "function") {                                     // 147
    var originalOnError = lastElement.onError;                                              // 148
    lastElement.onError = function(err) {                                                   // 149
      errorHandlingLogic(err);                                                              // 150
      originalOnError(err);                                                                 // 151
    };                                                                                      // 152
  } else if(typeof lastElement.onReady == "function") {                                     // 153
    lastElement.onError = errorHandlingLogic;                                               // 154
  } else {                                                                                  // 155
    args.push({onError: errorHandlingLogic});                                               // 156
  }                                                                                         // 157
                                                                                            // 158
  function errorHandlingLogic (err) {                                                       // 159
    console.log("Error invoking SubsManager.subscribe(%s): ", sub.identifier , err.reason); // 160
    // expire this sub right away.                                                          // 161
    // Then expiration machanism will take care of the sub removal                          // 162
    sub.updated = new Date(1);                                                              // 163
  }                                                                                         // 164
};                                                                                          // 165
                                                                                            // 166
SubsManager.prototype.reset = function() {                                                  // 167
  var self = this;                                                                          // 168
  var oldComputation = self.computation;                                                    // 169
  self.computation = self._registerComputation();                                           // 170
                                                                                            // 171
  // invalidate the new compuation and it will fire new subscriptions                       // 172
  self.computation.invalidate();                                                            // 173
                                                                                            // 174
  // after above invalidation completed, fire stop the old computation                      // 175
  // which then send unsub messages                                                         // 176
  // mergeBox will correct send changed data and there'll be no flicker                     // 177
  Deps.afterFlush(function() {                                                              // 178
    oldComputation.stop();                                                                  // 179
  });                                                                                       // 180
};                                                                                          // 181
                                                                                            // 182
SubsManager.prototype.clear = function() {                                                  // 183
  this._cacheList = [];                                                                     // 184
  this._cacheMap = [];                                                                      // 185
  this._reRunSubs();                                                                        // 186
};                                                                                          // 187
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorhacks:subs-manager'] = {
  SubsManager: SubsManager
};

})();

//# sourceMappingURL=meteorhacks_subs-manager.js.map
