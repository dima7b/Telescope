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
var Invites, __, translations;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:invites/package-i18n.js                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
TAPi18n.packages["telescope:invites"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                    // 2
// define package's translation function (proxy to the i18next)                                                     // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                    // 4
                                                                                                                    // 5
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:invites/lib/invites.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var InviteSchema = new SimpleSchema({                                                                               // 1
  _id: {                                                                                                            // 2
    type: String,                                                                                                   // 3
    optional: true                                                                                                  // 4
  },                                                                                                                // 5
  invitingUserId: {                                                                                                 // 6
    type: String,                                                                                                   // 7
    optional: true                                                                                                  // 8
  },                                                                                                                // 9
  invitedUserEmail: {                                                                                               // 10
    type: String,                                                                                                   // 11
    regEx: SimpleSchema.RegEx.Email                                                                                 // 12
  },                                                                                                                // 13
  accepted: {                                                                                                       // 14
    type: Boolean,                                                                                                  // 15
    optional: true                                                                                                  // 16
  }                                                                                                                 // 17
});                                                                                                                 // 18
                                                                                                                    // 19
Invites = new Meteor.Collection("invites");                                                                         // 20
Invites.attachSchema(InviteSchema);                                                                                 // 21
                                                                                                                    // 22
Users.addField([                                                                                                    // 23
  /**                                                                                                               // 24
    A count of the user's remaining invites                                                                         // 25
  */                                                                                                                // 26
  {                                                                                                                 // 27
    fieldName: "telescope.inviteCount",                                                                             // 28
    fieldSchema: {                                                                                                  // 29
      type: Number,                                                                                                 // 30
      optional: true                                                                                                // 31
    }                                                                                                               // 32
  },                                                                                                                // 33
  /**                                                                                                               // 34
    A count of how many users have been invited by the user                                                         // 35
  */                                                                                                                // 36
  {                                                                                                                 // 37
    fieldName: "telescope.invitedCount",                                                                            // 38
    fieldSchema: {                                                                                                  // 39
      type: Number,                                                                                                 // 40
      optional: true                                                                                                // 41
    }                                                                                                               // 42
  },                                                                                                                // 43
  /**                                                                                                               // 44
    Whether the user is invited or not                                                                              // 45
  */                                                                                                                // 46
  {                                                                                                                 // 47
    fieldName: "telescope.isInvited",                                                                               // 48
    fieldSchema: {                                                                                                  // 49
      type: Boolean,                                                                                                // 50
      public: true,                                                                                                 // 51
      optional: true,                                                                                               // 52
      editableBy: ["admin"],                                                                                        // 53
      autoform: {                                                                                                   // 54
        omit: true                                                                                                  // 55
      }                                                                                                             // 56
    }                                                                                                               // 57
  },                                                                                                                // 58
  /**                                                                                                               // 59
    The _id of the user who invited the current user                                                                // 60
  */                                                                                                                // 61
  {                                                                                                                 // 62
    fieldName: "telescope.invitedBy",                                                                               // 63
    fieldSchema: {                                                                                                  // 64
      type: String,                                                                                                 // 65
      optional: true,                                                                                               // 66
      autoform: {                                                                                                   // 67
        omit: true                                                                                                  // 68
      }                                                                                                             // 69
    }                                                                                                               // 70
  },                                                                                                                // 71
  /**                                                                                                               // 72
    The name of the user who invited the current user                                                               // 73
  */                                                                                                                // 74
  {                                                                                                                 // 75
    fieldName: "telescope.invitedByName",                                                                           // 76
    fieldSchema: {                                                                                                  // 77
      type: String,                                                                                                 // 78
      optional: true,                                                                                               // 79
      autoform: {                                                                                                   // 80
        omit: true                                                                                                  // 81
      }                                                                                                             // 82
    }                                                                                                               // 83
  }                                                                                                                 // 84
]);                                                                                                                 // 85
                                                                                                                    // 86
// invites are managed through Meteor method                                                                        // 87
                                                                                                                    // 88
Invites.deny({                                                                                                      // 89
  insert: function(){ return true; },                                                                               // 90
  update: function(){ return true; },                                                                               // 91
  remove: function(){ return true; }                                                                                // 92
});                                                                                                                 // 93
                                                                                                                    // 94
Telescope.modules.add("profileEdit", {                                                                              // 95
  template: 'user_invites',                                                                                         // 96
  order: 2                                                                                                          // 97
});                                                                                                                 // 98
                                                                                                                    // 99
 function setStartingInvites (user) {                                                                               // 100
  // give new users a few invites (default to 3)                                                                    // 101
  user.telescope.inviteCount = Settings.get('startInvitesCount', 3);                                                // 102
  return user;                                                                                                      // 103
}                                                                                                                   // 104
Telescope.callbacks.add("onCreateUser", setStartingInvites);                                                        // 105
                                                                                                                    // 106
// on profile completion, check if the new user has been invited                                                    // 107
// if so set her status accordingly and update invitation info                                                      // 108
function checkIfInvited (user) {                                                                                    // 109
                                                                                                                    // 110
  var invite = Invites.findOne({ invitedUserEmail : Users.getEmail(user) });                                        // 111
                                                                                                                    // 112
  if(invite){                                                                                                       // 113
                                                                                                                    // 114
    var invitedBy = Meteor.users.findOne({ _id : invite.invitingUserId });                                          // 115
                                                                                                                    // 116
    Users.update(user._id, { $set: {                                                                                // 117
      "telescope.isInvited": true,                                                                                  // 118
      "telescope.invitedBy": invitedBy._id,                                                                         // 119
      "telescope.invitedByName": Users.getDisplayName(invitedBy)                                                    // 120
    }});                                                                                                            // 121
                                                                                                                    // 122
    Invites.update(invite._id, {$set : {                                                                            // 123
      accepted : true                                                                                               // 124
    }});                                                                                                            // 125
                                                                                                                    // 126
  }                                                                                                                 // 127
}                                                                                                                   // 128
Telescope.callbacks.add("profileCompletedAsync", checkIfInvited);                                                   // 129
                                                                                                                    // 130
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:invites/lib/server/invites.js                                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Meteor.methods({                                                                                                    // 1
                                                                                                                    // 2
  inviteUser: function(invitation){                                                                                 // 3
                                                                                                                    // 4
    check(invitation, Match.Any);                                                                                   // 5
                                                                                                                    // 6
    // invite user returns the following hash                                                                       // 7
    // { newUser : true|false }                                                                                     // 8
    // newUser is true if the person being invited is not on the site yet                                           // 9
                                                                                                                    // 10
    // invitation can either contain userId or an email address :                                                   // 11
    // { invitedUserEmail : 'bob@gmail.com' } or { userId : 'user-id' }                                             // 12
                                                                                                                    // 13
    check(invitation, Match.OneOf(                                                                                  // 14
      { invitedUserEmail : String },                                                                                // 15
      { userId : String }                                                                                           // 16
    ));                                                                                                             // 17
                                                                                                                    // 18
    var user = invitation.invitedUserEmail ?                                                                        // 19
          Meteor.users.findOne({ emails : { $elemMatch: { address: invitation.invitedUserEmail } } }) :             // 20
          Meteor.users.findOne({ _id : invitation.userId });                                                        // 21
                                                                                                                    // 22
    var userEmail = invitation.invitedUserEmail ? invitation.invitedUserEmail :Users.getEmail(user);                // 23
    var currentUser = Meteor.user();                                                                                // 24
    var currentUserIsAdmin = Users.is.admin(currentUser);                                                           // 25
    var currentUserCanInvite = currentUserIsAdmin || (currentUser.telescope.inviteCount > 0 && Users.can.invite(currentUser));
                                                                                                                    // 27
    // check if the person is already invited                                                                       // 28
    if(user && Users.is.invited(user)){                                                                             // 29
      throw new Meteor.Error(403, "This person is already invited.");                                               // 30
    } else {                                                                                                        // 31
      if (!currentUserCanInvite){                                                                                   // 32
        throw new Meteor.Error(701, "You can't invite this user, sorry.");                                          // 33
      }                                                                                                             // 34
                                                                                                                    // 35
      // don't allow duplicate multiple invite for the same person                                                  // 36
      var existingInvite = Invites.findOne({ invitedUserEmail : userEmail });                                       // 37
                                                                                                                    // 38
      if (existingInvite) {                                                                                         // 39
        throw new Meteor.Error(403, "Somebody has already invited this person.");                                   // 40
      }                                                                                                             // 41
                                                                                                                    // 42
      // create an invite                                                                                           // 43
      // consider invite accepted if the invited person has an account already                                      // 44
      Invites.insert({                                                                                              // 45
        invitingUserId: Meteor.userId(),                                                                            // 46
        invitedUserEmail: userEmail,                                                                                // 47
        accepted: typeof user !== "undefined"                                                                       // 48
      });                                                                                                           // 49
                                                                                                                    // 50
      // update invinting user                                                                                      // 51
      Meteor.users.update(Meteor.userId(), {$inc:{"telescope.inviteCount": -1, "telescope.invitedCount": 1}});      // 52
                                                                                                                    // 53
      if(user){                                                                                                     // 54
        // update invited user                                                                                      // 55
        Meteor.users.update(user._id, {                                                                             // 56
          $set: {                                                                                                   // 57
            "telescope.isInvited": true,                                                                            // 58
            "telescope.invitedBy": Meteor.userId(),                                                                 // 59
            "telescope.invitedByName": Users.getDisplayName(currentUser)                                            // 60
          }                                                                                                         // 61
        });                                                                                                         // 62
      }                                                                                                             // 63
                                                                                                                    // 64
      var communityName = Settings.get('title','Telescope'),                                                        // 65
          emailSubject = 'You are invited to try '+communityName,                                                   // 66
          emailProperties = {                                                                                       // 67
            newUser : typeof user === 'undefined',                                                                  // 68
            communityName : communityName,                                                                          // 69
            actionLink : user ? Telescope.utils.getSigninUrl() : Telescope.utils.getSignupUrl(),                    // 70
            invitedBy : Users.getDisplayName(currentUser),                                                          // 71
            profileUrl : Users.getProfileUrl(currentUser)                                                           // 72
          };                                                                                                        // 73
                                                                                                                    // 74
      Meteor.setTimeout(function () {                                                                               // 75
        Telescope.email.buildAndSend(userEmail, emailSubject, 'emailInvite', emailProperties);                      // 76
      }, 1);                                                                                                        // 77
                                                                                                                    // 78
    }                                                                                                               // 79
                                                                                                                    // 80
    return {                                                                                                        // 81
      newUser : typeof user === 'undefined'                                                                         // 82
    };                                                                                                              // 83
  },                                                                                                                // 84
  unInviteUser: function (userId) {                                                                                 // 85
    Meteor.users.update(userId, {$set: {"telescope.isInvited": false}});                                            // 86
  }                                                                                                                 // 87
});                                                                                                                 // 88
                                                                                                                    // 89
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:invites/lib/server/publications.js                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Meteor.publish('invites', function (userId) {                                                                       // 1
  var invites = Invites.find({invitingUserId: userId});                                                             // 2
  return (this.userId === userId || Users.is.adminById(this.userId)) ? invites : [];                                // 3
});                                                                                                                 // 4
                                                                                                                    // 5
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:invites/Applications/MAMP/websites/stewardsof/packages/telescope-invites/i18n/de.i18n.js      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "telescope:invites",                                                                             // 2
    namespace = "telescope:invites";                                                                                // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                     // 8
  TAPi18n.translations["de"] = {};                                                                                  // 9
}                                                                                                                   // 10
                                                                                                                    // 11
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                          // 12
  TAPi18n.translations["de"][namespace] = {};                                                                       // 13
}                                                                                                                   // 14
                                                                                                                    // 15
_.extend(TAPi18n.translations["de"][namespace], {"translation_key":"translation string"});                          // 16
TAPi18n._registerServerTranslator("de", namespace);                                                                 // 17
                                                                                                                    // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:invites/Applications/MAMP/websites/stewardsof/packages/telescope-invites/i18n/en.i18n.js      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "telescope:invites",                                                                             // 2
    namespace = "telescope:invites";                                                                                // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
// integrate the fallback language translations                                                                     // 8
translations = {};                                                                                                  // 9
translations[namespace] = {"translation_key":"translation string"};                                                 // 10
TAPi18n._loadLangFileObject("en", translations);                                                                    // 11
TAPi18n._registerServerTranslator("en", namespace);                                                                 // 12
                                                                                                                    // 13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:invites/Applications/MAMP/websites/stewardsof/packages/telescope-invites/i18n/es.i18n.js      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "telescope:invites",                                                                             // 2
    namespace = "telescope:invites";                                                                                // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                     // 8
  TAPi18n.translations["es"] = {};                                                                                  // 9
}                                                                                                                   // 10
                                                                                                                    // 11
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                          // 12
  TAPi18n.translations["es"][namespace] = {};                                                                       // 13
}                                                                                                                   // 14
                                                                                                                    // 15
_.extend(TAPi18n.translations["es"][namespace], {});                                                                // 16
TAPi18n._registerServerTranslator("es", namespace);                                                                 // 17
                                                                                                                    // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:invites/Applications/MAMP/websites/stewardsof/packages/telescope-invites/i18n/fr.i18n.js      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "telescope:invites",                                                                             // 2
    namespace = "telescope:invites";                                                                                // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                     // 8
  TAPi18n.translations["fr"] = {};                                                                                  // 9
}                                                                                                                   // 10
                                                                                                                    // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                          // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                       // 13
}                                                                                                                   // 14
                                                                                                                    // 15
_.extend(TAPi18n.translations["fr"][namespace], {"translation_key":"translation string"});                          // 16
TAPi18n._registerServerTranslator("fr", namespace);                                                                 // 17
                                                                                                                    // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:invites/Applications/MAMP/websites/stewardsof/packages/telescope-invites/i18n/it.i18n.js      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "telescope:invites",                                                                             // 2
    namespace = "telescope:invites";                                                                                // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                     // 8
  TAPi18n.translations["it"] = {};                                                                                  // 9
}                                                                                                                   // 10
                                                                                                                    // 11
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                          // 12
  TAPi18n.translations["it"][namespace] = {};                                                                       // 13
}                                                                                                                   // 14
                                                                                                                    // 15
_.extend(TAPi18n.translations["it"][namespace], {"translation_key":"translation string"});                          // 16
TAPi18n._registerServerTranslator("it", namespace);                                                                 // 17
                                                                                                                    // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:invites/Applications/MAMP/websites/stewardsof/packages/telescope-invites/i18n/zh-CN.i18n.js   //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "telescope:invites",                                                                             // 2
    namespace = "telescope:invites";                                                                                // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                  // 8
  TAPi18n.translations["zh-CN"] = {};                                                                               // 9
}                                                                                                                   // 10
                                                                                                                    // 11
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                       // 12
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                    // 13
}                                                                                                                   // 14
                                                                                                                    // 15
_.extend(TAPi18n.translations["zh-CN"][namespace], {"translation_key":"translation string"});                       // 16
TAPi18n._registerServerTranslator("zh-CN", namespace);                                                              // 17
                                                                                                                    // 18
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:invites'] = {
  Invites: Invites
};

})();

//# sourceMappingURL=telescope_invites.js.map
