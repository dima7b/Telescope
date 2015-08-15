(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var EventEmitter;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/raix:eventemitter/eventemitter.server.js                 //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
/* global EventEmitter: true */                                      // 1
EventEmitter = Npm.require('events').EventEmitter;                   // 2
                                                                     // 3
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['raix:eventemitter'] = {
  EventEmitter: EventEmitter
};

})();

//# sourceMappingURL=raix_eventemitter.js.map
