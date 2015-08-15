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
var __, deleteDummyContent, translations;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:getting-started/package-i18n.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
TAPi18n.packages["telescope:getting-started"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"};
                                                                                                                  // 2
// define package's translation function (proxy to the i18next)                                                   // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                  // 4
                                                                                                                  // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:getting-started/lib/getting_started.js                                                      //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
Users.addField({                                                                                                  // 1
  fieldName: 'telescope.isDummy',                                                                                 // 2
  fieldSchema: {                                                                                                  // 3
    type: Boolean,                                                                                                // 4
    optional: true,                                                                                               // 5
    autoform: {                                                                                                   // 6
      omit: true                                                                                                  // 7
    }                                                                                                             // 8
  }                                                                                                               // 9
});                                                                                                               // 10
                                                                                                                  // 11
Posts.addField({                                                                                                  // 12
  fieldName: 'dummySlug',                                                                                         // 13
  fieldSchema: {                                                                                                  // 14
    type: String,                                                                                                 // 15
    optional: true,                                                                                               // 16
    autoform: {                                                                                                   // 17
      omit: true                                                                                                  // 18
    }                                                                                                             // 19
  }                                                                                                               // 20
});                                                                                                               // 21
                                                                                                                  // 22
Posts.addField({                                                                                                  // 23
  fieldName: 'isDummy',                                                                                           // 24
  fieldSchema: {                                                                                                  // 25
    type: Boolean,                                                                                                // 26
    optional: true,                                                                                               // 27
    autoform: {                                                                                                   // 28
      omit: true                                                                                                  // 29
    }                                                                                                             // 30
  }                                                                                                               // 31
});                                                                                                               // 32
                                                                                                                  // 33
Comments.addField({                                                                                               // 34
fieldName: 'isDummy',                                                                                             // 35
fieldSchema: {                                                                                                    // 36
  type: Boolean,                                                                                                  // 37
  optional: true,                                                                                                 // 38
  autoform: {                                                                                                     // 39
    omit: true                                                                                                    // 40
  }                                                                                                               // 41
}                                                                                                                 // 42
});                                                                                                               // 43
                                                                                                                  // 44
/**                                                                                                               // 45
 * Copy over profile.isDummy to telescope.isDummy on user creation                                                // 46
 * @param {Object} user – the user object being iterated on and returned                                          // 47
 * @param {Object} options – user options                                                                         // 48
 */                                                                                                               // 49
function copyDummyProperty (user, options) {                                                                      // 50
  if (typeof user.profile.isDummy !== "undefined") {                                                              // 51
    user.telescope.isDummy = user.profile.isDummy;                                                                // 52
  }                                                                                                               // 53
  return user;                                                                                                    // 54
}                                                                                                                 // 55
Telescope.callbacks.add("onCreateUser", copyDummyProperty);                                                       // 56
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:getting-started/lib/server/dummy_content.js                                                 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var toTitleCase = function (str) {                                                                                // 1
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); // 2
};                                                                                                                // 3
                                                                                                                  // 4
var createPost = function (slug, postedAt, username, thumbnail) {                                                 // 5
  var post = {                                                                                                    // 6
    postedAt: postedAt,                                                                                           // 7
    body: Assets.getText("content/" + slug + ".md"),                                                              // 8
    title: toTitleCase(slug.replace(/_/g, ' ')),                                                                  // 9
    dummySlug: slug,                                                                                              // 10
    isDummy: true,                                                                                                // 11
    userId: Meteor.users.findOne({username: username})._id                                                        // 12
  };                                                                                                              // 13
                                                                                                                  // 14
  if (typeof thumbnail !== "undefined")                                                                           // 15
    post.thumbnailUrl = "/packages/telescope_getting-started/content/images/" + thumbnail;                        // 16
                                                                                                                  // 17
  Posts.submit(post);                                                                                             // 18
};                                                                                                                // 19
                                                                                                                  // 20
var createComment = function (slug, username, body, parentBody) {                                                 // 21
                                                                                                                  // 22
  var comment = {                                                                                                 // 23
    postId: Posts.findOne({dummySlug: slug})._id,                                                                 // 24
    userId: Meteor.users.findOne({username: username})._id,                                                       // 25
    body: body,                                                                                                   // 26
    isDummy: true,                                                                                                // 27
    disableNotifications: true                                                                                    // 28
  };                                                                                                              // 29
  var parentComment = Comments.findOne({body: parentBody});                                                       // 30
  if (parentComment)                                                                                              // 31
    comment.parentCommentId = parentComment._id;                                                                  // 32
                                                                                                                  // 33
  Comments.submit(comment);                                                                                       // 34
};                                                                                                                // 35
                                                                                                                  // 36
var createDummyUsers = function () {                                                                              // 37
  Accounts.createUser({                                                                                           // 38
    username: 'Bruce',                                                                                            // 39
    email: 'dummyuser1@telescopeapp.org',                                                                         // 40
    profile: {                                                                                                    // 41
      isDummy: true                                                                                               // 42
    }                                                                                                             // 43
  });                                                                                                             // 44
  Accounts.createUser({                                                                                           // 45
    username: 'Arnold',                                                                                           // 46
    email: 'dummyuser2@telescopeapp.org',                                                                         // 47
    profile: {                                                                                                    // 48
      isDummy: true                                                                                               // 49
    }                                                                                                             // 50
  });                                                                                                             // 51
  Accounts.createUser({                                                                                           // 52
    username: 'Julia',                                                                                            // 53
    email: 'dummyuser3@telescopeapp.org',                                                                         // 54
    profile: {                                                                                                    // 55
      isDummy: true                                                                                               // 56
    }                                                                                                             // 57
  });                                                                                                             // 58
};                                                                                                                // 59
                                                                                                                  // 60
var createDummyPosts = function () {                                                                              // 61
                                                                                                                  // 62
  createPost("read_this_first", moment().toDate(), "Bruce", "telescope.png");                                     // 63
                                                                                                                  // 64
  createPost("deploying_telescope", moment().subtract(10, 'minutes').toDate(), "Arnold");                         // 65
                                                                                                                  // 66
  createPost("customizing_telescope", moment().subtract(3, 'hours').toDate(), "Julia");                           // 67
                                                                                                                  // 68
  createPost("getting_help", moment().subtract(1, 'days').toDate(), "Bruce", "stackoverflow.png");                // 69
                                                                                                                  // 70
  createPost("removing_getting_started_posts", moment().subtract(2, 'days').toDate(), "Julia");                   // 71
                                                                                                                  // 72
};                                                                                                                // 73
                                                                                                                  // 74
var createDummyComments = function () {                                                                           // 75
                                                                                                                  // 76
  createComment("read_this_first", "Bruce", "What an awesome app!");                                              // 77
                                                                                                                  // 78
  createComment("deploying_telescope", "Arnold", "Deploy to da choppah!");                                        // 79
  createComment("deploying_telescope", "Julia", "Do you really need to say this all the time?", "Deploy to da choppah!");
                                                                                                                  // 81
  createComment("customizing_telescope", "Julia", "This is really cool!");                                        // 82
                                                                                                                  // 83
  createComment("removing_getting_started_posts", "Bruce", "Yippee ki-yay!");                                     // 84
  createComment("removing_getting_started_posts", "Arnold", "I'll be back.", "Yippee ki-yay!");                   // 85
                                                                                                                  // 86
};                                                                                                                // 87
                                                                                                                  // 88
deleteDummyContent = function () {                                                                                // 89
  Meteor.users.remove({'profile.isDummy': true});                                                                 // 90
  Posts.remove({isDummy: true});                                                                                  // 91
  Comments.remove({isDummy: true});                                                                               // 92
};                                                                                                                // 93
                                                                                                                  // 94
Meteor.methods({                                                                                                  // 95
  addGettingStartedContent: function () {                                                                         // 96
    if (Users.is.admin(Meteor.user())) {                                                                          // 97
      createDummyUsers();                                                                                         // 98
      createDummyPosts();                                                                                         // 99
      createDummyComments();                                                                                      // 100
    }                                                                                                             // 101
  },                                                                                                              // 102
  removeGettingStartedContent: function () {                                                                      // 103
    if (Users.is.admin(Meteor.user()))                                                                            // 104
      deleteDummyContent();                                                                                       // 105
  }                                                                                                               // 106
});                                                                                                               // 107
                                                                                                                  // 108
Meteor.startup(function () {                                                                                      // 109
  // insert dummy content only if createDummyContent hasn't happened and there aren't any posts in the db         // 110
  if (!Events.findOne({name: 'createDummyContent'}) && !Posts.find().count()) {                                   // 111
    createDummyUsers();                                                                                           // 112
    createDummyPosts();                                                                                           // 113
    createDummyComments();                                                                                        // 114
    Events.log({name: 'createDummyContent', unique: true, important: true});                                      // 115
  }                                                                                                               // 116
});                                                                                                               // 117
                                                                                                                  // 118
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/telescope:getting-started/Applications/MAMP/websites/stewardsof/packages/telescope-getting-started/i1 //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var _ = Package.underscore._,                                                                                     // 1
    package_name = "telescope:getting-started",                                                                   // 2
    namespace = "telescope:getting-started";                                                                      // 3
                                                                                                                  // 4
if (package_name != "project") {                                                                                  // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                         // 6
}                                                                                                                 // 7
// integrate the fallback language translations                                                                   // 8
translations = {};                                                                                                // 9
translations[namespace] = {"what_an_awesome_app":"What an awesome app!"};                                         // 10
TAPi18n._loadLangFileObject("en", translations);                                                                  // 11
TAPi18n._registerServerTranslator("en", namespace);                                                               // 12
                                                                                                                  // 13
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:getting-started'] = {};

})();

//# sourceMappingURL=telescope_getting-started.js.map
