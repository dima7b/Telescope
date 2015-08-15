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
var Settings = Package['telescope:settings'].Settings;
var Users = Package['telescope:users'].Users;
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
var Comments, translations;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/comments.js                                                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * The global namespace for Comments.                                                                               // 2
 * @namespace Comments                                                                                              // 3
 */                                                                                                                 // 4
Comments = new Mongo.Collection("comments");                                                                        // 5
                                                                                                                    // 6
/**                                                                                                                 // 7
 * Comments schema                                                                                                  // 8
 * @type {SimpleSchema}                                                                                             // 9
 */                                                                                                                 // 10
Comments.schema = new SimpleSchema({                                                                                // 11
  /**                                                                                                               // 12
    ID                                                                                                              // 13
  */                                                                                                                // 14
  _id: {                                                                                                            // 15
    type: String,                                                                                                   // 16
    optional: true                                                                                                  // 17
  },                                                                                                                // 18
  /**                                                                                                               // 19
    The `_id` of the parent comment, if there is one                                                                // 20
  */                                                                                                                // 21
  parentCommentId: {                                                                                                // 22
    type: String,                                                                                                   // 23
    // regEx: SimpleSchema.RegEx.Id,                                                                                // 24
    max: 500,                                                                                                       // 25
    editableBy: ["member", "admin"],                                                                                // 26
    optional: true,                                                                                                 // 27
    autoform: {                                                                                                     // 28
      omit: true // never show this                                                                                 // 29
    }                                                                                                               // 30
  },                                                                                                                // 31
  /**                                                                                                               // 32
    The `_id` of the top-level parent comment, if there is one                                                      // 33
  */                                                                                                                // 34
  topLevelCommentId: {                                                                                              // 35
    type: String,                                                                                                   // 36
    // regEx: SimpleSchema.RegEx.Id,                                                                                // 37
    max: 500,                                                                                                       // 38
    editableBy: ["member", "admin"],                                                                                // 39
    optional: true,                                                                                                 // 40
    autoform: {                                                                                                     // 41
      omit: true // never show this                                                                                 // 42
    }                                                                                                               // 43
  },                                                                                                                // 44
  /**                                                                                                               // 45
    The timestamp of comment creation                                                                               // 46
  */                                                                                                                // 47
  createdAt: {                                                                                                      // 48
    type: Date,                                                                                                     // 49
    optional: true                                                                                                  // 50
  },                                                                                                                // 51
  /**                                                                                                               // 52
    The timestamp of the comment being posted. For now, comments are always created and posted at the same time     // 53
  */                                                                                                                // 54
  postedAt: {                                                                                                       // 55
    type: Date,                                                                                                     // 56
    optional: true                                                                                                  // 57
  },                                                                                                                // 58
  /**                                                                                                               // 59
    The comment body (Markdown)                                                                                     // 60
  */                                                                                                                // 61
  body: {                                                                                                           // 62
    type: String,                                                                                                   // 63
    max: 3000,                                                                                                      // 64
    editableBy: ["member", "admin"],                                                                                // 65
    autoform: {                                                                                                     // 66
      rows: 5                                                                                                       // 67
    }                                                                                                               // 68
  },                                                                                                                // 69
  /**                                                                                                               // 70
    The HTML version of the comment body                                                                            // 71
  */                                                                                                                // 72
  htmlBody: {                                                                                                       // 73
    type: String,                                                                                                   // 74
    optional: true                                                                                                  // 75
  },                                                                                                                // 76
  /**                                                                                                               // 77
    The comment's base score (doesn't factor in comment age)                                                        // 78
  */                                                                                                                // 79
  baseScore: {                                                                                                      // 80
    type: Number,                                                                                                   // 81
    decimal: true,                                                                                                  // 82
    optional: true                                                                                                  // 83
  },                                                                                                                // 84
  /**                                                                                                               // 85
    The comment's current score (factors in comment age)                                                            // 86
  */                                                                                                                // 87
  score: {                                                                                                          // 88
    type: Number,                                                                                                   // 89
    decimal: true,                                                                                                  // 90
    optional: true                                                                                                  // 91
  },                                                                                                                // 92
  /**                                                                                                               // 93
    The number of upvotes the comment has received                                                                  // 94
  */                                                                                                                // 95
  upvotes: {                                                                                                        // 96
    type: Number,                                                                                                   // 97
    optional: true                                                                                                  // 98
  },                                                                                                                // 99
  /**                                                                                                               // 100
    An array containing the `_id`s of upvoters                                                                      // 101
  */                                                                                                                // 102
  upvoters: {                                                                                                       // 103
    type: [String],                                                                                                 // 104
    optional: true                                                                                                  // 105
  },                                                                                                                // 106
  /**                                                                                                               // 107
    The number of downvotes the comment has received                                                                // 108
  */                                                                                                                // 109
  downvotes: {                                                                                                      // 110
    type: Number,                                                                                                   // 111
    optional: true                                                                                                  // 112
  },                                                                                                                // 113
  /**                                                                                                               // 114
    An array containing the `_id`s of downvoters                                                                    // 115
  */                                                                                                                // 116
  downvoters: {                                                                                                     // 117
    type: [String],                                                                                                 // 118
    optional: true                                                                                                  // 119
  },                                                                                                                // 120
  /**                                                                                                               // 121
    The comment author's name                                                                                       // 122
  */                                                                                                                // 123
  author: {                                                                                                         // 124
    type: String,                                                                                                   // 125
    optional: true                                                                                                  // 126
  },                                                                                                                // 127
  /**                                                                                                               // 128
    Whether the comment is inactive. Inactive comments' scores gets recalculated less often                         // 129
  */                                                                                                                // 130
  inactive: {                                                                                                       // 131
    type: Boolean,                                                                                                  // 132
    optional: true                                                                                                  // 133
  },                                                                                                                // 134
  /**                                                                                                               // 135
    The post's `_id`                                                                                                // 136
  */                                                                                                                // 137
  postId: {                                                                                                         // 138
    type: String,                                                                                                   // 139
    optional: true,                                                                                                 // 140
    // regEx: SimpleSchema.RegEx.Id,                                                                                // 141
    max: 500,                                                                                                       // 142
    editableBy: ["member", "admin"], // TODO: should users be able to set postId, but not modify it?                // 143
    autoform: {                                                                                                     // 144
      omit: true // never show this                                                                                 // 145
    }                                                                                                               // 146
  },                                                                                                                // 147
  /**                                                                                                               // 148
    The comment author's `_id`                                                                                      // 149
  */                                                                                                                // 150
  userId: {                                                                                                         // 151
    type: String,                                                                                                   // 152
    optional: true                                                                                                  // 153
  },                                                                                                                // 154
  /**                                                                                                               // 155
    Whether the comment is deleted. Delete comments' content doesn't appear on the site.                            // 156
  */                                                                                                                // 157
  isDeleted: {                                                                                                      // 158
    type: Boolean,                                                                                                  // 159
    optional: true                                                                                                  // 160
  }                                                                                                                 // 161
});                                                                                                                 // 162
                                                                                                                    // 163
Comments.schema.internationalize();                                                                                 // 164
Comments.attachSchema(Comments.schema);                                                                             // 165
                                                                                                                    // 166
Comments.allow({                                                                                                    // 167
  update: _.partial(Telescope.allowCheck, Comments),                                                                // 168
  remove: _.partial(Telescope.allowCheck, Comments)                                                                 // 169
});                                                                                                                 // 170
                                                                                                                    // 171
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/methods.js                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
                                                                                                                    // 1
// ------------------------------------------------------------------------------------------- //                   // 2
// -------------------------------------- Submit Comment ------------------------------------- //                   // 3
// ------------------------------------------------------------------------------------------- //                   // 4
                                                                                                                    // 5
Comments.submit = function (comment) {                                                                              // 6
                                                                                                                    // 7
  var userId = comment.userId; // at this stage, a userId is expected                                               // 8
                                                                                                                    // 9
  // ------------------------------ Checks ------------------------------ //                                        // 10
                                                                                                                    // 11
  // Don't allow empty comments                                                                                     // 12
  if (!comment.body)                                                                                                // 13
    throw new Meteor.Error(704,i18n.t('your_comment_is_empty'));                                                    // 14
                                                                                                                    // 15
  // ------------------------------ Properties ------------------------------ //                                    // 16
                                                                                                                    // 17
  var defaultProperties = {                                                                                         // 18
    createdAt: new Date(),                                                                                          // 19
    postedAt: new Date(),                                                                                           // 20
    upvotes: 0,                                                                                                     // 21
    downvotes: 0,                                                                                                   // 22
    baseScore: 0,                                                                                                   // 23
    score: 0,                                                                                                       // 24
    author: Users.getDisplayNameById(userId)                                                                        // 25
  };                                                                                                                // 26
                                                                                                                    // 27
  comment = _.extend(defaultProperties, comment);                                                                   // 28
                                                                                                                    // 29
  // ------------------------------ Callbacks ------------------------------ //                                     // 30
                                                                                                                    // 31
  // run all post submit server callbacks on comment object successively                                            // 32
  comment = Telescope.callbacks.run("commentSubmit", comment);                                                      // 33
                                                                                                                    // 34
  // -------------------------------- Insert -------------------------------- //                                    // 35
                                                                                                                    // 36
  comment._id = Comments.insert(comment);                                                                           // 37
                                                                                                                    // 38
  // --------------------- Server-side Async Callbacks --------------------- //                                     // 39
                                                                                                                    // 40
  // run all post submit server callbacks on comment object successively                                            // 41
  // note: query for comment to get fresh document with collection-hooks effects applied                            // 42
  Telescope.callbacks.runAsync("commentSubmitAsync", Comments.findOne(comment._id));                                // 43
                                                                                                                    // 44
  return comment;                                                                                                   // 45
};                                                                                                                  // 46
                                                                                                                    // 47
Comments.edit = function (commentId, modifier, comment) {                                                           // 48
                                                                                                                    // 49
  // ------------------------------ Callbacks ------------------------------ //                                     // 50
                                                                                                                    // 51
  modifier = Telescope.callbacks.run("commentEdit", modifier, comment);                                             // 52
                                                                                                                    // 53
  // ------------------------------ Update ------------------------------ //                                        // 54
                                                                                                                    // 55
  Comments.update(commentId, modifier);                                                                             // 56
                                                                                                                    // 57
  // ------------------------------ Callbacks ------------------------------ //                                     // 58
                                                                                                                    // 59
  Telescope.callbacks.runAsync("commentEditAsync", Comments.findOne(commentId));                                    // 60
                                                                                                                    // 61
  // ------------------------------ After Update ------------------------------ //                                  // 62
  return Comments.findOne(commentId);                                                                               // 63
};                                                                                                                  // 64
                                                                                                                    // 65
// ------------------------------------------------------------------------------------------- //                   // 66
// ----------------------------------------- Methods ----------------------------------------- //                   // 67
// ------------------------------------------------------------------------------------------- //                   // 68
                                                                                                                    // 69
Meteor.methods({                                                                                                    // 70
  submitComment: function(comment){                                                                                 // 71
                                                                                                                    // 72
    // checking might be redundant because SimpleSchema already enforces the schema, but you never know             // 73
    check(comment, Comments.simpleSchema());                                                                        // 74
                                                                                                                    // 75
    // required properties:                                                                                         // 76
    // postId                                                                                                       // 77
    // body                                                                                                         // 78
                                                                                                                    // 79
    // optional properties:                                                                                         // 80
    // parentCommentId                                                                                              // 81
                                                                                                                    // 82
    var user = Meteor.user(),                                                                                       // 83
        hasAdminRights = Users.is.admin(user),                                                                      // 84
        schema = Comments.simpleSchema()._schema;                                                                   // 85
                                                                                                                    // 86
    // ------------------------------ Checks ------------------------------ //                                      // 87
                                                                                                                    // 88
    // check that user can comment                                                                                  // 89
    if (!user || !Users.can.comment(user))                                                                          // 90
      throw new Meteor.Error(i18n.t('you_need_to_login_or_be_invited_to_post_new_comments'));                       // 91
                                                                                                                    // 92
    // ------------------------------ Rate Limiting ------------------------------ //                               // 93
                                                                                                                    // 94
    if (!hasAdminRights) {                                                                                          // 95
                                                                                                                    // 96
      var timeSinceLastComment = Users.timeSinceLast(user, Comments),                                               // 97
          commentInterval = Math.abs(parseInt(Settings.get('commentInterval',15)));                                 // 98
                                                                                                                    // 99
      // check that user waits more than 15 seconds between comments                                                // 100
      if((timeSinceLastComment < commentInterval))                                                                  // 101
        throw new Meteor.Error(704, i18n.t('please_wait')+(commentInterval-timeSinceLastComment)+i18n.t('seconds_before_commenting_again'));
                                                                                                                    // 103
    }                                                                                                               // 104
                                                                                                                    // 105
    // ------------------------------ Properties ------------------------------ //                                  // 106
                                                                                                                    // 107
    // admin-only properties                                                                                        // 108
    // userId                                                                                                       // 109
                                                                                                                    // 110
    // clear restricted properties                                                                                  // 111
    _.keys(comment).forEach(function (fieldName) {                                                                  // 112
                                                                                                                    // 113
      var field = schema[fieldName];                                                                                // 114
      if (!Users.can.submitField(user, field)) {                                                                    // 115
        throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);   // 116
      }                                                                                                             // 117
                                                                                                                    // 118
    });                                                                                                             // 119
                                                                                                                    // 120
    // if no userId has been set, default to current user id                                                        // 121
    if (!comment.userId) {                                                                                          // 122
      comment.userId = user._id;                                                                                    // 123
    }                                                                                                               // 124
                                                                                                                    // 125
    return Comments.submit(comment);                                                                                // 126
  },                                                                                                                // 127
                                                                                                                    // 128
  editComment: function (modifier, commentId) {                                                                     // 129
                                                                                                                    // 130
    // checking might be redundant because SimpleSchema already enforces the schema, but you never know             // 131
    check(modifier, {$set: Comments.simpleSchema()});                                                               // 132
    check(commentId, String);                                                                                       // 133
                                                                                                                    // 134
    var user = Meteor.user(),                                                                                       // 135
        comment = Comments.findOne(commentId),                                                                      // 136
        schema = Comments.simpleSchema()._schema;                                                                   // 137
                                                                                                                    // 138
    // ------------------------------ Checks ------------------------------ //                                      // 139
                                                                                                                    // 140
    // check that user can edit                                                                                     // 141
    if (!user || !Users.can.edit(user, comment)) {                                                                  // 142
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_comment'));                                    // 143
    }                                                                                                               // 144
                                                                                                                    // 145
    // go over each field and throw an error if it's not editable                                                   // 146
    // loop over each operation ($set, $unset, etc.)                                                                // 147
    _.each(modifier, function (operation) {                                                                         // 148
      // loop over each property being operated on                                                                  // 149
      _.keys(operation).forEach(function (fieldName) {                                                              // 150
                                                                                                                    // 151
        var field = schema[fieldName];                                                                              // 152
        if (!Users.can.editField(user, field, comment)) {                                                           // 153
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName); // 154
        }                                                                                                           // 155
                                                                                                                    // 156
      });                                                                                                           // 157
    });                                                                                                             // 158
                                                                                                                    // 159
    Comments.edit(commentId, modifier, comment);                                                                    // 160
  },                                                                                                                // 161
                                                                                                                    // 162
  deleteCommentById: function (commentId) {                                                                         // 163
                                                                                                                    // 164
    check(commentId, String);                                                                                       // 165
                                                                                                                    // 166
    var comment = Comments.findOne(commentId);                                                                      // 167
    var user = Meteor.user();                                                                                       // 168
                                                                                                                    // 169
    if(Users.can.edit(user, comment)){                                                                              // 170
                                                                                                                    // 171
      // decrement post comment count and remove user ID from post                                                  // 172
      Posts.update(comment.postId, {                                                                                // 173
        $inc:   {commentCount: -1},                                                                                 // 174
        $pull:  {commenters: comment.userId}                                                                        // 175
      });                                                                                                           // 176
                                                                                                                    // 177
      // decrement user comment count and remove comment ID from user                                               // 178
      Meteor.users.update({_id: comment.userId}, {                                                                  // 179
        $inc:   {'telescope.commentCount': -1}                                                                      // 180
      });                                                                                                           // 181
                                                                                                                    // 182
      // note: should we also decrease user's comment karma ?                                                       // 183
      // We don't actually delete the comment to avoid losing all child comments.                                   // 184
      // Instead, we give it a special flag                                                                         // 185
      Comments.update({_id: commentId}, {$set: {                                                                    // 186
        body: 'Deleted',                                                                                            // 187
        htmlBody: 'Deleted',                                                                                        // 188
        isDeleted: true                                                                                             // 189
      }});                                                                                                          // 190
                                                                                                                    // 191
    }else{                                                                                                          // 192
                                                                                                                    // 193
      Messages.flash("You don't have permission to delete this comment.", "error");                                 // 194
                                                                                                                    // 195
    }                                                                                                               // 196
  }                                                                                                                 // 197
});                                                                                                                 // 198
                                                                                                                    // 199
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/callbacks.js                                                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
//////////////////////////////////////////////////////                                                              // 1
// Collection Hooks                                 //                                                              // 2
//////////////////////////////////////////////////////                                                              // 3
                                                                                                                    // 4
Comments.before.insert(function (userId, doc) {                                                                     // 5
  // note: only actually sanitizes on the server                                                                    // 6
  doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));                                                        // 7
});                                                                                                                 // 8
                                                                                                                    // 9
Comments.before.update(function (userId, doc, fieldNames, modifier) {                                               // 10
  // if body is being modified, update htmlBody too                                                                 // 11
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {                                                     // 12
    modifier.$set = modifier.$set || {};                                                                            // 13
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));                                  // 14
  }                                                                                                                 // 15
});                                                                                                                 // 16
                                                                                                                    // 17
/**                                                                                                                 // 18
 * Disallow $rename                                                                                                 // 19
 */                                                                                                                 // 20
Comments.before.update(function (userId, doc, fieldNames, modifier) {                                               // 21
  if (!!modifier.$rename) {                                                                                         // 22
    throw new Meteor.Error("illegal $rename operator detected!");                                                   // 23
  }                                                                                                                 // 24
});                                                                                                                 // 25
                                                                                                                    // 26
//////////////////////////////////////////////////////                                                              // 27
// Callbacks                                        //                                                              // 28
//////////////////////////////////////////////////////                                                              // 29
                                                                                                                    // 30
function afterCommentOperations (comment) {                                                                         // 31
                                                                                                                    // 32
  var userId = comment.userId;                                                                                      // 33
                                                                                                                    // 34
  // increment comment count                                                                                        // 35
  Meteor.users.update({_id: userId}, {                                                                              // 36
    $inc:       {'telescope.commentCount': 1}                                                                       // 37
  });                                                                                                               // 38
                                                                                                                    // 39
  // update post                                                                                                    // 40
  Posts.update(comment.postId, {                                                                                    // 41
    $inc:       {commentCount: 1},                                                                                  // 42
    $set:       {lastCommentedAt: new Date()},                                                                      // 43
    $addToSet:  {commenters: userId}                                                                                // 44
  });                                                                                                               // 45
                                                                                                                    // 46
  return comment;                                                                                                   // 47
}                                                                                                                   // 48
Telescope.callbacks.add("commentSubmitAsync", afterCommentOperations);                                              // 49
                                                                                                                    // 50
function upvoteOwnComment (comment) {                                                                               // 51
                                                                                                                    // 52
  var commentAuthor = Meteor.users.findOne(comment.userId);                                                         // 53
                                                                                                                    // 54
  // upvote comment                                                                                                 // 55
  Telescope.upvoteItem(Comments, comment, commentAuthor);                                                           // 56
                                                                                                                    // 57
  return comment;                                                                                                   // 58
}                                                                                                                   // 59
Telescope.callbacks.add("commentSubmitAsync", upvoteOwnComment);                                                    // 60
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/views.js                                                                         //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Comment views are filters used for subscribing to and viewing comments                                           // 2
 * @namespace Comments.views                                                                                        // 3
 */                                                                                                                 // 4
Comments.views = {};                                                                                                // 5
                                                                                                                    // 6
/**                                                                                                                 // 7
 * Add a module to a comment view                                                                                   // 8
 * @param {string} viewName - The name of the view                                                                  // 9
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */                                                                                                                 // 11
Comments.views.add = function (viewName, viewFunction) {                                                            // 12
  Comments.views[viewName] = viewFunction;                                                                          // 13
};                                                                                                                  // 14
                                                                                                                    // 15
// will be common to all other view unless specific properties are overwritten                                      // 16
Comments.views.baseParameters = {                                                                                   // 17
  options: {                                                                                                        // 18
    limit: 10                                                                                                       // 19
  }                                                                                                                 // 20
};                                                                                                                  // 21
                                                                                                                    // 22
Comments.views.add("postComments", function (terms) {                                                               // 23
  return {                                                                                                          // 24
    find: {postId: terms.postId},                                                                                   // 25
    options: {limit: 0, sort: {score: -1, postedAt: -1}}                                                            // 26
  };                                                                                                                // 27
});                                                                                                                 // 28
                                                                                                                    // 29
Comments.views.add("userComments", function (terms) {                                                               // 30
  return {                                                                                                          // 31
    find: {userId: terms.userId},                                                                                   // 32
    options: {sort: {postedAt: -1}}                                                                                 // 33
  };                                                                                                                // 34
});                                                                                                                 // 35
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/parameters.js                                                                    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Gives an object containing the appropriate find                                                                  // 2
 * and options arguments for the subscriptions's Comments.find()                                                    // 3
 * @param {Object} terms                                                                                            // 4
 */                                                                                                                 // 5
Comments.getSubParams = function (terms) {                                                                          // 6
                                                                                                                    // 7
  // add this to ensure all post publications pass audit-arguments-check                                            // 8
  check(terms, Match.Any);                                                                                          // 9
                                                                                                                    // 10
  var maxLimit = 200;                                                                                               // 11
                                                                                                                    // 12
  // console.log(terms)                                                                                             // 13
                                                                                                                    // 14
  // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()                  // 15
  // see: http://api.jquery.com/jQuery.extend/                                                                      // 16
                                                                                                                    // 17
  // initialize parameters by extending baseParameters object, to avoid passing it by reference                     // 18
  var parameters = Telescope.utils.deepExtend(true, {}, Comments.views.baseParameters);                             // 19
                                                                                                                    // 20
  // get query parameters according to current view                                                                 // 21
  if (typeof Comments.views[terms.view] !== 'undefined')                                                            // 22
    parameters = Telescope.utils.deepExtend(true, parameters, Comments.views[terms.view](terms));                   // 23
                                                                                                                    // 24
  // if a limit was provided with the terms, add it too (note: limit=0 means "no limit")                            // 25
  if (typeof terms.limit !== 'undefined')                                                                           // 26
    _.extend(parameters.options, {limit: parseInt(terms.limit)});                                                   // 27
                                                                                                                    // 28
  // limit to "maxLimit" posts at most when limit is undefined, equal to 0, or superior to maxLimit                 // 29
  if(!parameters.options.limit || parameters.options.limit == 0 || parameters.options.limit > maxLimit) {           // 30
    parameters.options.limit = maxLimit;                                                                            // 31
  }                                                                                                                 // 32
                                                                                                                    // 33
  // console.log(parameters);                                                                                       // 34
                                                                                                                    // 35
  return parameters;                                                                                                // 36
};                                                                                                                  // 37
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/helpers.js                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
//////////////////                                                                                                  // 1
// Link Helpers //                                                                                                  // 2
//////////////////                                                                                                  // 3
                                                                                                                    // 4
/**                                                                                                                 // 5
 * Get URL of a comment page.                                                                                       // 6
 * @param {Object} comment                                                                                          // 7
 */                                                                                                                 // 8
Comments.getPageUrl = function(comment, isAbsolute){                                                                // 9
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false                      // 10
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";                                          // 11
  return prefix + Router.path("comment_page", comment);                                                             // 12
};                                                                                                                  // 13
Comments.helpers({getPageUrl: function () {return Comments.getPageUrl(this);}});                                    // 14
                                                                                                                    // 15
///////////////////                                                                                                 // 16
// Other Helpers //                                                                                                 // 17
///////////////////                                                                                                 // 18
                                                                                                                    // 19
/**                                                                                                                 // 20
 * Get a comment author's name                                                                                      // 21
 * @param {Object} comment                                                                                          // 22
 */                                                                                                                 // 23
Comments.getAuthorName = function (comment) {                                                                       // 24
  var user = Meteor.users.findOne(comment.userId);                                                                  // 25
  if (user) {                                                                                                       // 26
    return user.getUserName();                                                                                      // 27
  } else {                                                                                                          // 28
    return comment.author;                                                                                          // 29
  }                                                                                                                 // 30
};                                                                                                                  // 31
Comments.helpers({getAuthorName: function () {return Comments.getAuthorName(this);}});                              // 32
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/routes.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
// Controller for comment pages                                                                                     // 1
                                                                                                                    // 2
Comments.controllers = {};                                                                                          // 3
                                                                                                                    // 4
Comments.controllers.page = RouteController.extend({                                                                // 5
  waitOn: function() {                                                                                              // 6
    return [                                                                                                        // 7
      Telescope.subsManager.subscribe('singleCommentAndChildren', this.params._id),                                 // 8
      Telescope.subsManager.subscribe('commentUsers', this.params._id),                                             // 9
      Telescope.subsManager.subscribe('commentPost', this.params._id)                                               // 10
    ];                                                                                                              // 11
  },                                                                                                                // 12
  data: function() {                                                                                                // 13
    return {                                                                                                        // 14
      comment: Comments.findOne(this.params._id)                                                                    // 15
    };                                                                                                              // 16
  },                                                                                                                // 17
  onAfterAction: function () {                                                                                      // 18
    window.queueComments = false;                                                                                   // 19
  },                                                                                                                // 20
  fastRender: true                                                                                                  // 21
});                                                                                                                 // 22
                                                                                                                    // 23
Meteor.startup( function () {                                                                                       // 24
                                                                                                                    // 25
  // Comment Reply                                                                                                  // 26
                                                                                                                    // 27
  Router.route('/comments/:_id', {                                                                                  // 28
    name: 'comment_page',                                                                                           // 29
    template: 'comment_reply',                                                                                      // 30
    controller: Comments.controllers.page,                                                                          // 31
    onAfterAction: function() {                                                                                     // 32
      window.queueComments = false;                                                                                 // 33
    }                                                                                                               // 34
  });                                                                                                               // 35
                                                                                                                    // 36
  // Comment Edit                                                                                                   // 37
                                                                                                                    // 38
  Router.route('/comments/:_id/edit', {                                                                             // 39
    name: 'comment_edit',                                                                                           // 40
    template: 'comment_edit',                                                                                       // 41
    controller: Comments.controllers.page,                                                                          // 42
    onAfterAction: function() {                                                                                     // 43
      window.queueComments = false;                                                                                 // 44
    }                                                                                                               // 45
  });                                                                                                               // 46
                                                                                                                    // 47
});                                                                                                                 // 48
                                                                                                                    // 49
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/lib/server/publications.js                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Comments._ensureIndex({"postId": 1});                                                                               // 1
                                                                                                                    // 2
                                                                                                                    // 3
// Publish a list of comments                                                                                       // 4
                                                                                                                    // 5
Meteor.publish('commentsList', function(terms) {                                                                    // 6
  if(Users.can.viewById(this.userId)){                                                                              // 7
    var parameters = Comments.getSubParams(terms);                                                                  // 8
    var comments = Comments.find(parameters.find, parameters.options);                                              // 9
                                                                                                                    // 10
    // if there are comments, find out which posts were commented on                                                // 11
    var commentedPostIds = comments.count() ? _.pluck(comments.fetch(), 'postId') : [];                             // 12
    return [                                                                                                        // 13
      comments,                                                                                                     // 14
      Posts.find({_id: {$in: commentedPostIds}})                                                                    // 15
    ];                                                                                                              // 16
  }                                                                                                                 // 17
});                                                                                                                 // 18
                                                                                                                    // 19
// Publish a single comment                                                                                         // 20
                                                                                                                    // 21
Meteor.publish('singleCommentAndChildren', function(commentId) {                                                    // 22
                                                                                                                    // 23
  check(commentId, String);                                                                                         // 24
                                                                                                                    // 25
  if(Users.can.viewById(this.userId)){                                                                              // 26
    // publish both current comment and child comments                                                              // 27
    var commentIds = [commentId];                                                                                   // 28
    var childCommentIds = _.pluck(Comments.find({parentCommentId: commentId}, {fields: {_id: 1}}).fetch(), '_id');  // 29
    commentIds = commentIds.concat(childCommentIds);                                                                // 30
    return Comments.find({_id: {$in: commentIds}}, {sort: {score: -1, postedAt: -1}});                              // 31
  }                                                                                                                 // 32
  return [];                                                                                                        // 33
});                                                                                                                 // 34
                                                                                                                    // 35
// Publish the post related to the current comment                                                                  // 36
                                                                                                                    // 37
Meteor.publish('commentPost', function(commentId) {                                                                 // 38
                                                                                                                    // 39
  check(commentId, String);                                                                                         // 40
                                                                                                                    // 41
  if(Users.can.viewById(this.userId)){                                                                              // 42
    var comment = Comments.findOne(commentId);                                                                      // 43
    return Posts.find({_id: comment && comment.postId});                                                            // 44
  }                                                                                                                 // 45
  return [];                                                                                                        // 46
});                                                                                                                 // 47
                                                                                                                    // 48
// Publish author of the current comment, and author of the post related to the current comment                     // 49
                                                                                                                    // 50
Meteor.publish('commentUsers', function(commentId) {                                                                // 51
                                                                                                                    // 52
  check(commentId, String);                                                                                         // 53
                                                                                                                    // 54
  var userIds = [];                                                                                                 // 55
                                                                                                                    // 56
  if(Users.can.viewById(this.userId)){                                                                              // 57
                                                                                                                    // 58
    var comment = Comments.findOne(commentId);                                                                      // 59
                                                                                                                    // 60
    if (!!comment) {                                                                                                // 61
      userIds.push(comment.userId);                                                                                 // 62
                                                                                                                    // 63
      var post = Posts.findOne(comment.postId);                                                                     // 64
      if (!!post) {                                                                                                 // 65
        userIds.push(post.userId);                                                                                  // 66
      }                                                                                                             // 67
                                                                                                                    // 68
      return Meteor.users.find({_id: {$in: userIds}}, {fields: Users.pubsub.publicProperties});                     // 69
                                                                                                                    // 70
    }                                                                                                               // 71
                                                                                                                    // 72
  }                                                                                                                 // 73
                                                                                                                    // 74
  return [];                                                                                                        // 75
                                                                                                                    // 76
});                                                                                                                 // 77
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/ar.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["ar"] = ["Arabic","العربية"];                                                               // 8
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","cdn_path":null});     // 9
TAPi18n.languages_names["en"] = ["English","English"];                                                              // 10
if(_.isUndefined(TAPi18n.translations["ar"])) {                                                                     // 11
  TAPi18n.translations["ar"] = {};                                                                                  // 12
}                                                                                                                   // 13
                                                                                                                    // 14
if(_.isUndefined(TAPi18n.translations["ar"][namespace])) {                                                          // 15
  TAPi18n.translations["ar"][namespace] = {};                                                                       // 16
}                                                                                                                   // 17
                                                                                                                    // 18
_.extend(TAPi18n.translations["ar"][namespace], {"sorry_you_cannot_edit_this_comment":"ﻻ يمكنك تعديل هذا التعليق","your_comment_has_been_deleted":"قد تم حذف تعليقك","comment_":"تعليق","delete_comment":"احذف التعليق","add_comment":"اضف تعليق","upvote":"صوت مع","downvote":"صوت ضد","link":"رابط","edit":"تعديل","reply":"رد","no_comments":"ﻻ يوجد تعليق","please_sign_in_to_reply":"يتوجب الدخول ﻻضافة رد"});
TAPi18n._registerServerTranslator("ar", namespace);                                                                 // 20
                                                                                                                    // 21
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/bg.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["bg"] = ["Bulgarian","Български"];                                                          // 8
if(_.isUndefined(TAPi18n.translations["bg"])) {                                                                     // 9
  TAPi18n.translations["bg"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["bg"][namespace])) {                                                          // 13
  TAPi18n.translations["bg"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["bg"][namespace], {"sorry_you_cannot_edit_this_comment":"Съжаляваме, неможете да променяте този коментар.","your_comment_has_been_deleted":"Вашият коментар беше изтрит.","comment_":"Коментар","delete_comment":"Изтриване на коментар","add_comment":"Добави коментар","upvote":"Харесвам","downvote":"Не харесвам","link":"връзка","edit":"редактирай","reply":"отговор","no_comments":"Няма коментари."});
TAPi18n._registerServerTranslator("bg", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/de.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["de"] = ["German","Deutsch"];                                                               // 8
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                     // 9
  TAPi18n.translations["de"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                          // 13
  TAPi18n.translations["de"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["de"][namespace], {"sorry_you_cannot_edit_this_comment":"Sorry, Du kannst diesen Kommentar nicht bearbeiten.","your_comment_has_been_deleted":"Dein Kommentar wurde gelöscht.","comment_":"Kommentieren","delete_comment":"Kommentar löschen","add_comment":"Kommentar hinzufügen","upvote":"+1","downvote":"-1","link":"link","edit":"bearbeiten","reply":"antworten","no_comments":"Keine Kommentare."});
TAPi18n._registerServerTranslator("de", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/el.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["el"] = ["Greek","Ελληνικά"];                                                               // 8
if(_.isUndefined(TAPi18n.translations["el"])) {                                                                     // 9
  TAPi18n.translations["el"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["el"][namespace])) {                                                          // 13
  TAPi18n.translations["el"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["el"][namespace], {"sorry_you_cannot_edit_this_comment":"Συγγνώμη, δεν μπορείς να επεξεργαστείς συτό το σχόλιο.","your_comment_has_been_deleted":"Το σχόλιο σας έχει διαγραφεί.","comment_":"Σχόλιο","delete_comment":"Διαγραφή σχολίου","add_comment":"Νέο σχόλιο","upvote":"Υπερ","downvote":"Κατά","link":"Σύνδεσμος","edit":"Επεξεργασία","reply":"Απάντηση","no_comments":"Κανένα σχόλιο."});
TAPi18n._registerServerTranslator("el", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/en.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
// integrate the fallback language translations                                                                     // 8
translations = {};                                                                                                  // 9
translations[namespace] = {"sorry_you_cannot_edit_this_comment":"Sorry, you cannot edit this comment.","your_comment_has_been_deleted":"Your comment has been deleted.","comment_":"Comment","delete_comment":"Delete Comment","add_comment":"Add Comment","upvote":"upvote","downvote":"downvote","link":"link","edit":"Edit","reply":"Reply","no_comments":"No comments.","please_sign_in_to_reply":"Please sign in to reply"};
TAPi18n._loadLangFileObject("en", translations);                                                                    // 11
TAPi18n._registerServerTranslator("en", namespace);                                                                 // 12
                                                                                                                    // 13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/es.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["es"] = ["Spanish (Spain)","Español"];                                                      // 8
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                     // 9
  TAPi18n.translations["es"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                          // 13
  TAPi18n.translations["es"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["es"][namespace], {"sorry_you_cannot_edit_this_comment":"Lo sentimos, no puedes editar este comentario.","your_comment_has_been_deleted":"Tu comentario ha sido borrado.","comment_":"Comentar","delete_comment":"Borrar comentario","add_comment":"Agregar Comentario","upvote":"Voto Positivo","downvote":"Voto Negativo","link":"link","edit":"Editar","reply":"Responder","no_comments":"No hay comentarios.","please_sign_in_to_reply":"Por favor, inicia sesión primero."});
TAPi18n._registerServerTranslator("es", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/fr.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["fr"] = ["French (France)","Français"];                                                     // 8
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                     // 9
  TAPi18n.translations["fr"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                          // 13
  TAPi18n.translations["fr"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["fr"][namespace], {"sorry_you_cannot_edit_this_comment":"Désolé, vous ne pouvez pas modifier ce commentaire.","your_comment_has_been_deleted":"Votre commentaire a été supprimé.","comment_":"Commentaire","delete_comment":"Supprimer le commentaire","add_comment":"Ajouter un commentaire","upvote":"upvote","downvote":"downvote","link":"lien","edit":"Modifier","reply":"Répondre","no_comments":"Aucun commentaire.","please_sign_in_to_reply":"Connectez-vous pour répondre"});
TAPi18n._registerServerTranslator("fr", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/it.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["it"] = ["Italian","Italiano"];                                                             // 8
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                     // 9
  TAPi18n.translations["it"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                          // 13
  TAPi18n.translations["it"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["it"][namespace], {"sorry_you_cannot_edit_this_comment":"Ci spiace, non puoi modificare questo commento.","your_comment_has_been_deleted":"Il tuo commento è stato rimosso.","comment_":"Commenta","delete_comment":"Elimina Commento","add_comment":"Aggiungi Commento","upvote":"promuovi","downvote":"sconsiglia","link":"link","edit":"Modifica","reply":"Rispondi","no_comments":"Nessun commento."});
TAPi18n._registerServerTranslator("it", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/nl.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["nl"] = ["Dutch","Nederlands"];                                                             // 8
if(_.isUndefined(TAPi18n.translations["nl"])) {                                                                     // 9
  TAPi18n.translations["nl"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["nl"][namespace])) {                                                          // 13
  TAPi18n.translations["nl"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["nl"][namespace], {"sorry_you_cannot_edit_this_comment":"Sorry, je kan deze reactie niet bewerken.","your_comment_has_been_deleted":"Jouw reactie is verwijderd.","comment_":"Reactie","delete_comment":"Verwijder reactie","add_comment":"Reactie toevoegen","upvote":"omhoog","downvote":"omlaag","link":"link","edit":"Bewerk","reply":"Reageer","no_comments":"Geen reacties.","please_sign_in_to_reply":"Login om te kunnen reageren."});
TAPi18n._registerServerTranslator("nl", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/pl.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["pl"] = ["Polish","Polski"];                                                                // 8
if(_.isUndefined(TAPi18n.translations["pl"])) {                                                                     // 9
  TAPi18n.translations["pl"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["pl"][namespace])) {                                                          // 13
  TAPi18n.translations["pl"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["pl"][namespace], {"sorry_you_cannot_edit_this_comment":"Nie możesz edytować tego komentarza.","your_comment_has_been_deleted":"Twój komentarz został usunięty.","comment_":"Komentuj","delete_comment":"Usuń komentarz","add_comment":"Dodaj komentarz","upvote":"plus","downvote":"minus","link":"link","edit":"Edytuj","reply":"Odpowiedz","no_comments":"Brak komentarzy."});
TAPi18n._registerServerTranslator("pl", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/pt-BR.i18n.js //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["pt-BR"] = ["Portuguese (Brazil)","Português do Brasil"];                                   // 8
if(_.isUndefined(TAPi18n.translations["pt-BR"])) {                                                                  // 9
  TAPi18n.translations["pt-BR"] = {};                                                                               // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["pt-BR"][namespace])) {                                                       // 13
  TAPi18n.translations["pt-BR"][namespace] = {};                                                                    // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["pt-BR"][namespace], {"sorry_you_cannot_edit_this_comment":"Desculpe, você não pode editar este comentário.","your_comment_has_been_deleted":"Seu comentário foi deletado.","comment_":"Comentário","delete_comment":"Deletar Comentário","add_comment":"Adicionar Comentário","upvote":"+","downvote":"-","link":"link","edit":"Editar","reply":"Responder","no_comments":"Sem comentários.","please_sign_in_to_reply":"Por favor, registre-se para responder"});
TAPi18n._registerServerTranslator("pt-BR", namespace);                                                              // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/ro.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["ro"] = ["Romanian","Română"];                                                              // 8
if(_.isUndefined(TAPi18n.translations["ro"])) {                                                                     // 9
  TAPi18n.translations["ro"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["ro"][namespace])) {                                                          // 13
  TAPi18n.translations["ro"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["ro"][namespace], {"sorry_you_cannot_edit_this_comment":"Ne pare rău, nu poți edita aceast comentariu.","your_comment_has_been_deleted":"Comentariul tău a fost șters","comment_":"Comentare","delete_comment":"Sterge comentariu","add_comment":"Adaugă comentariu","upvote":"+1","downvote":"-1","link":"link","edit":"editează","reply":"răspunde","no_comments":"Nici un comentariu.","please_sign_in_to_reply":"Este nevoie să te autentifici pentru a răspunde"});
TAPi18n._registerServerTranslator("ro", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/ru.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["ru"] = ["Russian","Русский"];                                                              // 8
if(_.isUndefined(TAPi18n.translations["ru"])) {                                                                     // 9
  TAPi18n.translations["ru"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["ru"][namespace])) {                                                          // 13
  TAPi18n.translations["ru"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["ru"][namespace], {"sorry_you_cannot_edit_this_comment":"Извините, вы не можете редактировать это.","your_comment_has_been_deleted":"Ваш комментарий удалили.","comment_":"Комментарий","delete_comment":"Удалить комментарий","add_comment":"Добавить комментарий","upvote":"за","downvote":"против","link":"ссылка","edit":"Редактировать","reply":"Ответить","no_comments":"Без комментариев."});
TAPi18n._registerServerTranslator("ru", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/sv.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["sv"] = ["Swedish","Svenska"];                                                              // 8
if(_.isUndefined(TAPi18n.translations["sv"])) {                                                                     // 9
  TAPi18n.translations["sv"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["sv"][namespace])) {                                                          // 13
  TAPi18n.translations["sv"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["sv"][namespace], {"sorry_you_cannot_edit_this_comment":"Tyvärr, du kan inte redigera denna kommentar.","your_comment_has_been_deleted":"Din kommentar har tagits bort.","comment_":"Kommentar","delete_comment":"Ta Bort Kommentar","add_comment":"Kommentera","upvote":"upprösta","downvote":"nedrösta","link":"länk","edit":"Redigera","reply":"Svara","no_comments":"Inga kommentarer.","please_sign_in_to_reply":"Vänligen logga in för att svara"});
TAPi18n._registerServerTranslator("sv", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/tr.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["tr"] = ["Turkish","Türkçe"];                                                               // 8
if(_.isUndefined(TAPi18n.translations["tr"])) {                                                                     // 9
  TAPi18n.translations["tr"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["tr"][namespace])) {                                                          // 13
  TAPi18n.translations["tr"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["tr"][namespace], {"sorry_you_cannot_edit_this_comment":"Özür dileriz, bu yorumu değiştiremezsiniz","your_comment_has_been_deleted":"Yorumunuz silindi","comment_":"Yorum","delete_comment":"Yorumu Sil","add_comment":"Yorum Ekle","upvote":"1","downvote":"-1","link":"link","edit":"Düzenle","reply":"Cevap","no_comments":"Yorum yok"});
TAPi18n._registerServerTranslator("tr", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/vi.i18n.js    //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["vi"] = ["Vietnamese","Tiếng Việt"];                                                        // 8
if(_.isUndefined(TAPi18n.translations["vi"])) {                                                                     // 9
  TAPi18n.translations["vi"] = {};                                                                                  // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["vi"][namespace])) {                                                          // 13
  TAPi18n.translations["vi"][namespace] = {};                                                                       // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["vi"][namespace], {"sorry_you_cannot_edit_this_comment":"Xin lỗi, bạn không thể sửa ý kiến này.","your_comment_has_been_deleted":"Ý kiến của bạn đã được xóa.","comment_":"Ý kiến","delete_comment":"Xóa ý kiến","add_comment":"Thêm ý kiến","upvote":"Thích","downvote":"Không thích","link":"link","edit":"Sửa","reply":"Trả lời","no_comments":"Không ý kiến."});
TAPi18n._registerServerTranslator("vi", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:comments/Applications/MAMP/websites/stewardsof/packages/telescope-comments/i18n/zh-CN.i18n.js //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _ = Package.underscore._,                                                                                       // 1
    package_name = "project",                                                                                       // 2
    namespace = "project";                                                                                          // 3
                                                                                                                    // 4
if (package_name != "project") {                                                                                    // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                           // 6
}                                                                                                                   // 7
TAPi18n.languages_names["zh-CN"] = ["Chinese (China)","中文"];                                                        // 8
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                  // 9
  TAPi18n.translations["zh-CN"] = {};                                                                               // 10
}                                                                                                                   // 11
                                                                                                                    // 12
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                       // 13
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                    // 14
}                                                                                                                   // 15
                                                                                                                    // 16
_.extend(TAPi18n.translations["zh-CN"][namespace], {"sorry_you_cannot_edit_this_comment":"对不起你不能编辑这个评论","your_comment_has_been_deleted":"你的评论已经被删除","comment_":"评论","delete_comment":"删除评论","add_comment":"评论","upvote":"顶","downvote":"踩","link":"链接","edit":"编辑","reply":"回复","no_comments":"暂时没有评论"});
TAPi18n._registerServerTranslator("zh-CN", namespace);                                                              // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:comments'] = {
  Comments: Comments
};

})();

//# sourceMappingURL=telescope_comments.js.map
