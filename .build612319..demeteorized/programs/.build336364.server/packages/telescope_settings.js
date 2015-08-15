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
var Settings, debug, __, translations;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/lib/settings.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * The global namespace for Settings.                                                                                  // 2
 * @namespace Settings                                                                                                 // 3
 */                                                                                                                    // 4
Settings = new Mongo.Collection("settings");                                                                           // 5
                                                                                                                       // 6
Settings.schema = new SimpleSchema({                                                                                   // 7
  title: {                                                                                                             // 8
    type: String,                                                                                                      // 9
    optional: true,                                                                                                    // 10
    autoform: {                                                                                                        // 11
      group: "01_general"                                                                                              // 12
    }                                                                                                                  // 13
  },                                                                                                                   // 14
  siteUrl: {                                                                                                           // 15
    type: String,                                                                                                      // 16
    optional: true,                                                                                                    // 17
    // regEx: SimpleSchema.RegEx.Url,                                                                                  // 18
    autoform: {                                                                                                        // 19
      group: "01_general",                                                                                             // 20
      type: "bootstrap-url",                                                                                           // 21
      instructions: 'Your site\'s URL (with trailing "/"). Will default to Meteor.absoluteUrl()'                       // 22
    }                                                                                                                  // 23
  },                                                                                                                   // 24
  tagline: {                                                                                                           // 25
    type: String,                                                                                                      // 26
    optional: true,                                                                                                    // 27
    autoform: {                                                                                                        // 28
      group: "01_general"                                                                                              // 29
    }                                                                                                                  // 30
  },                                                                                                                   // 31
  description: {                                                                                                       // 32
    type: String,                                                                                                      // 33
    optional: true,                                                                                                    // 34
    autoform: {                                                                                                        // 35
      group: "01_general",                                                                                             // 36
      rows: 5,                                                                                                         // 37
      instructions: 'A short description used for SEO purposes.'                                                       // 38
    }                                                                                                                  // 39
  },                                                                                                                   // 40
  siteImage: {                                                                                                         // 41
    type: String,                                                                                                      // 42
    optional: true,                                                                                                    // 43
    regEx: SimpleSchema.RegEx.Url,                                                                                     // 44
    autoform: {                                                                                                        // 45
      group: "01_general",                                                                                             // 46
      instructions: "URL to an image for the open graph image tag for all pages"                                       // 47
    }                                                                                                                  // 48
  },                                                                                                                   // 49
  navLayout: {                                                                                                         // 50
    type: String,                                                                                                      // 51
    optional: true,                                                                                                    // 52
    autoform: {                                                                                                        // 53
      group: "01_general",                                                                                             // 54
      instructions: 'The layout used for the main menu',                                                               // 55
      options: [                                                                                                       // 56
        {value: 'top-nav', label: 'Top'},                                                                              // 57
        {value: 'side-nav', label: 'Side'}                                                                             // 58
      ]                                                                                                                // 59
    }                                                                                                                  // 60
  },                                                                                                                   // 61
  requireViewInvite: {                                                                                                 // 62
    type: Boolean,                                                                                                     // 63
    optional: true,                                                                                                    // 64
    autoform: {                                                                                                        // 65
      group: 'invites',                                                                                                // 66
      leftLabel: 'Require View Invite'                                                                                 // 67
    }                                                                                                                  // 68
  },                                                                                                                   // 69
  requirePostInvite: {                                                                                                 // 70
    type: Boolean,                                                                                                     // 71
    optional: true,                                                                                                    // 72
    autoform: {                                                                                                        // 73
      group: 'invites',                                                                                                // 74
      leftLabel: 'Require Post Invite'                                                                                 // 75
    }                                                                                                                  // 76
  },                                                                                                                   // 77
  requirePostsApproval: {                                                                                              // 78
    type: Boolean,                                                                                                     // 79
    optional: true,                                                                                                    // 80
    autoform: {                                                                                                        // 81
      group: "01_general",                                                                                             // 82
      instructions: "Posts must be approved by admin",                                                                 // 83
      leftLabel: "Require Posts Approval"                                                                              // 84
    }                                                                                                                  // 85
  },                                                                                                                   // 86
  enableDownvotes: {                                                                                                   // 87
    type: Boolean,                                                                                                     // 88
    optional: true,                                                                                                    // 89
    defaultValue: false,                                                                                               // 90
    autoform: {                                                                                                        // 91
      group: "01_general",                                                                                             // 92
      instructions: 'Enable downvotes',                                                                                // 93
      leftLabel: "Enable downvotes"                                                                                    // 94
    }                                                                                                                  // 95
  },                                                                                                                   // 96
  defaultEmail: {                                                                                                      // 97
    type: String,                                                                                                      // 98
    optional: true,                                                                                                    // 99
    private: true,                                                                                                     // 100
    autoform: {                                                                                                        // 101
      group: "06_email",                                                                                               // 102
      instructions: 'The address all outgoing emails will be sent from.',                                              // 103
      class: "private-field"                                                                                           // 104
    }                                                                                                                  // 105
  },                                                                                                                   // 106
  mailUrl: {                                                                                                           // 107
    type: String,                                                                                                      // 108
    optional: true,                                                                                                    // 109
    private: true,                                                                                                     // 110
    autoform: {                                                                                                        // 111
      group: "06_email",                                                                                               // 112
      instructions: 'MAIL_URL environment variable (requires restart).',                                               // 113
      class: "private-field"                                                                                           // 114
    }                                                                                                                  // 115
  },                                                                                                                   // 116
  scoreUpdateInterval: {                                                                                               // 117
    type: Number,                                                                                                      // 118
    optional: true,                                                                                                    // 119
    defaultValue: 30,                                                                                                  // 120
    private: true,                                                                                                     // 121
    autoform: {                                                                                                        // 122
      group: '01_general',                                                                                             // 123
      instructions: 'How often to recalculate scores, in seconds (default to 30)',                                     // 124
      class: "private-field"                                                                                           // 125
    }                                                                                                                  // 126
  },                                                                                                                   // 127
  defaultView: {                                                                                                       // 128
    type: String,                                                                                                      // 129
    optional: true,                                                                                                    // 130
    autoform: {                                                                                                        // 131
      group: "02_posts",                                                                                               // 132
      instructions: 'The view used for the front page',                                                                // 133
      options: function () {                                                                                           // 134
        return _.map(Telescope.menuItems.get("viewsMenu"), function (view) {                                           // 135
          return {                                                                                                     // 136
            value: Telescope.utils.camelCaseify(view.label),                                                           // 137
            label: view.label                                                                                          // 138
          };                                                                                                           // 139
        });                                                                                                            // 140
      }                                                                                                                // 141
    }                                                                                                                  // 142
  },                                                                                                                   // 143
  postsLayout: {                                                                                                       // 144
    type: String,                                                                                                      // 145
    optional: true,                                                                                                    // 146
    autoform: {                                                                                                        // 147
      group: "02_posts",                                                                                               // 148
      instructions: 'The layout used for post lists',                                                                  // 149
      options: [                                                                                                       // 150
        {value: 'posts-list', label: 'List'},                                                                          // 151
        {value: 'posts-grid', label: 'Grid'}                                                                           // 152
      ]                                                                                                                // 153
    }                                                                                                                  // 154
  },                                                                                                                   // 155
  postViews: {                                                                                                         // 156
    type: [String],                                                                                                    // 157
    optional: true,                                                                                                    // 158
    autoform: {                                                                                                        // 159
      group: "02_posts",                                                                                               // 160
      instructions: 'Posts views showed in the views menu',                                                            // 161
      editable: true,                                                                                                  // 162
      noselect: true,                                                                                                  // 163
      options: function () {                                                                                           // 164
        return _.map(Telescope.menuItems.get("viewsMenu"), function (item){                                            // 165
          return {                                                                                                     // 166
            value: item.route,                                                                                         // 167
            label: item.label                                                                                          // 168
          };                                                                                                           // 169
        });                                                                                                            // 170
      }                                                                                                                // 171
    }                                                                                                                  // 172
  },                                                                                                                   // 173
  postInterval: {                                                                                                      // 174
    type: Number,                                                                                                      // 175
    optional: true,                                                                                                    // 176
    defaultValue: 30,                                                                                                  // 177
    autoform: {                                                                                                        // 178
      group: "02_posts",                                                                                               // 179
      instructions: 'Minimum time between posts, in seconds (defaults to 30)'                                          // 180
    }                                                                                                                  // 181
  },                                                                                                                   // 182
  outsideLinksPointTo: {                                                                                               // 183
    type: String,                                                                                                      // 184
    optional: true,                                                                                                    // 185
    autoform: {                                                                                                        // 186
      group: "02_posts",                                                                                               // 187
      options: [                                                                                                       // 188
        {value: 'page', label: 'Discussion page'},                                                                     // 189
        {value: 'link', label: 'Outgoing link'}                                                                        // 190
      ]                                                                                                                // 191
    }                                                                                                                  // 192
  },                                                                                                                   // 193
  commentInterval: {                                                                                                   // 194
    type: Number,                                                                                                      // 195
    optional: true,                                                                                                    // 196
    defaultValue: 15,                                                                                                  // 197
    autoform: {                                                                                                        // 198
      group: "03_comments",                                                                                            // 199
      instructions: 'Minimum time between comments, in seconds (defaults to 15)'                                       // 200
    }                                                                                                                  // 201
  },                                                                                                                   // 202
  maxPostsPerDay: {                                                                                                    // 203
    type: Number,                                                                                                      // 204
    optional: true,                                                                                                    // 205
    defaultValue: 30,                                                                                                  // 206
    autoform: {                                                                                                        // 207
      group: "02_posts",                                                                                               // 208
      instructions: 'Maximum number of posts a user can post in a day (default to 30).'                                // 209
    }                                                                                                                  // 210
  },                                                                                                                   // 211
  startInvitesCount: {                                                                                                 // 212
    type: Number,                                                                                                      // 213
    defaultValue: 3,                                                                                                   // 214
    optional: true,                                                                                                    // 215
    autoform: {                                                                                                        // 216
      group: 'invites'                                                                                                 // 217
    }                                                                                                                  // 218
  },                                                                                                                   // 219
  postsPerPage: {                                                                                                      // 220
    type: Number,                                                                                                      // 221
    defaultValue: 10,                                                                                                  // 222
    optional: true,                                                                                                    // 223
    autoform: {                                                                                                        // 224
      group: "02_posts"                                                                                                // 225
    }                                                                                                                  // 226
  },                                                                                                                   // 227
  logoUrl: {                                                                                                           // 228
    type: String,                                                                                                      // 229
    optional: true,                                                                                                    // 230
    autoform: {                                                                                                        // 231
      group: "04_logo"                                                                                                 // 232
    }                                                                                                                  // 233
  },                                                                                                                   // 234
  logoHeight: {                                                                                                        // 235
    type: Number,                                                                                                      // 236
    optional: true,                                                                                                    // 237
    autoform: {                                                                                                        // 238
      group: "04_logo"                                                                                                 // 239
    }                                                                                                                  // 240
  },                                                                                                                   // 241
  logoWidth: {                                                                                                         // 242
    type: Number,                                                                                                      // 243
    optional: true,                                                                                                    // 244
    autoform: {                                                                                                        // 245
      group: "04_logo"                                                                                                 // 246
    }                                                                                                                  // 247
  },                                                                                                                   // 248
  faviconUrl: {                                                                                                        // 249
    type: String,                                                                                                      // 250
    optional: true,                                                                                                    // 251
    autoform: {                                                                                                        // 252
      group: "04_logo"                                                                                                 // 253
    }                                                                                                                  // 254
  },                                                                                                                   // 255
  language: {                                                                                                          // 256
    type: String,                                                                                                      // 257
    defaultValue: 'en',                                                                                                // 258
    optional: true,                                                                                                    // 259
    autoform: {                                                                                                        // 260
      group: "01_general",                                                                                             // 261
      instructions: 'The app\'s language. Defaults to English.',                                                       // 262
      options: function () {                                                                                           // 263
        var languages = _.map(TAPi18n.getLanguages(), function (item, key) {                                           // 264
          return {                                                                                                     // 265
            value: key,                                                                                                // 266
            label: item.name                                                                                           // 267
          };                                                                                                           // 268
        });                                                                                                            // 269
        return languages;                                                                                              // 270
      }                                                                                                                // 271
    }                                                                                                                  // 272
  },                                                                                                                   // 273
  backgroundCSS: {                                                                                                     // 274
    type: String,                                                                                                      // 275
    optional: true,                                                                                                    // 276
    autoform: {                                                                                                        // 277
      group: 'extras',                                                                                                 // 278
      instructions: 'CSS code for the <body>\'s "background" property',                                                // 279
      rows: 5                                                                                                          // 280
    }                                                                                                                  // 281
  },                                                                                                                   // 282
  accentColor: {                                                                                                       // 283
    type: String,                                                                                                      // 284
    optional: true,                                                                                                    // 285
    autoform: {                                                                                                        // 286
      group: "05_colors",                                                                                              // 287
      instructions: 'Used for button backgrounds.'                                                                     // 288
    }                                                                                                                  // 289
  },                                                                                                                   // 290
  accentContrastColor: {                                                                                               // 291
    type: String,                                                                                                      // 292
    optional: true,                                                                                                    // 293
    autoform: {                                                                                                        // 294
      group: "05_colors",                                                                                              // 295
      instructions: 'Used for button text.'                                                                            // 296
    }                                                                                                                  // 297
  },                                                                                                                   // 298
  secondaryColor: {                                                                                                    // 299
    type: String,                                                                                                      // 300
    optional: true,                                                                                                    // 301
    autoform: {                                                                                                        // 302
      group: "05_colors",                                                                                              // 303
      instructions: 'Used for the navigation background.'                                                              // 304
    }                                                                                                                  // 305
  },                                                                                                                   // 306
  secondaryContrastColor: {                                                                                            // 307
    type: String,                                                                                                      // 308
    optional: true,                                                                                                    // 309
    autoform: {                                                                                                        // 310
      group: "05_colors",                                                                                              // 311
      instructions: 'Used for header text.'                                                                            // 312
    }                                                                                                                  // 313
  },                                                                                                                   // 314
  fontUrl: {                                                                                                           // 315
    type: String,                                                                                                      // 316
    optional: true,                                                                                                    // 317
    autoform: {                                                                                                        // 318
      group: 'fonts',                                                                                                  // 319
      instructions: '@import URL (e.g. https://fonts.googleapis.com/css?family=Source+Sans+Pro)'                       // 320
    }                                                                                                                  // 321
  },                                                                                                                   // 322
  fontFamily: {                                                                                                        // 323
    type: String,                                                                                                      // 324
    optional: true,                                                                                                    // 325
    autoform: {                                                                                                        // 326
      group: 'fonts',                                                                                                  // 327
      instructions: 'font-family (e.g. "Source Sans Pro", sans-serif)'                                                 // 328
    }                                                                                                                  // 329
  },                                                                                                                   // 330
  twitterAccount: {                                                                                                    // 331
    type: String,                                                                                                      // 332
    optional: true,                                                                                                    // 333
    autoform: {                                                                                                        // 334
      group: "07_integrations"                                                                                         // 335
    }                                                                                                                  // 336
  },                                                                                                                   // 337
  googleAnalyticsId: {                                                                                                 // 338
    type: String,                                                                                                      // 339
    optional: true,                                                                                                    // 340
    autoform: {                                                                                                        // 341
      group: "07_integrations"                                                                                         // 342
    }                                                                                                                  // 343
  },                                                                                                                   // 344
  mixpanelId: {                                                                                                        // 345
    type: String,                                                                                                      // 346
    optional: true,                                                                                                    // 347
    autoform: {                                                                                                        // 348
      group: "07_integrations"                                                                                         // 349
    }                                                                                                                  // 350
  },                                                                                                                   // 351
  clickyId: {                                                                                                          // 352
    type: String,                                                                                                      // 353
    optional: true,                                                                                                    // 354
    autoform: {                                                                                                        // 355
      group: "07_integrations"                                                                                         // 356
    }                                                                                                                  // 357
  },                                                                                                                   // 358
  footerCode: {                                                                                                        // 359
    type: String,                                                                                                      // 360
    optional: true,                                                                                                    // 361
    autoform: {                                                                                                        // 362
      group: 'extras',                                                                                                 // 363
      instructions: 'Footer content (accepts Markdown).',                                                              // 364
      rows: 5                                                                                                          // 365
    }                                                                                                                  // 366
  },                                                                                                                   // 367
  extraCode: {                                                                                                         // 368
    type: String,                                                                                                      // 369
    optional: true,                                                                                                    // 370
    autoform: {                                                                                                        // 371
      group: 'extras',                                                                                                 // 372
      instructions: 'Any extra HTML code you want to include on every page.',                                          // 373
      rows: 5                                                                                                          // 374
    }                                                                                                                  // 375
  },                                                                                                                   // 376
  extraCSS: {                                                                                                          // 377
    type: String,                                                                                                      // 378
    optional: true,                                                                                                    // 379
    autoform: {                                                                                                        // 380
      group: 'extras',                                                                                                 // 381
      instructions: 'Any extra CSS you want to include on every page.',                                                // 382
      rows: 5                                                                                                          // 383
    }                                                                                                                  // 384
  },                                                                                                                   // 385
  emailFooter: {                                                                                                       // 386
    type: String,                                                                                                      // 387
    optional: true,                                                                                                    // 388
    private: true,                                                                                                     // 389
    autoform: {                                                                                                        // 390
      group: "06_email",                                                                                               // 391
      instructions: 'Content that will appear at the bottom of outgoing emails (accepts HTML).',                       // 392
      rows: 5,                                                                                                         // 393
      class: "private-field"                                                                                           // 394
    }                                                                                                                  // 395
  },                                                                                                                   // 396
  notes: {                                                                                                             // 397
    type: String,                                                                                                      // 398
    optional: true,                                                                                                    // 399
    private: true,                                                                                                     // 400
    autoform: {                                                                                                        // 401
      group: 'extras',                                                                                                 // 402
      instructions: 'You can store any notes or extra information here.',                                              // 403
      rows: 5,                                                                                                         // 404
      class: "private-field"                                                                                           // 405
    }                                                                                                                  // 406
  },                                                                                                                   // 407
  debug: {                                                                                                             // 408
    type: Boolean,                                                                                                     // 409
    optional: true,                                                                                                    // 410
    autoform: {                                                                                                        // 411
      group: 'debug',                                                                                                  // 412
      instructions: 'Enable debug mode for more details console logs'                                                  // 413
    }                                                                                                                  // 414
  },                                                                                                                   // 415
  authMethods: {                                                                                                       // 416
    type: [String],                                                                                                    // 417
    optional: true,                                                                                                    // 418
    autoform: {                                                                                                        // 419
      group: 'auth',                                                                                                   // 420
      editable: true,                                                                                                  // 421
      noselect: true,                                                                                                  // 422
      options: [                                                                                                       // 423
        {                                                                                                              // 424
          value: 'email',                                                                                              // 425
          label: 'Email/Password'                                                                                      // 426
        },                                                                                                             // 427
        {                                                                                                              // 428
          value: 'twitter',                                                                                            // 429
          label: 'Twitter'                                                                                             // 430
        },                                                                                                             // 431
        {                                                                                                              // 432
          value: 'facebook',                                                                                           // 433
          label: 'Facebook'                                                                                            // 434
        }                                                                                                              // 435
      ],                                                                                                               // 436
      instructions: 'Authentication methods (default to email only)'                                                   // 437
    }                                                                                                                  // 438
  }                                                                                                                    // 439
});                                                                                                                    // 440
                                                                                                                       // 441
                                                                                                                       // 442
Settings.schema.internationalize();                                                                                    // 443
                                                                                                                       // 444
Settings.attachSchema(Settings.schema);                                                                                // 445
                                                                                                                       // 446
Settings.get = function(setting, defaultValue) {                                                                       // 447
  var settings = Settings.find().fetch()[0];                                                                           // 448
                                                                                                                       // 449
  if (Meteor.isServer && Meteor.settings && !!Meteor.settings[setting]) { // if on the server, look in Meteor.settings // 450
    return Meteor.settings[setting];                                                                                   // 451
                                                                                                                       // 452
  } else if (Meteor.settings && Meteor.settings.public && !!Meteor.settings.public[setting]) { // look in Meteor.settings.public
    return Meteor.settings.public[setting];                                                                            // 454
                                                                                                                       // 455
  } else if(settings && (typeof settings[setting] !== 'undefined')) { // look in Settings collection                   // 456
    return settings[setting];                                                                                          // 457
                                                                                                                       // 458
  } else if (typeof defaultValue !== 'undefined') { // fallback to default                                             // 459
    return  defaultValue;                                                                                              // 460
                                                                                                                       // 461
  } else { // or return undefined                                                                                      // 462
    return undefined;                                                                                                  // 463
  }                                                                                                                    // 464
};                                                                                                                     // 465
                                                                                                                       // 466
                                                                                                                       // 467
                                                                                                                       // 468
/**                                                                                                                    // 469
 * Add trailing slash if needed on insert                                                                              // 470
 */                                                                                                                    // 471
Settings.before.insert(function (userId, doc) {                                                                        // 472
  if(doc.siteUrl && doc.siteUrl.match(/\//g).length === 2) {                                                           // 473
    doc.siteUrl = doc.siteUrl + "/";                                                                                   // 474
  }                                                                                                                    // 475
});                                                                                                                    // 476
                                                                                                                       // 477
/**                                                                                                                    // 478
 * Add trailing slash if needed on update                                                                              // 479
 */                                                                                                                    // 480
Settings.before.update(function (userId, doc, fieldNames, modifier) {                                                  // 481
  if(modifier.$set && modifier.$set.siteUrl && modifier.$set.siteUrl.match(/\//g).length === 2) {                      // 482
    modifier.$set.siteUrl = modifier.$set.siteUrl + "/";                                                               // 483
  }                                                                                                                    // 484
});                                                                                                                    // 485
                                                                                                                       // 486
Meteor.startup(function () {                                                                                           // 487
  Settings.allow({                                                                                                     // 488
    insert: Users.is.adminById,                                                                                        // 489
    update: Users.is.adminById,                                                                                        // 490
    remove: Users.is.adminById                                                                                         // 491
  });                                                                                                                  // 492
});                                                                                                                    // 493
                                                                                                                       // 494
Meteor.startup(function () {                                                                                           // 495
  // override Meteor.absoluteUrl() with URL provided in settings                                                       // 496
  Meteor.absoluteUrl.defaultOptions.rootUrl = Settings.get('siteUrl', Meteor.absoluteUrl());                           // 497
  debug = Settings.get('debug', false);                                                                                // 498
});                                                                                                                    // 499
                                                                                                                       // 500
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/lib/router.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
  // Settings                                                                                                          // 2
                                                                                                                       // 3
  Router.route('/settings', {                                                                                          // 4
    controller: Telescope.controllers.admin,                                                                           // 5
    name: 'settings',                                                                                                  // 6
    // layoutTemplate: 'adminLayout',                                                                                  // 7
    data: function () {                                                                                                // 8
      // we only have one set of settings for now                                                                      // 9
                                                                                                                       // 10
      var settings = Settings.findOne();                                                                               // 11
      return {                                                                                                         // 12
        hasSettings: !!settings,                                                                                       // 13
        settings: settings                                                                                             // 14
      };                                                                                                               // 15
    }                                                                                                                  // 16
  });                                                                                                                  // 17
});                                                                                                                    // 18
                                                                                                                       // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/lib/menus.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Telescope.menuItems.add("adminMenu", [                                                                                 // 1
  {                                                                                                                    // 2
    route: 'settings',                                                                                                 // 3
    label: 'settings',                                                                                                 // 4
    description: 'telescope_settings_panel'                                                                            // 5
  }                                                                                                                    // 6
]);                                                                                                                    // 7
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/package-i18n.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
TAPi18n.packages["telescope:settings"] = {"translation_function_name":"__","helper_name":"_","namespace":"project"};   // 1
                                                                                                                       // 2
// define package's translation function (proxy to the i18next)                                                        // 3
__ = TAPi18n._getPackageI18nextProxy("project");                                                                       // 4
                                                                                                                       // 5
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/lib/server/publications.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.publish('settings', function() {                                                                                // 1
  var options = {};                                                                                                    // 2
  var privateFields = {};                                                                                              // 3
                                                                                                                       // 4
  // look at Settings.simpleSchema._schema to see which fields should be kept private                                  // 5
  _.each(Settings.simpleSchema()._schema, function (property, key) {                                                   // 6
    if (property.private)                                                                                              // 7
      privateFields[key] = false;                                                                                      // 8
  });                                                                                                                  // 9
                                                                                                                       // 10
  if(!Users.is.adminById(this.userId)){                                                                                // 11
    options = _.extend(options, {                                                                                      // 12
      fields: privateFields                                                                                            // 13
    });                                                                                                                // 14
  }                                                                                                                    // 15
                                                                                                                       // 16
  return Settings.find({}, options);                                                                                   // 17
});                                                                                                                    // 18
                                                                                                                       // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/Applications/MAMP/websites/stewardsof/packages/telescope-settings/i18n/ar.i18n.js       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:settings",                                                                               // 2
    namespace = "telescope:settings";                                                                                  // 3
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
_.extend(TAPi18n.translations["ar"][namespace], {"title":"العنوان","siteUrl":"رابط الموقع","tagline":"شعار","requireViewInvite":"مشاهدة مقيدة","requirePostInvite":"مشاركة مقيدة","requirePostsApproval":"موافقة مطلوبة","defaultEmail":"البريد اﻻلكتروني","scoreUpdateInterval":"تحديث النتيجة","defaultView":"مشهد افتراضي","postInterval":"فاصل المشاركات","commentInterval":"فاصل التعليقات","maxPostsPerDay":"العدد اﻻقصى للمشاركات في اليوم","startInvitesCount":"الدعوات منذ البريداية","postsPerPage":"المشاركات في الصفحة","logoUrl":"رابط الشارة","logoHeight":"طول الشارة","logoWidth":"عرض الشارة","language":"اللغة","backgroundCSS":"CSS للخلفية","buttonColor":"لون اﻻزرار","buttonTextColor":"لون نص اﻻزرار","headerColor":"لون الجزء الرأسي","headerTextColor":"لون نص الجزء الراسي","twitterAccount":"حساب تويتر","googleAnalyticsId":"معرف قوقل تحليﻻت","mixpanelId":"ID Mixpanel","clickyId":"ID Clicky","footerCode":"شفرة الجزء السفلي","extraCode":"شفرات زائدة","emailFooter":"الجزء السفلي لﻻيميل","notes":"مﻻحظات","debug":"وضع المعالجة","fontUrl":"رابط الخط","fontFamily":"اسم الخط","authMethods":"أساليب المصادقة","faviconUrl":"رابط فافيكون","mailURL":"رابط اﻻيميل","postsLayout":"مشاركات ﻻيوت","general":"عام","invites":"دعوة","scoring":"النتيجة","logo":"شارة","extras":"إضافات","colors":"اﻻلوان","integrations":"دمج"});
TAPi18n._registerServerTranslator("ar", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/Applications/MAMP/websites/stewardsof/packages/telescope-settings/i18n/bg.i18n.js       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:settings",                                                                               // 2
    namespace = "telescope:settings";                                                                                  // 3
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
_.extend(TAPi18n.translations["bg"][namespace], {"title":"Заглавие","invites":"Покани"});                              // 16
TAPi18n._registerServerTranslator("bg", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/Applications/MAMP/websites/stewardsof/packages/telescope-settings/i18n/de.i18n.js       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:settings",                                                                               // 2
    namespace = "telescope:settings";                                                                                  // 3
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
_.extend(TAPi18n.translations["de"][namespace], {"title":"Titel"});                                                    // 16
TAPi18n._registerServerTranslator("de", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/Applications/MAMP/websites/stewardsof/packages/telescope-settings/i18n/el.i18n.js       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:settings",                                                                               // 2
    namespace = "telescope:settings";                                                                                  // 3
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
_.extend(TAPi18n.translations["el"][namespace], {"title":"Τίτλος","siteUrl":"URL Ιστοσελίδας","tagline":"Ετικέτα","requireViewInvite":"Να απαιτείται πρόσκληση για προβολή","requirePostInvite":"Να απαιτείται πρόσκληση για δημοσίευση","requirePostsApproval":"Να απαιτείται έγκριση των δημοσιεύσεων","defaultEmail":"Προεπιλεγμένο Email","scoreUpdateInterval":"Χρόνος ανανέωσης Σκορ","defaultView":"Προεπιλεγμένη Προβολή","postInterval":"Χρόνος ανανέωσης δημοσίευσης","commentInterval":"Χρόνος ανανέωσης σχολίου","maxPostsPerDay":"Μέγιστες δημοσιεύσεις ανα ημέρα","postsPerPage":"Δημοσιεύσεις ανα ημέρα","logoUrl":"URL Λογότυπου","logoHeight":"Υψος Λογότυπου","logoWidth":"Πλάτος Λογότυπου","language":"Γλώσσα","buttonColor":"Χρώμα κουμπιού","buttonTextColor":"Χρώμα κειμένου κουμπιού","headerColor":"Χρώμα Επικεφαλίδας","headerTextColor":"Χρώμα κειμένου Επικεφαλίδας","twitterAccount":"Λογαριασμός Twitter","notes":"Σημειώσεις","postsLayout":"Στύλ Δημοσιεύσεων","general":"Γενικά","invites":"Προσκλήσεις","scoring":"Σκορ","logo":"Λογότυπο","extras":"Extras","colors":"Χρώματα","integrations":"Προσθήκες"});
TAPi18n._registerServerTranslator("el", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/Applications/MAMP/websites/stewardsof/packages/telescope-settings/i18n/en.i18n.js       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:settings",                                                                               // 2
    namespace = "telescope:settings";                                                                                  // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
// integrate the fallback language translations                                                                        // 8
translations = {};                                                                                                     // 9
translations[namespace] = {"settings_saved":"Settings saved","title":"Title","description":"Description","siteUrl":"Site URL","tagline":"Tagline","requireViewInvite":"Require Invite to View","requirePostInvite":"Require Invite to Post","requirePostsApproval":"Require Posts to be Approved","defaultEmail":"Default Email","scoreUpdateInterval":"Score Update Interval","defaultView":"Default View","postInterval":"Post Interval","commentInterval":"Comment Interval","maxPostsPerDay":"Max Posts Per Day","startInvitesCount":"Invites Start Count","postsPerPage":"Posts Per Page","logoUrl":"Logo URL","logoHeight":"Logo Height","logoWidth":"Logo Width","language":"Language","backgroundCSS":"Background CSS","buttonColor":"Button Color","buttonTextColor":"Button Text Color","headerColor":"Header Color","headerTextColor":"Header Text Color","twitterAccount":"Twitter Account","googleAnalyticsId":"Google Analytics ID","mixpanelId":"Mixpanel ID","clickyId":"Clicky ID","footerCode":"Footer Code","extraCode":"Extra Code","extraCSS":"Extra CSS","emailFooter":"Email Footer","notes":"Notes","debug":"Debug Mode","fontUrl":"Font URL","fontFamily":"Font Family","authMethods":"Authentication Methods","faviconUrl":"Favicon URL","mailURL":"MailURL","postsLayout":"Posts Layout","siteImage":"Site Image","accentColor":"Accent Color","accentContrastColor":"Accent Contrast Color","secondaryColor":"Secondary Color","secondaryContrastColor":"Secondary Contrast Color","postViews":"Post Views","navLayout":"Navigation Layout","mailUrl":"Mail URL","general":"General","invites":"Invites","scoring":"Scoring","logo":"Logo","extras":"Extras","colors":"Colors","integrations":"Integrations"};
TAPi18n._loadLangFileObject("en", translations);                                                                       // 11
TAPi18n._registerServerTranslator("en", namespace);                                                                    // 12
                                                                                                                       // 13
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/Applications/MAMP/websites/stewardsof/packages/telescope-settings/i18n/es.i18n.js       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "telescope:settings",                                                                               // 2
    namespace = "telescope:settings";                                                                                  // 3
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
_.extend(TAPi18n.translations["es"][namespace], {"title":"Título","siteUrl":"URL del sitio web","tagline":"Lema","requireViewInvite":"Requerir Invitación para Ver","requirePostInvite":"Requerir invitación para Publicar","requirePostsApproval":"Requerir que los Posts sean Aprobados","defaultEmail":"Correo electrónico predeterminado","defaultView":"Vista Predeterminada","invites":"Invitaciones"});
TAPi18n._registerServerTranslator("es", namespace);                                                                    // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/Applications/MAMP/websites/stewardsof/packages/telescope-settings/i18n/en.i18n.js       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "project",                                                                                          // 2
    namespace = "project";                                                                                             // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
TAPi18n._enable({"helper_name":"_","supported_languages":null,"i18n_files_route":"/tap-i18n","cdn_path":null});        // 8
TAPi18n.languages_names["en"] = ["English","English"];                                                                 // 9
// integrate the fallback language translations                                                                        // 10
translations = {};                                                                                                     // 11
translations[namespace] = {"settings_saved":"Settings saved","title":"Title","description":"Description","siteUrl":"Site URL","tagline":"Tagline","requireViewInvite":"Require Invite to View","requirePostInvite":"Require Invite to Post","requirePostsApproval":"Require Posts to be Approved","defaultEmail":"Default Email","scoreUpdateInterval":"Score Update Interval","defaultView":"Default View","postInterval":"Post Interval","commentInterval":"Comment Interval","maxPostsPerDay":"Max Posts Per Day","startInvitesCount":"Invites Start Count","postsPerPage":"Posts Per Page","logoUrl":"Logo URL","logoHeight":"Logo Height","logoWidth":"Logo Width","language":"Language","backgroundCSS":"Background CSS","buttonColor":"Button Color","buttonTextColor":"Button Text Color","headerColor":"Header Color","headerTextColor":"Header Text Color","twitterAccount":"Twitter Account","googleAnalyticsId":"Google Analytics ID","mixpanelId":"Mixpanel ID","clickyId":"Clicky ID","footerCode":"Footer Code","extraCode":"Extra Code","extraCSS":"Extra CSS","emailFooter":"Email Footer","notes":"Notes","debug":"Debug Mode","fontUrl":"Font URL","fontFamily":"Font Family","authMethods":"Authentication Methods","faviconUrl":"Favicon URL","mailURL":"MailURL","postsLayout":"Posts Layout","siteImage":"Site Image","accentColor":"Accent Color","accentContrastColor":"Accent Contrast Color","secondaryColor":"Secondary Color","secondaryContrastColor":"Secondary Contrast Color","postViews":"Post Views","navLayout":"Navigation Layout","mailUrl":"Mail URL","general":"General","invites":"Invites","scoring":"Scoring","logo":"Logo","extras":"Extras","colors":"Colors","integrations":"Integrations"};
TAPi18n._loadLangFileObject("en", translations);                                                                       // 13
TAPi18n._registerServerTranslator("en", namespace);                                                                    // 14
                                                                                                                       // 15
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/telescope:settings/Applications/MAMP/websites/stewardsof/packages/telescope-settings/i18n/fr.i18n.js       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _ = Package.underscore._,                                                                                          // 1
    package_name = "project",                                                                                          // 2
    namespace = "project";                                                                                             // 3
                                                                                                                       // 4
if (package_name != "project") {                                                                                       // 5
    namespace = TAPi18n.packages[package_name].namespace;                                                              // 6
}                                                                                                                      // 7
TAPi18n.languages_names["fr"] = ["French (France)","Français"];                                                        // 8
if(_.isUndefined(TAPi18n.translations["fr"])) {                                                                        // 9
  TAPi18n.translations["fr"] = {};                                                                                     // 10
}                                                                                                                      // 11
                                                                                                                       // 12
if(_.isUndefined(TAPi18n.translations["fr"][namespace])) {                                                             // 13
  TAPi18n.translations["fr"][namespace] = {};                                                                          // 14
}                                                                                                                      // 15
                                                                                                                       // 16
_.extend(TAPi18n.translations["fr"][namespace], {"settings_saved":"Paramètres sauvegardés","title":"Titre","description":"Description","siteUrl":"URL du site","tagline":"Slogan","requireViewInvite":"Consultation restreinte","requirePostInvite":"Participation restreinte","requirePostsApproval":"Modération obligatoire","defaultEmail":"Email par défaut","scoreUpdateInterval":"Mise à jour du score","defaultView":"Vue par défaut","postInterval":"Interval des posts","commentInterval":"Interval des commentaires","maxPostsPerDay":"Max posts par jour","startInvitesCount":"Invitations de départ","postsPerPage":"Posts par page","logoUrl":"URL du logo","logoHeight":"Hauteur du logo","logoWidth":"Largeur du logo","language":"Langue","backgroundCSS":"CSS de fond","buttonColor":"Couleur des boutons","buttonTextColor":"Couleur du texte des boutons","headerColor":"Couleur de l'entête","headerTextColor":"Couleur du texte de l'entête","twitterAccount":"Compte Twitter","googleAnalyticsId":"ID Google Analytics","mixpanelId":"ID Mixpanel","clickyId":"ID Clicky","footerCode":"Code du pied de page","extraCode":"Code en plus","extraCSS":"CSS supplémentaire","emailFooter":"Pied de page des mails","notes":"Notes","debug":"Mode Debug","fontUrl":"URL de font","fontFamily":"Famille de font","authMethods":"Méthode d'authentification","faviconUrl":"URL de la favicon","postsLayout":"Layout des posts","siteImage":"Image du site","accentColor":"Couleur des accents","accentContrastColor":"Couleur du contraste des accents","secondaryColor":"Couleur secondaire","secondaryContrastColor":"Couleur de contraste secondaire","postViews":"Nombre de vues","navLayout":"Layout de navigation ","mailUrl":"Mail URL","general":"Général","invites":"Invitations","scoring":"Score","logo":"Logo","extras":"Extras","colors":"Couleurs","integrations":"Intégrations"});
TAPi18n._registerServerTranslator("fr", namespace);                                                                    // 18
                                                                                                                       // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['telescope:settings'] = {
  Settings: Settings
};

})();

//# sourceMappingURL=telescope_settings.js.map
