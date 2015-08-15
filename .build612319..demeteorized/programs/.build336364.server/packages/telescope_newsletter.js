(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MailChimp = Package['miro:mailchimp'].MailChimp;
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
var resetNewsletterSchedule, __, Campaigns, defaultFrequency, defaultPosts, getCampaignPosts, buildCampaign, scheduleNextCampaign, scheduleCampaign, addToMailChimpList, Handlebars, translations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/package-i18n.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
TAPi18n.packages["telescope:newsletter"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"}; // 1
                                                                                                                       // 2
// define package's translation function (proxy to the i18next)                                                        // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                       // 4
                                                                                                                       // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/newsletter.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var campaignSchema = new SimpleSchema({                                                                                // 1
 _id: {                                                                                                                // 2
    type: String,                                                                                                      // 3
    optional: true                                                                                                     // 4
  },                                                                                                                   // 5
  createdAt: {                                                                                                         // 6
    type: Date,                                                                                                        // 7
    optional: true                                                                                                     // 8
  },                                                                                                                   // 9
  sentAt: {                                                                                                            // 10
    type: String,                                                                                                      // 11
    optional: true                                                                                                     // 12
  },                                                                                                                   // 13
  status: {                                                                                                            // 14
    type: String,                                                                                                      // 15
    optional: true                                                                                                     // 16
  },                                                                                                                   // 17
  posts: {                                                                                                             // 18
    type: [String],                                                                                                    // 19
    optional: true                                                                                                     // 20
  },                                                                                                                   // 21
  webHits: {                                                                                                           // 22
    type: Number,                                                                                                      // 23
    optional: true                                                                                                     // 24
  },                                                                                                                   // 25
});                                                                                                                    // 26
                                                                                                                       // 27
Campaigns = new Meteor.Collection("campaigns", {                                                                       // 28
  schema: campaignSchema                                                                                               // 29
});                                                                                                                    // 30
                                                                                                                       // 31
Posts.addField({                                                                                                       // 32
  fieldName: 'scheduledAt',                                                                                            // 33
  fieldSchema: {                                                                                                       // 34
    type: Date,                                                                                                        // 35
    optional: true,                                                                                                    // 36
    autoform: {                                                                                                        // 37
      omit: true                                                                                                       // 38
    }                                                                                                                  // 39
  }                                                                                                                    // 40
});                                                                                                                    // 41
                                                                                                                       // 42
Users.addField([                                                                                                       // 43
  {                                                                                                                    // 44
    fieldName: 'telescope.newsletter.showBanner',                                                                      // 45
    fieldSchema: {                                                                                                     // 46
      label: 'Show banner',                                                                                            // 47
      type: Boolean,                                                                                                   // 48
      optional: true,                                                                                                  // 49
      editableBy: ['admin', 'member'],                                                                                 // 50
      autoform: {                                                                                                      // 51
        omit: true                                                                                                     // 52
      }                                                                                                                // 53
    }                                                                                                                  // 54
  },                                                                                                                   // 55
  {                                                                                                                    // 56
    fieldName: 'telescope.newsletter.subscribeToNewsletter',                                                           // 57
    fieldSchema: {                                                                                                     // 58
      label: 'Subscribe to newsletter',                                                                                // 59
      type: Boolean,                                                                                                   // 60
      optional: true,                                                                                                  // 61
      editableBy: ['admin', 'member'],                                                                                 // 62
      autoform: {                                                                                                      // 63
        omit: true                                                                                                     // 64
      }                                                                                                                // 65
    }                                                                                                                  // 66
  }                                                                                                                    // 67
]);                                                                                                                    // 68
                                                                                                                       // 69
// Settings                                                                                                            // 70
                                                                                                                       // 71
Settings.addField([                                                                                                    // 72
  {                                                                                                                    // 73
    fieldName: 'enableNewsletter',                                                                                     // 74
    fieldSchema: {                                                                                                     // 75
      type: Boolean,                                                                                                   // 76
      optional: true,                                                                                                  // 77
      autoform: {                                                                                                      // 78
        group: 'newsletter',                                                                                           // 79
        instructions: 'Enable newsletter (requires restart).'                                                          // 80
      }                                                                                                                // 81
    }                                                                                                                  // 82
  },                                                                                                                   // 83
  {                                                                                                                    // 84
    fieldName: 'showBanner',                                                                                           // 85
    fieldSchema: {                                                                                                     // 86
      type: Boolean,                                                                                                   // 87
      optional: true,                                                                                                  // 88
      label: 'Newsletter banner',                                                                                      // 89
      autoform: {                                                                                                      // 90
        group: 'newsletter',                                                                                           // 91
        instructions: 'Show newsletter sign-up form on the front page.'                                                // 92
      }                                                                                                                // 93
    }                                                                                                                  // 94
  },                                                                                                                   // 95
  {                                                                                                                    // 96
    fieldName: "mailChimpAPIKey",                                                                                      // 97
    fieldSchema: {                                                                                                     // 98
      type: String,                                                                                                    // 99
      optional: true,                                                                                                  // 100
      private: true,                                                                                                   // 101
      autoform: {                                                                                                      // 102
        group: "newsletter",                                                                                           // 103
        class: "private-field"                                                                                         // 104
      }                                                                                                                // 105
    }                                                                                                                  // 106
  },                                                                                                                   // 107
  {                                                                                                                    // 108
    fieldName: 'mailChimpListId',                                                                                      // 109
    fieldSchema: {                                                                                                     // 110
      type: String,                                                                                                    // 111
      optional: true,                                                                                                  // 112
      private: true,                                                                                                   // 113
      autoform: {                                                                                                      // 114
        group: 'newsletter',                                                                                           // 115
        instructions: 'The ID of the list you want to send to.',                                                       // 116
        class: "private-field"                                                                                         // 117
      }                                                                                                                // 118
    }                                                                                                                  // 119
  },                                                                                                                   // 120
  {                                                                                                                    // 121
    fieldName: 'postsPerNewsletter',                                                                                   // 122
    fieldSchema: {                                                                                                     // 123
      type: Number,                                                                                                    // 124
      optional: true,                                                                                                  // 125
      autoform: {                                                                                                      // 126
        group: 'newsletter'                                                                                            // 127
      }                                                                                                                // 128
    }                                                                                                                  // 129
  },                                                                                                                   // 130
  {                                                                                                                    // 131
    fieldName: 'newsletterFrequency',                                                                                  // 132
    fieldSchema: {                                                                                                     // 133
      type: [Number],                                                                                                  // 134
      optional: true,                                                                                                  // 135
      autoform: {                                                                                                      // 136
        group: 'newsletter',                                                                                           // 137
        instructions: 'Defaults to once a week on Monday. Changes require restarting your app to take effect.',        // 138
        noselect: true,                                                                                                // 139
        options: [                                                                                                     // 140
          {                                                                                                            // 141
            value: 1,                                                                                                  // 142
            label: 'Sunday'                                                                                            // 143
          },                                                                                                           // 144
          {                                                                                                            // 145
            value: 2,                                                                                                  // 146
            label: 'Monday'                                                                                            // 147
          },                                                                                                           // 148
          {                                                                                                            // 149
            value: 3,                                                                                                  // 150
            label: 'Tuesday'                                                                                           // 151
          },                                                                                                           // 152
          {                                                                                                            // 153
            value: 4,                                                                                                  // 154
            label: 'Wednesday'                                                                                         // 155
          },                                                                                                           // 156
          {                                                                                                            // 157
            value: 5,                                                                                                  // 158
            label: 'Thursday'                                                                                          // 159
          },                                                                                                           // 160
          {                                                                                                            // 161
            value: 6,                                                                                                  // 162
            label: 'Friday'                                                                                            // 163
          },                                                                                                           // 164
          {                                                                                                            // 165
            value: 7,                                                                                                  // 166
            label: 'Saturday'                                                                                          // 167
          }                                                                                                            // 168
        ]                                                                                                              // 169
      }                                                                                                                // 170
    }                                                                                                                  // 171
  },                                                                                                                   // 172
  {                                                                                                                    // 173
    fieldName: 'newsletterTime',                                                                                       // 174
    fieldSchema: {                                                                                                     // 175
      type: String,                                                                                                    // 176
      optional: true,                                                                                                  // 177
      defaultValue: '00:00',                                                                                           // 178
      autoform: {                                                                                                      // 179
        group: 'newsletter',                                                                                           // 180
        instructions: 'Defaults to 00:00/12:00 AM. Time to send out newsletter if enabled.',                           // 181
        type: 'time'                                                                                                   // 182
      }                                                                                                                // 183
    }                                                                                                                  // 184
  },                                                                                                                   // 185
  {                                                                                                                    // 186
    fieldName: 'autoSubscribe',                                                                                        // 187
    fieldSchema: {                                                                                                     // 188
      type: Boolean,                                                                                                   // 189
      optional: true,                                                                                                  // 190
      autoform: {                                                                                                      // 191
        group: 'newsletter',                                                                                           // 192
        instructions: 'Automatically subscribe new users on sign-up.'                                                  // 193
      }                                                                                                                // 194
    }                                                                                                                  // 195
  }                                                                                                                    // 196
]);                                                                                                                    // 197
                                                                                                                       // 198
// create new "campaign" lens for all posts from the past X days that haven't been scheduled yet                       // 199
Posts.views.add("campaign", function (terms) {                                                                         // 200
  return {                                                                                                             // 201
    find: {                                                                                                            // 202
      scheduledAt: {$exists: false},                                                                                   // 203
      postedAt: {                                                                                                      // 204
        $gte: terms.after                                                                                              // 205
      }                                                                                                                // 206
    },                                                                                                                 // 207
    options: {sort: {baseScore: -1}}                                                                                   // 208
  };                                                                                                                   // 209
});                                                                                                                    // 210
                                                                                                                       // 211
Telescope.modules.add("hero", {                                                                                        // 212
  template: 'newsletter_banner',                                                                                       // 213
  order: 10                                                                                                            // 214
});                                                                                                                    // 215
                                                                                                                       // 216
 function subscribeUserOnProfileCompletion (user) {                                                                    // 217
  if (!!Settings.get('autoSubscribe') && !!Users.getEmail(user)) {                                                     // 218
    addToMailChimpList(user, false, function (error, result) {                                                         // 219
      console.log(error);                                                                                              // 220
      console.log(result);                                                                                             // 221
    });                                                                                                                // 222
  }                                                                                                                    // 223
  return user;                                                                                                         // 224
}                                                                                                                      // 225
Telescope.callbacks.add("profileCompletedAsync", subscribeUserOnProfileCompletion);                                    // 226
                                                                                                                       // 227
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/campaign.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
defaultFrequency = 7;                                                                                                  // 1
defaultPosts = 5;                                                                                                      // 2
                                                                                                                       // 3
getCampaignPosts = function (postsCount) {                                                                             // 4
                                                                                                                       // 5
  // look for last scheduled campaign in the database                                                                  // 6
  var lastCampaign = SyncedCron._collection.findOne({name: 'scheduleNewsletter'}, {sort: {finishedAt: -1}, limit: 1}); // 7
                                                                                                                       // 8
  // if there is a last campaign use its date, else default to posts from the last 7 days                              // 9
  var lastWeek = moment().subtract(7, 'days').toDate();                                                                // 10
  var after = (typeof lastCampaign !== 'undefined') ? lastCampaign.finishedAt : lastWeek                               // 11
                                                                                                                       // 12
  var params = Posts.getSubParams({                                                                                    // 13
    view: 'campaign',                                                                                                  // 14
    limit: postsCount,                                                                                                 // 15
    after: after                                                                                                       // 16
  });                                                                                                                  // 17
  return Posts.find(params.find, params.options).fetch();                                                              // 18
};                                                                                                                     // 19
                                                                                                                       // 20
buildCampaign = function (postsArray) {                                                                                // 21
  var postsHTML = '', subject = '';                                                                                    // 22
                                                                                                                       // 23
  // 1. Iterate through posts and pass each of them through a handlebars template                                      // 24
  postsArray.forEach(function (post, index) {                                                                          // 25
    if(index > 0)                                                                                                      // 26
      subject += ', ';                                                                                                 // 27
                                                                                                                       // 28
    subject += post.title;                                                                                             // 29
                                                                                                                       // 30
    var postUser = Meteor.users.findOne(post.userId);                                                                  // 31
                                                                                                                       // 32
    // the naked post object as stored in the database is missing a few properties, so let's add them                  // 33
    var properties = _.extend(post, {                                                                                  // 34
      authorName: post.getAuthorName(),                                                                                // 35
      postLink: Posts.getLink(post, true),                                                                             // 36
      profileUrl: Users.getProfileUrl(postUser, true),                                                                 // 37
      postPageLink: Posts.getPageUrl(post, true),                                                                      // 38
      date: moment(post.postedAt).format("MMMM D YYYY")                                                                // 39
    });                                                                                                                // 40
                                                                                                                       // 41
    if (post.body)                                                                                                     // 42
      properties.body = marked(Telescope.utils.trimWords(post.body, 20)).replace('<p>', '').replace('</p>', ''); // remove p tags
                                                                                                                       // 44
    if(post.url)                                                                                                       // 45
      properties.domain = Telescope.utils.getDomain(post.url);                                                         // 46
                                                                                                                       // 47
    postsHTML += Telescope.email.getTemplate('emailPostItem')(properties);                                             // 48
  });                                                                                                                  // 49
                                                                                                                       // 50
  // 2. Wrap posts HTML in digest template                                                                             // 51
  var digestHTML = Telescope.email.getTemplate('emailDigest')({                                                        // 52
    siteName: Settings.get('title'),                                                                                   // 53
    date: moment().format("dddd, MMMM Do YYYY"),                                                                       // 54
    content: postsHTML                                                                                                 // 55
  });                                                                                                                  // 56
                                                                                                                       // 57
  // 3. wrap digest HTML in email wrapper template                                                                     // 58
  var emailHTML = Telescope.email.buildTemplate(digestHTML);                                                           // 59
                                                                                                                       // 60
  var campaign = {                                                                                                     // 61
    postIds: _.pluck(postsArray, '_id'),                                                                               // 62
    subject: Telescope.utils.trimWords(subject, 15),                                                                   // 63
    html: emailHTML                                                                                                    // 64
  };                                                                                                                   // 65
                                                                                                                       // 66
  return campaign;                                                                                                     // 67
};                                                                                                                     // 68
                                                                                                                       // 69
scheduleNextCampaign = function (isTest) {                                                                             // 70
  isTest = !! isTest;                                                                                                  // 71
  var posts = getCampaignPosts(Settings.get('postsPerNewsletter', defaultPosts));                                      // 72
  if(!!posts.length){                                                                                                  // 73
    return scheduleCampaign(buildCampaign(posts), isTest);                                                             // 74
  }else{                                                                                                               // 75
    var result = 'No posts to schedule today…';                                                                        // 76
    return result;                                                                                                     // 77
  }                                                                                                                    // 78
};                                                                                                                     // 79
                                                                                                                       // 80
Meteor.methods({                                                                                                       // 81
  sendCampaign: function () {                                                                                          // 82
    if(Users.is.adminById(this.userId))                                                                                // 83
      return scheduleNextCampaign(false);                                                                              // 84
  },                                                                                                                   // 85
  testCampaign: function () {                                                                                          // 86
    if(Users.is.adminById(this.userId))                                                                                // 87
      return scheduleNextCampaign(true);                                                                               // 88
  }                                                                                                                    // 89
});                                                                                                                    // 90
                                                                                                                       // 91
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/cron.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
SyncedCron.options = {                                                                                                 // 1
  log: false,                                                                                                          // 2
  collectionName: 'cronHistory',                                                                                       // 3
  utc: false,                                                                                                          // 4
  collectionTTL: 172800                                                                                                // 5
};                                                                                                                     // 6
                                                                                                                       // 7
var defaultFrequency = 7; // once a week                                                                               // 8
var defaultTime = '00:00';                                                                                             // 9
                                                                                                                       // 10
var getSchedule = function (parser) {                                                                                  // 11
  var frequency = Settings.get('newsletterFrequency', defaultFrequency);                                               // 12
  var recur = parser.recur();                                                                                          // 13
  var schedule;                                                                                                        // 14
                                                                                                                       // 15
                                                                                                                       // 16
  // Default is once a week (Mondays)                                                                                  // 17
  if (!!frequency) {                                                                                                   // 18
    schedule = recur.on(frequency).dayOfWeek();                                                                        // 19
  }                                                                                                                    // 20
  else {                                                                                                               // 21
    schedule = recur.on(2).dayOfWeek();                                                                                // 22
  }                                                                                                                    // 23
                                                                                                                       // 24
  return schedule.on(Settings.get('newsletterTime', defaultTime)).time();                                              // 25
};                                                                                                                     // 26
                                                                                                                       // 27
Meteor.methods({                                                                                                       // 28
  getNextJob: function () {                                                                                            // 29
    var nextJob = SyncedCron.nextScheduledAtDate('scheduleNewsletter');                                                // 30
    console.log(nextJob);                                                                                              // 31
    return nextJob;                                                                                                    // 32
  }                                                                                                                    // 33
});                                                                                                                    // 34
                                                                                                                       // 35
var addJob = function () {                                                                                             // 36
  SyncedCron.add({                                                                                                     // 37
    name: 'scheduleNewsletter',                                                                                        // 38
    schedule: function(parser) {                                                                                       // 39
      // parser is a later.parse object                                                                                // 40
      return getSchedule(parser);                                                                                      // 41
    },                                                                                                                 // 42
    job: function() {                                                                                                  // 43
      scheduleNextCampaign();                                                                                          // 44
    }                                                                                                                  // 45
  });                                                                                                                  // 46
};                                                                                                                     // 47
Meteor.startup(function () {                                                                                           // 48
  if (Settings.get('enableNewsletter', false)) {                                                                       // 49
    addJob();                                                                                                          // 50
  }                                                                                                                    // 51
});                                                                                                                    // 52
                                                                                                                       // 53
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/mailchimp.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var htmlToText = Npm.require('html-to-text');                                                                          // 1
                                                                                                                       // 2
scheduleCampaign = function (campaign, isTest) {                                                                       // 3
  var isTest = typeof isTest === 'undefined' ? false : isTest;                                                         // 4
                                                                                                                       // 5
  var apiKey = Settings.get('mailChimpAPIKey');                                                                        // 6
  var listId = Settings.get('mailChimpListId');                                                                        // 7
                                                                                                                       // 8
  if(!!apiKey && !!listId){                                                                                            // 9
                                                                                                                       // 10
		var wordCount = 15;                                                                                                  // 11
		var subject = campaign.subject;                                                                                      // 12
		while (subject.length >= 150){                                                                                       // 13
			subject = Telescope.utils.trimWords(subject, wordCount);                                                            // 14
			wordCount--;                                                                                                        // 15
		}                                                                                                                    // 16
                                                                                                                       // 17
    try {                                                                                                              // 18
                                                                                                                       // 19
      var api = new MailChimp(apiKey);                                                                                 // 20
      var text = htmlToText.fromString(campaign.html, {wordwrap: 130});                                                // 21
      var defaultEmail = Settings.get('defaultEmail');                                                                 // 22
      var campaignOptions = {                                                                                          // 23
        type: 'regular',                                                                                               // 24
        options: {                                                                                                     // 25
          list_id: listId,                                                                                             // 26
          subject: subject,                                                                                            // 27
          from_email: defaultEmail,                                                                                    // 28
          from_name: Settings.get('title')+ ' Top Posts',                                                              // 29
        },                                                                                                             // 30
        content: {                                                                                                     // 31
          html: campaign.html,                                                                                         // 32
          text: text                                                                                                   // 33
        }                                                                                                              // 34
      };                                                                                                               // 35
                                                                                                                       // 36
      console.log( '// Creating campaign…');                                                                           // 37
                                                                                                                       // 38
      // create campaign                                                                                               // 39
      var mailchimpCampaign = api.call( 'campaigns', 'create', campaignOptions);                                       // 40
                                                                                                                       // 41
      console.log( '// Campaign created');                                                                             // 42
      // console.log(campaign)                                                                                         // 43
                                                                                                                       // 44
      var scheduledTime = moment().utcOffset(0).add(1, 'hours').format("YYYY-MM-DD HH:mm:ss");                         // 45
                                                                                                                       // 46
      var scheduleOptions = {                                                                                          // 47
        cid: mailchimpCampaign.id,                                                                                     // 48
        schedule_time: scheduledTime                                                                                   // 49
      };                                                                                                               // 50
                                                                                                                       // 51
      // schedule campaign                                                                                             // 52
      var schedule = api.call('campaigns', 'schedule', scheduleOptions);                                               // 53
                                                                                                                       // 54
      console.log('// Campaign scheduled for '+scheduledTime);                                                         // 55
      // console.log(schedule)                                                                                         // 56
                                                                                                                       // 57
      // if this is not a test, mark posts as sent                                                                     // 58
      if (!isTest)                                                                                                     // 59
        var updated = Posts.update({_id: {$in: campaign.postIds}}, {$set: {scheduledAt: new Date()}}, {multi: true})   // 60
                                                                                                                       // 61
      // send confirmation email                                                                                       // 62
      var confirmationHtml = Telescope.email.getTemplate('emailDigestConfirmation')({                                  // 63
        time: scheduledTime,                                                                                           // 64
        newsletterLink: mailchimpCampaign.archive_url,                                                                 // 65
        subject: subject                                                                                               // 66
      });                                                                                                              // 67
      Telescope.email.send(defaultEmail, 'Newsletter scheduled', Telescope.email.buildTemplate(confirmationHtml));     // 68
                                                                                                                       // 69
    } catch (error) {                                                                                                  // 70
      console.log(error);                                                                                              // 71
    }                                                                                                                  // 72
    return subject;                                                                                                    // 73
  }                                                                                                                    // 74
};                                                                                                                     // 75
                                                                                                                       // 76
addToMailChimpList = function(userOrEmail, confirm, done){                                                             // 77
                                                                                                                       // 78
  var user, email;                                                                                                     // 79
                                                                                                                       // 80
  var confirm = (typeof confirm === 'undefined') ? false : confirm; // default to no confirmation                      // 81
                                                                                                                       // 82
  // not sure if it's really necessary that the function take both user and email?                                     // 83
  if (typeof userOrEmail === "string") {                                                                               // 84
    user = null;                                                                                                       // 85
    email = userOrEmail;                                                                                               // 86
  } else if (typeof userOrEmail === "object") {                                                                        // 87
    user = userOrEmail;                                                                                                // 88
    email = Users.getEmail(user);                                                                                      // 89
    if (!email)                                                                                                        // 90
      throw 'User must have an email address';                                                                         // 91
  }                                                                                                                    // 92
                                                                                                                       // 93
  var apiKey = Settings.get('mailChimpAPIKey');                                                                        // 94
  var listId = Settings.get('mailChimpListId');                                                                        // 95
                                                                                                                       // 96
  // add a user to a MailChimp list.                                                                                   // 97
  // called when a new user is created, or when an existing user fills in their email                                  // 98
  if(!!apiKey && !!listId){                                                                                            // 99
                                                                                                                       // 100
    try {                                                                                                              // 101
                                                                                                                       // 102
      console.log('// Adding "'+email+'" to MailChimp list…');                                                         // 103
                                                                                                                       // 104
      var api = new MailChimp(apiKey);                                                                                 // 105
      var subscribeOptions = {                                                                                         // 106
        id: listId,                                                                                                    // 107
        email: {"email": email},                                                                                       // 108
        double_optin: confirm                                                                                          // 109
      };                                                                                                               // 110
                                                                                                                       // 111
      // subscribe user                                                                                                // 112
      var subscribe = api.call('lists', 'subscribe', subscribeOptions);                                                // 113
                                                                                                                       // 114
      // mark user as subscribed                                                                                       // 115
      if (!!user) {                                                                                                    // 116
        Users.setSetting(user, 'newsletter.subscribeToNewsletter', true);                                              // 117
      }                                                                                                                // 118
                                                                                                                       // 119
      console.log("// User subscribed");                                                                               // 120
                                                                                                                       // 121
      return subscribe;                                                                                                // 122
                                                                                                                       // 123
    } catch (error) {                                                                                                  // 124
      throw new Meteor.Error("subscription-failed", error.message);                                                    // 125
    }                                                                                                                  // 126
  }                                                                                                                    // 127
};                                                                                                                     // 128
                                                                                                                       // 129
Meteor.methods({                                                                                                       // 130
  addCurrentUserToMailChimpList: function(){                                                                           // 131
    var currentUser = Meteor.users.findOne(this.userId);                                                               // 132
    try {                                                                                                              // 133
      return addToMailChimpList(currentUser, false);                                                                   // 134
    } catch (error) {                                                                                                  // 135
      throw new Meteor.Error(500, error.message);                                                                      // 136
    }                                                                                                                  // 137
  },                                                                                                                   // 138
  addEmailToMailChimpList: function (email) {                                                                          // 139
    try {                                                                                                              // 140
      return addToMailChimpList(email, true);                                                                          // 141
    } catch (error) {                                                                                                  // 142
      throw new Meteor.Error(500, error.message);                                                                      // 143
    }                                                                                                                  // 144
  }                                                                                                                    // 145
});                                                                                                                    // 146
                                                                                                                       // 147
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/routes.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
                                                                                                                       // 2
  Router.route('/email/campaign', {                                                                                    // 3
    name: 'campaign',                                                                                                  // 4
    where: 'server',                                                                                                   // 5
    action: function() {                                                                                               // 6
      var campaign = buildCampaign(getCampaignPosts(Settings.get('postsPerNewsletter', 5)));                           // 7
      var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
      var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+ Meteor.call('getNextJob') +'</div>';
                                                                                                                       // 10
      this.response.write(campaignSubject+campaignSchedule+campaign.html);                                             // 11
      this.response.end();                                                                                             // 12
    }                                                                                                                  // 13
  });                                                                                                                  // 14
                                                                                                                       // 15
  Router.route('/email/digest-confirmation', {                                                                         // 16
    name: 'digestConfirmation',                                                                                        // 17
    where: 'server',                                                                                                   // 18
    action: function() {                                                                                               // 19
      var confirmationHtml = Telescope.email.getTemplate('emailDigestConfirmation')({                                  // 20
        time: 'January 1st, 1901',                                                                                     // 21
        newsletterLink: 'http://example.com',                                                                          // 22
        subject: 'Lorem ipsum dolor sit amet'                                                                          // 23
      });                                                                                                              // 24
      this.response.write(Telescope.email.buildTemplate(confirmationHtml));                                            // 25
      this.response.end();                                                                                             // 26
    }                                                                                                                  // 27
  });                                                                                                                  // 28
                                                                                                                       // 29
});                                                                                                                    // 30
                                                                                                                       // 31
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/templates/handlebars.emailDigest.js                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<style type=\"text/css\">\n  .email-digest{\n  }\n  .digest-date{\n    color: #999;\n    font-weight: normal;\n    font-size: 16px;\n  }\n  .post-item{\n    border-top: 1px solid #ddd;\n  }\n  .post-date{\n    font-size: 13px;\n    color: #999;\n  }\n  .post-title{\n    font-size: 18px;\n    line-height: 1.6;\n  }\n  .post-thumbnail{\n    height: 28px;\n    width: 37px;\n    vertical-align: top;\n  }\n  .post-meta{\n    font-size: 13px;\n    color: #999;\n    margin: 5px 0;\n  }\n  .post-meta a{\n    color: #333;\n  }  \n  .post-domain{\n    font-weight: bold;\n  }\n  .post-body-excerpt{\n    font-size: 14px;\n  }\n  .post-body-excerpt p{\n    margin: 0;\n  }\n</style>\n\n<span class=\"heading\">Recently on {{siteName}}</span>\n<span class=\"digest-date\">– {{date}}</span>\n<br><br>\n\n<div class=\"email-digest\">\n  {{{content}}}\n</div>\n<br>");Handlebars.templates["emailDigest"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailDigest"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/templates/handlebars.emailDigestConfirmation.js                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<span class=\"heading\">Newsletter scheduled for {{time}}</span><br><br>\n\n<a href=\"{{newsletterLink}}\">{{subject}}</a><br><br>");Handlebars.templates["emailDigestConfirmation"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailDigestConfirmation"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/lib/server/templates/handlebars.emailPostItem.js                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Handlebars = Handlebars || {};Handlebars.templates = Handlebars.templates || {} ;var template = OriginalHandlebars.compile("<div class=\"post-item\">\n<br >\n\n<span class=\"post-title\">\n  {{#if thumbnailUrl}}\n    <img class=\"post-thumbnail\" src=\"http:{{thumbnailUrl}}\"/>&nbsp;\n  {{/if}}\n\n  <a href=\"{{postLink}}\" target=\"_blank\">{{title}}</a>\n</span>\n\n<div class=\"post-meta\">\n  {{#if domain}}\n    <a class=\"post-domain\" href=\"\">{{domain}}</a>\n    | \n  {{/if}}\n  \n  <span class=\"post-submitted\">\n    {{#if profileUrl}}\n      Submitted by <a href=\"{{profileUrl}}\" class=\"comment-link\" target=\"_blank\">{{authorName}}</a>\n    {{else}}\n      Submitted by {{authorName}}\n    {{/if}}\n  </span>\n\n  <span class=\"post-date\">on {{date}}</span>\n  |\n  <a href=\"{{postPageLink}}\" class=\"comment-link\" target=\"_blank\">{{commentCount}} Comments</a>\n</div>\n\n\n{{#if body}}\n  <div class=\"post-body-excerpt\">\n    {{{htmlBody}}}\n    <a href=\"{{postPageLink}}\" class=\"comment-link\" target=\"_blank\">Read more</a>\n  </div>\n{{/if}}\n\n\n<br>\n</div>\n\n");Handlebars.templates["emailPostItem"] = function (data, partials) { partials = (partials || {});return template(data || {}, { helpers: OriginalHandlebars.helpers,partials: partials,name: "emailPostItem"});};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/ar.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["ar"])) {                                                                        // 8
  TAPi18n.translations["ar"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["ar"][namespace])) {                                                             // 12
  TAPi18n.translations["ar"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["ar"][namespace], {});                                                                   // 16
TAPi18n._registerServerTranslator("ar", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/bg.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["bg"])) {                                                                        // 8
  TAPi18n.translations["bg"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["bg"][namespace])) {                                                             // 12
  TAPi18n.translations["bg"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["bg"][namespace], {});                                                                   // 16
TAPi18n._registerServerTranslator("bg", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/de.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["de"])) {                                                                        // 8
  TAPi18n.translations["de"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["de"][namespace])) {                                                             // 12
  TAPi18n.translations["de"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["de"][namespace], {"receive_the_best_of":"Receive the best of","right_in_your_inbox":"right in your inbox.","get_newsletter":"Get Newsletter","thanks_for_subscribing":"Thanks for subscribing!"});
TAPi18n._registerServerTranslator("de", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/el.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["el"])) {                                                                        // 8
  TAPi18n.translations["el"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["el"][namespace])) {                                                             // 12
  TAPi18n.translations["el"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["el"][namespace], {});                                                                   // 16
TAPi18n._registerServerTranslator("el", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/en.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
// integrate the fallback language translations                                                                        // 8
translations = {};                                                                                                     // 9
translations[namespace] = {"receive_the_best_of":"Receive the best of","right_in_your_inbox":"right in your inbox.","get_newsletter":"Get Newsletter","thanks_for_subscribing":"Thanks for subscribing!","newsletter":"newsletter","showBanner":"Show Banner","mailChimpAPIKey":"MailChimp API Key","mailChimpListId":"MailChimp List ID","postsPerNewsletter":"Posts per Newsletter","newsletterFrequency":"Newsletter Frequency","newsletterTime":"Newsletter Time","enableNewsletter":"Enable Newsletter","autoSubscribe":"Auto Subscribe"};
TAPi18n._loadLangFileObject("en", translations);                                                                       // 11
TAPi18n._registerServerTranslator("en", namespace);                                                                    // 12
                                                                                                                       // 13
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/es.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["es"])) {                                                                        // 8
  TAPi18n.translations["es"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["es"][namespace])) {                                                             // 12
  TAPi18n.translations["es"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["es"][namespace], {"receive_the_best_of":"Reciba lo mejor de","right_in_your_inbox":"directo en tu correo electrónico.","get_newsletter":"Obtén la Newsletter","thanks_for_subscribing":"¡Gracias por suscribirse!","newsletter":"newsletter"});
TAPi18n._registerServerTranslator("es", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/fr.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                        // 8
  TAPi18n.translations["fr"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                             // 12
  TAPi18n.translations["fr"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["fr"][namespace], {"receive_the_best_of":"Recevez le meilleur de","right_in_your_inbox":"par email.","get_newsletter":"S'abonner à la newsletter","thanks_for_subscribing":"Merci pour votre abonnement !","newsletter":"newsletter","showBanner":"Afficher la Bannière","mailChimpAPIKey":"Clé d'API MailChimp","mailChimpListId":"ID Liste MailChimp","postsPerNewsletter":"Posts par Newsletter","newsletterFrequency":"Fréquence de la Newsletter","newsletterTime":"Heure de la Newsletter","enableNewsletter":"Activer la Newsletter","autoSubscribe":"Auto-abonnement"});
TAPi18n._registerServerTranslator("fr", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/it.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["it"])) {                                                                        // 8
  TAPi18n.translations["it"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["it"][namespace])) {                                                             // 12
  TAPi18n.translations["it"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["it"][namespace], {"receive_the_best_of":"Receive the best of","right_in_your_inbox":"right in your inbox.","get_newsletter":"Get Newsletter","thanks_for_subscribing":"Thanks for subscribing!"});
TAPi18n._registerServerTranslator("it", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/nl.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["nl"])) {                                                                        // 8
  TAPi18n.translations["nl"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["nl"][namespace])) {                                                             // 12
  TAPi18n.translations["nl"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["nl"][namespace], {});                                                                   // 16
TAPi18n._registerServerTranslator("nl", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/pl.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["pl"])) {                                                                        // 8
  TAPi18n.translations["pl"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["pl"][namespace])) {                                                             // 12
  TAPi18n.translations["pl"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["pl"][namespace], {"receive_the_best_of":"Otrzymuj najlepsze z","right_in_your_inbox":"prosto do twojej skrzynki.","get_newsletter":"Zapisz się do Newslettera","thanks_for_subscribing":"Dziękujemy!","newsletter":"newsletter","showBanner":"Pokaż Baner","mailChimpAPIKey":"MailChimp API Key","mailChimpListId":"MailChimp List ID","postsPerNewsletter":"Liczba postów przypadająca na jeden Newsletter","newsletterFrequency":"Częstotliwość Newslettera","newsletterTime":"Godzina, w której ma być wysłany Newsletter","enableNewsletter":"Włącz Newsletter","autoSubscribe":"Auto Subskrybcja"});
TAPi18n._registerServerTranslator("pl", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/pt-BR.i18n.j //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["pt-BR"])) {                                                                     // 8
  TAPi18n.translations["pt-BR"] = {};                                                                                  // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["pt-BR"][namespace])) {                                                          // 12
  TAPi18n.translations["pt-BR"][namespace] = {};                                                                       // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["pt-BR"][namespace], {"receive_the_best_of":"Receba o melhor de","right_in_your_inbox":"direto em sua caixa de emails.","get_newsletter":"Inscrever na Newsletter","thanks_for_subscribing":"Obrigado por assinar!","newsletter":"newsletter","showBanner":"Exibir Banner","mailChimpAPIKey":"MailChimp API Key","mailChimpListId":"MailChimp List ID","postsPerNewsletter":"Postagens por Newsletter","newsletterFrequency":"Frequência Newsletter","newsletterTime":"Hora da Newsletter","enableNewsletter":"Habilitar Newsletter","autoSubscribe":"Auto Inscrição"});
TAPi18n._registerServerTranslator("pt-BR", namespace);                                                                 // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/ro.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["ro"])) {                                                                        // 8
  TAPi18n.translations["ro"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["ro"][namespace])) {                                                             // 12
  TAPi18n.translations["ro"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["ro"][namespace], {});                                                                   // 16
TAPi18n._registerServerTranslator("ro", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/ru.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["ru"])) {                                                                        // 8
  TAPi18n.translations["ru"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["ru"][namespace])) {                                                             // 12
  TAPi18n.translations["ru"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["ru"][namespace], {});                                                                   // 16
TAPi18n._registerServerTranslator("ru", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/sv.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["sv"])) {                                                                        // 8
  TAPi18n.translations["sv"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["sv"][namespace])) {                                                             // 12
  TAPi18n.translations["sv"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["sv"][namespace], {"receive_the_best_of":"Få det bästa av","right_in_your_inbox":"direkt i din inkorg.","get_newsletter":"Få Nyhetsbrev","thanks_for_subscribing":"Tack för att du prenumererar!","newsletter":"nyhetsbrev","showBanner":"Visa Banner","mailChimpAPIKey":"MailChimp API-nyckel","mailChimpListId":"Mailchimp List-ID","postsPerNewsletter":"Inlägg per Nyhetsbrev","newsletterFrequency":"Nyhetsbrevsfrekvens","newsletterTime":"Nyhetsbrevstid","enableNewsletter":"Aktivera Nyhetsbrev","autoSubscribe":"Auto-registrera"});
TAPi18n._registerServerTranslator("sv", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/tr.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["tr"])) {                                                                        // 8
  TAPi18n.translations["tr"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["tr"][namespace])) {                                                             // 12
  TAPi18n.translations["tr"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["tr"][namespace], {});                                                                   // 16
TAPi18n._registerServerTranslator("tr", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/vi.i18n.js   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["vi"])) {                                                                        // 8
  TAPi18n.translations["vi"] = {};                                                                                     // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["vi"][namespace])) {                                                             // 12
  TAPi18n.translations["vi"][namespace] = {};                                                                          // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["vi"][namespace], {});                                                                   // 16
TAPi18n._registerServerTranslator("vi", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:newsletter/Applications/MAMP/websites/stewardsof/packages/telescope-newsletter/i18n/zh-CN.i18n.j //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:newsletter",                                                                             // 2
    namespace = "telescope:newsletter";                                                                                // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
if(_.isUndefined(TAPi18n.translations["zh-CN"])) {                                                                     // 8
  TAPi18n.translations["zh-CN"] = {};                                                                                  // 9
}                                                                                                                      // 10
                                                                                                                       // 11
if(_.isUndefined(TAPi18n.translations["zh-CN"][namespace])) {                                                          // 12
  TAPi18n.translations["zh-CN"][namespace] = {};                                                                       // 13
}                                                                                                                      // 14
                                                                                                                       // 15
_.extend(TAPi18n.translations["zh-CN"][namespace], {});                                                                // 16
TAPi18n._registerServerTranslator("zh-CN", namespace);                                                                 // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:newsletter'] = {
  resetNewsletterSchedule: resetNewsletterSchedule
};

})();

//# sourceMappingURL=telescope_newsletter.js.map
