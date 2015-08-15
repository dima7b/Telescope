(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Telescope = Package['telescope:lib'].Telescope;
var _ = Package.underscore._;
var getTemplate = Package['telescope:lib'].getTemplate;
var templates = Package['telescope:lib'].templates;
var themeSettings = Package['telescope:lib'].themeSettings;
var getVotePower = Package['telescope:lib'].getVotePower;
var i18n = Package['telescope:i18n'].i18n;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var Accounts = Package['accounts-base'].Accounts;
var check = Package.check.check;
var Match = Package.check.Match;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var Email = Package.email.Email;
var Spiderable = Package.spiderable.Spiderable;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var Router = Package['iron:router'].Router;
var RouteController = Package['iron:router'].RouteController;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var FastRender = Package['meteorhacks:fast-render'].FastRender;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var SyncedCron = Package['percolatestudio:synced-cron'].SyncedCron;
var tinycolor = Package['aramk:tinycolor'].tinycolor;
var moment = Package['momentjs:moment'].moment;
var ReactiveTable = Package['aslagle:reactive-table'].ReactiveTable;
var Avatar = Package['utilities:avatar'].Avatar;
var sanitizeHtml = Package['djedi:sanitize-html'].sanitizeHtml;
var Gravatar = Package['jparker:gravatar'].Gravatar;
var MeteorFilesHelpers = Package['sanjo:meteor-files-helpers'].MeteorFilesHelpers;
var Handlebars = Package.ui.Handlebars;
var OriginalHandlebars = Package['cmather:handlebars-server'].OriginalHandlebars;
var getSlug = Package['ongoworks:speakingurl'].getSlug;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Iron = Package['iron:core'].Iron;
var AccountsTemplates = Package['useraccounts:core'].AccountsTemplates;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Log = Package.logging.Log;
var Tracker = Package.deps.Tracker;
var Deps = Package.deps.Deps;
var DDP = Package.livedata.DDP;
var DDPServer = Package.livedata.DDPServer;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Spacebars = Package.spacebars.Spacebars;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var T9n = Package['softwarerero:accounts-t9n'].T9n;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Events;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/telescope:events/lib/events.js                                                   //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
Events = new Mongo.Collection('events');                                                     // 1
                                                                                             // 2
Events.schema = new SimpleSchema({                                                           // 3
  createdAt: {                                                                               // 4
    type: Date                                                                               // 5
  },                                                                                         // 6
  name: {                                                                                    // 7
    type: String                                                                             // 8
  },                                                                                         // 9
  description: {                                                                             // 10
    type: String,                                                                            // 11
    optional: true                                                                           // 12
  },                                                                                         // 13
  unique: {                                                                                  // 14
    type: Boolean,                                                                           // 15
    optional: true                                                                           // 16
  },                                                                                         // 17
  important: { // marking an event as important means it should never be erased              // 18
    type: Boolean,                                                                           // 19
    optional: true                                                                           // 20
  },                                                                                         // 21
  properties: {                                                                              // 22
    type: Object,                                                                            // 23
    optional: true,                                                                          // 24
    blackbox: true                                                                           // 25
  }                                                                                          // 26
});                                                                                          // 27
                                                                                             // 28
Events.schema.internationalize();                                                            // 29
                                                                                             // 30
Events.attachSchema(Events.schema);                                                          // 31
                                                                                             // 32
if (Meteor.isServer) {                                                                       // 33
  Events.log = function (event) {                                                            // 34
                                                                                             // 35
    // if event is supposed to be unique, check if it has already been logged                // 36
    if (!!event.unique && !!Events.findOne({name: event.name})) {                            // 37
      return;                                                                                // 38
    }                                                                                        // 39
                                                                                             // 40
    event.createdAt = new Date();                                                            // 41
                                                                                             // 42
    Events.insert(event);                                                                    // 43
                                                                                             // 44
  };                                                                                         // 45
}                                                                                            // 46
                                                                                             // 47
Events.track = function(event, properties){                                                  // 48
  // console.log('trackevent: ', event, properties);                                         // 49
  properties = properties || {};                                                             // 50
  //TODO                                                                                     // 51
  // add event to an Events collection for logging and buffering purposes                    // 52
  if(Meteor.isClient){                                                                       // 53
    if(typeof mixpanel !== 'undefined' && typeof mixpanel.track !== 'undefined'){            // 54
      mixpanel.track(event, properties);                                                     // 55
    }                                                                                        // 56
    if(typeof GoSquared !== 'undefined' && typeof GoSquared.DefaultTracker !== 'undefined'){ // 57
      GoSquared.DefaultTracker.TrackEvent(event, JSON.stringify(properties));                // 58
    }                                                                                        // 59
  }                                                                                          // 60
};                                                                                           // 61
                                                                                             // 62
///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:events'] = {
  Events: Events
};

})();

//# sourceMappingURL=telescope_events.js.map
