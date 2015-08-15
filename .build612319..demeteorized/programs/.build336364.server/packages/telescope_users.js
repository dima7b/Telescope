(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Telescope = Package['telescope:lib'].Telescope;
var _ = Package.underscore._;
var getTemplate = Package['telescope:lib'].getTemplate;
var templates = Package['telescope:lib'].templates;
var themeSettings = Package['telescope:lib'].themeSettings;
var getVotePower = Package['telescope:lib'].getVotePower;
var Settings = Package['telescope:settings'].Settings;
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
var Users, __, translations;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/package-i18n.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
TAPi18n.packages["telescope:users"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"};     // 1
                                                                                                                      // 2
// define package's translation function (proxy to the i18next)                                                       // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                      // 4
                                                                                                                      // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/namespace.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Telescope Users namespace                                                                                          // 2
 * @namespace Users                                                                                                   // 3
 */                                                                                                                   // 4
Users = Meteor.users;                                                                                                 // 5
                                                                                                                      // 6
Users.getUser = function (userOrUserId) {                                                                             // 7
  if (typeof userOrUserId === "undefined") {                                                                          // 8
    if (!Meteor.user()) {                                                                                             // 9
      throw new Error();                                                                                              // 10
    } else {                                                                                                          // 11
      return Meteor.user();                                                                                           // 12
    }                                                                                                                 // 13
  } else if (typeof userOrUserId === "string") {                                                                      // 14
    return Meteor.users.findOne(userOrUserId);                                                                        // 15
  } else {                                                                                                            // 16
    return userOrUserId;                                                                                              // 17
  }                                                                                                                   // 18
};                                                                                                                    // 19
                                                                                                                      // 20
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/roles.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Telescope roles                                                                                                    // 2
 * @namespace Users.is                                                                                                // 3
 */                                                                                                                   // 4
Users.is = {};                                                                                                        // 5
                                                                                                                      // 6
/**                                                                                                                   // 7
 * Check if a user is an admin                                                                                        // 8
 * @param {Object|string} userOrUserId - The user or their userId                                                     // 9
 */                                                                                                                   // 10
Users.is.admin = function (userOrUserId) {                                                                            // 11
  try {                                                                                                               // 12
    var user = Users.getUser(userOrUserId);                                                                           // 13
    return !!user && !!user.isAdmin;                                                                                  // 14
  } catch (e) {                                                                                                       // 15
    return false; // user not logged in                                                                               // 16
  }                                                                                                                   // 17
};                                                                                                                    // 18
Users.is.adminById = Users.is.admin;                                                                                  // 19
                                                                                                                      // 20
/**                                                                                                                   // 21
 * Check if a user owns a document                                                                                    // 22
 * @param {Object|string} userOrUserId - The user or their userId                                                     // 23
 * @param {Object} document - The document to check (post, comment, user object, etc.)                                // 24
 */                                                                                                                   // 25
Users.is.owner = function (userOrUserId, document) {                                                                  // 26
  try {                                                                                                               // 27
    var user = Users.getUser(userOrUserId);                                                                           // 28
    if (!!document.userId) {                                                                                          // 29
      // case 1: document is a post or a comment, use userId to check                                                 // 30
      return user._id === document.userId;                                                                            // 31
    } else {                                                                                                          // 32
      // case 2: document is a user, use _id to check                                                                 // 33
      return user._id === document._id;                                                                               // 34
    }                                                                                                                 // 35
  } catch (e) {                                                                                                       // 36
    return false; // user not logged in                                                                               // 37
  }                                                                                                                   // 38
};                                                                                                                    // 39
                                                                                                                      // 40
Users.is.ownerById = Users.is.owner;                                                                                  // 41
                                                                                                                      // 42
Users.is.invited = function (userOrUserId) {                                                                          // 43
  try {                                                                                                               // 44
    var user = Users.getUser(userOrUserId);                                                                           // 45
    return Users.is.admin(user) || user.telescope.isInvited;                                                          // 46
  } catch (e) {                                                                                                       // 47
    return false; // user not logged in                                                                               // 48
  }                                                                                                                   // 49
};                                                                                                                    // 50
Users.is.invitedById = Users.is.invited;                                                                              // 51
                                                                                                                      // 52
Meteor.users.helpers({                                                                                                // 53
  // conflicts with user.isAdmin property                                                                             // 54
  // isAdmin: function () {                                                                                           // 55
  //   return Users.is.admin(this);                                                                                   // 56
  // },                                                                                                               // 57
  isOwner: function (document) {                                                                                      // 58
    return Users.is.owner(this, document);                                                                            // 59
  },                                                                                                                  // 60
  isInvited: function () {                                                                                            // 61
    return Users.is.invited(this);                                                                                    // 62
  }                                                                                                                   // 63
});                                                                                                                   // 64
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/permissions.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Telescope permissions                                                                                              // 2
 * @namespace Users.can                                                                                               // 3
 */                                                                                                                   // 4
Users.can = {};                                                                                                       // 5
                                                                                                                      // 6
/**                                                                                                                   // 7
 * Permissions checks.  Return true if all is well.                                                                   // 8
 * @param {Object} user - Meteor.user()                                                                               // 9
 */                                                                                                                   // 10
Users.can.view = function (user) {                                                                                    // 11
  if (Settings.get('requireViewInvite', false)) {                                                                     // 12
                                                                                                                      // 13
    if (Meteor.isClient) {                                                                                            // 14
      // on client only, default to the current user                                                                  // 15
      user = (typeof user === 'undefined') ? Meteor.user() : user;                                                    // 16
    }                                                                                                                 // 17
                                                                                                                      // 18
    return (!!user && (Users.is.admin(user) || Users.is.invited(user)));                                              // 19
  }                                                                                                                   // 20
  return true;                                                                                                        // 21
};                                                                                                                    // 22
                                                                                                                      // 23
Users.can.viewById = function (userId) {                                                                              // 24
  // if an invite is required to view, run permission check, else return true                                         // 25
  if (Settings.get('requireViewInvite', false)) {                                                                     // 26
    return !!userId ? Users.can.view(Meteor.users.findOne(userId)) : false;                                           // 27
  }                                                                                                                   // 28
  return true;                                                                                                        // 29
};                                                                                                                    // 30
                                                                                                                      // 31
Users.can.viewPendingPosts = function (user) {                                                                        // 32
  user = (typeof user === 'undefined') ? Meteor.user() : user;                                                        // 33
  return Users.is.admin(user);                                                                                        // 34
};                                                                                                                    // 35
                                                                                                                      // 36
Users.can.viewPendingPost = function (user, post) {                                                                   // 37
  return Users.is.owner(user, post) || Users.can.viewPendingPosts(user);                                              // 38
};                                                                                                                    // 39
                                                                                                                      // 40
                                                                                                                      // 41
Users.can.viewRejectedPosts = function (user) {                                                                       // 42
  user = (typeof user === 'undefined') ? Meteor.user() : user;                                                        // 43
  return Users.is.admin(user);                                                                                        // 44
};                                                                                                                    // 45
                                                                                                                      // 46
Users.can.viewRejectedPost = function (user, post) {                                                                  // 47
  return Users.is.owner(user, post) || Users.can.viewRejectedPosts(user);                                             // 48
};                                                                                                                    // 49
                                                                                                                      // 50
Users.can.post = function (user, returnError) {                                                                       // 51
  user = (typeof user === 'undefined') ? Meteor.user() : user;                                                        // 52
                                                                                                                      // 53
  if (!user) {                                                                                                        // 54
    return returnError ? "no_account" : false;                                                                        // 55
  } else if (Users.is.admin(user)) {                                                                                  // 56
    return true;                                                                                                      // 57
  } else if (Settings.get('requirePostInvite')) {                                                                     // 58
    if (user.telescope.isInvited) {                                                                                   // 59
      return true;                                                                                                    // 60
    } else {                                                                                                          // 61
      return false;                                                                                                   // 62
    }                                                                                                                 // 63
  } else {                                                                                                            // 64
    return true;                                                                                                      // 65
  }                                                                                                                   // 66
};                                                                                                                    // 67
                                                                                                                      // 68
Users.can.comment = function (user, returnError) {                                                                    // 69
  return Users.can.post(user, returnError);                                                                           // 70
};                                                                                                                    // 71
                                                                                                                      // 72
Users.can.vote = function (user, returnError) {                                                                       // 73
  return Users.can.post(user, returnError);                                                                           // 74
};                                                                                                                    // 75
                                                                                                                      // 76
/**                                                                                                                   // 77
 * Check if a user can edit a document                                                                                // 78
 * @param {Object} user - The user performing the action                                                              // 79
 * @param {Object} document - The document being edited                                                               // 80
 */                                                                                                                   // 81
Users.can.edit = function (user, document) {                                                                          // 82
  user = (typeof user === 'undefined') ? Meteor.user() : user;                                                        // 83
                                                                                                                      // 84
  if (!user || !document) {                                                                                           // 85
    return false;                                                                                                     // 86
  }                                                                                                                   // 87
                                                                                                                      // 88
  var adminCheck = Users.is.admin(user);                                                                              // 89
  var ownerCheck = Users.is.owner(user, document);                                                                    // 90
                                                                                                                      // 91
  return adminCheck || ownerCheck;                                                                                    // 92
};                                                                                                                    // 93
                                                                                                                      // 94
Users.can.editById = function (userId, document) {                                                                    // 95
  var user = Meteor.users.findOne(userId);                                                                            // 96
  return Users.can.edit(user, document);                                                                              // 97
};                                                                                                                    // 98
                                                                                                                      // 99
/**                                                                                                                   // 100
 * Check if a user can submit a field                                                                                 // 101
 * @param {Object} user - The user performing the action                                                              // 102
 * @param {Object} field - The field being edited or inserted                                                         // 103
 */                                                                                                                   // 104
Users.can.submitField = function (user, field) {                                                                      // 105
                                                                                                                      // 106
  if (!field.editableBy || !user) {                                                                                   // 107
    return false;                                                                                                     // 108
  }                                                                                                                   // 109
                                                                                                                      // 110
  var adminCheck = _.contains(field.editableBy, "admin") && Users.is.admin(user); // is the field editable by admins? // 111
  var memberCheck = _.contains(field.editableBy, "member"); // is the field editable by regular users?                // 112
                                                                                                                      // 113
  return adminCheck || memberCheck;                                                                                   // 114
                                                                                                                      // 115
};                                                                                                                    // 116
                                                                                                                      // 117
/** @function                                                                                                         // 118
 * Check if a user can edit a field – for now, identical to Users.can.submitField                                     // 119
 * @param {Object} user - The user performing the action                                                              // 120
 * @param {Object} field - The field being edited or inserted                                                         // 121
 */                                                                                                                   // 122
Users.can.editField = Users.can.submitField;                                                                          // 123
                                                                                                                      // 124
Users.can.currentUserEdit = function (item) {                                                                         // 125
  return Users.can.edit(Meteor.user(), item);                                                                         // 126
};                                                                                                                    // 127
                                                                                                                      // 128
Users.can.invite = function (user) {                                                                                  // 129
  return Users.is.invited(user) || Users.is.admin(user);                                                              // 130
};                                                                                                                    // 131
                                                                                                                      // 132
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/users.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * Vote schema                                                                                                        // 2
 * @type {SimpleSchema}                                                                                               // 3
 */                                                                                                                   // 4
Telescope.schemas.votes = new SimpleSchema({                                                                          // 5
  itemId: {                                                                                                           // 6
    type: String                                                                                                      // 7
  },                                                                                                                  // 8
  power: {                                                                                                            // 9
    type: Number,                                                                                                     // 10
    optional: true                                                                                                    // 11
  },                                                                                                                  // 12
  votedAt: {                                                                                                          // 13
    type: Date,                                                                                                       // 14
    optional: true                                                                                                    // 15
  }                                                                                                                   // 16
});                                                                                                                   // 17
                                                                                                                      // 18
/**                                                                                                                   // 19
 * User Data schema                                                                                                   // 20
 * @type {SimpleSchema}                                                                                               // 21
 */                                                                                                                   // 22
Telescope.schemas.userData = new SimpleSchema({                                                                       // 23
  /**                                                                                                                 // 24
    Bio (Markdown version)                                                                                            // 25
  */                                                                                                                  // 26
  bio: {                                                                                                              // 27
    type: String,                                                                                                     // 28
    optional: true,                                                                                                   // 29
    editableBy: ["member", "admin"],                                                                                  // 30
    autoform: {                                                                                                       // 31
      rows: 5                                                                                                         // 32
    }                                                                                                                 // 33
  },                                                                                                                  // 34
  /**                                                                                                                 // 35
    Total comment count                                                                                               // 36
  */                                                                                                                  // 37
  commentCount: {                                                                                                     // 38
    type: Number,                                                                                                     // 39
    public: true,                                                                                                     // 40
    optional: true                                                                                                    // 41
  },                                                                                                                  // 42
  /**                                                                                                                 // 43
    The name displayed throughout the app. Can contain spaces and special characters, doesn't need to be unique       // 44
  */                                                                                                                  // 45
  displayName: {                                                                                                      // 46
    type: String,                                                                                                     // 47
    optional: true,                                                                                                   // 48
    public: true,                                                                                                     // 49
    profile: true,                                                                                                    // 50
    editableBy: ["member", "admin"]                                                                                   // 51
  },                                                                                                                  // 52
  /**                                                                                                                 // 53
    An array containing comment downvotes                                                                             // 54
  */                                                                                                                  // 55
  downvotedComments: {                                                                                                // 56
    type: [Telescope.schemas.votes],                                                                                  // 57
    public: true,                                                                                                     // 58
    optional: true                                                                                                    // 59
  },                                                                                                                  // 60
  /**                                                                                                                 // 61
    An array containing posts downvotes                                                                               // 62
  */                                                                                                                  // 63
  downvotedPosts: {                                                                                                   // 64
    type: [Telescope.schemas.votes],                                                                                  // 65
    public: true,                                                                                                     // 66
    optional: true                                                                                                    // 67
  },                                                                                                                  // 68
  /**                                                                                                                 // 69
    The user's email. Modifiable.                                                                                     // 70
  */                                                                                                                  // 71
  email: {                                                                                                            // 72
    type: String,                                                                                                     // 73
    optional: true,                                                                                                   // 74
    regEx: SimpleSchema.RegEx.Email,                                                                                  // 75
    required: true,                                                                                                   // 76
    editableBy: ["member", "admin"]                                                                                   // 77
    // unique: true // note: find a way to fix duplicate accounts before enabling this                                // 78
  },                                                                                                                  // 79
  /**                                                                                                                 // 80
    A hash of the email, used for Gravatar // TODO: change this when email changes                                    // 81
  */                                                                                                                  // 82
  emailHash: {                                                                                                        // 83
    type: String,                                                                                                     // 84
    public: true,                                                                                                     // 85
    optional: true                                                                                                    // 86
  },                                                                                                                  // 87
  /**                                                                                                                 // 88
    The HTML version of the bio field                                                                                 // 89
  */                                                                                                                  // 90
  htmlBio: {                                                                                                          // 91
    type: String,                                                                                                     // 92
    public: true,                                                                                                     // 93
    profile: true,                                                                                                    // 94
    optional: true,                                                                                                   // 95
    autoform: {                                                                                                       // 96
      omit: true                                                                                                      // 97
    },                                                                                                                // 98
    template: "user_profile_bio"                                                                                      // 99
  },                                                                                                                  // 100
  /**                                                                                                                 // 101
    The user's karma                                                                                                  // 102
  */                                                                                                                  // 103
  karma: {                                                                                                            // 104
    type: Number,                                                                                                     // 105
    decimal: true,                                                                                                    // 106
    public: true,                                                                                                     // 107
    optional: true                                                                                                    // 108
  },                                                                                                                  // 109
  /**                                                                                                                 // 110
    Total post count                                                                                                  // 111
  */                                                                                                                  // 112
  postCount: {                                                                                                        // 113
    type: Number,                                                                                                     // 114
    public: true,                                                                                                     // 115
    optional: true                                                                                                    // 116
  },                                                                                                                  // 117
  /**                                                                                                                 // 118
    A blackbox modifiable object to store the user's settings                                                         // 119
  */                                                                                                                  // 120
  settings: {                                                                                                         // 121
    type: Object,                                                                                                     // 122
    optional: true,                                                                                                   // 123
    editableBy: ["member", "admin"],                                                                                  // 124
    blackbox: true,                                                                                                   // 125
    autoform: {                                                                                                       // 126
      omit: true                                                                                                      // 127
    }                                                                                                                 // 128
  },                                                                                                                  // 129
  /**                                                                                                                 // 130
    The user's profile URL slug // TODO: change this when displayName changes                                         // 131
  */                                                                                                                  // 132
  slug: {                                                                                                             // 133
    type: String,                                                                                                     // 134
    public: true,                                                                                                     // 135
    optional: true                                                                                                    // 136
  },                                                                                                                  // 137
  /**                                                                                                                 // 138
    The user's Twitter username                                                                                       // 139
  */                                                                                                                  // 140
  twitterUsername: {                                                                                                  // 141
    type: String,                                                                                                     // 142
    optional: true,                                                                                                   // 143
    public: true,                                                                                                     // 144
    profile: true,                                                                                                    // 145
    editableBy: ["member", "admin"],                                                                                  // 146
    template: "user_profile_twitter"                                                                                  // 147
  },                                                                                                                  // 148
  /**                                                                                                                 // 149
    An array containing comments upvotes                                                                              // 150
  */                                                                                                                  // 151
  upvotedComments: {                                                                                                  // 152
    type: [Telescope.schemas.votes],                                                                                  // 153
    public: true,                                                                                                     // 154
    optional: true                                                                                                    // 155
  },                                                                                                                  // 156
  /**                                                                                                                 // 157
    An array containing posts upvotes                                                                                 // 158
  */                                                                                                                  // 159
  upvotedPosts: {                                                                                                     // 160
    type: [Telescope.schemas.votes],                                                                                  // 161
    public: true,                                                                                                     // 162
    optional: true                                                                                                    // 163
  },                                                                                                                  // 164
  /**                                                                                                                 // 165
    A link to the user's homepage                                                                                     // 166
  */                                                                                                                  // 167
  website: {                                                                                                          // 168
    type: String,                                                                                                     // 169
    regEx: SimpleSchema.RegEx.Url,                                                                                    // 170
    public: true,                                                                                                     // 171
    profile: true,                                                                                                    // 172
    optional: true,                                                                                                   // 173
    editableBy: ["member", "admin"]                                                                                   // 174
  }                                                                                                                   // 175
});                                                                                                                   // 176
                                                                                                                      // 177
/**                                                                                                                   // 178
 * Users schema                                                                                                       // 179
 * @type {SimpleSchema}                                                                                               // 180
 */                                                                                                                   // 181
Users.schema = new SimpleSchema({                                                                                     // 182
  _id: {                                                                                                              // 183
    type: String,                                                                                                     // 184
    public: true,                                                                                                     // 185
    optional: true                                                                                                    // 186
  },                                                                                                                  // 187
  username: {                                                                                                         // 188
    type: String,                                                                                                     // 189
    // regEx: /^[a-z0-9A-Z_]{3,15}$/,                                                                                 // 190
    public: true,                                                                                                     // 191
    optional: true                                                                                                    // 192
  },                                                                                                                  // 193
  emails: {                                                                                                           // 194
    type: [Object],                                                                                                   // 195
    optional: true                                                                                                    // 196
  },                                                                                                                  // 197
  "emails.$.address": {                                                                                               // 198
    type: String,                                                                                                     // 199
    regEx: SimpleSchema.RegEx.Email,                                                                                  // 200
    optional: true                                                                                                    // 201
  },                                                                                                                  // 202
  "emails.$.verified": {                                                                                              // 203
    type: Boolean,                                                                                                    // 204
    optional: true                                                                                                    // 205
  },                                                                                                                  // 206
  createdAt: {                                                                                                        // 207
    type: Date,                                                                                                       // 208
    public: true,                                                                                                     // 209
    optional: true                                                                                                    // 210
  },                                                                                                                  // 211
  isAdmin: {                                                                                                          // 212
    type: Boolean,                                                                                                    // 213
    optional: true,                                                                                                   // 214
    editableBy: ["admin"],                                                                                            // 215
    autoform: {                                                                                                       // 216
      omit: true                                                                                                      // 217
    }                                                                                                                 // 218
  },                                                                                                                  // 219
  profile: {                                                                                                          // 220
    type: Object,                                                                                                     // 221
    optional: true,                                                                                                   // 222
    blackbox: true                                                                                                    // 223
  },                                                                                                                  // 224
  telescope: { // telescope-specific data                                                                             // 225
    type: Telescope.schemas.userData,                                                                                 // 226
    optional: true                                                                                                    // 227
  },                                                                                                                  // 228
  services: {                                                                                                         // 229
    type: Object,                                                                                                     // 230
    optional: true,                                                                                                   // 231
    blackbox: true                                                                                                    // 232
  }                                                                                                                   // 233
});                                                                                                                   // 234
                                                                                                                      // 235
Users.schema.internationalize();                                                                                      // 236
                                                                                                                      // 237
/**                                                                                                                   // 238
 * Attach schema to Meteor.users collection                                                                           // 239
 */                                                                                                                   // 240
Users.attachSchema(Users.schema);                                                                                     // 241
                                                                                                                      // 242
/**                                                                                                                   // 243
 * Users collection permissions                                                                                       // 244
 */                                                                                                                   // 245
                                                                                                                      // 246
Users.allow({                                                                                                         // 247
  update: _.partial(Telescope.allowCheck, Meteor.users),                                                              // 248
  remove: _.partial(Telescope.allowCheck, Meteor.users)                                                               // 249
});                                                                                                                   // 250
                                                                                                                      // 251
                                                                                                                      // 252
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/avatars.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Avatar.options = {                                                                                                    // 1
  fallbackType: 'initials',                                                                                           // 2
  emailHashProperty: 'telescope.emailHash'                                                                            // 3
};                                                                                                                    // 4
                                                                                                                      // 5
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/callbacks.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//////////////////////////////////////////////////////                                                                // 1
// Collection Hooks                                 //                                                                // 2
//////////////////////////////////////////////////////                                                                // 3
                                                                                                                      // 4
/**                                                                                                                   // 5
 * Generate HTML body from Markdown on user bio insert                                                                // 6
 */                                                                                                                   // 7
Users.after.insert(function (userId, user) {                                                                          // 8
                                                                                                                      // 9
  // run create user async callbacks                                                                                  // 10
  Telescope.callbacks.runAsync("onCreateUserAsync", user);                                                            // 11
                                                                                                                      // 12
  // check if all required fields have been filled in. If so, run profile completion callbacks                        // 13
  if (Users.hasCompletedProfile(user)) {                                                                              // 14
    Telescope.callbacks.runAsync("profileCompletedAsync", user);                                                      // 15
  }                                                                                                                   // 16
                                                                                                                      // 17
});                                                                                                                   // 18
                                                                                                                      // 19
/**                                                                                                                   // 20
 * Generate HTML body from Markdown when user bio is updated                                                          // 21
 */                                                                                                                   // 22
Users.before.update(function (userId, doc, fieldNames, modifier) {                                                    // 23
  // if bio is being modified, update htmlBio too                                                                     // 24
  if (Meteor.isServer && modifier.$set && modifier.$set["telescope.bio"]) {                                           // 25
    modifier.$set["telescope.htmlBio"] = Telescope.utils.sanitize(marked(modifier.$set["telescope.bio"]));            // 26
  }                                                                                                                   // 27
});                                                                                                                   // 28
                                                                                                                      // 29
/**                                                                                                                   // 30
 * Disallow $rename                                                                                                   // 31
 */                                                                                                                   // 32
Users.before.update(function (userId, doc, fieldNames, modifier) {                                                    // 33
  if (!!modifier.$rename) {                                                                                           // 34
    throw new Meteor.Error("illegal $rename operator detected!");                                                     // 35
  }                                                                                                                   // 36
});                                                                                                                   // 37
                                                                                                                      // 38
/**                                                                                                                   // 39
 * If user.telescope.email has changed, check for existing emails and change user.emails if needed                    // 40
 */                                                                                                                   // 41
 if (Meteor.isServer) {                                                                                               // 42
  Users.before.update(function (userId, doc, fieldNames, modifier) {                                                  // 43
    var user = doc;                                                                                                   // 44
    // if email is being modified, update user.emails too                                                             // 45
    if (Meteor.isServer && modifier.$set && modifier.$set["telescope.email"]) {                                       // 46
      var newEmail = modifier.$set["telescope.email"];                                                                // 47
      // check for existing emails and throw error if necessary                                                       // 48
      var userWithSameEmail = Users.findByEmail(newEmail);                                                            // 49
      if (userWithSameEmail && userWithSameEmail._id !== doc._id) {                                                   // 50
        throw new Meteor.Error("email_taken2", i18n.t("this_email_is_already_taken") + " (" + newEmail + ")");        // 51
      }                                                                                                               // 52
                                                                                                                      // 53
      // if user.emails exists, change it too                                                                         // 54
      if (!!user.emails) {                                                                                            // 55
        user.emails[0].address = newEmail;                                                                            // 56
        modifier.$set.emails = user.emails;                                                                           // 57
      }                                                                                                               // 58
                                                                                                                      // 59
    }                                                                                                                 // 60
  });                                                                                                                 // 61
}                                                                                                                     // 62
                                                                                                                      // 63
//////////////////////////////////////////////////////                                                                // 64
// Callbacks                                        //                                                                // 65
//////////////////////////////////////////////////////                                                                // 66
                                                                                                                      // 67
/**                                                                                                                   // 68
 * Set up user object on creation                                                                                     // 69
 * @param {Object} user – the user object being iterated on and returned                                              // 70
 * @param {Object} options – user options                                                                             // 71
 */                                                                                                                   // 72
function setupUser (user, options) {                                                                                  // 73
  // ------------------------------ Properties ------------------------------ //                                      // 74
  var userProperties = {                                                                                              // 75
    profile: options.profile || {},                                                                                   // 76
    telescope: {                                                                                                      // 77
      karma: 0,                                                                                                       // 78
      isInvited: false,                                                                                               // 79
      postCount: 0,                                                                                                   // 80
      commentCount: 0,                                                                                                // 81
      invitedCount: 0,                                                                                                // 82
      upvotedPosts: [],                                                                                               // 83
      downvotedPosts: [],                                                                                             // 84
      upvotedComments: [],                                                                                            // 85
      downvotedComments: []                                                                                           // 86
    }                                                                                                                 // 87
  };                                                                                                                  // 88
  user = _.extend(user, userProperties);                                                                              // 89
                                                                                                                      // 90
  // set email on user.telescope, and use it to generate email hash                                                   // 91
  if (options.email) {                                                                                                // 92
    user.telescope.email = options.email;                                                                             // 93
    user.telescope.emailHash = Gravatar.hash(options.email);                                                          // 94
  }                                                                                                                   // 95
                                                                                                                      // 96
  // look in a few places for the displayName                                                                         // 97
  if (user.profile.username) {                                                                                        // 98
    user.telescope.displayName = user.profile.username;                                                               // 99
  } else if (user.profile.name) {                                                                                     // 100
    user.telescope.displayName = user.profile.name;                                                                   // 101
  } else {                                                                                                            // 102
    user.telescope.displayName = user.username;                                                                       // 103
  }                                                                                                                   // 104
                                                                                                                      // 105
  // create slug from display name                                                                                    // 106
  user.telescope.slug = Telescope.utils.slugify(user.telescope.displayName);                                          // 107
                                                                                                                      // 108
  // if this is not a dummy account, and is the first user ever, make them an admin                                   // 109
  user.isAdmin = (!user.profile.isDummy && Meteor.users.find({'profile.isDummy': {$ne: true}}).count() === 0) ? true : false;
                                                                                                                      // 111
  Events.track('new user', {username: user.username, email: user.profile.email});                                     // 112
                                                                                                                      // 113
  return user;                                                                                                        // 114
}                                                                                                                     // 115
Telescope.callbacks.add("onCreateUser", setupUser);                                                                   // 116
                                                                                                                      // 117
                                                                                                                      // 118
function hasCompletedProfile (user) {                                                                                 // 119
  return Users.hasCompletedProfile(user);                                                                             // 120
}                                                                                                                     // 121
Telescope.callbacks.add("profileCompletedChecks", hasCompletedProfile);                                               // 122
                                                                                                                      // 123
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/modules.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Telescope.modules.add("profileDisplay", [                                                                             // 2
  {                                                                                                                   // 3
    template: 'user_info',                                                                                            // 4
    order: 1                                                                                                          // 5
  },                                                                                                                  // 6
  {                                                                                                                   // 7
    template: 'user_posts',                                                                                           // 8
    order: 2                                                                                                          // 9
  },                                                                                                                  // 10
  {                                                                                                                   // 11
    template: 'user_upvoted_posts',                                                                                   // 12
    order: 3                                                                                                          // 13
  },                                                                                                                  // 14
  {                                                                                                                   // 15
    template: 'user_downvoted_posts',                                                                                 // 16
    order: 5                                                                                                          // 17
  },                                                                                                                  // 18
  {                                                                                                                   // 19
    template: 'user_comments',                                                                                        // 20
    order: 5                                                                                                          // 21
  }                                                                                                                   // 22
]);                                                                                                                   // 23
                                                                                                                      // 24
Telescope.modules.add("profileEdit", [                                                                                // 25
  {                                                                                                                   // 26
    template: 'user_account',                                                                                         // 27
    order: 1                                                                                                          // 28
  }                                                                                                                   // 29
]);                                                                                                                   // 30
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/helpers.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
////////////////////                                                                                                  // 1
//  User Getters  //                                                                                                  // 2
////////////////////                                                                                                  // 3
                                                                                                                      // 4
/**                                                                                                                   // 5
 * Get a user's username (unique, no special characters or spaces)                                                    // 6
 * @param {Object} user                                                                                               // 7
 */                                                                                                                   // 8
Users.getUserName = function (user) {                                                                                 // 9
  try{                                                                                                                // 10
    if (user.username)                                                                                                // 11
      return user.username;                                                                                           // 12
    if (user && user.services && user.services.twitter && user.services.twitter.screenName)                           // 13
      return user.services.twitter.screenName;                                                                        // 14
  }                                                                                                                   // 15
  catch (error){                                                                                                      // 16
    console.log(error);                                                                                               // 17
    return null;                                                                                                      // 18
  }                                                                                                                   // 19
};                                                                                                                    // 20
Users.helpers({getUserName: function () {return Users.getUserName(this);}});                                          // 21
Users.getUserNameById = function (userId) {return Users.getUserName(Meteor.users.findOne(userId))};                   // 22
                                                                                                                      // 23
/**                                                                                                                   // 24
 * Get a user's display name (not unique, can take special characters and spaces)                                     // 25
 * @param {Object} user                                                                                               // 26
 */                                                                                                                   // 27
Users.getDisplayName = function (user) {                                                                              // 28
  if (typeof user === "undefined") {                                                                                  // 29
    return "";                                                                                                        // 30
  } else {                                                                                                            // 31
    return (user.telescope && user.telescope.displayName) ? user.telescope.displayName : Users.getUserName(user);     // 32
  }                                                                                                                   // 33
};                                                                                                                    // 34
Users.helpers({getDisplayName: function () {return Users.getDisplayName(this);}});                                    // 35
Users.getDisplayNameById = function (userId) {return Users.getDisplayName(Meteor.users.findOne(userId));};            // 36
                                                                                                                      // 37
/**                                                                                                                   // 38
 * Get a user's profile URL                                                                                           // 39
 * @param {Object} user (note: we only actually need either the _id or slug properties)                               // 40
 * @param {Boolean} isAbsolute                                                                                        // 41
 */                                                                                                                   // 42
Users.getProfileUrl = function (user, isAbsolute) {                                                                   // 43
  if (typeof user === "undefined") {                                                                                  // 44
    return "";                                                                                                        // 45
  }                                                                                                                   // 46
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false                        // 47
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";                                            // 48
  return prefix + Router.path("user_profile", {_idOrSlug: user.telescope.slug || user._id});                          // 49
};                                                                                                                    // 50
Users.helpers({getProfileUrl: function (isAbsolute) {return Users.getProfileUrl(this, isAbsolute);}});                // 51
                                                                                                                      // 52
/**                                                                                                                   // 53
 * Get a user's Twitter name                                                                                          // 54
 * @param {Object} user                                                                                               // 55
 */                                                                                                                   // 56
Users.getTwitterName = function (user) {                                                                              // 57
  // return twitter name provided by user, or else the one used for twitter login                                     // 58
  if(Telescope.utils.checkNested(user, 'profile', 'twitter')){                                                        // 59
    return user.profile.twitter;                                                                                      // 60
  }else if(Telescope.utils.checkNested(user, 'services', 'twitter', 'screenName')){                                   // 61
    return user.services.twitter.screenName;                                                                          // 62
  }                                                                                                                   // 63
  return null;                                                                                                        // 64
};                                                                                                                    // 65
Users.helpers({getTwitterName: function () {return Users.getTwitterName(this);}});                                    // 66
Users.getTwitterNameById = function (userId) {return Users.getTwitterName(Meteor.users.findOne(userId));};            // 67
                                                                                                                      // 68
/**                                                                                                                   // 69
 * Get a user's GitHub name                                                                                           // 70
 * @param {Object} user                                                                                               // 71
 */                                                                                                                   // 72
Users.getGitHubName = function (user) {                                                                               // 73
  // return twitter name provided by user, or else the one used for twitter login                                     // 74
  if(Telescope.utils.checkNested(user, 'profile', 'github')){                                                         // 75
    return user.profile.github;                                                                                       // 76
  }else if(Telescope.utils.checkNested(user, 'services', 'github', 'screenName')){ // TODO: double-check this with GitHub login
    return user.services.github.screenName;                                                                           // 78
  }                                                                                                                   // 79
  return null;                                                                                                        // 80
};                                                                                                                    // 81
Users.helpers({getGitHubName: function () {return Users.getGitHubName(this);}});                                      // 82
Users.getGitHubNameById = function (userId) {return Users.getGitHubName(Meteor.users.findOne(userId));};              // 83
                                                                                                                      // 84
/**                                                                                                                   // 85
 * Get a user's email                                                                                                 // 86
 * @param {Object} user                                                                                               // 87
 */                                                                                                                   // 88
Users.getEmail = function (user) {                                                                                    // 89
  if(user.telescope && user.telescope.email){                                                                         // 90
    return user.telescope.email;                                                                                      // 91
  }else{                                                                                                              // 92
    return null;                                                                                                      // 93
  }                                                                                                                   // 94
};                                                                                                                    // 95
Users.helpers({getEmail: function () {return Users.getEmail(this);}});                                                // 96
Users.getEmailById = function (userId) {return Users.getEmail(Meteor.users.findOne(userId));};                        // 97
                                                                                                                      // 98
/**                                                                                                                   // 99
 * Get a user's email hash                                                                                            // 100
 * @param {Object} user                                                                                               // 101
 */                                                                                                                   // 102
Users.getEmailHash = function (user) {                                                                                // 103
  // has to be this way to work with Gravatar                                                                         // 104
  return Gravatar.hash(Users.getEmail(user));                                                                         // 105
};                                                                                                                    // 106
Users.helpers({getEmailHash: function () {return Users.getEmailHash(this);}});                                        // 107
Users.getEmailHashById = function (userId) {return Users.getEmailHash(Meteor.users.findOne(userId));};                // 108
                                                                                                                      // 109
/**                                                                                                                   // 110
 * Check if a user's profile is complete                                                                              // 111
 * @param {Object} user                                                                                               // 112
 */                                                                                                                   // 113
Users.userProfileComplete = function (user) {                                                                         // 114
  for (var i = 0; i < Telescope.callbacks.profileCompletedChecks.length; i++) {                                       // 115
    if (!Telescope.callbacks.profileCompletedChecks[i](user)) {                                                       // 116
      return false;                                                                                                   // 117
    }                                                                                                                 // 118
  }                                                                                                                   // 119
  return true;                                                                                                        // 120
};                                                                                                                    // 121
Users.helpers({userProfileComplete: function () {return Users.userProfileComplete(this);}});                          // 122
Users.userProfileCompleteById = function (userId) {return Users.userProfileComplete(Meteor.users.findOne(userId));};  // 123
                                                                                                                      // 124
/**                                                                                                                   // 125
 * Get a user setting                                                                                                 // 126
 * @param {Object} user                                                                                               // 127
 * @param {String} settingName                                                                                        // 128
 * @param {Object} defaultValue                                                                                       // 129
 */                                                                                                                   // 130
Users.getSetting = function (user, settingName, defaultValue) {                                                       // 131
  user = user || Meteor.user();                                                                                       // 132
  defaultValue = defaultValue || null;                                                                                // 133
                                                                                                                      // 134
  // all settings should be in the user.telescope namespace, so add "telescope." if needed                            // 135
  settingName = settingName.slice(0,10) === "telescope." ? settingName : "telescope." + settingName;                  // 136
                                                                                                                      // 137
  if (user.telescope) {                                                                                               // 138
    var settingValue = this.getProperty(user, settingName);                                                           // 139
    return (settingValue === null) ? defaultValue : settingValue;                                                     // 140
  } else {                                                                                                            // 141
    return defaultValue;                                                                                              // 142
  }                                                                                                                   // 143
};                                                                                                                    // 144
Users.helpers({getSetting: function (settingName, defaultValue) {return Users.getSetting(this, settingName, defaultValue);}});
                                                                                                                      // 146
/**                                                                                                                   // 147
 * Set a user setting                                                                                                 // 148
 * @param {Object} user                                                                                               // 149
 * @param {String} settingName                                                                                        // 150
 * @param {Object} defaultValue                                                                                       // 151
 */                                                                                                                   // 152
Users.setSetting = function (user, settingName, value) {                                                              // 153
  if (user) {                                                                                                         // 154
                                                                                                                      // 155
    // all settings should be in the user.telescope namespace, so add "telescope." if needed                          // 156
    var field = settingName.slice(0,10) === "telescope." ? settingName : "telescope." + settingName;                  // 157
                                                                                                                      // 158
    var modifier = {$set: {}};                                                                                        // 159
    modifier.$set[field] = value;                                                                                     // 160
    Users.update(user._id, modifier);                                                                                 // 161
                                                                                                                      // 162
  }                                                                                                                   // 163
};                                                                                                                    // 164
Users.helpers({setSetting: function () {return Users.setSetting(this);}});                                            // 165
                                                                                                                      // 166
/**                                                                                                                   // 167
 * Check if a user has upvoted a post                                                                                 // 168
 * @param {Object} user                                                                                               // 169
 * @param {Object} post                                                                                               // 170
 */                                                                                                                   // 171
Users.hasUpvoted = function (user, post) {                                                                            // 172
  return user && _.include(post.upvoters, user._id);                                                                  // 173
};                                                                                                                    // 174
Users.helpers({hasUpvoted: function (post) {return Users.hasUpvoted(this, post);}});                                  // 175
                                                                                                                      // 176
/**                                                                                                                   // 177
 * Check if a user has downvoted a post                                                                               // 178
 * @param {Object} user                                                                                               // 179
 * @param {Object} post                                                                                               // 180
 */                                                                                                                   // 181
Users.hasDownvoted = function (user, post) {                                                                          // 182
  return user && _.include(post.downvoters, user._id);                                                                // 183
};                                                                                                                    // 184
Users.helpers({hasDownvoted: function (post) {return Users.hasDownvoted(this, post);}});                              // 185
                                                                                                                      // 186
///////////////////                                                                                                   // 187
// Other Helpers //                                                                                                   // 188
///////////////////                                                                                                   // 189
                                                                                                                      // 190
Users.findLast = function (user, collection) {                                                                        // 191
  return collection.findOne({userId: user._id}, {sort: {createdAt: -1}});                                             // 192
};                                                                                                                    // 193
                                                                                                                      // 194
Users.timeSinceLast = function (user, collection){                                                                    // 195
  var now = new Date().getTime();                                                                                     // 196
  var last = this.findLast(user, collection);                                                                         // 197
  if(!last)                                                                                                           // 198
    return 999; // if this is the user's first post or comment ever, stop here                                        // 199
  return Math.abs(Math.floor((now-last.createdAt)/1000));                                                             // 200
};                                                                                                                    // 201
                                                                                                                      // 202
Users.numberOfItemsInPast24Hours = function (user, collection) {                                                      // 203
  var mNow = moment();                                                                                                // 204
  var items = collection.find({                                                                                       // 205
    userId: user._id,                                                                                                 // 206
    createdAt: {                                                                                                      // 207
      $gte: mNow.subtract(24, 'hours').toDate()                                                                       // 208
    }                                                                                                                 // 209
  });                                                                                                                 // 210
  return items.count();                                                                                               // 211
};                                                                                                                    // 212
                                                                                                                      // 213
Users.getProperty = function (object, property) {                                                                     // 214
  // recursive function to get nested properties                                                                      // 215
  var array = property.split('.');                                                                                    // 216
  if(array.length > 1){                                                                                               // 217
    var parent = array.shift();                                                                                       // 218
    // if our property is not at this level, call function again one level deeper if we can go deeper, else return null
    return (typeof object[parent] === "undefined") ? null : this.getProperty(object[parent], array.join('.'));        // 220
  }else{                                                                                                              // 221
    // else return property                                                                                           // 222
    return object[array[0]];                                                                                          // 223
  }                                                                                                                   // 224
};                                                                                                                    // 225
                                                                                                                      // 226
/**                                                                                                                   // 227
 * Build Users subscription with filter, sort, and limit args.                                                        // 228
 * @param {String} filterBy                                                                                           // 229
 * @param {String} sortBy                                                                                             // 230
 * @param {Number} limit                                                                                              // 231
 */                                                                                                                   // 232
Users.getSubParams = function(filterBy, sortBy, limit) {                                                              // 233
  var find = {},                                                                                                      // 234
      sort = {createdAt: -1};                                                                                         // 235
                                                                                                                      // 236
  switch(filterBy){                                                                                                   // 237
    case 'invited':                                                                                                   // 238
      // consider admins as invited                                                                                   // 239
      find = { $or: [{ isInvited: true }, { isAdmin: true }]};                                                        // 240
      break;                                                                                                          // 241
    case 'uninvited':                                                                                                 // 242
      find = { $and: [{ isInvited: false }, { isAdmin: false }]};                                                     // 243
      break;                                                                                                          // 244
    case 'admin':                                                                                                     // 245
      find = { isAdmin: true };                                                                                       // 246
      break;                                                                                                          // 247
  }                                                                                                                   // 248
                                                                                                                      // 249
  switch(sortBy){                                                                                                     // 250
    case 'username':                                                                                                  // 251
      sort = { username: 1 };                                                                                         // 252
      break;                                                                                                          // 253
    case 'karma':                                                                                                     // 254
      sort = { karma: -1 };                                                                                           // 255
      break;                                                                                                          // 256
    case 'postCount':                                                                                                 // 257
      sort = { postCount: -1 };                                                                                       // 258
      break;                                                                                                          // 259
    case 'commentCount':                                                                                              // 260
      sort = { commentCount: -1 };                                                                                    // 261
      break;                                                                                                          // 262
    case 'invitedCount':                                                                                              // 263
      sort = { invitedCount: -1 };                                                                                    // 264
  }                                                                                                                   // 265
  return {                                                                                                            // 266
    find: find,                                                                                                       // 267
    options: { sort: sort, limit: limit }                                                                             // 268
  };                                                                                                                  // 269
};                                                                                                                    // 270
                                                                                                                      // 271
                                                                                                                      // 272
Users.updateAdmin = function (userId, admin) {                                                                        // 273
  Users.update(userId, {$set: {isAdmin: admin}});                                                                     // 274
};                                                                                                                    // 275
                                                                                                                      // 276
Users.adminUsers = function () {                                                                                      // 277
  return this.find({isAdmin : true}).fetch();                                                                         // 278
};                                                                                                                    // 279
                                                                                                                      // 280
Users.getCurrentUserEmail = function () {                                                                             // 281
  return Meteor.user() ? Users.getEmail(Meteor.user()) : '';                                                          // 282
};                                                                                                                    // 283
                                                                                                                      // 284
Users.findByEmail = function (email) {                                                                                // 285
  return Meteor.users.findOne({"telescope.email": email});                                                            // 286
};                                                                                                                    // 287
                                                                                                                      // 288
                                                                                                                      // 289
/**                                                                                                                   // 290
 * @method Users.getRequiredFields                                                                                    // 291
 * Get a list of all fields required for a profile to be complete.                                                    // 292
 */                                                                                                                   // 293
Users.getRequiredFields = function () {                                                                               // 294
  var schema = Users.simpleSchema()._schema;                                                                          // 295
  var fields = _.filter(_.keys(schema), function (fieldName) {                                                        // 296
    var field = schema[fieldName];                                                                                    // 297
    return !!field.required;                                                                                          // 298
  });                                                                                                                 // 299
  return fields;                                                                                                      // 300
};                                                                                                                    // 301
                                                                                                                      // 302
/**                                                                                                                   // 303
 * Check if the user has completed their profile.                                                                     // 304
 * @param {Object} user                                                                                               // 305
 */                                                                                                                   // 306
Users.hasCompletedProfile = function (user) {                                                                         // 307
  return _.every(Users.getRequiredFields(), function (fieldName) {                                                    // 308
    return !!Telescope.getNestedProperty(user, fieldName);                                                            // 309
  });                                                                                                                 // 310
};                                                                                                                    // 311
Users.helpers({hasCompletedProfile: function () {return Users.hasCompletedProfile(this);}});                          // 312
Users.hasCompletedProfileById = function (userId) {return Users.hasCompletedProfile(Meteor.users.findOne(userId));};  // 313
                                                                                                                      // 314
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/menu.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Telescope.menuItems.add("userMenu", [                                                                                 // 1
  {                                                                                                                   // 2
    route: function () {                                                                                              // 3
      var user = Meteor.user();                                                                                       // 4
      return Router.path('user_profile', {_idOrSlug: user && user.telescope.slug});                                   // 5
    },                                                                                                                // 6
    label: 'profile',                                                                                                 // 7
    description: 'view_your_profile'                                                                                  // 8
  },                                                                                                                  // 9
  {                                                                                                                   // 10
    route: function () {                                                                                              // 11
      var user = Meteor.user();                                                                                       // 12
      return Router.path('user_edit', {slug: user && user.telescope.slug});                                           // 13
    },                                                                                                                // 14
    label: 'edit_account',                                                                                            // 15
    description: 'edit_your_profile'                                                                                  // 16
  },                                                                                                                  // 17
  {                                                                                                                   // 18
    route: 'settings',                                                                                                // 19
    label: 'settings',                                                                                                // 20
    description: 'settings',                                                                                          // 21
    adminOnly: true                                                                                                   // 22
  },                                                                                                                  // 23
  {                                                                                                                   // 24
    route: 'signOut',                                                                                                 // 25
    label: 'sign_out',                                                                                                // 26
    description: 'sign_out'                                                                                           // 27
  }                                                                                                                   // 28
]);                                                                                                                   // 29
                                                                                                                      // 30
// array containing items in the admin menu                                                                           // 31
Telescope.menuItems.add("adminMenu", [                                                                                // 32
  {                                                                                                                   // 33
    route: 'users_dashboard',                                                                                         // 34
    label: 'users',                                                                                                   // 35
    description: 'users_dashboard'                                                                                    // 36
  }                                                                                                                   // 37
]);                                                                                                                   // 38
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/pubsub.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
////////////////////////////////////                                                                                  // 1
// Publications and Subscriptions //                                                                                  // 2
////////////////////////////////////                                                                                  // 3
                                                                                                                      // 4
/**                                                                                                                   // 5
 * Users pub/sub configs and methods                                                                                  // 6
 * @namespace Users.pubsub                                                                                            // 7
 */                                                                                                                   // 8
Users.pubsub = {};                                                                                                    // 9
                                                                                                                      // 10
/**                                                                                                                   // 11
 * Default user object fields in publication                                                                          // 12
 * @type {Object}                                                                                                     // 13
 */                                                                                                                   // 14
                                                                                                                      // 15
var publicFields = Users.simpleSchema().getPublicFields();                                                            // 16
                                                                                                                      // 17
// add public fields as specified in schema                                                                           // 18
Users.pubsub.publicProperties = _.object(publicFields, _.map(publicFields, function () {return true}));               // 19
                                                                                                                      // 20
// add a few more fields                                                                                              // 21
Users.pubsub.publicProperties = _.extend(Users.pubsub.publicProperties, {                                             // 22
  'services.twitter.profile_image_url': true,                                                                         // 23
  'services.twitter.profile_image_url_https': true,                                                                   // 24
  'services.facebook.id': true,                                                                                       // 25
  'services.twitter.screenName': true,                                                                                // 26
});                                                                                                                   // 27
                                                                                                                      // 28
/**                                                                                                                   // 29
 * Options for your own user account (for security reasons, block certain properties)                                 // 30
 * @type {Object}                                                                                                     // 31
 */                                                                                                                   // 32
Users.pubsub.hiddenProperties = {                                                                                     // 33
  'services.password.bcrypt': false                                                                                   // 34
};                                                                                                                    // 35
                                                                                                                      // 36
/**                                                                                                                   // 37
 * Minimum required properties to display avatars and display names                                                   // 38
 * @type {Object}                                                                                                     // 39
 */                                                                                                                   // 40
Users.pubsub.avatarProperties = {                                                                                     // 41
  _id: true,                                                                                                          // 42
  'telescope.emailHash': true,                                                                                        // 43
  'telescope.slug': true,                                                                                             // 44
  'telescope.displayName': true,                                                                                      // 45
  username: true,                                                                                                     // 46
  'profile.username': true,                                                                                           // 47
  'profile.github': true,                                                                                             // 48
  'profile.twitter': true,                                                                                            // 49
  'services.twitter.profile_image_url': true,                                                                         // 50
  'services.twitter.profile_image_url_https': true,                                                                   // 51
  'services.facebook.id': true,                                                                                       // 52
  'services.twitter.screenName': true,                                                                                // 53
  'services.github.screenName': true, // Github is not really used, but there are some mentions to it in the code     // 54
};                                                                                                                    // 55
                                                                                                                      // 56
                                                                                                                      // 57
/**                                                                                                                   // 58
 * Build Users subscription with filter, sort, and limit args.                                                        // 59
 * @param {String} filterBy                                                                                           // 60
 * @param {String} sortBy                                                                                             // 61
 * @param {Number} limit                                                                                              // 62
 */                                                                                                                   // 63
Users.pubsub.getSubParams = function(filterBy, sortBy, limit) {                                                       // 64
  var find = {},                                                                                                      // 65
      sort = {createdAt: -1};                                                                                         // 66
                                                                                                                      // 67
  switch(filterBy){                                                                                                   // 68
    case 'invited':                                                                                                   // 69
      // consider admins as invited                                                                                   // 70
      find = { $or: [{ isInvited: true }, { isAdmin: true }]};                                                        // 71
      break;                                                                                                          // 72
    case 'uninvited':                                                                                                 // 73
      find = { $and: [{ isInvited: false }, { isAdmin: false }]};                                                     // 74
      break;                                                                                                          // 75
    case 'admin':                                                                                                     // 76
      find = { isAdmin: true };                                                                                       // 77
      break;                                                                                                          // 78
  }                                                                                                                   // 79
                                                                                                                      // 80
  switch(sortBy){                                                                                                     // 81
    case 'username':                                                                                                  // 82
      sort = { username: 1 };                                                                                         // 83
      break;                                                                                                          // 84
    case 'karma':                                                                                                     // 85
      sort = { karma: -1 };                                                                                           // 86
      break;                                                                                                          // 87
    case 'postCount':                                                                                                 // 88
      sort = { postCount: -1 };                                                                                       // 89
      break;                                                                                                          // 90
    case 'commentCount':                                                                                              // 91
      sort = { commentCount: -1 };                                                                                    // 92
      break;                                                                                                          // 93
    case 'invitedCount':                                                                                              // 94
      sort = { invitedCount: -1 };                                                                                    // 95
  }                                                                                                                   // 96
  return {                                                                                                            // 97
    find: find,                                                                                                       // 98
    options: { sort: sort, limit: limit }                                                                             // 99
  };                                                                                                                  // 100
};                                                                                                                    // 101
                                                                                                                      // 102
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/methods.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var completeUserProfile = function (modifier, userId, user) {                                                         // 1
                                                                                                                      // 2
  Users.update(userId, modifier);                                                                                     // 3
                                                                                                                      // 4
  Telescope.callbacks.runAsync("profileCompletedAsync", Users.findOne(userId));                                       // 5
                                                                                                                      // 6
  return Users.findOne(userId);                                                                                       // 7
                                                                                                                      // 8
};                                                                                                                    // 9
                                                                                                                      // 10
Meteor.methods({                                                                                                      // 11
  completeUserProfile: function (modifier, userId) {                                                                  // 12
                                                                                                                      // 13
    check(modifier, Match.OneOf({$set: Object}, {$unset: Object}, {$set: Object, $unset: Object}));                   // 14
    check(userId, String);                                                                                            // 15
                                                                                                                      // 16
    var currentUser = Meteor.user(),                                                                                  // 17
        user = Users.findOne(userId),                                                                                 // 18
        schema = Users.simpleSchema()._schema;                                                                        // 19
                                                                                                                      // 20
    // ------------------------------ Checks ------------------------------ //                                        // 21
                                                                                                                      // 22
    // check that user can edit document                                                                              // 23
    if (!user || !Users.can.edit(currentUser, user)) {                                                                // 24
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_user'));                                         // 25
    }                                                                                                                 // 26
                                                                                                                      // 27
    // if an $unset modifier is present, it means one or more of the fields is missing                                // 28
    if (modifier.$unset) {                                                                                            // 29
      throw new Meteor.Error(601, i18n.t('all_fields_are_required'));                                                 // 30
    }                                                                                                                 // 31
                                                                                                                      // 32
    // check for existing emails and throw error if necessary                                                         // 33
    // NOTE: redundant with collection hook, but better to throw the error here to avoid wiping out the form          // 34
    if (modifier.$set && modifier.$set["telescope.email"]) {                                                          // 35
      var email = modifier.$set["telescope.email"];                                                                   // 36
      if (Users.findByEmail(email)) {                                                                                 // 37
        throw new Meteor.Error("email_taken1", i18n.t("this_email_is_already_taken") + " (" + email + ")");           // 38
      }                                                                                                               // 39
                                                                                                                      // 40
    }                                                                                                                 // 41
                                                                                                                      // 42
    // go over each field and throw an error if it's not editable                                                     // 43
    // loop over each operation ($set, $unset, etc.)                                                                  // 44
    _.each(modifier, function (operation) {                                                                           // 45
      // loop over each property being operated on                                                                    // 46
      _.keys(operation).forEach(function (fieldName) {                                                                // 47
        var field = schema[fieldName];                                                                                // 48
        if (!Users.can.editField(user, field, user)) {                                                                // 49
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);   // 50
        }                                                                                                             // 51
                                                                                                                      // 52
      });                                                                                                             // 53
    });                                                                                                               // 54
                                                                                                                      // 55
    completeUserProfile(modifier, userId, user);                                                                      // 56
  }                                                                                                                   // 57
});                                                                                                                   // 58
                                                                                                                      // 59
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/routes.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// Controller for user pages                                                                                          // 1
                                                                                                                      // 2
Users.controllers = {};                                                                                               // 3
                                                                                                                      // 4
Users.controllers.page = RouteController.extend({                                                                     // 5
                                                                                                                      // 6
  waitOn: function() {                                                                                                // 7
    return [                                                                                                          // 8
      Telescope.subsManager.subscribe('singleUser', this.params._idOrSlug)                                            // 9
    ];                                                                                                                // 10
  },                                                                                                                  // 11
                                                                                                                      // 12
  getUser: function () {                                                                                              // 13
    return Meteor.users.findOne({"telescope.slug": this.params._idOrSlug});                                           // 14
  },                                                                                                                  // 15
                                                                                                                      // 16
  data: function() {                                                                                                  // 17
                                                                                                                      // 18
    var findById = Meteor.users.findOne(this.params._idOrSlug);                                                       // 19
    var findBySlug = Meteor.users.findOne({"telescope.slug": this.params._idOrSlug});                                 // 20
                                                                                                                      // 21
    if (typeof findById !== 'undefined') {                                                                            // 22
      // redirect to slug-based URL                                                                                   // 23
      Router.go(Users.getProfileUrl(findById), {replaceState: true});                                                 // 24
    } else {                                                                                                          // 25
      return {                                                                                                        // 26
        user: findById || findBySlug                                                                                  // 27
      };                                                                                                              // 28
    }                                                                                                                 // 29
                                                                                                                      // 30
  },                                                                                                                  // 31
                                                                                                                      // 32
  getTitle: function () {                                                                                             // 33
    return Users.getDisplayName(this.getUser());                                                                      // 34
  },                                                                                                                  // 35
                                                                                                                      // 36
  getDescription: function () {                                                                                       // 37
    return i18n.t('the_profile_of') + ' ' + Users.getDisplayName(this.getUser());                                     // 38
  },                                                                                                                  // 39
                                                                                                                      // 40
  fastRender: true                                                                                                    // 41
                                                                                                                      // 42
});                                                                                                                   // 43
                                                                                                                      // 44
// Controller for user account editing                                                                                // 45
                                                                                                                      // 46
Users.controllers.edit = RouteController.extend({                                                                     // 47
  waitOn: function() {                                                                                                // 48
    return [                                                                                                          // 49
      Telescope.subsManager.subscribe('singleUser', this.params.slug)                                                 // 50
    ];                                                                                                                // 51
  },                                                                                                                  // 52
  data: function() {                                                                                                  // 53
    // if there is no slug, default to current user                                                                   // 54
    var user = !!this.params.slug ? Meteor.users.findOne({"telescope.slug": this.params.slug}) : Meteor.user();       // 55
    return {                                                                                                          // 56
      user: user                                                                                                      // 57
    };                                                                                                                // 58
  },                                                                                                                  // 59
  fastRender: true                                                                                                    // 60
});                                                                                                                   // 61
                                                                                                                      // 62
Meteor.startup(function () {                                                                                          // 63
                                                                                                                      // 64
// User Logout                                                                                                        // 65
                                                                                                                      // 66
  Router.route('/sign-out', {                                                                                         // 67
    name: 'signOut',                                                                                                  // 68
    template: 'sign_out',                                                                                             // 69
    onBeforeAction: function() {                                                                                      // 70
      Meteor.logout(function() {                                                                                      // 71
      });                                                                                                             // 72
      this.next();                                                                                                    // 73
    }                                                                                                                 // 74
  });                                                                                                                 // 75
                                                                                                                      // 76
  // User Profile                                                                                                     // 77
                                                                                                                      // 78
  Router.route('/users/:_idOrSlug', {                                                                                 // 79
    name: 'user_profile',                                                                                             // 80
    template: 'user_profile',                                                                                         // 81
    controller: Users.controllers.page                                                                                // 82
  });                                                                                                                 // 83
                                                                                                                      // 84
  // User Edit                                                                                                        // 85
                                                                                                                      // 86
  Router.route('/users/:slug/edit', {                                                                                 // 87
    name: 'user_edit',                                                                                                // 88
    template: 'user_edit',                                                                                            // 89
    controller: Users.controllers.edit,                                                                               // 90
    onBeforeAction: function () {                                                                                     // 91
      // Only allow users with permissions to see the user edit page.                                                 // 92
      if (Meteor.user() && (                                                                                          // 93
        Users.is.admin(Meteor.user()) ||                                                                              // 94
        this.params.slug === Meteor.user().telescope.slug                                                             // 95
      )) {                                                                                                            // 96
        this.next();                                                                                                  // 97
      } else {                                                                                                        // 98
        this.render('no_rights');                                                                                     // 99
      }                                                                                                               // 100
    }                                                                                                                 // 101
  });                                                                                                                 // 102
                                                                                                                      // 103
  Router.route('/account', {                                                                                          // 104
    name: 'userAccountShortcut',                                                                                      // 105
    template: 'user_edit',                                                                                            // 106
    controller: Users.controllers.edit                                                                                // 107
  });                                                                                                                 // 108
                                                                                                                      // 109
  // All Users                                                                                                        // 110
                                                                                                                      // 111
  Router.route('/users-dashboard', {                                                                                  // 112
    controller: Telescope.controllers.admin,                                                                          // 113
    name: 'users_dashboard'                                                                                           // 114
  });                                                                                                                 // 115
                                                                                                                      // 116
  // Unsubscribe (from notifications)                                                                                 // 117
                                                                                                                      // 118
  Router.route('/unsubscribe/:hash', {                                                                                // 119
    name: 'unsubscribe',                                                                                              // 120
    template: 'unsubscribe',                                                                                          // 121
    data: function() {                                                                                                // 122
      return {                                                                                                        // 123
        hash: this.params.hash                                                                                        // 124
      };                                                                                                              // 125
    }                                                                                                                 // 126
  });                                                                                                                 // 127
                                                                                                                      // 128
});                                                                                                                   // 129
                                                                                                                      // 130
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/server/publications.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// accept either an ID or a slug                                                                                      // 1
Meteor.publish('singleUser', function(idOrSlug) {                                                                     // 2
  var findById = Meteor.users.findOne(idOrSlug);                                                                      // 3
  var findBySlug = Meteor.users.findOne({"telescope.slug": idOrSlug});                                                // 4
  var user = typeof findById !== 'undefined' ? findById : findBySlug;                                                 // 5
  var options = Users.is.adminById(this.userId) ? {} : {fields: Users.pubsub.publicProperties};                       // 6
  if (user) {                                                                                                         // 7
    return Meteor.users.find({_id: user._id}, options);                                                               // 8
  }                                                                                                                   // 9
  return [];                                                                                                          // 10
});                                                                                                                   // 11
                                                                                                                      // 12
Meteor.publish('userPosts', function(terms) {                                                                         // 13
  var parameters = Posts.getSubParams(terms);                                                                         // 14
  var posts = Posts.find(parameters.find, parameters.options);                                                        // 15
  return posts;                                                                                                       // 16
});                                                                                                                   // 17
                                                                                                                      // 18
Meteor.publish('userUpvotedPosts', function(terms) {                                                                  // 19
  var parameters = Posts.getSubParams(terms);                                                                         // 20
  var posts = Posts.find(parameters.find, parameters.options);                                                        // 21
  return posts;                                                                                                       // 22
});                                                                                                                   // 23
                                                                                                                      // 24
Meteor.publish('userDownvotedPosts', function(terms) {                                                                // 25
  var parameters = Posts.getSubParams(terms);                                                                         // 26
  var posts = Posts.find(parameters.find, parameters.options);                                                        // 27
  return posts;                                                                                                       // 28
});                                                                                                                   // 29
                                                                                                                      // 30
// Publish the current user                                                                                           // 31
                                                                                                                      // 32
Meteor.publish('currentUser', function() {                                                                            // 33
  var user = Meteor.users.find({_id: this.userId}, {fields: Users.pubsub.hiddenProperties});                          // 34
  return user;                                                                                                        // 35
});                                                                                                                   // 36
                                                                                                                      // 37
// publish all users for admins to make autocomplete work                                                             // 38
// TODO: find a better way                                                                                            // 39
                                                                                                                      // 40
Meteor.publish('allUsersAdmin', function() {                                                                          // 41
  var selector = Settings.get('requirePostInvite') ? {isInvited: true} : {}; // only users that can post              // 42
  if (Users.is.adminById(this.userId)) {                                                                              // 43
    return Meteor.users.find(selector, {fields: Users.pubsub.avatarProperties});                                      // 44
  }                                                                                                                   // 45
  return [];                                                                                                          // 46
});                                                                                                                   // 47
                                                                                                                      // 48
// Publish all users to reactive-table (if admin)                                                                     // 49
// Limit, filter, and sort handled by reactive-table.                                                                 // 50
// https://github.com/aslagle/reactive-table#server-side-pagination-and-filtering-beta                                // 51
                                                                                                                      // 52
ReactiveTable.publish("all-users", function() {                                                                       // 53
  if(Users.is.adminById(this.userId)){                                                                                // 54
    return Meteor.users;                                                                                              // 55
  } else {                                                                                                            // 56
    return [];                                                                                                        // 57
  }                                                                                                                   // 58
});                                                                                                                   // 59
                                                                                                                      // 60
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/lib/server/create_user.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Accounts.onCreateUser(function(options, user){                                                                        // 1
  user = Telescope.callbacks.run("onCreateUser", user, options);                                                      // 2
  return user;                                                                                                        // 3
});                                                                                                                   // 4
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/ar.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["ar"])) {                                                                       // 8
  TAPi18n.translations["ar"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["ar"][namespace])) {                                                            // 12
  TAPi18n.translations["ar"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["ar"][namespace], {"bio":"السيرة الذاتية","email":"البريد اﻻلكتروني","please_complete_your_profile_below_before_continuing":"شكرا  لاستكمال ملفك الشخصي قبل المتابعة.","account":"حساب","username":"اسم المستخدم","display_name":"اﻻسم الحقيقي","password":"كلمة المرور","change_password":"تبديل كلمة المرور","old_password":"كلمة المرور القديمة","new_password":"كلمة المرور الجديدة","email_notifications":"إشعارات بالبريد الإلكتروني","new_posts":"مشاركة جديدة","comments_on_my_posts":"تعليقات على مشاركاتي","replies_to_my_comments":"اجابة تعليقاتي","comments":"تعليقات","forgot_password":"نسيت كلمة المرور؟","profile_updated":"تحديث الملف الشخصي","please_fill_in_your_email_below_to_finish_signing_up":"تفضل بأدخل بريدك الالكتروني لإنهاء إنشاء الحساب","invite":"قم بدعوة","uninvite":"الغاء الدعوة","make_admin":"عين مشرف","unadmin":"الغي مشرف","delete_user":"احذف مستخدم","are_you_sure_you_want_to_delete":"هل انت متاكد من الحذف؟ ","reset_password":"اعادة كلمة المرور","password_reset_link_sent":"قد تم ارسال رابط ﻻسترجاع كلمة المرور","name":"اﻻسم","posts":"المشاركات","comments_":"التعليقات","karma":"Karma","is_invited":"هل هو مدعو؟","is_admin":"هل هو مشرف؟","delete":"حذف","member_since":"عضو منذ","edit_profile":"تغيير الملف الشخصي","sign_in":"دخول","sign_in_":"دخول","sign_up_":"استحدث حساب","dont_have_an_account":"ﻻ تمتلك حساب؟","already_have_an_account":"تمتلك حساب؟","sign_up":"استحدث حساب","please_fill_in_all_fields":"يتوجب مل كل الخانات","invite_":"دعوة ","left":" باقي","invite_none_left":"دعوات (0 متبقي)","all":"الكل","invited":"مدعو","uninvited":"غير مدعو","filter_by":"فرز ب","sort_by":"ترتيب حسب"});
TAPi18n._registerServerTranslator("ar", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/bg.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["bg"])) {                                                                       // 8
  TAPi18n.translations["bg"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["bg"][namespace])) {                                                            // 12
  TAPi18n.translations["bg"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["bg"][namespace], {"bio":"Биография","email":"Емайл","please_complete_your_profile_below_before_continuing":"Моля попълнете вашия профил по-долу, преди да продължите.","account":"Акаунт","username":"Потребителско име","display_name":"Прякор","password":"Парола","change_password":"Променете парола?","old_password":"Стара парола","new_password":"Нова парола","email_notifications":"Емайл известия","new_posts":"Нови Публикации","comments_on_my_posts":"Коментари на мои публикации","replies_to_my_comments":"Отговори на мои коментари","comments":"коментари","forgot_password":"Забравена Парола?","profile_updated":"Профила е обновен","please_fill_in_your_email_below_to_finish_signing_up":"Моля попълнете емайл адреса си за да завършите регистрацията.","invite":"Покана","uninvite":"Отмяна на покана","make_admin":"Направи администратор","unadmin":"Премахване на администраторски права","delete_user":"Изтриване на потребител","are_you_sure_you_want_to_delete":"Сигурни ли сте, че искате да изтриете ","reset_password":"Нулиране на парола","password_reset_link_sent":"Линка за нулиране на паролата ви е изпратен!","name":"Име","posts":"Публикации","comments_":"Коментари","karma":"Карма","is_invited":"Е поканен?","is_admin":"Е Администратор?","delete":"Изтриване","member_since":"Потребител от","edit_profile":"Промяна на профила","sign_in":"Влезте","sign_in_":"Влезте!","sign_up_":"Регистрирайте се!","dont_have_an_account":"Нямате Акаунт?","already_have_an_account":"Вече имате акаунт?","sign_up":"Регистрирай се","please_fill_in_all_fields":"Моля попълнете всички полета","invite_":"Покани ","left":" остава","invite_none_left":"Покана (none left)","all":"Всичко","invited":"Поканен","uninvited":"Поканата е отхвърлена","filter_by":"Филтрирай по ","sort_by":"Сортирай по "});
TAPi18n._registerServerTranslator("bg", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/de.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                       // 8
  TAPi18n.translations["de"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                            // 12
  TAPi18n.translations["de"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["de"][namespace], {"bio":"Bio","email":"Email","please_complete_your_profile_below_before_continuing":"Bitte füllen Dein Profil vollständig aus bevor du fortfährst.","account":"Konto","username":"Benutzername","display_name":"Angezeigter Name","password":"Passwort","change_password":"Passwort ändern?","old_password":"Altes Passwort","new_password":"Neues Passwort","email_notifications":"Email-Benachrichtigung","new_posts":"Neue Links","comments_on_my_posts":"Kommentare zu meinen Links","replies_to_my_comments":"Antworten auf meine Kommentare","comments":"Kommentare","forgot_password":"Passwort vergessen?","profile_updated":"Profil aktualisiert","please_fill_in_your_email_below_to_finish_signing_up":"Bitte trage Deine Email-Adresse ein um die Registrierung abzuschließen.","invite":"Einladen","uninvite":"Ausladen","make_admin":"Zum Admin ernennen","unadmin":"Als Admin entfernen","delete_user":"Benutzer löschen","are_you_sure_you_want_to_delete":"Bist du Dir sicher, dass du folgendes löschen willst: ","reset_password":"Passwort zurücksetzen","password_reset_link_sent":"Ein Link zum zurücksetzen des Passworts wurde versendet!","name":"Name","posts":"Links","comments_":"Kommentare","karma":"Karma","is_invited":"Wurde eingeladen?","is_admin":"Ist Admin?","delete":"Löschen","member_since":"Mitglied seit","edit_profile":"Profil bearbeiten","sign_in":"Einloggen","sign_in_":"Einloggen!","sign_up_":"Registrieren!","dont_have_an_account":"Du hast noch kein Konto?","already_have_an_account":"Du hast bereits ein Konto?","sign_up":"Registrieren","please_fill_in_all_fields":"Bitte fülle alle Felder aus","invite_":"Einladung(en) ","left":" übrig","invite_none_left":"Einladungen (keine übrig)","all":"Alle","invited":"Eingeladen","uninvited":"Nicht eingeladen","filter_by":"Filtern nach","sort_by":"Sortieren nach"});
TAPi18n._registerServerTranslator("de", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/el.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["el"])) {                                                                       // 8
  TAPi18n.translations["el"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["el"][namespace])) {                                                            // 12
  TAPi18n.translations["el"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["el"][namespace], {"bio":"Βιογραφία","email":"Email","please_complete_your_profile_below_before_continuing":"Παρακαλώ συμπληρώστε το προφίλ σας πριν συνεχισετε.","account":"Λογαριασμός","username":"Ονομα χρήστη","display_name":"Παρατσούκλι","password":"κωδικός","change_password":"Αλλαγή κωδικού?","old_password":"Παλιός κωδικός","new_password":"Νέος κωδικός","email_notifications":"Ειδοποιήσεις μέσω Email","new_posts":"Νέες δημοσιεύσεις","comments_on_my_posts":"Σχόλια στις δημοσιέυσεις μου","replies_to_my_comments":"Απαντήσεις στα σχόλια μου","comments":"Σχόλια","forgot_password":"Ξέχασες τον κωδικό σου;","profile_updated":"Το προφίλ ενημερώθηκε","please_fill_in_your_email_below_to_finish_signing_up":"Παρακαλώ συμπλήρωσε το email για να ολοκληρώσεις την εγγραφή σου.","invite":"Προσκληση","uninvite":"Διαγραφή πρόσκλησης","make_admin":"Δικαίωμα διαχειριστή","unadmin":"Διαγραφή δικαίωματος διαχειριστή","delete_user":"Διαγραφή χρήστη","are_you_sure_you_want_to_delete":"Είσαι σίγουρος για την διαγραφή","reset_password":"Επαναφορά κωδικού","password_reset_link_sent":"Στείλαμε σύνδεσμο επαναφοράς κωδικου στο email!","name":"Όνομα","posts":"Δημοσιεύσεις","comments_":"Σχόλια","karma":"Karma","is_invited":"Έχει προσκληση?","is_admin":"Είναι διαχειριστής?","delete":"Διαγραφή","member_since":"Μέλος από","edit_profile":"Επεξεργασία Προφίλ","sign_in":"Σύνδεση","sign_in_":"Σύνδεση!","sign_up_":"Εγγραφή!","dont_have_an_account":"Δεν έχεις λογαριασμό;","already_have_an_account":"Έχεις ήδη λογαριασμό;","sign_up":"Εγγραφλη","please_fill_in_all_fields":"Παρακαλώ συμπληρώστε τα πεδία","invite_":"Πρόσκληση ","left":" αριστερά","invite_none_left":"Πρόσκληση (κανένας αριστερά)","all":"Όλους","invited":"Αυτούς που έχουν πρόσκληση","uninvited":"Αυτούς που ΔΕΝ έχουν πρόσκληση","filter_by":"Δείξε ","sort_by":"Ταξινόμηση"});
TAPi18n._registerServerTranslator("el", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/en.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
// integrate the fallback language translations                                                                       // 8
translations = {};                                                                                                    // 9
translations[namespace] = {"please_fill_in_missing_information_to_finish_signing_up":"Please fill in missing information below to finish signing up.","bio":"Bio","displayName":"Name","email":"Email","twitterUsername":"Twitter Username","website":"Website","htmlBio":"Bio","user_profile_saved":"User profile saved","this_email_is_already_taken":"This email is already taken","all_fields_are_required":"All fields are required","please_complete_your_profile_below_before_continuing":"Please complete your profile below before continuing.","account":"Account","username":"Username","display_name":"Display Name","city":"City","twitter_username":"Twitter Username","github_username":"GitHub Username","site_url":"Site URL","password":"Password","change_password":"Change Password?","old_password":"Old Password","new_password":"New Password","email_notifications":"Email Notifications","new_users":"New users","new_posts":"New Posts","comments_on_my_posts":"Comments on my posts","replies_to_my_comments":"Replies to my comments","comments":"Comments","forgot_password":"Forgot password?","profile_updated":"Profile updated","please_fill_in_your_email_below_to_finish_signing_up":"Please fill in your email below to finish the registration.","invite":"Invite","uninvite":"Uninvite","make_admin":"Make admin","unadmin":"Unadmin","delete_user":"Delete User","are_you_sure_you_want_to_delete":"Are you sure you want to delete ","reset_password":"Reset Password","password_reset_link_sent":"Password reset link sent!","name":"Name","posts":"Posts","comments_":"Comments","karma":"Karma","is_invited":"Is Invited?","is_admin":"Is Admin?","delete":"Delete","member_since":"Member since","edit_profile":"Edit profile","sign_in":"Sign In","sign_in_":"Sign in!","sign_up_":"Register!","dont_have_an_account":"Don't have an account?","already_have_an_account":"Already have an account?","sign_up":"Register","please_fill_in_all_fields":"Please fill in all fields","invite_":"Invite ","left":" left","invite_none_left":"Invite (none left)","all":"All","invited":"Invited","uninvited":"Uninvited","filter_by":"Filter by","sort_by":"Sort by"};
TAPi18n._loadLangFileObject("en", translations);                                                                      // 11
TAPi18n._registerServerTranslator("en", namespace);                                                                   // 12
                                                                                                                      // 13
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/es.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                       // 8
  TAPi18n.translations["es"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                            // 12
  TAPi18n.translations["es"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["es"][namespace], {"please_fill_in_missing_information_to_finish_signing_up":"Por favor, complete la información que falta a continuación para terminar el registro.","bio":"Bio","displayName":"Nombre","email":"Email","twitterUsername":"Nombre De Usuario De Twitter","website":"Sitio web","htmlBio":"Biografía","user_profile_saved":"Perfil de usuario guardado","this_email_is_already_taken":"Este correo electrónico ya existe","all_fields_are_required":"Todos los campos son obligatorios","please_complete_your_profile_below_before_continuing":"Por favor complete su perfil antes de seguir.","account":"Cuenta","username":"Nombre de usuario","display_name":"Nombre","city":"Ciudad","twitter_username":"Nombre De Usuario De Twitter","github_username":"Nombre De Usuario De Github","site_url":"URL del sitio web","password":"Contraseña","change_password":"Cambiar de contraseña","old_password":"Contraseña Anterior","new_password":"Contraseña Nueva ","email_notifications":"Notificaciones por Email","new_users":"Nuevos usuarios","new_posts":"Nuevo Post","comments_on_my_posts":"Comentarios en mis posts","replies_to_my_comments":"Respuestas a mis comentarios","comments":"comentarios","forgot_password":"Olvidaste tu contraseña?","profile_updated":"Perfil actualizado","please_fill_in_your_email_below_to_finish_signing_up":"Por favor, introduzca su email a continuación para terminar el registro.","invite":"Invitar","uninvite":"Cancelar la invitación","make_admin":"Hacer admin","unadmin":"Borrar de admin","delete_user":"Borrar usuario","are_you_sure_you_want_to_delete":"¿Está seguro de que desea eliminar?","reset_password":"Restablecer contraseña","password_reset_link_sent":"Enlace de restablecimiento de contraseña enviado a su email.","name":"Nombre","posts":"Posts","comments_":"Comentarios","karma":"Karma","is_invited":"¿Esta invitado?","is_admin":"¿Es admin?","delete":"Borrar","member_since":"Miembro desde","edit_profile":"Modificar el perfil","sign_in":"Ingresar","sign_in_":"Ingresar!","sign_up_":"Registrarse!","dont_have_an_account":"¿No tiene cuenta de usuario?","already_have_an_account":"¿Ya tiene cuenta?","sign_up":"Registrarse","please_fill_in_all_fields":"Por favor, llena todos los campos","invite_":"Invitación ","left":" restante","invite_none_left":"Invitación (no queda)","all":"Todos","invited":"Invitados","uninvited":"No invitado","filter_by":"Filtrar por","sort_by":"Ordenar por"});
TAPi18n._registerServerTranslator("es", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/fr.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                       // 8
  TAPi18n.translations["fr"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                            // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["fr"][namespace], {"please_fill_in_missing_information_to_finish_signing_up":"Veuillez remplir les informations manquantes pour compléter votre inscription.","bio":"Bio","displayName":"Nom Affiché","email":"Adresse mail","twitterUsername":"Identifiant Twitter","website":"Site Web","htmlBio":"Bio","user_profile_saved":"Profil utilisateur sauvegardé","this_email_is_already_taken":"Cet e-mail est déjà utilisé","all_fields_are_required":"Tous les champs sont requis","please_complete_your_profile_below_before_continuing":"Merci de compléter votre profil avant de continuer.","account":"Compte","username":"Nom d'utilisateur","display_name":"Nom réel","city":"Ville","twitter_username":"Nom d'utilisateur Twitter","github_username":"Nom d'utilisateur GitHub","site_url":"Url du site","password":"Mot de passe","change_password":"Changer le mot de passe","old_password":"Ancien mot de passe","new_password":"Nouveau mot de passe","email_notifications":"Notifications par mail","new_users":"ÈNouveaux utilisateurs","new_posts":"Nouveau post","comments_on_my_posts":"Commentaires sur mes posts","replies_to_my_comments":"Reponses à mes commentaires","comments":"Commentaires","forgot_password":"Mot de passe oublié ?","profile_updated":"Profil mis à jour","please_fill_in_your_email_below_to_finish_signing_up":"Merci de saisir votre email pour finir la création de votre compte","invite":"Inviter","uninvite":"Annuler l'invitation","make_admin":"Rendre admin","unadmin":"Supprimer les droits d'admin","delete_user":"Supprimer l'utilisateur","are_you_sure_you_want_to_delete":"Etes-vous sûr de vouloir supprimer ?","reset_password":"Réinitialiser le mot de passe","password_reset_link_sent":"Un lien pour réinitialiser votre mot de passe a été envoyé !","name":"Nom","posts":"Posts","comments_":"Commentaires","karma":"Karma","is_invited":"Est-il invité ?","is_admin":"Est-il administrateur ?","delete":"Supprimer","member_since":"Membre depuis","edit_profile":"Modifier le profil","sign_in":"Connexion","sign_in_":"Connexion","sign_up_":"Créer un compte.","dont_have_an_account":"Pas de compte ?","already_have_an_account":"Déjà un compte ?","sign_up":"Créer un compte","please_fill_in_all_fields":"Vous devez remplir tous les champs.","invite_":"Invitation ","left":" restante","invite_none_left":"Invitation (aucune restante)","all":"Tout(e)s","invited":"Invité(e)","uninvited":"Pas invité(e)","filter_by":"Filtrer par","sort_by":"Trier par"});
TAPi18n._registerServerTranslator("fr", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/it.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                       // 8
  TAPi18n.translations["it"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                            // 12
  TAPi18n.translations["it"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["it"][namespace], {"bio":"Biografia","email":"Email","please_complete_your_profile_below_before_continuing":"Per favore completa il tuo profilo qua sotto prima di proseguire.","account":"Account","username":"Nome Utente","display_name":"Nome Visualizzato","password":"Password","change_password":"Cambio Password?","old_password":"Vecchia Password","new_password":"Nuova Password","email_notifications":"Notifiche via Email","new_posts":"Nuovi Posts","comments_on_my_posts":"Commenti ai miei post","replies_to_my_comments":"Risposte ai miei commenti","comments":"commenti","forgot_password":"Password dimenticata?","profile_updated":"Profilo aggiornato","please_fill_in_your_email_below_to_finish_signing_up":"Per favore inserisci qua sotto la tua email per completare la registrazione.","invite":"Invita","uninvite":"Annulla l'invito","make_admin":"Rendi amministratore","unadmin":"Annulla amministratore","delete_user":"Elimina Utente","are_you_sure_you_want_to_delete":"Sei sicuro di voler eliminare ","reset_password":"Reimposta Password","password_reset_link_sent":"Link per reimpostare la password inviato!","name":"Nome","posts":"Post","comments_":"Commenti","karma":"Karma","is_invited":"È Invitato?","is_admin":"È Amministratore?","delete":"Elimina","member_since":"Membro dal","edit_profile":"Modifica profilo","sign_in":"Accedi","sign_in_":"Accedi!","sign_up_":"Registrati!","dont_have_an_account":"Non hai un account?","already_have_an_account":"Hai già un account?","sign_up":"Registrati","please_fill_in_all_fields":"Per favore compila tutti i campi","invite_":"Invita ","left":" sinistra","invite_none_left":"Invita (nessuno rimasto)","all":"Tutti","invited":"Invitati","uninvited":"Non invitati","filter_by":"Filtra per","sort_by":"Ordina per"});
TAPi18n._registerServerTranslator("it", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/nl.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["nl"])) {                                                                       // 8
  TAPi18n.translations["nl"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["nl"][namespace])) {                                                            // 12
  TAPi18n.translations["nl"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["nl"][namespace], {"bio":"Bio","email":"Email","please_complete_your_profile_below_before_continuing":"Maak eerst je profiel af alvorens verder te gaan.","account":"Account","username":"Gebruikersnaam","display_name":"Weergave naam","twitter_username":"Twitter gebruikersnaam","github_username":"GitHub gebruikersnaam","site_url":"Website URL","password":"Wachtwoord","change_password":"Wachtwoord veranderen?","old_password":"Oud wachtwoord","new_password":"Nieuw wachtwoord","email_notifications":"Email Notificaties","new_users":"Nieuwe gebruikers","new_posts":"Nieuwe artikelen","comments_on_my_posts":"Reacties op mijn artikelen","replies_to_my_comments":"Antwoorden op mijn reacties","comments":"Reacties","forgot_password":"Wachtwoord vergeten?","profile_updated":"Profiel bijgewerkt","please_fill_in_your_email_below_to_finish_signing_up":"Vul je email in om de registratie af te ronden.","invite":"Uitnodigen","uninvite":"Uitnodiging intrekken","make_admin":"Beheerder maken","unadmin":"Beheer rechten ontnemen","delete_user":"Gberuiker verwijderen","are_you_sure_you_want_to_delete":"Verwijder ","reset_password":"Reset wachtwoord","password_reset_link_sent":"Wacthwoord reset link verstuurd!","name":"Naam","posts":"Artikelen","comments_":"Reacties","karma":"Karma","is_invited":"Is uitgenodigd?","is_admin":"Is beheerder?","delete":"Verwijder","member_since":"Lid sinds","edit_profile":"Bewerk profiel","sign_in":"Inloggen","sign_in_":"Inloggen!","sign_up_":"Registreren!","dont_have_an_account":"Geen account?","already_have_an_account":"Heb je al een account?","sign_up":"Registreren","please_fill_in_all_fields":"Alle velden invullen a.u.b.","invite_":"Uitnodiging sturen aan ","left":" resterend","invite_none_left":"Invite (geen resterend)","all":"Alles","invited":"Uitgenodigd","uninvited":"Uitnoding ongedaan gemaakt","filter_by":"Filteren","sort_by":"Sorteer"});
TAPi18n._registerServerTranslator("nl", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/pl.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["pl"])) {                                                                       // 8
  TAPi18n.translations["pl"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["pl"][namespace])) {                                                            // 12
  TAPi18n.translations["pl"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["pl"][namespace], {"bio":"Bio","email":"Email","please_complete_your_profile_below_before_continuing":"Uzupełnij profil.","account":"Konto","username":"Nick","display_name":"Nazwa wyświetlana","twitter_username":"Twitter","github_username":"GitHub","site_url":"Strona WWW","password":"Hasło","change_password":"Zmienić hasło?","old_password":"Stare hasło","new_password":"Nowe hasło","email_notifications":"Notyfikacje email","new_users":"Nowi użytkownicy","new_posts":"Nowe posty","comments_on_my_posts":"Komentarze do moich postów","replies_to_my_comments":"Odpowiedzi na moje komentarze","comments":"Comments","forgot_password":"Zapomniałeś hasło?","profile_updated":"Profil został zaktualizowany","please_fill_in_your_email_below_to_finish_signing_up":"Uzupełnij email.","invite":"Zaproś","uninvite":"Wyproś","make_admin":"Mianuj admina","unadmin":"Zdejmij admina","delete_user":"Usuń użytkownika","are_you_sure_you_want_to_delete":"Jesteś pewny, że chcesz usunąć ","reset_password":"Resetuj hasło","password_reset_link_sent":"Link z nowym hasłem został wysłany!","name":"Imię","posts":"Posty","comments_":"Komentarze","karma":"Karma","is_invited":"Czy jest zaproszony?","is_admin":"Czy jest adminem?","delete":"Usuń","member_since":"Zarejestrowany od","edit_profile":"Edytuj profil","sign_in":"Zaloguj","sign_in_":"Zaloguj!","sign_up_":"Zarejestruj!","dont_have_an_account":"Nie masz konta?","already_have_an_account":"Masz już konto?","sign_up":"Zarejestruj","please_fill_in_all_fields":"Uzupełnij pola","invite_":"Zaproś ","left":" left","invite_none_left":"Zaproszenia (brak)","all":"Wszyscy","invited":"Zaproszeni","uninvited":"Niezaproszeni","filter_by":"Filtruj po","sort_by":"Sortuj po"});
TAPi18n._registerServerTranslator("pl", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/pt-BR.i18n.js         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["pt-BR"])) {                                                                    // 8
  TAPi18n.translations["pt-BR"] = {};                                                                                 // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["pt-BR"][namespace])) {                                                         // 12
  TAPi18n.translations["pt-BR"][namespace] = {};                                                                      // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["pt-BR"][namespace], {"bio":"Bio","email":"Email","please_complete_your_profile_below_before_continuing":"Por favor, complete seu perfil abaixo antes de continuar.","account":"Conta","username":"Nome de usuário","display_name":"Nome de exibição","twitter_username":"Twitter","github_username":"GitHub","site_url":"URL do Site","password":"Senha","change_password":"Mudar Senha?","old_password":"Senha Antiga","new_password":"Nova Senha","email_notifications":"Notificações por Email","new_users":"Novos usuários","new_posts":"Novas Postagens","comments_on_my_posts":"Comentários em minhas postagens","replies_to_my_comments":"Respostas aos meus comentários","comments":"Comentários","forgot_password":"Esqueceu sua senha?","profile_updated":"Perfil atualizado","please_fill_in_your_email_below_to_finish_signing_up":"Por favor, preencha seu email abaixo para finalizar o registro.","invite":"Convite","uninvite":"Desconvidar","make_admin":"Tornar admin","unadmin":"Retirar do admin","delete_user":"Deletar Usuário","are_you_sure_you_want_to_delete":"Está certo de que deseja deletar ","reset_password":"Resetar Senhar","password_reset_link_sent":"Link de reset de senha enviado!","name":"Nome","posts":"Postagens","comments_":"Comentários","karma":"Carma","is_invited":"Foi Convidado?","is_admin":"É Admin?","delete":"Deletar","member_since":"Membro desde","edit_profile":"Editar perfil","sign_in":"Entrar","sign_in_":"Entrar!","sign_up_":"Registrar!","dont_have_an_account":"Não possui uma conta?","already_have_an_account":"Já possui uma conta?","sign_up":"Registrar","please_fill_in_all_fields":"Por favor, preencha todos os campos","invite_":"Convidar ","left":" restantes","invite_none_left":"Convidar (nenhum restante)","all":"Todos","invited":"Convidado","uninvited":"Desconvidado","filter_by":"Filtrar por","sort_by":"Distribuir por"});
TAPi18n._registerServerTranslator("pt-BR", namespace);                                                                // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/ro.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["ro"])) {                                                                       // 8
  TAPi18n.translations["ro"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["ro"][namespace])) {                                                            // 12
  TAPi18n.translations["ro"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["ro"][namespace], {"bio":"Despre tine","email":"Email","please_complete_your_profile_below_before_continuing":"Te rugăm să completezi toate datele înainte de a trece mai departe.","account":"Profil","username":"Nume utilizator","display_name":"Nume afișat public","password":"Parola","change_password":"Schimbă parola?","old_password":"Parola veche","new_password":"Parola nouă","email_notifications":"Notificări prin email","new_posts":"Postări noi","comments_on_my_posts":"Comentarii la postările mele","replies_to_my_comments":"Răspunsuri la postările mele","comments":"Comentarii","forgot_password":"Ați uitat parola?","profile_updated":"Profilul a fost actualizat","please_fill_in_your_email_below_to_finish_signing_up":"Vă rugăm treceți adresa de email pentru a finaliza înregistrarea.","invite":"Invație","uninvite":"Retrage invitația","make_admin":"Promovează ca administrator","unadmin":"Retrage dreptul de administrator","delete_user":"Șterge utilizator","are_you_sure_you_want_to_delete":"Ești sigur că vrei să ștergi următoarele: ","reset_password":"Resetează parola","password_reset_link_sent":"Un link pentru resetarea parolei tocmai a fost trimis!","name":"Nume","posts":"Postări","comments_":"Comentarii","karma":"Karma","is_invited":"Este invitat?","is_admin":"Este administrator?","delete":"Șterge","member_since":"Vechime","edit_profile":"Editează profilul","sign_in":"Logare","sign_in_":"Logare!","sign_up_":"Înregistrare!","dont_have_an_account":"Nu ești înregistrat?","already_have_an_account":"Ești deja înregistrat?","sign_up":"Înregistrează-te","please_fill_in_all_fields":"Te rugăm să completezi toate câmpurile necesare.","invite_":"Invitați(i) ","left":" rămase","invite_none_left":"Număr de invitații epuizat","all":"Toți","invited":"cei invitați","uninvited":"cei neinvitați","filter_by":"Filtreză după","sort_by":"Sorteză după"});
TAPi18n._registerServerTranslator("ro", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/ru.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["ru"])) {                                                                       // 8
  TAPi18n.translations["ru"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["ru"][namespace])) {                                                            // 12
  TAPi18n.translations["ru"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["ru"][namespace], {"bio":"Обо мне","email":"Email","please_complete_your_profile_below_before_continuing":"Заполните ваш профиль перед тем, как продолжить.","account":"Аккаунт","username":"Имя пользователя","display_name":"Показать имя","twitter_username":"Имя в Twitter","github_username":"Имя в GitHub","site_url":"URL сайта","password":"Пароль","change_password":"Сменить пароль?","old_password":"Старый пароль","new_password":"Новый пароль","email_notifications":"Email оповещение","new_users":"Новые пользователи","new_posts":"Новые посты","comments_on_my_posts":"Комментариев под моими постами","replies_to_my_comments":"Ответов на мои комментарии","comments":"Комментарии","forgot_password":"Забыли пароль?","profile_updated":"Профиль обновлён","please_fill_in_your_email_below_to_finish_signing_up":"Пожалуйста, укажите ваш email ниже для окончания регистрации.","invite":"Инвайт","uninvite":"Отменить инвайт","make_admin":"Сделать админом","unadmin":"Отметить админа","delete_user":"Удалить пользователя","are_you_sure_you_want_to_delete":"Уверены, что хотите удалить ","reset_password":"Сбросить пароль","password_reset_link_sent":"Ссылка для сброса пароля отправлена!","name":"Имя","posts":"Посты","comments_":"Комментарии","karma":"Карма","is_invited":"Приглашён?","is_admin":"Админ?","delete":"Удалить","member_since":"Является членом с","edit_profile":"Редактировать профиль","sign_in":"Войти","sign_in_":"Войти!","sign_up_":"Зарегистрироваться!","dont_have_an_account":"Нет аккаунта?","already_have_an_account":"Уже есть аккаунт?","sign_up":"Зарегистрироваться","please_fill_in_all_fields":"Заполните все поля","invite_":"Пригласить ","left":" покинул(а)","invite_none_left":"Пригласить (не осталось)","all":"Все","invited":"Приглашённые","uninvited":"Неприглашённые","filter_by":"Фильтровать по","sort_by":"Сортировать по"});
TAPi18n._registerServerTranslator("ru", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/sv.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["sv"])) {                                                                       // 8
  TAPi18n.translations["sv"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["sv"][namespace])) {                                                            // 12
  TAPi18n.translations["sv"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["sv"][namespace], {"please_fill_in_missing_information_to_finish_signing_up":"Vänligen fyll i avsaknade fält nedan för att bli medlem.","bio":"Biografi","displayName":"Namn","email":"E-post","twitterUsername":"Twitter-konto","website":"Webbplats","htmlBio":"Bio","user_profile_saved":"Användarprofil sparad","this_email_is_already_taken":"E-postadressen är redan taget","all_fields_are_required":"Alla fält är obligatoriska","please_complete_your_profile_below_before_continuing":"Vänligen fyll i din profil innan du fortsätter.","account":"Profil","username":"Användarnamn","display_name":"Visningsnamn","city":"Stad","twitter_username":"Twitter-konto","github_username":"GitHub-konto","site_url":"Hemside-adress","password":"Lösenord","change_password":"Byta lösenord?","old_password":"Gammalt lösenord","new_password":"Nytt lösenord","email_notifications":"E-post-notifikationer","new_users":"Nya användare","new_posts":"Nya inlägg","comments_on_my_posts":"Kommentarer på mina inlägg","replies_to_my_comments":"Svar på mina kommentarer","comments":"Kommentarer","forgot_password":"Glömt lösenord?","profile_updated":"Profil uppdaterad","please_fill_in_your_email_below_to_finish_signing_up":"Vänligen fyll i din E-post för att bli medlem.","invite":"Bjud in","uninvite":"Avbryt inbjudning","make_admin":"Gör till admin","unadmin":"Gör inte till admin","delete_user":"Ta bort användare","are_you_sure_you_want_to_delete":"Är du säker att du vill ta bort ","reset_password":"Återställ lösenord","password_reset_link_sent":"Återställningslänk skickad!","name":"Namn","posts":"Inlägg","comments_":"Kommentarer","karma":"Karma","is_invited":"Är inbjuden?","is_admin":"Är admin?","delete":"Ta bort","member_since":"Medlem sen","edit_profile":"Redigera profil","sign_in":"Logga in","sign_in_":"Logga in!","sign_up_":"Bli Medlem!","dont_have_an_account":"Har du inget konto?","already_have_an_account":"Har du redan ett konto?","sign_up":"Bli Medlem","please_fill_in_all_fields":"Vänligen fyll i samtliga fält","invite_":"Bjud in ","left":" kvar","invite_none_left":"Inbjudningar (inga kvar)","all":"Alla","invited":"Inbjuden","uninvited":"Oinbjuden","filter_by":"Filtrera på","sort_by":"Sortera på"});
TAPi18n._registerServerTranslator("sv", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/tr.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["tr"])) {                                                                       // 8
  TAPi18n.translations["tr"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["tr"][namespace])) {                                                            // 12
  TAPi18n.translations["tr"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["tr"][namespace], {"bio":"Bio","email":"Eposta","please_complete_your_profile_below_before_continuing":"Lütfen devam etmeden önce aşağıdaki profilinizi tamamlayınız","account":"Hesap","username":"Kullanıcı adı","display_name":"Görülen isim","password":"şifre","change_password":"şifreyi değiştir?","old_password":"Eski şifre","new_password":"Yeni şifre","email_notifications":"e-posta bildirimi","new_posts":"Yeni paylaşımlar","comments_on_my_posts":"Paylaşımımdaki yorumlar","replies_to_my_comments":"Yorumlarıma cevaplar","comments":"Yorumlar","forgot_password":"Şifreyi unuttunuz mu?","profile_updated":"Profil güncellendi","please_fill_in_your_email_below_to_finish_signing_up":"Lütfen kaydınızı tamamlamak için aşağıya e-posta adresinizi giriniz","invite":"Davet et","uninvite":"Daveti geri al","make_admin":"Admin yap","unadmin":"Adminliği kaldır","delete_user":"Kullanıcıyı sil","are_you_sure_you_want_to_delete":"Silmek istediğinize emin misiniz?","reset_password":"Şifreyi sıfırla","password_reset_link_sent":"Şifre sıfırlama bağlantısı gönderildi!","name":"İsim","posts":"Paylaşımlar","karma":"Karma","is_invited":"Davet edildi mi?","is_admin":"Admin mi?","delete":"Sil","member_since":"Üyelik başlangıcı","edit_profile":"Profili değiştir","sign_in":"Giriş yap","sign_in_":"Giriş yap!","sign_up_":"Kayıt ol!","dont_have_an_account":"Hesabınız yok mu?","already_have_an_account":"Hesabınız var mı?","sign_up":"Kayıt ol","please_fill_in_all_fields":"Lütfen bütün alanları doldurunuz","left":" kalan","invite_none_left":"Davet et (hiç kalmadı)","all":"Hepsi","invited":"Davet edildi","uninvited":"Davet edilmedi","filter_by":"Filtreleme kıstası","sort_by":"Sıralama kıstası"});
TAPi18n._registerServerTranslator("tr", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/vi.i18n.js            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["vi"])) {                                                                       // 8
  TAPi18n.translations["vi"] = {};                                                                                    // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["vi"][namespace])) {                                                            // 12
  TAPi18n.translations["vi"][namespace] = {};                                                                         // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["vi"][namespace], {"bio":"Bio","email":"Email","please_complete_your_profile_below_before_continuing":"Xin điền thông tin hồ sơ của bạn để tiếp tục.","account":"Tài khoản","username":"Tên đăng nhập","display_name":"Tên xuất hiện","twitter_username":"Tài khoản Twitter","github_username":"Tài khoản GitHub","site_url":"Địa chỉ website","password":"Mật khẩu","change_password":"Thay đổi mật khẩu?","old_password":"Mật khẩu cũ","new_password":"Mật khẩu mới","email_notifications":"Email thông báo","new_users":"Người dùng mới","new_posts":"Bài mới","comments_on_my_posts":"Bình luận trên bài của tôi","replies_to_my_comments":"Trả lời ý kiến của tôi","comments":"ý kiến","forgot_password":"Quyên mật khẩu?","profile_updated":"Cập nhật hồ sơ","please_fill_in_your_email_below_to_finish_signing_up":"Xin nhập email của bạn dưới đây để hoàn thành việc đăng ký.","invite":"Mời","uninvite":"Không mời","make_admin":"Thiết lập Admin","unadmin":"Ngắt Admin","delete_user":"Xóa người dùng","are_you_sure_you_want_to_delete":"Bạn có chắc muốn xóa?","reset_password":"Thiết lập lại mật khẩu","password_reset_link_sent":"Mật khẩu đã được gửi!","name":"Tên","posts":"Bài","comments_":"Ý kiến","karma":"Karma","is_invited":"Được mời?","is_admin":"Admin?","delete":"Xóa","member_since":"Thành viên từ","edit_profile":"Sửa hồ sơ","sign_in":"Đăng nhập","sign_in_":"Đăng nhập!","sign_up_":"Đăng ký!","dont_have_an_account":"Bạn không có tài khoản?","already_have_an_account":"Bạn đã có tài khoản?","sign_up":"Đăng ký","please_fill_in_all_fields":"Nhập thông tin","invite_":"Mời ","left":" left","invite_none_left":"Invite (none left)","all":"Tất cả","invited":"Mời","uninvited":"Không mời","filter_by":"Lọc theo","sort_by":"Sắp xếp theo"});
TAPi18n._registerServerTranslator("vi", namespace);                                                                   // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/telescope:users/Applications/MAMP/websites/stewardsof/packages/telescope-users/i18n/zh-CN.i18n.js         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _ = Package.underscore._,                                                                                         // 1
    package_name = "telescope:users",                                                                                 // 2
    namespace = "telescope:users";                                                                                    // 3
                                                                                                                      // 4
if (package_name != "project") {                                                                                      // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                             // 6
}                                                                                                                     // 7
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                    // 8
  TAPi18n.translations["zh-CN"] = {};                                                                                 // 9
}                                                                                                                     // 10
                                                                                                                      // 11
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                         // 12
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                      // 13
}                                                                                                                     // 14
                                                                                                                      // 15
_.extend(TAPi18n.translations["zh-CN"][namespace], {"bio":"小传","email":"Email","please_complete_your_profile_below_before_continuing":"在继续之前请填写相关资料.","account":"帐号","username":"用户名","display_name":"昵称","password":"密码","change_password":"修改密码?","old_password":"旧密码","new_password":"新密码","email_notifications":"邮箱提醒","new_posts":"最新主题","comments_on_my_posts":"评论我的主题时","replies_to_my_comments":"回复我的回复时","comments":"评论数","forgot_password":"忘记密码?","profile_updated":"更新资料","please_fill_in_your_email_below_to_finish_signing_up":"请填写你的电子邮件完成注册.","invite":"邀请","uninvite":"未激活","make_admin":"设置为管理员","unadmin":"取消管理资格","delete_user":"删除用户","are_you_sure_you_want_to_delete":"你确定要删除用户吗 ","reset_password":"重置密码","password_reset_link_sent":"密码重置链接已发送","name":"名字","posts":"帖子数","comments_":"评论数","karma":"Karma","is_invited":"邀请用户?","is_admin":"管理员?","delete":"删除","member_since":"加入至今","edit_profile":"修改个人资料","sign_in":"登录","sign_in_":"登录!","sign_up_":"注册!","dont_have_an_account":"还没有帐号?","already_have_an_account":"已有帐号?","sign_up":"注册","please_fill_in_all_fields":"请填写完整","invite_":"邀请 ","left":" restante","invite_none_left":"Invite (none left)","all":"全部","invited":"邀请","uninvited":"未被邀请","filter_by":"过滤","sort_by":"排序"});
TAPi18n._registerServerTranslator("zh-CN", namespace);                                                                // 17
                                                                                                                      // 18
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:users'] = {
  Users: Users
};

})();

//# sourceMappingURL=telescope_users.js.map
