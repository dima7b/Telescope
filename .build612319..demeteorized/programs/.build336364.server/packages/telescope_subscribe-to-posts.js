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
var subscribeItem, unsubscribeItem, __, translations;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/telescope:subscribe-to-posts/package-i18n.js                                      //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
TAPi18n.packages["telescope:subscribe-to-posts"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"};
                                                                                              // 2
// define package's translation function (proxy to the i18next)                               // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                              // 4
                                                                                              // 5
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/telescope:subscribe-to-posts/lib/subscribe-to-posts.js                            //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
Users.addField({                                                                              // 1
  fieldName: 'telescope.subscribedItems',                                                     // 2
  fieldSchema: {                                                                              // 3
    type: Object,                                                                             // 4
    optional: true,                                                                           // 5
    blackbox: true,                                                                           // 6
    autoform: {                                                                               // 7
      omit: true                                                                              // 8
    }                                                                                         // 9
  }                                                                                           // 10
});                                                                                           // 11
                                                                                              // 12
Posts.addField({                                                                              // 13
  fieldName: 'subscribers',                                                                   // 14
  fieldSchema: {                                                                              // 15
    type: [String],                                                                           // 16
    optional: true,                                                                           // 17
    autoform: {                                                                               // 18
      omit: true                                                                              // 19
    }                                                                                         // 20
  }                                                                                           // 21
});                                                                                           // 22
                                                                                              // 23
Posts.addField({                                                                              // 24
  fieldName: 'subscriberCount',                                                               // 25
  fieldSchema: {                                                                              // 26
    type: Number,                                                                             // 27
    optional: true,                                                                           // 28
    autoform: {                                                                               // 29
      omit: true                                                                              // 30
    }                                                                                         // 31
  }                                                                                           // 32
});                                                                                           // 33
                                                                                              // 34
Telescope.modules.add("profileEdit", {                                                        // 35
  template: 'user_subscribed_posts',                                                          // 36
  order: 5                                                                                    // 37
});                                                                                           // 38
                                                                                              // 39
Telescope.modules.add("commentThreadBottom", {                                                // 40
  template: 'post_subscribe',                                                                 // 41
  order: 10                                                                                   // 42
});                                                                                           // 43
                                                                                              // 44
Posts.views.add("userSubscribedPosts", function (terms) {                                     // 45
  var user = Meteor.users.findOne(terms.userId),                                              // 46
      postsIds = [];                                                                          // 47
                                                                                              // 48
  if (user.telescope.subscribedItems && user.telescope.subscribedItems.Posts)                 // 49
    postsIds = _.pluck(user.telescope.subscribedItems.Posts, "itemId");                       // 50
                                                                                              // 51
  return {                                                                                    // 52
    find: {_id: {$in: postsIds}},                                                             // 53
    options: {limit: 5, sort: {postedAt: -1}}                                                 // 54
  };                                                                                          // 55
});                                                                                           // 56
                                                                                              // 57
var hasSubscribedItem = function (item, user) {                                               // 58
  return item.subscribers && item.subscribers.indexOf(user._id) != -1;                        // 59
};                                                                                            // 60
                                                                                              // 61
var addSubscribedItem = function (userId, item, collectionName) {                             // 62
  var field = 'telescope.subscribedItems.' + collectionName;                                  // 63
  var add = {};                                                                               // 64
  add[field] = item;                                                                          // 65
  Meteor.users.update({_id: userId}, {                                                        // 66
    $addToSet: add                                                                            // 67
  });                                                                                         // 68
};                                                                                            // 69
                                                                                              // 70
var removeSubscribedItem = function (userId, itemId, collectionName) {                        // 71
  var field = 'telescope.subscribedItems.' + collectionName;                                  // 72
  var remove = {};                                                                            // 73
  remove[field] = {itemId: itemId};                                                           // 74
  Meteor.users.update({_id: userId}, {                                                        // 75
    $pull: remove                                                                             // 76
  });                                                                                         // 77
};                                                                                            // 78
                                                                                              // 79
subscribeItem = function (collection, itemId, user) {                                         // 80
  var item = collection.findOne(itemId),                                                      // 81
      collectionName = collection._name.slice(0,1).toUpperCase() + collection._name.slice(1); // 82
                                                                                              // 83
  if (!user || !item || hasSubscribedItem(item, user))                                        // 84
    return false;                                                                             // 85
                                                                                              // 86
  // author can't subscribe item                                                              // 87
  if (item.userId && item.userId === user._id)                                                // 88
    return false                                                                              // 89
                                                                                              // 90
  // Subscribe                                                                                // 91
  var result = collection.update({_id: itemId, subscribers: { $ne: user._id }}, {             // 92
    $addToSet: {subscribers: user._id},                                                       // 93
    $inc: {subscriberCount: 1}                                                                // 94
  });                                                                                         // 95
                                                                                              // 96
  if (result > 0) {                                                                           // 97
    // Add item to list of subscribed items                                                   // 98
    var obj = {                                                                               // 99
      itemId: item._id,                                                                       // 100
      subscribedAt: new Date()                                                                // 101
    };                                                                                        // 102
    addSubscribedItem(user._id, obj, collectionName);                                         // 103
  }                                                                                           // 104
                                                                                              // 105
  return true;                                                                                // 106
};                                                                                            // 107
                                                                                              // 108
unsubscribeItem = function (collection, itemId, user) {                                       // 109
  var user = Meteor.user(),                                                                   // 110
      item = collection.findOne(itemId),                                                      // 111
      collectionName = collection._name.slice(0,1).toUpperCase()+collection._name.slice(1);   // 112
                                                                                              // 113
  if (!user || !item  || !hasSubscribedItem(item, user))                                      // 114
    return false;                                                                             // 115
                                                                                              // 116
  // Unsubscribe                                                                              // 117
  var result = collection.update({_id: itemId, subscribers: user._id }, {                     // 118
    $pull: {subscribers: user._id},                                                           // 119
    $inc: {subscriberCount: -1}                                                               // 120
  });                                                                                         // 121
                                                                                              // 122
  if (result > 0) {                                                                           // 123
    // Remove item from list of subscribed items                                              // 124
    removeSubscribedItem(user._id, itemId, collectionName);                                   // 125
  }                                                                                           // 126
  return true;                                                                                // 127
};                                                                                            // 128
                                                                                              // 129
Meteor.methods({                                                                              // 130
  subscribePost: function(postId) {                                                           // 131
    check(postId, String);                                                                    // 132
    return subscribeItem.call(this, Posts, postId, Meteor.user());                            // 133
  },                                                                                          // 134
  unsubscribePost: function(postId) {                                                         // 135
    check(postId, String);                                                                    // 136
    return unsubscribeItem.call(this, Posts, postId, Meteor.user());                          // 137
  }                                                                                           // 138
});                                                                                           // 139
                                                                                              // 140
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/telescope:subscribe-to-posts/lib/server/publications.js                           //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
Meteor.publish('userSubscribedPosts', function(terms) {                                       // 1
  var parameters = Posts.getSubParams(terms);                                                 // 2
  var posts = Posts.find(parameters.find, parameters.options);                                // 3
  return posts;                                                                               // 4
});                                                                                           // 5
                                                                                              // 6
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/telescope:subscribe-to-posts/Applications/MAMP/websites/stewardsof/packages/teles //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
var _ = Package.underscore._,                                                                 // 1
    package_name = "telescope:subscribe-to-posts",                                            // 2
    namespace = "telescope:subscribe-to-posts";                                               // 3
                                                                                              // 4
if (package_name != "project") {                                                              // 5
    namespace = TAPi18n.packages[package_name].namespace;                                     // 6
}                                                                                             // 7
// integrate the fallback language translations                                               // 8
translations = {};                                                                            // 9
translations[namespace] = {"subscribed_posts":"Subscribed Posts","subscribe_to_thread":"Subscribe to comment thread","unsubscribe_from_thread":"Unsubscribe from comment thread"};
TAPi18n._loadLangFileObject("en", translations);                                              // 11
TAPi18n._registerServerTranslator("en", namespace);                                           // 12
                                                                                              // 13
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:subscribe-to-posts'] = {
  subscribeItem: subscribeItem,
  unsubscribeItem: unsubscribeItem
};

})();

//# sourceMappingURL=telescope_subscribe-to-posts.js.map
