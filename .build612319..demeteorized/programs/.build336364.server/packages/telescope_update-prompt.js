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
var compareVersions;

(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/telescope:update-prompt/lib/package_versions.js                     //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
Meteor.methods({                                                                // 1
  getPackageVersions: function () {                                             // 2
    if (Meteor.isServer) {                                                      // 3
      var url = "https://atmospherejs.com/a/packages/findByNames";              // 4
      var packageNames = _.filter(_.keys(Package), function (packageName){      // 5
        return packageName.indexOf("telescope") !== -1;                         // 6
      });                                                                       // 7
      this.unblock;                                                             // 8
      try {                                                                     // 9
        var result = HTTP.get(url, {                                            // 10
          headers: {                                                            // 11
            "Accept": "application/json"                                        // 12
          },                                                                    // 13
          params: {                                                             // 14
            names: packageNames                                                 // 15
          }                                                                     // 16
        });                                                                     // 17
        // console.log(result);                                                 // 18
        var packageData = JSON.parse(result.content);                           // 19
        var versionData = packageData.map(function (package){                   // 20
          return {                                                              // 21
            name: package.name,                                                 // 22
            latestVersion: package.latestVersion.version,                       // 23
            currentVersion: MeteorFilesHelpers.getPackageVersion(package.name)  // 24
          };                                                                    // 25
        });                                                                     // 26
        console.log(versionData);                                               // 27
        return versionData;                                                     // 28
      } catch (e) {                                                             // 29
        console.log(e)                                                          // 30
        return e;                                                               // 31
      }                                                                         // 32
    }                                                                           // 33
  }                                                                             // 34
});                                                                             // 35
                                                                                // 36
//////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/telescope:update-prompt/lib/server/phone_home.js                    //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
Meteor.methods({                                                                // 1
  phoneHome: function  () {                                                     // 2
                                                                                // 3
    var url = 'http://version.telescopeapp.org/';                               // 4
                                                                                // 5
    var params = {                                                              // 6
      currentVersion: Telescope.VERSION,                                        // 7
      siteTitle: Settings.get('title'),                                         // 8
      siteUrl: Telescope.utils.getSiteUrl(),                                    // 9
      users: Meteor.users.find().count(),                                       // 10
      posts: Posts.find().count(),                                              // 11
      comments: Comments.find().count()                                         // 12
    };                                                                          // 13
                                                                                // 14
    if(Meteor.user() && Users.is.admin(Meteor.user())){                         // 15
                                                                                // 16
      this.unblock();                                                           // 17
      try {                                                                     // 18
        var result = HTTP.get(url, {                                            // 19
          params: params                                                        // 20
        });                                                                     // 21
        return result;                                                          // 22
      } catch (e) {                                                             // 23
        // Got a network error, time-out or HTTP error in the 400 or 500 range. // 24
        return false;                                                           // 25
      }                                                                         // 26
    }                                                                           // 27
  }                                                                             // 28
});                                                                             // 29
                                                                                // 30
//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:update-prompt'] = {
  compareVersions: compareVersions
};

})();

//# sourceMappingURL=telescope_update-prompt.js.map
