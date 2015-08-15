(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
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
var _ = Package.underscore._;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var T9n = Package['softwarerero:accounts-t9n'].T9n;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Telescope, _, getTemplate, templates, themeSettings, getVotePower;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/core.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * Kick off the global namespace for Telescope.                                                                      // 2
 * @namespace Telescope                                                                                              // 3
 */                                                                                                                  // 4
                                                                                                                     // 5
Telescope = {};                                                                                                      // 6
                                                                                                                     // 7
Telescope.VERSION = '0.22.2';                                                                                        // 8
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/utils.js                                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * The global namespace for Telescope utils.                                                                         // 2
 * @namespace Telescope.utils                                                                                        // 3
 */                                                                                                                  // 4
Telescope.utils = {};                                                                                                // 5
                                                                                                                     // 6
/**                                                                                                                  // 7
 * Convert a camelCase string to dash-separated string                                                               // 8
 * @param {String} str                                                                                               // 9
 */                                                                                                                  // 10
Telescope.utils.camelToDash = function (str) {                                                                       // 11
  return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();                               // 12
};                                                                                                                   // 13
                                                                                                                     // 14
/**                                                                                                                  // 15
 * Convert an underscore-separated string to dash-separated string                                                   // 16
 * @param {String} str                                                                                               // 17
 */                                                                                                                  // 18
Telescope.utils.underscoreToDash = function (str) {                                                                  // 19
  return str.replace('_', '-');                                                                                      // 20
};                                                                                                                   // 21
                                                                                                                     // 22
/**                                                                                                                  // 23
 * Convert a dash separated string to camelCase.                                                                     // 24
 * @param {String} str                                                                                               // 25
 */                                                                                                                  // 26
Telescope.utils.dashToCamel = function (str) {                                                                       // 27
  return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});                          // 28
};                                                                                                                   // 29
                                                                                                                     // 30
/**                                                                                                                  // 31
 * Convert a string to camelCase and remove spaces.                                                                  // 32
 * @param {String} str                                                                                               // 33
 */                                                                                                                  // 34
Telescope.utils.camelCaseify = function(str) {                                                                       // 35
  return this.dashToCamel(str.replace(' ', '-'));                                                                    // 36
};                                                                                                                   // 37
                                                                                                                     // 38
/**                                                                                                                  // 39
 * Trim a sentence to a specified amount of words and append an ellipsis.                                            // 40
 * @param {String} s - Sentence to trim.                                                                             // 41
 * @param {Number} numWords - Number of words to trim sentence to.                                                   // 42
 */                                                                                                                  // 43
Telescope.utils.trimWords = function(s, numWords) {                                                                  // 44
                                                                                                                     // 45
  if (!s)                                                                                                            // 46
    return s;                                                                                                        // 47
                                                                                                                     // 48
  var expString = s.split(/\s+/,numWords);                                                                           // 49
  if(expString.length >= numWords)                                                                                   // 50
    return expString.join(" ")+"…";                                                                                  // 51
  return s;                                                                                                          // 52
};                                                                                                                   // 53
                                                                                                                     // 54
/**                                                                                                                  // 55
 * Capitalize a string.                                                                                              // 56
 * @param {String} str                                                                                               // 57
 */                                                                                                                  // 58
Telescope.utils.capitalise = function(str) {                                                                         // 59
  return str.charAt(0).toUpperCase() + str.slice(1);                                                                 // 60
};                                                                                                                   // 61
                                                                                                                     // 62
Telescope.utils.getCurrentTemplate = function() {                                                                    // 63
  var template = Router.current().lookupTemplate();                                                                  // 64
  // on postsDaily route, template is a function                                                                     // 65
  if (typeof template === "function") {                                                                              // 66
    return template();                                                                                               // 67
  } else {                                                                                                           // 68
    return template;                                                                                                 // 69
  }                                                                                                                  // 70
};                                                                                                                   // 71
                                                                                                                     // 72
Telescope.utils.t = function(message) {                                                                              // 73
  var d = new Date();                                                                                                // 74
  console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());                    // 75
};                                                                                                                   // 76
                                                                                                                     // 77
Telescope.utils.nl2br = function(str) {                                                                              // 78
  var breakTag = '<br />';                                                                                           // 79
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');                                  // 80
};                                                                                                                   // 81
                                                                                                                     // 82
Telescope.utils.scrollPageTo = function(selector) {                                                                  // 83
  $('body').scrollTop($(selector).offset().top);                                                                     // 84
};                                                                                                                   // 85
                                                                                                                     // 86
Telescope.utils.getDateRange = function(pageNumber) {                                                                // 87
  var now = moment(new Date());                                                                                      // 88
  var dayToDisplay=now.subtract(pageNumber-1, 'days');                                                               // 89
  var range={};                                                                                                      // 90
  range.start = dayToDisplay.startOf('day').valueOf();                                                               // 91
  range.end = dayToDisplay.endOf('day').valueOf();                                                                   // 92
  // console.log("after: ", dayToDisplay.startOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));                    // 93
  // console.log("before: ", dayToDisplay.endOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));                     // 94
  return range;                                                                                                      // 95
};                                                                                                                   // 96
                                                                                                                     // 97
//////////////////////////                                                                                           // 98
// URL Helper Functions //                                                                                           // 99
//////////////////////////                                                                                           // 100
                                                                                                                     // 101
/**                                                                                                                  // 102
 * Returns the user defined site URL or Meteor.absoluteUrl                                                           // 103
 */                                                                                                                  // 104
Telescope.utils.getSiteUrl = function () {                                                                           // 105
  return Settings.get('siteUrl', Meteor.absoluteUrl());                                                              // 106
};                                                                                                                   // 107
                                                                                                                     // 108
/**                                                                                                                  // 109
 * The global namespace for Telescope utils.                                                                         // 110
 * @param {String} url - the URL to redirect                                                                         // 111
 */                                                                                                                  // 112
Telescope.utils.getOutgoingUrl = function (url) {                                                                    // 113
  return Telescope.utils.getRouteUrl('out', {}, {query: {url: url}});                                                // 114
};                                                                                                                   // 115
                                                                                                                     // 116
// This function should only ever really be necessary server side                                                    // 117
// Client side using .path() is a better option since it's relative                                                  // 118
// and shouldn't care about the siteUrl.                                                                             // 119
Telescope.utils.getRouteUrl = function (routeName, params, options) {                                                // 120
  options = options || {};                                                                                           // 121
  var route = Router.url(                                                                                            // 122
    routeName,                                                                                                       // 123
    params || {},                                                                                                    // 124
    options                                                                                                          // 125
  );                                                                                                                 // 126
  return route;                                                                                                      // 127
};                                                                                                                   // 128
                                                                                                                     // 129
Telescope.utils.getSignupUrl = function() {                                                                          // 130
  return this.getRouteUrl('atSignUp');                                                                               // 131
};                                                                                                                   // 132
Telescope.utils.getSigninUrl = function() {                                                                          // 133
  return this.getRouteUrl('atSignIn');                                                                               // 134
};                                                                                                                   // 135
                                                                                                                     // 136
//TODO: fix this                                                                                                     // 137
Telescope.utils.getPostCommentUrl = function(postId, commentId) {                                                    // 138
  // get link to a comment on a post page                                                                            // 139
  return this.getRouteUrl('post_page_comment', {                                                                     // 140
    _id: postId,                                                                                                     // 141
    commentId: commentId                                                                                             // 142
  });                                                                                                                // 143
};                                                                                                                   // 144
                                                                                                                     // 145
Telescope.utils.slugify = function (s) {                                                                             // 146
  var slug = getSlug(s, {                                                                                            // 147
    truncate: 60                                                                                                     // 148
  });                                                                                                                // 149
                                                                                                                     // 150
  // can't have posts with an "edit" slug                                                                            // 151
  if (slug === "edit") {                                                                                             // 152
    slug = "edit-1";                                                                                                 // 153
  }                                                                                                                  // 154
                                                                                                                     // 155
  return slug;                                                                                                       // 156
};                                                                                                                   // 157
                                                                                                                     // 158
Telescope.utils.getShortUrl = function(post) {                                                                       // 159
  return post.shortUrl || post.url;                                                                                  // 160
};                                                                                                                   // 161
                                                                                                                     // 162
Telescope.utils.getDomain = function(url) {                                                                          // 163
  var urlObject = Npm.require('url');                                                                                // 164
  return urlObject.parse(url).hostname.replace('www.', '');                                                          // 165
};                                                                                                                   // 166
                                                                                                                     // 167
Telescope.utils.invitesEnabled = function() {                                                                        // 168
  return Settings.get("requireViewInvite") || Settings.get("requirePostInvite");                                     // 169
};                                                                                                                   // 170
                                                                                                                     // 171
// add http: if missing                                                                                              // 172
Telescope.utils.addHttp = function (url) {                                                                           // 173
  if (url.substring(0, 5) !== "http:" && url.substring(0, 6) !== "https:") {                                         // 174
    url = "http:"+url;                                                                                               // 175
  }                                                                                                                  // 176
  return url;                                                                                                        // 177
};                                                                                                                   // 178
                                                                                                                     // 179
/////////////////////////////                                                                                        // 180
// String Helper Functions //                                                                                        // 181
/////////////////////////////                                                                                        // 182
                                                                                                                     // 183
Telescope.utils.cleanUp = function(s) {                                                                              // 184
  return this.stripHTML(s);                                                                                          // 185
};                                                                                                                   // 186
                                                                                                                     // 187
Telescope.utils.sanitize = function(s) {                                                                             // 188
  // console.log('// before sanitization:')                                                                          // 189
  // console.log(s)                                                                                                  // 190
  if(Meteor.isServer){                                                                                               // 191
    s = sanitizeHtml(s, {                                                                                            // 192
      allowedTags: [                                                                                                 // 193
        'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul',                                                        // 194
        'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike',                                                        // 195
        'code', 'hr', 'br', 'div', 'table', 'thead', 'caption',                                                      // 196
        'tbody', 'tr', 'th', 'td', 'pre', 'img'                                                                      // 197
      ]                                                                                                              // 198
    });                                                                                                              // 199
    // console.log('// after sanitization:')                                                                         // 200
    // console.log(s)                                                                                                // 201
  }                                                                                                                  // 202
  return s;                                                                                                          // 203
};                                                                                                                   // 204
                                                                                                                     // 205
Telescope.utils.stripHTML = function(s) {                                                                            // 206
  return s.replace(/<(?:.|\n)*?>/gm, '');                                                                            // 207
};                                                                                                                   // 208
                                                                                                                     // 209
Telescope.utils.stripMarkdown = function(s) {                                                                        // 210
  var html_body = marked(s);                                                                                         // 211
  return stripHTML(html_body);                                                                                       // 212
};                                                                                                                   // 213
                                                                                                                     // 214
// http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key                     // 215
Telescope.utils.checkNested = function(obj /*, level1, level2, ... levelN*/) {                                       // 216
  var args = Array.prototype.slice.call(arguments);                                                                  // 217
  obj = args.shift();                                                                                                // 218
                                                                                                                     // 219
  for (var i = 0; i < args.length; i++) {                                                                            // 220
    if (!obj.hasOwnProperty(args[i])) {                                                                              // 221
      return false;                                                                                                  // 222
    }                                                                                                                // 223
    obj = obj[args[i]];                                                                                              // 224
  }                                                                                                                  // 225
  return true;                                                                                                       // 226
};                                                                                                                   // 227
                                                                                                                     // 228
Telescope.log = function (s) {                                                                                       // 229
  if(Settings.get('debug', false))                                                                                   // 230
    console.log(s);                                                                                                  // 231
};                                                                                                                   // 232
                                                                                                                     // 233
// see http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string         // 234
Telescope.getNestedProperty = function (obj, desc) {                                                                 // 235
  var arr = desc.split(".");                                                                                         // 236
  while(arr.length && (obj = obj[arr.shift()]));                                                                     // 237
  return obj;                                                                                                        // 238
};                                                                                                                   // 239
                                                                                                                     // 240
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/callbacks.js                                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * Callback hooks provide an easy way to add extra steps to common operations.                                       // 2
 * @namespace Telescope.callbacks                                                                                    // 3
 */                                                                                                                  // 4
Telescope.callbacks = {};                                                                                            // 5
                                                                                                                     // 6
/**                                                                                                                  // 7
 * Add a callback function to a hook                                                                                 // 8
 * @param {String} hook - The name of the hook                                                                       // 9
 * @param {Function} callback - The callback function                                                                // 10
 */                                                                                                                  // 11
Telescope.callbacks.add = function (hook, callback) {                                                                // 12
                                                                                                                     // 13
  // if callback array doesn't exist yet, initialize it                                                              // 14
  if (typeof Telescope.callbacks[hook] === "undefined") {                                                            // 15
    Telescope.callbacks[hook] = [];                                                                                  // 16
  }                                                                                                                  // 17
                                                                                                                     // 18
  Telescope.callbacks[hook].push(callback);                                                                          // 19
};                                                                                                                   // 20
                                                                                                                     // 21
/**                                                                                                                  // 22
 * Remove a callback from a hook                                                                                     // 23
 * @param {string} hook - The name of the hook                                                                       // 24
 * @param {string} functionName - The name of the function to remove                                                 // 25
 */                                                                                                                  // 26
Telescope.callbacks.remove = function (hookName, callbackName) {                                                     // 27
  Telescope.callbacks[hookName] = _.reject(Telescope.callbacks[hookName], function (callback) {                      // 28
    return callback.name === callbackName;                                                                           // 29
  });                                                                                                                // 30
};                                                                                                                   // 31
                                                                                                                     // 32
/**                                                                                                                  // 33
 * Successively run all of a hook's callbacks on an item                                                             // 34
 * @param {String} hook - The name of the hook                                                                       // 35
 * @param {Object} item - The post, comment, modifier, etc. on which to run the callbacks                            // 36
 * @param {Object} [constant] - An optional constant that will be passed along to each callback                      // 37
 * @returns {Object} Returns the item after it's been through all the callbacks for this hook                        // 38
 */                                                                                                                  // 39
Telescope.callbacks.run = function (hook, item, constant) {                                                          // 40
                                                                                                                     // 41
  var callbacks = Telescope.callbacks[hook];                                                                         // 42
                                                                                                                     // 43
  if (typeof callbacks !== "undefined" && !!callbacks.length) { // if the hook exists, and contains callbacks to run // 44
                                                                                                                     // 45
    return callbacks.reduce(function(result, callback) {                                                             // 46
      // console.log(callback.name);                                                                                 // 47
      return callback(result, constant);                                                                             // 48
    }, item);                                                                                                        // 49
                                                                                                                     // 50
  } else { // else, just return the item unchanged                                                                   // 51
    return item;                                                                                                     // 52
  }                                                                                                                  // 53
};                                                                                                                   // 54
                                                                                                                     // 55
/**                                                                                                                  // 56
 * Successively run all of a hook's callbacks on an item, in async mode (only works on server)                       // 57
 * @param {String} hook - The name of the hook                                                                       // 58
 * @param {Object} item - The post, comment, modifier, etc. on which to run the callbacks                            // 59
 * @param {Object} [constant] - An optional constant that will be passed along to each callback                      // 60
 */                                                                                                                  // 61
Telescope.callbacks.runAsync = function (hook, item, constant) {                                                     // 62
                                                                                                                     // 63
  var callbacks = Telescope.callbacks[hook];                                                                         // 64
                                                                                                                     // 65
  if (Meteor.isServer && typeof callbacks !== "undefined" && !!callbacks.length) {                                   // 66
                                                                                                                     // 67
    // use defer to avoid holding up client                                                                          // 68
    Meteor.defer(function () {                                                                                       // 69
      // run all post submit server callbacks on post object successively                                            // 70
      callbacks.forEach(function(callback) {                                                                         // 71
        // console.log(callback.name);                                                                               // 72
        callback(item, constant);                                                                                    // 73
      });                                                                                                            // 74
    });                                                                                                              // 75
                                                                                                                     // 76
  } else {                                                                                                           // 77
    return item;                                                                                                     // 78
  }                                                                                                                  // 79
};                                                                                                                   // 80
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/collections.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * Meteor Collections.                                                                                               // 2
 * @class Mongo.Collection                                                                                           // 3
 */                                                                                                                  // 4
                                                                                                                     // 5
/**                                                                                                                  // 6
 * Add an additional field (or an array of fields) to a schema.                                                      // 7
 * @param {Object|Object[]} field                                                                                    // 8
 */                                                                                                                  // 9
Mongo.Collection.prototype.addField = function (fieldOrFieldArray) {                                                 // 10
                                                                                                                     // 11
  var collection = this;                                                                                             // 12
  var fieldSchema = {};                                                                                              // 13
                                                                                                                     // 14
  var fieldArray = Array.isArray(fieldOrFieldArray) ? fieldOrFieldArray : [fieldOrFieldArray];                       // 15
                                                                                                                     // 16
  // loop over fields and add them to schema                                                                         // 17
  fieldArray.forEach(function (field) {                                                                              // 18
    fieldSchema[field.fieldName] = field.fieldSchema;                                                                // 19
  });                                                                                                                // 20
                                                                                                                     // 21
  // add field schema to collection schema                                                                           // 22
  collection.attachSchema(fieldSchema);                                                                              // 23
};                                                                                                                   // 24
                                                                                                                     // 25
/**                                                                                                                  // 26
 * Remove a field from a schema.                                                                                     // 27
 * @param {String} fieldName                                                                                         // 28
 */                                                                                                                  // 29
Mongo.Collection.prototype.removeField = function (fieldName) {                                                      // 30
                                                                                                                     // 31
  var collection = this;                                                                                             // 32
  var schema = _.omit(collection.simpleSchema()._schema, fieldName);                                                 // 33
                                                                                                                     // 34
  // add field schema to collection schema                                                                           // 35
  collection.attachSchema(schema, {replace: true});                                                                  // 36
};                                                                                                                   // 37
                                                                                                                     // 38
/**                                                                                                                  // 39
 * Check if an operation is allowed                                                                                  // 40
 * @param {Object} collection – the collection to which the document belongs                                         // 41
 * @param {string} userId – the userId of the user performing the operation                                          // 42
 * @param {Object} document – the document being modified                                                            // 43
 * @param {string[]} fieldNames – the names of the fields being modified                                             // 44
 * @param {Object} modifier – the modifier                                                                           // 45
 */                                                                                                                  // 46
Telescope.allowCheck = function (collection, userId, document, fieldNames, modifier) {                               // 47
                                                                                                                     // 48
  var schema = collection.simpleSchema();                                                                            // 49
  var user = Meteor.users.findOne(userId);                                                                           // 50
  var allowedFields = schema.getEditableFields(user);                                                                // 51
  var fields = [];                                                                                                   // 52
                                                                                                                     // 53
  // fieldNames only contains top-level fields, so loop over modifier to get real list of fields                     // 54
  _.each(modifier, function (operation) {                                                                            // 55
    fields = fields.concat(_.keys(operation));                                                                       // 56
  });                                                                                                                // 57
                                                                                                                     // 58
  // allow update only if:                                                                                           // 59
  // 1. user has rights to edit the document                                                                         // 60
  // 2. there is no fields in fieldNames that are not also in allowedFields                                          // 61
  return Users.can.edit(userId, document) && _.difference(fields, allowedFields).length == 0;                        // 62
                                                                                                                     // 63
};                                                                                                                   // 64
                                                                                                                     // 65
// Note: using the prototype doesn't work in allow/deny for some reason                                              // 66
Meteor.Collection.prototype.allowCheck = function (userId, document, fieldNames, modifier) {                         // 67
  Telescope.allowCheck(this, userId, document, fieldNames, modifier);                                                // 68
};                                                                                                                   // 69
                                                                                                                     // 70
/**                                                                                                                  // 71
 * Global schemas object. Note: not reactive, won't be updated after initialization                                  // 72
 * @namespace Telescope.schemas                                                                                      // 73
 */                                                                                                                  // 74
Telescope.schemas = {};                                                                                              // 75
                                                                                                                     // 76
/**                                                                                                                  // 77
 * @method SimpleSchema.getEditableFields                                                                            // 78
 * Get a list of all fields editable by a specific user for a given schema                                           // 79
 * @param {Object} user – the user for which to check field permissions                                              // 80
 */                                                                                                                  // 81
SimpleSchema.prototype.getEditableFields = function (user) {                                                         // 82
  var schema = this._schema;                                                                                         // 83
  var fields = _.sortBy(_.filter(_.keys(schema), function (fieldName) {                                              // 84
    var field = schema[fieldName];                                                                                   // 85
    return Users.can.editField(user, field);                                                                         // 86
  }), function (fieldName) {                                                                                         // 87
    var field = schema[fieldName];                                                                                   // 88
    return field.autoform && field.autoform.order;                                                                   // 89
  });                                                                                                                // 90
  return fields;                                                                                                     // 91
};                                                                                                                   // 92
                                                                                                                     // 93
SimpleSchema.prototype.getPublicFields = function () {                                                               // 94
  var schema = this._schema;                                                                                         // 95
  var fields = _.filter(_.keys(schema), function (fieldName) {                                                       // 96
    var field = schema[fieldName];                                                                                   // 97
    return !!field.public;                                                                                           // 98
  });                                                                                                                // 99
  return fields;                                                                                                     // 100
};                                                                                                                   // 101
                                                                                                                     // 102
SimpleSchema.prototype.getProfileFields = function () {                                                              // 103
  var schema = this._schema;                                                                                         // 104
  var fields = _.filter(_.keys(schema), function (fieldName) {                                                       // 105
    var field = schema[fieldName];                                                                                   // 106
    return !!field.profile;                                                                                          // 107
  });                                                                                                                // 108
  return fields;                                                                                                     // 109
};                                                                                                                   // 110
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/modules.js                                                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * Template modules let you insert templates in specific zones in the app's layout.                                  // 2
 * @namespace Telescope.modules                                                                                      // 3
 */                                                                                                                  // 4
                                                                                                                     // 5
Telescope.modules = {};                                                                                              // 6
                                                                                                                     // 7
/**                                                                                                                  // 8
 * Add a module to a template zone                                                                                   // 9
 * @param {string} zone - The name of the zone                                                                       // 10
 * @param {Object|Object[]} module - The module object (or an array of modules)                                      // 11
 * @param {string} module.template - The template to include                                                         // 12
 * @param {number} module.order - The order of the template in the zone                                              // 13
 *                                                                                                                   // 14
 * @example                                                                                                          // 15
 * Telescope.modules.add("hero", {                                                                                   // 16
 *   template: "newsletterBanner",                                                                                   // 17
 *   order: 10                                                                                                       // 18
 * });                                                                                                               // 19
 */                                                                                                                  // 20
Telescope.modules.add = function (zone, module) {                                                                    // 21
                                                                                                                     // 22
  // if module zone array doesn't exist yet, initialize it                                                           // 23
  if (typeof Telescope.modules[zone] === "undefined") {                                                              // 24
    Telescope.modules[zone] = [];                                                                                    // 25
  }                                                                                                                  // 26
                                                                                                                     // 27
  if (Array.isArray(module)) {                                                                                       // 28
                                                                                                                     // 29
    var modules = module; // we're dealing with an Array, so let's add an "s"                                        // 30
    modules.forEach( function (module) {                                                                             // 31
      Telescope.modules[zone].push(module);                                                                          // 32
    });                                                                                                              // 33
                                                                                                                     // 34
  } else {                                                                                                           // 35
                                                                                                                     // 36
    Telescope.modules[zone].push(module);                                                                            // 37
                                                                                                                     // 38
  }                                                                                                                  // 39
};                                                                                                                   // 40
                                                                                                                     // 41
/**                                                                                                                  // 42
 * Remove a module from a zone                                                                                       // 43
 * @param {string} zone - The name of the zone                                                                       // 44
 * @param {string} template - The name of the template to remove                                                     // 45
 */                                                                                                                  // 46
Telescope.modules.remove = function (zone, template) {                                                               // 47
  Telescope.modules[zone] = _.reject(Telescope.modules[zone], function (module) {                                    // 48
    return module.template === template;                                                                             // 49
  });                                                                                                                // 50
};                                                                                                                   // 51
                                                                                                                     // 52
/**                                                                                                                  // 53
 * Removes all modules from a zone                                                                                   // 54
 * @param {string} zone - The name of the zone                                                                       // 55
 */                                                                                                                  // 56
Telescope.modules.removeAll = function (zone) {                                                                      // 57
  Telescope.modules[zone] = [];                                                                                      // 58
};                                                                                                                   // 59
                                                                                                                     // 60
/**                                                                                                                  // 61
 * Retrieve an array containing all modules for a zone                                                               // 62
 * @param {string} zone - The name of the zone                                                                       // 63
 * @returns {Object[]} Returns a sorted array of the zone's modules                                                  // 64
 */                                                                                                                  // 65
Telescope.modules.get = function (zone) {                                                                            // 66
  return _.sortBy(Telescope.modules[zone], "order");                                                                 // 67
};                                                                                                                   // 68
                                                                                                                     // 69
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/config.js                                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * Telescope configuration namespace                                                                                 // 2
 * @namespace Telescope.config                                                                                       // 3
 */                                                                                                                  // 4
Telescope.config = {};                                                                                               // 5
                                                                                                                     // 6
Telescope.config.customPrefix = "custom_";                                                                           // 7
                                                                                                                     // 8
 /**                                                                                                                 // 9
 * Subscriptions namespace                                                                                           // 10
 * @namespace Telescope.subscriptions                                                                                // 11
 */                                                                                                                  // 12
Telescope.subscriptions = [];                                                                                        // 13
                                                                                                                     // 14
/**                                                                                                                  // 15
 * Add a subscription to be preloaded                                                                                // 16
 * @param {string} subscription - The name of the subscription                                                       // 17
 */                                                                                                                  // 18
Telescope.subscriptions.preload = function (subscription) {                                                          // 19
  Telescope.subscriptions.push(subscription);                                                                        // 20
};                                                                                                                   // 21
                                                                                                                     // 22
                                                                                                                     // 23
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/deep.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// see https://gist.github.com/furf/3208381                                                                          // 1
                                                                                                                     // 2
_.mixin({                                                                                                            // 3
                                                                                                                     // 4
  // Get/set the value of a nested property                                                                          // 5
  deep: function (obj, key, value) {                                                                                 // 6
                                                                                                                     // 7
    var keys = key.replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2').replace(/^\./, '').split('.'),                         // 8
        root,                                                                                                        // 9
        i = 0,                                                                                                       // 10
        n = keys.length;                                                                                             // 11
                                                                                                                     // 12
    // Set deep value                                                                                                // 13
    if (arguments.length > 2) {                                                                                      // 14
                                                                                                                     // 15
      root = obj;                                                                                                    // 16
      n--;                                                                                                           // 17
                                                                                                                     // 18
      while (i < n) {                                                                                                // 19
        key = keys[i++];                                                                                             // 20
        obj = obj[key] = _.isObject(obj[key]) ? obj[key] : {};                                                       // 21
      }                                                                                                              // 22
                                                                                                                     // 23
      obj[keys[i]] = value;                                                                                          // 24
                                                                                                                     // 25
      value = root;                                                                                                  // 26
                                                                                                                     // 27
    // Get deep value                                                                                                // 28
    } else {                                                                                                         // 29
      while ((obj = obj[keys[i++]]) !== null && i < n) {};                                                           // 30
      value = i < n ? void 0 : obj;                                                                                  // 31
    }                                                                                                                // 32
                                                                                                                     // 33
    return value;                                                                                                    // 34
  }                                                                                                                  // 35
                                                                                                                     // 36
});                                                                                                                  // 37
                                                                                                                     // 38
// Usage:                                                                                                            // 39
//                                                                                                                   // 40
// var obj = {                                                                                                       // 41
//   a: {                                                                                                            // 42
//     b: {                                                                                                          // 43
//       c: {                                                                                                        // 44
//         d: ['e', 'f', 'g']                                                                                        // 45
//       }                                                                                                           // 46
//     }                                                                                                             // 47
//   }                                                                                                               // 48
// };                                                                                                                // 49
//                                                                                                                   // 50
// Get deep value                                                                                                    // 51
// _.deep(obj, 'a.b.c.d[2]'); // 'g'                                                                                 // 52
//                                                                                                                   // 53
// Set deep value                                                                                                    // 54
// _.deep(obj, 'a.b.c.d[2]', 'george');                                                                              // 55
//                                                                                                                   // 56
// _.deep(obj, 'a.b.c.d[2]'); // 'george'                                                                            // 57
                                                                                                                     // 58
                                                                                                                     // 59
_.mixin({                                                                                                            // 60
  pluckDeep: function (obj, key) {                                                                                   // 61
    return _.map(obj, function (value) { return _.deep(value, key); });                                              // 62
  }                                                                                                                  // 63
});                                                                                                                  // 64
                                                                                                                     // 65
                                                                                                                     // 66
_.mixin({                                                                                                            // 67
                                                                                                                     // 68
 // Return a copy of an object containing all but the blacklisted properties.                                        // 69
  unpick: function (obj) {                                                                                           // 70
    obj = obj || {};                                                                                                 // 71
    return _.pick(obj, _.difference(_.keys(obj), _.flatten(Array.prototype.slice.call(arguments, 1))));              // 72
  }                                                                                                                  // 73
                                                                                                                     // 74
});                                                                                                                  // 75
                                                                                                                     // 76
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/deep_extend.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// see: http://stackoverflow.com/questions/9399365/deep-extend-like-jquerys-for-nodejs                               // 1
Telescope.utils.deepExtend = function () {                                                                           // 2
  var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},                                     // 3
      i = 1,                                                                                                         // 4
      length = arguments.length,                                                                                     // 5
      deep = false,                                                                                                  // 6
      toString = Object.prototype.toString,                                                                          // 7
      hasOwn = Object.prototype.hasOwnProperty,                                                                      // 8
      class2type = {                                                                                                 // 9
        "[object Boolean]": "boolean",                                                                               // 10
        "[object Number]": "number",                                                                                 // 11
        "[object String]": "string",                                                                                 // 12
        "[object Function]": "function",                                                                             // 13
        "[object Array]": "array",                                                                                   // 14
        "[object Date]": "date",                                                                                     // 15
        "[object RegExp]": "regexp",                                                                                 // 16
        "[object Object]": "object"                                                                                  // 17
      },                                                                                                             // 18
      jQuery = {                                                                                                     // 19
        isFunction: function (obj) {                                                                                 // 20
          return jQuery.type(obj) === "function";                                                                    // 21
        },                                                                                                           // 22
        isArray: Array.isArray ||                                                                                    // 23
        function (obj) {                                                                                             // 24
          return jQuery.type(obj) === "array";                                                                       // 25
        },                                                                                                           // 26
        isWindow: function (obj) {                                                                                   // 27
          return obj !== null && obj === obj.window;                                                                 // 28
        },                                                                                                           // 29
        isNumeric: function (obj) {                                                                                  // 30
          return !isNaN(parseFloat(obj)) && isFinite(obj);                                                           // 31
        },                                                                                                           // 32
        type: function (obj) {                                                                                       // 33
          return obj === null ? String(obj) : class2type[toString.call(obj)] || "object";                            // 34
        },                                                                                                           // 35
        isPlainObject: function (obj) {                                                                              // 36
          if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {                                               // 37
            return false;                                                                                            // 38
          }                                                                                                          // 39
          try {                                                                                                      // 40
            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
              return false;                                                                                          // 42
            }                                                                                                        // 43
          } catch (e) {                                                                                              // 44
            return false;                                                                                            // 45
          }                                                                                                          // 46
          var key;                                                                                                   // 47
          for (key in obj) {}                                                                                        // 48
          return key === undefined || hasOwn.call(obj, key);                                                         // 49
        }                                                                                                            // 50
      };                                                                                                             // 51
    if (typeof target === "boolean") {                                                                               // 52
      deep = target;                                                                                                 // 53
      target = arguments[1] || {};                                                                                   // 54
      i = 2;                                                                                                         // 55
    }                                                                                                                // 56
    if (typeof target !== "object" && !jQuery.isFunction(target)) {                                                  // 57
      target = {};                                                                                                   // 58
    }                                                                                                                // 59
    if (length === i) {                                                                                              // 60
      target = this;                                                                                                 // 61
      --i;                                                                                                           // 62
    }                                                                                                                // 63
    for (i; i < length; i++) {                                                                                       // 64
      if ((options = arguments[i]) !== null) {                                                                       // 65
        for (name in options) {                                                                                      // 66
          src = target[name];                                                                                        // 67
          copy = options[name];                                                                                      // 68
          if (target === copy) {                                                                                     // 69
            continue;                                                                                                // 70
          }                                                                                                          // 71
          if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {                // 72
            if (copyIsArray) {                                                                                       // 73
              copyIsArray = false;                                                                                   // 74
              clone = src && jQuery.isArray(src) ? src : [];                                                         // 75
            } else {                                                                                                 // 76
              clone = src && jQuery.isPlainObject(src) ? src : {};                                                   // 77
            }                                                                                                        // 78
            // WARNING: RECURSION                                                                                    // 79
            target[name] = Telescope.utils.deepExtend(deep, clone, copy);                                            // 80
          } else if (copy !== undefined) {                                                                           // 81
            target[name] = copy;                                                                                     // 82
          }                                                                                                          // 83
        }                                                                                                            // 84
      }                                                                                                              // 85
    }                                                                                                                // 86
    return target;                                                                                                   // 87
  };                                                                                                                 // 88
                                                                                                                     // 89
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/autolink.js                                                                            //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
//https://github.com/bryanwoods/autolink-js                                                                          // 1
(function(){var a,b=[].slice;a=function(){var j,i,d,f,e,c,g,h;c=1<=arguments.length?b.call(arguments,0):[];g=/(^|\s)(\b(https?):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|]\b)/ig;if(c.length>0){e=c[0];i=e.callback;if((i!=null)&&typeof i==="function"){j=i;delete e.callback;}f="";for(d in e){h=e[d];f+=" "+d+"='"+h+"'";}return this.replace(g,function(l,o,k){var n,m;m=j&&j(k);n=m||("<a href='"+k+"'"+f+">"+k+"</a>");return""+o+n;});}else{return this.replace(g,"$1<a href='$2'>$2</a>");}};String.prototype.autoLink=a;}).call(this);
                                                                                                                     // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/themes.js                                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * Telescope theme settings and methods.                                                                             // 2
 * @namespace Telescope.theme                                                                                        // 3
 */                                                                                                                  // 4
Telescope.theme = {};                                                                                                // 5
                                                                                                                     // 6
/**                                                                                                                  // 7
 * Default settings for Telescope themes.                                                                            // 8
 * @type {Object}                                                                                                    // 9
 */                                                                                                                  // 10
Telescope.theme.settings = {                                                                                         // 11
  useDropdowns: true // Enable/disable dropdown menus in a theme                                                     // 12
};                                                                                                                   // 13
                                                                                                                     // 14
/**                                                                                                                  // 15
 * Get a theme setting value.                                                                                        // 16
 * @param {String} setting                                                                                           // 17
 * @param {String} defaultValue                                                                                      // 18
 */                                                                                                                  // 19
Telescope.theme.getSetting = function (setting, defaultValue) {                                                      // 20
  if (typeof this.settings[setting] !== 'undefined') {                                                               // 21
    return this.settings[setting];                                                                                   // 22
  } else {                                                                                                           // 23
    return typeof defaultValue === 'undefined' ? '' : defaultValue;                                                  // 24
  }                                                                                                                  // 25
};                                                                                                                   // 26
                                                                                                                     // 27
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/menus.js                                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * Menus namespace                                                                                                   // 2
 * @namespace Telescope.menuItems                                                                                    // 3
 */                                                                                                                  // 4
Telescope.menuItems = {};                                                                                            // 5
                                                                                                                     // 6
/**                                                                                                                  // 7
 * Add one or more items to a menu                                                                                   // 8
 * @param {string} menu - The name of the menu                                                                       // 9
 * @param {Object|Object[]} item - The menu item object (or an array of items)                                       // 10
 *                                                                                                                   // 11
 * @example <caption>Using a named route</caption>                                                                   // 12
 * Telescope.menuItems.add("viewsMenu", {                                                                            // 13
 *   route: 'postsDaily',                                                                                            // 14
 *   label: 'daily',                                                                                                 // 15
 *   description: 'day_by_day_view'                                                                                  // 16
 * });                                                                                                               // 17
 *                                                                                                                   // 18
 * @example <caption>Using a route function</caption>                                                                // 19
 * Telescope.menuItems.add("userMenu", {                                                                             // 20
 *   route: function () {                                                                                            // 21
 *     return Router.path('user_profile', {_idOrSlug: Meteor.user().telescope.slug});                                // 22
 *   },                                                                                                              // 23
 *   label: 'profile',                                                                                               // 24
 *   description: 'view_your_profile'                                                                                // 25
 * });                                                                                                               // 26
 *                                                                                                                   // 27
 */                                                                                                                  // 28
Telescope.menuItems.add = function (menu, item) {                                                                    // 29
                                                                                                                     // 30
  // if menu items array doesn't exist yet, initialize it                                                            // 31
  if (typeof Telescope.menuItems[menu] === "undefined") {                                                            // 32
    Telescope.menuItems[menu] = [];                                                                                  // 33
  }                                                                                                                  // 34
                                                                                                                     // 35
  if (Array.isArray(item)) {                                                                                         // 36
                                                                                                                     // 37
    var items = item; // we're dealing with an Array, so let's add an "s"                                            // 38
    items.forEach( function (item) {                                                                                 // 39
      Telescope.menuItems[menu].push(item);                                                                          // 40
    });                                                                                                              // 41
                                                                                                                     // 42
  } else {                                                                                                           // 43
                                                                                                                     // 44
    Telescope.menuItems[menu].push(item);                                                                            // 45
                                                                                                                     // 46
  }                                                                                                                  // 47
};                                                                                                                   // 48
                                                                                                                     // 49
/**                                                                                                                  // 50
 * Remove an item from a menu                                                                                        // 51
 * @param {string} menu - The name of the menu                                                                       // 52
 * @param {string} label - The label of the item to remove                                                           // 53
 */                                                                                                                  // 54
Telescope.menuItems.remove = function (menu, label) {                                                                // 55
  Telescope.menuItems[menu] = _.reject(Telescope.menuItems[menu], function (menu) {                                  // 56
    return menu.label === label;                                                                                     // 57
  });                                                                                                                // 58
};                                                                                                                   // 59
                                                                                                                     // 60
/**                                                                                                                  // 61
 * Remove all items from a menu                                                                                      // 62
 * @param {string} menu - The name of the menu                                                                       // 63
 */                                                                                                                  // 64
Telescope.menuItems.removeAll = function (menu) {                                                                    // 65
  Telescope.menuItems[menu] = [];                                                                                    // 66
};                                                                                                                   // 67
                                                                                                                     // 68
/**                                                                                                                  // 69
 * Retrieve an array containing all items for a menu                                                                 // 70
 * @param {string} menu - The name of the menu                                                                       // 71
 */                                                                                                                  // 72
Telescope.menuItems.get = function (menu) {                                                                          // 73
  return _.sortBy(Telescope.menuItems[menu], "order");                                                               // 74
};                                                                                                                   // 75
                                                                                                                     // 76
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/base.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// ------------------------------------- Schemas -------------------------------- //                                 // 1
                                                                                                                     // 2
                                                                                                                     // 3
SimpleSchema.extendOptions({                                                                                         // 4
  private: Match.Optional(Boolean),                                                                                  // 5
  editable: Match.Optional(Boolean),  // editable: true means the field can be edited by the document's owner        // 6
  hidden: Match.Optional(Boolean),     // hidden: true means the field is never shown in a form no matter what       // 7
  editableBy: Match.Optional([String]),                                                                              // 8
  publishedTo: Match.Optional([String]),                                                                             // 9
  required: Match.Optional(Boolean), // required: true means the field is required to have a complete profile        // 10
  public: Match.Optional(Boolean), // public: true means the field is published freely                               // 11
  profile: Match.Optional(Boolean), // profile: true means the field is shown on user profiles                       // 12
  template: Match.Optional(String) // template used to display the field                                             // 13
  // editableBy: Match.Optional(String)                                                                              // 14
});                                                                                                                  // 15
                                                                                                                     // 16
// ------------------------------ Dynamic Templates ------------------------------ //                                // 17
                                                                                                                     // 18
templates = {}                                                                                                       // 19
                                                                                                                     // 20
// note: not used anymore, but keep for backwards compatibility                                                      // 21
getTemplate = function (name) {                                                                                      // 22
  // for now, always point back to the original template                                                             // 23
  var originalTemplate = (_.invert(templates))[name];                                                                // 24
  return !!originalTemplate ? originalTemplate : name;                                                               // 25
                                                                                                                     // 26
  // if template has been overwritten, return this; else return template name                                        // 27
  // return !!templates[name] ? templates[name] : name;                                                              // 28
};                                                                                                                   // 29
                                                                                                                     // 30
                                                                                                                     // 31
// ------------------------------- Vote Power -------------------------------- //                                    // 32
                                                                                                                     // 33
// The equation to determine voting power                                                                            // 34
// Default to returning 1 for everybody                                                                              // 35
                                                                                                                     // 36
getVotePower = function (user) {                                                                                     // 37
  return 1;                                                                                                          // 38
};                                                                                                                   // 39
                                                                                                                     // 40
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/colors.js                                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * A dictionnary of all the elements that use custom colors                                                          // 2
 */                                                                                                                  // 3
                                                                                                                     // 4
Telescope.colorElements = {};                                                                                        // 5
                                                                                                                     // 6
Telescope.colorElements.colorTable = {                                                                               // 7
  accentColor: [],                                                                                                   // 8
  accentContrastColor: [],                                                                                           // 9
  secondaryColor: [],                                                                                                // 10
  secondaryContrastColor: []                                                                                         // 11
};                                                                                                                   // 12
                                                                                                                     // 13
Telescope.colorElements.defaultColors = {                                                                            // 14
  accentColor: "#DD3416", // red                                                                                     // 15
  accentContrastColor: "#ffffff", // white                                                                           // 16
  secondaryColor: "#4e555d", // slate                                                                                // 17
  secondaryContrastColor: "#ffffff" // white                                                                         // 18
};                                                                                                                   // 19
                                                                                                                     // 20
/**                                                                                                                  // 21
 * Register an element to use a custom color                                                                         // 22
 * @param {string} selector - the CSS selector of the element                                                        // 23
 * @param {string} color - the color. Either `accentColor`, `accentContrastColor`, `secondaryColor`, or `secondaryContrastColor`
 * @param {string} [property=color] - the property to colorize. Usually `color`, `background-color`, `border-color`, etc. 
 */                                                                                                                  // 26
Telescope.colorElements.add = function (selector, color, property) {                                                 // 27
  var element = {selector: selector};                                                                                // 28
                                                                                                                     // 29
  if (typeof property !== "undefined")                                                                               // 30
    element.property = property;                                                                                     // 31
                                                                                                                     // 32
  Telescope.colorElements.colorTable[color].push(element);                                                           // 33
};                                                                                                                   // 34
                                                                                                                     // 35
// shortcuts                                                                                                         // 36
var setShortcut = function(name) {                                                                                   // 37
  return function (selector, property) {                                                                             // 38
    Telescope.colorElements.add(selector, name, property);                                                           // 39
  };                                                                                                                 // 40
};                                                                                                                   // 41
                                                                                                                     // 42
var accent = setShortcut('accentColor');                                                                             // 43
var accentContrast = setShortcut('accentContrastColor');                                                             // 44
var secondary = setShortcut('secondaryColor');                                                                       // 45
var secondaryContrast = setShortcut('secondaryContrastColor');                                                       // 46
                                                                                                                     // 47
// accentColor                                                                                                       // 48
                                                                                                                     // 49
accent("a:hover");                                                                                                   // 50
accent(".post-content .post-heading .post-title:hover");                                                             // 51
accent(".upvoted .upvote-link");                                                                                     // 52
accent(".downvoted .downvote-link");                                                                                 // 53
accent(".upvoted .upvote");                                                                                          // 54
accent(".downvoted .downvote");                                                                                      // 55
accent(".toggle-actions-link");                                                                                      // 56
accent(".post-meta a:hover");                                                                                        // 57
accent(".action:hover");                                                                                             // 58
accent(".post-actions .icon");                                                                                       // 59
accent(".post-share .icon-share");                                                                                   // 60
                                                                                                                     // 61
accent('input[type="submit"]', 'background-color');                                                                  // 62
accent("button", 'background-color');                                                                                // 63
accent(".button", 'background-color');                                                                               // 64
accent(".auth-buttons #login-buttons #login-buttons-password", 'background-color');                                  // 65
accent(".btn-primary", 'background-color');                                                                          // 66
accent(".header .btn-primary", 'background-color');                                                                  // 67
accent(".header .btn-primary:link", 'background-color');                                                             // 68
accent(".header .btn-primary:visited", 'background-color');                                                          // 69
accent(".error", 'background-color');                                                                                // 70
accent(".mobile-menu-button", 'background-color');                                                                   // 71
accent(".login-link-text", 'background-color');                                                                      // 72
accent(".post-category:hover", 'background-color');                                                                  // 73
                                                                                                                     // 74
accent(".icon-more", "border-color");                                                                                // 75
                                                                                                                     // 76
// accentContrastColor                                                                                               // 77
                                                                                                                     // 78
accentContrast('input[type="submit"]');                                                                              // 79
accentContrast("button");                                                                                            // 80
accentContrast(".button");                                                                                           // 81
accentContrast(".auth-buttons #login-buttons #login-buttons-password");                                              // 82
accentContrast(".btn-primary");                                                                                      // 83
accentContrast(".header .btn-primary");                                                                              // 84
accentContrast(".header .btn-primary:link");                                                                         // 85
accentContrast(".header .btn-primary:visited");                                                                      // 86
accentContrast(".error");                                                                                            // 87
accentContrast(".header a.mobile-menu-button");                                                                      // 88
accentContrast("login-link-text");                                                                                   // 89
accentContrast(".post-category:hover");                                                                              // 90
                                                                                                                     // 91
// secondaryColor                                                                                                    // 92
                                                                                                                     // 93
secondary(".header", "background-color");                                                                            // 94
                                                                                                                     // 95
// secondaryContrastColor                                                                                            // 96
                                                                                                                     // 97
secondaryContrast(".header");                                                                                        // 98
secondaryContrast(".header .logo a");                                                                                // 99
secondaryContrast(".header .logo a:visited");                                                                        // 100
                                                                                                                     // 101
secondaryContrast(".header .dropdown-top-level", "border-color");                                                    // 102
secondaryContrast(".header .dropdown-accordion .show-more", "border-color");                                         // 103
                                                                                                                     // 104
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/telescope:lib/lib/icons.js                                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// ------------------------------ Dynamic Icons ------------------------------ //                                    // 1
                                                                                                                     // 2
/**                                                                                                                  // 3
 * Take an icon name (such as "open") and return the HTML code to display the icon                                   // 4
 * @param {string} iconName - the name of the icon                                                                   // 5
 * @param {string} [iconClass] - an optional class to assign to the icon                                             // 6
 */                                                                                                                  // 7
Telescope.utils.getIcon = function (iconName, iconClass) {                                                           // 8
  var icons = Telescope.utils.icons;                                                                                 // 9
  var iconCode = !!icons[iconName] ? icons[iconName] : iconName;                                                     // 10
  var iconClass = (typeof iconClass === 'string') ? ' '+iconClass : '';                                              // 11
  return '<i class="icon fa fa-' + iconCode + ' icon-' + iconName + iconClass+ '" aria-hidden="true"></i>';          // 12
};                                                                                                                   // 13
                                                                                                                     // 14
/**                                                                                                                  // 15
 * A directory of icon keys and icon codes                                                                           // 16
 */                                                                                                                  // 17
Telescope.utils.icons = {                                                                                            // 18
  expand: "plus",                                                                                                    // 19
  collapse: "minus",                                                                                                 // 20
  close: "times",                                                                                                    // 21
  upvote: "chevron-up",                                                                                              // 22
  voted: "check",                                                                                                    // 23
  downvote: "chevron-down",                                                                                          // 24
  facebook: "facebook-square",                                                                                       // 25
  twitter: "twitter",                                                                                                // 26
  googleplus: "google-plus",                                                                                         // 27
  linkedin: "linkedin-square",                                                                                       // 28
  comment: "comment-o",                                                                                              // 29
  share: "share-square-o",                                                                                           // 30
  more: "ellipsis-h",                                                                                                // 31
  menu: "bars",                                                                                                      // 32
  subscribe: "envelope-o",                                                                                           // 33
  delete: "trash-o",                                                                                                 // 34
  edit: "pencil",                                                                                                    // 35
  popularity: "fire",                                                                                                // 36
  time: "clock-o",                                                                                                   // 37
  best: "star",                                                                                                      // 38
  search: "search"                                                                                                   // 39
};                                                                                                                   // 40
                                                                                                                     // 41
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:lib'] = {
  Telescope: Telescope,
  _: _,
  getTemplate: getTemplate,
  templates: templates,
  themeSettings: themeSettings,
  getVotePower: getVotePower
};

})();

//# sourceMappingURL=telescope_lib.js.map
