(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Telescope = Package['telescope:lib'].Telescope;
var _ = Package.underscore._;
var getTemplate = Package['telescope:lib'].getTemplate;
var templates = Package['telescope:lib'].templates;
var themeSettings = Package['telescope:lib'].themeSettings;
var getVotePower = Package['telescope:lib'].getVotePower;
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
var i18n;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/telescope:i18n/i18n.js                                                          //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
i18n = {};                                                                                  // 1
                                                                                            // 2
// do this better:                                                                          // 3
i18n.setLanguage = function (language) {                                                    // 4
  // Session.set('i18nReady', false);                                                       // 5
  // console.log('i18n loading… '+language)                                                 // 6
                                                                                            // 7
  // moment                                                                                 // 8
  Session.set('momentReady', false);                                                        // 9
  // console.log('moment loading…')                                                         // 10
  if (language.toLowerCase() === "en") {                                                    // 11
    Session.set('momentReady', true);                                                       // 12
  } else {                                                                                  // 13
    $.getScript("//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/lang/" + language.toLowerCase() + ".js", function (result) {
      moment.locale(language);                                                              // 15
      Session.set('momentReady', true);                                                     // 16
      Session.set('momentLocale', language);                                                // 17
      // console.log('moment loaded!')                                                      // 18
    });                                                                                     // 19
  }                                                                                         // 20
                                                                                            // 21
  // TAPi18n                                                                                // 22
  Session.set("TAPi18nReady", false);                                                       // 23
  // console.log('TAPi18n loading…')                                                        // 24
  TAPi18n.setLanguage(language)                                                             // 25
    .done(function () {                                                                     // 26
      Session.set("TAPi18nReady", true);                                                    // 27
      // console.log('TAPi18n loaded!')                                                     // 28
    });                                                                                     // 29
                                                                                            // 30
  // T9n                                                                                    // 31
  T9n.setLanguage(language);                                                                // 32
};                                                                                          // 33
                                                                                            // 34
i18n.t = function (str, options) {                                                          // 35
  if (Meteor.isServer) {                                                                    // 36
    return TAPi18n.__(str, options, Settings.get('language', 'en'));                        // 37
  } else {                                                                                  // 38
    return TAPi18n.__(str, options);                                                        // 39
  }                                                                                         // 40
};                                                                                          // 41
                                                                                            // 42
SimpleSchema.prototype.internationalize = function () {                                     // 43
  var schema = this._schema;                                                                // 44
                                                                                            // 45
  _.each(schema, function (property, key) {                                                 // 46
    if (!property.label) {                                                                  // 47
      schema[key].label = function () {                                                     // 48
        // if property is nested ("telescope.email"), only consider the last part ("email") // 49
        if (key.indexOf(".") !== -1) {                                                      // 50
          key = _.last(key.split("."));                                                     // 51
        }                                                                                   // 52
        return i18n.t(key);                                                                 // 53
      };                                                                                    // 54
    }                                                                                       // 55
  });                                                                                       // 56
  return this;                                                                              // 57
};                                                                                          // 58
                                                                                            // 59
Meteor.startup(function () {                                                                // 60
                                                                                            // 61
  if (Meteor.isClient) {                                                                    // 62
    i18n.setLanguage(Settings.get('language', 'en'));                                       // 63
  }                                                                                         // 64
                                                                                            // 65
});                                                                                         // 66
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:i18n'] = {
  i18n: i18n
};

})();

//# sourceMappingURL=telescope_i18n.js.map
