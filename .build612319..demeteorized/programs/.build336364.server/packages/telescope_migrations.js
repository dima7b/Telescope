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
var Migrations, allMigrations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:migrations/lib/server/migrations.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// TODO: switch over to Tom's migration package.                                                                       // 1
                                                                                                                       // 2
// database migrations                                                                                                 // 3
// http://stackoverflow.com/questions/10365496/meteor-how-to-perform-database-migrations                               // 4
Migrations = new Meteor.Collection('migrations');                                                                      // 5
                                                                                                                       // 6
Meteor.startup(function () {                                                                                           // 7
  allMigrations = Object.keys(migrationsList);                                                                         // 8
  _.each(allMigrations, function(migrationName){                                                                       // 9
    runMigration(migrationName);                                                                                       // 10
  });                                                                                                                  // 11
});                                                                                                                    // 12
                                                                                                                       // 13
Meteor.methods({                                                                                                       // 14
  removeMigration: function (name) {                                                                                   // 15
    check(name, String);                                                                                               // 16
    if (Users.is.admin(Meteor.user())) {                                                                               // 17
      console.log('// removing migration: ' + name);                                                                   // 18
      Migrations.remove({name: name});                                                                                 // 19
    }                                                                                                                  // 20
  }                                                                                                                    // 21
});                                                                                                                    // 22
                                                                                                                       // 23
// wrapper function for all migrations                                                                                 // 24
var runMigration = function (migrationName) {                                                                          // 25
  var migration = Migrations.findOne({name: migrationName});                                                           // 26
                                                                                                                       // 27
  if (migration){                                                                                                      // 28
    if(typeof migration.finishedAt === 'undefined'){                                                                   // 29
      // if migration exists but hasn't finished, remove it and start fresh                                            // 30
      console.log('!!! Found incomplete migration "'+migrationName+'", removing and running again.');                  // 31
      Migrations.remove({name: migrationName});                                                                        // 32
    }else{                                                                                                             // 33
      // do nothing                                                                                                    // 34
      // console.log('Migration "'+migrationName+'" already exists, doing nothing.')                                   // 35
      return;                                                                                                          // 36
    }                                                                                                                  // 37
  }                                                                                                                    // 38
                                                                                                                       // 39
  console.log("//----------------------------------------------------------------------//");                           // 40
  console.log("//------------//    Starting "+migrationName+" Migration    //-----------//");                          // 41
  console.log("//----------------------------------------------------------------------//");                           // 42
  Migrations.insert({name: migrationName, startedAt: new Date(), completed: false});                                   // 43
                                                                                                                       // 44
  // execute migration function                                                                                        // 45
  var itemsAffected = migrationsList[migrationName]() || 0;                                                            // 46
                                                                                                                       // 47
  Migrations.update({name: migrationName}, {$set: {finishedAt: new Date(), completed: true, itemsAffected: itemsAffected}});
  console.log("//----------------------------------------------------------------------//");                           // 49
  console.log("//------------//     Ending "+migrationName+" Migration     //-----------//");                          // 50
  console.log("//----------------------------------------------------------------------//");                           // 51
};                                                                                                                     // 52
                                                                                                                       // 53
var migrationsList = {                                                                                                 // 54
  updatePostStatus: function () {                                                                                      // 55
    var i = 0;                                                                                                         // 56
    Posts.find({status: {$exists : false}}).forEach(function (post) {                                                  // 57
      i++;                                                                                                             // 58
      Posts.update(post._id, {$set: {status: 2}});                                                                     // 59
      console.log("---------------------");                                                                            // 60
      console.log("Post: "+post.title);                                                                                // 61
      console.log("Updating status to approved");                                                                      // 62
    });                                                                                                                // 63
    return i;                                                                                                          // 64
  },                                                                                                                   // 65
  updateCategories: function () {                                                                                      // 66
    if (typeof Categories === "undefined" || Categories === null) return;                                              // 67
    var i = 0;                                                                                                         // 68
    Categories.find({slug: {$exists : false}}).forEach(function (category) {                                           // 69
        i++;                                                                                                           // 70
        var slug = Telescope.utils.slugify(category.name);                                                             // 71
        Categories.update(category._id, {$set: {slug: slug}});                                                         // 72
        console.log("---------------------");                                                                          // 73
        console.log("Category: "+category.name);                                                                       // 74
        console.log("Updating category with new slug: "+slug);                                                         // 75
    });                                                                                                                // 76
    return i;                                                                                                          // 77
  },                                                                                                                   // 78
  updatePostCategories: function () {                                                                                  // 79
    if (typeof Categories === "undefined" || Categories === null) return;                                              // 80
    var i = 0;                                                                                                         // 81
    Posts.find().forEach(function (post) {                                                                             // 82
      i++;                                                                                                             // 83
      var oldCategories = post.categories;                                                                             // 84
      var newCategories = [];                                                                                          // 85
      var category = {};                                                                                               // 86
      var updating = false; // by default, assume we're not going to do anything                                       // 87
                                                                                                                       // 88
      // iterate over the post.categories array                                                                        // 89
      // if the post has no categories then nothing will happen                                                        // 90
      _.each(oldCategories, function(value){                                                                           // 91
        // make sure the categories are strings                                                                        // 92
        if((typeof value === "string") && (category = Categories.findOne({name: value}))){                             // 93
          // if value is a string, then look for the matching category object                                          // 94
          // and if it exists push it to the newCategories array                                                       // 95
          updating = true; // we're updating at least one category for this post                                       // 96
          newCategories.push(category);                                                                                // 97
        }else{                                                                                                         // 98
          // if category A) is already an object, or B) it's a string but a matching category object doesn't exist     // 99
          // just keep the current value                                                                               // 100
          newCategories.push(value);                                                                                   // 101
        }                                                                                                              // 102
      });                                                                                                              // 103
                                                                                                                       // 104
      if(updating){                                                                                                    // 105
        // update categories property on post                                                                          // 106
        Posts.update(post._id, {$set: {categories: newCategories}});                                                   // 107
      }                                                                                                                // 108
                                                                                                                       // 109
      // START CONSOLE LOGS                                                                                            // 110
      console.log("---------------------");                                                                            // 111
      console.log("Post: "+post.title);                                                                                // 112
      if(updating){                                                                                                    // 113
        console.log(oldCategories.length+" categories: "+oldCategories);                                               // 114
        console.log("Updating categories array to: ");                                                                 // 115
        console.log(newCategories);                                                                                    // 116
      }else{                                                                                                           // 117
        console.log("No updates");                                                                                     // 118
      }                                                                                                                // 119
      // END CONSOLE LOGS                                                                                              // 120
    });                                                                                                                // 121
    return i;                                                                                                          // 122
  },                                                                                                                   // 123
  updateUserProfiles: function () {                                                                                    // 124
    var i = 0;                                                                                                         // 125
    var allUsers = Meteor.users.find();                                                                                // 126
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 127
                                                                                                                       // 128
    allUsers.forEach(function(user){                                                                                   // 129
      i++;                                                                                                             // 130
      console.log('> Updating user '+user._id+' ('+user.username+')');                                                 // 131
                                                                                                                       // 132
      var properties = {};                                                                                             // 133
      properties.telescope = {};                                                                                       // 134
      // update user slug                                                                                              // 135
      if(Users.getUserName(user))                                                                                      // 136
        properties.slug = Telescope.utils.slugify(Users.getUserName(user));                                            // 137
                                                                                                                       // 138
      // update user isAdmin flag                                                                                      // 139
      if(typeof user.isAdmin === 'undefined')                                                                          // 140
        properties.isAdmin = false;                                                                                    // 141
                                                                                                                       // 142
      // update postCount                                                                                              // 143
      var postsByUser = Posts.find({userId: user._id});                                                                // 144
      properties.telescope.postCount = postsByUser.count();                                                            // 145
                                                                                                                       // 146
      // update commentCount                                                                                           // 147
      var commentsByUser = Comments.find({userId: user._id});                                                          // 148
      properties.telescope.commentCount = commentsByUser.count();                                                      // 149
                                                                                                                       // 150
      Meteor.users.update(user._id, {$set:properties});                                                                // 151
                                                                                                                       // 152
    });                                                                                                                // 153
    return i;                                                                                                          // 154
  },                                                                                                                   // 155
  resetUpvotesDownvotes: function () {                                                                                 // 156
    var i = 0;                                                                                                         // 157
    Posts.find().forEach(function (post) {                                                                             // 158
      i++;                                                                                                             // 159
      var upvotes = 0,                                                                                                 // 160
          downvotes = 0;                                                                                               // 161
      console.log("Post: "+post.title);                                                                                // 162
      if(post.upvoters){                                                                                               // 163
        upvotes = post.upvoters.length;                                                                                // 164
        console.log("Found "+upvotes+" upvotes.");                                                                     // 165
      }                                                                                                                // 166
      if(post.downvoters){                                                                                             // 167
        downvotes = post.downvoters.length;                                                                            // 168
        console.log("Found "+downvotes+" downvotes.");                                                                 // 169
      }                                                                                                                // 170
      Posts.update(post._id, {$set: {upvotes: upvotes, downvotes: downvotes}});                                        // 171
      console.log("---------------------");                                                                            // 172
    });                                                                                                                // 173
    return i;                                                                                                          // 174
  },                                                                                                                   // 175
  resetCommentsUpvotesDownvotes: function () {                                                                         // 176
    var i = 0;                                                                                                         // 177
    Comments.find().forEach(function (comment) {                                                                       // 178
      i++;                                                                                                             // 179
      var upvotes = 0,                                                                                                 // 180
          downvotes = 0;                                                                                               // 181
      console.log("Comment: "+comment._id);                                                                            // 182
      if(comment.upvoters){                                                                                            // 183
        upvotes = comment.upvoters.length;                                                                             // 184
        console.log("Found "+upvotes+" upvotes.");                                                                     // 185
      }                                                                                                                // 186
      if(comment.downvoters){                                                                                          // 187
        downvotes = comment.downvoters.length;                                                                         // 188
        console.log("Found "+downvotes+" downvotes.");                                                                 // 189
      }                                                                                                                // 190
      Comments.update(comment._id, {$set: {upvotes: upvotes, downvotes: downvotes}});                                  // 191
      console.log("---------------------");                                                                            // 192
    });                                                                                                                // 193
    return i;                                                                                                          // 194
  },                                                                                                                   // 195
  headlineToTitle: function () {                                                                                       // 196
    var i = 0;                                                                                                         // 197
    Posts.find({title: {$exists : false}}).forEach(function (post) {                                                   // 198
      i++;                                                                                                             // 199
      console.log("Post: "+post.headline+" "+post.title);                                                              // 200
      Posts.update(post._id, { $rename: { 'headline': 'title'}}, {multi: true, validate: false});                      // 201
      console.log("---------------------");                                                                            // 202
    });                                                                                                                // 203
    return i;                                                                                                          // 204
  },                                                                                                                   // 205
  commentsSubmittedToCreatedAt: function () {                                                                          // 206
    var i = 0;                                                                                                         // 207
    Comments.find({createdAt: {$exists: false}}).forEach(function (comment) {                                          // 208
      i++;                                                                                                             // 209
      console.log("Comment: "+comment._id);                                                                            // 210
      Comments.update(comment._id, { $rename: { 'submitted': 'createdAt'}}, {multi: true, validate: false});           // 211
      console.log("---------------------");                                                                            // 212
    });                                                                                                                // 213
    return i;                                                                                                          // 214
  },                                                                                                                   // 215
  commentsPostToPostId: function () {                                                                                  // 216
    var i = 0;                                                                                                         // 217
    Comments.find({postId: {$exists : false}}).forEach(function (comment) {                                            // 218
      i++;                                                                                                             // 219
      console.log("Comment: "+comment._id);                                                                            // 220
      Comments.update(comment._id, { $rename: { 'post': 'postId'}}, {multi: true, validate: false});                   // 221
      console.log("---------------------");                                                                            // 222
    });                                                                                                                // 223
    return i;                                                                                                          // 224
  },                                                                                                                   // 225
  createdAtSubmittedToDate: function () {                                                                              // 226
    var i = 0;                                                                                                         // 227
    Posts.find().forEach(function (post) {                                                                             // 228
      if(typeof post.submitted === "number" || typeof post.createdAt === "number"){                                    // 229
        i++;                                                                                                           // 230
        console.log("Posts: "+post.title);                                                                             // 231
        var createdAt = new Date(post.createdAt);                                                                      // 232
        var submitted = new Date(post.submitted);                                                                      // 233
        console.log(createdAt);                                                                                        // 234
        Posts.update(post._id, { $set: { 'createdAt': createdAt, submitted: submitted}}, {multi: true, validate: false});
        console.log("---------------------");                                                                          // 236
      }                                                                                                                // 237
    });                                                                                                                // 238
    return i;                                                                                                          // 239
  },                                                                                                                   // 240
  commentsCreatedAtToDate: function () {                                                                               // 241
    var i = 0;                                                                                                         // 242
    Comments.find().forEach(function (comment) {                                                                       // 243
      if(typeof comment.createdAt === "number"){                                                                       // 244
        i++;                                                                                                           // 245
        console.log("Comment: "+comment._id);                                                                          // 246
        var createdAt = new Date(comment.createdAt);                                                                   // 247
        console.log(createdAt);                                                                                        // 248
        Comments.update(comment._id, { $set: { 'createdAt': createdAt}}, {multi: true, validate: false});              // 249
        console.log("---------------------");                                                                          // 250
      }                                                                                                                // 251
    });                                                                                                                // 252
    return i;                                                                                                          // 253
  },                                                                                                                   // 254
  submittedToPostedAt: function () {                                                                                   // 255
    var i = 0;                                                                                                         // 256
    Posts.find({postedAt: {$exists : false}}).forEach(function (post) {                                                // 257
      i++;                                                                                                             // 258
      console.log("Post: "+post._id);                                                                                  // 259
      Posts.update(post._id, { $rename: { 'submitted': 'postedAt'}}, {multi: true, validate: false});                  // 260
      console.log("---------------------");                                                                            // 261
    });                                                                                                                // 262
    return i;                                                                                                          // 263
  },                                                                                                                   // 264
  addPostedAtToComments: function () {                                                                                 // 265
    var i = 0;                                                                                                         // 266
    Comments.find({postedAt: {$exists : false}}).forEach(function (comment) {                                          // 267
      i++;                                                                                                             // 268
      console.log("Comment: "+comment._id);                                                                            // 269
      Comments.update(comment._id, { $set: { 'postedAt': comment.createdAt}}, {multi: true, validate: false});         // 270
      console.log("---------------------");                                                                            // 271
    });                                                                                                                // 272
    return i;                                                                                                          // 273
  },                                                                                                                   // 274
  parentToParentCommentId: function () {                                                                               // 275
    var i = 0;                                                                                                         // 276
    Comments.find({parent: {$exists: true}, parentCommentId: {$exists : false}}).forEach(function (comment) {          // 277
      i++;                                                                                                             // 278
      console.log("Comment: "+comment._id);                                                                            // 279
      Comments.update(comment._id, { $set: { 'parentCommentId': comment.parent}}, {multi: true, validate: false});     // 280
      console.log("---------------------");                                                                            // 281
    });                                                                                                                // 282
    return i;                                                                                                          // 283
  },                                                                                                                   // 284
  addLastCommentedAt: function () {                                                                                    // 285
    var i = 0;                                                                                                         // 286
    Posts.find({$and: [                                                                                                // 287
      {$or: [{comments: {$gt: 0}}, {commentCount: {$gt: 0}}]},                                                         // 288
      {lastCommentedAt: {$exists : false}}                                                                             // 289
    ]}).forEach(function (post) {                                                                                      // 290
      i++;                                                                                                             // 291
      console.log("Post: "+post._id);                                                                                  // 292
      var postComments = Comments.find({$or: [{postId: post._id}, {post: post._id}]}, {sort: {postedAt: -1}}).fetch(); // 293
      var lastComment;                                                                                                 // 294
      if (_.isEmpty(postComments)) {                                                                                   // 295
        console.log('postComments from post '+post._id+' is empty. Skipping.');                                        // 296
        return;                                                                                                        // 297
      }                                                                                                                // 298
      lastComment = postComments[0];                                                                                   // 299
      Posts.update(post._id, { $set: { lastCommentedAt: lastComment.postedAt}}, {multi: false, validate: false});      // 300
      console.log("---------------------");                                                                            // 301
    });                                                                                                                // 302
    return i;                                                                                                          // 303
  },                                                                                                                   // 304
  commentsToCommentCount: function () {                                                                                // 305
    var i = 0;                                                                                                         // 306
    Posts.find({comments: {$exists : true}, commentCount: {$exists : false}}).forEach(function (post) {                // 307
      i++;                                                                                                             // 308
      console.log("Post: "+post._id);                                                                                  // 309
      Posts.update(post._id, { $set: { 'commentCount': post.comments}, $unset: { 'comments': ''}}, {multi: true, validate: false});
      console.log("---------------------");                                                                            // 311
    });                                                                                                                // 312
    return i;                                                                                                          // 313
  },                                                                                                                   // 314
  addCommentersToPosts: function () {                                                                                  // 315
    var i = 0;                                                                                                         // 316
    Comments.find().forEach(function (comment) {                                                                       // 317
      i++;                                                                                                             // 318
      console.log("Comment: "+comment._id);                                                                            // 319
      console.log("Post: "+comment.postId);                                                                            // 320
      Posts.update(comment.postId, { $addToSet: { 'commenters': comment.userId}}, {multi: true, validate: false});     // 321
      console.log("---------------------");                                                                            // 322
    });                                                                                                                // 323
    return i;                                                                                                          // 324
  },                                                                                                                   // 325
  moveVotesFromProfile: function () {                                                                                  // 326
    var i = 0;                                                                                                         // 327
    Meteor.users.find().forEach(function (user) {                                                                      // 328
      i++;                                                                                                             // 329
      console.log("User: "+user._id);                                                                                  // 330
      Meteor.users.update(user._id, {                                                                                  // 331
        $rename: {                                                                                                     // 332
          'profile.upvotedPosts': 'telescope.upvotedPosts',                                                            // 333
          'profile.downvotedPosts': 'telescope.downvotedPosts',                                                        // 334
          'profile.upvotedComments': 'telescope.upvotedComments',                                                      // 335
          'profile.downvotedComments': 'telescope.downvotedComments'                                                   // 336
        }                                                                                                              // 337
      }, {multi: true, validate: false});                                                                              // 338
      console.log("---------------------");                                                                            // 339
    });                                                                                                                // 340
    return i;                                                                                                          // 341
  },                                                                                                                   // 342
  addHTMLBody: function () {                                                                                           // 343
    var i = 0;                                                                                                         // 344
    Posts.find({body: {$exists : true}}).forEach(function (post) {                                                     // 345
      i++;                                                                                                             // 346
      var htmlBody = Telescope.utils.sanitize(marked(post.body));                                                      // 347
      console.log("Post: "+post._id);                                                                                  // 348
      Posts.update(post._id, { $set: { 'htmlBody': htmlBody}}, {multi: true, validate: false});                        // 349
      console.log("---------------------");                                                                            // 350
    });                                                                                                                // 351
    return i;                                                                                                          // 352
  },                                                                                                                   // 353
  addHTMLComment: function () {                                                                                        // 354
    var i = 0;                                                                                                         // 355
    Comments.find({body: {$exists : true}}).forEach(function (comment) {                                               // 356
      i++;                                                                                                             // 357
      var htmlBody = Telescope.utils.sanitize(marked(comment.body));                                                   // 358
      console.log("Comment: "+comment._id);                                                                            // 359
      Comments.update(comment._id, { $set: { 'htmlBody': htmlBody}}, {multi: true, validate: false});                  // 360
      console.log("---------------------");                                                                            // 361
    });                                                                                                                // 362
    return i;                                                                                                          // 363
  },                                                                                                                   // 364
  clicksToClickCount: function () {                                                                                    // 365
    var i = 0;                                                                                                         // 366
    Posts.find({"clicks": {$exists: true}, "clickCount": {$exists : false}}).forEach(function (post) {                 // 367
      i++;                                                                                                             // 368
      console.log("Post: " + post._id);                                                                                // 369
      Posts.update(post._id, { $set: { 'clickCount': post.clicks}, $unset: { 'clicks': ''}}, {multi: true, validate: false});
      console.log("---------------------");                                                                            // 371
    });                                                                                                                // 372
    return i;                                                                                                          // 373
  },                                                                                                                   // 374
  commentsCountToCommentCount: function () {                                                                           // 375
    var i = 0;                                                                                                         // 376
    Posts.find({"commentCount": {$exists : false}}).forEach(function (post) {                                          // 377
      i++;                                                                                                             // 378
      console.log("Post: " + post._id);                                                                                // 379
      Posts.update({_id: post._id}, { $set: { 'commentCount': post.commentsCount}, $unset: {'commentsCount': ""}}, {multi: true, validate: false});
      console.log("---------------------");                                                                            // 381
    });                                                                                                                // 382
    return i;                                                                                                          // 383
  },                                                                                                                   // 384
  userDataCommentsCountToCommentCount: function(){                                                                     // 385
    var i = 0;                                                                                                         // 386
    Meteor.users.find({'commentCount': {$exists: false}}).forEach(function(user){                                      // 387
      i++;                                                                                                             // 388
      var commentCount = Comments.find({userId: user._id}).count();                                                    // 389
      console.log("User: " + user._id);                                                                                // 390
      Meteor.users.update(user._id, {$set: { telescope : {'commentCount': commentCount}}});                            // 391
      console.log("---------------------");                                                                            // 392
    });                                                                                                                // 393
    return i;                                                                                                          // 394
   },                                                                                                                  // 395
  clicksToClickCountForRealThisTime: function () { // since both fields might be co-existing, add to clickCount instead of overwriting it
    var i = 0;                                                                                                         // 397
    Posts.find({'clicks': {$exists: true}}).forEach(function (post) {                                                  // 398
      i++;                                                                                                             // 399
      console.log("Post: " + post._id);                                                                                // 400
      Posts.update(post._id, { $inc: { 'clickCount': post.clicks}, $unset: {'clicks': ""}}, {multi: true, validate: false});
      console.log("---------------------");                                                                            // 402
    });                                                                                                                // 403
    return i;                                                                                                          // 404
  },                                                                                                                   // 405
  normalizeCategories: function () {                                                                                   // 406
    var i = 0;                                                                                                         // 407
    Posts.find({'categories': {$exists: true}}).forEach(function (post) {                                              // 408
      i++;                                                                                                             // 409
      console.log("Post: " + post._id);                                                                                // 410
      var justCategoryIds = post.categories.map(function (category){                                                   // 411
        return category._id;                                                                                           // 412
      });                                                                                                              // 413
      Posts.update(post._id, {$set: {categories: justCategoryIds, oldCategories: post.categories}}, {multi: true, validate: false});
      console.log("---------------------");                                                                            // 415
    });                                                                                                                // 416
    return i;                                                                                                          // 417
  },                                                                                                                   // 418
  cleanUpStickyProperty: function () {                                                                                 // 419
    var i = 0;                                                                                                         // 420
    Posts.find({'sticky': {$exists: false}}).forEach(function (post) {                                                 // 421
      i++;                                                                                                             // 422
      console.log("Post: " + post._id);                                                                                // 423
      Posts.update(post._id, {$set: {sticky: false}}, {multi: true, validate: false});                                 // 424
      console.log("---------------------");                                                                            // 425
    });                                                                                                                // 426
    return i;                                                                                                          // 427
  },                                                                                                                   // 428
  show0112ReleaseNotes: function () {                                                                                  // 429
    var i = 0;                                                                                                         // 430
    // if this is the 0.11.2 update, the first run event will not exist yet.                                           // 431
    // if that's the case, make sure to still show release notes                                                       // 432
    if (!Events.findOne({name: 'firstRun'})) {                                                                         // 433
      Releases.update({number:'0.11.2'}, {$set: {read:false}});                                                        // 434
    }                                                                                                                  // 435
    return i;                                                                                                          // 436
  },                                                                                                                   // 437
  removeThumbnailHTTP: function () {                                                                                   // 438
    var i = 0;                                                                                                         // 439
    Posts.find({thumbnailUrl: {$exists : true}}).forEach(function (post) {                                             // 440
      i++;                                                                                                             // 441
      var newThumbnailUrl = post.thumbnailUrl.replace("http:", "");                                                    // 442
      console.log("Post: "+post._id);                                                                                  // 443
      Posts.update(post._id, { $set: { 'thumbnailUrl': newThumbnailUrl}}, {multi: true, validate: false});             // 444
      console.log("---------------------");                                                                            // 445
    });                                                                                                                // 446
    return i;                                                                                                          // 447
  },                                                                                                                   // 448
  updateUserNames: function () {                                                                                       // 449
    var i = 0;                                                                                                         // 450
    var allUsers = Meteor.users.find({username: {$exists: true}, profile: {$exists: true}, 'profile.isDummy': {$ne: true}});
                                                                                                                       // 452
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 453
                                                                                                                       // 454
    allUsers.forEach(function(user){                                                                                   // 455
      i++;                                                                                                             // 456
                                                                                                                       // 457
      // Perform the same transforms done by useraccounts with `lowercaseUsernames` set to `true`                      // 458
      var oldUsername = user.username;                                                                                 // 459
      var username = user.username;                                                                                    // 460
      username = username.trim().replace(/\s+/gm, ' ');                                                                // 461
      user.profile.username = user.profile.name || username;                                                           // 462
      delete user.profile.name;                                                                                        // 463
      username = username.toLowerCase().replace(/\s+/gm, '');                                                          // 464
      user.username = username;                                                                                        // 465
                                                                                                                       // 466
      if (user.emails && user.emails.length > 0) {                                                                     // 467
        _.each(user.emails, function(email){                                                                           // 468
          email.address = email.address.toLowerCase().replace(/\s+/gm, '');                                            // 469
        });                                                                                                            // 470
      }                                                                                                                // 471
                                                                                                                       // 472
      console.log('> Updating user '+user._id+' ('+oldUsername+' -> ' + user.username + ')');                          // 473
                                                                                                                       // 474
      try {                                                                                                            // 475
        Meteor.users.update(user._id, {                                                                                // 476
          $set: {                                                                                                      // 477
            emails: user.emails,                                                                                       // 478
            profile: user.profile,                                                                                     // 479
            username: user.username,                                                                                   // 480
          },                                                                                                           // 481
        });                                                                                                            // 482
      }                                                                                                                // 483
      catch (err) {                                                                                                    // 484
        console.warn('> Unable to convert username ' + user.username + ' to lowercase!');                              // 485
        console.warn('> Please try to fix it by hand!! :(');                                                           // 486
      }                                                                                                                // 487
    });                                                                                                                // 488
    return i;                                                                                                          // 489
  },                                                                                                                   // 490
  changeColorNames: function () {                                                                                      // 491
    var i = 0;                                                                                                         // 492
    var settings = Settings.findOne();                                                                                 // 493
    var set = {};                                                                                                      // 494
                                                                                                                       // 495
    if (!!settings) {                                                                                                  // 496
                                                                                                                       // 497
      if (!!settings.buttonColor)                                                                                      // 498
        set.accentColor = settings.buttonColor;                                                                        // 499
                                                                                                                       // 500
      if (!!settings.buttonTextColor)                                                                                  // 501
        set.accentContrastColor = settings.buttonTextColor;                                                            // 502
                                                                                                                       // 503
      if (!!settings.buttonColor)                                                                                      // 504
        set.secondaryColor = settings.headerColor;                                                                     // 505
                                                                                                                       // 506
      if (!!settings.buttonColor)                                                                                      // 507
        set.secondaryContrastColor = settings.headerTextColor;                                                         // 508
                                                                                                                       // 509
      if (!_.isEmpty(set)) {                                                                                           // 510
        Settings.update(settings._id, {$set: set}, {validate: false});                                                 // 511
      }                                                                                                                // 512
                                                                                                                       // 513
    }                                                                                                                  // 514
    return i;                                                                                                          // 515
  },                                                                                                                   // 516
  migrateUserProfiles: function () {                                                                                   // 517
    var i = 0;                                                                                                         // 518
    var allUsers = Meteor.users.find({telescope: {$exists: false}});                                                   // 519
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 520
                                                                                                                       // 521
    allUsers.forEach(function(user){                                                                                   // 522
      i++;                                                                                                             // 523
                                                                                                                       // 524
      console.log('> Updating user '+user._id+' (' + user.username + ')');                                             // 525
                                                                                                                       // 526
      var telescopeUserData = {};                                                                                      // 527
                                                                                                                       // 528
      // loop over user data schema                                                                                    // 529
      _.each(Telescope.schemas.userData._schema, function (property, key) {                                            // 530
                                                                                                                       // 531
        if (!!user[key]) { // look for property on root of user object                                                 // 532
          telescopeUserData[key] = user[key];                                                                          // 533
        } else if (user.votes && !!user.votes[key]) { // look for it in user.votes object                              // 534
          telescopeUserData[key] = user.votes[key];                                                                    // 535
        } else if (user.profile && user.profile[key]) { // look for it in user.profile object                          // 536
          telescopeUserData[key] = user.profile[key];                                                                  // 537
        }                                                                                                              // 538
                                                                                                                       // 539
      });                                                                                                              // 540
                                                                                                                       // 541
      // console.log(telescopeUserData);                                                                               // 542
                                                                                                                       // 543
      try {                                                                                                            // 544
        Meteor.users.update(user._id, {                                                                                // 545
          $set: {                                                                                                      // 546
            telescope: telescopeUserData                                                                               // 547
          }                                                                                                            // 548
        });                                                                                                            // 549
      } catch (err) {                                                                                                  // 550
        console.log(err);                                                                                              // 551
        console.warn('> Unable to migrate profile for user ' + user.username);                                         // 552
      }                                                                                                                // 553
    });                                                                                                                // 554
    return i;                                                                                                          // 555
  },                                                                                                                   // 556
  migrateEmailHash: function () {                                                                                      // 557
    var i = 0;                                                                                                         // 558
    var allUsers = Meteor.users.find({$and: [{"email_hash": {$exists: true}}, {"telescope.emailHash": {$exists: false}}]});
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 560
                                                                                                                       // 561
    allUsers.forEach(function(user){                                                                                   // 562
      i++;                                                                                                             // 563
                                                                                                                       // 564
      console.log('> Updating user '+user._id+' (' + user.username + ')');                                             // 565
                                                                                                                       // 566
      var emailHash = user.email_hash;                                                                                 // 567
      if (!!emailHash) {                                                                                               // 568
        Meteor.users.update(user._id, {$set: {"telescope.emailHash": emailHash}});                                     // 569
      }                                                                                                                // 570
    });                                                                                                                // 571
    return i;                                                                                                          // 572
  },                                                                                                                   // 573
  // addTopLevelCommentIdToComments: function() {                                                                      // 574
  //   var i = 0;                                                                                                      // 575
                                                                                                                       // 576
  //   // find all root comments and set topLevelCommentId on their root children                                      // 577
  //   Comments.find({parentCommentId: {$exists : false}}).forEach(function (comment) {                                // 578
                                                                                                                       // 579
  //     // topLevelCommentId is the root comment._id                                                                  // 580
  //     var topLevelCommentId = comment._id;                                                                          // 581
  //     console.log("Root Comment found: " + topLevelCommentId);                                                      // 582
                                                                                                                       // 583
  //     // find childComments that have this root comment as parentCommentId                                          // 584
  //     Comments.find({parentCommentId: comment._id}).forEach(function (childComment) {                               // 585
  //       i++;                                                                                                        // 586
  //       updateParentAndChild(topLevelCommentId, childComment._id);                                                  // 587
  //     });                                                                                                           // 588
                                                                                                                       // 589
  //   });                                                                                                             // 590
                                                                                                                       // 591
  //   function updateParentAndChild(topLevelCommentId, parentId) {                                                    // 592
                                                                                                                       // 593
  //     i++;                                                                                                          // 594
  //     console.log("Parent Comment: " + parentId, " top level comment " + topLevelCommentId);                        // 595
                                                                                                                       // 596
  //     Comments.update(parentId, {$set: {'topLevelCommentId': topLevelCommentId}}, {multi: false, validate: false}); // 597
                                                                                                                       // 598
  //     var childComments = Comments.find({topLevelCommentId: {$exists : false}, parentCommentId: parentId});         // 599
                                                                                                                       // 600
  //     console.log('> Found '+childComments.count()+' child comments.\n');                                           // 601
                                                                                                                       // 602
  //     childComments.forEach(function(childComment){                                                                 // 603
  //       i++;                                                                                                        // 604
                                                                                                                       // 605
  //       // find all nested childComments and set topLevelCommentId                                                  // 606
  //       console.log("Child Comment: " + childComment._id, " top level comment " + topLevelCommentId);               // 607
                                                                                                                       // 608
  //       // set nested childComment to use parent's topLevelCommentId                                                // 609
  //       Comments.update(childComment._id, {$set: {'topLevelCommentId': topLevelCommentId}}, {multi: false, validate: false});
  //       updateParentAndChild(topLevelCommentId, childComment._id, true);                                            // 611
  //     });                                                                                                           // 612
                                                                                                                       // 613
  //   }                                                                                                               // 614
  //   console.log("---------------------");                                                                           // 615
  //   return i;                                                                                                       // 616
  // },                                                                                                                // 617
  migrateDisplayName: function () {                                                                                    // 618
    var i = 0;                                                                                                         // 619
    var displayName;                                                                                                   // 620
    var allUsers = Meteor.users.find({"telescope.displayName": {$exists: false}});                                     // 621
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 622
                                                                                                                       // 623
    allUsers.forEach(function(user){                                                                                   // 624
      i++;                                                                                                             // 625
                                                                                                                       // 626
      console.log('> Updating user '+user._id+' (' + user.username + ')');                                             // 627
      if (!!user.profile) {                                                                                            // 628
        displayName = user.profile.name || user.profile.username;                                                      // 629
      } else {                                                                                                         // 630
        displayName = user.username;                                                                                   // 631
      }                                                                                                                // 632
                                                                                                                       // 633
      console.log('name: ', displayName);                                                                              // 634
      if (!!displayName) {                                                                                             // 635
        Meteor.users.update(user._id, {$set: {"telescope.displayName": displayName}});                                 // 636
      } else {                                                                                                         // 637
        console.log("displayName not found :(");                                                                       // 638
      }                                                                                                                // 639
    });                                                                                                                // 640
    return i;                                                                                                          // 641
  },                                                                                                                   // 642
  migrateNewsletterSettings: function () {                                                                             // 643
    var i = 0;                                                                                                         // 644
    var allUsers = Meteor.users.find({                                                                                 // 645
      $or: [                                                                                                           // 646
        {"profile.showBanner": {$exists: true}},                                                                       // 647
        {"profile.subscribedToNewsletter": {$exists: true}}                                                            // 648
      ]                                                                                                                // 649
    });                                                                                                                // 650
    console.log('> Found '+allUsers.count()+' users.\n');                                                              // 651
                                                                                                                       // 652
    allUsers.forEach(function(user){                                                                                   // 653
      i++;                                                                                                             // 654
      var displayName;                                                                                                 // 655
                                                                                                                       // 656
      if (!!user.profile) {                                                                                            // 657
        displayName = user.profile.name || user.profile.username;                                                      // 658
      } else {                                                                                                         // 659
        displayName = user.username;                                                                                   // 660
      }                                                                                                                // 661
                                                                                                                       // 662
      console.log('> Updating user '+user._id+' (' + displayName + ')');                                               // 663
                                                                                                                       // 664
      if (user.profile) {                                                                                              // 665
                                                                                                                       // 666
        var set = {};                                                                                                  // 667
                                                                                                                       // 668
        var showBanner = user.profile.showBanner;                                                                      // 669
        if (typeof showBanner !== "undefined") {                                                                       // 670
          set["telescope.newsletter.showBanner"] = showBanner;                                                         // 671
        }                                                                                                              // 672
                                                                                                                       // 673
        var subscribeToNewsletter = user.profile.subscribedToNewsletter;                                               // 674
        if (typeof subscribeToNewsletter !== "undefined") {                                                            // 675
          set["telescope.newsletter.subscribeToNewsletter"] = subscribeToNewsletter;                                   // 676
        }                                                                                                              // 677
        console.log(set)                                                                                               // 678
        if (!_.isEmpty(set)) {                                                                                         // 679
          Meteor.users.update(user._id, {$set: set});                                                                  // 680
        }                                                                                                              // 681
                                                                                                                       // 682
      }                                                                                                                // 683
                                                                                                                       // 684
    });                                                                                                                // 685
    return i;                                                                                                          // 686
  },                                                                                                                   // 687
  addSlugsToPosts: function () {                                                                                       // 688
    var i = 0;                                                                                                         // 689
    Posts.find({slug: {$exists : false}}).forEach(function (post) {                                                    // 690
      i++;                                                                                                             // 691
      var slug = Telescope.utils.slugify(post.title);                                                                  // 692
      console.log("Post: "+post._id + " | "+slug);                                                                     // 693
      Posts.update(post._id, { $set: { 'slug': slug}});                                                                // 694
      console.log("---------------------");                                                                            // 695
    });                                                                                                                // 696
    return i;                                                                                                          // 697
  },                                                                                                                   // 698
  updateNewsletterFrequency: function () {                                                                             // 699
    var i = 0;                                                                                                         // 700
    Settings.find().forEach(function (setting) {                                                                       // 701
      if (!!setting.newsletterFrequency) {                                                                             // 702
        console.log("Migrating newsletter frequency… ("+setting.newsletterFrequency+")");                              // 703
        i++;                                                                                                           // 704
        var days;                                                                                                      // 705
        switch (setting.newsletterFrequency) {                                                                         // 706
          case 1:                                                                                                      // 707
            days = [1,2,3,4,5,6,7];                                                                                    // 708
            break;                                                                                                     // 709
          case 2:                                                                                                      // 710
            days = [2,4,6];                                                                                            // 711
            break;                                                                                                     // 712
          case 3:                                                                                                      // 713
            days = [2,5];                                                                                              // 714
            break;                                                                                                     // 715
          default:                                                                                                     // 716
            days = [2];                                                                                                // 717
            break;                                                                                                     // 718
        }                                                                                                              // 719
        Settings.update(setting._id, { $set: { newsletterFrequency: days } });                                         // 720
      }                                                                                                                // 721
    });                                                                                                                // 722
    return i;                                                                                                          // 723
  }                                                                                                                    // 724
};                                                                                                                     // 725
                                                                                                                       // 726
// TODO: normalize categories?                                                                                         // 727
                                                                                                                       // 728
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:migrations'] = {
  Migrations: Migrations
};

})();

//# sourceMappingURL=telescope_migrations.js.map
