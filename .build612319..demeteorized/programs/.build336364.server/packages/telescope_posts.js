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
var Comments = Package['telescope:comments'].Comments;
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
var Posts, translations;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/namespace.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * The global namespace/collection for Posts.                                                                       // 2
 * @namespace Posts                                                                                                 // 3
 */                                                                                                                 // 4
Posts = new Mongo.Collection("posts");                                                                              // 5
                                                                                                                    // 6
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/config.js                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Posts config namespace                                                                                           // 2
 * @type {Object}                                                                                                   // 3
 */                                                                                                                 // 4
Posts.config = {};                                                                                                  // 5
                                                                                                                    // 6
                                                                                                                    // 7
/**                                                                                                                 // 8
 * Post Statuses                                                                                                    // 9
 */                                                                                                                 // 10
Posts.config.postStatuses = [                                                                                       // 11
  {                                                                                                                 // 12
    value: 1,                                                                                                       // 13
    label: function(){return i18n.t('pending');}                                                                    // 14
  },                                                                                                                // 15
  {                                                                                                                 // 16
    value: 2,                                                                                                       // 17
    label: function(){return i18n.t('approved');}                                                                   // 18
  },                                                                                                                // 19
  {                                                                                                                 // 20
    value: 3,                                                                                                       // 21
    label: function(){return i18n.t('rejected');}                                                                   // 22
  }                                                                                                                 // 23
];                                                                                                                  // 24
                                                                                                                    // 25
Posts.config.STATUS_PENDING = 1;                                                                                    // 26
Posts.config.STATUS_APPROVED = 2;                                                                                   // 27
Posts.config.STATUS_REJECTED = 3;                                                                                   // 28
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/posts.js                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Posts schema                                                                                                     // 2
 * @type {SimpleSchema}                                                                                             // 3
 */                                                                                                                 // 4
Posts.schema = new SimpleSchema({                                                                                   // 5
  /**                                                                                                               // 6
    ID                                                                                                              // 7
  */                                                                                                                // 8
  _id: {                                                                                                            // 9
    type: String,                                                                                                   // 10
    optional: true                                                                                                  // 11
  },                                                                                                                // 12
  /**                                                                                                               // 13
    Timetstamp of post creation                                                                                     // 14
  */                                                                                                                // 15
  createdAt: {                                                                                                      // 16
    type: Date,                                                                                                     // 17
    optional: true                                                                                                  // 18
  },                                                                                                                // 19
  /**                                                                                                               // 20
    Timestamp of post first appearing on the site (i.e. being approved)                                             // 21
  */                                                                                                                // 22
  postedAt: {                                                                                                       // 23
    type: Date,                                                                                                     // 24
    optional: true,                                                                                                 // 25
    editableBy: ["admin"],                                                                                          // 26
    autoform: {                                                                                                     // 27
      group: 'admin',                                                                                               // 28
      type: "bootstrap-datetimepicker"                                                                              // 29
    }                                                                                                               // 30
  },                                                                                                                // 31
  /**                                                                                                               // 32
    URL                                                                                                             // 33
  */                                                                                                                // 34
  url: {                                                                                                            // 35
    type: String,                                                                                                   // 36
    optional: true,                                                                                                 // 37
    max: 500,                                                                                                       // 38
    editableBy: ["member", "admin"],                                                                                // 39
    autoform: {                                                                                                     // 40
      type: "bootstrap-url"                                                                                         // 41
    }                                                                                                               // 42
  },                                                                                                                // 43
  /**                                                                                                               // 44
    Title                                                                                                           // 45
  */                                                                                                                // 46
  title: {                                                                                                          // 47
    type: String,                                                                                                   // 48
    optional: false,                                                                                                // 49
    max: 500,                                                                                                       // 50
    editableBy: ["member", "admin"]                                                                                 // 51
  },                                                                                                                // 52
  /**                                                                                                               // 53
    Slug                                                                                                            // 54
  */                                                                                                                // 55
  slug: {                                                                                                           // 56
    type: String,                                                                                                   // 57
    optional: true                                                                                                  // 58
  },                                                                                                                // 59
  /**                                                                                                               // 60
    Post body (markdown)                                                                                            // 61
  */                                                                                                                // 62
  // body: {                                                                                                        // 63
  //   type: String,                                                                                                // 64
  //   optional: true,                                                                                              // 65
  //   max: 3000,                                                                                                   // 66
  //   editableBy: ["member", "admin"],                                                                             // 67
  //   autoform: {                                                                                                  // 68
  //     rows: 5                                                                                                    // 69
  //   }                                                                                                            // 70
  // },                                                                                                             // 71
  /**                                                                                                               // 72
    HTML version of the post body                                                                                   // 73
  */                                                                                                                // 74
  htmlBody: {                                                                                                       // 75
    type: String,                                                                                                   // 76
    optional: true                                                                                                  // 77
  },                                                                                                                // 78
  /**                                                                                                               // 79
    Count of how many times the post's page was viewed                                                              // 80
  */                                                                                                                // 81
  viewCount: {                                                                                                      // 82
    type: Number,                                                                                                   // 83
    optional: true                                                                                                  // 84
  },                                                                                                                // 85
  /**                                                                                                               // 86
    Count of the post's comments                                                                                    // 87
  */                                                                                                                // 88
  commentCount: {                                                                                                   // 89
    type: Number,                                                                                                   // 90
    optional: true                                                                                                  // 91
  },                                                                                                                // 92
  /**                                                                                                               // 93
    An array containing the `_id`s of commenters                                                                    // 94
  */                                                                                                                // 95
  commenters: {                                                                                                     // 96
    type: [String],                                                                                                 // 97
    optional: true                                                                                                  // 98
  },                                                                                                                // 99
  /**                                                                                                               // 100
    Timestamp of the last comment                                                                                   // 101
  */                                                                                                                // 102
  lastCommentedAt: {                                                                                                // 103
    type: Date,                                                                                                     // 104
    optional: true                                                                                                  // 105
  },                                                                                                                // 106
  /**                                                                                                               // 107
    Count of how many times the post's link was clicked                                                             // 108
  */                                                                                                                // 109
  clickCount: {                                                                                                     // 110
    type: Number,                                                                                                   // 111
    optional: true                                                                                                  // 112
  },                                                                                                                // 113
  /**                                                                                                               // 114
    The post's base score (not factoring in the post's age)                                                         // 115
  */                                                                                                                // 116
  baseScore: {                                                                                                      // 117
    type: Number,                                                                                                   // 118
    decimal: true,                                                                                                  // 119
    optional: true                                                                                                  // 120
  },                                                                                                                // 121
  /**                                                                                                               // 122
    How many upvotes the post has received                                                                          // 123
  */                                                                                                                // 124
  upvotes: {                                                                                                        // 125
    type: Number,                                                                                                   // 126
    optional: true                                                                                                  // 127
  },                                                                                                                // 128
  /**                                                                                                               // 129
    An array containing the `_id`s of the post's upvoters                                                           // 130
  */                                                                                                                // 131
  upvoters: {                                                                                                       // 132
    type: [String],                                                                                                 // 133
    optional: true                                                                                                  // 134
  },                                                                                                                // 135
  /**                                                                                                               // 136
    How many downvotes the post has received                                                                        // 137
  */                                                                                                                // 138
  downvotes: {                                                                                                      // 139
    type: Number,                                                                                                   // 140
    optional: true                                                                                                  // 141
  },                                                                                                                // 142
  /**                                                                                                               // 143
    An array containing the `_id`s of the post's downvoters                                                         // 144
  */                                                                                                                // 145
  downvoters: {                                                                                                     // 146
    type: [String],                                                                                                 // 147
    optional: true                                                                                                  // 148
  },                                                                                                                // 149
  /**                                                                                                               // 150
    The post's current score (factoring in age)                                                                     // 151
  */                                                                                                                // 152
  score: {                                                                                                          // 153
    type: Number,                                                                                                   // 154
    decimal: true,                                                                                                  // 155
    optional: true                                                                                                  // 156
  },                                                                                                                // 157
  /**                                                                                                               // 158
    The post's status. One of pending (`1`), approved (`2`), or deleted (`3`)                                       // 159
  */                                                                                                                // 160
  status: {                                                                                                         // 161
    type: Number,                                                                                                   // 162
    optional: true,                                                                                                 // 163
    editableBy: ["admin"],                                                                                          // 164
    autoValue: function () {                                                                                        // 165
      // only provide a default value                                                                               // 166
      // 1) this is an insert operation                                                                             // 167
      // 2) status field is not set in the document being inserted                                                  // 168
      var user = Meteor.users.findOne(this.userId);                                                                 // 169
      if (this.isInsert && !this.isSet)                                                                             // 170
        return Posts.getDefaultStatus(user);                                                                        // 171
    },                                                                                                              // 172
    autoform: {                                                                                                     // 173
      noselect: true,                                                                                               // 174
      options: Posts.config.postStatuses,                                                                           // 175
      group: 'admin'                                                                                                // 176
    }                                                                                                               // 177
  },                                                                                                                // 178
  /**                                                                                                               // 179
    Whether the post is sticky (pinned to the top of posts lists)                                                   // 180
  */                                                                                                                // 181
  sticky: {                                                                                                         // 182
    type: Boolean,                                                                                                  // 183
    optional: true,                                                                                                 // 184
    defaultValue: false,                                                                                            // 185
    editableBy: ["admin"],                                                                                          // 186
    autoform: {                                                                                                     // 187
      group: 'admin',                                                                                               // 188
      leftLabel: "Sticky"                                                                                           // 189
    }                                                                                                               // 190
  },                                                                                                                // 191
  /**                                                                                                               // 192
    Whether the post is inactive. Inactive posts see their score recalculated less often                            // 193
  */                                                                                                                // 194
  inactive: {                                                                                                       // 195
    type: Boolean,                                                                                                  // 196
    optional: true                                                                                                  // 197
  },                                                                                                                // 198
  /**                                                                                                               // 199
    The post author's name                                                                                          // 200
  */                                                                                                                // 201
  author: {                                                                                                         // 202
    type: String,                                                                                                   // 203
    optional: true                                                                                                  // 204
  },                                                                                                                // 205
  /**                                                                                                               // 206
    The post author's `_id`.                                                                                        // 207
  */                                                                                                                // 208
  userId: {                                                                                                         // 209
    type: String,                                                                                                   // 210
    optional: true,                                                                                                 // 211
    // regEx: SimpleSchema.RegEx.Id,                                                                                // 212
    editableBy: ["admin"],                                                                                          // 213
    autoform: {                                                                                                     // 214
      group: 'admin',                                                                                               // 215
      options: function () {                                                                                        // 216
        return Meteor.users.find().map(function (user) {                                                            // 217
          return {                                                                                                  // 218
            value: user._id,                                                                                        // 219
            label: Users.getDisplayName(user)                                                                       // 220
          };                                                                                                        // 221
        });                                                                                                         // 222
      }                                                                                                             // 223
    }                                                                                                               // 224
  }                                                                                                                 // 225
});                                                                                                                 // 226
                                                                                                                    // 227
// schema transforms                                                                                                // 228
Posts.schema.internationalize();                                                                                    // 229
                                                                                                                    // 230
/**                                                                                                                 // 231
 * Attach schema to Posts collection                                                                                // 232
 */                                                                                                                 // 233
Posts.attachSchema(Posts.schema);                                                                                   // 234
                                                                                                                    // 235
Posts.allow({                                                                                                       // 236
  update: _.partial(Telescope.allowCheck, Posts),                                                                   // 237
  remove: _.partial(Telescope.allowCheck, Posts)                                                                    // 238
});                                                                                                                 // 239
                                                                                                                    // 240
                                                                                                                    // 241
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/parameters.js                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Gives an object containing the appropriate find                                                                  // 2
 * and options arguments for the subscriptions's Posts.find()                                                       // 3
 * @param {Object} terms                                                                                            // 4
 */                                                                                                                 // 5
Posts.getSubParams = function (terms) {                                                                             // 6
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
  var parameters = Telescope.utils.deepExtend(true, {}, Posts.views.baseParameters);                                // 19
                                                                                                                    // 20
  // if view is not defined, default to "top"                                                                       // 21
  var view = !!terms.view ? Telescope.utils.dashToCamel(terms.view) : 'top';                                        // 22
                                                                                                                    // 23
  // get query parameters according to current view                                                                 // 24
  if (typeof Posts.views[view] !== 'undefined')                                                                     // 25
    parameters = Telescope.utils.deepExtend(true, parameters, Posts.views[view](terms));                            // 26
                                                                                                                    // 27
  // extend sort to sort posts by _id to break ties                                                                 // 28
  Telescope.utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});                                       // 29
                                                                                                                    // 30
  // if a limit was provided with the terms, add it too (note: limit=0 means "no limit")                            // 31
  if (typeof terms.limit !== 'undefined')                                                                           // 32
    _.extend(parameters.options, {limit: parseInt(terms.limit)});                                                   // 33
                                                                                                                    // 34
  // limit to "maxLimit" posts at most when limit is undefined, equal to 0, or superior to maxLimit                 // 35
  if(!parameters.options.limit || parameters.options.limit === 0 || parameters.options.limit > maxLimit) {          // 36
    parameters.options.limit = maxLimit;                                                                            // 37
  }                                                                                                                 // 38
                                                                                                                    // 39
  // hide future scheduled posts unless "showFuture" is set to true or postedAt is already defined                  // 40
  if (!parameters.showFuture && !parameters.find.postedAt)                                                          // 41
    parameters.find.postedAt = {$lte: new Date()};                                                                  // 42
                                                                                                                    // 43
  // filter by category if category _id is provided                                                                 // 44
  // NOTE: this is a temporary fix because views cannot currently be combined                                       // 45
  if (!!terms.category) {                                                                                           // 46
    var categoryId = Categories.findOne({slug: terms.category})._id;                                                // 47
    parameters.find.categories = {$in: [categoryId]};                                                               // 48
  }                                                                                                                 // 49
                                                                                                                    // 50
  // console.log(parameters);                                                                                       // 51
                                                                                                                    // 52
  return parameters;                                                                                                // 53
};                                                                                                                  // 54
                                                                                                                    // 55
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/views.js                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * Post views are filters used for subscribing to and viewing posts                                                 // 2
 * @namespace Posts.views                                                                                           // 3
 */                                                                                                                 // 4
Posts.views = {};                                                                                                   // 5
                                                                                                                    // 6
/**                                                                                                                 // 7
 * Add a post view                                                                                                  // 8
 * @param {string} viewName - The name of the view                                                                  // 9
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */                                                                                                                 // 11
Posts.views.add = function (viewName, viewFunction) {                                                               // 12
  Posts.views[viewName] = viewFunction;                                                                             // 13
};                                                                                                                  // 14
                                                                                                                    // 15
/**                                                                                                                 // 16
 * Base parameters that will be common to all other view unless specific properties are overwritten                 // 17
 */                                                                                                                 // 18
Posts.views.baseParameters = {                                                                                      // 19
  find: {                                                                                                           // 20
    status: Posts.config.STATUS_APPROVED                                                                            // 21
  },                                                                                                                // 22
  options: {                                                                                                        // 23
    limit: 10                                                                                                       // 24
  }                                                                                                                 // 25
};                                                                                                                  // 26
                                                                                                                    // 27
/**                                                                                                                 // 28
 * Top view                                                                                                         // 29
 */                                                                                                                 // 30
Posts.views.add("top", function (terms) {                                                                           // 31
  return {                                                                                                          // 32
    options: {sort: {sticky: -1, score: -1}}                                                                        // 33
  };                                                                                                                // 34
});                                                                                                                 // 35
                                                                                                                    // 36
/**                                                                                                                 // 37
 * New view                                                                                                         // 38
 */                                                                                                                 // 39
Posts.views.add("new", function (terms) {                                                                           // 40
  return {                                                                                                          // 41
    options: {sort: {sticky: -1, postedAt: -1}}                                                                     // 42
  };                                                                                                                // 43
});                                                                                                                 // 44
                                                                                                                    // 45
/**                                                                                                                 // 46
 * Best view                                                                                                        // 47
 */                                                                                                                 // 48
Posts.views.add("best", function (terms) {                                                                          // 49
  return {                                                                                                          // 50
    options: {sort: {sticky: -1, baseScore: -1}}                                                                    // 51
  };                                                                                                                // 52
});                                                                                                                 // 53
                                                                                                                    // 54
/**                                                                                                                 // 55
 * Pending view                                                                                                     // 56
 */                                                                                                                 // 57
Posts.views.add("pending", function (terms) {                                                                       // 58
  return {                                                                                                          // 59
    find: {                                                                                                         // 60
      status: 1                                                                                                     // 61
    },                                                                                                              // 62
    options: {sort: {createdAt: -1}},                                                                               // 63
    showFuture: true                                                                                                // 64
  };                                                                                                                // 65
});                                                                                                                 // 66
                                                                                                                    // 67
/**                                                                                                                 // 68
 * Scheduled view                                                                                                   // 69
 */                                                                                                                 // 70
Posts.views.add("scheduled", function (terms) {                                                                     // 71
  return {                                                                                                          // 72
    find: {postedAt: {$gte: new Date()}},                                                                           // 73
    options: {sort: {postedAt: -1}}                                                                                 // 74
  };                                                                                                                // 75
});                                                                                                                 // 76
                                                                                                                    // 77
/**                                                                                                                 // 78
 * User posts view                                                                                                  // 79
 */                                                                                                                 // 80
Posts.views.add("userPosts", function (terms) {                                                                     // 81
  return {                                                                                                          // 82
    find: {userId: terms.userId},                                                                                   // 83
    options: {limit: 5, sort: {postedAt: -1}}                                                                       // 84
  };                                                                                                                // 85
});                                                                                                                 // 86
                                                                                                                    // 87
/**                                                                                                                 // 88
 * User upvoted posts view                                                                                          // 89
 */                                                                                                                 // 90
Posts.views.add("userUpvotedPosts", function (terms) {                                                              // 91
  var user = Meteor.users.findOne(terms.userId);                                                                    // 92
  var postsIds = _.pluck(user.telescope.upvotedPosts, "itemId");                                                    // 93
  return {                                                                                                          // 94
    find: {_id: {$in: postsIds}, userId: {$ne: terms.userId}}, // exclude own posts                                 // 95
    options: {limit: 5, sort: {postedAt: -1}}                                                                       // 96
  };                                                                                                                // 97
});                                                                                                                 // 98
                                                                                                                    // 99
/**                                                                                                                 // 100
 * User downvoted posts view                                                                                        // 101
 */                                                                                                                 // 102
Posts.views.add("userDownvotedPosts", function (terms) {                                                            // 103
  var user = Meteor.users.findOne(terms.userId);                                                                    // 104
  var postsIds = _.pluck(user.telescope.downvotedPosts, "itemId");                                                  // 105
  // TODO: sort based on votedAt timestamp and not postedAt, if possible                                            // 106
  return {                                                                                                          // 107
    find: {_id: {$in: postsIds}},                                                                                   // 108
    options: {limit: 5, sort: {postedAt: -1}}                                                                       // 109
  };                                                                                                                // 110
});                                                                                                                 // 111
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/helpers.js                                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
//////////////////                                                                                                  // 1
// Link Helpers //                                                                                                  // 2
//////////////////                                                                                                  // 3
                                                                                                                    // 4
/**                                                                                                                 // 5
 * Return a post's link if it has one, else return its post page URL                                                // 6
 * @param {Object} post                                                                                             // 7
 */                                                                                                                 // 8
Posts.getLink = function (post, isAbsolute) {                                                                       // 9
  return !!post.url ? Telescope.utils.getOutgoingUrl(post.url) : this.getPageUrl(post, isAbsolute);                 // 10
};                                                                                                                  // 11
Posts.helpers({getLink: function (isAbsolute) {return Posts.getLink(this, isAbsolute);}});                          // 12
                                                                                                                    // 13
/**                                                                                                                 // 14
 * Get URL of a post page.                                                                                          // 15
 * @param {Object} post                                                                                             // 16
 */                                                                                                                 // 17
Posts.getPageUrl = function(post, isAbsolute){                                                                      // 18
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false                      // 19
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";                                          // 20
  return prefix + Router.path("post_page", post);                                                                   // 21
};                                                                                                                  // 22
Posts.helpers({getPageUrl: function (isAbsolute) {return Posts.getPageUrl(this, isAbsolute);}});                    // 23
                                                                                                                    // 24
/**                                                                                                                 // 25
 * Get post edit page URL.                                                                                          // 26
 * @param {String} id                                                                                               // 27
 */                                                                                                                 // 28
Posts.getEditUrl = function(post, isAbsolute){                                                                      // 29
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false                      // 30
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";                                          // 31
  return prefix + Router.path("post_edit", post);                                                                   // 32
};                                                                                                                  // 33
Posts.helpers({getEditUrl: function (isAbsolute) {return Posts.getEditUrl(this, isAbsolute);}});                    // 34
                                                                                                                    // 35
///////////////////                                                                                                 // 36
// Other Helpers //                                                                                                 // 37
///////////////////                                                                                                 // 38
                                                                                                                    // 39
/**                                                                                                                 // 40
 * Get a post author's name                                                                                         // 41
 * @param {Object} post                                                                                             // 42
 */                                                                                                                 // 43
Posts.getAuthorName = function (post) {                                                                             // 44
  var user = Meteor.users.findOne(post.userId);                                                                     // 45
  if (user) {                                                                                                       // 46
    return user.getDisplayName();                                                                                   // 47
  } else {                                                                                                          // 48
    return post.author;                                                                                             // 49
  }                                                                                                                 // 50
};                                                                                                                  // 51
Posts.helpers({getAuthorName: function () {return Posts.getAuthorName(this);}});                                    // 52
                                                                                                                    // 53
/**                                                                                                                 // 54
 * Get default status for new posts.                                                                                // 55
 * @param {Object} user                                                                                             // 56
 */                                                                                                                 // 57
Posts.getDefaultStatus = function (user) {                                                                          // 58
  var hasAdminRights = typeof user === 'undefined' ? false : Users.is.admin(user);                                  // 59
  if (hasAdminRights || !Settings.get('requirePostsApproval', false)) {                                             // 60
    // if user is admin, or else post approval is not required                                                      // 61
    return Posts.config.STATUS_APPROVED                                                                             // 62
  } else {                                                                                                          // 63
    // else                                                                                                         // 64
    return Posts.config.STATUS_PENDING                                                                              // 65
  }                                                                                                                 // 66
};                                                                                                                  // 67
                                                                                                                    // 68
/**                                                                                                                 // 69
 * Check to see if post URL is unique.                                                                              // 70
 * We need the current user so we know who to upvote the existing post as.                                          // 71
 * @param {String} url                                                                                              // 72
 * @param {Object} currentUser                                                                                      // 73
 */                                                                                                                 // 74
Posts.checkForSameUrl = function (url, currentUser) {                                                               // 75
                                                                                                                    // 76
  // check that there are no previous posts with the same link in the past 6 months                                 // 77
  var sixMonthsAgo = moment().subtract(6, 'months').toDate();                                                       // 78
  var postWithSameLink = Posts.findOne({url: url, postedAt: {$gte: sixMonthsAgo}});                                 // 79
                                                                                                                    // 80
  if(typeof postWithSameLink !== 'undefined'){                                                                      // 81
    Telescope.upvoteItem(Posts, postWithSameLink, currentUser);                                                     // 82
                                                                                                                    // 83
    // note: error.details returns undefined on the client, so add post ID to reason                                // 84
    throw new Meteor.Error('603', i18n.t('this_link_has_already_been_posted') + '|' + postWithSameLink._id, postWithSameLink._id);
  }                                                                                                                 // 86
};                                                                                                                  // 87
                                                                                                                    // 88
/**                                                                                                                 // 89
 * When on a post page, return the current post                                                                     // 90
 */                                                                                                                 // 91
Posts.current = function () {                                                                                       // 92
  return Posts.findOne(Router.current().data().post._id);                                                           // 93
};                                                                                                                  // 94
                                                                                                                    // 95
/**                                                                                                                 // 96
 * Check to see if a post is a link to a video                                                                      // 97
 * @param {Object} post                                                                                             // 98
 */                                                                                                                 // 99
Posts.isVideo = function (post) {                                                                                   // 100
  return post.media && post.media.type === "video";                                                                 // 101
};                                                                                                                  // 102
Posts.helpers({isVideo: function () {return Posts.isVideo(this);}});                                                // 103
                                                                                                                    // 104
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/modules.js                                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
                                                                                                                    // 1
Telescope.modules.add("top", {                                                                                      // 2
  template: 'posts_views_nav',                                                                                      // 3
  order: 99                                                                                                         // 4
});                                                                                                                 // 5
                                                                                                                    // 6
Telescope.modules.add("postComponents", [                                                                           // 7
  {                                                                                                                 // 8
    template: 'post_rank',                                                                                          // 9
    order: 1                                                                                                        // 10
  },                                                                                                                // 11
  {                                                                                                                 // 12
    template: 'post_vote',                                                                                          // 13
    order: 10                                                                                                       // 14
  },                                                                                                                // 15
  {                                                                                                                 // 16
    template: 'post_content',                                                                                       // 17
    order: 20                                                                                                       // 18
  },                                                                                                                // 19
  {                                                                                                                 // 20
    template: 'post_avatars',                                                                                       // 21
    order: 30                                                                                                       // 22
  },                                                                                                                // 23
  {                                                                                                                 // 24
    template: 'post_discuss',                                                                                       // 25
    order: 40                                                                                                       // 26
  },                                                                                                                // 27
  {                                                                                                                 // 28
    template: 'post_actions',                                                                                       // 29
    order: 50                                                                                                       // 30
  }                                                                                                                 // 31
]);                                                                                                                 // 32
                                                                                                                    // 33
Telescope.modules.add("postHeading", [                                                                              // 34
  {                                                                                                                 // 35
    template: 'post_title',                                                                                         // 36
    order: 10                                                                                                       // 37
  },                                                                                                                // 38
  {                                                                                                                 // 39
    template: 'post_domain',                                                                                        // 40
    order: 20                                                                                                       // 41
  }                                                                                                                 // 42
]);                                                                                                                 // 43
                                                                                                                    // 44
Telescope.modules.add("postMeta", [                                                                                 // 45
  {                                                                                                                 // 46
    template: 'post_author',                                                                                        // 47
    order: 10                                                                                                       // 48
  },                                                                                                                // 49
  {                                                                                                                 // 50
    template: 'post_info',                                                                                          // 51
    order: 20                                                                                                       // 52
  },                                                                                                                // 53
  {                                                                                                                 // 54
    template: 'post_comments_link',                                                                                 // 55
    order: 30                                                                                                       // 56
  },                                                                                                                // 57
  {                                                                                                                 // 58
    template: 'post_admin',                                                                                         // 59
    order: 50                                                                                                       // 60
  }                                                                                                                 // 61
]);                                                                                                                 // 62
                                                                                                                    // 63
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/callbacks.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
                                                                                                                    // 1
//////////////////////////////////////////////////////                                                              // 2
// Collection Hooks                                 //                                                              // 3
//////////////////////////////////////////////////////                                                              // 4
                                                                                                                    // 5
/**                                                                                                                 // 6
 * Generate HTML body from Markdown on post insert                                                                  // 7
 */                                                                                                                 // 8
Posts.before.insert(function (userId, doc) {                                                                        // 9
  if(!!doc.body)                                                                                                    // 10
    doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));                                                      // 11
});                                                                                                                 // 12
                                                                                                                    // 13
/**                                                                                                                 // 14
 * Generate HTML body from Markdown when post body is updated                                                       // 15
 */                                                                                                                 // 16
Posts.before.update(function (userId, doc, fieldNames, modifier) {                                                  // 17
  // if body is being modified or $unset, update htmlBody too                                                       // 18
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {                                                     // 19
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));                                  // 20
  }                                                                                                                 // 21
  if (Meteor.isServer && modifier.$unset && (typeof modifier.$unset.body !== "undefined")) {                        // 22
    modifier.$unset.htmlBody = "";                                                                                  // 23
  }                                                                                                                 // 24
});                                                                                                                 // 25
                                                                                                                    // 26
/**                                                                                                                 // 27
 * Generate slug when post title is updated                                                                         // 28
 */                                                                                                                 // 29
Posts.before.update(function (userId, doc, fieldNames, modifier) {                                                  // 30
  // if title is being modified, update slug too                                                                    // 31
  if (Meteor.isServer && modifier.$set && modifier.$set.title) {                                                    // 32
    modifier.$set.slug = Telescope.utils.slugify(modifier.$set.title);                                              // 33
  }                                                                                                                 // 34
});                                                                                                                 // 35
                                                                                                                    // 36
/**                                                                                                                 // 37
 * Disallow $rename                                                                                                 // 38
 */                                                                                                                 // 39
Posts.before.update(function (userId, doc, fieldNames, modifier) {                                                  // 40
  if (!!modifier.$rename) {                                                                                         // 41
    throw new Meteor.Error("illegal $rename operator detected!");                                                   // 42
  }                                                                                                                 // 43
});                                                                                                                 // 44
                                                                                                                    // 45
//////////////////////////////////////////////////////                                                              // 46
// Callbacks                                        //                                                              // 47
//////////////////////////////////////////////////////                                                              // 48
                                                                                                                    // 49
/**                                                                                                                 // 50
 * Increment the user's post count and upvote the post                                                              // 51
 */                                                                                                                 // 52
function afterPostSubmitOperations (post) {                                                                         // 53
  var userId = post.userId;                                                                                         // 54
  Meteor.users.update({_id: userId}, {$inc: {"telescope.postCount": 1}});                                           // 55
  return post;                                                                                                      // 56
}                                                                                                                   // 57
Telescope.callbacks.add("postSubmitAsync", afterPostSubmitOperations);                                              // 58
                                                                                                                    // 59
function upvoteOwnPost (post) {                                                                                     // 60
  var postAuthor = Meteor.users.findOne(post.userId);                                                               // 61
  Telescope.upvoteItem(Posts, post, postAuthor);                                                                    // 62
  return post;                                                                                                      // 63
}                                                                                                                   // 64
Telescope.callbacks.add("postSubmitAsync", upvoteOwnPost);                                                          // 65
                                                                                                                    // 66
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/methods.js                                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 *                                                                                                                  // 2
 * Post Methods                                                                                                     // 3
 *                                                                                                                  // 4
 */                                                                                                                 // 5
                                                                                                                    // 6
/**                                                                                                                 // 7
 * Insert a post in the database (note: optional post properties not listed here)                                   // 8
 * @param {Object} post - the post being inserted                                                                   // 9
 * @param {string} post.userId - the id of the user the post belongs to                                             // 10
 * @param {string} post.title - the post's title                                                                    // 11
 */                                                                                                                 // 12
Posts.submit = function (post) {                                                                                    // 13
                                                                                                                    // 14
  var userId = post.userId, // at this stage, a userId is expected                                                  // 15
      user = Users.findOne(userId);                                                                                 // 16
                                                                                                                    // 17
  // ------------------------------ Checks ------------------------------ //                                        // 18
                                                                                                                    // 19
  // check that a title was provided                                                                                // 20
  if(!post.title)                                                                                                   // 21
    throw new Meteor.Error(602, i18n.t('please_fill_in_a_title'));                                                  // 22
                                                                                                                    // 23
  // check that there are no posts with the same URL                                                                // 24
  if(!!post.url)                                                                                                    // 25
    Posts.checkForSameUrl(post.url, user);                                                                          // 26
                                                                                                                    // 27
  // ------------------------------ Properties ------------------------------ //                                    // 28
                                                                                                                    // 29
  var defaultProperties = {                                                                                         // 30
    createdAt: new Date(),                                                                                          // 31
    author: Users.getDisplayNameById(userId),                                                                       // 32
    upvotes: 0,                                                                                                     // 33
    downvotes: 0,                                                                                                   // 34
    commentCount: 0,                                                                                                // 35
    clickCount: 0,                                                                                                  // 36
    viewCount: 0,                                                                                                   // 37
    baseScore: 0,                                                                                                   // 38
    score: 0,                                                                                                       // 39
    inactive: false,                                                                                                // 40
    sticky: false,                                                                                                  // 41
    status: Posts.getDefaultStatus()                                                                                // 42
  };                                                                                                                // 43
                                                                                                                    // 44
  post = _.extend(defaultProperties, post);                                                                         // 45
                                                                                                                    // 46
  // if post is approved but doesn't have a postedAt date, give it a default date                                   // 47
  // note: pending posts get their postedAt date only once theyre approved                                          // 48
  if (post.status === Posts.config.STATUS_APPROVED && !post.postedAt)                                               // 49
    post.postedAt = new Date();                                                                                     // 50
                                                                                                                    // 51
  // clean up post title                                                                                            // 52
  post.title = Telescope.utils.cleanUp(post.title);                                                                 // 53
                                                                                                                    // 54
  // generate slug                                                                                                  // 55
  post.slug = Telescope.utils.slugify(post.title);                                                                  // 56
                                                                                                                    // 57
  // ------------------------------ Callbacks ------------------------------ //                                     // 58
                                                                                                                    // 59
  // run all post submit server callbacks on post object successively                                               // 60
  post = Telescope.callbacks.run("postSubmit", post);                                                               // 61
                                                                                                                    // 62
  // -------------------------------- Insert ------------------------------- //                                     // 63
                                                                                                                    // 64
  post._id = Posts.insert(post);                                                                                    // 65
                                                                                                                    // 66
  // --------------------- Server-Side Async Callbacks --------------------- //                                     // 67
                                                                                                                    // 68
  // note: query for post to get fresh document with collection-hooks effects applied                               // 69
  Telescope.callbacks.runAsync("postSubmitAsync", Posts.findOne(post._id));                                         // 70
                                                                                                                    // 71
  return post;                                                                                                      // 72
};                                                                                                                  // 73
                                                                                                                    // 74
/**                                                                                                                 // 75
 * Edit a post in the database                                                                                      // 76
 * @param {string} postId – the ID of the post being edited                                                         // 77
 * @param {Object} modifier – the modifier object                                                                   // 78
 * @param {Object} post - the current post object                                                                   // 79
 */                                                                                                                 // 80
Posts.edit = function (postId, modifier, post) {                                                                    // 81
                                                                                                                    // 82
  if (typeof post === "undefined") {                                                                                // 83
    post = Posts.findOne(postId);                                                                                   // 84
  }                                                                                                                 // 85
                                                                                                                    // 86
  // ------------------------------ Callbacks ------------------------------ //                                     // 87
                                                                                                                    // 88
  // run all post edit server callbacks on modifier successively                                                    // 89
  modifier = Telescope.callbacks.run("postEdit", modifier, post);                                                   // 90
                                                                                                                    // 91
  // ------------------------------ Update ------------------------------ //                                        // 92
                                                                                                                    // 93
  Posts.update(postId, modifier);                                                                                   // 94
                                                                                                                    // 95
  // ------------------------------ Callbacks ------------------------------ //                                     // 96
                                                                                                                    // 97
  Telescope.callbacks.runAsync("postEditAsync", Posts.findOne(postId));                                             // 98
                                                                                                                    // 99
  // ------------------------------ After Update ------------------------------ //                                  // 100
  return Posts.findOne(postId);                                                                                     // 101
};                                                                                                                  // 102
                                                                                                                    // 103
// ------------------------------------------------------------------------------------------- //                   // 104
// ----------------------------------------- Methods ----------------------------------------- //                   // 105
// ------------------------------------------------------------------------------------------- //                   // 106
                                                                                                                    // 107
var postViews = [];                                                                                                 // 108
                                                                                                                    // 109
Meteor.methods({                                                                                                    // 110
                                                                                                                    // 111
  /**                                                                                                               // 112
   * Meteor method for submitting a post from the client                                                            // 113
   * @memberof Posts                                                                                                // 114
   * @param {Object} post - the post being inserted                                                                 // 115
   */                                                                                                               // 116
  submitPost: function(post){                                                                                       // 117
                                                                                                                    // 118
    check(post, Posts.simpleSchema());                                                                              // 119
                                                                                                                    // 120
    // required properties:                                                                                         // 121
    // title                                                                                                        // 122
                                                                                                                    // 123
    // optional properties                                                                                          // 124
    // URL                                                                                                          // 125
    // body                                                                                                         // 126
    // categories                                                                                                   // 127
    // thumbnailUrl                                                                                                 // 128
                                                                                                                    // 129
    // NOTE: the current user and the post author user might be two different users!                                // 130
    var user = Meteor.user(),                                                                                       // 131
        hasAdminRights = Users.is.admin(user),                                                                      // 132
        schema = Posts.simpleSchema()._schema;                                                                      // 133
                                                                                                                    // 134
    // ------------------------------ Checks ------------------------------ //                                      // 135
                                                                                                                    // 136
    // check that user can post                                                                                     // 137
    if (!user || !Users.can.post(user))                                                                             // 138
      throw new Meteor.Error(601, i18n.t('you_need_to_login_or_be_invited_to_post_new_stories'));                   // 139
                                                                                                                    // 140
    // --------------------------- Rate Limiting -------------------------- //                                      // 141
                                                                                                                    // 142
    if(!hasAdminRights){                                                                                            // 143
                                                                                                                    // 144
      var timeSinceLastPost = Users.timeSinceLast(user, Posts),                                                     // 145
        numberOfPostsInPast24Hours = Users.numberOfItemsInPast24Hours(user, Posts),                                 // 146
        postInterval = Math.abs(parseInt(Settings.get('postInterval', 30))),                                        // 147
        maxPostsPer24Hours = Math.abs(parseInt(Settings.get('maxPostsPerDay', 30)));                                // 148
                                                                                                                    // 149
      // check that user waits more than X seconds between posts                                                    // 150
      if(timeSinceLastPost < postInterval)                                                                          // 151
        throw new Meteor.Error(604, i18n.t('please_wait')+(postInterval-timeSinceLastPost)+i18n.t('seconds_before_posting_again'));
                                                                                                                    // 153
      // check that the user doesn't post more than Y posts per day                                                 // 154
      if(numberOfPostsInPast24Hours > maxPostsPer24Hours)                                                           // 155
        throw new Meteor.Error(605, i18n.t('sorry_you_cannot_submit_more_than')+maxPostsPer24Hours+i18n.t('posts_per_day'));
                                                                                                                    // 157
    }                                                                                                               // 158
                                                                                                                    // 159
    // ------------------------------ Properties ------------------------------ //                                  // 160
                                                                                                                    // 161
    // admin-only properties                                                                                        // 162
    // status                                                                                                       // 163
    // postedAt                                                                                                     // 164
    // userId                                                                                                       // 165
    // sticky (default to false)                                                                                    // 166
                                                                                                                    // 167
    // go over each schema field and throw an error if it's not editable                                            // 168
    _.keys(post).forEach(function (fieldName) {                                                                     // 169
                                                                                                                    // 170
      var field = schema[fieldName];                                                                                // 171
      if (!Users.can.submitField(user, field)) {                                                                    // 172
        throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);   // 173
      }                                                                                                             // 174
                                                                                                                    // 175
    });                                                                                                             // 176
                                                                                                                    // 177
    // if no post status has been set, set it now                                                                   // 178
    if (!post.status) {                                                                                             // 179
      post.status = Posts.getDefaultStatus(user);                                                                   // 180
    }                                                                                                               // 181
                                                                                                                    // 182
    // if no userId has been set, default to current user id                                                        // 183
    if (!post.userId) {                                                                                             // 184
      post.userId = user._id;                                                                                       // 185
    }                                                                                                               // 186
                                                                                                                    // 187
    return Posts.submit(post);                                                                                      // 188
  },                                                                                                                // 189
                                                                                                                    // 190
  /**                                                                                                               // 191
   * Meteor method for editing a post from the client                                                               // 192
   * @memberof Posts                                                                                                // 193
   * @param {Object} modifier - the update modifier                                                                 // 194
   * @param {Object} postId - the id of the post being updated                                                      // 195
   */                                                                                                               // 196
  editPost: function (modifier, postId) {                                                                           // 197
                                                                                                                    // 198
    // checking might be redundant because SimpleSchema already enforces the schema, but you never know             // 199
    check(modifier, Match.OneOf({$set: Posts.simpleSchema()}, {$unset: Object}, {$set: Posts.simpleSchema(), $unset: Object}));
    check(postId, String);                                                                                          // 201
                                                                                                                    // 202
    var user = Meteor.user(),                                                                                       // 203
        post = Posts.findOne(postId),                                                                               // 204
        schema = Posts.simpleSchema()._schema;                                                                      // 205
                                                                                                                    // 206
    // ------------------------------ Checks ------------------------------ //                                      // 207
                                                                                                                    // 208
    // check that user can edit document                                                                            // 209
    if (!user || !Users.can.edit(user, post)) {                                                                     // 210
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_post'));                                       // 211
    }                                                                                                               // 212
                                                                                                                    // 213
    // go over each field and throw an error if it's not editable                                                   // 214
    // loop over each operation ($set, $unset, etc.)                                                                // 215
    _.each(modifier, function (operation) {                                                                         // 216
      // loop over each property being operated on                                                                  // 217
      _.keys(operation).forEach(function (fieldName) {                                                              // 218
                                                                                                                    // 219
        var field = schema[fieldName];                                                                              // 220
        if (!Users.can.editField(user, field, post)) {                                                              // 221
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName); // 222
        }                                                                                                           // 223
                                                                                                                    // 224
      });                                                                                                           // 225
    });                                                                                                             // 226
                                                                                                                    // 227
    return Posts.edit(postId, modifier, post);                                                                      // 228
                                                                                                                    // 229
  },                                                                                                                // 230
                                                                                                                    // 231
  setPostedAt: function(post, customPostedAt){                                                                      // 232
                                                                                                                    // 233
    // this method is not actually used?                                                                            // 234
                                                                                                                    // 235
    check(post, Posts.simpleSchema());                                                                              // 236
    check(customPostedAt, Date);                                                                                    // 237
                                                                                                                    // 238
    var postedAt = new Date(); // default to current date and time                                                  // 239
                                                                                                                    // 240
    if(Users.is.admin(Meteor.user()) && typeof customPostedAt !== 'undefined') // if user is admin and a custom datetime has been set
      postedAt = customPostedAt;                                                                                    // 242
                                                                                                                    // 243
    Posts.update(post._id, {$set: {postedAt: postedAt}});                                                           // 244
  },                                                                                                                // 245
                                                                                                                    // 246
  approvePost: function(postId){                                                                                    // 247
                                                                                                                    // 248
    check(postId, String);                                                                                          // 249
    var post = Posts.findOne(postId);                                                                               // 250
                                                                                                                    // 251
    if(Users.is.admin(Meteor.user())){                                                                              // 252
      var set = {status: 2};                                                                                        // 253
                                                                                                                    // 254
      // unless post is already scheduled and has a postedAt date, set its postedAt date to now                     // 255
      if (!post.postedAt)                                                                                           // 256
        set.postedAt = new Date();                                                                                  // 257
                                                                                                                    // 258
      Posts.update(post._id, {$set: set});                                                                          // 259
                                                                                                                    // 260
      Telescope.callbacks.runAsync("postApprovedAsync", post);                                                      // 261
                                                                                                                    // 262
    }else{                                                                                                          // 263
      Messages.flash('You need to be an admin to do that.', "error");                                               // 264
    }                                                                                                               // 265
  },                                                                                                                // 266
                                                                                                                    // 267
  unapprovePost: function(postId){                                                                                  // 268
                                                                                                                    // 269
    check(postId, String);                                                                                          // 270
    var post = Posts.findOne(postId);                                                                               // 271
                                                                                                                    // 272
    if(Users.is.admin(Meteor.user())){                                                                              // 273
      Posts.update(post._id, {$set: {status: 1}});                                                                  // 274
    }else{                                                                                                          // 275
      Messages.flash('You need to be an admin to do that.', "error");                                               // 276
    }                                                                                                               // 277
  },                                                                                                                // 278
                                                                                                                    // 279
  increasePostViews: function(postId, sessionId){                                                                   // 280
                                                                                                                    // 281
    check(postId, String);                                                                                          // 282
    check(sessionId, String);                                                                                       // 283
                                                                                                                    // 284
    this.unblock();                                                                                                 // 285
                                                                                                                    // 286
    // only let users increment a post's view counter once per session                                              // 287
    var view = {_id: postId, userId: this.userId, sessionId: sessionId};                                            // 288
                                                                                                                    // 289
    if(_.where(postViews, view).length === 0){                                                                      // 290
      postViews.push(view);                                                                                         // 291
      Posts.update(postId, { $inc: { viewCount: 1 }});                                                              // 292
    }                                                                                                               // 293
  },                                                                                                                // 294
                                                                                                                    // 295
  deletePostById: function(postId) {                                                                                // 296
                                                                                                                    // 297
    check(postId, String);                                                                                          // 298
                                                                                                                    // 299
    // remove post comments                                                                                         // 300
    // if(!this.isSimulation) {                                                                                     // 301
    //   Comments.remove({post: postId});                                                                           // 302
    // }                                                                                                            // 303
    // NOTE: actually, keep comments after all                                                                      // 304
                                                                                                                    // 305
    var post = Posts.findOne({_id: postId});                                                                        // 306
                                                                                                                    // 307
    if(!Meteor.userId() || !Users.can.editById(Meteor.userId(), post)) throw new Meteor.Error(606, 'You need permission to edit or delete a post');
                                                                                                                    // 309
    // decrement post count                                                                                         // 310
    Users.update({_id: post.userId}, {$inc: {"telescope.postCount": -1}});                                          // 311
                                                                                                                    // 312
    // delete post                                                                                                  // 313
    Posts.remove(postId);                                                                                           // 314
  }                                                                                                                 // 315
                                                                                                                    // 316
});                                                                                                                 // 317
                                                                                                                    // 318
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/menus.js                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
// array containing items in the views menu                                                                         // 1
Telescope.menuItems.add("viewsMenu", [                                                                              // 2
  {                                                                                                                 // 3
    route: 'posts_top',                                                                                             // 4
    label: 'top',                                                                                                   // 5
    description: 'most_popular_posts'                                                                               // 6
  },                                                                                                                // 7
  {                                                                                                                 // 8
    route: 'posts_new',                                                                                             // 9
    label: 'new',                                                                                                   // 10
    description: 'newest_posts'                                                                                     // 11
  },                                                                                                                // 12
  {                                                                                                                 // 13
    route: 'posts_best',                                                                                            // 14
    label: 'best',                                                                                                  // 15
    description: 'highest_ranked_posts_ever'                                                                        // 16
  },                                                                                                                // 17
  {                                                                                                                 // 18
    route: 'posts_pending',                                                                                         // 19
    label: 'pending',                                                                                               // 20
    description: 'posts_awaiting_moderation',                                                                       // 21
    adminOnly: true                                                                                                 // 22
  },                                                                                                                // 23
  {                                                                                                                 // 24
    route: 'posts_scheduled',                                                                                       // 25
    label: 'scheduled',                                                                                             // 26
    description: 'future_scheduled_posts',                                                                          // 27
    adminOnly: true                                                                                                 // 28
  },                                                                                                                // 29
]);                                                                                                                 // 30
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/routes.js                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/**                                                                                                                 // 1
 * The Posts.controllers namespace                                                                                  // 2
 * @namespace Posts.controllers                                                                                     // 3
 */                                                                                                                 // 4
Posts.controllers = {};                                                                                             // 5
                                                                                                                    // 6
/**                                                                                                                 // 7
 * Controller for all posts lists                                                                                   // 8
 */                                                                                                                 // 9
Posts.controllers.list = RouteController.extend({                                                                   // 10
                                                                                                                    // 11
  template: "posts_list_controller",                                                                                // 12
                                                                                                                    // 13
  showViewsNav: true,                                                                                               // 14
                                                                                                                    // 15
  data: function () {                                                                                               // 16
                                                                                                                    // 17
    var terms = {                                                                                                   // 18
      view: this.view,                                                                                              // 19
      limit: this.params.limit || Settings.get('postsPerPage', 10),                                                 // 20
      enableCache: true                                                                                             // 21
    };                                                                                                              // 22
                                                                                                                    // 23
    // console.log('----------------- router running');                                                             // 24
                                                                                                                    // 25
    // note: the post list controller template will handle all subscriptions, so we just need to pass in the terms  // 26
    return {                                                                                                        // 27
      terms: terms                                                                                                  // 28
    };                                                                                                              // 29
  },                                                                                                                // 30
                                                                                                                    // 31
  getTitle: function () {                                                                                           // 32
    return i18n.t(this.view);                                                                                       // 33
  },                                                                                                                // 34
                                                                                                                    // 35
  getDescription: function () {                                                                                     // 36
    if (Router.current().route.getName() === 'posts_default') { // return site description on root path             // 37
      return Settings.get('description');                                                                           // 38
    } else {                                                                                                        // 39
      return i18n.t(_.findWhere(Telescope.menuItems.get("viewsMenu"), {label: this.view}).description);             // 40
    }                                                                                                               // 41
  }                                                                                                                 // 42
                                                                                                                    // 43
});                                                                                                                 // 44
                                                                                                                    // 45
var getDefaultViewController = function () {                                                                        // 46
  var defaultView = Settings.get('defaultView', 'top');                                                             // 47
  // if view we got from settings is available in Posts.views object, use it                                        // 48
  if (!!Posts.controllers[defaultView]) {                                                                           // 49
    return Posts.controllers[defaultView];                                                                          // 50
  } else {                                                                                                          // 51
    return Posts.controllers.top;                                                                                   // 52
  }                                                                                                                 // 53
};                                                                                                                  // 54
                                                                                                                    // 55
// wrap in startup block to make sure Settings collection is defined                                                // 56
Meteor.startup(function () {                                                                                        // 57
  Posts.controllers.default = getDefaultViewController().extend({                                                   // 58
    getTitle: function () {                                                                                         // 59
      var title = Settings.get('title', 'Telescope');                                                               // 60
      var tagline = Settings.get('tagline');                                                                        // 61
      var fullTitle = !!tagline ? title + ' – ' + tagline : title ;                                                 // 62
      return fullTitle;                                                                                             // 63
    }                                                                                                               // 64
  });                                                                                                               // 65
});                                                                                                                 // 66
                                                                                                                    // 67
/**                                                                                                                 // 68
 * Controller for top view                                                                                          // 69
 */                                                                                                                 // 70
Posts.controllers.top = Posts.controllers.list.extend({                                                             // 71
  view: 'top'                                                                                                       // 72
});                                                                                                                 // 73
                                                                                                                    // 74
/**                                                                                                                 // 75
 * Controller for new view                                                                                          // 76
 */                                                                                                                 // 77
Posts.controllers.new = Posts.controllers.list.extend({                                                             // 78
  view: 'new'                                                                                                       // 79
});                                                                                                                 // 80
                                                                                                                    // 81
/**                                                                                                                 // 82
 * Controller for best view                                                                                         // 83
 */                                                                                                                 // 84
Posts.controllers.best = Posts.controllers.list.extend({                                                            // 85
  view: 'best'                                                                                                      // 86
});                                                                                                                 // 87
                                                                                                                    // 88
/**                                                                                                                 // 89
 * Controller for pending view                                                                                      // 90
 */                                                                                                                 // 91
Posts.controllers.pending = Posts.controllers.list.extend({                                                         // 92
  view: 'pending'                                                                                                   // 93
});                                                                                                                 // 94
                                                                                                                    // 95
/**                                                                                                                 // 96
 * Controller for scheduled view                                                                                    // 97
 */                                                                                                                 // 98
Posts.controllers.scheduled = Posts.controllers.list.extend({                                                       // 99
  view: 'scheduled'                                                                                                 // 100
});                                                                                                                 // 101
                                                                                                                    // 102
/**                                                                                                                 // 103
 * Controller for single post page                                                                                  // 104
 */                                                                                                                 // 105
Posts.controllers.page = RouteController.extend({                                                                   // 106
                                                                                                                    // 107
  template: 'post_page',                                                                                            // 108
                                                                                                                    // 109
  subscriptions: function () {                                                                                      // 110
    this.postSubscription = Telescope.subsManager.subscribe('singlePost', this.params._id);                         // 111
    this.postUsersSubscription = Telescope.subsManager.subscribe('postUsers', this.params._id);                     // 112
    this.commentSubscription = Telescope.subsManager.subscribe('commentsList', {view: 'postComments', postId: this.params._id});
  },                                                                                                                // 114
                                                                                                                    // 115
  post: function() {                                                                                                // 116
    return Posts.findOne(this.params._id);                                                                          // 117
  },                                                                                                                // 118
                                                                                                                    // 119
  getTitle: function () {                                                                                           // 120
    if (!!this.post())                                                                                              // 121
      return this.post().title;                                                                                     // 122
  },                                                                                                                // 123
                                                                                                                    // 124
  onBeforeAction: function () {                                                                                     // 125
    if (!this.post()) {                                                                                             // 126
      if (this.postSubscription.ready()) {                                                                          // 127
        this.render('not_found');                                                                                   // 128
      }                                                                                                             // 129
    } else {                                                                                                        // 130
      this.next();                                                                                                  // 131
    }                                                                                                               // 132
  },                                                                                                                // 133
                                                                                                                    // 134
  onRun: function() {                                                                                               // 135
    var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
    Meteor.call('increasePostViews', this.params._id, sessionId);                                                   // 137
    this.next();                                                                                                    // 138
  },                                                                                                                // 139
                                                                                                                    // 140
  data: function() {                                                                                                // 141
    return {post: this.post()};                                                                                     // 142
  },                                                                                                                // 143
                                                                                                                    // 144
  onAfterAction: function () {                                                                                      // 145
    var post = this.post();                                                                                         // 146
                                                                                                                    // 147
    // Replace URL                                                                                                  // 148
    if (post) {                                                                                                     // 149
      if (post.slug !== this.params.slug) {                                                                         // 150
        window.history.replaceState({}, "", post.getPageUrl());                                                     // 151
      }                                                                                                             // 152
      $('link[rel="canonical"]').attr("href", post.getPageUrl(true));                                               // 153
    }                                                                                                               // 154
                                                                                                                    // 155
    // Set SEO properties                                                                                           // 156
                                                                                                                    // 157
    var props = {meta: {}, og: {}, twitter: {}};                                                                    // 158
                                                                                                                    // 159
    // Set site name                                                                                                // 160
    props.og.site_name = Settings.get("title");                                                                     // 161
                                                                                                                    // 162
    // Set title                                                                                                    // 163
    props.title = post.title;                                                                                       // 164
                                                                                                                    // 165
    // Set description                                                                                              // 166
    if (!!post.body) {                                                                                              // 167
      var description = Telescope.utils.trimWords(post.body, 100);                                                  // 168
      props.meta.description = description;                                                                         // 169
      props.og.description = description;                                                                           // 170
    }                                                                                                               // 171
                                                                                                                    // 172
    // Set image                                                                                                    // 173
    if (!!post.thumbnailUrl) {                                                                                      // 174
      var image = Telescope.utils.addHttp(post.thumbnailUrl);                                                       // 175
      props.meta.image = image;                                                                                     // 176
      props.og.image = image;                                                                                       // 177
      props.twitter.image = image;                                                                                  // 178
      props.twitter.card = "summary_large_image";                                                                   // 179
    }                                                                                                               // 180
                                                                                                                    // 181
    // Set Twitter username                                                                                         // 182
    if (!!Settings.get("twitterAccount")) {                                                                         // 183
      props.twitter.site = Settings.get("twitterAccount");                                                          // 184
    }                                                                                                               // 185
                                                                                                                    // 186
    SEO.set(props);                                                                                                 // 187
                                                                                                                    // 188
    $('title').text(post.title);                                                                                    // 189
                                                                                                                    // 190
  },                                                                                                                // 191
                                                                                                                    // 192
  fastRender: true                                                                                                  // 193
});                                                                                                                 // 194
                                                                                                                    // 195
Meteor.startup(function () {                                                                                        // 196
                                                                                                                    // 197
  Router.route('/', {                                                                                               // 198
    name: 'posts_default',                                                                                          // 199
    controller: Posts.controllers.default                                                                           // 200
  });                                                                                                               // 201
                                                                                                                    // 202
  Router.route('/top/:limit?', {                                                                                    // 203
    name: 'posts_top',                                                                                              // 204
    controller: Posts.controllers.top                                                                               // 205
  });                                                                                                               // 206
                                                                                                                    // 207
  // New                                                                                                            // 208
                                                                                                                    // 209
  Router.route('/new/:limit?', {                                                                                    // 210
    name: 'posts_new',                                                                                              // 211
    controller: Posts.controllers.new                                                                               // 212
  });                                                                                                               // 213
                                                                                                                    // 214
  // Best                                                                                                           // 215
                                                                                                                    // 216
  Router.route('/best/:limit?', {                                                                                   // 217
    name: 'posts_best',                                                                                             // 218
    controller: Posts.controllers.best                                                                              // 219
  });                                                                                                               // 220
                                                                                                                    // 221
  // Pending                                                                                                        // 222
                                                                                                                    // 223
  Router.route('/pending/:limit?', {                                                                                // 224
    name: 'posts_pending',                                                                                          // 225
    controller: Posts.controllers.pending                                                                           // 226
  });                                                                                                               // 227
                                                                                                                    // 228
  // Scheduled                                                                                                      // 229
                                                                                                                    // 230
  Router.route('/scheduled/:limit?', {                                                                              // 231
    name: 'posts_scheduled',                                                                                        // 232
    controller: Posts.controllers.scheduled                                                                         // 233
  });                                                                                                               // 234
                                                                                                                    // 235
  // Post Edit                                                                                                      // 236
                                                                                                                    // 237
  Router.route('/posts/:_id/edit', {                                                                                // 238
    name: 'post_edit',                                                                                              // 239
    template: 'post_edit',                                                                                          // 240
    waitOn: function () {                                                                                           // 241
      return [                                                                                                      // 242
        Telescope.subsManager.subscribe('singlePost', this.params._id),                                             // 243
        Telescope.subsManager.subscribe('allUsersAdmin')                                                            // 244
      ];                                                                                                            // 245
    },                                                                                                              // 246
    data: function() {                                                                                              // 247
      return {                                                                                                      // 248
        postId: this.params._id,                                                                                    // 249
        post: Posts.findOne(this.params._id)                                                                        // 250
      };                                                                                                            // 251
    },                                                                                                              // 252
    fastRender: true                                                                                                // 253
  });                                                                                                               // 254
                                                                                                                    // 255
  // Post Page                                                                                                      // 256
                                                                                                                    // 257
  Router.route('/posts/:_id/:slug?', {                                                                              // 258
    name: 'post_page',                                                                                              // 259
    controller: Posts.controllers.page                                                                              // 260
  });                                                                                                               // 261
                                                                                                                    // 262
  Router.route('/posts/:_id/comment/:commentId', {                                                                  // 263
    name: 'post_page_comment',                                                                                      // 264
    controller: Posts.controllers.page,                                                                             // 265
    onAfterAction: function () {                                                                                    // 266
      // TODO: scroll to comment position                                                                           // 267
    }                                                                                                               // 268
  });                                                                                                               // 269
                                                                                                                    // 270
  // Post Submit                                                                                                    // 271
                                                                                                                    // 272
  Router.route('/submit', {                                                                                         // 273
    name: 'post_submit',                                                                                            // 274
    template: 'post_submit',                                                                                        // 275
    waitOn: function () {                                                                                           // 276
      return Telescope.subsManager.subscribe('allUsersAdmin');                                                      // 277
    }                                                                                                               // 278
  });                                                                                                               // 279
                                                                                                                    // 280
});                                                                                                                 // 281
                                                                                                                    // 282
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/server/publications.js                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Posts._ensureIndex({"status": 1, "postedAt": 1});                                                                   // 1
                                                                                                                    // 2
// Publish a list of posts                                                                                          // 3
                                                                                                                    // 4
Meteor.publish('postsList', function(terms) {                                                                       // 5
  if(Users.can.viewById(this.userId)){                                                                              // 6
    var parameters = Posts.getSubParams(terms),                                                                     // 7
        posts = Posts.find(parameters.find, parameters.options);                                                    // 8
                                                                                                                    // 9
    return posts;                                                                                                   // 10
  }                                                                                                                 // 11
  return [];                                                                                                        // 12
});                                                                                                                 // 13
                                                                                                                    // 14
// Publish all the users that have posted the currently displayed list of posts                                     // 15
// plus the commenters for each post                                                                                // 16
                                                                                                                    // 17
Meteor.publish('postsListUsers', function(terms) {                                                                  // 18
  if(Users.can.viewById(this.userId)){                                                                              // 19
    var parameters = Posts.getSubParams(terms),                                                                     // 20
        posts = Posts.find(parameters.find, parameters.options),                                                    // 21
        userIds = _.pluck(posts.fetch(), 'userId');                                                                 // 22
                                                                                                                    // 23
    // for each post, add first four commenter's userIds to userIds array                                           // 24
    posts.forEach(function (post) {                                                                                 // 25
      userIds = userIds.concat(_.first(post.commenters,4));                                                         // 26
    });                                                                                                             // 27
                                                                                                                    // 28
    userIds = _.unique(userIds);                                                                                    // 29
                                                                                                                    // 30
    return Meteor.users.find({_id: {$in: userIds}}, {fields: Users.pubsub.avatarProperties, multi: true});          // 31
  }                                                                                                                 // 32
  return [];                                                                                                        // 33
});                                                                                                                 // 34
                                                                                                                    // 35
// Publish a single post                                                                                            // 36
                                                                                                                    // 37
Meteor.publish('singlePost', function(postId) {                                                                     // 38
                                                                                                                    // 39
  check(postId, String);                                                                                            // 40
                                                                                                                    // 41
  if (Users.can.viewById(this.userId)){                                                                             // 42
    return Posts.find(postId);                                                                                      // 43
  }                                                                                                                 // 44
  return [];                                                                                                        // 45
});                                                                                                                 // 46
                                                                                                                    // 47
// Publish author of the current post, authors of its comments, and upvoters of the post                            // 48
                                                                                                                    // 49
Meteor.publish('postUsers', function(postId) {                                                                      // 50
                                                                                                                    // 51
  check(postId, String);                                                                                            // 52
                                                                                                                    // 53
  if (Users.can.viewById(this.userId)){                                                                             // 54
    // publish post author and post commenters                                                                      // 55
    var post = Posts.findOne(postId);                                                                               // 56
    var users = [];                                                                                                 // 57
                                                                                                                    // 58
    if (post) {                                                                                                     // 59
                                                                                                                    // 60
      users.push(post.userId); // publish post author's ID                                                          // 61
                                                                                                                    // 62
      // get IDs from all commenters on the post                                                                    // 63
      var comments = Comments.find({postId: post._id}).fetch();                                                     // 64
      if (comments.length) {                                                                                        // 65
        users = users.concat(_.pluck(comments, "userId"));                                                          // 66
      }                                                                                                             // 67
                                                                                                                    // 68
      // publish upvoters                                                                                           // 69
      if (post.upvoters && post.upvoters.length) {                                                                  // 70
        users = users.concat(post.upvoters);                                                                        // 71
      }                                                                                                             // 72
                                                                                                                    // 73
      // publish downvoters                                                                                         // 74
      if (post.downvoters && post.downvoters.length) {                                                              // 75
        users = users.concat(post.downvoters);                                                                      // 76
      }                                                                                                             // 77
                                                                                                                    // 78
    }                                                                                                               // 79
                                                                                                                    // 80
    // remove any duplicate IDs                                                                                     // 81
    users = _.unique(users);                                                                                        // 82
                                                                                                                    // 83
    return Meteor.users.find({_id: {$in: users}}, {fields: Users.pubsub.publicProperties});                         // 84
  }                                                                                                                 // 85
  return [];                                                                                                        // 86
});                                                                                                                 // 87
                                                                                                                    // 88
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/lib/server/fastrender.js                                                                //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Posts.fastRenderRoutes = [                                                                                          // 1
  {                                                                                                                 // 2
    path: "/",                                                                                                      // 3
    view: Settings.get('defaultView', 'top')                                                                        // 4
  },                                                                                                                // 5
  {                                                                                                                 // 6
    path: "/top/:limit?",                                                                                           // 7
    view: "top"                                                                                                     // 8
  },                                                                                                                // 9
  {                                                                                                                 // 10
    path: "/new/:limit?",                                                                                           // 11
    view: "new"                                                                                                     // 12
  },                                                                                                                // 13
  {                                                                                                                 // 14
    path: "/best/:limit?",                                                                                          // 15
    view: "best"                                                                                                    // 16
  },                                                                                                                // 17
  {                                                                                                                 // 18
    path: "/pending/:limit?",                                                                                       // 19
    view: "pending"                                                                                                 // 20
  },                                                                                                                // 21
  {                                                                                                                 // 22
    path: "/scheduled/:limit?",                                                                                     // 23
    view: "scheduled"                                                                                               // 24
  }                                                                                                                 // 25
];                                                                                                                  // 26
                                                                                                                    // 27
Posts.fastRenderSubscribe = function (view, params) {                                                               // 28
  var subscriptionTerms = {                                                                                         // 29
    view: view,                                                                                                     // 30
    limit: params.limit || Settings.get('postsPerPage', 10)                                                         // 31
  };                                                                                                                // 32
  this.subscribe('postsList', subscriptionTerms);                                                                   // 33
  this.subscribe('postsListUsers', subscriptionTerms);                                                              // 34
};                                                                                                                  // 35
                                                                                                                    // 36
Meteor.startup(function () {                                                                                        // 37
  Posts.fastRenderRoutes.forEach(function (route) {                                                                 // 38
    FastRender.route(route.path, _.partial(Posts.fastRenderSubscribe, route.view));                                 // 39
  });                                                                                                               // 40
});                                                                                                                 // 41
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/ar.i18n.js          //
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
_.extend(TAPi18n.translations["ar"][namespace], {"this_link_has_already_been_posted":"هذا الرابط موجود","sorry_you_cannot_submit_more_than":"ﻻ يمكنك اضافة اكثر من ","posts_per_day":"--","please_fill_in_a_title":"قم باضافة عنوان","seconds_before_posting_again":" ثواني قبل نشر مشاركة جديدة.","upvoted":"مصوت لهذه","posted_date":"تاريخ التقديم","posted_time":"توقيت التقديم","postedAt":"ارسل على","createdAt":"كتب على ","url":"رابط","body":"وصف","htmlBody":"Texte HTML","viewCount":"عدد المشاهدات","commentCount":"تعليقات","commenters":"معلقون","lastCommentedAt":"اخر تعليق على","clickCount":"عدد النقرات","baseScore":"النقاط الأساسية","upvotes":"تصويت مع","upvoters":"الموصوتون مع","downvotes":"تصويت ضد","downvoters":"الموصوتون ضد","score":"النتيجة","status":"status","sticky":"Mis en avant","inactive":"غير نشط","author":"كاتب","userId":"مستخدم","sorry_we_couldnt_find_any_posts":"ﻻ توجد اي مشاركة","your_post_has_been_deleted":"مشاركتك قد تم حذفها.","created":"استحدث","suggest_title":"اقترح عنوان","short_url":"رابط قصير","category":"مجموعة,","inactive_":"غير نشط؟","sticky_":"Mis en avant ?","submission_date":"تاريخ اﻻرسال","submission_time":"توقيت اﻻرسال","date":"تاريخ","submission":"ارسال","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"مﻻحظة:مشاركتك قيد المعاينة","user":"مستخدم","status_":"حاﻻت","approved":"مقبول","rejected":"مرفوض","delete_post":"احذف المشاركة","thanks_your_post_is_awaiting_approval":"شكرا, مشاركتك قيد العاينة","sorry_couldnt_find_a_title":"ﻻ يمكننا ايجاد عنوان واحد","please_fill_in_an_url_first":"يجب عليك كتابة الرابط","share":"شارك","discuss":"ناقش","upvote_":"صوت","votes":"اعدد الصوات","basescore":"النتيجة المبدئية","clicks":"نقرات","views":"مشاهدات","comment":"تعليق","point":"نقطة","points":"نقاط"});
TAPi18n._registerServerTranslator("ar", namespace);                                                                 // 20
                                                                                                                    // 21
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/bg.i18n.js          //
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
_.extend(TAPi18n.translations["bg"][namespace], {"this_link_has_already_been_posted":"Тази връзка вече е публикувана","sorry_you_cannot_submit_more_than":"Съжаляваме, неможете да предадете повече от ","posts_per_day":" публикации на ден","please_fill_in_a_title":"Моля въведете заглавие","seconds_before_posting_again":" секунди преди да публикувате отново","upvoted":"Харесан","posted_date":"Дата на публикуване","posted_time":"Време на публикуване","url":"URL","body":"тяло","score":"резултат","status":"статус","sticky":"Закачи","inactive":"неактивена","your_post_has_been_deleted":"Публикацията ви е изтритa.","created":"Създаден","suggest_title":"Предложи заглавие","short_url":"кратко URL","category":"Категория","inactive_":"Неактивен?","sticky_":"Закачи?","submission_date":"Дата на подаване","submission_time":"Време на подаване","date":"Дата","submission":"Подаване","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Забележка: тази публикация все още е висяща, така че няма дата на подаване.","user":"Потребител","status_":"Статус","approved":"Одобрен","rejected":"Отхвърлен","delete_post":"Изтрий публикацията","thanks_your_post_is_awaiting_approval":"Благодаря,  публикацията ви чака одобрение.","sorry_couldnt_find_a_title":"За съжаление, не можах да намеря заглавие...","please_fill_in_an_url_first":"Моля попълни URL първо!","share":"Сподели","discuss":"Обсъждане","upvote_":"Upvote","votes":"гласували","basescore":"Основен резултат","clicks":"Кликания","views":"Видяна","comment":"коментар","point":"точка","points":"точки"});
TAPi18n._registerServerTranslator("bg", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/de.i18n.js          //
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
_.extend(TAPi18n.translations["de"][namespace], {"this_link_has_already_been_posted":"Dieser Link wurde bereits gepostet","sorry_you_cannot_submit_more_than":"Es tut uns leid, Du kannst nicht mehr als ","posts_per_day":" Links pro Tag eintragen","please_fill_in_a_title":"Bitte fülle den Titel aus","url":"URL","body":"Beschreibung","score":"Punkte","status":"status","sticky":"Angeheftet","inactive":"inaktiv","your_post_has_been_deleted":"Dein Link wurde gelöscht.","created":"Erstellt","suggest_title":"Titelvorschlag","short_url":"Kurz-URL","category":"Kategorie","inactive_":"Inaktiv?","sticky_":"Anheften?","submission_date":"Eintragsdatum","submission_time":"Eintragszeit","date":"Datum","submission":"Eintragung","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Hinweis: Dieser Beitrag wartet noch auf Freischaltung, daher gibt es noch kein Datum und keine Uhrzeit.","user":"Benutzer","status_":"Status","approved":"Genehmigt","rejected":"Abgelehnt","delete_post":"Link löschen","thanks_your_post_is_awaiting_approval":"Vielen Dank, Dein Beitrag wartet auf Freischaltung.","sorry_couldnt_find_a_title":"Du hast vergessen einen Titel anzugeben...","please_fill_in_an_url_first":"Du musst eine URL/einen Link angeben!","share":"Teilen","discuss":"Kommentare","upvote_":"Abstimmen","votes":"Stimmen","basescore":"Punktebasis","clicks":"klicks","views":"views","comment":"Kommentar","point":"Punkt","points":"Punkte"});
TAPi18n._registerServerTranslator("de", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/el.i18n.js          //
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
_.extend(TAPi18n.translations["el"][namespace], {"this_link_has_already_been_posted":"Αυτός ο σύνδεσμος υπάρχει ήδη","sorry_you_cannot_submit_more_than":"Δεν μπορείς να υποβάλεις περισσότερα από ","posts_per_day":" σχόλια την ημέρα","please_fill_in_a_title":"Παρακαλώ συμπληρώστε τον τίτλο","seconds_before_posting_again":" δευτερόλεπτα πριν ξανα δημοσιεύσετε","upvoted":"Υπερψηφισμένο","posted_date":"Ημερομηνία δημοσίευσης","posted_time":"Ωρα δημοσίευσης","postedAt":"Δημοσιεύθηκε στις","createdAt":"Δημιουργήθηκε στις","url":"URL","body":"Κείμενο","htmlBody":"HTML κείμενο","viewCount":"Πλήθος προβολών","commentCount":"Πλήθος σχολίων","commenters":"Σχολιαστές","lastCommentedAt":"Τελευταίο σχόλιο στις","clickCount":"Πλήθος κλικ","baseScore":"Βασικό σκορ","upvotes":"Υπερψηφισμοί","upvoters":"Υπερψηφιστές","downvotes":"Καταψηφισμοί","downvoters":"Καταψηφιστές","score":"σκορ","status":"κατάσταση","sticky":"Προτεινόμενο","inactive":"ανενεργό","author":"Δημιουργός","userId":"Χρήστης","sorry_we_couldnt_find_any_posts":"Μας συγχωρείτε, δεν βρήκαμε καμιά δημοσίευση.","your_post_has_been_deleted":"Η δημοσίευση σου έχει διαγραφεί.","created":"Δημιουργήθηκε","suggest_title":"Πρότεινε ενα τίτλο","short_url":"Short URL","category":"Κατηγορία","inactive_":"Ανενεργό?","sticky_":"Προτεινόμενο?","submission_date":"Ημερομηνία Υποβολής","submission_time":"Ώρα Υποβολής","date":"Ημερομηνία","submission":"Υποβολή","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Note: this post is still pending so it has no submission timestamp yet.","user":"Χρήστης","status_":"Κατάσταση","approved":"Εγκρίθηκε","rejected":"Απορρίφθηκε","delete_post":"Διαγραφή δημοσίευσης","thanks_your_post_is_awaiting_approval":"Ευχαριστούμε, η δημοσίευση αναμένει εγκριση.","sorry_couldnt_find_a_title":"Συγγνώμη, ο τίτλος δεν βρέθηκε ","please_fill_in_an_url_first":"Παρακαλώ συμπληρώστε το URL πρώτα!","share":"Μοιράσου","discuss":"Συζύτησε","upvote_":"Μου αρέσει","votes":"Ψήφοι","basescore":"Βασικό Σκορ","clicks":"κλικ","views":"προβολές","comment":"σχόλιο","point":"πόντος","points":"πόντους"});
TAPi18n._registerServerTranslator("el", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/en.i18n.js          //
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
translations[namespace] = {"this_link_has_already_been_posted":"This link has already been posted","sorry_you_cannot_submit_more_than":"Sorry, you cannot submit more than ","posts_per_day":" posts per day","please_fill_in_a_title":"Please fill in a title","seconds_before_posting_again":" seconds before posting again","upvoted":"Upvoted","posted_date":"Posted Date","posted_time":"Posted Time","postedAt":"Posted At","upvotedAt":"Upvoted At","downvotedAt":"Downvoted At","createdAt":"Created At","url":"URL","body":"Body","htmlBody":"HTML Body","viewCount":"View Count","commentCount":"Comment Count","commenters":"Commenters","lastCommentedAt":"Last Commented At","clickCount":"Click Count","baseScore":"Base Score","upvotes":"Upvotes","upvoters":"Upvoters","downvotes":"Downvotes","downvoters":"Downvoters","score":"score","status":"status","sticky":"Sticky","inactive":"inactive","author":"Author","userId":"User","sorry_we_couldnt_find_any_posts":"Sorry, we couldn't find any posts.","your_post_has_been_deleted":"Your post has been deleted.","created":"Created","suggest_title":"Suggest title","short_url":"Short URL","category":"Category","inactive_":"Inactive?","sticky_":"Sticky?","submission_date":"Submission Date","submission_time":"Submission Time","date":"Date","submission":"Submission","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Note: this post is still pending so it has no submission timestamp yet.","user":"User","status_":"Status","approved":"Approved","rejected":"Rejected","delete_post":"Delete Post","thanks_your_post_is_awaiting_approval":"Thanks, your post is awaiting approval.","sorry_couldnt_find_a_title":"Sorry, couldn't find a title...","please_fill_in_an_url_first":"Please fill in an URL first!","share":"Share","discuss":"Discuss","upvote_":"Upvote","votes":"votes","basescore":"baseScore","clicks":"clicks","views":"views","comment":"comment","point":"point","points":"points"};
TAPi18n._loadLangFileObject("en", translations);                                                                    // 11
TAPi18n._registerServerTranslator("en", namespace);                                                                 // 12
                                                                                                                    // 13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/es.i18n.js          //
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
_.extend(TAPi18n.translations["es"][namespace], {"this_link_has_already_been_posted":"Este enlace ya ha sido publicado","sorry_you_cannot_submit_more_than":"Lo sentimos, usted no puede presentar más de ","posts_per_day":" posts por dia","please_fill_in_a_title":"Por favor, agrega un título","seconds_before_posting_again":"segundos antes de postear de nuevo","upvoted":"Voto a favor","posted_date":"Fecha de publicación","posted_time":"Tiempo de publicación","postedAt":"Publicado el","createdAt":"Creado el","url":"URL","body":"Descripción","commenters":"Comentadores","lastCommentedAt":"Último comentario el","baseScore":"Puntuación","upvotes":"Votos Positivos","downvotes":"Votos Negativos","score":"puntuación","status":"Estado","sticky":"Destacado","inactive":"inactivo","author":"Autor","userId":"Usuario","sorry_we_couldnt_find_any_posts":"Lo sentimos, no hemos encontrado ningún post.","your_post_has_been_deleted":"Tu post ha sido borrado.","created":"Creado","suggest_title":"Proponer un titulo","short_url":"URL Corta","category":"Categoría","inactive_":"Inactivo?","sticky_":"Destacado?","submission_date":"Fecha de entrega","submission_time":"Hora de entrega","date":"Fecha","submission":"Entrega","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Nota : Este post esta en proceso de validación entonces no tiene fecha de entrega todavía.","user":"Usuario","status_":"Estado","approved":"Aprobado","rejected":"Rechazado","delete_post":"Eliminar post","thanks_your_post_is_awaiting_approval":"Gracias, su post esta esperando validación.","sorry_couldnt_find_a_title":"Lo sentimos, no se pudo encontrar un título ...","please_fill_in_an_url_first":"Tienes que introducir una URL.","share":"Compartir","discuss":"Comentar","upvote_":"Votar","votes":"votos","basescore":"baseScore","clicks":"clicks","views":"visto","comment":"comentario","point":"punto","points":"puntos"});
TAPi18n._registerServerTranslator("es", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/fr.i18n.js          //
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
_.extend(TAPi18n.translations["fr"][namespace], {"this_link_has_already_been_posted":"Ce lien a déjà été posté","sorry_you_cannot_submit_more_than":"Désolé, vous ne pouvez pas créer plus de ","posts_per_day":" posts par jour","please_fill_in_a_title":"Veuillez saisir un titre","seconds_before_posting_again":" secondes avant de poster à nouveau","upvoted":"Upvoté","posted_date":"Posté le","posted_time":"Posté a","postedAt":"Posté le","upvotedAt":"Upvoté le","downvotedAt":"Downvoté le","createdAt":"Créé le","url":"URL","body":"Description","htmlBody":"Texte HTML","viewCount":"vues","commentCount":"commentaires","commenters":"commentateurs","lastCommentedAt":"Dernier commentaire le","clickCount":"Clics","baseScore":"Score de base","upvotes":"Upvotes","upvoters":"Upvoteurs","downvotes":"Downvotes","downvoters":"Downvoteurs","score":"score","status":"statut","sticky":"Epinglé","inactive":"inactif","author":"Auteur","userId":"Utilisateur","sorry_we_couldnt_find_any_posts":"Aucun post n'a été trouvé","your_post_has_been_deleted":"Votre post a été supprimé.","created":"Crée","suggest_title":"Suggérer un titre","short_url":"URL Courte","category":"Catégorie","inactive_":"Inactif ? ","sticky_":"Epinglé ? ","submission_date":"Date de soumission","submission_time":"Heure de soumission","date":"Date","submission":"Soumission","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Note : ce post est en cours de validation, il n'a pas encore de timestamp.","user":"Utilisateur","status_":"Statut ","approved":"Approuvé","rejected":"Rejeté","delete_post":"Supprimer le post","thanks_your_post_is_awaiting_approval":"Merci, votre post est en cours de validation.","sorry_couldnt_find_a_title":"Désolé, impossible de trouver un titre...","please_fill_in_an_url_first":"Vous devez saisir une URL.","share":"Partager","discuss":"Discuter","upvote_":"Voter","votes":"votes","basescore":"Score de base","clicks":"clics","views":"vues","comment":"commentaire","point":"point","points":"points"});
TAPi18n._registerServerTranslator("fr", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/it.i18n.js          //
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
_.extend(TAPi18n.translations["it"][namespace], {"this_link_has_already_been_posted":"Questo link è già stato postato","sorry_you_cannot_submit_more_than":"Ci spiace, non puoi inviare più di ","posts_per_day":" post al giorno","please_fill_in_a_title":"Per favore inserisci un titolo","url":"URL","body":"Corpo","score":"punteggio","status":"stato","sticky":"Persistente","inactive":"inattivo","your_post_has_been_deleted":"Il tuo post è stato rimosso.","created":"Creato","suggest_title":"Titolo suggerito","short_url":"URL breve","category":"Categoria","inactive_":"Inattivo?","sticky_":"Persistente?","submission_date":"Data di Invio","submission_time":"Ora di Invio","date":"Data","submission":"Invio","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Nota: questo post è ancora in attesa quindi non ha ancora una data di invio.","user":"Utente","status_":"Stato","approved":"Approvato","rejected":"Rifiutato","delete_post":"Elimina Post","thanks_your_post_is_awaiting_approval":"Grazie, il tuo post è in attesa di approvazione.","sorry_couldnt_find_a_title":"Ci spiace, non riusciamo a trovare un titolo...","please_fill_in_an_url_first":"Per favore riempi prima l'URL!","share":"Condividi","discuss":"Discuti","upvote_":"Promuovi","votes":"voti","basescore":"punteggioBase","clicks":"clicks","views":"views","comment":"commento","point":"punto","points":"punti"});
TAPi18n._registerServerTranslator("it", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/nl.i18n.js          //
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
_.extend(TAPi18n.translations["nl"][namespace], {"this_link_has_already_been_posted":"Dit adres is al een keer ingestuurd.","sorry_you_cannot_submit_more_than":"Sorry, je kunt niet meer dan ","posts_per_day":" artikelen per dag plaatsen","please_fill_in_a_title":"Vul een titel in","seconds_before_posting_again":" voor het opnieuw kunnen plaatsen.","upvoted":"Omhoog gestemd","posted_date":"Datum plaatsing","posted_time":"Tijd plaatsing","postedAt":"Ingestuurd","createdAt":"Geschreven","url":"URL","body":"Beschrijving","htmlBody":"HTML Body","viewCount":"Weergaven","commentCount":"Reacties","commenters":"Reageerders","lastCommentedAt":"Laatste reactie","clickCount":"Aantal klikken","baseScore":"Basis score","upvotes":"Omhoog stemmen","upvoters":"Omhoog stemmers","downvotes":"Stemmen omlaag","downvoters":"Omlaag stemmers","score":"score","status":"status","sticky":"Vastgezet","inactive":"inactief","author":"Auteur","userId":"Gebruiker","sorry_we_couldnt_find_any_posts":"Sorry, geen artikelen gevonden.","your_post_has_been_deleted":"Jouw artikel is verwijderd.","created":"Ingestuurd","suggest_title":"Titel suggestie","short_url":"Korte URL","category":"Categorie","inactive_":"Inactief?","sticky_":"Vastgezet?","submission_date":"Datum van insturen","submission_time":"Tijd van insturen","date":"Datum","submission":"Inzending","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Let op: dit bericht wacht nog op goedkeuring en heeft daardoor nog geen datum van inzending.","user":"Gberuiker","status_":"Status","approved":"Goedgekeurd","rejected":"Afgewezen","delete_post":"Verwijder artikel","thanks_your_post_is_awaiting_approval":"Bedankt, je bericht wacht op goedkeuring.","sorry_couldnt_find_a_title":"Sorry, kon geen titel vinden..","please_fill_in_an_url_first":"Vul eerst een URL in!","share":"Delen","discuss":"Discusieer","upvote_":"Omhoog","votes":"stemmen","basescore":"basisScore","clicks":"klikken","views":"weergaven","comment":"reactie","point":"punt","points":"punten"});
TAPi18n._registerServerTranslator("nl", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/pl.i18n.js          //
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
_.extend(TAPi18n.translations["pl"][namespace], {"this_link_has_already_been_posted":"Ten link już istnieje","sorry_you_cannot_submit_more_than":"Nie możesz dodawać więcej niż ","posts_per_day":" postów na dzień","please_fill_in_a_title":"Wypełnij tytuł","seconds_before_posting_again":" sekund zanim znowu będziesz mógł napisać","upvoted":"minus","posted_date":"Data","posted_time":"Godzina","postedAt":"Dodany","createdAt":"Utworzony","url":"URL","body":"Body","htmlBody":"Treść HTML","viewCount":"Liczba odświeżeń","commentCount":"Liczba komentarzy","commenters":"Komentujący","lastCommentedAt":"Ostatnio komentował","clickCount":"Liczba kliknięć","baseScore":"Bazowy wynik","upvotes":"Pozytywne","upvoters":"Głosujący pozytywnie","downvotes":"Negatywne","downvoters":"Głosujący negatywnie","score":"wynik","status":"status","sticky":"Przyklejony","inactive":"nieaktywny","author":"Autor","userId":"Użytkownik","sorry_we_couldnt_find_any_posts":"Przepraszamy, ale w tej chwili nie ma tutaj żadnych postów.","your_post_has_been_deleted":"Twój post został usunięty.","created":"Utworzone","suggest_title":"Zasugeruj tytuł","short_url":"Krótki URL","category":"Kategoria","inactive_":"Nieaktywny?","sticky_":"Przyklejony?","submission_date":"Data utworzenia","submission_time":"Godzina utworzenia","date":"Data","submission":"Wpis","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Ten post ciągle czeka na zatwierdzenie.","user":"Użytkownik","status_":"Status","approved":"Zaakceptowany","rejected":"Odrzucony","delete_post":"Usuń post","thanks_your_post_is_awaiting_approval":"Twój post czeka na zatwierdzenie.","sorry_couldnt_find_a_title":"Podaj tytuł...","please_fill_in_an_url_first":"Podaj URL","share":"Udostępnij","discuss":"Komentuj","upvote_":"Plus","votes":"głosy","basescore":"wynik bazowy","clicks":"kliknięcia","views":"wyświetlenia","comment":"komentarz","point":"punkt","points":"punktów"});
TAPi18n._registerServerTranslator("pl", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/pt-BR.i18n.js       //
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
_.extend(TAPi18n.translations["pt-BR"][namespace], {"this_link_has_already_been_posted":"Este link já foi publicado","sorry_you_cannot_submit_more_than":"Desculpe, você não pode submeter mais do que ","posts_per_day":" postagens por dia","please_fill_in_a_title":"Por favor preencha um título","seconds_before_posting_again":" segundos antes de postar novamente","upvoted":"Votado","posted_date":"Data da Postagem","posted_time":"Hora da da Postagem","postedAt":"Postado em","createdAt":"Criado em","url":"URL","body":"Corpo","htmlBody":"Corpo HTML","viewCount":"Ver Contagem","commentCount":"Contagem de Comentários","commenters":"Comentaristas","lastCommentedAt":"Comentado por último em","clickCount":"Contagem de cliques","baseScore":"Classificação Básica","upvotes":"Votos Positivos","upvoters":"Votadores Positivos","downvotes":"Votos Negativos","downvoters":"Votadores Negativos","score":"classificação","status":"estado","sticky":"Fixo","inactive":"inativo","author":"Autor","userId":"Usuário","sorry_we_couldnt_find_any_posts":"Desculpe, não conseguimos encontrar nenhuma postagem.","your_post_has_been_deleted":"Sua postagem foi deletada.","created":"Criado","suggest_title":"Sugerir título","short_url":"URL curta","category":"Categoria","inactive_":"Inativo?","sticky_":"Fixo?","submission_date":"Data de Submissão","submission_time":"Hora de Submissão","date":"Data","submission":"Submissão","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Nota: esta postagem continua pendente e não possui data de submissão ainda.","user":"Usuário","status_":"Estado","approved":"Aprovada","rejected":"Rejeitada","delete_post":"Deletar Postagem","thanks_your_post_is_awaiting_approval":"Obrigado, sua postagem está aguardando aprovação.","sorry_couldnt_find_a_title":"Desculpe, não encontramos um título...","please_fill_in_an_url_first":"Por favor, inclua a URL antes!","share":"Compartilhar","discuss":"Discutir","upvote_":"Votar","votes":"votos","basescore":"classificaçaoBase","clicks":"cliques","views":"visualizações","comment":"comentário","point":"ponto","points":"pontos"});
TAPi18n._registerServerTranslator("pt-BR", namespace);                                                              // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/ro.i18n.js          //
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
_.extend(TAPi18n.translations["ro"][namespace], {"this_link_has_already_been_posted":"Acest link a fost deja publicat","sorry_you_cannot_submit_more_than":"Ne pare rău insă nu poți publica mai mult de ","posts_per_day":" postări pe zi","please_fill_in_a_title":"Te rugăm să alegi un titlu","seconds_before_posting_again":" secunde până să poți publica iar","upvoted":"Votat","posted_date":"Data Postării","posted_time":"Ora Postării","url":"URL","body":"Descriere","score":"Punctaj","status":"Status","sticky":"Actual","inactive":"Inactiv","your_post_has_been_deleted":"Postarea ta a fost ștersă.","created":"Creat","suggest_title":"Propune un titlu","short_url":"Prescurtare-URL","category":"Categorie","inactive_":"Inactiv?","sticky_":"Arhivează?","submission_date":"Data înregistrării","submission_time":"Ora înregistrării","date":"Data","submission":"Înregistrare","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Informare: Această contribuție este încă în curs de aprobare, de aceea nu există o dată și o oră de înregistrare.","user":"Utilizator","status_":"Status","approved":"Aprobat","rejected":"Respins","delete_post":"Șterge postarea","thanks_your_post_is_awaiting_approval":"Mulțumim, postarea ta este în curs de verificare.","sorry_couldnt_find_a_title":"Ai uitat oare să specifici un titlu?","please_fill_in_an_url_first":"Trebuie să specifici un URL/Link!","share":"Share","discuss":"Comentarii","upvote_":"Votează","votes":"Voturi","basescore":"Scor de bază","clicks":"Click-uri","views":"Afișări","comment":"Comentariu","point":"Punct","points":"Puncte"});
TAPi18n._registerServerTranslator("ro", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/ru.i18n.js          //
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
_.extend(TAPi18n.translations["ru"][namespace], {"this_link_has_already_been_posted":"Эта ссылка уже была опубликована","sorry_you_cannot_submit_more_than":"Извините, вы не можете отправлять больше, чем ","posts_per_day":" постов за день","please_fill_in_a_title":"Заполните заголовок","seconds_before_posting_again":" секунд перед новым постом","upvoted":"За","posted_date":"Дата поста","posted_time":"Время поста","postedAt":"Опубликован","createdAt":"Создан","url":"URL","body":"Body","htmlBody":"HTML Body","viewCount":"Просмотров","commentCount":"Комментариве","commenters":"Комментаторов","lastCommentedAt":"Последний комментарий","clickCount":"Кликов","baseScore":"Базовый счёт","upvotes":"Голосов За","upvoters":"Поддержали","downvotes":"Голосов Против","downvoters":"Выступили против","score":"очки","status":"статус","sticky":"В закладки","inactive":"неактивно","author":"Автор","userId":"Пользователь","your_post_has_been_deleted":"Ваш пост удалён.","created":"Создан","suggest_title":"Предложите название","short_url":"Короткий URL","category":"Категория","inactive_":"Сделать неактивным?","sticky_":"С закладкой?","submission_date":"Дата отправки на утверждение","submission_time":"Время отправки на утверждение","date":"Дата","submission":"Утверждение","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Заметка: этот пост находится на рассмотрении, поэтому время утверждения не указано.","user":"Пользователь","status_":"Статус","approved":"Утверждён","rejected":"Отклонён","delete_post":"Удалить пост","thanks_your_post_is_awaiting_approval":"Спасибо, пост ожидает утверждения.","sorry_couldnt_find_a_title":"Извините, не смог найти название...","please_fill_in_an_url_first":"Вначале укажите URL!","share":"Поделится","discuss":"Обсудить","upvote_":"Проголосовать за","votes":"голосов","basescore":"базовые очки","clicks":"кликов","views":"просмотров","comment":"комментарий","point":"бал","points":"баллов"});
TAPi18n._registerServerTranslator("ru", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/sv.i18n.js          //
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
_.extend(TAPi18n.translations["sv"][namespace], {"this_link_has_already_been_posted":"Denna länk har redan lagts till","sorry_you_cannot_submit_more_than":"Tyvärr får du inte skapa mer än ","posts_per_day":" inlägg per dag","please_fill_in_a_title":"Vänligen fyll i en titel","seconds_before_posting_again":" sekunder innan nästa inlägg","upvoted":"Uppröstad","posted_date":"Publicerat datum","posted_time":"Publicerad tid","postedAt":"Tillagd","upvotedAt":"Uppröstad","downvotedAt":"Nedröstad","createdAt":"Skapad","url":"URL","body":"Innehåll","htmlBody":"HTML-kropp","viewCount":"Antal visningar","commentCount":"Antal kommentarer","commenters":"Kommentatorer","lastCommentedAt":"Senast kommenterad","clickCount":"Antal klick","baseScore":"Baspoäng","upvotes":"Uppröstningar","upvoters":"Uppröstare","downvotes":"Nedröstningar","downvoters":"Nedröstare","score":"poäng","status":"status","sticky":"Permanent","inactive":"inaktiv","author":"Skapad av","userId":"Användare","sorry_we_couldnt_find_any_posts":"Tyvärr kunde vi inte hitta några inlägg.","your_post_has_been_deleted":"Ditt inlägg har tagits bort.","created":"Skapad","suggest_title":"Föreslå titel","short_url":"Kort URL","category":"Kategori","inactive_":"Inaktiv?","sticky_":"Permanent?","submission_date":"Inläggsdatum","submission_time":"Inläggstid","date":"Datum","submission":"Inlägg","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"OBS: detta inlägg väntar på godkännande, så den har inget inläggsdatum än.","user":"Användare","status_":"Status","approved":"Godkänd","rejected":"Avslaget","delete_post":"Ta Bort Inlägg","thanks_your_post_is_awaiting_approval":"Tack, ditt inlägg väntar på godkännande.","sorry_couldnt_find_a_title":"Tyvärr kunde vi inte någon titel...","please_fill_in_an_url_first":"Vänligen fyll i en adress först!","share":"Dela","discuss":"Diskutera","upvote_":"Upprösta","votes":"röster","basescore":"baspoäng","clicks":"klick","views":"visningar","comment":"kommentera","point":"poäng","points":"poäng"});
TAPi18n._registerServerTranslator("sv", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/tr.i18n.js          //
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
_.extend(TAPi18n.translations["tr"][namespace], {"this_link_has_already_been_posted":"Bu bağlantı daha önce paylaşılmıştı","sorry_you_cannot_submit_more_than":"Özür dileriz, bu sayıdan daha fazla paylaşamazsınız: ","posts_per_day":" paylaşım / gün","please_fill_in_a_title":"Lütfen bir başlık girin","seconds_before_posting_again":" saniye daha beklemeniz lazım tekrar paylaşım yapmadan önce","upvoted":"Yukarı oylandı","posted_date":"Paylaşım Tarihi","posted_time":"Paylaşım Zamanı","url":"URL","body":"Metin","baseScore":"temel skor","score":"skor","status":"Durum","sticky":"Yapışkan","inactive":"etkin değil","your_post_has_been_deleted":"Paylaşımınız silindi","created":"Oluşturuldu","suggest_title":"Başlık öner","category":"Kategori","inactive_":"Etkin değil?","sticky_":"Yapışkan?","submission_date":"Yayın tarihi","submission_time":"Yayın zamanı","date":"Tarih","submission":"Yayın","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Bu paylaşım hala onay bekliyor, bu nedenle henüz yayın tarihi yok","user":"Kullanıcı","approved":"Onaylandı","rejected":"Reddedildi","delete_post":"Paylaşımı sil","thanks_your_post_is_awaiting_approval":"Teşekkürler, paylaşımınız onay bekliyor","sorry_couldnt_find_a_title":"Özür dileriz, bir başlık bulamadık","please_fill_in_an_url_first":"Lütfen önce bir URL giriniz","share":"Paylaş","discuss":"Yorum yap","upvote_":"Beğen","votes":"oylar","clicks":"tıklamalar","comment":"yorum","point":"nokta","points":"noktalar"});
TAPi18n._registerServerTranslator("tr", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/vi.i18n.js          //
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
_.extend(TAPi18n.translations["vi"][namespace], {"this_link_has_already_been_posted":"Đường dẫn này đã được đăng","sorry_you_cannot_submit_more_than":"Xin lỗi, bạn không thể đăng nhiều hơn ","posts_per_day":" bài mỗi ngày","please_fill_in_a_title":"xin nhập tiêu đề","seconds_before_posting_again":" một vài giây để đăng lại","upvoted":"Thích","posted_date":"Ngày đăng","posted_time":"Giờ đăng","postedAt":"Đăng lúc","createdAt":"Tạo lúc","url":"URL","body":"Nội dung","htmlBody":"HTML Body","viewCount":"Số lần xem","commentCount":"Số lần bình luận","commenters":"Bình luận","lastCommentedAt":"Bình luận lúc","clickCount":"Click Count","baseScore":"Base Score","upvotes":"Upvotes","upvoters":"Upvoters","downvotes":"Downvotes","downvoters":"Downvoters","score":"điểm","status":"trạng thái","sticky":"Sticky","inactive":"inactive","author":"Author","userId":"User","sorry_we_couldnt_find_any_posts":"Xin lỗi, thông tin không được tìm thấy.","your_post_has_been_deleted":"Bài của bạn đã được xóa.","created":"Tạo","suggest_title":"Gợi ý tiêu đề","short_url":"URL ngắn","category":"Loại","inactive_":"Ngừng kích hoạt?","sticky_":"Sticky?","submission_date":"Ngày đăng","submission_time":"Giờ đăng","date":"Ngày","submission":"Đăng","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"Lưu ý: bài này đang đợi xét duyệt nên chưa có thời gian đăng bài.","user":"Người dùng","status_":"Trạng thái","approved":"Đồng ý","rejected":"Từ chối","delete_post":"Xóa bài","thanks_your_post_is_awaiting_approval":"Cảm ơn, bài của bạn đang đợi phê duyệt.","sorry_couldnt_find_a_title":"Xin lỗi, không có tiêu đề...","please_fill_in_an_url_first":"Làm ơn nhập địa chỉ website!","share":"Chia sẻ","discuss":"Bình luận","upvote_":"Thích","votes":"phiếu","basescore":"baseScore","clicks":"clicks","views":"xem","comment":"ý kiến","point":"điểm","points":"điểm"});
TAPi18n._registerServerTranslator("vi", namespace);                                                                 // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/telescope:posts/Applications/MAMP/websites/stewardsof/packages/telescope-posts/i18n/zh-CN.i18n.js       //
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
_.extend(TAPi18n.translations["zh-CN"][namespace], {"this_link_has_already_been_posted":"这个链接已发布","sorry_you_cannot_submit_more_than":"对不起, 内容不能超过","posts_per_day":" 评价每日发帖","please_fill_in_a_title":"请填写标题","seconds_before_posting_again":"秒前发布","upvoted":"最多投票","posted_date":"发布日期","posted_time":"发布时间","url":"链接地址","body":"内容","score":"得分","status":"状态","sticky":"置顶","inactive":"不活跃","your_post_has_been_deleted":"你的帖子已经被删除","created":"创建","suggest_title":"显示标题","short_url":"短网址","category":"分类","inactive_":"Inactive?","sticky_":"置顶?","submission_date":"提交日期","submission_time":"提交时间","date":"日期","submission":"提交","note_this_post_is_still_pending_so_it_has_no_submission_timestamp_yet":"这篇文章没有进行审核.","user":"用户","status_":"专题","approved":"审核","rejected":"拒接","delete_post":"删除帖子","thanks_your_post_is_awaiting_approval":"感谢, 你的帖子正在等待批准.","sorry_couldnt_find_a_title":"抱歉找不相关话题","please_fill_in_an_url_first":"请在第一栏填写链接","share":"分享","discuss":"讨论","upvote_":"顶","votes":"得票","basescore":"基础得分","clicks":"点击","views":"views","comment":"评论","point":"点击","points":"点击数"});
TAPi18n._registerServerTranslator("zh-CN", namespace);                                                              // 18
                                                                                                                    // 19
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:posts'] = {
  Posts: Posts
};

})();

//# sourceMappingURL=telescope_posts.js.map
