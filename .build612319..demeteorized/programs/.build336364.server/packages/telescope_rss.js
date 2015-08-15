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
var RSS, getMeta, servePostRSS, serveCommentRSS, post;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:rss/lib/server/rss.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
RSS = Npm.require('rss');                                                                                              // 1
                                                                                                                       // 2
getMeta = function(url) {                                                                                              // 3
  var siteUrl = Settings.get('siteUrl', Meteor.absoluteUrl());                                                         // 4
  return {                                                                                                             // 5
    title: Settings.get('title'),                                                                                      // 6
    description: Settings.get('tagline'),                                                                              // 7
    feed_url: siteUrl+url,                                                                                             // 8
    site_url: siteUrl,                                                                                                 // 9
    image_url: siteUrl+'img/favicon.png'                                                                               // 10
  };                                                                                                                   // 11
};                                                                                                                     // 12
                                                                                                                       // 13
servePostRSS = function(view, url) {                                                                                   // 14
  var feed = new RSS(getMeta(url));                                                                                    // 15
                                                                                                                       // 16
  var params = Posts.getSubParams({view: view, limit: 20});                                                            // 17
  delete params['options']['sort']['sticky'];                                                                          // 18
                                                                                                                       // 19
  Posts.find(params.find, params.options).forEach(function(post) {                                                     // 20
                                                                                                                       // 21
    var description = !!post.body ? post.body+'</br></br>' : '';                                                       // 22
    var feedItem = {                                                                                                   // 23
      title: post.title,                                                                                               // 24
      description: description + '<a href="' + post.getPageUrl(true) + '">Discuss</a>',                                // 25
      author: post.author,                                                                                             // 26
      date: post.postedAt,                                                                                             // 27
      guid: post._id,                                                                                                  // 28
      url: Settings.get("outsideLinksPointTo", "link") === "link" ? Posts.getLink(post) : Posts.getPageUrl(post, true) // 29
    };                                                                                                                 // 30
                                                                                                                       // 31
    if (post.thumbnailUrl) {                                                                                           // 32
      var url = Telescope.utils.addHttp(post.thumbnailUrl);                                                            // 33
      feedItem.custom_elements = [{"imageUrl":url}, {"content": url}];                                                 // 34
    }                                                                                                                  // 35
                                                                                                                       // 36
    feed.item(feedItem);                                                                                               // 37
  });                                                                                                                  // 38
                                                                                                                       // 39
  return feed.xml();                                                                                                   // 40
};                                                                                                                     // 41
                                                                                                                       // 42
serveCommentRSS = function() {                                                                                         // 43
  var feed = new RSS(getMeta(Router.path('rss_comments')));                                                            // 44
                                                                                                                       // 45
  Comments.find({isDeleted: {$ne: true}}, {sort: {postedAt: -1}, limit: 20}).forEach(function(comment) {               // 46
    post = Posts.findOne(comment.postId);                                                                              // 47
    feed.item({                                                                                                        // 48
     title: 'Comment on '+post.title,                                                                                  // 49
     description: comment.body+'</br></br>'+'<a href="'+Telescope.utils.getPostCommentUrl(post._id, comment._id)+'">Discuss</a>',
     author: comment.author,                                                                                           // 51
     date: comment.postedAt,                                                                                           // 52
     url: comment.getPageUrl(true),                                                                                    // 53
     guid: comment._id                                                                                                 // 54
    });                                                                                                                // 55
  });                                                                                                                  // 56
                                                                                                                       // 57
  return feed.xml();                                                                                                   // 58
};                                                                                                                     // 59
                                                                                                                       // 60
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:rss/lib/server/routes.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
                                                                                                                       // 2
    // New Post RSS                                                                                                    // 3
                                                                                                                       // 4
    Router.route('/feed.xml', function () {                                                                            // 5
      this.response.write(servePostRSS('new', 'feed.xml'));                                                            // 6
      this.response.end();                                                                                             // 7
    }, {                                                                                                               // 8
      name: 'feed',                                                                                                    // 9
      where: 'server'                                                                                                  // 10
    });                                                                                                                // 11
                                                                                                                       // 12
    // New Post RSS                                                                                                    // 13
                                                                                                                       // 14
    Router.route('/rss/posts/new.xml', function () {                                                                   // 15
      this.response.write(servePostRSS('top', 'rss/posts/new.xml'));                                                   // 16
      this.response.end();                                                                                             // 17
    }, {                                                                                                               // 18
      name: 'rss_posts_new',                                                                                           // 19
      where: 'server'                                                                                                  // 20
    });                                                                                                                // 21
                                                                                                                       // 22
    // Top Post RSS                                                                                                    // 23
                                                                                                                       // 24
    Router.route('/rss/posts/top.xml', function () {                                                                   // 25
      this.response.write(servePostRSS('top', 'rss/posts/top.xml'));                                                   // 26
      this.response.end();                                                                                             // 27
    }, {                                                                                                               // 28
      name: 'rss_posts_top',                                                                                           // 29
      where: 'server'                                                                                                  // 30
    });                                                                                                                // 31
                                                                                                                       // 32
    // Best Post RSS                                                                                                   // 33
                                                                                                                       // 34
    Router.route('/rss/posts/best.xml', function () {                                                                  // 35
      this.response.write(servePostRSS('best', 'rss/posts/best.xml'));                                                 // 36
      this.response.end();                                                                                             // 37
    }, {                                                                                                               // 38
      name: 'rss_posts_best',                                                                                          // 39
      where: 'server'                                                                                                  // 40
    });                                                                                                                // 41
                                                                                                                       // 42
    // Comment RSS                                                                                                     // 43
                                                                                                                       // 44
    Router.route('/rss/comments.xml', function() {                                                                     // 45
      this.response.write(serveCommentRSS());                                                                          // 46
      this.response.end();                                                                                             // 47
    }, {                                                                                                               // 48
      name: 'rss_comments',                                                                                            // 49
      where: 'server'                                                                                                  // 50
    });                                                                                                                // 51
                                                                                                                       // 52
});                                                                                                                    // 53
                                                                                                                       // 54
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:rss'] = {};

})();

//# sourceMappingURL=telescope_rss.js.map
