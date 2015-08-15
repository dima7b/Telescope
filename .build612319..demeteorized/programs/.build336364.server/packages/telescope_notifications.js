(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Herald = Package['kestanous:herald'].Herald;
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
var Herald, __, getUnsubscribeLink, Handlebars, translations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/herald.js                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// send emails every second when in dev environment                                                                // 1
if (Meteor.absoluteUrl().indexOf('localhost') !== -1)                                                              // 2
  Herald.settings.queueTimer = 1000;                                                                               // 3
                                                                                                                   // 4
Meteor.startup(function () {                                                                                       // 5
                                                                                                                   // 6
  Herald.collection.deny({                                                                                         // 7
    update: !Users.can.editById,                                                                                   // 8
    remove: !Users.can.editById                                                                                    // 9
  });                                                                                                              // 10
                                                                                                                   // 11
  // disable all email notifications when "emailNotifications" is set to false                                     // 12
  Herald.settings.overrides.email = !Settings.get('emailNotifications', true);                                     // 13
                                                                                                                   // 14
});                                                                                                                // 15
                                                                                                                   // 16
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/helpers.js                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/**                                                                                                                // 1
 * Use user and post properties to populate post notifications objects.                                            // 2
 * @param {Object} post                                                                                            // 3
 */                                                                                                                // 4
Posts.getNotificationProperties = function (post) {                                                                // 5
  var postAuthor = Meteor.users.findOne(post.userId);                                                              // 6
  var properties = {                                                                                               // 7
    postAuthorName : Posts.getAuthorName(post),                                                                    // 8
    postTitle : Telescope.utils.cleanUp(post.title),                                                               // 9
    profileUrl: Users.getProfileUrl(postAuthor, true),                                                             // 10
    postUrl: Posts.getPageUrl(post, true),                                                                         // 11
    thumbnailUrl: post.thumbnailUrl,                                                                               // 12
    linkUrl: !!post.url ? Telescope.utils.getOutgoingUrl(post.url) : Posts.getPageUrl(post, true)                  // 13
  };                                                                                                               // 14
                                                                                                                   // 15
  if(post.url)                                                                                                     // 16
    properties.url = post.url;                                                                                     // 17
                                                                                                                   // 18
  if(post.htmlBody)                                                                                                // 19
    properties.htmlBody = post.htmlBody;                                                                           // 20
                                                                                                                   // 21
  return properties;                                                                                               // 22
};                                                                                                                 // 23
                                                                                                                   // 24
/**                                                                                                                // 25
 * Use comment, user, and post properties to populate comment notifications objects.                               // 26
 * @param {Object} comment                                                                                         // 27
 */                                                                                                                // 28
Comments.getNotificationProperties = function (comment, post) {                                                    // 29
  var commentAuthor = Meteor.users.findOne(comment.userId);                                                        // 30
  var properties = {                                                                                               // 31
    profileUrl: commentAuthor && commentAuthor.getProfileUrl(true),                                                // 32
    postUrl: Posts.getPageUrl(post, true),                                                                         // 33
    authorName : Comments.getAuthorName(comment),                                                                  // 34
    postTitle: post.title,                                                                                         // 35
    htmlBody: comment.htmlBody,                                                                                    // 36
    commentUrl: Comments.getPageUrl(comment, true)                                                                 // 37
  };                                                                                                               // 38
  return properties;                                                                                               // 39
};                                                                                                                 // 40
                                                                                                                   // 41
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/custom_fields.js                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Settings.addField({                                                                                                // 1
  fieldName: 'emailNotifications',                                                                                 // 2
  fieldSchema: {                                                                                                   // 3
    type: Boolean,                                                                                                 // 4
    optional: true,                                                                                                // 5
    defaultValue: true,                                                                                            // 6
    autoform: {                                                                                                    // 7
      group: 'notifications',                                                                                      // 8
      instructions: 'Enable email notifications for new posts and new comments (requires restart).'                // 9
    }                                                                                                              // 10
  }                                                                                                                // 11
});                                                                                                                // 12
                                                                                                                   // 13
// make it possible to disable notifications on a per-comment basis                                                // 14
Comments.addField(                                                                                                 // 15
  {                                                                                                                // 16
    fieldName: 'disableNotifications',                                                                             // 17
    fieldSchema: {                                                                                                 // 18
      type: Boolean,                                                                                               // 19
      optional: true,                                                                                              // 20
      autoform: {                                                                                                  // 21
        omit: true                                                                                                 // 22
      }                                                                                                            // 23
    }                                                                                                              // 24
  }                                                                                                                // 25
);                                                                                                                 // 26
                                                                                                                   // 27
// Add notifications options to user profile settings                                                              // 28
Users.addField([                                                                                                   // 29
  {                                                                                                                // 30
    fieldName: 'telescope.notifications.users',                                                                    // 31
    fieldSchema: {                                                                                                 // 32
      label: 'New users',                                                                                          // 33
      type: Boolean,                                                                                               // 34
      optional: true,                                                                                              // 35
      defaultValue: false,                                                                                         // 36
      editableBy: ['admin'],                                                                                       // 37
      autoform: {                                                                                                  // 38
        group: 'Email Notifications'                                                                               // 39
      }                                                                                                            // 40
    }                                                                                                              // 41
  },                                                                                                               // 42
  {                                                                                                                // 43
    fieldName: 'telescope.notifications.posts',                                                                    // 44
    fieldSchema: {                                                                                                 // 45
      label: 'New posts',                                                                                          // 46
      type: Boolean,                                                                                               // 47
      optional: true,                                                                                              // 48
      defaultValue: false,                                                                                         // 49
      editableBy: ['admin', 'member'],                                                                             // 50
      autoform: {                                                                                                  // 51
        group: 'Email Notifications'                                                                               // 52
      }                                                                                                            // 53
    }                                                                                                              // 54
  },                                                                                                               // 55
  {                                                                                                                // 56
    fieldName: 'telescope.notifications.comments',                                                                 // 57
    fieldSchema: {                                                                                                 // 58
      label: 'Comments on my posts',                                                                               // 59
      type: Boolean,                                                                                               // 60
      optional: true,                                                                                              // 61
      defaultValue: true,                                                                                          // 62
      editableBy: ['admin', 'member'],                                                                             // 63
      autoform: {                                                                                                  // 64
        group: 'Email Notifications'                                                                               // 65
      }                                                                                                            // 66
    }                                                                                                              // 67
  },                                                                                                               // 68
  {                                                                                                                // 69
    fieldName: 'telescope.notifications.replies',                                                                  // 70
    fieldSchema: {                                                                                                 // 71
      label: 'Replies to my comments',                                                                             // 72
      type: Boolean,                                                                                               // 73
      optional: true,                                                                                              // 74
      defaultValue: true,                                                                                          // 75
      editableBy: ['admin', 'member'],                                                                             // 76
      autoform: {                                                                                                  // 77
        group: 'Email Notifications'                                                                               // 78
      }                                                                                                            // 79
    }                                                                                                              // 80
  }                                                                                                                // 81
]);                                                                                                                // 82
                                                                                                                   // 83
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/notifications.js                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var notifications = {                                                                                              // 1
                                                                                                                   // 2
  newPost: {                                                                                                       // 3
    properties: function () {                                                                                      // 4
      return Posts.getNotificationProperties(this.data.post);                                                      // 5
    },                                                                                                             // 6
    subject: function () {                                                                                         // 7
      return this.postAuthorName+' has created a new post: '+this.postTitle;                                       // 8
    },                                                                                                             // 9
    emailTemplate: "emailNewPost"                                                                                  // 10
  },                                                                                                               // 11
                                                                                                                   // 12
  newPendingPost: {                                                                                                // 13
    properties: function () {                                                                                      // 14
      return Posts.getNotificationProperties(this.data.post);                                                      // 15
    },                                                                                                             // 16
    subject: function () {                                                                                         // 17
      return this.postAuthorName+' has a new post pending approval: '+this.postTitle;                              // 18
    },                                                                                                             // 19
    emailTemplate: "emailNewPendingPost"                                                                           // 20
  },                                                                                                               // 21
                                                                                                                   // 22
  postApproved: {                                                                                                  // 23
    properties: function () {                                                                                      // 24
      return Posts.getNotificationProperties(this.data.post);                                                      // 25
    },                                                                                                             // 26
    subject: function () {                                                                                         // 27
      return this.postAuthorName+' has a new post pending approval: '+this.postTitle;                              // 28
    },                                                                                                             // 29
    emailTemplate: "emailPostApproved",                                                                            // 30
    onsiteTemplate: "notification_post_approved"                                                                   // 31
  },                                                                                                               // 32
                                                                                                                   // 33
  newComment: {                                                                                                    // 34
    properties: function () {                                                                                      // 35
      return Comments.getNotificationProperties(this.data.comment, this.data.post);                                // 36
    },                                                                                                             // 37
    subject: function () {                                                                                         // 38
      return this.authorName+' left a new comment on your post "' + this.postTitle + '"';                          // 39
    },                                                                                                             // 40
    emailTemplate: "emailNewComment",                                                                              // 41
    onsiteTemplate: "notification_new_comment"                                                                     // 42
  },                                                                                                               // 43
                                                                                                                   // 44
  newReply: {                                                                                                      // 45
    properties: function () {                                                                                      // 46
      return Comments.getNotificationProperties(this.data.comment, this.data.post);                                // 47
    },                                                                                                             // 48
    subject: function () {                                                                                         // 49
      return this.authorName+' replied to your comment on "'+this.postTitle+'"';                                   // 50
    },                                                                                                             // 51
    emailTemplate: "emailNewReply",                                                                                // 52
    onsiteTemplate: "notification_new_reply"                                                                       // 53
  },                                                                                                               // 54
                                                                                                                   // 55
  newCommentSubscribed: {                                                                                          // 56
    properties: function () {                                                                                      // 57
      return Comments.getNotificationProperties(this.data.comment, this.data.post);                                // 58
    },                                                                                                             // 59
    subject: function () {                                                                                         // 60
      return this.authorName+' left a new comment on "' + this.postTitle + '"';                                    // 61
    },                                                                                                             // 62
    emailTemplate: "notification_new_comment",                                                                     // 63
    onsite: "notification_new_comment"                                                                             // 64
  }                                                                                                                // 65
                                                                                                                   // 66
};                                                                                                                 // 67
                                                                                                                   // 68
// set up couriers                                                                                                 // 69
_.each(notifications, function (notification, notificationName) {                                                  // 70
                                                                                                                   // 71
  var courier = {                                                                                                  // 72
    media: {                                                                                                       // 73
      email: {                                                                                                     // 74
        emailRunner: function (user) {                                                                             // 75
          var properties = notification.properties.call(this);                                                     // 76
          var subject = notification.subject.call(properties);                                                     // 77
          var html = Telescope.email.buildTemplate(Telescope.email.getTemplate(notification.emailTemplate)(properties));
          Telescope.email.send(Users.getEmail(user), subject, html);                                               // 79
        }                                                                                                          // 80
      }                                                                                                            // 81
    }                                                                                                              // 82
  };                                                                                                               // 83
                                                                                                                   // 84
  if (!!notification.onsiteTemplate) {                                                                             // 85
    courier.media.onsite = {};                                                                                     // 86
    courier.message = function () {                                                                                // 87
      var properties = notification.properties.call(this);                                                         // 88
      return Blaze.toHTML(Blaze.With(properties, function () {                                                     // 89
        return Template[notification.onsiteTemplate];                                                              // 90
      }));                                                                                                         // 91
    };                                                                                                             // 92
  }                                                                                                                // 93
                                                                                                                   // 94
  Herald.addCourier(notificationName, courier);                                                                    // 95
                                                                                                                   // 96
});                                                                                                                // 97
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/callbacks.js                                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
// ------------------------------------------------------------------------------------------- //                  // 1
// -----------------------------------------  Posts ------------------------------------------ //                  // 2
// ------------------------------------------------------------------------------------------- //                  // 3
                                                                                                                   // 4
// add new post notification callback on post submit                                                               // 5
function postSubmitNotification (post) {                                                                           // 6
                                                                                                                   // 7
  var adminIds = _.pluck(Users.find({'isAdmin': true}, {fields: {_id:1}}).fetch(), '_id');                         // 8
  var notifiedUserIds = _.pluck(Users.find({'telescope.notifications.posts': true}, {fields: {_id:1}}).fetch(), '_id');
  var notificationData = {                                                                                         // 10
    post: _.pick(post, '_id', 'userId', 'title', 'url')                                                            // 11
  };                                                                                                               // 12
                                                                                                                   // 13
  // remove post author ID from arrays                                                                             // 14
  adminIds = _.without(adminIds, post.userId);                                                                     // 15
  notifiedUserIds = _.without(notifiedUserIds, post.userId);                                                       // 16
                                                                                                                   // 17
  if (post.status === Posts.config.STATUS_PENDING && !!adminIds.length) {                                          // 18
    // if post is pending, only notify admins                                                                      // 19
    Herald.createNotification(adminIds, {courier: 'newPendingPost', data: notificationData});                      // 20
  } else if (!!notifiedUserIds.length) {                                                                           // 21
    // if post is approved, notify everybody                                                                       // 22
    Herald.createNotification(notifiedUserIds, {courier: 'newPost', data: notificationData});                      // 23
  }                                                                                                                // 24
                                                                                                                   // 25
}                                                                                                                  // 26
Telescope.callbacks.add("postSubmitAsync", postSubmitNotification);                                                // 27
                                                                                                                   // 28
function postApprovedNotification (post) {                                                                         // 29
                                                                                                                   // 30
  var notificationData = {                                                                                         // 31
    post: _.pick(post, '_id', 'userId', 'title', 'url')                                                            // 32
  };                                                                                                               // 33
                                                                                                                   // 34
  Herald.createNotification(post.userId, {courier: 'postApproved', data: notificationData});                       // 35
}                                                                                                                  // 36
Telescope.callbacks.add("postApprovedAsync", postApprovedNotification);                                            // 37
                                                                                                                   // 38
// ------------------------------------------------------------------------------------------- //                  // 39
// ---------------------------------------- Comments ----------------------------------------- //                  // 40
// ------------------------------------------------------------------------------------------- //                  // 41
                                                                                                                   // 42
// add new comment notification callback on comment submit                                                         // 43
function commentSubmitNotifications (comment) {                                                                    // 44
                                                                                                                   // 45
  // note: dummy content has disableNotifications set to true                                                      // 46
  if(Meteor.isServer && !comment.disableNotifications){                                                            // 47
                                                                                                                   // 48
    var post = Posts.findOne(comment.postId),                                                                      // 49
        postAuthor = Users.findOne(post.userId),                                                                   // 50
        userIdsNotified = [],                                                                                      // 51
        notificationData = {                                                                                       // 52
          comment: _.pick(comment, '_id', 'userId', 'author', 'htmlBody'),                                         // 53
          post: _.pick(post, '_id', 'userId', 'title', 'url')                                                      // 54
        };                                                                                                         // 55
                                                                                                                   // 56
                                                                                                                   // 57
    // 1. Notify author of post (if they have new comment notifications turned on)                                 // 58
    //    but do not notify author of post if they're the ones posting the comment                                 // 59
    if (Users.getSetting(postAuthor, "notifications.comments", true) && comment.userId !== postAuthor._id) {       // 60
      Herald.createNotification(post.userId, {courier: 'newComment', data: notificationData});                     // 61
      userIdsNotified.push(post.userId);                                                                           // 62
    }                                                                                                              // 63
                                                                                                                   // 64
    // 2. Notify author of comment being replied to                                                                // 65
    if (!!comment.parentCommentId) {                                                                               // 66
                                                                                                                   // 67
      var parentComment = Comments.findOne(comment.parentCommentId);                                               // 68
                                                                                                                   // 69
      // do not notify author of parent comment if they're also post author or comment author                      // 70
      // (someone could be replying to their own comment)                                                          // 71
      if (parentComment.userId !== post.userId && parentComment.userId !== comment.userId) {                       // 72
                                                                                                                   // 73
        var parentCommentAuthor = Users.findOne(parentComment.userId);                                             // 74
                                                                                                                   // 75
        // do not notify parent comment author if they have reply notifications turned off                         // 76
        if (Users.getSetting(parentCommentAuthor, "notifications.replies", true)) {                                // 77
                                                                                                                   // 78
          // add parent comment to notification data                                                               // 79
          notificationData.parentComment = _.pick(parentComment, '_id', 'userId', 'author', 'htmlBody');           // 80
                                                                                                                   // 81
          Herald.createNotification(parentComment.userId, {courier: 'newReply', data: notificationData});          // 82
          userIdsNotified.push(parentComment.userId);                                                              // 83
        }                                                                                                          // 84
      }                                                                                                            // 85
                                                                                                                   // 86
    }                                                                                                              // 87
                                                                                                                   // 88
    // 3. Notify users subscribed to the thread                                                                    // 89
    // TODO: ideally this would be injected from the telescope-subscribe-to-posts package                          // 90
    if (!!post.subscribers) {                                                                                      // 91
                                                                                                                   // 92
      // remove userIds of users that have already been notified                                                   // 93
      // and of comment author (they could be replying in a thread they're subscribed to)                          // 94
      var subscriberIdsToNotify = _.difference(post.subscribers, userIdsNotified, [comment.userId]);               // 95
      Herald.createNotification(subscriberIdsToNotify, {courier: 'newCommentSubscribed', data: notificationData}); // 96
                                                                                                                   // 97
      userIdsNotified = userIdsNotified.concat(subscriberIdsToNotify);                                             // 98
                                                                                                                   // 99
    }                                                                                                              // 100
                                                                                                                   // 101
  }                                                                                                                // 102
}                                                                                                                  // 103
Telescope.callbacks.add("commentSubmitAsync", commentSubmitNotifications);                                         // 104
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/modules.js                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Telescope.modules.add("secondaryNav", {                                                                            // 1
  template:'notifications_menu',                                                                                   // 2
  order: 20                                                                                                        // 3
});                                                                                                                // 4
                                                                                                                   // 5
Telescope.modules.add("mobileNav", {                                                                               // 6
  template:'notifications_menu',                                                                                   // 7
  order: 20                                                                                                        // 8
});                                                                                                                // 9
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/package-i18n.js                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
TAPi18n.packages["telescope:notifications"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"};
                                                                                                                   // 2
// define package's translation function (proxy to the i18next)                                                    // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                   // 4
                                                                                                                   // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/notifications-server.js                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
getUnsubscribeLink = function(user){                                                                               // 1
  return Telescope.utils.getRouteUrl('unsubscribe', {hash: user.telescope.emailHash});                             // 2
};                                                                                                                 // 3
                                                                                                                   // 4
Meteor.methods({                                                                                                   // 5
  unsubscribeUser : function(hash){                                                                                // 6
    check(hash, String);                                                                                           // 7
    // TO-DO: currently, if you have somebody's email you can unsubscribe them                                     // 8
    // A user-specific salt should be added to the hashing method to prevent this                                  // 9
    var user = Meteor.users.findOne({"telescope.emailHash": hash});                                                // 10
    if(user){                                                                                                      // 11
      Meteor.users.update(user._id, {                                                                              // 12
        $set: {                                                                                                    // 13
          'profile.notifications.users' : 0,                                                                       // 14
          'profile.notifications.posts' : 0,                                                                       // 15
          'profile.notifications.comments' : 0,                                                                    // 16
          'profile.notifications.replies' : 0                                                                      // 17
        }                                                                                                          // 18
      });                                                                                                          // 19
      return true;                                                                                                 // 20
    }                                                                                                              // 21
    return false;                                                                                                  // 22
  }                                                                                                                // 23
});                                                                                                                // 24
                                                                                                                   // 25
                                                                                                                   // 26
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/routes.js                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Meteor.startup(function () {                                                                                       // 1
                                                                                                                   // 2
  // Notification email                                                                                            // 3
                                                                                                                   // 4
  Router.route('/email/notification/:id?', {                                                                       // 5
    name: 'notification',                                                                                          // 6
    where: 'server',                                                                                               // 7
    action: function() {                                                                                           // 8
      var notification = Herald.collection.findOne(this.params.id);                                                // 9
      var notificationContents = buildEmailNotification(notification);                                             // 10
      this.response.write(notificationContents.html);                                                              // 11
      this.response.end();                                                                                         // 12
    }                                                                                                              // 13
  });                                                                                                              // 14
                                                                                                                   // 15
  // New user email                                                                                                // 16
                                                                                                                   // 17
  Router.route('/email/new-user/:id?', {                                                                           // 18
    name: 'newUser',                                                                                               // 19
    where: 'server',                                                                                               // 20
    action: function() {                                                                                           // 21
      var html;                                                                                                    // 22
      var user = Meteor.users.findOne(this.params.id);                                                             // 23
      var emailProperties = {                                                                                      // 24
        profileUrl: Users.getProfileUrl(user),                                                                     // 25
        username: Users.getUserName(user)                                                                          // 26
      };                                                                                                           // 27
      html = Telescope.email.getTemplate('emailNewUser')(emailProperties);                                         // 28
      this.response.write(Telescope.email.buildTemplate(html));                                                    // 29
      this.response.end();                                                                                         // 30
    }                                                                                                              // 31
  });                                                                                                              // 32
                                                                                                                   // 33
  // New post email                                                                                                // 34
                                                                                                                   // 35
  Router.route('/email/new-post/:id?', {                                                                           // 36
    name: 'newPost',                                                                                               // 37
    where: 'server',                                                                                               // 38
    action: function() {                                                                                           // 39
      var html;                                                                                                    // 40
      var post = Posts.findOne(this.params.id);                                                                    // 41
      if (!!post) {                                                                                                // 42
        html = Telescope.email.getTemplate('emailNewPost')(Posts.getNotificationProperties(post));                 // 43
      } else {                                                                                                     // 44
        html = "<h3>No post found.</h3>"                                                                           // 45
      }                                                                                                            // 46
      this.response.write(Telescope.email.buildTemplate(html));                                                    // 47
      this.response.end();                                                                                         // 48
    }                                                                                                              // 49
  });                                                                                                              // 50
                                                                                                                   // 51
  // Post approved                                                                                                 // 52
                                                                                                                   // 53
  Router.route('/email/post-approved/:id?', {                                                                      // 54
    name: 'postApproved',                                                                                          // 55
    where: 'server',                                                                                               // 56
    action: function() {                                                                                           // 57
      var html;                                                                                                    // 58
      var post = Posts.findOne(this.params.id);                                                                    // 59
      if (!!post) {                                                                                                // 60
        html = Telescope.email.getTemplate('emailPostApproved')(Posts.getNotificationProperties(post));            // 61
      } else {                                                                                                     // 62
        html = "<h3>No post found.</h3>"                                                                           // 63
      }                                                                                                            // 64
      this.response.write(Telescope.email.buildTemplate(html));                                                    // 65
      this.response.end();                                                                                         // 66
    }                                                                                                              // 67
  });                                                                                                              // 68
                                                                                                                   // 69
  // New comment email                                                                                             // 70
                                                                                                                   // 71
  Router.route('/email/new-comment/:id?', {                                                                        // 72
    name: 'newComment',                                                                                            // 73
    where: 'server',                                                                                               // 74
    action: function() {                                                                                           // 75
      var html;                                                                                                    // 76
      var comment = Comments.findOne(this.params.id);                                                              // 77
      var post = Posts.findOne(comment.postId);                                                                    // 78
      if (!!comment) {                                                                                             // 79
        html = Telescope.email.getTemplate('emailNewComment')(Comments.getNotificationProperties(comment, post));  // 80
      } else {                                                                                                     // 81
        html = "<h3>No post found.</h3>"                                                                           // 82
      }                                                                                                            // 83
      this.response.write(Telescope.email.buildTemplate(html));                                                    // 84
      this.response.end();                                                                                         // 85
    }                                                                                                              // 86
  });                                                                                                              // 87
                                                                                                                   // 88
  // New reply email                                                                                               // 89
                                                                                                                   // 90
  Router.route('/email/new-reply/:id?', {                                                                          // 91
    name: 'newReply',                                                                                              // 92
    where: 'server',                                                                                               // 93
    action: function() {                                                                                           // 94
      var html;                                                                                                    // 95
      var comment = Comments.findOne(this.params.id);                                                              // 96
      var post = Posts.findOne(comment.postId);                                                                    // 97
      if (!!comment) {                                                                                             // 98
        html = Telescope.email.getTemplate('emailNewReply')(Comments.getNotificationProperties(comment, post));    // 99
      } else {                                                                                                     // 100
        html = "<h3>No post found.</h3>"                                                                           // 101
      }                                                                                                            // 102
      this.response.write(Telescope.email.buildTemplate(html));                                                    // 103
      this.response.end();                                                                                         // 104
    }                                                                                                              // 105
  });                                                                                                              // 106
});                                                                                                                // 107
                                                                                                                   // 108
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/templates/handlebars.emailAccountApproved.js                        //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">{{username}}, welcome to {{siteTitle}}!</span><br><br>\n\nYou've just been invited. <a href=\"{{siteUrl}}\">Start posting</a>.<br><br>");Handlebars.templates["emailAccountApproved"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailAccountApproved"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/templates/handlebars.emailNewComment.js                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\n<a href=\"{{profileUrl}}\">{{authorName}}</a>\nleft a new comment on \n<a href=\"{{postUrl}}\" class=\"action-link\">{{postTitle}}</a>:\n</span>\n<br/><br/>\n\n<div class=\"comment-body\">\n{{{htmlBody}}}\n</div>\n<br>\n\n<a href=\"{{commentUrl}}\" class=\"action-link\">Reply</a><br/><br/>");Handlebars.templates["emailNewComment"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewComment"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/templates/handlebars.emailNewPost.js                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\n<a href=\"{{profileUrl}}\">{{postAuthorName}}</a>\nhas created a new post:\n{{#if url}}\n  <a href=\"{{linkUrl}}\" class=\"action-link\">{{postTitle}}}</a>\n{{else}}\n  {{postTitle}}}\n{{/if}}\n</span><br><br>\n\n{{#if htmlBody}}\n  <div class=\"post-body\">\n  {{{htmlBody}}}\n  </div>\n  <br>\n{{/if}}\n\n<a href=\"{{postUrl}}\">Discuss</a><br><br>\n");Handlebars.templates["emailNewPost"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewPost"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/templates/handlebars.emailNewPendingPost.js                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\n<a href=\"{{profileUrl}}\">{{postAuthorName}}</a>\nhas a new post pending approval:\n{{#if url}}\n  <a href=\"{{linkUrl}}\" class=\"action-link\">{{postTitle}}}</a>\n{{else}}\n  {{postTitle}}}\n{{/if}}\n</span><br><br>\n\n{{#if htmlBody}}\n  <div class=\"post-body\">\n  {{{htmlBody}}}\n  </div>\n  <br>\n{{/if}}\n\n<a href=\"{{postUrl}}\">Go to post</a><br><br>\n");Handlebars.templates["emailNewPendingPost"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewPendingPost"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/templates/handlebars.emailPostApproved.js                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">\nCongratulations, your post has been approved:\n</span>\n<br><br>\n<a href=\"{{postUrl}}\" class=\"action-link\">{{postTitle}}}</a>\n<br><br>");Handlebars.templates["emailPostApproved"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailPostApproved"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/templates/handlebars.emailNewReply.js                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\"><a href=\"{{profileUrl}}\">{{authorName}}</a>\nhas replied to your comment on\n<a href=\"{{postUrl}}\" class=\"action-link\">{{postTitle}}</a>:\n</span>\n<br/><br/>\n\n<div class=\"comment-body\">\n{{{htmlBody}}}\n</div>\n<br>\n\n<a href=\"{{commentUrl}}\" class=\"action-link\">Reply</a><br/><br/>");Handlebars.templates["emailNewReply"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewReply"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/lib/server/templates/handlebars.emailNewUser.js                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">A new user account has been created: <a href=\"{{profileUrl}}\">{{username}}</a></span><br><br>");Handlebars.templates["emailNewUser"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailNewUser"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/ar //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["ar"])) {                                                                    // 8
  TAPi18n.translations["ar"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["ar"][namespace])) {                                                         // 12
  TAPi18n.translations["ar"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["ar"][namespace], {"a_new_comment_on_your_post":"تعليق جديد حول مشاركتك","you_have_a_new_comment_by":"لديك تعليق جديد من","on_your_post":" حول مشاركتك","has_created_a_new_post":" اضاف مشاركة جديدة","someone_replied_to_your_comment_on":"احدهم قام باضافة اجابة لتعليقك حول","no_notifications":"0 تعليقات","1_notification":"1 تعليق","notifications":"تعليقات","mark_all_as_read":"اجعلها مقرؤة","has_replied_to_your_comment_on":" قام باضافة تعليق حول","mark_as_read":"إجعلها مقروءة"});
TAPi18n._registerServerTranslator("ar", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/bg //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["bg"])) {                                                                    // 8
  TAPi18n.translations["bg"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["bg"][namespace])) {                                                         // 12
  TAPi18n.translations["bg"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["bg"][namespace], {"a_new_comment_on_your_post":"Нов коментар на ваша публикация","you_have_a_new_comment_by":"Имате нов коментар от ","on_your_post":" на ваша публикация","has_created_a_new_post":" е създадена нова публикация","someone_replied_to_your_comment_on":"Някой отговори на коментара ви относно","no_notifications":"Няма известия","1_notification":"1 известие","notifications":"известия","mark_all_as_read":"Отбележи всичко като прочетено","has_replied_to_your_comment_on":" е отговорил на коментара ви за","mark_as_read":"Маркирай като прочетено"});
TAPi18n._registerServerTranslator("bg", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/de //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
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
_.extend(TAPi18n.translations["de"][namespace], {"a_new_comment_on_your_post":"Ein neuer Kommentar zu Deinem Link","you_have_a_new_comment_by":"Du hast einen neuen Kommentar von ","on_your_post":" bei Deinem Link","has_created_a_new_post":" hat einen neuen Link erstellt","someone_replied_to_your_comment_on":"Jemand hat auf Deinen Kommentar geantwortet bei","no_notifications":"Keine Benachrichtigungen","1_notification":"1 Benachrichtigung","notifications":"Benachrichtigungen","mark_all_as_read":"Alle als gelesen markieren","has_replied_to_your_comment_on":" hat auf Deinen Kommentar geantwortet bei"});
TAPi18n._registerServerTranslator("de", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/el //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["el"])) {                                                                    // 8
  TAPi18n.translations["el"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["el"][namespace])) {                                                         // 12
  TAPi18n.translations["el"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["el"][namespace], {"a_new_comment_on_your_post":"Νέο σχόλιο στη δημοσίευση σου","you_have_a_new_comment_by":"Νέο σχόλιο από","on_your_post":" στη δημοσίευση σου","has_created_a_new_post":" έκανε μια νέα δημοσίευση","someone_replied_to_your_comment_on":"Κάποιος απάντησε στο σχόλιό σου","no_notifications":"Καμία ειδοποίηση","1_notification":"1 ειδοποίηση","notifications":"ειδοποίησεις","mark_all_as_read":"Μάρκαρε τα όλα ότι τα διάβασες","has_replied_to_your_comment_on":" απάντησε στο σχόλιό σου","mark_as_read":"To διάβασα"});
TAPi18n._registerServerTranslator("el", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/en //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
// integrate the fallback language translations                                                                    // 8
translations = {};                                                                                                 // 9
translations[namespace] = {"a_new_comment_on_your_post":"A new comment on your post","you_have_a_new_comment_by":"You have a new comment by ","on_your_post":" on your post","has_created_a_new_post":" has created a new post","someone_replied_to_your_comment_on":"Someone replied to your comment on","no_notifications":"No notifications","1_notification":"1 notification","notifications":"notifications","mark_all_as_read":"Mark all as read","left_a_new_comment_on":"left a new comment on","has_replied_to_your_comment_on":"has replied to your comment on","mark_as_read":"Mark as read","you_have_been_unsubscribed_from_all_notifications":"You have been unsubscribed from all notifications.","user_not_found":"User not found","notifications_fieldset":"Notifications","emailNotifications":"Email Notifications","your_post":"Your post","has_been_approved":"has been approved"};
TAPi18n._loadLangFileObject("en", translations);                                                                   // 11
TAPi18n._registerServerTranslator("en", namespace);                                                                // 12
                                                                                                                   // 13
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/es //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
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
_.extend(TAPi18n.translations["es"][namespace], {"a_new_comment_on_your_post":"Un nuevo comentario en su post","you_have_a_new_comment_by":"Tiene un nuevo comentario de ","on_your_post":" en su post","has_created_a_new_post":" ha creado un nuevo post","someone_replied_to_your_comment_on":"Alguien respondió a tu comentario en","no_notifications":"Ninguna notificación","1_notification":"1 notificación","notifications":"notificaciones","mark_all_as_read":"Marcar todas como leídas","left_a_new_comment_on":"ha dejado un nuevo comentario en","has_replied_to_your_comment_on":" ha respondido a su comentario sobre","mark_as_read":"Marcar como leído","you_have_been_unsubscribed_from_all_notifications":"Ha dado de baja de todas las notificaciones.","user_not_found":"Usuario no encontrado","notifications_fieldset":"Notificaciones","emailNotifications":"Notificaciónes por Email","your_post":"Tú post","has_been_approved":"ha sido aprobado"});
TAPi18n._registerServerTranslator("es", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/fr //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
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
_.extend(TAPi18n.translations["fr"][namespace], {"a_new_comment_on_your_post":"Un nouveau commentaire sur votre post","you_have_a_new_comment_by":"Vous avez un nouveau commentaire de ","on_your_post":" sur votre post","has_created_a_new_post":" a créé un nouveau post","someone_replied_to_your_comment_on":"Quelqu'un à répondu à votre commentaire sur","no_notifications":"Aucune notification","1_notification":"1 notification","notifications":"notifications","mark_all_as_read":"Tout marquer comme lu","left_a_new_comment_on":"a laissé un nouveau commentaire sur","has_replied_to_your_comment_on":"a répondu à votre commentaire sur","mark_as_read":"Marquer comme lu","you_have_been_unsubscribed_from_all_notifications":"Vous avez été désabonné de toutes les notifications.","user_not_found":"Utilisateur non trouvé","notifications_fieldset":"Notifications","emailNotifications":"Notifications par Email","your_post":"Votre post","has_been_approved":"a été approuvé"});
TAPi18n._registerServerTranslator("fr", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/it //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
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
_.extend(TAPi18n.translations["it"][namespace], {"a_new_comment_on_your_post":"Un nuovo commento sul tuo post","you_have_a_new_comment_by":"Hai un nuovo commento di ","on_your_post":" sul tuo post","has_created_a_new_post":" ha creato un nuovo post","someone_replied_to_your_comment_on":"Qualcuno ha risposto al tuo commento su","no_notifications":"Nessuna notifica","1_notification":"1 notifica","notifications":"notifiche","mark_all_as_read":"Segna tutte come lette","has_replied_to_your_comment_on":" ha risposto al tuo commento su"});
TAPi18n._registerServerTranslator("it", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/nl //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["nl"])) {                                                                    // 8
  TAPi18n.translations["nl"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["nl"][namespace])) {                                                         // 12
  TAPi18n.translations["nl"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["nl"][namespace], {"a_new_comment_on_your_post":"Nieuwe reactie op je artikel","you_have_a_new_comment_by":"Nieuwe reactie van ","on_your_post":" op jouw artikel","has_created_a_new_post":" heeft een nieuw artikel geplaatst","someone_replied_to_your_comment_on":"Iemand heeft gereageerd op ","no_notifications":"Geen berichten","1_notification":"1 bericht","notifications":"notificaties","mark_all_as_read":"Markeer alles als gelezen","has_replied_to_your_comment_on":" heeft gereageerd op jouw reactie op ","mark_as_read":"Markeer als gelezen"});
TAPi18n._registerServerTranslator("nl", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/pl //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["pl"])) {                                                                    // 8
  TAPi18n.translations["pl"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["pl"][namespace])) {                                                         // 12
  TAPi18n.translations["pl"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["pl"][namespace], {"a_new_comment_on_your_post":"Nowy komentarz","you_have_a_new_comment_by":"Pojawił się nowy komentarz ","on_your_post":" dla twojego posta","has_created_a_new_post":" utworzył nowy post","someone_replied_to_your_comment_on":"Ktoś odpowiedział na twój komentarz w","no_notifications":"Brak powiadomień","1_notification":"1 powiadomienie","notifications":"powiadomień","mark_all_as_read":"Oznacz wszystkie jako przeczytane","left_a_new_comment_on":"dodał nowy komentarz w","has_replied_to_your_comment_on":"odpowiedział na twój komentarz w","mark_as_read":"Oznacz jako przeczytane","you_have_been_unsubscribed_from_all_notifications":"Zostałeś wypisany ze wszystkich powiadomień.","user_not_found":"Użytkownik nie został odnaleziony","notifications_fieldset":"Powiadomienia","emailNotifications":"Powiadomienia Email","your_post":"Twój post","has_been_approved":"został zaakceptowany"});
TAPi18n._registerServerTranslator("pl", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/pt //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["pt-BR"])) {                                                                 // 8
  TAPi18n.translations["pt-BR"] = {};                                                                              // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["pt-BR"][namespace])) {                                                      // 12
  TAPi18n.translations["pt-BR"][namespace] = {};                                                                   // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["pt-BR"][namespace], {"a_new_comment_on_your_post":"Um novo comentário em sua postagem","you_have_a_new_comment_by":"Você possui um novo comentário por ","on_your_post":" em sua postagem","has_created_a_new_post":" criou uma nova postagem","someone_replied_to_your_comment_on":"Alguém respondeu ao seu comentário em","no_notifications":"Sem notificações","1_notification":"1 notificação","notifications":"notificações","mark_all_as_read":"Marcar todas como lidas","left_a_new_comment_on":"deixou um novo comentário em","has_replied_to_your_comment_on":"respondeu ao seu comentário em","mark_as_read":"Marcar como lido","you_have_been_unsubscribed_from_all_notifications":"Você se desinscreveu de todas as notificações.","user_not_found":"Usuário não encontrado","notifications_fieldset":"Notificações","emailNotifications":"Notificações por Email","your_post":"Sua postagem","has_been_approved":"foi aprovada"});
TAPi18n._registerServerTranslator("pt-BR", namespace);                                                             // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/ro //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["ro"])) {                                                                    // 8
  TAPi18n.translations["ro"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["ro"][namespace])) {                                                         // 12
  TAPi18n.translations["ro"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["ro"][namespace], {"a_new_comment_on_your_post":"Un nou comentariu la postarea ta","you_have_a_new_comment_by":"Ai un nou comentariu de la ","on_your_post":" la postarea ta","has_created_a_new_post":" a publicat o nouă postare","someone_replied_to_your_comment_on":"Cineva a lăsat un comentariu la","no_notifications":"Nici o notificare","1_notification":"1 Notificare","notifications":"Notificări","mark_all_as_read":"Marchează toate ca citite","has_replied_to_your_comment_on":" a răspuns la comentariul tău la","mark_as_read":"Postări contra trend-ului"});
TAPi18n._registerServerTranslator("ro", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/ru //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["ru"])) {                                                                    // 8
  TAPi18n.translations["ru"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["ru"][namespace])) {                                                         // 12
  TAPi18n.translations["ru"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["ru"][namespace], {"a_new_comment_on_your_post":"Новый комментарий по вашему посту","you_have_a_new_comment_by":"У вас есть новый комментарий от ","on_your_post":" по вашему посту","has_created_a_new_post":" создал новый пост","someone_replied_to_your_comment_on":"Кто-то ответил на ваш комментарий","no_notifications":"Оповещений нет","1_notification":"1 оповещение","notifications":"оповещения","mark_all_as_read":"Отметить всё прочитанным","has_replied_to_your_comment_on":" ответил(а) на ваш комментарий по","mark_as_read":"Отметить прочитанным"});
TAPi18n._registerServerTranslator("ru", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/sv //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["sv"])) {                                                                    // 8
  TAPi18n.translations["sv"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["sv"][namespace])) {                                                         // 12
  TAPi18n.translations["sv"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["sv"][namespace], {"a_new_comment_on_your_post":"En ny kommentar på ditt inlägg","you_have_a_new_comment_by":"Du har en ny kommentar från ","on_your_post":" på ditt inlägg","has_created_a_new_post":" har skapat ett nytt inlägg","someone_replied_to_your_comment_on":"Någon svarade på din kommentar gällande","no_notifications":"Inga notifikationer","1_notification":"En notifikation","notifications":"notifikationer","mark_all_as_read":"Markera alla som lästa","left_a_new_comment_on":"lämnade en ny kommentar på","has_replied_to_your_comment_on":" har svarat på din kommentar gällande","mark_as_read":"Markera som läst","you_have_been_unsubscribed_from_all_notifications":"Du har avregistrerat dig från alla notifikationer.","user_not_found":"Användaren hittades inte","notifications_fieldset":"Notifikationer","emailNotifications":"E","your_post":"Ditt inlägg","has_been_approved":"har godkänts"});
TAPi18n._registerServerTranslator("sv", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/tr //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["tr"])) {                                                                    // 8
  TAPi18n.translations["tr"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["tr"][namespace])) {                                                         // 12
  TAPi18n.translations["tr"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["tr"][namespace], {"a_new_comment_on_your_post":"Şu paylaşımınıza yeni bir yorum yapıldı: ","you_have_a_new_comment_by":"Şu kişiden yeni bir yorum aldınız: ","on_your_post":" paylaşımınızda","has_created_a_new_post":" yeni bir paylaşım yaptı","someone_replied_to_your_comment_on":"Birisi yorumunuza cevap verdi şu konu hakkında: ","no_notifications":"Bildirim yok","1_notification":"1 bildirim","notifications":"Bildirimler","mark_all_as_read":"Hepsini okunmuş olarak işaretle","has_replied_to_your_comment_on":" yorumunuza cevap verdi şu konu hakkında:","mark_as_read":"Okundu olarak işaretle"});
TAPi18n._registerServerTranslator("tr", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/vi //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
                                                                                                                   // 4
if (package_name != "project") {                                                                                   // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                          // 6
}                                                                                                                  // 7
if(_.isUndefined(TAPi18n.translations["vi"])) {                                                                    // 8
  TAPi18n.translations["vi"] = {};                                                                                 // 9
}                                                                                                                  // 10
                                                                                                                   // 11
if(_.isUndefined(TAPi18n.translations["vi"][namespace])) {                                                         // 12
  TAPi18n.translations["vi"][namespace] = {};                                                                      // 13
}                                                                                                                  // 14
                                                                                                                   // 15
_.extend(TAPi18n.translations["vi"][namespace], {"a_new_comment_on_your_post":"Có ý kiến mới trên bài của bạn","you_have_a_new_comment_by":"Bạn có ý kiến mới bởi ","on_your_post":" trên bài của bạn","has_created_a_new_post":" đã bạo bài mới","someone_replied_to_your_comment_on":"Có người trả lời ý kiến của bạn","no_notifications":"Không có thông báo","1_notification":"1 thông báo","notifications":"Thông báo","mark_all_as_read":"Đánh dấu đã đọc","has_replied_to_your_comment_on":" đã trả lời ý kiến của bạn","mark_as_read":"Đã đọc"});
TAPi18n._registerServerTranslator("vi", namespace);                                                                // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/telescope:notifications/Applications/MAMP/websites/stewardsof/packages/telescope-notifications/i18n/zh //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _ = Package.underscore._,                                                                                      // 1
    package_name = "telescope:notifications",                                                                      // 2
    namespace = "telescope:notifications";                                                                         // 3
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
_.extend(TAPi18n.translations["zh-CN"][namespace], {"a_new_comment_on_your_post":"你发表的主题有新的评论","you_have_a_new_comment_by":"你有一个新的评论在 ","on_your_post":" 在你的帖子","has_created_a_new_post":" 发一个新帖","someone_replied_to_your_comment_on":"有人回复了你的评论","no_notifications":"无消息","1_notification":"1 个消息","notifications":"消息","mark_all_as_read":"标记所有","has_replied_to_your_comment_on":" 已经有人回复了你的评论"});
TAPi18n._registerServerTranslator("zh-CN", namespace);                                                             // 17
                                                                                                                   // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:notifications'] = {
  Herald: Herald
};

})();

//# sourceMappingURL=telescope_notifications.js.map
