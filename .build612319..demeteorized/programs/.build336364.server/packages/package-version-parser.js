(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var PackageVersion, SemVer410;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/package-version-parser/semver410.js                                                      //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
// <METEOR>                                                                                          // 1
// Fool the module system detection code below so that it doesn't                                    // 2
// do anything special.                                                                              // 3
var exports = SemVer, module = {}, define = {};                                                      // 4
// Create a package-private variable.  Can't use SemVer because                                      // 5
// of the code that says `function SemVer(...)` below (implicitly                                    // 6
// declaring a var).  Can't use "semver" because that's a var in                                     // 7
// package-version-parser.js.                                                                        // 8
SemVer410 = SemVer;                                                                                  // 9
// </METEOR>                                                                                         // 10
                                                                                                     // 11
// export the class if we are in a Node-like system.                                                 // 12
if (typeof module === 'object' && module.exports === exports)                                        // 13
  exports = module.exports = SemVer;                                                                 // 14
                                                                                                     // 15
// The debug function is excluded entirely from the minified version.                                // 16
/* nomin */ var debug;                                                                               // 17
/* nomin */ if (typeof process === 'object' &&                                                       // 18
    /* nomin */ process.env &&                                                                       // 19
    /* nomin */ process.env.NODE_DEBUG &&                                                            // 20
    /* nomin */ /\bsemver\b/i.test(process.env.NODE_DEBUG))                                          // 21
  /* nomin */ debug = function() {                                                                   // 22
    /* nomin */ var args = Array.prototype.slice.call(arguments, 0);                                 // 23
    /* nomin */ args.unshift('SEMVER');                                                              // 24
    /* nomin */ console.log.apply(console, args);                                                    // 25
    /* nomin */ };                                                                                   // 26
/* nomin */ else                                                                                     // 27
  /* nomin */ debug = function() {};                                                                 // 28
                                                                                                     // 29
// Note: this is the semver.org version of the spec that it implements                               // 30
// Not necessarily the package version of this code.                                                 // 31
exports.SEMVER_SPEC_VERSION = '2.0.0';                                                               // 32
                                                                                                     // 33
// The actual regexps go on exports.re                                                               // 34
var re = exports.re = [];                                                                            // 35
var src = exports.src = [];                                                                          // 36
var R = 0;                                                                                           // 37
                                                                                                     // 38
// The following Regular Expressions can be used for tokenizing,                                     // 39
// validating, and parsing SemVer version strings.                                                   // 40
                                                                                                     // 41
// ## Numeric Identifier                                                                             // 42
// A single `0`, or a non-zero digit followed by zero or more digits.                                // 43
                                                                                                     // 44
var NUMERICIDENTIFIER = R++;                                                                         // 45
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';                                                              // 46
var NUMERICIDENTIFIERLOOSE = R++;                                                                    // 47
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';                                                              // 48
                                                                                                     // 49
                                                                                                     // 50
// ## Non-numeric Identifier                                                                         // 51
// Zero or more digits, followed by a letter or hyphen, and then zero or                             // 52
// more letters, digits, or hyphens.                                                                 // 53
                                                                                                     // 54
var NONNUMERICIDENTIFIER = R++;                                                                      // 55
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';                                            // 56
                                                                                                     // 57
                                                                                                     // 58
// ## Main Version                                                                                   // 59
// Three dot-separated numeric identifiers.                                                          // 60
                                                                                                     // 61
var MAINVERSION = R++;                                                                               // 62
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +                                           // 63
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +                                           // 64
                   '(' + src[NUMERICIDENTIFIER] + ')';                                               // 65
                                                                                                     // 66
var MAINVERSIONLOOSE = R++;                                                                          // 67
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +                                 // 68
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +                                 // 69
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';                                     // 70
                                                                                                     // 71
// ## Pre-release Version Identifier                                                                 // 72
// A numeric identifier, or a non-numeric identifier.                                                // 73
                                                                                                     // 74
var PRERELEASEIDENTIFIER = R++;                                                                      // 75
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +                                         // 76
                            '|' + src[NONNUMERICIDENTIFIER] + ')';                                   // 77
                                                                                                     // 78
var PRERELEASEIDENTIFIERLOOSE = R++;                                                                 // 79
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +                               // 80
                                 '|' + src[NONNUMERICIDENTIFIER] + ')';                              // 81
                                                                                                     // 82
                                                                                                     // 83
// ## Pre-release Version                                                                            // 84
// Hyphen, followed by one or more dot-separated pre-release version                                 // 85
// identifiers.                                                                                      // 86
                                                                                                     // 87
var PRERELEASE = R++;                                                                                // 88
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +                                              // 89
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';                                     // 90
                                                                                                     // 91
var PRERELEASELOOSE = R++;                                                                           // 92
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +                                   // 93
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';                           // 94
                                                                                                     // 95
// ## Build Metadata Identifier                                                                      // 96
// Any combination of digits, letters, or hyphens.                                                   // 97
                                                                                                     // 98
var BUILDIDENTIFIER = R++;                                                                           // 99
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';                                                              // 100
                                                                                                     // 101
// ## Build Metadata                                                                                 // 102
// Plus sign, followed by one or more period-separated build metadata                                // 103
// identifiers.                                                                                      // 104
                                                                                                     // 105
var BUILD = R++;                                                                                     // 106
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +                                                      // 107
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';                                               // 108
                                                                                                     // 109
                                                                                                     // 110
// ## Full Version String                                                                            // 111
// A main version, followed optionally by a pre-release version and                                  // 112
// build metadata.                                                                                   // 113
                                                                                                     // 114
// Note that the only major, minor, patch, and pre-release sections of                               // 115
// the version string are capturing groups.  The build metadata is not a                             // 116
// capturing group, because it should not ever be used in version                                    // 117
// comparison.                                                                                       // 118
                                                                                                     // 119
var FULL = R++;                                                                                      // 120
var FULLPLAIN = 'v?' + src[MAINVERSION] +                                                            // 121
                src[PRERELEASE] + '?' +                                                              // 122
                src[BUILD] + '?';                                                                    // 123
                                                                                                     // 124
src[FULL] = '^' + FULLPLAIN + '$';                                                                   // 125
                                                                                                     // 126
// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.                               // 127
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty                                 // 128
// common in the npm registry.                                                                       // 129
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +                                                // 130
                 src[PRERELEASELOOSE] + '?' +                                                        // 131
                 src[BUILD] + '?';                                                                   // 132
                                                                                                     // 133
var LOOSE = R++;                                                                                     // 134
src[LOOSE] = '^' + LOOSEPLAIN + '$';                                                                 // 135
                                                                                                     // 136
var GTLT = R++;                                                                                      // 137
src[GTLT] = '((?:<|>)?=?)';                                                                          // 138
                                                                                                     // 139
// Something like "2.*" or "1.2.x".                                                                  // 140
// Note that "x.x" is a valid xRange identifer, meaning "any version"                                // 141
// Only the first item is strictly required.                                                         // 142
var XRANGEIDENTIFIERLOOSE = R++;                                                                     // 143
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';                               // 144
var XRANGEIDENTIFIER = R++;                                                                          // 145
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';                                         // 146
                                                                                                     // 147
var XRANGEPLAIN = R++;                                                                               // 148
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +                                       // 149
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +                                         // 150
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +                                         // 151
                   '(?:' + src[PRERELEASE] + ')?' +                                                  // 152
                   src[BUILD] + '?' +                                                                // 153
                   ')?)?';                                                                           // 154
                                                                                                     // 155
var XRANGEPLAINLOOSE = R++;                                                                          // 156
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +                             // 157
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +                               // 158
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +                               // 159
                        '(?:' + src[PRERELEASELOOSE] + ')?' +                                        // 160
                        src[BUILD] + '?' +                                                           // 161
                        ')?)?';                                                                      // 162
                                                                                                     // 163
var XRANGE = R++;                                                                                    // 164
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';                                     // 165
var XRANGELOOSE = R++;                                                                               // 166
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';                           // 167
                                                                                                     // 168
// Tilde ranges.                                                                                     // 169
// Meaning is "reasonably at or greater than"                                                        // 170
var LONETILDE = R++;                                                                                 // 171
src[LONETILDE] = '(?:~>?)';                                                                          // 172
                                                                                                     // 173
var TILDETRIM = R++;                                                                                 // 174
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';                                                 // 175
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');                                                     // 176
var tildeTrimReplace = '$1~';                                                                        // 177
                                                                                                     // 178
var TILDE = R++;                                                                                     // 179
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';                                          // 180
var TILDELOOSE = R++;                                                                                // 181
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';                                // 182
                                                                                                     // 183
// Caret ranges.                                                                                     // 184
// Meaning is "at least and backwards compatible with"                                               // 185
var LONECARET = R++;                                                                                 // 186
src[LONECARET] = '(?:\\^)';                                                                          // 187
                                                                                                     // 188
var CARETTRIM = R++;                                                                                 // 189
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';                                                 // 190
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');                                                     // 191
var caretTrimReplace = '$1^';                                                                        // 192
                                                                                                     // 193
var CARET = R++;                                                                                     // 194
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';                                          // 195
var CARETLOOSE = R++;                                                                                // 196
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';                                // 197
                                                                                                     // 198
// A simple gt/lt/eq thing, or just "" to indicate "any version"                                     // 199
var COMPARATORLOOSE = R++;                                                                           // 200
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';                             // 201
var COMPARATOR = R++;                                                                                // 202
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';                                   // 203
                                                                                                     // 204
                                                                                                     // 205
// An expression to strip any whitespace between the gtlt and the thing                              // 206
// it modifies, so that `> 1.2.3` ==> `>1.2.3`                                                       // 207
var COMPARATORTRIM = R++;                                                                            // 208
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +                                                         // 209
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';                           // 210
                                                                                                     // 211
// this one has to use the /g flag                                                                   // 212
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');                                           // 213
var comparatorTrimReplace = '$1$2$3';                                                                // 214
                                                                                                     // 215
                                                                                                     // 216
// Something like `1.2.3 - 1.2.4`                                                                    // 217
// Note that these all use the loose form, because they'll be                                        // 218
// checked against either the strict or loose comparator form                                        // 219
// later.                                                                                            // 220
var HYPHENRANGE = R++;                                                                               // 221
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +                                               // 222
                   '\\s+-\\s+' +                                                                     // 223
                   '(' + src[XRANGEPLAIN] + ')' +                                                    // 224
                   '\\s*$';                                                                          // 225
                                                                                                     // 226
var HYPHENRANGELOOSE = R++;                                                                          // 227
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +                                     // 228
                        '\\s+-\\s+' +                                                                // 229
                        '(' + src[XRANGEPLAINLOOSE] + ')' +                                          // 230
                        '\\s*$';                                                                     // 231
                                                                                                     // 232
// Star ranges basically just allow anything at all.                                                 // 233
var STAR = R++;                                                                                      // 234
src[STAR] = '(<|>)?=?\\s*\\*';                                                                       // 235
                                                                                                     // 236
// Compile to actual regexp objects.                                                                 // 237
// All are flag-free, unless they were created above with a flag.                                    // 238
for (var i = 0; i < R; i++) {                                                                        // 239
  debug(i, src[i]);                                                                                  // 240
  if (!re[i])                                                                                        // 241
    re[i] = new RegExp(src[i]);                                                                      // 242
}                                                                                                    // 243
                                                                                                     // 244
exports.parse = parse;                                                                               // 245
function parse(version, loose) {                                                                     // 246
  var r = loose ? re[LOOSE] : re[FULL];                                                              // 247
  return (r.test(version)) ? new SemVer(version, loose) : null;                                      // 248
}                                                                                                    // 249
                                                                                                     // 250
exports.valid = valid;                                                                               // 251
function valid(version, loose) {                                                                     // 252
  var v = parse(version, loose);                                                                     // 253
  return v ? v.version : null;                                                                       // 254
}                                                                                                    // 255
                                                                                                     // 256
                                                                                                     // 257
exports.clean = clean;                                                                               // 258
function clean(version, loose) {                                                                     // 259
  var s = parse(version.trim().replace(/^[=v]+/, ''), loose);                                        // 260
  return s ? s.version : null;                                                                       // 261
}                                                                                                    // 262
                                                                                                     // 263
exports.SemVer = SemVer;                                                                             // 264
                                                                                                     // 265
function SemVer(version, loose) {                                                                    // 266
  if (version instanceof SemVer) {                                                                   // 267
    if (version.loose === loose)                                                                     // 268
      return version;                                                                                // 269
    else                                                                                             // 270
      version = version.version;                                                                     // 271
  } else if (typeof version !== 'string') {                                                          // 272
    throw new TypeError('Invalid Version: ' + version);                                              // 273
  }                                                                                                  // 274
                                                                                                     // 275
  if (!(this instanceof SemVer))                                                                     // 276
    return new SemVer(version, loose);                                                               // 277
                                                                                                     // 278
  debug('SemVer', version, loose);                                                                   // 279
  this.loose = loose;                                                                                // 280
  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);                                        // 281
                                                                                                     // 282
  if (!m)                                                                                            // 283
    throw new TypeError('Invalid Version: ' + version);                                              // 284
                                                                                                     // 285
  this.raw = version;                                                                                // 286
                                                                                                     // 287
  // these are actually numbers                                                                      // 288
  this.major = +m[1];                                                                                // 289
  this.minor = +m[2];                                                                                // 290
  this.patch = +m[3];                                                                                // 291
                                                                                                     // 292
  // numberify any prerelease numeric ids                                                            // 293
  if (!m[4])                                                                                         // 294
    this.prerelease = [];                                                                            // 295
  else                                                                                               // 296
    this.prerelease = m[4].split('.').map(function(id) {                                             // 297
      return (/^[0-9]+$/.test(id)) ? +id : id;                                                       // 298
    });                                                                                              // 299
                                                                                                     // 300
  this.build = m[5] ? m[5].split('.') : [];                                                          // 301
  this.format();                                                                                     // 302
}                                                                                                    // 303
                                                                                                     // 304
SemVer.prototype.format = function() {                                                               // 305
  this.version = this.major + '.' + this.minor + '.' + this.patch;                                   // 306
  if (this.prerelease.length)                                                                        // 307
    this.version += '-' + this.prerelease.join('.');                                                 // 308
  return this.version;                                                                               // 309
};                                                                                                   // 310
                                                                                                     // 311
SemVer.prototype.inspect = function() {                                                              // 312
  return '<SemVer "' + this + '">';                                                                  // 313
};                                                                                                   // 314
                                                                                                     // 315
SemVer.prototype.toString = function() {                                                             // 316
  return this.version;                                                                               // 317
};                                                                                                   // 318
                                                                                                     // 319
SemVer.prototype.compare = function(other) {                                                         // 320
  debug('SemVer.compare', this.version, this.loose, other);                                          // 321
  if (!(other instanceof SemVer))                                                                    // 322
    other = new SemVer(other, this.loose);                                                           // 323
                                                                                                     // 324
  return this.compareMain(other) || this.comparePre(other);                                          // 325
};                                                                                                   // 326
                                                                                                     // 327
SemVer.prototype.compareMain = function(other) {                                                     // 328
  if (!(other instanceof SemVer))                                                                    // 329
    other = new SemVer(other, this.loose);                                                           // 330
                                                                                                     // 331
  return compareIdentifiers(this.major, other.major) ||                                              // 332
         compareIdentifiers(this.minor, other.minor) ||                                              // 333
         compareIdentifiers(this.patch, other.patch);                                                // 334
};                                                                                                   // 335
                                                                                                     // 336
SemVer.prototype.comparePre = function(other) {                                                      // 337
  if (!(other instanceof SemVer))                                                                    // 338
    other = new SemVer(other, this.loose);                                                           // 339
                                                                                                     // 340
  // NOT having a prerelease is > having one                                                         // 341
  if (this.prerelease.length && !other.prerelease.length)                                            // 342
    return -1;                                                                                       // 343
  else if (!this.prerelease.length && other.prerelease.length)                                       // 344
    return 1;                                                                                        // 345
  else if (!this.prerelease.length && !other.prerelease.length)                                      // 346
    return 0;                                                                                        // 347
                                                                                                     // 348
  var i = 0;                                                                                         // 349
  do {                                                                                               // 350
    var a = this.prerelease[i];                                                                      // 351
    var b = other.prerelease[i];                                                                     // 352
    debug('prerelease compare', i, a, b);                                                            // 353
    if (a === undefined && b === undefined)                                                          // 354
      return 0;                                                                                      // 355
    else if (b === undefined)                                                                        // 356
      return 1;                                                                                      // 357
    else if (a === undefined)                                                                        // 358
      return -1;                                                                                     // 359
    else if (a === b)                                                                                // 360
      continue;                                                                                      // 361
    else                                                                                             // 362
      return compareIdentifiers(a, b);                                                               // 363
  } while (++i);                                                                                     // 364
};                                                                                                   // 365
                                                                                                     // 366
// preminor will bump the version up to the next minor release, and immediately                      // 367
// down to pre-release. premajor and prepatch work the same way.                                     // 368
SemVer.prototype.inc = function(release, identifier) {                                               // 369
  switch (release) {                                                                                 // 370
    case 'premajor':                                                                                 // 371
      this.prerelease.length = 0;                                                                    // 372
      this.patch = 0;                                                                                // 373
      this.minor = 0;                                                                                // 374
      this.major++;                                                                                  // 375
      this.inc('pre', identifier);                                                                   // 376
      break;                                                                                         // 377
    case 'preminor':                                                                                 // 378
      this.prerelease.length = 0;                                                                    // 379
      this.patch = 0;                                                                                // 380
      this.minor++;                                                                                  // 381
      this.inc('pre', identifier);                                                                   // 382
      break;                                                                                         // 383
    case 'prepatch':                                                                                 // 384
      // If this is already a prerelease, it will bump to the next version                           // 385
      // drop any prereleases that might already exist, since they are not                           // 386
      // relevant at this point.                                                                     // 387
      this.prerelease.length = 0;                                                                    // 388
      this.inc('patch', identifier);                                                                 // 389
      this.inc('pre', identifier);                                                                   // 390
      break;                                                                                         // 391
    // If the input is a non-prerelease version, this acts the same as                               // 392
    // prepatch.                                                                                     // 393
    case 'prerelease':                                                                               // 394
      if (this.prerelease.length === 0)                                                              // 395
        this.inc('patch', identifier);                                                               // 396
      this.inc('pre', identifier);                                                                   // 397
      break;                                                                                         // 398
                                                                                                     // 399
    case 'major':                                                                                    // 400
      // If this is a pre-major version, bump up to the same major version.                          // 401
      // Otherwise increment major.                                                                  // 402
      // 1.0.0-5 bumps to 1.0.0                                                                      // 403
      // 1.1.0 bumps to 2.0.0                                                                        // 404
      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)                      // 405
        this.major++;                                                                                // 406
      this.minor = 0;                                                                                // 407
      this.patch = 0;                                                                                // 408
      this.prerelease = [];                                                                          // 409
      break;                                                                                         // 410
    case 'minor':                                                                                    // 411
      // If this is a pre-minor version, bump up to the same minor version.                          // 412
      // Otherwise increment minor.                                                                  // 413
      // 1.2.0-5 bumps to 1.2.0                                                                      // 414
      // 1.2.1 bumps to 1.3.0                                                                        // 415
      if (this.patch !== 0 || this.prerelease.length === 0)                                          // 416
        this.minor++;                                                                                // 417
      this.patch = 0;                                                                                // 418
      this.prerelease = [];                                                                          // 419
      break;                                                                                         // 420
    case 'patch':                                                                                    // 421
      // If this is not a pre-release version, it will increment the patch.                          // 422
      // If it is a pre-release it will bump up to the same patch version.                           // 423
      // 1.2.0-5 patches to 1.2.0                                                                    // 424
      // 1.2.0 patches to 1.2.1                                                                      // 425
      if (this.prerelease.length === 0)                                                              // 426
        this.patch++;                                                                                // 427
      this.prerelease = [];                                                                          // 428
      break;                                                                                         // 429
    // This probably shouldn't be used publicly.                                                     // 430
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.                                // 431
    case 'pre':                                                                                      // 432
      if (this.prerelease.length === 0)                                                              // 433
        this.prerelease = [0];                                                                       // 434
      else {                                                                                         // 435
        var i = this.prerelease.length;                                                              // 436
        while (--i >= 0) {                                                                           // 437
          if (typeof this.prerelease[i] === 'number') {                                              // 438
            this.prerelease[i]++;                                                                    // 439
            i = -2;                                                                                  // 440
          }                                                                                          // 441
        }                                                                                            // 442
        if (i === -1) // didn't increment anything                                                   // 443
          this.prerelease.push(0);                                                                   // 444
      }                                                                                              // 445
      if (identifier) {                                                                              // 446
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,                                                       // 447
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0                                     // 448
        if (this.prerelease[0] === identifier) {                                                     // 449
          if (isNaN(this.prerelease[1]))                                                             // 450
            this.prerelease = [identifier, 0];                                                       // 451
        } else                                                                                       // 452
          this.prerelease = [identifier, 0];                                                         // 453
      }                                                                                              // 454
      break;                                                                                         // 455
                                                                                                     // 456
    default:                                                                                         // 457
      throw new Error('invalid increment argument: ' + release);                                     // 458
  }                                                                                                  // 459
  this.format();                                                                                     // 460
  return this;                                                                                       // 461
};                                                                                                   // 462
                                                                                                     // 463
exports.inc = inc;                                                                                   // 464
function inc(version, release, loose, identifier) {                                                  // 465
  if (typeof(loose) === 'string') {                                                                  // 466
    identifier = loose;                                                                              // 467
    loose = undefined;                                                                               // 468
  }                                                                                                  // 469
                                                                                                     // 470
  try {                                                                                              // 471
    return new SemVer(version, loose).inc(release, identifier).version;                              // 472
  } catch (er) {                                                                                     // 473
    return null;                                                                                     // 474
  }                                                                                                  // 475
}                                                                                                    // 476
                                                                                                     // 477
exports.compareIdentifiers = compareIdentifiers;                                                     // 478
                                                                                                     // 479
var numeric = /^[0-9]+$/;                                                                            // 480
function compareIdentifiers(a, b) {                                                                  // 481
  var anum = numeric.test(a);                                                                        // 482
  var bnum = numeric.test(b);                                                                        // 483
                                                                                                     // 484
  if (anum && bnum) {                                                                                // 485
    a = +a;                                                                                          // 486
    b = +b;                                                                                          // 487
  }                                                                                                  // 488
                                                                                                     // 489
  return (anum && !bnum) ? -1 :                                                                      // 490
         (bnum && !anum) ? 1 :                                                                       // 491
         a < b ? -1 :                                                                                // 492
         a > b ? 1 :                                                                                 // 493
         0;                                                                                          // 494
}                                                                                                    // 495
                                                                                                     // 496
exports.rcompareIdentifiers = rcompareIdentifiers;                                                   // 497
function rcompareIdentifiers(a, b) {                                                                 // 498
  return compareIdentifiers(b, a);                                                                   // 499
}                                                                                                    // 500
                                                                                                     // 501
exports.compare = compare;                                                                           // 502
function compare(a, b, loose) {                                                                      // 503
  return new SemVer(a, loose).compare(b);                                                            // 504
}                                                                                                    // 505
                                                                                                     // 506
exports.compareLoose = compareLoose;                                                                 // 507
function compareLoose(a, b) {                                                                        // 508
  return compare(a, b, true);                                                                        // 509
}                                                                                                    // 510
                                                                                                     // 511
exports.rcompare = rcompare;                                                                         // 512
function rcompare(a, b, loose) {                                                                     // 513
  return compare(b, a, loose);                                                                       // 514
}                                                                                                    // 515
                                                                                                     // 516
exports.sort = sort;                                                                                 // 517
function sort(list, loose) {                                                                         // 518
  return list.sort(function(a, b) {                                                                  // 519
    return exports.compare(a, b, loose);                                                             // 520
  });                                                                                                // 521
}                                                                                                    // 522
                                                                                                     // 523
exports.rsort = rsort;                                                                               // 524
function rsort(list, loose) {                                                                        // 525
  return list.sort(function(a, b) {                                                                  // 526
    return exports.rcompare(a, b, loose);                                                            // 527
  });                                                                                                // 528
}                                                                                                    // 529
                                                                                                     // 530
exports.gt = gt;                                                                                     // 531
function gt(a, b, loose) {                                                                           // 532
  return compare(a, b, loose) > 0;                                                                   // 533
}                                                                                                    // 534
                                                                                                     // 535
exports.lt = lt;                                                                                     // 536
function lt(a, b, loose) {                                                                           // 537
  return compare(a, b, loose) < 0;                                                                   // 538
}                                                                                                    // 539
                                                                                                     // 540
exports.eq = eq;                                                                                     // 541
function eq(a, b, loose) {                                                                           // 542
  return compare(a, b, loose) === 0;                                                                 // 543
}                                                                                                    // 544
                                                                                                     // 545
exports.neq = neq;                                                                                   // 546
function neq(a, b, loose) {                                                                          // 547
  return compare(a, b, loose) !== 0;                                                                 // 548
}                                                                                                    // 549
                                                                                                     // 550
exports.gte = gte;                                                                                   // 551
function gte(a, b, loose) {                                                                          // 552
  return compare(a, b, loose) >= 0;                                                                  // 553
}                                                                                                    // 554
                                                                                                     // 555
exports.lte = lte;                                                                                   // 556
function lte(a, b, loose) {                                                                          // 557
  return compare(a, b, loose) <= 0;                                                                  // 558
}                                                                                                    // 559
                                                                                                     // 560
exports.cmp = cmp;                                                                                   // 561
function cmp(a, op, b, loose) {                                                                      // 562
  var ret;                                                                                           // 563
  switch (op) {                                                                                      // 564
    case '===':                                                                                      // 565
      if (typeof a === 'object') a = a.version;                                                      // 566
      if (typeof b === 'object') b = b.version;                                                      // 567
      ret = a === b;                                                                                 // 568
      break;                                                                                         // 569
    case '!==':                                                                                      // 570
      if (typeof a === 'object') a = a.version;                                                      // 571
      if (typeof b === 'object') b = b.version;                                                      // 572
      ret = a !== b;                                                                                 // 573
      break;                                                                                         // 574
    case '': case '=': case '==': ret = eq(a, b, loose); break;                                      // 575
    case '!=': ret = neq(a, b, loose); break;                                                        // 576
    case '>': ret = gt(a, b, loose); break;                                                          // 577
    case '>=': ret = gte(a, b, loose); break;                                                        // 578
    case '<': ret = lt(a, b, loose); break;                                                          // 579
    case '<=': ret = lte(a, b, loose); break;                                                        // 580
    default: throw new TypeError('Invalid operator: ' + op);                                         // 581
  }                                                                                                  // 582
  return ret;                                                                                        // 583
}                                                                                                    // 584
                                                                                                     // 585
exports.Comparator = Comparator;                                                                     // 586
function Comparator(comp, loose) {                                                                   // 587
  if (comp instanceof Comparator) {                                                                  // 588
    if (comp.loose === loose)                                                                        // 589
      return comp;                                                                                   // 590
    else                                                                                             // 591
      comp = comp.value;                                                                             // 592
  }                                                                                                  // 593
                                                                                                     // 594
  if (!(this instanceof Comparator))                                                                 // 595
    return new Comparator(comp, loose);                                                              // 596
                                                                                                     // 597
  debug('comparator', comp, loose);                                                                  // 598
  this.loose = loose;                                                                                // 599
  this.parse(comp);                                                                                  // 600
                                                                                                     // 601
  if (this.semver === ANY)                                                                           // 602
    this.value = '';                                                                                 // 603
  else                                                                                               // 604
    this.value = this.operator + this.semver.version;                                                // 605
                                                                                                     // 606
  debug('comp', this);                                                                               // 607
}                                                                                                    // 608
                                                                                                     // 609
var ANY = {};                                                                                        // 610
Comparator.prototype.parse = function(comp) {                                                        // 611
  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];                                         // 612
  var m = comp.match(r);                                                                             // 613
                                                                                                     // 614
  if (!m)                                                                                            // 615
    throw new TypeError('Invalid comparator: ' + comp);                                              // 616
                                                                                                     // 617
  this.operator = m[1];                                                                              // 618
  if (this.operator === '=')                                                                         // 619
    this.operator = '';                                                                              // 620
                                                                                                     // 621
  // if it literally is just '>' or '' then allow anything.                                          // 622
  if (!m[2])                                                                                         // 623
    this.semver = ANY;                                                                               // 624
  else                                                                                               // 625
    this.semver = new SemVer(m[2], this.loose);                                                      // 626
};                                                                                                   // 627
                                                                                                     // 628
Comparator.prototype.inspect = function() {                                                          // 629
  return '<SemVer Comparator "' + this + '">';                                                       // 630
};                                                                                                   // 631
                                                                                                     // 632
Comparator.prototype.toString = function() {                                                         // 633
  return this.value;                                                                                 // 634
};                                                                                                   // 635
                                                                                                     // 636
Comparator.prototype.test = function(version) {                                                      // 637
  debug('Comparator.test', version, this.loose);                                                     // 638
                                                                                                     // 639
  if (this.semver === ANY)                                                                           // 640
    return true;                                                                                     // 641
                                                                                                     // 642
  if (typeof version === 'string')                                                                   // 643
    version = new SemVer(version, this.loose);                                                       // 644
                                                                                                     // 645
  return cmp(version, this.operator, this.semver, this.loose);                                       // 646
};                                                                                                   // 647
                                                                                                     // 648
                                                                                                     // 649
exports.Range = Range;                                                                               // 650
function Range(range, loose) {                                                                       // 651
  if ((range instanceof Range) && range.loose === loose)                                             // 652
    return range;                                                                                    // 653
                                                                                                     // 654
  if (!(this instanceof Range))                                                                      // 655
    return new Range(range, loose);                                                                  // 656
                                                                                                     // 657
  this.loose = loose;                                                                                // 658
                                                                                                     // 659
  // First, split based on boolean or ||                                                             // 660
  this.raw = range;                                                                                  // 661
  this.set = range.split(/\s*\|\|\s*/).map(function(range) {                                         // 662
    return this.parseRange(range.trim());                                                            // 663
  }, this).filter(function(c) {                                                                      // 664
    // throw out any that are not relevant for whatever reason                                       // 665
    return c.length;                                                                                 // 666
  });                                                                                                // 667
                                                                                                     // 668
  if (!this.set.length) {                                                                            // 669
    throw new TypeError('Invalid SemVer Range: ' + range);                                           // 670
  }                                                                                                  // 671
                                                                                                     // 672
  this.format();                                                                                     // 673
}                                                                                                    // 674
                                                                                                     // 675
Range.prototype.inspect = function() {                                                               // 676
  return '<SemVer Range "' + this.range + '">';                                                      // 677
};                                                                                                   // 678
                                                                                                     // 679
Range.prototype.format = function() {                                                                // 680
  this.range = this.set.map(function(comps) {                                                        // 681
    return comps.join(' ').trim();                                                                   // 682
  }).join('||').trim();                                                                              // 683
  return this.range;                                                                                 // 684
};                                                                                                   // 685
                                                                                                     // 686
Range.prototype.toString = function() {                                                              // 687
  return this.range;                                                                                 // 688
};                                                                                                   // 689
                                                                                                     // 690
Range.prototype.parseRange = function(range) {                                                       // 691
  var loose = this.loose;                                                                            // 692
  range = range.trim();                                                                              // 693
  debug('range', range, loose);                                                                      // 694
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`                                                            // 695
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];                                           // 696
  range = range.replace(hr, hyphenReplace);                                                          // 697
  debug('hyphen replace', range);                                                                    // 698
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`                                                            // 699
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);                                  // 700
  debug('comparator trim', range, re[COMPARATORTRIM]);                                               // 701
                                                                                                     // 702
  // `~ 1.2.3` => `~1.2.3`                                                                           // 703
  range = range.replace(re[TILDETRIM], tildeTrimReplace);                                            // 704
                                                                                                     // 705
  // `^ 1.2.3` => `^1.2.3`                                                                           // 706
  range = range.replace(re[CARETTRIM], caretTrimReplace);                                            // 707
                                                                                                     // 708
  // normalize spaces                                                                                // 709
  range = range.split(/\s+/).join(' ');                                                              // 710
                                                                                                     // 711
  // At this point, the range is completely trimmed and                                              // 712
  // ready to be split into comparators.                                                             // 713
                                                                                                     // 714
  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];                                         // 715
  var set = range.split(' ').map(function(comp) {                                                    // 716
    return parseComparator(comp, loose);                                                             // 717
  }).join(' ').split(/\s+/);                                                                         // 718
  if (this.loose) {                                                                                  // 719
    // in loose mode, throw out any that are not valid comparators                                   // 720
    set = set.filter(function(comp) {                                                                // 721
      return !!comp.match(compRe);                                                                   // 722
    });                                                                                              // 723
  }                                                                                                  // 724
  set = set.map(function(comp) {                                                                     // 725
    return new Comparator(comp, loose);                                                              // 726
  });                                                                                                // 727
                                                                                                     // 728
  return set;                                                                                        // 729
};                                                                                                   // 730
                                                                                                     // 731
// Mostly just for testing and legacy API reasons                                                    // 732
exports.toComparators = toComparators;                                                               // 733
function toComparators(range, loose) {                                                               // 734
  return new Range(range, loose).set.map(function(comp) {                                            // 735
    return comp.map(function(c) {                                                                    // 736
      return c.value;                                                                                // 737
    }).join(' ').trim().split(' ');                                                                  // 738
  });                                                                                                // 739
}                                                                                                    // 740
                                                                                                     // 741
// comprised of xranges, tildes, stars, and gtlt's at this point.                                    // 742
// already replaced the hyphen ranges                                                                // 743
// turn into a set of JUST comparators.                                                              // 744
function parseComparator(comp, loose) {                                                              // 745
  debug('comp', comp);                                                                               // 746
  comp = replaceCarets(comp, loose);                                                                 // 747
  debug('caret', comp);                                                                              // 748
  comp = replaceTildes(comp, loose);                                                                 // 749
  debug('tildes', comp);                                                                             // 750
  comp = replaceXRanges(comp, loose);                                                                // 751
  debug('xrange', comp);                                                                             // 752
  comp = replaceStars(comp, loose);                                                                  // 753
  debug('stars', comp);                                                                              // 754
  return comp;                                                                                       // 755
}                                                                                                    // 756
                                                                                                     // 757
function isX(id) {                                                                                   // 758
  return !id || id.toLowerCase() === 'x' || id === '*';                                              // 759
}                                                                                                    // 760
                                                                                                     // 761
// ~, ~> --> * (any, kinda silly)                                                                    // 762
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0                                           // 763
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0                                                   // 764
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0                                                   // 765
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0                                                                // 766
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0                                                                // 767
function replaceTildes(comp, loose) {                                                                // 768
  return comp.trim().split(/\s+/).map(function(comp) {                                               // 769
    return replaceTilde(comp, loose);                                                                // 770
  }).join(' ');                                                                                      // 771
}                                                                                                    // 772
                                                                                                     // 773
function replaceTilde(comp, loose) {                                                                 // 774
  var r = loose ? re[TILDELOOSE] : re[TILDE];                                                        // 775
  return comp.replace(r, function(_, M, m, p, pr) {                                                  // 776
    debug('tilde', comp, _, M, m, p, pr);                                                            // 777
    var ret;                                                                                         // 778
                                                                                                     // 779
    if (isX(M))                                                                                      // 780
      ret = '';                                                                                      // 781
    else if (isX(m))                                                                                 // 782
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';                                                 // 783
    else if (isX(p))                                                                                 // 784
      // ~1.2 == >=1.2.0- <1.3.0-                                                                    // 785
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';                                 // 786
    else if (pr) {                                                                                   // 787
      debug('replaceTilde pr', pr);                                                                  // 788
      if (pr.charAt(0) !== '-')                                                                      // 789
        pr = '-' + pr;                                                                               // 790
      ret = '>=' + M + '.' + m + '.' + p + pr +                                                      // 791
            ' <' + M + '.' + (+m + 1) + '.0';                                                        // 792
    } else                                                                                           // 793
      // ~1.2.3 == >=1.2.3 <1.3.0                                                                    // 794
      ret = '>=' + M + '.' + m + '.' + p +                                                           // 795
            ' <' + M + '.' + (+m + 1) + '.0';                                                        // 796
                                                                                                     // 797
    debug('tilde return', ret);                                                                      // 798
    return ret;                                                                                      // 799
  });                                                                                                // 800
}                                                                                                    // 801
                                                                                                     // 802
// ^ --> * (any, kinda silly)                                                                        // 803
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0                                                               // 804
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0                                                                   // 805
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0                                                                   // 806
// ^1.2.3 --> >=1.2.3 <2.0.0                                                                         // 807
// ^1.2.0 --> >=1.2.0 <2.0.0                                                                         // 808
function replaceCarets(comp, loose) {                                                                // 809
  return comp.trim().split(/\s+/).map(function(comp) {                                               // 810
    return replaceCaret(comp, loose);                                                                // 811
  }).join(' ');                                                                                      // 812
}                                                                                                    // 813
                                                                                                     // 814
function replaceCaret(comp, loose) {                                                                 // 815
  debug('caret', comp, loose);                                                                       // 816
  var r = loose ? re[CARETLOOSE] : re[CARET];                                                        // 817
  return comp.replace(r, function(_, M, m, p, pr) {                                                  // 818
    debug('caret', comp, _, M, m, p, pr);                                                            // 819
    var ret;                                                                                         // 820
                                                                                                     // 821
    if (isX(M))                                                                                      // 822
      ret = '';                                                                                      // 823
    else if (isX(m))                                                                                 // 824
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';                                                 // 825
    else if (isX(p)) {                                                                               // 826
      if (M === '0')                                                                                 // 827
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';                               // 828
      else                                                                                           // 829
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';                                       // 830
    } else if (pr) {                                                                                 // 831
      debug('replaceCaret pr', pr);                                                                  // 832
      if (pr.charAt(0) !== '-')                                                                      // 833
        pr = '-' + pr;                                                                               // 834
      if (M === '0') {                                                                               // 835
        if (m === '0')                                                                               // 836
          ret = '>=' + M + '.' + m + '.' + p + pr +                                                  // 837
                ' <' + M + '.' + m + '.' + (+p + 1);                                                 // 838
        else                                                                                         // 839
          ret = '>=' + M + '.' + m + '.' + p + pr +                                                  // 840
                ' <' + M + '.' + (+m + 1) + '.0';                                                    // 841
      } else                                                                                         // 842
        ret = '>=' + M + '.' + m + '.' + p + pr +                                                    // 843
              ' <' + (+M + 1) + '.0.0';                                                              // 844
    } else {                                                                                         // 845
      debug('no pr');                                                                                // 846
      if (M === '0') {                                                                               // 847
        if (m === '0')                                                                               // 848
          ret = '>=' + M + '.' + m + '.' + p +                                                       // 849
                ' <' + M + '.' + m + '.' + (+p + 1);                                                 // 850
        else                                                                                         // 851
          ret = '>=' + M + '.' + m + '.' + p +                                                       // 852
                ' <' + M + '.' + (+m + 1) + '.0';                                                    // 853
      } else                                                                                         // 854
        ret = '>=' + M + '.' + m + '.' + p +                                                         // 855
              ' <' + (+M + 1) + '.0.0';                                                              // 856
    }                                                                                                // 857
                                                                                                     // 858
    debug('caret return', ret);                                                                      // 859
    return ret;                                                                                      // 860
  });                                                                                                // 861
}                                                                                                    // 862
                                                                                                     // 863
function replaceXRanges(comp, loose) {                                                               // 864
  debug('replaceXRanges', comp, loose);                                                              // 865
  return comp.split(/\s+/).map(function(comp) {                                                      // 866
    return replaceXRange(comp, loose);                                                               // 867
  }).join(' ');                                                                                      // 868
}                                                                                                    // 869
                                                                                                     // 870
function replaceXRange(comp, loose) {                                                                // 871
  comp = comp.trim();                                                                                // 872
  var r = loose ? re[XRANGELOOSE] : re[XRANGE];                                                      // 873
  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {                                          // 874
    debug('xRange', comp, ret, gtlt, M, m, p, pr);                                                   // 875
    var xM = isX(M);                                                                                 // 876
    var xm = xM || isX(m);                                                                           // 877
    var xp = xm || isX(p);                                                                           // 878
    var anyX = xp;                                                                                   // 879
                                                                                                     // 880
    if (gtlt === '=' && anyX)                                                                        // 881
      gtlt = '';                                                                                     // 882
                                                                                                     // 883
    if (xM) {                                                                                        // 884
      if (gtlt === '>' || gtlt === '<') {                                                            // 885
        // nothing is allowed                                                                        // 886
        ret = '<0.0.0';                                                                              // 887
      } else {                                                                                       // 888
        // nothing is forbidden                                                                      // 889
        ret = '*';                                                                                   // 890
      }                                                                                              // 891
    } else if (gtlt && anyX) {                                                                       // 892
      // replace X with 0                                                                            // 893
      if (xm)                                                                                        // 894
        m = 0;                                                                                       // 895
      if (xp)                                                                                        // 896
        p = 0;                                                                                       // 897
                                                                                                     // 898
      if (gtlt === '>') {                                                                            // 899
        // >1 => >=2.0.0                                                                             // 900
        // >1.2 => >=1.3.0                                                                           // 901
        // >1.2.3 => >= 1.2.4                                                                        // 902
        gtlt = '>=';                                                                                 // 903
        if (xm) {                                                                                    // 904
          M = +M + 1;                                                                                // 905
          m = 0;                                                                                     // 906
          p = 0;                                                                                     // 907
        } else if (xp) {                                                                             // 908
          m = +m + 1;                                                                                // 909
          p = 0;                                                                                     // 910
        }                                                                                            // 911
      } else if (gtlt === '<=') {                                                                    // 912
        // <=0.7.x is actually <0.8.0, since any 0.7.x should                                        // 913
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.                                          // 914
        gtlt = '<'                                                                                   // 915
        if (xm)                                                                                      // 916
          M = +M + 1                                                                                 // 917
        else                                                                                         // 918
          m = +m + 1                                                                                 // 919
      }                                                                                              // 920
                                                                                                     // 921
      ret = gtlt + M + '.' + m + '.' + p;                                                            // 922
    } else if (xm) {                                                                                 // 923
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';                                                 // 924
    } else if (xp) {                                                                                 // 925
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';                                 // 926
    }                                                                                                // 927
                                                                                                     // 928
    debug('xRange return', ret);                                                                     // 929
                                                                                                     // 930
    return ret;                                                                                      // 931
  });                                                                                                // 932
}                                                                                                    // 933
                                                                                                     // 934
// Because * is AND-ed with everything else in the comparator,                                       // 935
// and '' means "any version", just remove the *s entirely.                                          // 936
function replaceStars(comp, loose) {                                                                 // 937
  debug('replaceStars', comp, loose);                                                                // 938
  // Looseness is ignored here.  star is always as loose as it gets!                                 // 939
  return comp.trim().replace(re[STAR], '');                                                          // 940
}                                                                                                    // 941
                                                                                                     // 942
// This function is passed to string.replace(re[HYPHENRANGE])                                        // 943
// M, m, patch, prerelease, build                                                                    // 944
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5                                                                    // 945
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do                                                   // 946
// 1.2 - 3.4 => >=1.2.0 <3.5.0                                                                       // 947
function hyphenReplace($0,                                                                           // 948
                       from, fM, fm, fp, fpr, fb,                                                    // 949
                       to, tM, tm, tp, tpr, tb) {                                                    // 950
                                                                                                     // 951
  if (isX(fM))                                                                                       // 952
    from = '';                                                                                       // 953
  else if (isX(fm))                                                                                  // 954
    from = '>=' + fM + '.0.0';                                                                       // 955
  else if (isX(fp))                                                                                  // 956
    from = '>=' + fM + '.' + fm + '.0';                                                              // 957
  else                                                                                               // 958
    from = '>=' + from;                                                                              // 959
                                                                                                     // 960
  if (isX(tM))                                                                                       // 961
    to = '';                                                                                         // 962
  else if (isX(tm))                                                                                  // 963
    to = '<' + (+tM + 1) + '.0.0';                                                                   // 964
  else if (isX(tp))                                                                                  // 965
    to = '<' + tM + '.' + (+tm + 1) + '.0';                                                          // 966
  else if (tpr)                                                                                      // 967
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;                                                // 968
  else                                                                                               // 969
    to = '<=' + to;                                                                                  // 970
                                                                                                     // 971
  return (from + ' ' + to).trim();                                                                   // 972
}                                                                                                    // 973
                                                                                                     // 974
                                                                                                     // 975
// if ANY of the sets match ALL of its comparators, then pass                                        // 976
Range.prototype.test = function(version) {                                                           // 977
  if (!version)                                                                                      // 978
    return false;                                                                                    // 979
                                                                                                     // 980
  if (typeof version === 'string')                                                                   // 981
    version = new SemVer(version, this.loose);                                                       // 982
                                                                                                     // 983
  for (var i = 0; i < this.set.length; i++) {                                                        // 984
    if (testSet(this.set[i], version))                                                               // 985
      return true;                                                                                   // 986
  }                                                                                                  // 987
  return false;                                                                                      // 988
};                                                                                                   // 989
                                                                                                     // 990
function testSet(set, version) {                                                                     // 991
  for (var i = 0; i < set.length; i++) {                                                             // 992
    if (!set[i].test(version))                                                                       // 993
      return false;                                                                                  // 994
  }                                                                                                  // 995
                                                                                                     // 996
  if (version.prerelease.length) {                                                                   // 997
    // Find the set of versions that are allowed to have prereleases                                 // 998
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0                                      // 999
    // That should allow `1.2.3-pr.2` to pass.                                                       // 1000
    // However, `1.2.4-alpha.notready` should NOT be allowed,                                        // 1001
    // even though it's within the range set by the comparators.                                     // 1002
    for (var i = 0; i < set.length; i++) {                                                           // 1003
      debug(set[i].semver);                                                                          // 1004
      if (set[i].semver === ANY)                                                                     // 1005
        return true;                                                                                 // 1006
                                                                                                     // 1007
      if (set[i].semver.prerelease.length > 0) {                                                     // 1008
        var allowed = set[i].semver;                                                                 // 1009
        if (allowed.major === version.major &&                                                       // 1010
            allowed.minor === version.minor &&                                                       // 1011
            allowed.patch === version.patch)                                                         // 1012
          return true;                                                                               // 1013
      }                                                                                              // 1014
    }                                                                                                // 1015
                                                                                                     // 1016
    // Version has a -pre, but it's not one of the ones we like.                                     // 1017
    return false;                                                                                    // 1018
  }                                                                                                  // 1019
                                                                                                     // 1020
  return true;                                                                                       // 1021
}                                                                                                    // 1022
                                                                                                     // 1023
exports.satisfies = satisfies;                                                                       // 1024
function satisfies(version, range, loose) {                                                          // 1025
  try {                                                                                              // 1026
    range = new Range(range, loose);                                                                 // 1027
  } catch (er) {                                                                                     // 1028
    return false;                                                                                    // 1029
  }                                                                                                  // 1030
  return range.test(version);                                                                        // 1031
}                                                                                                    // 1032
                                                                                                     // 1033
exports.maxSatisfying = maxSatisfying;                                                               // 1034
function maxSatisfying(versions, range, loose) {                                                     // 1035
  return versions.filter(function(version) {                                                         // 1036
    return satisfies(version, range, loose);                                                         // 1037
  }).sort(function(a, b) {                                                                           // 1038
    return rcompare(a, b, loose);                                                                    // 1039
  })[0] || null;                                                                                     // 1040
}                                                                                                    // 1041
                                                                                                     // 1042
exports.validRange = validRange;                                                                     // 1043
function validRange(range, loose) {                                                                  // 1044
  try {                                                                                              // 1045
    // Return '*' instead of '' so that truthiness works.                                            // 1046
    // This will throw if it's invalid anyway                                                        // 1047
    return new Range(range, loose).range || '*';                                                     // 1048
  } catch (er) {                                                                                     // 1049
    return null;                                                                                     // 1050
  }                                                                                                  // 1051
}                                                                                                    // 1052
                                                                                                     // 1053
// Determine if version is less than all the versions possible in the range                          // 1054
exports.ltr = ltr;                                                                                   // 1055
function ltr(version, range, loose) {                                                                // 1056
  return outside(version, range, '<', loose);                                                        // 1057
}                                                                                                    // 1058
                                                                                                     // 1059
// Determine if version is greater than all the versions possible in the range.                      // 1060
exports.gtr = gtr;                                                                                   // 1061
function gtr(version, range, loose) {                                                                // 1062
  return outside(version, range, '>', loose);                                                        // 1063
}                                                                                                    // 1064
                                                                                                     // 1065
exports.outside = outside;                                                                           // 1066
function outside(version, range, hilo, loose) {                                                      // 1067
  version = new SemVer(version, loose);                                                              // 1068
  range = new Range(range, loose);                                                                   // 1069
                                                                                                     // 1070
  var gtfn, ltefn, ltfn, comp, ecomp;                                                                // 1071
  switch (hilo) {                                                                                    // 1072
    case '>':                                                                                        // 1073
      gtfn = gt;                                                                                     // 1074
      ltefn = lte;                                                                                   // 1075
      ltfn = lt;                                                                                     // 1076
      comp = '>';                                                                                    // 1077
      ecomp = '>=';                                                                                  // 1078
      break;                                                                                         // 1079
    case '<':                                                                                        // 1080
      gtfn = lt;                                                                                     // 1081
      ltefn = gte;                                                                                   // 1082
      ltfn = gt;                                                                                     // 1083
      comp = '<';                                                                                    // 1084
      ecomp = '<=';                                                                                  // 1085
      break;                                                                                         // 1086
    default:                                                                                         // 1087
      throw new TypeError('Must provide a hilo val of "<" or ">"');                                  // 1088
  }                                                                                                  // 1089
                                                                                                     // 1090
  // If it satisifes the range it is not outside                                                     // 1091
  if (satisfies(version, range, loose)) {                                                            // 1092
    return false;                                                                                    // 1093
  }                                                                                                  // 1094
                                                                                                     // 1095
  // From now on, variable terms are as if we're in "gtr" mode.                                      // 1096
  // but note that everything is flipped for the "ltr" function.                                     // 1097
                                                                                                     // 1098
  for (var i = 0; i < range.set.length; ++i) {                                                       // 1099
    var comparators = range.set[i];                                                                  // 1100
                                                                                                     // 1101
    var high = null;                                                                                 // 1102
    var low = null;                                                                                  // 1103
                                                                                                     // 1104
    comparators.forEach(function(comparator) {                                                       // 1105
      high = high || comparator;                                                                     // 1106
      low = low || comparator;                                                                       // 1107
      if (gtfn(comparator.semver, high.semver, loose)) {                                             // 1108
        high = comparator;                                                                           // 1109
      } else if (ltfn(comparator.semver, low.semver, loose)) {                                       // 1110
        low = comparator;                                                                            // 1111
      }                                                                                              // 1112
    });                                                                                              // 1113
                                                                                                     // 1114
    // If the edge version comparator has a operator then our version                                // 1115
    // isn't outside it                                                                              // 1116
    if (high.operator === comp || high.operator === ecomp) {                                         // 1117
      return false;                                                                                  // 1118
    }                                                                                                // 1119
                                                                                                     // 1120
    // If the lowest version comparator has an operator and our version                              // 1121
    // is less than it then it isn't higher than the range                                           // 1122
    if ((!low.operator || low.operator === comp) &&                                                  // 1123
        ltefn(version, low.semver)) {                                                                // 1124
      return false;                                                                                  // 1125
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {                                // 1126
      return false;                                                                                  // 1127
    }                                                                                                // 1128
  }                                                                                                  // 1129
  return true;                                                                                       // 1130
}                                                                                                    // 1131
                                                                                                     // 1132
// Use the define() function if we're in AMD land                                                    // 1133
if (typeof define === 'function' && define.amd)                                                      // 1134
  define(exports);                                                                                   // 1135
                                                                                                     // 1136
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/package-version-parser/package-version-parser.js                                         //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
// This file is in tools/package-version-parser.js and is symlinked into                             // 1
// packages/package-version-parser/package-version-parser.js. It's part of both                      // 2
// the tool and the package!  We don't use an isopacket for it because it used                       // 3
// to be required as part of building isopackets (though that may no longer be                       // 4
// true).                                                                                            // 5
var inTool = typeof Package === 'undefined';                                                         // 6
                                                                                                     // 7
                                                                                                     // 8
var semver = inTool ?                                                                                // 9
  require ('../../dev_bundle/lib/node_modules/semver') : SemVer410;                                  // 10
var __ = inTool ? require('../../dev_bundle/lib/node_modules/underscore') : _;                       // 11
                                                                                                     // 12
// Takes in a meteor version string, for example 1.2.3-rc.5_1+12345.                                 // 13
//                                                                                                   // 14
// Returns an object composed of the following:                                                      // 15
//  * major (integer >= 0)                                                                           // 16
//  * minor (integer >= 0)                                                                           // 17
//  * patch (integer >= 0)                                                                           // 18
//  * prerelease (Array of Number-or-String, possibly empty)                                         // 19
//  * wrapNum (integer >= 0)                                                                         // 20
//  * build (Array of String, possibly empty)                                                        // 21
//  * raw (String), the raw meteor version string                                                    // 22
//  * version (String), canonical meteor version without build ID                                    // 23
//  * semver (String), canonical semver version with build ID but no wrap num                        // 24
//                                                                                                   // 25
// The input string "1.2.3-rc.5_1+12345" has a (major, minor, patch) of                              // 26
// (1, 2, 3), a prerelease of ["rc", 5], a wrapNum of 1, a build of                                  // 27
// ["12345"], a raw of "1.2.3-rc.5_1+12345", a version of                                            // 28
// "1.2.3-rc.5_1", and a semver of "1.2.3-rc.5+12345".                                               // 29
//                                                                                                   // 30
// Throws if the version string is invalid in any way.                                               // 31
//                                                                                                   // 32
// You can write `PV.parse("1.2.3")` as an alternative to `new PV("1.2.3")`                          // 33
var PV = function (versionString) {                                                                  // 34
  if (! (typeof versionString === 'string')) {                                                       // 35
    throw new Error("Invalid PackageVersion argument: " + versionString);                            // 36
  }                                                                                                  // 37
  if (! versionString) {                                                                             // 38
    throwVersionParserError("Empty string is not a valid version");                                  // 39
  }                                                                                                  // 40
                                                                                                     // 41
  // The buildID ("+foo" suffix) is part of semver, but split it off                                 // 42
  // because it comes after the wrapNum.  The wrapNum ("_123" suffix)                                // 43
  // is a Meteor extension to semver.                                                                // 44
  var plusSplit = versionString.split('+');                                                          // 45
  var wrapSplit = plusSplit[0].split('_');                                                           // 46
  var wrapNum = 0;                                                                                   // 47
                                                                                                     // 48
  if (plusSplit.length > 2) {                                                                        // 49
    throwVersionParserError("Can't have two + in version: " + versionString);                        // 50
  }                                                                                                  // 51
  if (wrapSplit.length > 2) {                                                                        // 52
    throwVersionParserError("Can't have two _ in version: " + versionString);                        // 53
  }                                                                                                  // 54
  if (wrapSplit.length > 1) {                                                                        // 55
    wrapNum = wrapSplit[1];                                                                          // 56
    if (! wrapNum) {                                                                                 // 57
      throwVersionParserError("A wrap number must follow _");                                        // 58
    } else if (!/^\d+$/.test(wrapNum)) {                                                             // 59
      throwVersionParserError(                                                                       // 60
        "The wrap number (after _) must contain only digits, so " +                                  // 61
          versionString + " is invalid.");                                                           // 62
    } else if (wrapNum[0] === "0") {                                                                 // 63
      throwVersionParserError(                                                                       // 64
        "The wrap number (after _) must not have a leading zero, so " +                              // 65
          versionString + " is invalid.");                                                           // 66
    }                                                                                                // 67
    wrapNum = parseInt(wrapNum, 10);                                                                 // 68
  }                                                                                                  // 69
                                                                                                     // 70
  // semverPart is everything but the wrapNum, so for "1.0.0_2+xyz",                                 // 71
  // it is "1.0.0+xyz".                                                                              // 72
  var semverPart = wrapSplit[0];                                                                     // 73
  if (plusSplit.length > 1) {                                                                        // 74
    semverPart += "+" + plusSplit[1];                                                                // 75
  }                                                                                                  // 76
                                                                                                     // 77
  // NPM's semver spec supports things like 'v1.0.0' and considers them valid,                       // 78
  // but we don't. Everything before the + or - should be of the x.x.x form.                         // 79
  if (! /^\d+\.\d+\.\d+(\+|-|$)/.test(semverPart)) {                                                 // 80
    throwVersionParserError(                                                                         // 81
      "Version string must look like semver (eg '1.2.3'), not '"                                     // 82
        + versionString + "'.");                                                                     // 83
  };                                                                                                 // 84
                                                                                                     // 85
  var semverParse = semver.parse(semverPart);                                                        // 86
  if (! semverParse) {                                                                               // 87
    throwVersionParserError(                                                                         // 88
      "Version string must look like semver (eg '1.2.3'), not '"                                     // 89
        + semverPart + "'.");                                                                        // 90
  }                                                                                                  // 91
                                                                                                     // 92
  this.major = semverParse.major; // Number                                                          // 93
  this.minor = semverParse.minor; // Number                                                          // 94
  this.patch = semverParse.patch; // Number                                                          // 95
  this.prerelease = semverParse.prerelease; // [OneOf(Number, String)]                               // 96
  this.wrapNum = wrapNum; // Number                                                                  // 97
  this.build = semverParse.build; // [String]                                                        // 98
  this.raw = versionString; // the entire version string                                             // 99
  // `.version` is everything but the build ID ("+foo"), and it                                      // 100
  // has been run through semver's canonicalization, ie "cleaned"                                    // 101
  // (for whatever that's worth)                                                                     // 102
  this.version = semverParse.version + (wrapNum ? '_' + wrapNum : '');                               // 103
  // everything but the wrapnum ("_123")                                                             // 104
  this.semver = semverParse.version + (                                                              // 105
    semverParse.build.length ? '+' + semverParse.build.join('.') : '');                              // 106
};                                                                                                   // 107
                                                                                                     // 108
PV.parse = function (versionString) {                                                                // 109
  return new PV(versionString);                                                                      // 110
};                                                                                                   // 111
                                                                                                     // 112
if (inTool) {                                                                                        // 113
  module.exports = PV;                                                                               // 114
} else {                                                                                             // 115
  PackageVersion = PV;                                                                               // 116
}                                                                                                    // 117
                                                                                                     // 118
// Converts a meteor version into a large floating point number, which                               // 119
// is (more or less [*]) unique to that version. Satisfies the                                       // 120
// following guarantee: If PV.lessThan(v1, v2) then                                                  // 121
// PV.versionMagnitude(v1) < PV.versionMagnitude(v2) [*]                                             // 122
//                                                                                                   // 123
// [* XXX!] We don't quite satisfy the uniqueness and comparison properties in                       // 124
// these cases:                                                                                      // 125
// 1. If any of the version parts are greater than 100 (pretty unlikely?)                            // 126
// 2. If we're dealing with a prerelease version, we only look at the                                // 127
//    first two characters of each prerelease part. So, "1.0.0-beta" and                             // 128
//    "1.0.0-bear" will have the same magnitude.                                                     // 129
// 3. If we're dealing with a prerelease version with more than two parts, eg                        // 130
//    "1.0.0-rc.0.1". In this comparison may fail since we'd get to the limit                        // 131
//    of JavaScript floating point precision.                                                        // 132
//                                                                                                   // 133
// If we wanted to fix this, we'd make this function return a BigFloat                               // 134
// instead of a vanilla JavaScript number. That will make the                                        // 135
// constraint solver slower (by how much?), and would require some                                   // 136
// careful thought.                                                                                  // 137
// (Or it could just return some sort of tuple, and ensure that                                      // 138
// the cost functions that consume this can deal with tuples...)                                     // 139
PV.versionMagnitude = function (versionString) {                                                     // 140
  var v = PV.parse(versionString);                                                                   // 141
                                                                                                     // 142
  return v.major * 100 * 100 +                                                                       // 143
    v.minor * 100 +                                                                                  // 144
    v.patch +                                                                                        // 145
    v.wrapNum / 100 +                                                                                // 146
    prereleaseIdentifierToFraction(v.prerelease) / 100 / 100;                                        // 147
};                                                                                                   // 148
                                                                                                     // 149
// Accepts an array, eg ["rc", 2, 3]. Returns a number in the range                                  // 150
// (-1, 0].  An empty array returns 0. A non-empty string returns a                                  // 151
// number that is "as large" as the its precedence.                                                  // 152
var prereleaseIdentifierToFraction = function (prerelease) {                                         // 153
  if (prerelease.length === 0)                                                                       // 154
    return 0;                                                                                        // 155
                                                                                                     // 156
  return __.reduce(prerelease, function (memo, part, index) {                                        // 157
    var digit;                                                                                       // 158
    if (typeof part === 'number') {                                                                  // 159
      digit = part+1;                                                                                // 160
    } else if (typeof part === 'string') {                                                           // 161
      var VALID_CHARACTERS =                                                                         // 162
            "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";                       // 163
                                                                                                     // 164
      var validCharToNumber = function (ch) {                                                        // 165
        var result = VALID_CHARACTERS.indexOf(ch);                                                   // 166
        if (result === -1)                                                                           // 167
          throw new Error("Unexpected character in prerelease identifier: " + ch);                   // 168
        else                                                                                         // 169
          return result;                                                                             // 170
      };                                                                                             // 171
                                                                                                     // 172
      digit = 101 + // Numeric parts always have lower precedence than non-numeric parts.            // 173
        validCharToNumber(part[0]) * VALID_CHARACTERS.length +                                       // 174
        (part[1] ? validCharToNumber(part[1]) : 0);                                                  // 175
    } else {                                                                                         // 176
      throw new Error("Unexpected prerelease identifier part: " + part + " of type " + typeof part); // 177
    }                                                                                                // 178
                                                                                                     // 179
    // 4100 > 101 + VALID_CHARACTERS.length *                                                        // 180
    // VALID_CHARACTERS.length. And there's a test to verify this                                    // 181
    // ("test the edges of `versionMagnitude`")                                                      // 182
    return memo + digit / Math.pow(4100, index+1);                                                   // 183
  }, -1);                                                                                            // 184
};                                                                                                   // 185
                                                                                                     // 186
// Takes in two meteor versions. Returns true if the first one is less than the second.              // 187
// Versions are strings or PackageVersion objects.                                                   // 188
PV.lessThan = function (versionOne, versionTwo) {                                                    // 189
  return PV.compare(versionOne, versionTwo) < 0;                                                     // 190
};                                                                                                   // 191
                                                                                                     // 192
// Given a string version, returns its major version (the first section of the                       // 193
// semver), as an integer. Two versions are compatible if they have the same                         // 194
// version number.                                                                                   // 195
//                                                                                                   // 196
// versionString: valid meteor version string.                                                       // 197
PV.majorVersion = function (versionString) {                                                         // 198
  return PV.parse(versionString).major;                                                              // 199
};                                                                                                   // 200
                                                                                                     // 201
// Takes in two meteor versions. Returns 0 if equal, a positive number if v1                         // 202
// is greater, a negative number if v2 is greater.                                                   // 203
// Versions are strings or PackageVersion objects.                                                   // 204
PV.compare = function (versionOne, versionTwo) {                                                     // 205
  var v1 = versionOne;                                                                               // 206
  if (typeof v1 === 'string') {                                                                      // 207
    v1 = PV.parse(v1);                                                                               // 208
  }                                                                                                  // 209
  var v2 = versionTwo;                                                                               // 210
  if (typeof v2 === 'string') {                                                                      // 211
    v2 = PV.parse(v2);                                                                               // 212
  }                                                                                                  // 213
                                                                                                     // 214
  // If the semver parts are different, use the semver library to compare,                           // 215
  // ignoring wrap numbers.  (The semver library will ignore the build ID                            // 216
  // per the semver spec.)                                                                           // 217
  if (v1.semver !== v2.semver) {                                                                     // 218
    return semver.compare(v1.semver, v2.semver);                                                     // 219
  } else {                                                                                           // 220
    // If the semver components are equal, then the one with the smaller wrap                        // 221
    // numbers is smaller.                                                                           // 222
    return v1.wrapNum - v2.wrapNum;                                                                  // 223
  }                                                                                                  // 224
};                                                                                                   // 225
                                                                                                     // 226
// Conceptually we have three types of constraints:                                                  // 227
// 1. "compatible-with" - A@x.y.z - constraints package A to version x.y.z or                        // 228
//    higher, as long as the version is backwards compatible with x.y.z.                             // 229
//    "pick A compatible with x.y.z"                                                                 // 230
//    It is the default type.                                                                        // 231
// 2. "exactly" - A@=x.y.z - constraints package A only to version x.y.z and                         // 232
//    nothing else.                                                                                  // 233
//    "pick A exactly at x.y.z"                                                                      // 234
// 3. "any-reasonable" - "A"                                                                         // 235
//    Basically, this means any version of A ... other than ones that have                           // 236
//    dashes in the version (ie, are prerelease) ... unless the prerelease                           // 237
//    version has been explicitly selected (which at this stage in the game                          // 238
//    means they are mentioned in a top-level constraint in the top-level                            // 239
//    call to the resolver).                                                                         // 240
var parseSimpleConstraint = function (constraintString) {                                            // 241
  if (! constraintString) {                                                                          // 242
    throw new Error("Non-empty string required");                                                    // 243
  }                                                                                                  // 244
                                                                                                     // 245
  var type, versionString;                                                                           // 246
                                                                                                     // 247
  if (constraintString.charAt(0) === '=') {                                                          // 248
    type = "exactly";                                                                                // 249
    versionString = constraintString.substr(1);                                                      // 250
  } else {                                                                                           // 251
    type = "compatible-with";                                                                        // 252
    versionString = constraintString;                                                                // 253
  }                                                                                                  // 254
                                                                                                     // 255
  // This will throw if the version string is invalid.                                               // 256
  PV.getValidServerVersion(versionString);                                                           // 257
                                                                                                     // 258
  return { type: type, versionString: versionString };                                               // 259
};                                                                                                   // 260
                                                                                                     // 261
                                                                                                     // 262
// Check to see if the versionString that we pass in is a valid meteor version.                      // 263
//                                                                                                   // 264
// Returns a valid meteor version string that can be included in the                                 // 265
// server. That means that it has everything EXCEPT the build id. Throws if the                      // 266
// entered string was invalid.                                                                       // 267
PV.getValidServerVersion = function (meteorVersionString) {                                          // 268
  return PV.parse(meteorVersionString).version;                                                      // 269
};                                                                                                   // 270
                                                                                                     // 271
PV.VersionConstraint = function (vConstraintString) {                                                // 272
  var alternatives;                                                                                  // 273
  // If there is no version string ("" or null), then our only                                       // 274
  // constraint is any-reasonable.                                                                   // 275
  if (! vConstraintString) {                                                                         // 276
    // .versionString === null is relied on in the tool                                              // 277
    alternatives =                                                                                   // 278
      [ { type: "any-reasonable", versionString: null } ];                                           // 279
    vConstraintString = "";                                                                          // 280
  } else {                                                                                           // 281
    // Parse out the versionString.                                                                  // 282
    var parts = vConstraintString.split(/ *\|\| */);                                                 // 283
    alternatives = __.map(parts, function (alt) {                                                    // 284
      if (! alt) {                                                                                   // 285
        throwVersionParserError("Invalid constraint string: " +                                      // 286
                                vConstraintString);                                                  // 287
      }                                                                                              // 288
      return parseSimpleConstraint(alt);                                                             // 289
    });                                                                                              // 290
  }                                                                                                  // 291
                                                                                                     // 292
  this.raw = vConstraintString;                                                                      // 293
  this.alternatives = alternatives;                                                                  // 294
};                                                                                                   // 295
                                                                                                     // 296
PV.parseVersionConstraint = function (constraintString) {                                            // 297
  return new PV.VersionConstraint(constraintString);                                                 // 298
};                                                                                                   // 299
                                                                                                     // 300
// A PackageConstraint consists of a package name and a version constraint.                          // 301
// Call either with args (package, versionConstraintString) or                                       // 302
// (packageConstraintString), or (package, versionConstraint).                                       // 303
// That is, ("foo", "1.2.3") or ("foo@1.2.3"), or ("foo", vc) where vc                               // 304
// is instanceof PV.VersionConstraint.                                                               // 305
PV.PackageConstraint = function (part1, part2) {                                                     // 306
  if ((typeof part1 !== "string") ||                                                                 // 307
      (part2 && (typeof part2 !== "string") &&                                                       // 308
       ! (part2 instanceof PV.VersionConstraint))) {                                                 // 309
    throw new Error("constraintString must be a string");                                            // 310
  }                                                                                                  // 311
                                                                                                     // 312
  var packageName, versionConstraint, vConstraintString;                                             // 313
  if (part2) {                                                                                       // 314
    packageName = part1;                                                                             // 315
    if (part2 instanceof PV.VersionConstraint) {                                                     // 316
      versionConstraint = part2;                                                                     // 317
    } else {                                                                                         // 318
      vConstraintString = part2;                                                                     // 319
    }                                                                                                // 320
  } else if (part1.indexOf("@") >= 0) {                                                              // 321
    // Shave off last part after @, with "a@b@c" becoming ["a@b", "c"].                              // 322
    // Validating the package name will catch extra @.                                               // 323
    var parts = part1.match(/^(.*)@([^@]*)$/).slice(1);                                              // 324
    packageName = parts[0];                                                                          // 325
    vConstraintString = parts[1];                                                                    // 326
    if (! vConstraintString) {                                                                       // 327
      throwVersionParserError(                                                                       // 328
        "Version constraint for package '" + packageName +                                           // 329
          "' cannot be empty; leave off the @ if you don't want to constrain " +                     // 330
          "the version.");                                                                           // 331
    }                                                                                                // 332
  } else {                                                                                           // 333
    packageName = part1;                                                                             // 334
    vConstraintString = "";                                                                          // 335
  }                                                                                                  // 336
                                                                                                     // 337
  PV.validatePackageName(packageName);                                                               // 338
  if (versionConstraint) {                                                                           // 339
    vConstraintString = versionConstraint.raw;                                                       // 340
  } else {                                                                                           // 341
    versionConstraint = PV.parseVersionConstraint(vConstraintString);                                // 342
  }                                                                                                  // 343
                                                                                                     // 344
  this.package = packageName;                                                                        // 345
  this.constraintString = vConstraintString;                                                         // 346
  this.versionConstraint = versionConstraint;                                                        // 347
};                                                                                                   // 348
                                                                                                     // 349
PV.PackageConstraint.prototype.toString = function () {                                              // 350
  var ret = this.package;                                                                            // 351
  if (this.constraintString) {                                                                       // 352
    ret += "@" + this.constraintString;                                                              // 353
  }                                                                                                  // 354
  return ret;                                                                                        // 355
};                                                                                                   // 356
                                                                                                     // 357
// Structure of a parsed constraint:                                                                 // 358
//                                                                                                   // 359
// /*PV.PackageConstraint*/                                                                          // 360
// { package: String,                                                                                // 361
//   constraintString: String,                                                                       // 362
//   versionConstraint: /*PV.VersionConstraint*/ {                                                   // 363
//     raw: String,                                                                                  // 364
//     alternatives: [{versionString: String|null,                                                   // 365
//                     type: String}]}}                                                              // 366
PV.parsePackageConstraint = function (part1, part2) {                                                // 367
  return new PV.PackageConstraint(part1, part2);                                                     // 368
};                                                                                                   // 369
                                                                                                     // 370
PV.validatePackageName = function (packageName, options) {                                           // 371
  options = options || {};                                                                           // 372
                                                                                                     // 373
  var badChar = packageName.match(/[^a-z0-9:.\-]/);                                                  // 374
  if (badChar) {                                                                                     // 375
    if (options.detailedColonExplanation) {                                                          // 376
      throwVersionParserError(                                                                       // 377
        "Bad character in package name: " + JSON.stringify(badChar[0]) +                             // 378
          ".\n\nPackage names can only contain lowercase ASCII alphanumerics, " +                    // 379
          "dash, or dot.\nIf you plan to publish a package, it must be " +                           // 380
          "prefixed with your\nMeteor Developer Account username and a colon.");                     // 381
    }                                                                                                // 382
    throwVersionParserError(                                                                         // 383
      "Package names can only contain lowercase ASCII alphanumerics, dash, " +                       // 384
        "dot, or colon, not " + JSON.stringify(badChar[0]) + ".");                                   // 385
  }                                                                                                  // 386
  if (!/[a-z]/.test(packageName)) {                                                                  // 387
    throwVersionParserError("Package name must contain a lowercase ASCII letter: "                   // 388
                            + JSON.stringify(packageName));                                          // 389
  }                                                                                                  // 390
  if (packageName[0] === '.') {                                                                      // 391
    throwVersionParserError("Package name may not begin with a dot: "                                // 392
                            + JSON.stringify(packageName));                                          // 393
  }                                                                                                  // 394
  if (packageName.slice(-1) === '.') {                                                               // 395
    throwVersionParserError("Package name may not end with a dot: "                                  // 396
                            + JSON.stringify(packageName));                                          // 397
  }                                                                                                  // 398
                                                                                                     // 399
  if (packageName.slice(-1) === '.') {                                                               // 400
    throwVersionParserError("Package names may not end with a dot: " +                               // 401
                            JSON.stringify(packageName));                                            // 402
  }                                                                                                  // 403
  if (packageName.indexOf('..') >= 0) {                                                              // 404
    throwVersionParserError("Package names may not contain two consecutive dots: " +                 // 405
                            JSON.stringify(packageName));                                            // 406
  }                                                                                                  // 407
  if (packageName[0] === '-') {                                                                      // 408
    throwVersionParserError("Package names may not begin with a hyphen: " +                          // 409
                            JSON.stringify(packageName));                                            // 410
  }                                                                                                  // 411
  // (There is already a package ending with a `-` and one with two consecutive `-`                  // 412
  // in troposphere, though they both look like typos.)                                              // 413
                                                                                                     // 414
  if (packageName[0] === ":" || __.last(packageName) === ":") {                                      // 415
    throwVersionParserError("Package names may not start or end with a colon: " +                    // 416
                            JSON.stringify(packageName));                                            // 417
  }                                                                                                  // 418
};                                                                                                   // 419
                                                                                                     // 420
var throwVersionParserError = function (message) {                                                   // 421
  var e = new Error(message);                                                                        // 422
  e.versionParserError = true;                                                                       // 423
  throw e;                                                                                           // 424
};                                                                                                   // 425
                                                                                                     // 426
// Return true if the version constraint was invalid prior to 0.9.3                                  // 427
// (adding _ and || support)                                                                         // 428
//                                                                                                   // 429
// NOTE: this is not used on the client yet. This package is used by the                             // 430
// package server to determine what is valid.                                                        // 431
PV.invalidFirstFormatConstraint = function (validConstraint) {                                       // 432
  if (!validConstraint) return false;                                                                // 433
  // We can check this easily right now, because we introduced some new                              // 434
  // characters. Anything with those characters is invalid prior to                                  // 435
  // 0.9.3. XXX: If we ever have to go through these, we should write a more                         // 436
  // complicated regex.                                                                              // 437
  return (/_/.test(validConstraint) ||                                                               // 438
          /\|/.test(validConstraint));                                                               // 439
};                                                                                                   // 440
                                                                                                     // 441
// Remove a suffix like "+foo" if present.                                                           // 442
PV.removeBuildID = function (versionString) {                                                        // 443
  return versionString.replace(/\+.*$/, '');                                                         // 444
};                                                                                                   // 445
                                                                                                     // 446
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['package-version-parser'] = {
  PackageVersion: PackageVersion
};

})();

//# sourceMappingURL=package-version-parser.js.map
