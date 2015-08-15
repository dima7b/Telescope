(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var moment = Package['momentjs:moment'].moment;
var SyncedCron = Package['percolatestudio:synced-cron'].SyncedCron;
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
var tinycolor = Package['aramk:tinycolor'].tinycolor;
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
var Feeds, fetchFeeds, translations;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:post-by-feed/lib/feeds.js                                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Feeds = new Mongo.Collection('feeds');                                                                           // 1
                                                                                                                 // 2
Feeds.schema = new SimpleSchema({                                                                                // 3
  url: {                                                                                                         // 4
    type: String,                                                                                                // 5
    regEx: SimpleSchema.RegEx.Url,                                                                               // 6
    editableBy: ["admin"]                                                                                        // 7
  },                                                                                                             // 8
  userId: {                                                                                                      // 9
    type: String,                                                                                                // 10
    label: 'feedUser',                                                                                           // 11
    editableBy: ["admin"],                                                                                       // 12
    autoform: {                                                                                                  // 13
      instructions: 'Posts will be assigned to this user.',                                                      // 14
      options: function () {                                                                                     // 15
        var users = Meteor.users.find().map(function (user) {                                                    // 16
          return {                                                                                               // 17
            value: user._id,                                                                                     // 18
            label: Users.getDisplayName(user)                                                                    // 19
          };                                                                                                     // 20
        });                                                                                                      // 21
        return users;                                                                                            // 22
      }                                                                                                          // 23
    }                                                                                                            // 24
  },                                                                                                             // 25
  categories: {                                                                                                  // 26
    type: [String],                                                                                              // 27
    label: 'categories',                                                                                         // 28
    optional: true,                                                                                              // 29
    editableBy: ["admin"],                                                                                       // 30
    autoform: {                                                                                                  // 31
      instructions: 'Posts will be assigned to this category.',                                                  // 32
      noselect: true,                                                                                            // 33
      editable: true,                                                                                            // 34
      options: function () {                                                                                     // 35
        var categories = Categories.find().map(function (category) {                                             // 36
          return {                                                                                               // 37
            value: category._id,                                                                                 // 38
            label: category.name                                                                                 // 39
          };                                                                                                     // 40
        });                                                                                                      // 41
        return categories;                                                                                       // 42
      }                                                                                                          // 43
    }                                                                                                            // 44
  }                                                                                                              // 45
});                                                                                                              // 46
                                                                                                                 // 47
                                                                                                                 // 48
Feeds.schema.internationalize();                                                                                 // 49
                                                                                                                 // 50
Feeds.attachSchema(Feeds.schema);                                                                                // 51
                                                                                                                 // 52
// used to keep track of which feed a post was imported from                                                     // 53
var feedIdProperty = {                                                                                           // 54
  fieldName: 'feedId',                                                                                           // 55
  fieldSchema: {                                                                                                 // 56
    type: String,                                                                                                // 57
    label: 'feedId',                                                                                             // 58
    optional: true,                                                                                              // 59
    autoform: {                                                                                                  // 60
      omit: true                                                                                                 // 61
    }                                                                                                            // 62
  }                                                                                                              // 63
};                                                                                                               // 64
Posts.addField(feedIdProperty);                                                                                  // 65
                                                                                                                 // 66
// the RSS ID of the post in its original feed                                                                   // 67
var feedItemIdProperty = {                                                                                       // 68
  fieldName: 'feedItemId',                                                                                       // 69
  fieldSchema: {                                                                                                 // 70
    type: String,                                                                                                // 71
    label: 'feedItemId',                                                                                         // 72
    optional: true,                                                                                              // 73
    autoform: {                                                                                                  // 74
      omit: true                                                                                                 // 75
    }                                                                                                            // 76
  }                                                                                                              // 77
};                                                                                                               // 78
Posts.addField(feedItemIdProperty);                                                                              // 79
                                                                                                                 // 80
Meteor.startup(function () {                                                                                     // 81
  Feeds.allow({                                                                                                  // 82
    insert: Users.is.adminById,                                                                                  // 83
    update: Users.is.adminById,                                                                                  // 84
    remove: Users.is.adminById                                                                                   // 85
  });                                                                                                            // 86
                                                                                                                 // 87
  Meteor.methods({                                                                                               // 88
    insertFeed: function(feedUrl){                                                                               // 89
      check(feedUrl, Feeds.schema);                                                                              // 90
                                                                                                                 // 91
      if (Feeds.findOne({url: feedUrl.url}))                                                                     // 92
        throw new Meteor.Error('already-exists', i18n.t('feed_already_exists'));                                 // 93
                                                                                                                 // 94
      if (!Meteor.user() || !Users.is.admin(Meteor.user()))                                                      // 95
        throw new Meteor.Error('login-required', i18n.t('you_need_to_login_and_be_an_admin_to_add_a_new_feed')); // 96
                                                                                                                 // 97
      return Feeds.insert(feedUrl);                                                                              // 98
    }                                                                                                            // 99
  });                                                                                                            // 100
});                                                                                                              // 101
                                                                                                                 // 102
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:post-by-feed/lib/server/fetch_feeds.js                                                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var toMarkdown = Npm.require('to-markdown').toMarkdown;                                                          // 1
var he = Npm.require('he');                                                                                      // 2
var FeedParser = Npm.require('feedparser');                                                                      // 3
var Readable = Npm.require('stream').Readable;                                                                   // 4
var iconv = Npm.require('iconv-lite');                                                                           // 5
                                                                                                                 // 6
var getFirstAdminUser = function() {                                                                             // 7
  return Meteor.users.findOne({isAdmin: true}, {sort: {createdAt: 1}});                                          // 8
};                                                                                                               // 9
                                                                                                                 // 10
var normalizeEncoding = function (contentBuffer) {                                                               // 11
  // got from https://github.com/szwacz/sputnik/                                                                 // 12
  var encoding;                                                                                                  // 13
  var content = contentBuffer.toString();                                                                        // 14
                                                                                                                 // 15
  var xmlDeclaration = content.match(/^<\?xml .*\?>/);                                                           // 16
  if (xmlDeclaration) {                                                                                          // 17
    var encodingDeclaration = xmlDeclaration[0].match(/encoding=("|').*?("|')/);                                 // 18
    if (encodingDeclaration) {                                                                                   // 19
      encoding = encodingDeclaration[0].substring(10, encodingDeclaration[0].length - 1);                        // 20
    }                                                                                                            // 21
  }                                                                                                              // 22
                                                                                                                 // 23
  if (encoding && encoding.toLowerCase() !== 'utf-8') {                                                          // 24
    try {                                                                                                        // 25
      content = iconv.decode(contentBuffer, encoding);                                                           // 26
    } catch (err) {                                                                                              // 27
      // detected encoding is not supported, leave it as it is                                                   // 28
    }                                                                                                            // 29
  }                                                                                                              // 30
                                                                                                                 // 31
  return content;                                                                                                // 32
};                                                                                                               // 33
                                                                                                                 // 34
var feedHandler = {                                                                                              // 35
  getStream: function(content) {                                                                                 // 36
    var stream = new Readable();                                                                                 // 37
    stream.push(content);                                                                                        // 38
    stream.push(null);                                                                                           // 39
                                                                                                                 // 40
    return stream;                                                                                               // 41
  },                                                                                                             // 42
                                                                                                                 // 43
  getItemCategories: function(item, feedCategories) {                                                            // 44
                                                                                                                 // 45
    var itemCategories = [];                                                                                     // 46
                                                                                                                 // 47
    // loop over RSS categories for the current item if it has any                                               // 48
    if (item.categories && item.categories.length > 0) {                                                         // 49
      item.categories.forEach(function(name) {                                                                   // 50
                                                                                                                 // 51
        // if the RSS category corresponds to a Telescope cateogry, add it                                       // 52
        var category = Categories.findOne({name: name}, {fields: {_id: 1}});                                     // 53
        if (category) {                                                                                          // 54
          itemCategories.push(category._id);                                                                     // 55
        }                                                                                                        // 56
                                                                                                                 // 57
      });                                                                                                        // 58
    }                                                                                                            // 59
                                                                                                                 // 60
    // add predefined feed categories if there are any and remove any duplicates                                 // 61
    if (!!feedCategories) {                                                                                      // 62
      itemCategories = _.uniq(itemCategories.concat(feedCategories));                                            // 63
    }                                                                                                            // 64
                                                                                                                 // 65
    return itemCategories;                                                                                       // 66
  },                                                                                                             // 67
                                                                                                                 // 68
  handle: function(contentBuffer, userId, feedCategories, feedId) {                                              // 69
    var content = normalizeEncoding(contentBuffer);                                                              // 70
    var stream = this.getStream(content),                                                                        // 71
    feedParser = new FeedParser(),                                                                               // 72
    newItemsCount = 0,                                                                                           // 73
    self = this;                                                                                                 // 74
                                                                                                                 // 75
    stream.pipe(feedParser);                                                                                     // 76
                                                                                                                 // 77
    feedParser.on('meta', Meteor.bindEnvironment(function(meta) {                                                // 78
      Telescope.log('// Parsing RSS feed: '+ meta.title);                                                        // 79
    }));                                                                                                         // 80
                                                                                                                 // 81
    feedParser.on('error', Meteor.bindEnvironment(function(error) {                                              // 82
      Telescope.log(error);                                                                                      // 83
    }));                                                                                                         // 84
                                                                                                                 // 85
    feedParser.on('readable', Meteor.bindEnvironment(function() {                                                // 86
      var s = this, item;                                                                                        // 87
                                                                                                                 // 88
      while (item = s.read()) {                                                                                  // 89
        // if item has no guid, use the URL to give it one                                                       // 90
        if (!item.guid) {                                                                                        // 91
          item.guid = item.link;                                                                                 // 92
        }                                                                                                        // 93
                                                                                                                 // 94
        // check if post already exists                                                                          // 95
        if (!!Posts.findOne({feedItemId: item.guid})) {                                                          // 96
          Telescope.log('// Feed item already imported');                                                        // 97
          continue;                                                                                              // 98
        }                                                                                                        // 99
                                                                                                                 // 100
        newItemsCount++;                                                                                         // 101
                                                                                                                 // 102
        var post = {                                                                                             // 103
          title: he.decode(item.title),                                                                          // 104
          url: item.link,                                                                                        // 105
          feedId: feedId,                                                                                        // 106
          feedItemId: item.guid,                                                                                 // 107
          userId: userId,                                                                                        // 108
          categories: self.getItemCategories(item, feedCategories)                                               // 109
        };                                                                                                       // 110
                                                                                                                 // 111
        if (item.description)                                                                                    // 112
          post.body = toMarkdown(he.decode(item.description));                                                   // 113
                                                                                                                 // 114
        // console.log(item)                                                                                     // 115
                                                                                                                 // 116
        // if RSS item link is a 301 or 302 redirect, follow the redirect                                        // 117
        var get = HTTP.get(item.link, {followRedirects: false});                                                 // 118
        if (!!get.statusCode && (get.statusCode === 301 || get.statusCode === 302) &&                            // 119
            !!get.headers && !!get.headers.location) {                                                           // 120
              post.url = get.headers.location;                                                                   // 121
            }                                                                                                    // 122
                                                                                                                 // 123
        // if RSS item has a date, use it                                                                        // 124
        if (item.pubdate)                                                                                        // 125
          post.postedAt = moment(item.pubdate).toDate();                                                         // 126
                                                                                                                 // 127
        try {                                                                                                    // 128
          Posts.submit(post);                                                                                    // 129
        } catch (error) {                                                                                        // 130
          // catch errors so they don't stop the loop                                                            // 131
          Telescope.log(error);                                                                                  // 132
        }                                                                                                        // 133
      }                                                                                                          // 134
                                                                                                                 // 135
      // Telescope.log('// Found ' + newItemsCount + ' new feed items');                                         // 136
    }, function() {                                                                                              // 137
      Telescope.log('Failed to bind environment');                                                               // 138
    }, feedParser));                                                                                             // 139
  }                                                                                                              // 140
};                                                                                                               // 141
                                                                                                                 // 142
fetchFeeds = function() {                                                                                        // 143
  var contentBuffer;                                                                                             // 144
                                                                                                                 // 145
  Feeds.find().forEach(function(feed) {                                                                          // 146
                                                                                                                 // 147
    // if feed doesn't specify a user, default to admin                                                          // 148
    var userId = !!feed.userId ? feed.userId : getFirstAdminUser()._id;                                          // 149
    var feedCategories = feed.categories;                                                                        // 150
    var feedId = feed._id;                                                                                       // 151
                                                                                                                 // 152
    try {                                                                                                        // 153
      contentBuffer = HTTP.get(feed.url, {responseType: 'buffer'}).content;                                      // 154
      feedHandler.handle(contentBuffer, userId, feedCategories, feedId);                                         // 155
    } catch (error) {                                                                                            // 156
      console.log(error);                                                                                        // 157
      return true; // just go to next feed URL                                                                   // 158
    }                                                                                                            // 159
  });                                                                                                            // 160
};                                                                                                               // 161
                                                                                                                 // 162
Meteor.methods({                                                                                                 // 163
  fetchFeeds: function () {                                                                                      // 164
    fetchFeeds();                                                                                                // 165
  },                                                                                                             // 166
  testEntities: function (text) {                                                                                // 167
    console.log(he.decode(text));                                                                                // 168
  },                                                                                                             // 169
  testToMarkdown: function (text) {                                                                              // 170
    console.log(toMarkdown(text));                                                                               // 171
  }                                                                                                              // 172
});                                                                                                              // 173
                                                                                                                 // 174
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:post-by-feed/lib/server/cron.js                                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
SyncedCron.options = {                                                                                           // 1
  log: false,                                                                                                    // 2
  collectionName: 'cronHistory',                                                                                 // 3
  utc: false,                                                                                                    // 4
  collectionTTL: 172800                                                                                          // 5
}                                                                                                                // 6
                                                                                                                 // 7
var addJob = function () {                                                                                       // 8
  SyncedCron.add({                                                                                               // 9
    name: 'Post by RSS feed',                                                                                    // 10
    schedule: function(parser) {                                                                                 // 11
      return parser.text('every 30 minutes');                                                                    // 12
    },                                                                                                           // 13
    job: function() {                                                                                            // 14
      if (Feeds.find().count()) {                                                                                // 15
        fetchFeeds();                                                                                            // 16
      }                                                                                                          // 17
    }                                                                                                            // 18
  });                                                                                                            // 19
}                                                                                                                // 20
                                                                                                                 // 21
Meteor.startup(function () {                                                                                     // 22
  addJob();                                                                                                      // 23
})                                                                                                               // 24
                                                                                                                 // 25
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:post-by-feed/lib/server/publications.js                                                    //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Meteor.publish('feeds', function() {                                                                             // 1
  if(Users.is.adminById(this.userId)){                                                                           // 2
    return Feeds.find();                                                                                         // 3
  }                                                                                                              // 4
  return [];                                                                                                     // 5
});                                                                                                              // 6
                                                                                                                 // 7
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/telescope:post-by-feed/Applications/MAMP/websites/stewardsof/packages/telescope-post-by-feed/i18n/en //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _ = Package.underscore._,                                                                                    // 1
    package_name = "project",                                                                                    // 2
    namespace = "project";                                                                                       // 3
                                                                                                                 // 4
if (package_name != "project") {                                                                                 // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                        // 6
}                                                                                                                // 7
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","cdn_path":null});  // 8
TAPi18n.languages_names["en"] = ["English","English"];                                                           // 9
// integrate the fallback language translations                                                                  // 10
translations = {};                                                                                               // 11
translations[namespace] = {"feed_already_exists":"A feed with the same URL already exists.","you_need_to_login_and_be_an_admin_to_add_a_new_feed":"You need to log in and be an admin to add a new feed.","import_new_posts_from_feeds":"Import new posts from feeds."};
TAPi18n._loadLangFileObject("en", translations);                                                                 // 13
TAPi18n._registerServerTranslator("en", namespace);                                                              // 14
                                                                                                                 // 15
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:post-by-feed'] = {
  Feeds: Feeds
};

})();

//# sourceMappingURL=telescope_post-by-feed.js.map
