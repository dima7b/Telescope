(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Accounts = Package['accounts-base'].Accounts;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Herald, onRun, onRunResolve;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/kestanous:herald/lib/$herald.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//This is our Global Object. $herald.js will be the first file loaded                                                 // 1
Herald = {                                                                                                            // 2
  //Notification global settings                                                                                      // 3
  settings: {                                                                                                         // 4
    overrides: {}, //disable functionality for all users.                                                             // 5
    queueTimer: 60000,                                                                                                // 6
    userPreferenceDefault: true,                                                                                      // 7
    collectionName: 'notifications',                                                                                  // 8
    useIronRouter: true,                                                                                              // 9
    expireAfterSeconds: 0                                                                                             // 10
  },                                                                                                                  // 11
                                                                                                                      // 12
  //media and runners                                                                                                 // 13
  _media: function () { //supported media, extension packages should push new kinds                                   // 14
    return _.union(_.keys(Herald._serverRunners), _.keys(Herald._clientRunners))                                      // 15
  },                                                                                                                  // 16
  _serverRunners: {}, //extension packages load their code here on servers                                            // 17
  _clientRunners: {}, //extension packages load their code here on clients                                            // 18
  _runnerCheckers: {}, //test if courier media data is valid                                                          // 19
                                                                                                                      // 20
                                                                                                                      // 21
  //couriers                                                                                                          // 22
  _couriers: {},                                                                                                      // 23
  _extentionParams: [] //UNDOCUMENTED: allow for more top level params on EventTypes                                  // 24
};                                                                                                                    // 25
                                                                                                                      // 26
// Package users can define a predefined message from the notification instance.                                      // 27
// It requires the user pass a options.message function, string, or object.                                           // 28
//                                                                                                                    // 29
// If its a function it will be run with the from the instance scope                                                  // 30
//                                                                                                                    // 31
// If its a string it will return a template with the instance                                                        // 32
// as its data.                                                                                                       // 33
//                                                                                                                    // 34
// If its an object it will run any number of templates or functions based on the optional                            // 35
// string argument given at the time of call. If no string is passed it will default                                  // 36
// to 'default'. From there it acts the same as ether of the above patterns.                                          // 37
Herald._message = function (template) {                                                                               // 38
  var message;                                                                                                        // 39
  var courier = Herald._getCourier(this.courier);                                                                     // 40
  var messageFormat = courier && courier.messageFormat;                                                               // 41
                                                                                                                      // 42
  if (_.isObject(messageFormat) && !_.isFunction(messageFormat) && !_.isString(messageFormat)) {                      // 43
    message = messageFormat[template] || messageFormat.default;                                                       // 44
                                                                                                                      // 45
    if (!message) {                                                                                                   // 46
      throw new Error('Herald: No default message defined for "' + this.courier + '" notifications');                 // 47
    }                                                                                                                 // 48
  }                                                                                                                   // 49
  message = message || messageFormat;                                                                                 // 50
                                                                                                                      // 51
  if (_.isFunction(message)) {                                                                                        // 52
    return message.call(this);                                                                                        // 53
  }                                                                                                                   // 54
                                                                                                                      // 55
  else if (_.isString(message)) {                                                                                     // 56
    return Blaze.With(this, function () {                                                                             // 57
      return Template[message];                                                                                       // 58
    });                                                                                                               // 59
  }                                                                                                                   // 60
                                                                                                                      // 61
  throw new Error('Herald: message not defined for "' + this.courier + '" notifications');                            // 62
};                                                                                                                    // 63
                                                                                                                      // 64
Herald._setProperty = function (key, value) {                                                                         // 65
  var obj = {};                                                                                                       // 66
  obj[key] = value;                                                                                                   // 67
  return obj;                                                                                                         // 68
};                                                                                                                    // 69
                                                                                                                      // 70
Herald._getProperty = function (obj, keys) {                                                                          // 71
  var keys = keys.split('.');                                                                                         // 72
  _.each(keys, function (key) {                                                                                       // 73
    obj = obj && obj[key];                                                                                            // 74
  });                                                                                                                 // 75
  return obj;                                                                                                         // 76
};                                                                                                                    // 77
                                                                                                                      // 78
Herald._getUser = function (user) {                                                                                   // 79
  if (_.isString(user)) {                                                                                             // 80
    user = Meteor.users.findOne(user);                                                                                // 81
  }                                                                                                                   // 82
  else if (!_.isObject(user)) {                                                                                       // 83
    user = Meteor.isClient ? Meteor.user() : Meteor.users.findOne(this.userId);                                       // 84
  }                                                                                                                   // 85
  return user;                                                                                                        // 86
};                                                                                                                    // 87
                                                                                                                      // 88
// retrieves from Herald._couriers by default, otherwise from obj                                                     // 89
Herald._getCourier = function (keys, obj) {                                                                           // 90
  var courier = obj || Herald._couriers;                                                                              // 91
  return Herald._getProperty(courier, keys);                                                                          // 92
};                                                                                                                    // 93
                                                                                                                      // 94
Herald._setCourier = function (key, val) {                                                                            // 95
  var keys = key.split('.');                                                                                          // 96
  var orig = Herald._couriers;                                                                                        // 97
  var len = keys.length - 1;                                                                                          // 98
  for (var i = 0; i < len; i++) {                                                                                     // 99
    orig[keys[i]] = orig[keys[i]] || {};                                                                              // 100
    orig = orig[keys[i]];                                                                                             // 101
  }                                                                                                                   // 102
  orig[keys[len]] = val;                                                                                              // 103
  return Herald._getCourier(key);                                                                                     // 104
}                                                                                                                     // 105
                                                                                                                      // 106
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/kestanous:herald/lib/collection.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.startup(function () {                                                                                          // 1
  //The collection and any instance functionality                                                                     // 2
  Herald.collection = new Meteor.Collection(Herald.settings.collectionName, {                                         // 3
    transform: function (notification) {                                                                              // 4
      if (notification.courier) { //courier may not be available if fields filter was called.                         // 5
        var courier = Herald._getCourier(notification.courier);                                                       // 6
        //This is the basic message you want to output. Use in the app or as an email subject line                    // 7
        // it is optional and is set up with createNotification from the server code.                                 // 8
        notification.message = function (template) {                                                                  // 9
          if (template && !_.isString(template))                                                                      // 10
            throw new Error('Herald: message argument must be undefined or a string')                                 // 11
          if (courier.messageFormat)                                                                                  // 12
            return Herald._message.call(this, template);                                                              // 13
                                                                                                                      // 14
          throw new Error('Herald: no message defined for "' + this.courier + '"');                                   // 15
        };                                                                                                            // 16
                                                                                                                      // 17
        if (courier && courier.transform) {                                                                           // 18
          _.defaults(notification, courier.transform);                                                                // 19
        }                                                                                                             // 20
      };                                                                                                              // 21
      return notification;                                                                                            // 22
    }                                                                                                                 // 23
  });                                                                                                                 // 24
                                                                                                                      // 25
  var expireTime = Herald.settings.expireAfterSeconds;                                                                // 26
  if (Meteor.isServer && expireTime && Herald.collection.find().count() === 0) {                                      // 27
    Herald.collection._ensureIndex({ 'timestamp': 1 }, { 'expireAfterSeconds': expireTime });                         // 28
  }                                                                                                                   // 29
                                                                                                                      // 30
  //Minimum requirement for notifications to work while still providing                                               // 31
  //basic security. For added limitations use `Herald.deny` in                                                        // 32
  //your app.                                                                                                         // 33
  Herald.collection.allow({                                                                                           // 34
    insert: function (userId, doc) {                                                                                  // 35
      // new notifications can only be created via a Meteor method                                                    // 36
      return false;                                                                                                   // 37
    },                                                                                                                // 38
    update: function (userId, doc) {                                                                                  // 39
      return userId == doc.userId;                                                                                    // 40
    },                                                                                                                // 41
    remove: function (userId, doc) {                                                                                  // 42
      return userId == doc.userId;                                                                                    // 43
    }                                                                                                                 // 44
  });                                                                                                                 // 45
});                                                                                                                   // 46
                                                                                                                      // 47
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/kestanous:herald/lib/couriers.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Herald.addCourier = function (key, options) {                                                                         // 1
  check(key, String);                                                                                                 // 2
  check(options, Object);                                                                                             // 3
                                                                                                                      // 4
  if (Herald._getCourier(key))                                                                                        // 5
    throw new Error('Herald: courier "' + key + '"" already exists');                                                 // 6
                                                                                                                      // 7
  var courier = Herald._setCourier(key, {                                                                             // 8
    messageFormat: options.message                                                                                    // 9
  });                                                                                                                 // 10
                                                                                                                      // 11
  //media is required but should only throw exceptions on the server, where it is needed.                             // 12
  if (Meteor.isServer) {                                                                                              // 13
    check(options.media, Object);                                                                                     // 14
                                                                                                                      // 15
    var media = _.keys(options.media);                                                                                // 16
    if (!media.length)                                                                                                // 17
      throw new Error('Herald: courier "' + key + '" must have at least one medium');                                 // 18
                                                                                                                      // 19
    media.forEach(function (medium) {                                                                                 // 20
      if (!_.contains(Herald._media(), medium))                                                                       // 21
        throw new Error('Herald: medium "' + medium + '" is not a known media');                                      // 22
                                                                                                                      // 23
      Herald._runnerCheckers[medium].call(options.media[medium]);                                                     // 24
    });                                                                                                               // 25
  }                                                                                                                   // 26
  //define on both                                                                                                    // 27
  courier.media = options.media;                                                                                      // 28
  courier.transform = options.transform;                                                                              // 29
                                                                                                                      // 30
  //white-listed params from extension packages                                                                       // 31
  _.extend(courier, _.pick(options, Herald._extentionParams));                                                        // 32
};                                                                                                                    // 33
                                                                                                                      // 34
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/kestanous:herald/lib/runners.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Herald.addRunner = function (object) {                                                                                // 1
  if (!_.isObject(object)) throw new Error('Herald: Runner must have an `object` argument');                          // 2
  if (! _.isString(object.name)) throw new Error('Herald: Runner must medium `name`');                                // 3
  if (!_.isFunction(object.run)) throw new Error('Herald: Runner must have a `run` function');                        // 4
  if (!_.isFunction(object.check)) throw new Error('Herald: Runner must have a `check` function');                    // 5
  if (! (_.isArray(object.where) || _.isString(object.where)))                                                        // 6
    throw new Error('Herald: Runner `where` must be a valid environment');                                            // 7
                                                                                                                      // 8
  var where = _.isString(object.where) ? [object.where] : object.where;                                               // 9
                                                                                                                      // 10
  _.each(where, function (where) {                                                                                    // 11
    if (where === 'server')                                                                                           // 12
      Herald._serverRunners[object.name] = object.run;                                                                // 13
    if (where === 'client')                                                                                           // 14
      Herald._clientRunners[object.name] = object.run;                                                                // 15
  });                                                                                                                 // 16
                                                                                                                      // 17
  Herald._runnerCheckers[object.name] = object.check;                                                                 // 18
}                                                                                                                     // 19
                                                                                                                      // 20
                                                                                                                      // 21
onRun = function () {};                                                                                               // 22
onRun.prototype.run = function () {                                                                                   // 23
  return { command: 'run' };                                                                                          // 24
};                                                                                                                    // 25
                                                                                                                      // 26
onRun.prototype.stop = function () {                                                                                  // 27
  return { command: 'stop' };                                                                                         // 28
};                                                                                                                    // 29
                                                                                                                      // 30
onRun.prototype.delay = function (time) {                                                                             // 31
  return { command: 'delay', time: time };                                                                            // 32
};                                                                                                                    // 33
                                                                                                                      // 34
onRun.prototype.transfer = function (name, time) {                                                                    // 35
  return { command: 'transfer', name: name, time: time };                                                             // 36
};                                                                                                                    // 37
                                                                                                                      // 38
                                                                                                                      // 39
onRunResolve = function (notification, medium, result, run) {                                                         // 40
  switch (result.command) {                                                                                           // 41
    case 'run':                                                                                                       // 42
      //run true, but invalidation could have been triggered elsewhere so don't change                                // 43
      break;                                                                                                          // 44
    case 'stop':                                                                                                      // 45
      run = false;                                                                                                    // 46
      break;                                                                                                          // 47
    case 'delay':                                                                                                     // 48
      run = false;                                                                                                    // 49
      if (Herald._serverRunners[medium]) { //will only be called on server, no method needed                          // 50
        var query = Herald._setProperty('media.' + medium + '.send', true);                                           // 51
        var command = 'Herald.escalate("' + notification._id + '", "' + medium + '")';                                // 52
        Herald.collection.update(notificationId, { $set: query }, function (err, count) {                             // 53
          Queue.add({ command: command, execute_after: result.time });                                                // 54
        });                                                                                                           // 55
      }                                                                                                               // 56
      if (Herald._clientRunners[medium]) {                                                                            // 57
        var delay = result.time.getTime() - new Date().getTime();                                                     // 58
        Meteor.call('HeraldUpdateAndDelay', notification._id, medium, delay);                                         // 59
      }                                                                                                               // 60
      break;                                                                                                          // 61
    case 'transfer':                                                                                                  // 62
      run = false;                                                                                                    // 63
      if (!Herald._clientRunners[result.name] && !Herald._serverRunners[result.name])                                 // 64
        throw new Error('Herald: '+ medium +' transfer call - no medium '+ result.name);                              // 65
      if (Herald._serverRunners[result.name])                                                                         // 66
        Meteor.call('HeraldTransferServerMedium', notification._id, result);                                          // 67
      if (Herald._clientRunners[result.name]) {                                                                       // 68
        var delay = result.time && result.time.getTime() - new Date().getTime();                                      // 69
        var query = Herald._setProperty('media.' + result.name, true);                                                // 70
        Meteor.call('HeraldUpdateAndDelay', notification._id, query, delay);                                          // 71
      }                                                                                                               // 72
      break;                                                                                                          // 73
    default:                                                                                                          // 74
      throw new Error('Herald:' + medium + ' onRun returned the unknown command ' + result.command);                  // 75
  }                                                                                                                   // 76
  return run;                                                                                                         // 77
}                                                                                                                     // 78
                                                                                                                      // 79
Meteor.methods({                                                                                                      // 80
  HeraldTransferServerMedium: function (notificationId, result) {                                                     // 81
    var notification = Herald.collection.findOne(notificationId);                                                     // 82
    var courier = Herald._getCourier(notification.courier);                                                           // 83
                                                                                                                      // 84
    if (this.userId !== notification.userId) throw new Meteor.Error(550, 'Herald: permission denied');                // 85
    if (courier && !courier.media[result.name])                                                                       // 86
      throw new Error('Herald: ' + notification.courier + ' transfer call - no medium '+ result.name);                // 87
                                                                                                                      // 88
    var command = 'Herald.escalate("' + notification._id + '", "' + result.name + '")';                               // 89
    if (Meteor.isServer) {//simulation causes errors                                                                  // 90
      var query = Herald._setProperty('media.' + result.name + '.send', true);                                        // 91
                                                                                                                      // 92
      Herald.collection.update(notificationId, { $set: query }, function (err, count) {                               // 93
        if (result.time)                                                                                              // 94
          if (Package['artwells:queue']) {                                                                            // 95
            Queue.add({ command: command, execute_after: result.time });                                              // 96
          } else {                                                                                                    // 97
            //TODO: how are we going to do delays without a queue?                                                    // 98
            //Herald.escalate(notification._id, result.name);                                                         // 99
            throw new Meteor.error('Herald: delay is not available without artwells:queue');                          // 100
          }                                                                                                           // 101
        else                                                                                                          // 102
          if (Package['artwells:queue']) {                                                                            // 103
            Queue.add({ command: command });                                                                          // 104
          } else {                                                                                                    // 105
            Herald.escalate(notification._id, result.name);                                                           // 106
          }                                                                                                           // 107
      });                                                                                                             // 108
    }                                                                                                                 // 109
  },                                                                                                                  // 110
  HeraldUpdateAndDelay: function (notificationId, query, delay) {                                                     // 111
    if (!delay || delay < 1000) delay = 1000; //give at least one second for the dust to settle                       // 112
    var notification = Herald.collection.findOne(notificationId);                                                     // 113
    if (this.userId !== notification.userId) throw new Meteor.Error(550, 'Herald: permission denied');                // 114
    if (!this.isSimulation) {                                                                                         // 115
      Meteor.setTimeout(function () {                                                                                 // 116
        Herald.collection.update(notificationId, { $set: query });                                                    // 117
      }, delay);                                                                                                      // 118
    }                                                                                                                 // 119
  }                                                                                                                   // 120
});                                                                                                                   // 121
                                                                                                                      // 122
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/kestanous:herald/lib/users.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//userPreference - can be easily overloaded without loss of functionality.                                            // 1
Herald.userPreference = function (user, medium, courier) { return Herald.getUserPreference(user, medium, courier); }; // 2
                                                                                                                      // 3
// set user medium preference                                                                                         // 4
Herald.setUserPreference = function (user, preference, courier) {                                                     // 5
  if (courier && !Herald._getCourier(courier)) //optional and check                                                   // 6
    throw new Error('Herald - getUserPreference: courier "' + courier + '" not found')                                // 7
                                                                                                                      // 8
  if (!_.isObject(preference)) throw new Error('Herald - getUserPreference: no media preference given');              // 9
  var badKeys = _.omit(preference, Herald._media());                                                                  // 10
  if (!_.isEmpty(badKeys)) throw new Error('Herald - getUserPreference: "' + _.toArray(badKeys) + '" are not valid media');
                                                                                                                      // 12
  user = Herald._getUser.call(this, user);                                                                            // 13
  if (!user || !user._id) throw new Error('Herald - setUserPreference: user not found');                              // 14
                                                                                                                      // 15
  //not set                                                                                                           // 16
  if (!user.profile) {                                                                                                // 17
    return Meteor.users.update(user._id, { $set: { profile: newProfileMedia(preference) } });                         // 18
  }                                                                                                                   // 19
  if (!user.profile.notifications) {                                                                                  // 20
    return Meteor.users.update(user._id, { $set: { 'profile.notifications': newProfileMedia(preference).notifications } });
  }                                                                                                                   // 22
                                                                                                                      // 23
  if (!courier) { // generic only                                                                                     // 24
    var media = user.profile.notifications.media;                                                                     // 25
    // if media preference is set, merge medium preferences. otherwise, create new preference                         // 26
    var media = media ? _.extend(media, preference) : newProfileMedia(preference).notifications.media;                // 27
    return Meteor.users.update(user._id, { $set: { 'profile.notifications.media': media } });                         // 28
  } // generic only end                                                                                               // 29
                                                                                                                      // 30
  var pref = Herald._getCourier(courier, user.profile.notifications.couriers);                                        // 31
  // if courier is set, merge courier preferences. otherwise use preference                                           // 32
  var pref = pref ? _.extend(pref, preference) : preference;                                                          // 33
                                                                                                                      // 34
  var query = Herald._setProperty('profile.notifications.couriers.' + courier, pref);                                 // 35
  return Meteor.users.update(user._id, { $set: query });                                                              // 36
}                                                                                                                     // 37
                                                                                                                      // 38
// get user [medium [courier]] preference                                                                             // 39
Herald.getUserPreference = function (user, medium, courier) {                                                         // 40
  if (!_.isString(medium)) throw new Error('Herald - getUserPreference: no medium given');                            // 41
  if (!_.contains(Herald._media(), medium))                                                                           // 42
    throw new Error('Herald - getUserPreference: medium "' + medium + '" not found')                                  // 43
  if (courier && !Herald._getCourier(courier))                                                                        // 44
    throw new Error('Herald - getUserPreference: courier "' + courier + '" not found')                                // 45
                                                                                                                      // 46
  user = Herald._getUser.call(this, user);                                                                            // 47
  if (!user || !user._id) throw new Error('Herald - getUserPreference: user not found')                               // 48
                                                                                                                      // 49
  var defaultOutput = Herald.settings.userPreferenceDefault;                                                          // 50
                                                                                                                      // 51
  //not set                                                                                                           // 52
  if (!user.profile || !user.profile.notifications) return defaultOutput;                                             // 53
                                                                                                                      // 54
  return (function (pref, courier) {                                                                                  // 55
    var courier = courier && Herald._getCourier(courier, pref.couriers);                                              // 56
                                                                                                                      // 57
    if (courier && _.has(courier, medium)) {                                                                          // 58
      return courier[medium];                                                                                         // 59
    }                                                                                                                 // 60
    //general                                                                                                         // 61
    if (pref.media && _.has(pref.media, medium)) {                                                                    // 62
      return pref.media[medium];                                                                                      // 63
    }                                                                                                                 // 64
                                                                                                                      // 65
    return defaultOutput;                                                                                             // 66
  })(user.profile.notifications, courier);                                                                            // 67
}                                                                                                                     // 68
                                                                                                                      // 69
var newProfileMedia = function (preferences) {                                                                        // 70
  return {                                                                                                            // 71
    notifications: {                                                                                                  // 72
      media: preferences,                                                                                             // 73
      couriers: {}                                                                                                    // 74
    }                                                                                                                 // 75
  };                                                                                                                  // 76
};                                                                                                                    // 77
                                                                                                                      // 78
var newProfileCouriers = function (courier, preferences) {                                                            // 79
  return {                                                                                                            // 80
    notifications: {                                                                                                  // 81
      media: {},                                                                                                      // 82
      couriers: Herald._setProperty(courier, preferences)                                                             // 83
    }                                                                                                                 // 84
  };                                                                                                                  // 85
};                                                                                                                    // 86
                                                                                                                      // 87
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/kestanous:herald/lib/onsite.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var runner = {                                                                                                        // 1
  name: 'onsite',                                                                                                     // 2
  where: ['client']                                                                                                   // 3
};                                                                                                                    // 4
runner.run = function (notification, user) {};                                                                        // 5
runner.check = function () {};                                                                                        // 6
Herald.addRunner(runner);                                                                                             // 7
                                                                                                                      // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/kestanous:herald/lib/helpers.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//get notifications by user, [courier, [[medium]]                                                                     // 1
Herald.getNotifications = function (query, options) {                                                                 // 2
  // break function if not finished with logging in                                                                   // 3
  if (Meteor.isClient && Meteor.loggingIn()) {                                                                        // 4
    return [];                                                                                                        // 5
  }                                                                                                                   // 6
                                                                                                                      // 7
  if (!_.isObject(query)) {                                                                                           // 8
    throw new Meteor.Error('Herald getNotifications must contain Mongo filter query');                                // 9
  }                                                                                                                   // 10
                                                                                                                      // 11
  var badKeys = _.omit(query, ['user', 'courier', 'medium', 'read']);                                                 // 12
  if (!_.isEmpty(badKeys)) {                                                                                          // 13
    throw new Error('Herald - getNotifications: unknown key(s) ' + _.toArray(badKeys))                                // 14
  }                                                                                                                   // 15
                                                                                                                      // 16
  var userId = query.user,                                                                                            // 17
    courier = query.courier,                                                                                          // 18
    medium = query.medium,                                                                                            // 19
    read = query.read || false;                                                                                       // 20
                                                                                                                      // 21
  // get user                                                                                                         // 22
  var user = Herald._getUser.call(this, userId);                                                                      // 23
                                                                                                                      // 24
  // check if user exists                                                                                             // 25
  if (!user || !user._id) {                                                                                           // 26
    throw new Error('Herald - getNotifications: user not found');                                                     // 27
  }                                                                                                                   // 28
                                                                                                                      // 29
  // check courier                                                                                                    // 30
  if (courier && !Herald._getCourier(courier)) {                                                                      // 31
    throw new Error('Herald - getNotifications: courier "' + courier + '" not found');                                // 32
  }                                                                                                                   // 33
                                                                                                                      // 34
  // check medium                                                                                                     // 35
  if (medium && !_.contains(Herald._media(), medium)) {                                                               // 36
    throw new Error('Herald - getNotifications: medium "' + medium + '" not found');                                  // 37
  }                                                                                                                   // 38
                                                                                                                      // 39
  var query = { userId: user._id, read: read };                                                                       // 40
  if (medium) {                                                                                                       // 41
    query['media.' + medium] = { $exists: true };                                                                     // 42
  }                                                                                                                   // 43
  if (courier) {                                                                                                      // 44
    query['courier'] = courier;                                                                                       // 45
  }                                                                                                                   // 46
                                                                                                                      // 47
  return Herald.collection.find(query, options);                                                                      // 48
};                                                                                                                    // 49
                                                                                                                      // 50
//literally mark-All-As-Read, cheers :)                                                                               // 51
Meteor.methods({                                                                                                      // 52
  heraldMarkAllAsRead: function () {                                                                                  // 53
    Herald.collection.update({ userId: this.userId }, {                                                               // 54
      $set: { read: true }                                                                                            // 55
    }, { multi: true });                                                                                              // 56
  }                                                                                                                   // 57
});                                                                                                                   // 58
                                                                                                                      // 59
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/kestanous:herald/server/createNotification.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//You can insert manually but this should save you some work.                                                         // 1
Herald.createNotification = function (userIds, params) {                                                              // 2
  check(userIds, Match.OneOf([String], String)); //TODO: better Collection ID check                                   // 3
  check(params, Object);                                                                                              // 4
                                                                                                                      // 5
  var courier = Herald._getCourier(params.courier);                                                                   // 6
  if (!courier) {                                                                                                     // 7
    throw new Error('Notification: courier type does not exists');                                                    // 8
  }                                                                                                                   // 9
                                                                                                                      // 10
  // always assume multiple users.                                                                                    // 11
  if (_.isString(userIds)) userIds = [userIds];                                                                       // 12
  var users = Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1 } });                               // 13
                                                                                                                      // 14
  users.forEach(function (user) { //create a notification for each user                                               // 15
                                                                                                                      // 16
    //When creating a new notification                                                                                // 17
    //                                                                                                                // 18
    // timestamp - you should timestamp every doc                                                                     // 19
    // userId - there must be a user to notify                                                                        // 20
    // courier - this is the courier                                                                                  // 21
    // data - in database metadata, consider renaming                                                                 // 22
    // read - default false, consider auto-delete?                                                                    // 23
    // escalated - track if higher level notifications have run                                                       // 24
    // url - allow of iron:router magic. set read to true if visited (see routeSeenByUser)                            // 25
    // media - a list of all the media the notification can be sent on but has not been.                              // 26
                                                                                                                      // 27
    var notification = {                                                                                              // 28
      timestamp: new Date(),                                                                                          // 29
      userId: user._id,                                                                                               // 30
      courier: params.courier,                                                                                        // 31
      data: params.data,                                                                                              // 32
      read: false,                                                                                                    // 33
      escalated: false,                                                                                               // 34
      url: params.url,                                                                                                // 35
      media: {}                                                                                                       // 36
    };                                                                                                                // 37
                                                                                                                      // 38
    //check if this notification should be sent to medium                                                             // 39
    _.each(_.keys(courier.media), function (medium) {                                                                 // 40
      var fallback = courier.media[medium].fallback;                                                                  // 41
      var preference = Herald.userPreference(user, medium, notification.courier);                                     // 42
                                                                                                                      // 43
      // run if not a fallback and preference allows it                                                               // 44
      notification.media[medium] = { send: !fallback && preference, sent: false };                                    // 45
    });                                                                                                               // 46
                                                                                                                      // 47
    //create notification and return its id                                                                           // 48
    var notificationId = Herald.collection.insert(notification);                                                      // 49
                                                                                                                      // 50
    //if no notificationId then insert failed anD PANIC, STOP, DON'T ACUTALLY DO THIS!                                // 51
    if (notificationId) {                                                                                             // 52
      notification._id = notificationId;                                                                              // 53
      Herald.SetupEscalations(notification);                                                                          // 54
    }                                                                                                                 // 55
                                                                                                                      // 56
    return notificationId;                                                                                            // 57
  });                                                                                                                 // 58
};                                                                                                                    // 59
                                                                                                                      // 60
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/kestanous:herald/server/escalate.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//allow package users to delay escalations                                                                            // 1
Meteor.startup(function () {                                                                                          // 2
  //if no pattern is defined then skip this.                                                                          // 3
  // if (!Herald.settings.delayEscalation) return false;                                                              // 4
  if (Package['artwells:queue']) {                                                                                    // 5
    Meteor.setInterval(function ( ){ Queue.run() }, Herald.settings.queueTimer); // by default, once a minute         // 6
  }                                                                                                                   // 7
});                                                                                                                   // 8
                                                                                                                      // 9
                                                                                                                      // 10
Herald.SetupEscalations = function (notification) {                                                                   // 11
  if (notification.escalated) return false; //don't resend notifications                                              // 12
                                                                                                                      // 13
  _.each(_.keys(Herald._getCourier(notification.courier).media), function (medium) {                                  // 14
    if (!_.contains(_.keys(Herald._serverRunners), medium)) return; //Server only                                     // 15
    if (!notification.media[medium].send || notification.media[medium].sent) return; //already sent/don't send        // 16
    if (Package['artwells:queue']) {                                                                                  // 17
      var command = 'Meteor.call("heraldEscalate","' + notification._id + '", "' + medium + '")';                     // 18
      Queue.add({ command: command });                                                                                // 19
    } else {                                                                                                          // 20
      Meteor.call("heraldEscalate", notification._id, medium);                                                        // 21
    }                                                                                                                 // 22
  });                                                                                                                 // 23
                                                                                                                      // 24
  Herald.collection.update(notification._id, { $set: { escalated: true } } );                                         // 25
}                                                                                                                     // 26
                                                                                                                      // 27
Meteor.methods({                                                                                                      // 28
  /**                                                                                                                 // 29
   * Server method to call Herald.escalate out of the queue package                                                   // 30
   *                                                                                                                  // 31
   * @param {string} notificationId                                                                                   // 32
   * @param {string} medium                                                                                           // 33
   */                                                                                                                 // 34
  heraldEscalate: function (notificationId, medium) {                                                                 // 35
    try {                                                                                                             // 36
      Herald.escalate(notificationId, medium);                                                                        // 37
    } catch (e) {                                                                                                     // 38
      throw new Meteor.Error("Can't start Herald.escalate: " + e);                                                    // 39
    }                                                                                                                 // 40
  }                                                                                                                   // 41
});                                                                                                                   // 42
                                                                                                                      // 43
                                                                                                                      // 44
Herald.escalate = function (notificationId, medium) {                                                                 // 45
  var notification = Herald.collection.findOne(notificationId);                                                       // 46
  if (!notification) return; //notification has been removed                                                          // 47
  if (notification.read) return; //don't escalate a read notification!                                                // 48
  if (!notification.media[medium].send || notification.media[medium].sent) return; //already sent/don't send          // 49
  if (Herald.settings.overrides[medium]) return; //disabled by override                                               // 50
                                                                                                                      // 51
  var user = Meteor.users.findOne(notification.userId);                                                               // 52
  if (!user) return; //user has been removed                                                                          // 53
                                                                                                                      // 54
  var run = true; //does the user want you to send on this medium?                                                    // 55
  if (!Herald.userPreference(user, medium, notification.courier)) run = false;                                        // 56
                                                                                                                      // 57
  var courier = Herald._getCourier(notification.courier);                                                             // 58
  var courierMedium = courier && courier.media[medium];                                                               // 59
  var thisOnRun = courierMedium && courierMedium.onRun;                                                               // 60
                                                                                                                      // 61
  if (_.isFunction(thisOnRun)) {                                                                                      // 62
    var result = thisOnRun.call(new onRun(), notification, user, run);                                                // 63
    if (!result.command) throw new Error('Herald:' + medium + ' onRun did not return a command');                     // 64
    run = onRunResolve(notification, medium, result, run);                                                            // 65
  }                                                                                                                   // 66
                                                                                                                      // 67
  if (run) {                                                                                                          // 68
    Herald._serverRunners[medium].call(courierMedium, notification, user);                                            // 69
    var query = Herald._setProperty('media.' + medium, { send: false, sent: true });                                  // 70
  } else {                                                                                                            // 71
    var query = Herald._setProperty('media.' + medium + '.send', false);                                              // 72
  }                                                                                                                   // 73
                                                                                                                      // 74
  Herald.collection.update(notification._id, { $set: query } );                                                       // 75
};                                                                                                                    // 76
                                                                                                                      // 77
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/kestanous:herald/server/publish.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// only publish notifications belonging to the current user                                                           // 1
Meteor.publish('notifications', function () {                                                                         // 2
  var media = _.keys(Herald._clientRunners).map(function (key) {                                                      // 3
    return Herald._setProperty('media.' + key, { send: true, sent: false });                                          // 4
  });                                                                                                                 // 5
  return Herald.collection.find({ userId: this.userId, $or: media });                                                 // 6
});                                                                                                                   // 7
                                                                                                                      // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['kestanous:herald'] = {
  Herald: Herald
};

})();

//# sourceMappingURL=kestanous_herald.js.map
