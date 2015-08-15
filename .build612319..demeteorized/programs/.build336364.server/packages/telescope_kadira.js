(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Kadira = Package['meteorhacks:kadira'].Kadira;
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
var __, translations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:kadira/package-i18n.js                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
TAPi18n.packages["telescope:kadira"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                   // 2
// define package's translation function (proxy to the i18next)                                                    // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                   // 4
                                                                                                                   // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:kadira/lib/kadira-settings.js                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var kadiraAppIdProperty = {                                                                                        // 1
  fieldName: "kadiraAppId",                                                                                        // 2
  propertyGroup: "kadira",                                                                                         // 3
  fieldSchema: {                                                                                                   // 4
    type: String,                                                                                                  // 5
    optional: true,                                                                                                // 6
    autoform: {                                                                                                    // 7
      group: "kadira"                                                                                              // 8
    }                                                                                                              // 9
  }                                                                                                                // 10
};                                                                                                                 // 11
Settings.addField(kadiraAppIdProperty);                                                                            // 12
                                                                                                                   // 13
var kadiraAppSecretProperty = {                                                                                    // 14
  fieldName: "kadiraAppSecret",                                                                                    // 15
  propertyGroup: "kadira",                                                                                         // 16
  fieldSchema: {                                                                                                   // 17
    type: String,                                                                                                  // 18
    optional: true,                                                                                                // 19
    private: true,                                                                                                 // 20
    autoform: {                                                                                                    // 21
      group: "kadira",                                                                                             // 22
      class: "private-field"                                                                                       // 23
    }                                                                                                              // 24
  }                                                                                                                // 25
};                                                                                                                 // 26
Settings.addField(kadiraAppSecretProperty);                                                                        // 27
                                                                                                                   // 28
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:kadira/lib/server/kadira.js                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Meteor.startup(function() {                                                                                        // 1
  if(!!Settings.get('kadiraAppId') && !!Settings.get('kadiraAppSecret')){                                          // 2
    Kadira.connect(Settings.get('kadiraAppId'), Settings.get('kadiraAppSecret'));                                  // 3
  }                                                                                                                // 4
});                                                                                                                // 5
                                                                                                                   // 6
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:kadira/Applications/MAMP/websites/stewardsof/packages/telescope-kadira/i18n/en.i18n.js       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:kadira",                                                                             // 2
    namespace = "telescope:kadira";                                                                                // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
// integrate the fallback language translations                                                                    // 8
translations = {};                                                                                                 // 9
translations[namespace] = {"kadiraAppId":"Kadira App ID","kadiraAppSecret":"Kadira App Secret"};                   // 10
TAPi18n._loadLangFileObject("en", translations);                                                                   // 11
TAPi18n._registerServerTranslator("en", namespace);                                                                // 12
                                                                                                                   // 13
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:kadira'] = {};

})();

//# sourceMappingURL=telescope_kadira.js.map
