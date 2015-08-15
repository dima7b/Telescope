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
var Searches, __, translations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:search/lib/search.js                                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// push "search" template to primaryNav                                                                            // 1
Telescope.modules.add("primaryNav", {                                                                              // 2
  template: 'search',                                                                                              // 3
  order: 100                                                                                                       // 4
});                                                                                                                // 5
                                                                                                                   // 6
Telescope.modules.add("mobileNav", {                                                                               // 7
  template: 'search',                                                                                              // 8
  order: 1                                                                                                         // 9
});                                                                                                                // 10
                                                                                                                   // 11
Telescope.modules.add("adminMenu", {                                                                               // 12
  route: 'searchLogs',                                                                                             // 13
  label: 'search_logs',                                                                                            // 14
  description: 'see_what_people_are_searching_for'                                                                 // 15
});                                                                                                                // 16
                                                                                                                   // 17
Telescope.colorElements.add('.search .search-field', 'secondaryContrastColor');                                    // 18
                                                                                                                   // 19
Searches = new Meteor.Collection("searches", {                                                                     // 20
  schema: new SimpleSchema({                                                                                       // 21
    _id: {                                                                                                         // 22
      type: String,                                                                                                // 23
      optional: true                                                                                               // 24
    },                                                                                                             // 25
    timestamp: {                                                                                                   // 26
      type: Date                                                                                                   // 27
    },                                                                                                             // 28
    keyword: {                                                                                                     // 29
      type: String                                                                                                 // 30
    }                                                                                                              // 31
  })                                                                                                               // 32
});                                                                                                                // 33
                                                                                                                   // 34
Meteor.startup(function() {                                                                                        // 35
  Searches.allow({                                                                                                 // 36
    update: Users.is.adminById                                                                                     // 37
  , remove: Users.is.adminById                                                                                     // 38
  });                                                                                                              // 39
});                                                                                                                // 40
                                                                                                                   // 41
// search post list parameters                                                                                     // 42
Posts.views.add("search", function (terms, baseParameters) {                                                       // 43
  // if query is empty, just return parameters that will result in an empty collection                             // 44
  if(typeof terms.query === 'undefined' || !terms.query)                                                           // 45
    return {find:{_id: 0}};                                                                                        // 46
                                                                                                                   // 47
  var parameters = Telescope.utils.deepExtend(true, baseParameters, {                                              // 48
    find: {                                                                                                        // 49
      $or: [                                                                                                       // 50
        {title: {$regex: terms.query, $options: 'i'}},                                                             // 51
        {url: {$regex: terms.query, $options: 'i'}},                                                               // 52
        {body: {$regex: terms.query, $options: 'i'}}                                                               // 53
      ]                                                                                                            // 54
    }                                                                                                              // 55
  });                                                                                                              // 56
  return parameters;                                                                                               // 57
});                                                                                                                // 58
                                                                                                                   // 59
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:search/package-i18n.js                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
TAPi18n.packages["telescope:search"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                   // 2
// define package's translation function (proxy to the i18next)                                                    // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                   // 4
                                                                                                                   // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:search/lib/server/log_search.js                                                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var logSearch = function (keyword) {                                                                               // 1
  Searches.insert({                                                                                                // 2
    timestamp: new Date(),                                                                                         // 3
    keyword: keyword                                                                                               // 4
  });                                                                                                              // 5
};                                                                                                                 // 6
                                                                                                                   // 7
Meteor.methods({                                                                                                   // 8
  logSearch: function (keyword) {                                                                                  // 9
    check(keyword, String);                                                                                        // 10
    logSearch.call(this, keyword);                                                                                 // 11
  }                                                                                                                // 12
});                                                                                                                // 13
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:search/lib/server/publications.js                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Meteor.publish('searches', function(limit) {                                                                       // 1
  limit = limit || 20;                                                                                             // 2
  if(Users.is.adminById(this.userId)){                                                                             // 3
   return Searches.find({}, {limit: limit, sort: {timestamp: -1}});                                                // 4
  }                                                                                                                // 5
  return [];                                                                                                       // 6
});                                                                                                                // 7
                                                                                                                   // 8
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:search/Applications/MAMP/websites/stewardsof/packages/telescope-search/i18n/de.i18n.js       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:search",                                                                             // 2
    namespace = "telescope:search";                                                                                // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                    // 8
  TAPi18n.translations["de"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                         // 12
  TAPi18n.translations["de"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["de"][namespace], {"load_more":"Mehr Laden","search":"Suchen"});                     // 16
TAPi18n._registerServerTranslator("de", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:search/Applications/MAMP/websites/stewardsof/packages/telescope-search/i18n/en.i18n.js       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:search",                                                                             // 2
    namespace = "telescope:search";                                                                                // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
// integrate the fallback language translations                                                                    // 8
translations = {};                                                                                                 // 9
translations[namespace] = {"load_more":"Load more","search":"Search","search_logs":"Search Logs","see_what_people_are_searching_for":"See what people are searching for."};
TAPi18n._loadLangFileObject("en", translations);                                                                   // 11
TAPi18n._registerServerTranslator("en", namespace);                                                                // 12
                                                                                                                   // 13
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:search/Applications/MAMP/websites/stewardsof/packages/telescope-search/i18n/es.i18n.js       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:search",                                                                             // 2
    namespace = "telescope:search";                                                                                // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                    // 8
  TAPi18n.translations["es"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                         // 12
  TAPi18n.translations["es"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["es"][namespace], {"load_more":"Cargar más","search":"Búsqueda","search_logs":"Buscar Registros","see_what_people_are_searching_for":"Vea lo que la gente está buscando."});
TAPi18n._registerServerTranslator("es", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:search/Applications/MAMP/websites/stewardsof/packages/telescope-search/i18n/fr.i18n.js       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:search",                                                                             // 2
    namespace = "telescope:search";                                                                                // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                    // 8
  TAPi18n.translations["fr"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                         // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["fr"][namespace], {"load_more":"Charger la suite","search":"Rechercher","search_logs":"Historique de recherches","see_what_people_are_searching_for":"Voir ce que les gens recherchent."});
TAPi18n._registerServerTranslator("fr", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:search/Applications/MAMP/websites/stewardsof/packages/telescope-search/i18n/it.i18n.js       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:search",                                                                             // 2
    namespace = "telescope:search";                                                                                // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                    // 8
  TAPi18n.translations["it"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                         // 12
  TAPi18n.translations["it"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["it"][namespace], {"load_more":"Carica altro","search":"Ricerca"});                  // 16
TAPi18n._registerServerTranslator("it", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:search/Applications/MAMP/websites/stewardsof/packages/telescope-search/i18n/zh-CN.i18n.js    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:search",                                                                             // 2
    namespace = "telescope:search";                                                                                // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                 // 8
  TAPi18n.translations["zh-CN"] = {};                                                                              // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                      // 12
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                   // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["zh-CN"][namespace], {"load_more":"加载更多","search":"Search"});                        // 16
TAPi18n._registerServerTranslator("zh-CN", namespace);                                                             // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:search'] = {};

})();

//# sourceMappingURL=telescope_search.js.map
