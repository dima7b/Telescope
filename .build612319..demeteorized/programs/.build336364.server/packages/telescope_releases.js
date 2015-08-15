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
var Events = Package['telescope:events'].Events;
var Settings = Package['telescope:settings'].Settings;
var Users = Package['telescope:users'].Users;
var Comments = Package['telescope:comments'].Comments;
var Posts = Package['telescope:posts'].Posts;
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
var Releases, __, translations;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:releases/package-i18n.js                                                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
TAPi18n.packages["telescope:releases"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                     // 2
// define package's translation function (proxy to the i18next)                                                      // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                     // 4
                                                                                                                     // 5
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:releases/lib/releases.js                                                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Releases = new Meteor.Collection('releases');                                                                        // 1
                                                                                                                     // 2
Telescope.modules.add("hero", {                                                                                      // 3
  template: 'current_release'                                                                                        // 4
});                                                                                                                  // 5
                                                                                                                     // 6
Telescope.subscriptions.preload('currentRelease');                                                                   // 7
                                                                                                                     // 8
Meteor.startup(function () {                                                                                         // 9
  Releases.allow({                                                                                                   // 10
    insert: Users.is.adminById,                                                                                      // 11
    update: Users.is.adminById,                                                                                      // 12
    remove: Users.is.adminById                                                                                       // 13
  });                                                                                                                // 14
});                                                                                                                  // 15
                                                                                                                     // 16
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:releases/lib/server/publications.js                                                            //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.publish('currentRelease', function() {                                                                        // 1
  if(Users.is.adminById(this.userId)){                                                                               // 2
    return Releases.find({}, {sort: {number: -1}, limit: 1});                                                        // 3
  }                                                                                                                  // 4
  return [];                                                                                                         // 5
});                                                                                                                  // 6
                                                                                                                     // 7
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:releases/lib/server/import_releases.js                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var importRelease = function (number) {                                                                              // 1
  var releaseNotes = Assets.getText("releases/" + number + ".md");                                                   // 2
                                                                                                                     // 3
  if (!Releases.findOne({number: number})) {                                                                         // 4
                                                                                                                     // 5
    var release = {                                                                                                  // 6
      number: number,                                                                                                // 7
      notes: releaseNotes,                                                                                           // 8
      createdAt: new Date(),                                                                                         // 9
      read: false                                                                                                    // 10
    };                                                                                                               // 11
    Releases.insert(release);                                                                                        // 12
                                                                                                                     // 13
  } else {                                                                                                           // 14
                                                                                                                     // 15
    // if release note already exists, update its content in case it's been updated                                  // 16
    Releases.update({number: number}, {$set: {notes: releaseNotes}});                                                // 17
                                                                                                                     // 18
  }                                                                                                                  // 19
};                                                                                                                   // 20
                                                                                                                     // 21
Meteor.startup(function () {                                                                                         // 22
                                                                                                                     // 23
  importRelease('0.11.0');                                                                                           // 24
  importRelease('0.11.1');                                                                                           // 25
  importRelease('0.12.0');                                                                                           // 26
  importRelease('0.13.0');                                                                                           // 27
  importRelease('0.14.0');                                                                                           // 28
  importRelease('0.14.1');                                                                                           // 29
  importRelease('0.14.2');                                                                                           // 30
  importRelease('0.14.3');                                                                                           // 31
  importRelease('0.15.0');                                                                                           // 32
  importRelease('0.20.4');                                                                                           // 33
  importRelease('0.20.5');                                                                                           // 34
  importRelease('0.20.6');                                                                                           // 35
  importRelease('0.21.1');                                                                                           // 36
  importRelease('0.22.1');                                                                                           // 37
  importRelease('0.22.2');                                                                                           // 38
                                                                                                                     // 39
  // if this is before the first run, mark all release notes as read to avoid showing them                           // 40
  if (!Events.findOne({name: 'firstRun'})) {                                                                         // 41
    Releases.update({}, {$set: {read: true}}, {multi: true});                                                        // 42
  }                                                                                                                  // 43
                                                                                                                     // 44
});                                                                                                                  // 45
                                                                                                                     // 46
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:releases/Applications/MAMP/websites/stewardsof/packages/telescope-releases/i18n/en.i18n.js     //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var _ = Package.underscore._,                                                                                        // 1
    package_name = "telescope:releases",                                                                             // 2
    namespace = "telescope:releases";                                                                                // 3
                                                                                                                     // 4
if (package_name != "project") {                                                                                     // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                            // 6
}                                                                                                                    // 7
// integrate the fallback language translations                                                                      // 8
translations = {};                                                                                                   // 9
translations[namespace] = {"telescope_has_been_updated":"Telescope has been updated."};                              // 10
TAPi18n._loadLangFileObject("en", translations);                                                                     // 11
TAPi18n._registerServerTranslator("en", namespace);                                                                  // 12
                                                                                                                     // 13
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:releases'] = {
  Releases: Releases
};

})();

//# sourceMappingURL=telescope_releases.js.map
