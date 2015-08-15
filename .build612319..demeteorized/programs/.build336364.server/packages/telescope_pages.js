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
var Pages, translations;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:pages/lib/pages.js                                                                        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Pages = new Mongo.Collection('pages');                                                                          // 1
                                                                                                                // 2
Telescope.subscriptions.preload('pages');                                                                       // 3
                                                                                                                // 4
Pages.schema = new SimpleSchema({                                                                               // 5
  title: {                                                                                                      // 6
    type: String                                                                                                // 7
  },                                                                                                            // 8
  slug: {                                                                                                       // 9
    type: String,                                                                                               // 10
    optional: true                                                                                              // 11
  },                                                                                                            // 12
  content: {                                                                                                    // 13
    type: String,                                                                                               // 14
    autoform: {                                                                                                 // 15
      rows: 10                                                                                                  // 16
    }                                                                                                           // 17
  },                                                                                                            // 18
  order: {                                                                                                      // 19
    type: Number,                                                                                               // 20
    optional: true                                                                                              // 21
  }                                                                                                             // 22
});                                                                                                             // 23
                                                                                                                // 24
Pages.schema.internationalize();                                                                                // 25
                                                                                                                // 26
Pages.attachSchema(Pages.schema);                                                                               // 27
                                                                                                                // 28
Pages.before.insert(function (userId, doc) {                                                                    // 29
  // if no slug has been provided, generate one                                                                 // 30
  if (!doc.slug)                                                                                                // 31
    doc.slug = Telescope.utils.slugify(doc.title);                                                              // 32
});                                                                                                             // 33
                                                                                                                // 34
Telescope.modules.add("primaryNav", {                                                                           // 35
  template: "pages_menu",                                                                                       // 36
  order: 5                                                                                                      // 37
});                                                                                                             // 38
                                                                                                                // 39
Telescope.modules.add("mobileNav", {                                                                            // 40
  template: 'pages_menu',                                                                                       // 41
  order: 5                                                                                                      // 42
});                                                                                                             // 43
                                                                                                                // 44
Meteor.startup(function () {                                                                                    // 45
  Pages.allow({                                                                                                 // 46
    insert: Users.is.adminById,                                                                                 // 47
    update: Users.is.adminById,                                                                                 // 48
    remove: Users.is.adminById                                                                                  // 49
  });                                                                                                           // 50
                                                                                                                // 51
  Meteor.methods({                                                                                              // 52
    insertPage: function(pageTitle, pageContent){                                                               // 53
      check(pageTitle, String);                                                                                 // 54
      check(pageContent, String);                                                                               // 55
      return Feeds.insert({title: pageTitle, content: pageContent});                                            // 56
    }                                                                                                           // 57
  });                                                                                                           // 58
});                                                                                                             // 59
                                                                                                                // 60
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:pages/lib/server/publications.js                                                          //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Meteor.publish('pages', function() {                                                                            // 1
  return Pages.find({});                                                                                        // 2
});                                                                                                             // 3
                                                                                                                // 4
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:pages/Applications/MAMP/websites/stewardsof/packages/telescope-pages/i18n/en.i18n.js      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "project",                                                                                   // 2
    namespace = "project";                                                                                      // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","cdn_path":null}); // 8
TAPi18n.languages_names["en"] = ["English","English"];                                                          // 9
// integrate the fallback language translations                                                                 // 10
translations = {};                                                                                              // 11
translations[namespace] = {"manage_static_pages":"Manage static pages"};                                        // 12
TAPi18n._loadLangFileObject("en", translations);                                                                // 13
TAPi18n._registerServerTranslator("en", namespace);                                                             // 14
                                                                                                                // 15
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:pages'] = {
  Pages: Pages
};

})();

//# sourceMappingURL=telescope_pages.js.map
