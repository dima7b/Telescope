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
var __, daysPerPage, translations;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/package-i18n.js                                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
TAPi18n.packages["telescope:daily"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                  // 2
// define package's translation function (proxy to the i18next)                                                   // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                  // 4
                                                                                                                  // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/lib/daily.js                                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
daysPerPage = 5;                                                                                                  // 1
                                                                                                                  // 2
Telescope.menuItems.add("viewsMenu", {                                                                            // 3
  route: 'postsDaily',                                                                                            // 4
  label: 'daily',                                                                                                 // 5
  description: 'day_by_day_view'                                                                                  // 6
});                                                                                                               // 7
                                                                                                                  // 8
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/lib/routes.js                                                                         //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
/**                                                                                                               // 1
 * Controller for daily view                                                                                      // 2
 */                                                                                                               // 3
Posts.controllers.daily = Posts.controllers.list.extend({                                                         // 4
                                                                                                                  // 5
  view: "daily",                                                                                                  // 6
                                                                                                                  // 7
  template: function() {                                                                                          // 8
    // use a function to make sure the template is evaluated *after* any template overrides                       // 9
    // TODO: still needed?                                                                                        // 10
    return 'posts_daily';                                                                                         // 11
  },                                                                                                              // 12
                                                                                                                  // 13
  data: function () {                                                                                             // 14
    var daysCount = this.params.daysCount ? this.params.daysCount : daysPerPage;                                  // 15
    return {                                                                                                      // 16
      daysCount: daysCount                                                                                        // 17
    };                                                                                                            // 18
  }                                                                                                               // 19
                                                                                                                  // 20
});                                                                                                               // 21
                                                                                                                  // 22
Meteor.startup(function () {                                                                                      // 23
                                                                                                                  // 24
  Router.route('/daily/:daysCount?', {                                                                            // 25
    name: 'postsDaily',                                                                                           // 26
    template: 'posts_daily',                                                                                      // 27
    controller: Posts.controllers.daily                                                                           // 28
  });                                                                                                             // 29
                                                                                                                  // 30
});                                                                                                               // 31
                                                                                                                  // 32
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/lib/server/fastrender.js                                                              //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
                                                                                                                  // 1
var getDays = function (daysCount) {                                                                              // 2
  var daysArray = [];                                                                                             // 3
  // var days = this.days;                                                                                        // 4
  for (var i = 0; i < daysCount; i++) {                                                                           // 5
    daysArray.push({                                                                                              // 6
      date: moment().subtract(i, 'days').startOf('day').toDate(),                                                 // 7
      index: i                                                                                                    // 8
    });                                                                                                           // 9
  }                                                                                                               // 10
  return daysArray;                                                                                               // 11
};                                                                                                                // 12
                                                                                                                  // 13
FastRender.route('/daily/:daysCount?',function (params) {                                                         // 14
                                                                                                                  // 15
  var fr = this;                                                                                                  // 16
  var daysCount = params.daysCount ? params.daysCount : daysPerPage;                                              // 17
  var days = getDays(daysCount);                                                                                  // 18
                                                                                                                  // 19
  days.forEach(function (day) {                                                                                   // 20
                                                                                                                  // 21
    var subscriptionTerms = {                                                                                     // 22
      view: "singleday",                                                                                          // 23
      date: day.date,                                                                                             // 24
      after: moment(day.date).startOf('day').toDate(),                                                            // 25
      before: moment(day.date).endOf('day').toDate()                                                              // 26
    }                                                                                                             // 27
    fr.subscribe('postsList', subscriptionTerms);                                                                 // 28
                                                                                                                  // 29
  })                                                                                                              // 30
                                                                                                                  // 31
});                                                                                                               // 32
                                                                                                                  // 33
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/ar.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["ar"])) {                                                                   // 8
  TAPi18n.translations["ar"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["ar"][namespace])) {                                                        // 12
  TAPi18n.translations["ar"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["ar"][namespace], {});                                                              // 16
TAPi18n._registerServerTranslator("ar", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/bg.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["bg"])) {                                                                   // 8
  TAPi18n.translations["bg"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["bg"][namespace])) {                                                        // 12
  TAPi18n.translations["bg"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["bg"][namespace], {});                                                              // 16
TAPi18n._registerServerTranslator("bg", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/de.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                   // 8
  TAPi18n.translations["de"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                        // 12
  TAPi18n.translations["de"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["de"][namespace], {"daily":"Daily"});                                               // 16
TAPi18n._registerServerTranslator("de", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/el.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["el"])) {                                                                   // 8
  TAPi18n.translations["el"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["el"][namespace])) {                                                        // 12
  TAPi18n.translations["el"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["el"][namespace], {});                                                              // 16
TAPi18n._registerServerTranslator("el", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/en.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
// integrate the fallback language translations                                                                   // 8
translations = {};                                                                                                // 9
translations[namespace] = {"daily":"Daily","day_by_day_view":"The most popular posts of each day.","load_next_days":"Load Next Days"};
TAPi18n._loadLangFileObject("en", translations);                                                                  // 11
TAPi18n._registerServerTranslator("en", namespace);                                                               // 12
                                                                                                                  // 13
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/es.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                   // 8
  TAPi18n.translations["es"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                        // 12
  TAPi18n.translations["es"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["es"][namespace], {"daily":"Diario","day_by_day_view":"Los posts mas populares de cada día.","load_next_days":"Cargar días siguientes"});
TAPi18n._registerServerTranslator("es", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/fr.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                   // 8
  TAPi18n.translations["fr"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                        // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["fr"][namespace], {"daily":"Jour par jour","day_by_day_view":"Les posts les plus populaires de chaque jour.","load_next_days":"Chargez les jours suivants"});
TAPi18n._registerServerTranslator("fr", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/it.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                   // 8
  TAPi18n.translations["it"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                        // 12
  TAPi18n.translations["it"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["it"][namespace], {"daily":"Daily"});                                               // 16
TAPi18n._registerServerTranslator("it", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/nl.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["nl"])) {                                                                   // 8
  TAPi18n.translations["nl"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["nl"][namespace])) {                                                        // 12
  TAPi18n.translations["nl"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["nl"][namespace], {});                                                              // 16
TAPi18n._registerServerTranslator("nl", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/pl.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["pl"])) {                                                                   // 8
  TAPi18n.translations["pl"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["pl"][namespace])) {                                                        // 12
  TAPi18n.translations["pl"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["pl"][namespace], {"daily":"Dziennie","day_by_day_view":"Najpopularniejsze posty każdego dnia.","load_next_days":"Wczytaj kolejne dni"});
TAPi18n._registerServerTranslator("pl", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/pt-BR.i18n.js     //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["pt-BR"])) {                                                                // 8
  TAPi18n.translations["pt-BR"] = {};                                                                             // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["pt-BR"][namespace])) {                                                     // 12
  TAPi18n.translations["pt-BR"][namespace] = {};                                                                  // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["pt-BR"][namespace], {"daily":"Diário","day_by_day_view":"As postagens mais populares de cada dia.","load_next_days":"Carregar Próximos Dias"});
TAPi18n._registerServerTranslator("pt-BR", namespace);                                                            // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/ro.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["ro"])) {                                                                   // 8
  TAPi18n.translations["ro"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["ro"][namespace])) {                                                        // 12
  TAPi18n.translations["ro"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["ro"][namespace], {"daily":"Zilnic","day_by_day_view":"Cele mai populare posturi din fiecare zi.","load_next_days":"Încărcați următoarele zile"});
TAPi18n._registerServerTranslator("ro", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/ru.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["ru"])) {                                                                   // 8
  TAPi18n.translations["ru"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["ru"][namespace])) {                                                        // 12
  TAPi18n.translations["ru"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["ru"][namespace], {});                                                              // 16
TAPi18n._registerServerTranslator("ru", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/sv.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["sv"])) {                                                                   // 8
  TAPi18n.translations["sv"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["sv"][namespace])) {                                                        // 12
  TAPi18n.translations["sv"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["sv"][namespace], {"daily":"Dagligen","day_by_day_view":"De mest populära inläggen varje dag.","load_next_days":"Hämta nästkommande dagar."});
TAPi18n._registerServerTranslator("sv", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/tr.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["tr"])) {                                                                   // 8
  TAPi18n.translations["tr"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["tr"][namespace])) {                                                        // 12
  TAPi18n.translations["tr"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["tr"][namespace], {});                                                              // 16
TAPi18n._registerServerTranslator("tr", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/vi.i18n.js        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["vi"])) {                                                                   // 8
  TAPi18n.translations["vi"] = {};                                                                                // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["vi"][namespace])) {                                                        // 12
  TAPi18n.translations["vi"][namespace] = {};                                                                     // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["vi"][namespace], {});                                                              // 16
TAPi18n._registerServerTranslator("vi", namespace);                                                               // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:daily/Applications/MAMP/websites/stewardsof/packages/telescope-daily/i18n/zh-CN.i18n.js     //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:daily",                                                                             // 2
    namespace = "telescope:daily";                                                                                // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                // 8
  TAPi18n.translations["zh-CN"] = {};                                                                             // 9
}                                                                                                                 // 10
                                                                                                                  // 11
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                     // 12
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                  // 13
}                                                                                                                 // 14
                                                                                                                  // 15
_.extend(TAPi18n.translations["zh-CN"][namespace], {"daily":"Daily"});                                            // 16
TAPi18n._registerServerTranslator("zh-CN", namespace);                                                            // 17
                                                                                                                  // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:daily'] = {};

})();

//# sourceMappingURL=telescope_daily.js.map
