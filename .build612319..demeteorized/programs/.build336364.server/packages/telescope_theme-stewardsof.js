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
var __, Handlebars, translations;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:theme-stewardsof/package-i18n.js                                                          //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
TAPi18n.packages["telescope:theme-stewardsof"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"};
                                                                                                                // 2
// define package's translation function (proxy to the i18next)                                                 // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                // 4
                                                                                                                // 5
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:theme-stewardsof/lib/custom_users.js                                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/**                                                                                                             // 1
 * Vote schema                                                                                                  // 2
 * @type {SimpleSchema}                                                                                         // 3
 */                                                                                                             // 4
Telescope.schemas.votes = new SimpleSchema({                                                                    // 5
  itemId: {                                                                                                     // 6
    type: String                                                                                                // 7
  },                                                                                                            // 8
  power: {                                                                                                      // 9
    type: Number,                                                                                               // 10
    optional: true                                                                                              // 11
  },                                                                                                            // 12
  votedAt: {                                                                                                    // 13
    type: Date,                                                                                                 // 14
    optional: true                                                                                              // 15
  }                                                                                                             // 16
});                                                                                                             // 17
                                                                                                                // 18
/**                                                                                                             // 19
 * User Data schema                                                                                             // 20
 * @type {SimpleSchema}                                                                                         // 21
 */                                                                                                             // 22
Telescope.schemas.userData = new SimpleSchema({                                                                 // 23
  /**                                                                                                           // 24
    Total comment count                                                                                         // 25
  */                                                                                                            // 26
  commentCount: {                                                                                               // 27
    type: Number,                                                                                               // 28
    public: true,                                                                                               // 29
    optional: true                                                                                              // 30
  },                                                                                                            // 31
  /**                                                                                                           // 32
    The name displayed throughout the app. Can contain spaces and special characters, doesn't need to be unique // 33
  */                                                                                                            // 34
  displayName: {                                                                                                // 35
    type: String,                                                                                               // 36
    optional: true,                                                                                             // 37
    public: true,                                                                                               // 38
    profile: true,                                                                                              // 39
    editableBy: ["member", "admin"]                                                                             // 40
  },                                                                                                            // 41
  /**                                                                                                           // 42
    An array containing comment downvotes                                                                       // 43
  */                                                                                                            // 44
  downvotedComments: {                                                                                          // 45
    type: [Telescope.schemas.votes],                                                                            // 46
    public: true,                                                                                               // 47
    optional: true                                                                                              // 48
  },                                                                                                            // 49
  /**                                                                                                           // 50
    An array containing posts downvotes                                                                         // 51
  */                                                                                                            // 52
  downvotedPosts: {                                                                                             // 53
    type: [Telescope.schemas.votes],                                                                            // 54
    public: true,                                                                                               // 55
    optional: true                                                                                              // 56
  },                                                                                                            // 57
  /**                                                                                                           // 58
    The user's email. Modifiable.                                                                               // 59
  */                                                                                                            // 60
  email: {                                                                                                      // 61
    type: String,                                                                                               // 62
    optional: true,                                                                                             // 63
    regEx: SimpleSchema.RegEx.Email,                                                                            // 64
    required: true,                                                                                             // 65
    editableBy: ["member", "admin"]                                                                             // 66
    // unique: true // note: find a way to fix duplicate accounts before enabling this                          // 67
  },                                                                                                            // 68
  /**                                                                                                           // 69
    A hash of the email, used for Gravatar // TODO: change this when email changes                              // 70
  */                                                                                                            // 71
  emailHash: {                                                                                                  // 72
    type: String,                                                                                               // 73
    public: true,                                                                                               // 74
    optional: true                                                                                              // 75
  },                                                                                                            // 76
  /**                                                                                                           // 77
    The user's karma                                                                                            // 78
  */                                                                                                            // 79
  karma: {                                                                                                      // 80
    type: Number,                                                                                               // 81
    decimal: true,                                                                                              // 82
    public: true,                                                                                               // 83
    optional: true                                                                                              // 84
  },                                                                                                            // 85
  /**                                                                                                           // 86
    Total post count                                                                                            // 87
  */                                                                                                            // 88
  postCount: {                                                                                                  // 89
    type: Number,                                                                                               // 90
    public: true,                                                                                               // 91
    optional: true                                                                                              // 92
  },                                                                                                            // 93
  /**                                                                                                           // 94
    A blackbox modifiable object to store the user's settings                                                   // 95
  */                                                                                                            // 96
  settings: {                                                                                                   // 97
    type: Object,                                                                                               // 98
    optional: true,                                                                                             // 99
    editableBy: ["member", "admin"],                                                                            // 100
    blackbox: true,                                                                                             // 101
    autoform: {                                                                                                 // 102
      omit: true                                                                                                // 103
    }                                                                                                           // 104
  },                                                                                                            // 105
  /**                                                                                                           // 106
    The user's profile URL slug // TODO: change this when displayName changes                                   // 107
  */                                                                                                            // 108
  slug: {                                                                                                       // 109
    type: String,                                                                                               // 110
    public: true,                                                                                               // 111
    optional: true                                                                                              // 112
  },                                                                                                            // 113
  /**                                                                                                           // 114
    The user's Twitter username                                                                                 // 115
  */                                                                                                            // 116
  twitterUsername: {                                                                                            // 117
    type: String,                                                                                               // 118
    optional: true,                                                                                             // 119
    public: true,                                                                                               // 120
    profile: true,                                                                                              // 121
    editableBy: ["member", "admin"],                                                                            // 122
    template: "user_profile_twitter"                                                                            // 123
  },                                                                                                            // 124
  /**                                                                                                           // 125
    An array containing comments upvotes                                                                        // 126
  */                                                                                                            // 127
  upvotedComments: {                                                                                            // 128
    type: [Telescope.schemas.votes],                                                                            // 129
    public: true,                                                                                               // 130
    optional: true                                                                                              // 131
  },                                                                                                            // 132
  /**                                                                                                           // 133
    An array containing posts upvotes                                                                           // 134
  */                                                                                                            // 135
  upvotedPosts: {                                                                                               // 136
    type: [Telescope.schemas.votes],                                                                            // 137
    public: true,                                                                                               // 138
    optional: true                                                                                              // 139
  },                                                                                                            // 140
  /**                                                                                                           // 141
    A link to the user's homepage                                                                               // 142
  */                                                                                                            // 143
  website: {                                                                                                    // 144
    type: String,                                                                                               // 145
    regEx: SimpleSchema.RegEx.Url,                                                                              // 146
    public: true,                                                                                               // 147
    profile: true,                                                                                              // 148
    optional: true,                                                                                             // 149
    editableBy: ["member", "admin"]                                                                             // 150
  }                                                                                                             // 151
});                                                                                                             // 152
                                                                                                                // 153
/**                                                                                                             // 154
 * Users schema                                                                                                 // 155
 * @type {SimpleSchema}                                                                                         // 156
 */                                                                                                             // 157
Users.schema = new SimpleSchema({                                                                               // 158
  _id: {                                                                                                        // 159
    type: String,                                                                                               // 160
    public: true,                                                                                               // 161
    optional: true                                                                                              // 162
  },                                                                                                            // 163
  username: {                                                                                                   // 164
    type: String,                                                                                               // 165
    // regEx: /^[a-z0-9A-Z_]{3,15}$/,                                                                           // 166
    public: true,                                                                                               // 167
    optional: true                                                                                              // 168
  },                                                                                                            // 169
  emails: {                                                                                                     // 170
    type: [Object],                                                                                             // 171
    optional: true                                                                                              // 172
  },                                                                                                            // 173
  "emails.$.address": {                                                                                         // 174
    type: String,                                                                                               // 175
    regEx: SimpleSchema.RegEx.Email,                                                                            // 176
    optional: true                                                                                              // 177
  },                                                                                                            // 178
  "emails.$.verified": {                                                                                        // 179
    type: Boolean,                                                                                              // 180
    optional: true                                                                                              // 181
  },                                                                                                            // 182
  createdAt: {                                                                                                  // 183
    type: Date,                                                                                                 // 184
    public: true,                                                                                               // 185
    optional: true                                                                                              // 186
  },                                                                                                            // 187
  isAdmin: {                                                                                                    // 188
    type: Boolean,                                                                                              // 189
    optional: true,                                                                                             // 190
    editableBy: ["admin"],                                                                                      // 191
    autoform: {                                                                                                 // 192
      omit: true                                                                                                // 193
    }                                                                                                           // 194
  },                                                                                                            // 195
  profile: {                                                                                                    // 196
    type: Object,                                                                                               // 197
    optional: true,                                                                                             // 198
    blackbox: true                                                                                              // 199
  },                                                                                                            // 200
  telescope: { // telescope-specific data                                                                       // 201
    type: Telescope.schemas.userData,                                                                           // 202
    optional: true                                                                                              // 203
  },                                                                                                            // 204
  services: {                                                                                                   // 205
    type: Object,                                                                                               // 206
    optional: true,                                                                                             // 207
    blackbox: true                                                                                              // 208
  }                                                                                                             // 209
});                                                                                                             // 210
                                                                                                                // 211
Users.schema.internationalize();                                                                                // 212
                                                                                                                // 213
/**                                                                                                             // 214
 * Attach schema to Meteor.users collection                                                                     // 215
 */                                                                                                             // 216
Users.attachSchema(Users.schema);                                                                               // 217
                                                                                                                // 218
/**                                                                                                             // 219
 * Users collection permissions                                                                                 // 220
 */                                                                                                             // 221
                                                                                                                // 222
Users.allow({                                                                                                   // 223
  update: _.partial(Telescope.allowCheck, Meteor.users),                                                        // 224
  remove: _.partial(Telescope.allowCheck, Meteor.users)                                                         // 225
});                                                                                                             // 226
                                                                                                                // 227
                                                                                                                // 228
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:theme-stewardsof/lib/custom_posts.js                                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
/**                                                                                                             // 1
 * Posts schema                                                                                                 // 2
 * @type {SimpleSchema}                                                                                         // 3
 */                                                                                                             // 4
Posts.schema = new SimpleSchema({                                                                               // 5
  /**                                                                                                           // 6
    ID                                                                                                          // 7
  */                                                                                                            // 8
  _id: {                                                                                                        // 9
    type: String,                                                                                               // 10
    optional: true                                                                                              // 11
  },                                                                                                            // 12
  /**                                                                                                           // 13
    Timetstamp of post creation                                                                                 // 14
  */                                                                                                            // 15
  createdAt: {                                                                                                  // 16
    type: Date,                                                                                                 // 17
    optional: true                                                                                              // 18
  },                                                                                                            // 19
  /**                                                                                                           // 20
    Timestamp of post first appearing on the site (i.e. being approved)                                         // 21
  */                                                                                                            // 22
  postedAt: {                                                                                                   // 23
    type: Date,                                                                                                 // 24
    optional: true,                                                                                             // 25
    editableBy: ["admin"],                                                                                      // 26
    autoform: {                                                                                                 // 27
      group: 'admin',                                                                                           // 28
      type: "bootstrap-datetimepicker"                                                                          // 29
    }                                                                                                           // 30
  },                                                                                                            // 31
  /**                                                                                                           // 32
    URL                                                                                                         // 33
  */                                                                                                            // 34
  url: {                                                                                                        // 35
    type: String,                                                                                               // 36
    optional: true,                                                                                             // 37
    editableBy: ["member", "admin"],                                                                            // 38
    autoform: {                                                                                                 // 39
      type: "bootstrap-url"                                                                                     // 40
    }                                                                                                           // 41
  },                                                                                                            // 42
  /**                                                                                                           // 43
    Title                                                                                                       // 44
  */                                                                                                            // 45
  title: {                                                                                                      // 46
    type: String,                                                                                               // 47
    optional: false,                                                                                            // 48
    label: "Company Name",                                                                                      // 49
    editableBy: ["member", "admin"]                                                                             // 50
  },                                                                                                            // 51
  /**                                                                                                           // 52
    Slug                                                                                                        // 53
  */                                                                                                            // 54
  slug: {                                                                                                       // 55
    type: String,                                                                                               // 56
    optional: true                                                                                              // 57
  },                                                                                                            // 58
  /**                                                                                                           // 59
    HTML version of the post body                                                                               // 60
  */                                                                                                            // 61
  htmlBody: {                                                                                                   // 62
    type: String,                                                                                               // 63
    optional: true                                                                                              // 64
  },                                                                                                            // 65
  /**                                                                                                           // 66
    Count of how many times the post's page was viewed                                                          // 67
  */                                                                                                            // 68
  viewCount: {                                                                                                  // 69
    type: Number,                                                                                               // 70
    optional: true                                                                                              // 71
  },                                                                                                            // 72
  /**                                                                                                           // 73
    Count of the post's comments                                                                                // 74
  */                                                                                                            // 75
  commentCount: {                                                                                               // 76
    type: Number,                                                                                               // 77
    optional: true                                                                                              // 78
  },                                                                                                            // 79
  /**                                                                                                           // 80
    An array containing the `_id`s of commenters                                                                // 81
  */                                                                                                            // 82
  commenters: {                                                                                                 // 83
    type: [String],                                                                                             // 84
    optional: true                                                                                              // 85
  },                                                                                                            // 86
  /**                                                                                                           // 87
    Timestamp of the last comment                                                                               // 88
  */                                                                                                            // 89
  lastCommentedAt: {                                                                                            // 90
    type: Date,                                                                                                 // 91
    optional: true                                                                                              // 92
  },                                                                                                            // 93
  /**                                                                                                           // 94
    Count of how many times the post's link was clicked                                                         // 95
  */                                                                                                            // 96
  clickCount: {                                                                                                 // 97
    type: Number,                                                                                               // 98
    optional: true                                                                                              // 99
  },                                                                                                            // 100
  /**                                                                                                           // 101
    The post's base score (not factoring in the post's age)                                                     // 102
  */                                                                                                            // 103
  baseScore: {                                                                                                  // 104
    type: Number,                                                                                               // 105
    decimal: true,                                                                                              // 106
    optional: true                                                                                              // 107
  },                                                                                                            // 108
  /**                                                                                                           // 109
    How many upvotes the post has received                                                                      // 110
  */                                                                                                            // 111
  upvotes: {                                                                                                    // 112
    type: Number,                                                                                               // 113
    optional: true                                                                                              // 114
  },                                                                                                            // 115
  /**                                                                                                           // 116
    An array containing the `_id`s of the post's upvoters                                                       // 117
  */                                                                                                            // 118
  upvoters: {                                                                                                   // 119
    type: [String],                                                                                             // 120
    optional: true                                                                                              // 121
  },                                                                                                            // 122
  /**                                                                                                           // 123
    How many downvotes the post has received                                                                    // 124
  */                                                                                                            // 125
  downvotes: {                                                                                                  // 126
    type: Number,                                                                                               // 127
    optional: true                                                                                              // 128
  },                                                                                                            // 129
  /**                                                                                                           // 130
    An array containing the `_id`s of the post's downvoters                                                     // 131
  */                                                                                                            // 132
  downvoters: {                                                                                                 // 133
    type: [String],                                                                                             // 134
    optional: true                                                                                              // 135
  },                                                                                                            // 136
  /**                                                                                                           // 137
    The post's current score (factoring in age)                                                                 // 138
  */                                                                                                            // 139
  score: {                                                                                                      // 140
    type: Number,                                                                                               // 141
    decimal: true,                                                                                              // 142
    optional: true                                                                                              // 143
  },                                                                                                            // 144
  /**                                                                                                           // 145
    The post's status. One of pending (`1`), approved (`2`), or deleted (`3`)                                   // 146
  */                                                                                                            // 147
  status: {                                                                                                     // 148
    type: Number,                                                                                               // 149
    optional: true,                                                                                             // 150
    editableBy: ["admin"],                                                                                      // 151
    autoValue: function () {                                                                                    // 152
      // only provide a default value                                                                           // 153
      // 1) this is an insert operation                                                                         // 154
      // 2) status field is not set in the document being inserted                                              // 155
      var user = Meteor.users.findOne(this.userId);                                                             // 156
      if (this.isInsert && !this.isSet)                                                                         // 157
        return Posts.getDefaultStatus(user);                                                                    // 158
    },                                                                                                          // 159
    autoform: {                                                                                                 // 160
      noselect: true,                                                                                           // 161
      options: Posts.config.postStatuses,                                                                       // 162
      group: 'admin'                                                                                            // 163
    }                                                                                                           // 164
  },                                                                                                            // 165
  /**                                                                                                           // 166
    Whether the post is sticky (pinned to the top of posts lists)                                               // 167
  */                                                                                                            // 168
  sticky: {                                                                                                     // 169
    type: Boolean,                                                                                              // 170
    optional: true,                                                                                             // 171
    defaultValue: false,                                                                                        // 172
    editableBy: ["admin"],                                                                                      // 173
    autoform: {                                                                                                 // 174
      group: 'admin',                                                                                           // 175
      leftLabel: "Sticky"                                                                                       // 176
    }                                                                                                           // 177
  },                                                                                                            // 178
  /**                                                                                                           // 179
    Whether the post is inactive. Inactive posts see their score recalculated less often                        // 180
  */                                                                                                            // 181
  inactive: {                                                                                                   // 182
    type: Boolean,                                                                                              // 183
    optional: true                                                                                              // 184
  },                                                                                                            // 185
  /**                                                                                                           // 186
    The post author's name                                                                                      // 187
  */                                                                                                            // 188
  author: {                                                                                                     // 189
    type: String,                                                                                               // 190
    optional: true                                                                                              // 191
  },                                                                                                            // 192
  /**                                                                                                           // 193
    The post author's `_id`.                                                                                    // 194
  */                                                                                                            // 195
  userId: {                                                                                                     // 196
    type: String,                                                                                               // 197
    optional: true,                                                                                             // 198
    editableBy: ["admin"],                                                                                      // 199
    autoform: {                                                                                                 // 200
      group: 'admin',                                                                                           // 201
      options: function () {                                                                                    // 202
        return Meteor.users.find().map(function (user) {                                                        // 203
          return {                                                                                              // 204
            value: user._id,                                                                                    // 205
            label: Users.getDisplayName(user)                                                                   // 206
          };                                                                                                    // 207
        });                                                                                                     // 208
      }                                                                                                         // 209
    }                                                                                                           // 210
  }                                                                                                             // 211
});                                                                                                             // 212
                                                                                                                // 213
// schema transforms                                                                                            // 214
Posts.schema.internationalize();                                                                                // 215
                                                                                                                // 216
/**                                                                                                             // 217
 * Attach schema to Posts collection                                                                            // 218
 */                                                                                                             // 219
Posts.attachSchema(Posts.schema);                                                                               // 220
                                                                                                                // 221
Posts.allow({                                                                                                   // 222
  update: _.partial(Telescope.allowCheck, Posts),                                                               // 223
  remove: _.partial(Telescope.allowCheck, Posts)                                                                // 224
});                                                                                                             // 225
                                                                                                                // 226
                                                                                                                // 227
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:theme-stewardsof/lib/custom_fields.js                                                     //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// Custom Post Field                                                                                            // 1
                                                                                                                // 2
Posts.addField({                                                                                                // 3
  fieldName: 'customPostField',                                                                                 // 4
  fieldSchema: {                                                                                                // 5
    type: String,                                                                                               // 6
    label: "Impact Tagline",                                                                                    // 7
    optional: true,                                                                                             // 8
    editableBy: ["member", "admin"]                                                                             // 9
  }                                                                                                             // 10
});                                                                                                             // 11
                                                                                                                // 12
// Posts.addField({                                                                                             // 13
//   fieldName: 'companyName',                                                                                  // 14
//   fieldSchema: {                                                                                             // 15
//     type: String,                                                                                            // 16
//     label: "Company Name",                                                                                   // 17
//     optional: true,                                                                                          // 18
//     editableBy: ["member", "admin"]                                                                          // 19
//   }                                                                                                          // 20
// });                                                                                                          // 21
// Custom Comment Field                                                                                         // 22
                                                                                                                // 23
// Comments.addField({                                                                                          // 24
//   fieldName: 'customCommentField',                                                                           // 25
//   fieldSchema: {                                                                                             // 26
//     type: String,                                                                                            // 27
//     optional: true,                                                                                          // 28
//     editableBy: ["member", "admin"]                                                                          // 29
//   }                                                                                                          // 30
// });                                                                                                          // 31
                                                                                                                // 32
// Custom User Field                                                                                            // 33
                                                                                                                // 34
Users.addField({                                                                                                // 35
  fieldName: 'customUserField',                                                                                 // 36
  fieldSchema: {                                                                                                // 37
    type: String,                                                                                               // 38
    label: "Role",                                                                                              // 39
    optional: true,                                                                                             // 40
    editableBy: ["member", "admin"]                                                                             // 41
  }                                                                                                             // 42
});                                                                                                             // 43
                                                                                                                // 44
// Custom Setting Field                                                                                         // 45
                                                                                                                // 46
// Settings.addField({                                                                                          // 47
//   fieldName: "customSettingsField",                                                                          // 48
//   fieldSchema: {                                                                                             // 49
//     type: String,                                                                                            // 50
//     optional: true,                                                                                          // 51
//     autoform: {                                                                                              // 52
//       group: "customGroup"                                                                                   // 53
//     }                                                                                                        // 54
//   }                                                                                                          // 55
// });                                                                                                          // 56
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:theme-stewardsof/lib/template_modules.js                                                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// add template module to the hero zone                                                                         // 1
Telescope.modules.add("hero", {                                                                                 // 2
  template: 'hello',                                                                                            // 3
  order: 1                                                                                                      // 4
});                                                                                                             // 5
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:theme-stewardsof/lib/callbacks.js                                                         //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
function alertThanks (post) {                                                                                   // 1
  $('#post-thanks').addClass('shown');                                                                          // 2
  return post;                                                                                                  // 3
}                                                                                                               // 4
Telescope.callbacks.add("postSubmitClient", alertThanks);                                                       // 5
                                                                                                                // 6
function inviteThanks (invited) {                                                                               // 7
  $('#invite-thanks').addClass('shown');                                                                        // 8
  return invited;                                                                                               // 9
}                                                                                                               // 10
                                                                                                                // 11
Telescope.callbacks.add("inviteSubmitClient", inviteThanks);                                                    // 12
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:theme-stewardsof/lib/server/templates/handlebars.custom_emailPostItem.js                  //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<div class=\"post-item\">\n<br >\n\n<span class=\"post-title\">\n  {{#if thumbnailUrl}}\n    <img class=\"post-thumbnail\" src=\"http:{{thumbnailUrl}}\"/>&nbsp;\n  {{/if}}\n\n  <a href=\"{{postLink}}\" target=\"_blank\">{{title}}</a>\n</span>\n\n<div class=\"post-meta\">\n  {{#if domain}}\n    <a class=\"post-domain\" href=\"\">{{domain}}</a>\n    | \n  {{/if}}\n  <span class=\"post-submitted\">Submitted by <a href=\"{{profileUrl}}\" class=\"comment-link\" target=\"_blank\">{{authorName}}</a></span>\n  <span class=\"post-date\">on {{date}}</span>\n  |\n  <a href=\"{{postPageLink}}\" class=\"comment-link\" target=\"_blank\">{{commentCount}} Comments</a>\n  |  😀 😰 🐮\n</div>\n\n\n{{#if body}}\n  <div class=\"post-body-excerpt\">\n    {{{htmlBody}}}\n    <a href=\"{{postPageLink}}\" class=\"comment-link\" target=\"_blank\">Read more</a>\n  </div>\n{{/if}}\n\n\n<br>\n</div>\n\n");Handlebars.templates["custom_emailPostItem"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "custom_emailPostItem"});};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/telescope:theme-stewardsof/Applications/MAMP/websites/stewardsof/packages/telescope-theme-stewardso //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _ = Package.underscore._,                                                                                   // 1
    package_name = "telescope:theme-stewardsof",                                                                // 2
    namespace = "telescope:theme-stewardsof";                                                                   // 3
                                                                                                                // 4
if (package_name != "project") {                                                                                // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                       // 6
}                                                                                                               // 7
// integrate the fallback language translations                                                                 // 8
translations = {};                                                                                              // 9
translations[namespace] = {"customViewLink":"Custom View Link","customAdminLink":"Custom Admin Link","customPostField":"My Custom Post Field","customCommentField":"My Custom Comment Field","customUserField":"My Custom User Field","customSettingsField":"My Custom Settings Field"};
TAPi18n._loadLangFileObject("en", translations);                                                                // 11
TAPi18n._registerServerTranslator("en", namespace);                                                             // 12
                                                                                                                // 13
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:theme-stewardsof'] = {};

})();

//# sourceMappingURL=telescope_theme-stewardsof.js.map
