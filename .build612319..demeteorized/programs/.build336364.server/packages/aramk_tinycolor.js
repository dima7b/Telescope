(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var tinycolor;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/aramk:tinycolor/tinycolor.js                                                                     //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
// TinyColor v1.1.0                                                                                          // 1
// https://github.com/bgrins/TinyColor                                                                       // 2
// Brian Grinstead, MIT License                                                                              // 3
                                                                                                             // 4
(function () {                                                                                               // 5
                                                                                                             // 6
    // global on the server, window in the browser                                                           // 7
    var root = this;                                                                                         // 8
                                                                                                             // 9
    var _tinycolor = (function() {                                                                           // 10
                                                                                                             // 11
////////////////////////////////////////////////////////////////////////////////                             // 12
// BEGIN LIBRARY CODE                                                                                        // 13
////////////////////////////////////////////////////////////////////////////////                             // 14
                                                                                                             // 15
var trimLeft = /^[\s,#]+/,                                                                                   // 16
    trimRight = /\s+$/,                                                                                      // 17
    tinyCounter = 0,                                                                                         // 18
    math = Math,                                                                                             // 19
    mathRound = math.round,                                                                                  // 20
    mathMin = math.min,                                                                                      // 21
    mathMax = math.max,                                                                                      // 22
    mathRandom = math.random;                                                                                // 23
                                                                                                             // 24
var tinycolor = function tinycolor (color, opts) {                                                           // 25
                                                                                                             // 26
    color = (color) ? color : '';                                                                            // 27
    opts = opts || { };                                                                                      // 28
                                                                                                             // 29
    // If input is already a tinycolor, return itself                                                        // 30
    if (color instanceof tinycolor) {                                                                        // 31
       return color;                                                                                         // 32
    }                                                                                                        // 33
    // If we are called as a function, call using new instead                                                // 34
    if (!(this instanceof tinycolor)) {                                                                      // 35
        return new tinycolor(color, opts);                                                                   // 36
    }                                                                                                        // 37
                                                                                                             // 38
    var rgb = inputToRGB(color);                                                                             // 39
    this._originalInput = color,                                                                             // 40
    this._r = rgb.r,                                                                                         // 41
    this._g = rgb.g,                                                                                         // 42
    this._b = rgb.b,                                                                                         // 43
    this._a = rgb.a,                                                                                         // 44
    this._roundA = mathRound(100*this._a) / 100,                                                             // 45
    this._format = opts.format || rgb.format;                                                                // 46
    this._gradientType = opts.gradientType;                                                                  // 47
                                                                                                             // 48
    // Don't let the range of [0,255] come back in [0,1].                                                    // 49
    // Potentially lose a little bit of precision here, but will fix issues where                            // 50
    // .5 gets interpreted as half of the total, instead of half of 1                                        // 51
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`                          // 52
    if (this._r < 1) { this._r = mathRound(this._r); }                                                       // 53
    if (this._g < 1) { this._g = mathRound(this._g); }                                                       // 54
    if (this._b < 1) { this._b = mathRound(this._b); }                                                       // 55
                                                                                                             // 56
    this._ok = rgb.ok;                                                                                       // 57
    this._tc_id = tinyCounter++;                                                                             // 58
};                                                                                                           // 59
                                                                                                             // 60
tinycolor.prototype = {                                                                                      // 61
    isDark: function() {                                                                                     // 62
        return this.getBrightness() < 128;                                                                   // 63
    },                                                                                                       // 64
    isLight: function() {                                                                                    // 65
        return !this.isDark();                                                                               // 66
    },                                                                                                       // 67
    isValid: function() {                                                                                    // 68
        return this._ok;                                                                                     // 69
    },                                                                                                       // 70
    getOriginalInput: function() {                                                                           // 71
      return this._originalInput;                                                                            // 72
    },                                                                                                       // 73
    getFormat: function() {                                                                                  // 74
        return this._format;                                                                                 // 75
    },                                                                                                       // 76
    getAlpha: function() {                                                                                   // 77
        return this._a;                                                                                      // 78
    },                                                                                                       // 79
    getBrightness: function() {                                                                              // 80
        var rgb = this.toRgb();                                                                              // 81
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;                                             // 82
    },                                                                                                       // 83
    setAlpha: function(value) {                                                                              // 84
        this._a = boundAlpha(value);                                                                         // 85
        this._roundA = mathRound(100*this._a) / 100;                                                         // 86
        return this;                                                                                         // 87
    },                                                                                                       // 88
    toHsv: function() {                                                                                      // 89
        var hsv = rgbToHsv(this._r, this._g, this._b);                                                       // 90
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };                                           // 91
    },                                                                                                       // 92
    toHsvString: function() {                                                                                // 93
        var hsv = rgbToHsv(this._r, this._g, this._b);                                                       // 94
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);              // 95
        return (this._a == 1) ?                                                                              // 96
          "hsv("  + h + ", " + s + "%, " + v + "%)" :                                                        // 97
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";                                    // 98
    },                                                                                                       // 99
    toHsl: function() {                                                                                      // 100
        var hsl = rgbToHsl(this._r, this._g, this._b);                                                       // 101
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };                                           // 102
    },                                                                                                       // 103
    toHslString: function() {                                                                                // 104
        var hsl = rgbToHsl(this._r, this._g, this._b);                                                       // 105
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);              // 106
        return (this._a == 1) ?                                                                              // 107
          "hsl("  + h + ", " + s + "%, " + l + "%)" :                                                        // 108
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";                                    // 109
    },                                                                                                       // 110
    toHex: function(allow3Char) {                                                                            // 111
        return rgbToHex(this._r, this._g, this._b, allow3Char);                                              // 112
    },                                                                                                       // 113
    toHexString: function(allow3Char) {                                                                      // 114
        return '#' + this.toHex(allow3Char);                                                                 // 115
    },                                                                                                       // 116
    toHex8: function() {                                                                                     // 117
        return rgbaToHex(this._r, this._g, this._b, this._a);                                                // 118
    },                                                                                                       // 119
    toHex8String: function() {                                                                               // 120
        return '#' + this.toHex8();                                                                          // 121
    },                                                                                                       // 122
    toRgb: function() {                                                                                      // 123
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };          // 124
    },                                                                                                       // 125
    toRgbString: function() {                                                                                // 126
        return (this._a == 1) ?                                                                              // 127
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :       // 128
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },                                                                                                       // 130
    toPercentageRgb: function() {                                                                            // 131
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },                                                                                                       // 133
    toPercentageRgbString: function() {                                                                      // 134
        return (this._a == 1) ?                                                                              // 135
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },                                                                                                       // 138
    toName: function() {                                                                                     // 139
        if (this._a === 0) {                                                                                 // 140
            return "transparent";                                                                            // 141
        }                                                                                                    // 142
                                                                                                             // 143
        if (this._a < 1) {                                                                                   // 144
            return false;                                                                                    // 145
        }                                                                                                    // 146
                                                                                                             // 147
        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;                                 // 148
    },                                                                                                       // 149
    toFilter: function(secondColor) {                                                                        // 150
        var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);                                // 151
        var secondHex8String = hex8String;                                                                   // 152
        var gradientType = this._gradientType ? "GradientType = 1, " : "";                                   // 153
                                                                                                             // 154
        if (secondColor) {                                                                                   // 155
            var s = tinycolor(secondColor);                                                                  // 156
            secondHex8String = s.toHex8String();                                                             // 157
        }                                                                                                    // 158
                                                                                                             // 159
        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },                                                                                                       // 161
    toString: function(format) {                                                                             // 162
        var formatSet = !!format;                                                                            // 163
        format = format || this._format;                                                                     // 164
                                                                                                             // 165
        var formattedString = false;                                                                         // 166
        var hasAlpha = this._a < 1 && this._a >= 0;                                                          // 167
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");
                                                                                                             // 169
        if (needsAlphaFormat) {                                                                              // 170
            // Special case for "transparent", all other non-alpha formats                                   // 171
            // will return rgba when there is transparency.                                                  // 172
            if (format === "name" && this._a === 0) {                                                        // 173
                return this.toName();                                                                        // 174
            }                                                                                                // 175
            return this.toRgbString();                                                                       // 176
        }                                                                                                    // 177
        if (format === "rgb") {                                                                              // 178
            formattedString = this.toRgbString();                                                            // 179
        }                                                                                                    // 180
        if (format === "prgb") {                                                                             // 181
            formattedString = this.toPercentageRgbString();                                                  // 182
        }                                                                                                    // 183
        if (format === "hex" || format === "hex6") {                                                         // 184
            formattedString = this.toHexString();                                                            // 185
        }                                                                                                    // 186
        if (format === "hex3") {                                                                             // 187
            formattedString = this.toHexString(true);                                                        // 188
        }                                                                                                    // 189
        if (format === "hex8") {                                                                             // 190
            formattedString = this.toHex8String();                                                           // 191
        }                                                                                                    // 192
        if (format === "name") {                                                                             // 193
            formattedString = this.toName();                                                                 // 194
        }                                                                                                    // 195
        if (format === "hsl") {                                                                              // 196
            formattedString = this.toHslString();                                                            // 197
        }                                                                                                    // 198
        if (format === "hsv") {                                                                              // 199
            formattedString = this.toHsvString();                                                            // 200
        }                                                                                                    // 201
                                                                                                             // 202
        return formattedString || this.toHexString();                                                        // 203
    },                                                                                                       // 204
                                                                                                             // 205
    _applyModification: function(fn, args) {                                                                 // 206
        var color = fn.apply(null, [this].concat([].slice.call(args)));                                      // 207
        this._r = color._r;                                                                                  // 208
        this._g = color._g;                                                                                  // 209
        this._b = color._b;                                                                                  // 210
        this.setAlpha(color._a);                                                                             // 211
        return this;                                                                                         // 212
    },                                                                                                       // 213
    lighten: function() {                                                                                    // 214
        return this._applyModification(lighten, arguments);                                                  // 215
    },                                                                                                       // 216
    brighten: function() {                                                                                   // 217
        return this._applyModification(brighten, arguments);                                                 // 218
    },                                                                                                       // 219
    darken: function() {                                                                                     // 220
        return this._applyModification(darken, arguments);                                                   // 221
    },                                                                                                       // 222
    desaturate: function() {                                                                                 // 223
        return this._applyModification(desaturate, arguments);                                               // 224
    },                                                                                                       // 225
    saturate: function() {                                                                                   // 226
        return this._applyModification(saturate, arguments);                                                 // 227
    },                                                                                                       // 228
    greyscale: function() {                                                                                  // 229
        return this._applyModification(greyscale, arguments);                                                // 230
    },                                                                                                       // 231
    spin: function() {                                                                                       // 232
        return this._applyModification(spin, arguments);                                                     // 233
    },                                                                                                       // 234
                                                                                                             // 235
    _applyCombination: function(fn, args) {                                                                  // 236
        return fn.apply(null, [this].concat([].slice.call(args)));                                           // 237
    },                                                                                                       // 238
    analogous: function() {                                                                                  // 239
        return this._applyCombination(analogous, arguments);                                                 // 240
    },                                                                                                       // 241
    complement: function() {                                                                                 // 242
        return this._applyCombination(complement, arguments);                                                // 243
    },                                                                                                       // 244
    monochromatic: function() {                                                                              // 245
        return this._applyCombination(monochromatic, arguments);                                             // 246
    },                                                                                                       // 247
    splitcomplement: function() {                                                                            // 248
        return this._applyCombination(splitcomplement, arguments);                                           // 249
    },                                                                                                       // 250
    triad: function() {                                                                                      // 251
        return this._applyCombination(triad, arguments);                                                     // 252
    },                                                                                                       // 253
    tetrad: function() {                                                                                     // 254
        return this._applyCombination(tetrad, arguments);                                                    // 255
    }                                                                                                        // 256
};                                                                                                           // 257
                                                                                                             // 258
// If input is an object, force 1 into "1.0" to handle ratios properly                                       // 259
// String input requires "1.0" as input, so 1 will be treated as 1                                           // 260
tinycolor.fromRatio = function(color, opts) {                                                                // 261
    if (typeof color == "object") {                                                                          // 262
        var newColor = {};                                                                                   // 263
        for (var i in color) {                                                                               // 264
            if (color.hasOwnProperty(i)) {                                                                   // 265
                if (i === "a") {                                                                             // 266
                    newColor[i] = color[i];                                                                  // 267
                }                                                                                            // 268
                else {                                                                                       // 269
                    newColor[i] = convertToPercentage(color[i]);                                             // 270
                }                                                                                            // 271
            }                                                                                                // 272
        }                                                                                                    // 273
        color = newColor;                                                                                    // 274
    }                                                                                                        // 275
                                                                                                             // 276
    return tinycolor(color, opts);                                                                           // 277
};                                                                                                           // 278
                                                                                                             // 279
// Given a string or object, convert that input to RGB                                                       // 280
// Possible string inputs:                                                                                   // 281
//                                                                                                           // 282
//     "red"                                                                                                 // 283
//     "#f00" or "f00"                                                                                       // 284
//     "#ff0000" or "ff0000"                                                                                 // 285
//     "#ff000000" or "ff000000"                                                                             // 286
//     "rgb 255 0 0" or "rgb (255, 0, 0)"                                                                    // 287
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"                                                                      // 288
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"                                                          // 289
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"                                                          // 290
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"                                                               // 291
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"                                                       // 292
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"                                                             // 293
//                                                                                                           // 294
function inputToRGB(color) {                                                                                 // 295
                                                                                                             // 296
    var rgb = { r: 0, g: 0, b: 0 };                                                                          // 297
    var a = 1;                                                                                               // 298
    var ok = false;                                                                                          // 299
    var format = false;                                                                                      // 300
                                                                                                             // 301
    if (typeof color == "string") {                                                                          // 302
        color = stringInputToObject(color);                                                                  // 303
    }                                                                                                        // 304
                                                                                                             // 305
    if (typeof color == "object") {                                                                          // 306
        if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {           // 307
            rgb = rgbToRgb(color.r, color.g, color.b);                                                       // 308
            ok = true;                                                                                       // 309
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";                                    // 310
        }                                                                                                    // 311
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {      // 312
            color.s = convertToPercentage(color.s);                                                          // 313
            color.v = convertToPercentage(color.v);                                                          // 314
            rgb = hsvToRgb(color.h, color.s, color.v);                                                       // 315
            ok = true;                                                                                       // 316
            format = "hsv";                                                                                  // 317
        }                                                                                                    // 318
        else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {      // 319
            color.s = convertToPercentage(color.s);                                                          // 320
            color.l = convertToPercentage(color.l);                                                          // 321
            rgb = hslToRgb(color.h, color.s, color.l);                                                       // 322
            ok = true;                                                                                       // 323
            format = "hsl";                                                                                  // 324
        }                                                                                                    // 325
                                                                                                             // 326
        if (color.hasOwnProperty("a")) {                                                                     // 327
            a = color.a;                                                                                     // 328
        }                                                                                                    // 329
    }                                                                                                        // 330
                                                                                                             // 331
    a = boundAlpha(a);                                                                                       // 332
                                                                                                             // 333
    return {                                                                                                 // 334
        ok: ok,                                                                                              // 335
        format: color.format || format,                                                                      // 336
        r: mathMin(255, mathMax(rgb.r, 0)),                                                                  // 337
        g: mathMin(255, mathMax(rgb.g, 0)),                                                                  // 338
        b: mathMin(255, mathMax(rgb.b, 0)),                                                                  // 339
        a: a                                                                                                 // 340
    };                                                                                                       // 341
}                                                                                                            // 342
                                                                                                             // 343
                                                                                                             // 344
// Conversion Functions                                                                                      // 345
// --------------------                                                                                      // 346
                                                                                                             // 347
// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:                                             // 348
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript> // 349
                                                                                                             // 350
// `rgbToRgb`                                                                                                // 351
// Handle bounds / percentage checking to conform to CSS color spec                                          // 352
// <http://www.w3.org/TR/css3-color/>                                                                        // 353
// *Assumes:* r, g, b in [0, 255] or [0, 1]                                                                  // 354
// *Returns:* { r, g, b } in [0, 255]                                                                        // 355
function rgbToRgb(r, g, b){                                                                                  // 356
    return {                                                                                                 // 357
        r: bound01(r, 255) * 255,                                                                            // 358
        g: bound01(g, 255) * 255,                                                                            // 359
        b: bound01(b, 255) * 255                                                                             // 360
    };                                                                                                       // 361
}                                                                                                            // 362
                                                                                                             // 363
// `rgbToHsl`                                                                                                // 364
// Converts an RGB color value to HSL.                                                                       // 365
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]                                                // 366
// *Returns:* { h, s, l } in [0,1]                                                                           // 367
function rgbToHsl(r, g, b) {                                                                                 // 368
                                                                                                             // 369
    r = bound01(r, 255);                                                                                     // 370
    g = bound01(g, 255);                                                                                     // 371
    b = bound01(b, 255);                                                                                     // 372
                                                                                                             // 373
    var max = mathMax(r, g, b), min = mathMin(r, g, b);                                                      // 374
    var h, s, l = (max + min) / 2;                                                                           // 375
                                                                                                             // 376
    if(max == min) {                                                                                         // 377
        h = s = 0; // achromatic                                                                             // 378
    }                                                                                                        // 379
    else {                                                                                                   // 380
        var d = max - min;                                                                                   // 381
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);                                                 // 382
        switch(max) {                                                                                        // 383
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;                                                // 384
            case g: h = (b - r) / d + 2; break;                                                              // 385
            case b: h = (r - g) / d + 4; break;                                                              // 386
        }                                                                                                    // 387
                                                                                                             // 388
        h /= 6;                                                                                              // 389
    }                                                                                                        // 390
                                                                                                             // 391
    return { h: h, s: s, l: l };                                                                             // 392
}                                                                                                            // 393
                                                                                                             // 394
// `hslToRgb`                                                                                                // 395
// Converts an HSL color value to RGB.                                                                       // 396
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]              // 397
// *Returns:* { r, g, b } in the set [0, 255]                                                                // 398
function hslToRgb(h, s, l) {                                                                                 // 399
    var r, g, b;                                                                                             // 400
                                                                                                             // 401
    h = bound01(h, 360);                                                                                     // 402
    s = bound01(s, 100);                                                                                     // 403
    l = bound01(l, 100);                                                                                     // 404
                                                                                                             // 405
    function hue2rgb(p, q, t) {                                                                              // 406
        if(t < 0) t += 1;                                                                                    // 407
        if(t > 1) t -= 1;                                                                                    // 408
        if(t < 1/6) return p + (q - p) * 6 * t;                                                              // 409
        if(t < 1/2) return q;                                                                                // 410
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;                                                      // 411
        return p;                                                                                            // 412
    }                                                                                                        // 413
                                                                                                             // 414
    if(s === 0) {                                                                                            // 415
        r = g = b = l; // achromatic                                                                         // 416
    }                                                                                                        // 417
    else {                                                                                                   // 418
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;                                                       // 419
        var p = 2 * l - q;                                                                                   // 420
        r = hue2rgb(p, q, h + 1/3);                                                                          // 421
        g = hue2rgb(p, q, h);                                                                                // 422
        b = hue2rgb(p, q, h - 1/3);                                                                          // 423
    }                                                                                                        // 424
                                                                                                             // 425
    return { r: r * 255, g: g * 255, b: b * 255 };                                                           // 426
}                                                                                                            // 427
                                                                                                             // 428
// `rgbToHsv`                                                                                                // 429
// Converts an RGB color value to HSV                                                                        // 430
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]                                        // 431
// *Returns:* { h, s, v } in [0,1]                                                                           // 432
function rgbToHsv(r, g, b) {                                                                                 // 433
                                                                                                             // 434
    r = bound01(r, 255);                                                                                     // 435
    g = bound01(g, 255);                                                                                     // 436
    b = bound01(b, 255);                                                                                     // 437
                                                                                                             // 438
    var max = mathMax(r, g, b), min = mathMin(r, g, b);                                                      // 439
    var h, s, v = max;                                                                                       // 440
                                                                                                             // 441
    var d = max - min;                                                                                       // 442
    s = max === 0 ? 0 : d / max;                                                                             // 443
                                                                                                             // 444
    if(max == min) {                                                                                         // 445
        h = 0; // achromatic                                                                                 // 446
    }                                                                                                        // 447
    else {                                                                                                   // 448
        switch(max) {                                                                                        // 449
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;                                                // 450
            case g: h = (b - r) / d + 2; break;                                                              // 451
            case b: h = (r - g) / d + 4; break;                                                              // 452
        }                                                                                                    // 453
        h /= 6;                                                                                              // 454
    }                                                                                                        // 455
    return { h: h, s: s, v: v };                                                                             // 456
}                                                                                                            // 457
                                                                                                             // 458
// `hsvToRgb`                                                                                                // 459
// Converts an HSV color value to RGB.                                                                       // 460
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]           // 461
// *Returns:* { r, g, b } in the set [0, 255]                                                                // 462
 function hsvToRgb(h, s, v) {                                                                                // 463
                                                                                                             // 464
    h = bound01(h, 360) * 6;                                                                                 // 465
    s = bound01(s, 100);                                                                                     // 466
    v = bound01(v, 100);                                                                                     // 467
                                                                                                             // 468
    var i = math.floor(h),                                                                                   // 469
        f = h - i,                                                                                           // 470
        p = v * (1 - s),                                                                                     // 471
        q = v * (1 - f * s),                                                                                 // 472
        t = v * (1 - (1 - f) * s),                                                                           // 473
        mod = i % 6,                                                                                         // 474
        r = [v, q, p, p, t, v][mod],                                                                         // 475
        g = [t, v, v, q, p, p][mod],                                                                         // 476
        b = [p, p, t, v, v, q][mod];                                                                         // 477
                                                                                                             // 478
    return { r: r * 255, g: g * 255, b: b * 255 };                                                           // 479
}                                                                                                            // 480
                                                                                                             // 481
// `rgbToHex`                                                                                                // 482
// Converts an RGB color to hex                                                                              // 483
// Assumes r, g, and b are contained in the set [0, 255]                                                     // 484
// Returns a 3 or 6 character hex                                                                            // 485
function rgbToHex(r, g, b, allow3Char) {                                                                     // 486
                                                                                                             // 487
    var hex = [                                                                                              // 488
        pad2(mathRound(r).toString(16)),                                                                     // 489
        pad2(mathRound(g).toString(16)),                                                                     // 490
        pad2(mathRound(b).toString(16))                                                                      // 491
    ];                                                                                                       // 492
                                                                                                             // 493
    // Return a 3 character hex if possible                                                                  // 494
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);                                       // 496
    }                                                                                                        // 497
                                                                                                             // 498
    return hex.join("");                                                                                     // 499
}                                                                                                            // 500
    // `rgbaToHex`                                                                                           // 501
    // Converts an RGBA color plus alpha transparency to hex                                                 // 502
    // Assumes r, g, b and a are contained in the set [0, 255]                                               // 503
    // Returns an 8 character hex                                                                            // 504
    function rgbaToHex(r, g, b, a) {                                                                         // 505
                                                                                                             // 506
        var hex = [                                                                                          // 507
            pad2(convertDecimalToHex(a)),                                                                    // 508
            pad2(mathRound(r).toString(16)),                                                                 // 509
            pad2(mathRound(g).toString(16)),                                                                 // 510
            pad2(mathRound(b).toString(16))                                                                  // 511
        ];                                                                                                   // 512
                                                                                                             // 513
        return hex.join("");                                                                                 // 514
    }                                                                                                        // 515
                                                                                                             // 516
// `equals`                                                                                                  // 517
// Can be called with any tinycolor input                                                                    // 518
tinycolor.equals = function (color1, color2) {                                                               // 519
    if (!color1 || !color2) { return false; }                                                                // 520
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();                               // 521
};                                                                                                           // 522
tinycolor.random = function() {                                                                              // 523
    return tinycolor.fromRatio({                                                                             // 524
        r: mathRandom(),                                                                                     // 525
        g: mathRandom(),                                                                                     // 526
        b: mathRandom()                                                                                      // 527
    });                                                                                                      // 528
};                                                                                                           // 529
                                                                                                             // 530
                                                                                                             // 531
// Modification Functions                                                                                    // 532
// ----------------------                                                                                    // 533
// Thanks to less.js for some of the basics here                                                             // 534
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>                                  // 535
                                                                                                             // 536
function desaturate(color, amount) {                                                                         // 537
    amount = (amount === 0) ? 0 : (amount || 10);                                                            // 538
    var hsl = tinycolor(color).toHsl();                                                                      // 539
    hsl.s -= amount / 100;                                                                                   // 540
    hsl.s = clamp01(hsl.s);                                                                                  // 541
    return tinycolor(hsl);                                                                                   // 542
}                                                                                                            // 543
                                                                                                             // 544
function saturate(color, amount) {                                                                           // 545
    amount = (amount === 0) ? 0 : (amount || 10);                                                            // 546
    var hsl = tinycolor(color).toHsl();                                                                      // 547
    hsl.s += amount / 100;                                                                                   // 548
    hsl.s = clamp01(hsl.s);                                                                                  // 549
    return tinycolor(hsl);                                                                                   // 550
}                                                                                                            // 551
                                                                                                             // 552
function greyscale(color) {                                                                                  // 553
    return tinycolor(color).desaturate(100);                                                                 // 554
}                                                                                                            // 555
                                                                                                             // 556
function lighten (color, amount) {                                                                           // 557
    amount = (amount === 0) ? 0 : (amount || 10);                                                            // 558
    var hsl = tinycolor(color).toHsl();                                                                      // 559
    hsl.l += amount / 100;                                                                                   // 560
    hsl.l = clamp01(hsl.l);                                                                                  // 561
    return tinycolor(hsl);                                                                                   // 562
}                                                                                                            // 563
                                                                                                             // 564
function brighten(color, amount) {                                                                           // 565
    amount = (amount === 0) ? 0 : (amount || 10);                                                            // 566
    var rgb = tinycolor(color).toRgb();                                                                      // 567
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));                             // 568
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));                             // 569
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));                             // 570
    return tinycolor(rgb);                                                                                   // 571
}                                                                                                            // 572
                                                                                                             // 573
function darken (color, amount) {                                                                            // 574
    amount = (amount === 0) ? 0 : (amount || 10);                                                            // 575
    var hsl = tinycolor(color).toHsl();                                                                      // 576
    hsl.l -= amount / 100;                                                                                   // 577
    hsl.l = clamp01(hsl.l);                                                                                  // 578
    return tinycolor(hsl);                                                                                   // 579
}                                                                                                            // 580
                                                                                                             // 581
// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.                 // 582
// Values outside of this range will be wrapped into this range.                                             // 583
function spin(color, amount) {                                                                               // 584
    var hsl = tinycolor(color).toHsl();                                                                      // 585
    var hue = (mathRound(hsl.h) + amount) % 360;                                                             // 586
    hsl.h = hue < 0 ? 360 + hue : hue;                                                                       // 587
    return tinycolor(hsl);                                                                                   // 588
}                                                                                                            // 589
                                                                                                             // 590
// Combination Functions                                                                                     // 591
// ---------------------                                                                                     // 592
// Thanks to jQuery xColor for some of the ideas behind these                                                // 593
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>                                  // 594
                                                                                                             // 595
function complement(color) {                                                                                 // 596
    var hsl = tinycolor(color).toHsl();                                                                      // 597
    hsl.h = (hsl.h + 180) % 360;                                                                             // 598
    return tinycolor(hsl);                                                                                   // 599
}                                                                                                            // 600
                                                                                                             // 601
function triad(color) {                                                                                      // 602
    var hsl = tinycolor(color).toHsl();                                                                      // 603
    var h = hsl.h;                                                                                           // 604
    return [                                                                                                 // 605
        tinycolor(color),                                                                                    // 606
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),                                               // 607
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })                                                // 608
    ];                                                                                                       // 609
}                                                                                                            // 610
                                                                                                             // 611
function tetrad(color) {                                                                                     // 612
    var hsl = tinycolor(color).toHsl();                                                                      // 613
    var h = hsl.h;                                                                                           // 614
    return [                                                                                                 // 615
        tinycolor(color),                                                                                    // 616
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),                                                // 617
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),                                               // 618
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })                                                // 619
    ];                                                                                                       // 620
}                                                                                                            // 621
                                                                                                             // 622
function splitcomplement(color) {                                                                            // 623
    var hsl = tinycolor(color).toHsl();                                                                      // 624
    var h = hsl.h;                                                                                           // 625
    return [                                                                                                 // 626
        tinycolor(color),                                                                                    // 627
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),                                                 // 628
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})                                                 // 629
    ];                                                                                                       // 630
}                                                                                                            // 631
                                                                                                             // 632
function analogous(color, results, slices) {                                                                 // 633
    results = results || 6;                                                                                  // 634
    slices = slices || 30;                                                                                   // 635
                                                                                                             // 636
    var hsl = tinycolor(color).toHsl();                                                                      // 637
    var part = 360 / slices;                                                                                 // 638
    var ret = [tinycolor(color)];                                                                            // 639
                                                                                                             // 640
    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {                               // 641
        hsl.h = (hsl.h + part) % 360;                                                                        // 642
        ret.push(tinycolor(hsl));                                                                            // 643
    }                                                                                                        // 644
    return ret;                                                                                              // 645
}                                                                                                            // 646
                                                                                                             // 647
function monochromatic(color, results) {                                                                     // 648
    results = results || 6;                                                                                  // 649
    var hsv = tinycolor(color).toHsv();                                                                      // 650
    var h = hsv.h, s = hsv.s, v = hsv.v;                                                                     // 651
    var ret = [];                                                                                            // 652
    var modification = 1 / results;                                                                          // 653
                                                                                                             // 654
    while (results--) {                                                                                      // 655
        ret.push(tinycolor({ h: h, s: s, v: v}));                                                            // 656
        v = (v + modification) % 1;                                                                          // 657
    }                                                                                                        // 658
                                                                                                             // 659
    return ret;                                                                                              // 660
}                                                                                                            // 661
                                                                                                             // 662
// Utility Functions                                                                                         // 663
// ---------------------                                                                                     // 664
                                                                                                             // 665
tinycolor.mix = function(color1, color2, amount) {                                                           // 666
    amount = (amount === 0) ? 0 : (amount || 50);                                                            // 667
                                                                                                             // 668
    var rgb1 = tinycolor(color1).toRgb();                                                                    // 669
    var rgb2 = tinycolor(color2).toRgb();                                                                    // 670
                                                                                                             // 671
    var p = amount / 100;                                                                                    // 672
    var w = p * 2 - 1;                                                                                       // 673
    var a = rgb2.a - rgb1.a;                                                                                 // 674
                                                                                                             // 675
    var w1;                                                                                                  // 676
                                                                                                             // 677
    if (w * a == -1) {                                                                                       // 678
        w1 = w;                                                                                              // 679
    } else {                                                                                                 // 680
        w1 = (w + a) / (1 + w * a);                                                                          // 681
    }                                                                                                        // 682
                                                                                                             // 683
    w1 = (w1 + 1) / 2;                                                                                       // 684
                                                                                                             // 685
    var w2 = 1 - w1;                                                                                         // 686
                                                                                                             // 687
    var rgba = {                                                                                             // 688
        r: rgb2.r * w1 + rgb1.r * w2,                                                                        // 689
        g: rgb2.g * w1 + rgb1.g * w2,                                                                        // 690
        b: rgb2.b * w1 + rgb1.b * w2,                                                                        // 691
        a: rgb2.a * p  + rgb1.a * (1 - p)                                                                    // 692
    };                                                                                                       // 693
                                                                                                             // 694
    return tinycolor(rgba);                                                                                  // 695
};                                                                                                           // 696
                                                                                                             // 697
                                                                                                             // 698
// Readability Functions                                                                                     // 699
// ---------------------                                                                                     // 700
// <http://www.w3.org/TR/AERT#color-contrast>                                                                // 701
                                                                                                             // 702
// `readability`                                                                                             // 703
// Analyze the 2 colors and returns an object with the following properties:                                 // 704
//    `brightness`: difference in brightness between the two colors                                          // 705
//    `color`: difference in color/hue between the two colors                                                // 706
tinycolor.readability = function(color1, color2) {                                                           // 707
    var c1 = tinycolor(color1);                                                                              // 708
    var c2 = tinycolor(color2);                                                                              // 709
    var rgb1 = c1.toRgb();                                                                                   // 710
    var rgb2 = c2.toRgb();                                                                                   // 711
    var brightnessA = c1.getBrightness();                                                                    // 712
    var brightnessB = c2.getBrightness();                                                                    // 713
    var colorDiff = (                                                                                        // 714
        Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) +                                                // 715
        Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) +                                                // 716
        Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b)                                                  // 717
    );                                                                                                       // 718
                                                                                                             // 719
    return {                                                                                                 // 720
        brightness: Math.abs(brightnessA - brightnessB),                                                     // 721
        color: colorDiff                                                                                     // 722
    };                                                                                                       // 723
};                                                                                                           // 724
                                                                                                             // 725
// `readable`                                                                                                // 726
// http://www.w3.org/TR/AERT#color-contrast                                                                  // 727
// Ensure that foreground and background color combinations provide sufficient contrast.                     // 728
// *Example*                                                                                                 // 729
//    tinycolor.isReadable("#000", "#111") => false                                                          // 730
tinycolor.isReadable = function(color1, color2) {                                                            // 731
    var readability = tinycolor.readability(color1, color2);                                                 // 732
    return readability.brightness > 125 && readability.color > 500;                                          // 733
};                                                                                                           // 734
                                                                                                             // 735
// `mostReadable`                                                                                            // 736
// Given a base color and a list of possible foreground or background                                        // 737
// colors for that base, returns the most readable color.                                                    // 738
// *Example*                                                                                                 // 739
//    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"                                             // 740
tinycolor.mostReadable = function(baseColor, colorList) {                                                    // 741
    var bestColor = null;                                                                                    // 742
    var bestScore = 0;                                                                                       // 743
    var bestIsReadable = false;                                                                              // 744
    for (var i=0; i < colorList.length; i++) {                                                               // 745
                                                                                                             // 746
        // We normalize both around the "acceptable" breaking point,                                         // 747
        // but rank brightness constrast higher than hue.                                                    // 748
                                                                                                             // 749
        var readability = tinycolor.readability(baseColor, colorList[i]);                                    // 750
        var readable = readability.brightness > 125 && readability.color > 500;                              // 751
        var score = 3 * (readability.brightness / 125) + (readability.color / 500);                          // 752
                                                                                                             // 753
        if ((readable && ! bestIsReadable) ||                                                                // 754
            (readable && bestIsReadable && score > bestScore) ||                                             // 755
            ((! readable) && (! bestIsReadable) && score > bestScore)) {                                     // 756
            bestIsReadable = readable;                                                                       // 757
            bestScore = score;                                                                               // 758
            bestColor = tinycolor(colorList[i]);                                                             // 759
        }                                                                                                    // 760
    }                                                                                                        // 761
    return bestColor;                                                                                        // 762
};                                                                                                           // 763
                                                                                                             // 764
                                                                                                             // 765
// Big List of Colors                                                                                        // 766
// ------------------                                                                                        // 767
// <http://www.w3.org/TR/css3-color/#svg-color>                                                              // 768
var names = tinycolor.names = {                                                                              // 769
    aliceblue: "f0f8ff",                                                                                     // 770
    antiquewhite: "faebd7",                                                                                  // 771
    aqua: "0ff",                                                                                             // 772
    aquamarine: "7fffd4",                                                                                    // 773
    azure: "f0ffff",                                                                                         // 774
    beige: "f5f5dc",                                                                                         // 775
    bisque: "ffe4c4",                                                                                        // 776
    black: "000",                                                                                            // 777
    blanchedalmond: "ffebcd",                                                                                // 778
    blue: "00f",                                                                                             // 779
    blueviolet: "8a2be2",                                                                                    // 780
    brown: "a52a2a",                                                                                         // 781
    burlywood: "deb887",                                                                                     // 782
    burntsienna: "ea7e5d",                                                                                   // 783
    cadetblue: "5f9ea0",                                                                                     // 784
    chartreuse: "7fff00",                                                                                    // 785
    chocolate: "d2691e",                                                                                     // 786
    coral: "ff7f50",                                                                                         // 787
    cornflowerblue: "6495ed",                                                                                // 788
    cornsilk: "fff8dc",                                                                                      // 789
    crimson: "dc143c",                                                                                       // 790
    cyan: "0ff",                                                                                             // 791
    darkblue: "00008b",                                                                                      // 792
    darkcyan: "008b8b",                                                                                      // 793
    darkgoldenrod: "b8860b",                                                                                 // 794
    darkgray: "a9a9a9",                                                                                      // 795
    darkgreen: "006400",                                                                                     // 796
    darkgrey: "a9a9a9",                                                                                      // 797
    darkkhaki: "bdb76b",                                                                                     // 798
    darkmagenta: "8b008b",                                                                                   // 799
    darkolivegreen: "556b2f",                                                                                // 800
    darkorange: "ff8c00",                                                                                    // 801
    darkorchid: "9932cc",                                                                                    // 802
    darkred: "8b0000",                                                                                       // 803
    darksalmon: "e9967a",                                                                                    // 804
    darkseagreen: "8fbc8f",                                                                                  // 805
    darkslateblue: "483d8b",                                                                                 // 806
    darkslategray: "2f4f4f",                                                                                 // 807
    darkslategrey: "2f4f4f",                                                                                 // 808
    darkturquoise: "00ced1",                                                                                 // 809
    darkviolet: "9400d3",                                                                                    // 810
    deeppink: "ff1493",                                                                                      // 811
    deepskyblue: "00bfff",                                                                                   // 812
    dimgray: "696969",                                                                                       // 813
    dimgrey: "696969",                                                                                       // 814
    dodgerblue: "1e90ff",                                                                                    // 815
    firebrick: "b22222",                                                                                     // 816
    floralwhite: "fffaf0",                                                                                   // 817
    forestgreen: "228b22",                                                                                   // 818
    fuchsia: "f0f",                                                                                          // 819
    gainsboro: "dcdcdc",                                                                                     // 820
    ghostwhite: "f8f8ff",                                                                                    // 821
    gold: "ffd700",                                                                                          // 822
    goldenrod: "daa520",                                                                                     // 823
    gray: "808080",                                                                                          // 824
    green: "008000",                                                                                         // 825
    greenyellow: "adff2f",                                                                                   // 826
    grey: "808080",                                                                                          // 827
    honeydew: "f0fff0",                                                                                      // 828
    hotpink: "ff69b4",                                                                                       // 829
    indianred: "cd5c5c",                                                                                     // 830
    indigo: "4b0082",                                                                                        // 831
    ivory: "fffff0",                                                                                         // 832
    khaki: "f0e68c",                                                                                         // 833
    lavender: "e6e6fa",                                                                                      // 834
    lavenderblush: "fff0f5",                                                                                 // 835
    lawngreen: "7cfc00",                                                                                     // 836
    lemonchiffon: "fffacd",                                                                                  // 837
    lightblue: "add8e6",                                                                                     // 838
    lightcoral: "f08080",                                                                                    // 839
    lightcyan: "e0ffff",                                                                                     // 840
    lightgoldenrodyellow: "fafad2",                                                                          // 841
    lightgray: "d3d3d3",                                                                                     // 842
    lightgreen: "90ee90",                                                                                    // 843
    lightgrey: "d3d3d3",                                                                                     // 844
    lightpink: "ffb6c1",                                                                                     // 845
    lightsalmon: "ffa07a",                                                                                   // 846
    lightseagreen: "20b2aa",                                                                                 // 847
    lightskyblue: "87cefa",                                                                                  // 848
    lightslategray: "789",                                                                                   // 849
    lightslategrey: "789",                                                                                   // 850
    lightsteelblue: "b0c4de",                                                                                // 851
    lightyellow: "ffffe0",                                                                                   // 852
    lime: "0f0",                                                                                             // 853
    limegreen: "32cd32",                                                                                     // 854
    linen: "faf0e6",                                                                                         // 855
    magenta: "f0f",                                                                                          // 856
    maroon: "800000",                                                                                        // 857
    mediumaquamarine: "66cdaa",                                                                              // 858
    mediumblue: "0000cd",                                                                                    // 859
    mediumorchid: "ba55d3",                                                                                  // 860
    mediumpurple: "9370db",                                                                                  // 861
    mediumseagreen: "3cb371",                                                                                // 862
    mediumslateblue: "7b68ee",                                                                               // 863
    mediumspringgreen: "00fa9a",                                                                             // 864
    mediumturquoise: "48d1cc",                                                                               // 865
    mediumvioletred: "c71585",                                                                               // 866
    midnightblue: "191970",                                                                                  // 867
    mintcream: "f5fffa",                                                                                     // 868
    mistyrose: "ffe4e1",                                                                                     // 869
    moccasin: "ffe4b5",                                                                                      // 870
    navajowhite: "ffdead",                                                                                   // 871
    navy: "000080",                                                                                          // 872
    oldlace: "fdf5e6",                                                                                       // 873
    olive: "808000",                                                                                         // 874
    olivedrab: "6b8e23",                                                                                     // 875
    orange: "ffa500",                                                                                        // 876
    orangered: "ff4500",                                                                                     // 877
    orchid: "da70d6",                                                                                        // 878
    palegoldenrod: "eee8aa",                                                                                 // 879
    palegreen: "98fb98",                                                                                     // 880
    paleturquoise: "afeeee",                                                                                 // 881
    palevioletred: "db7093",                                                                                 // 882
    papayawhip: "ffefd5",                                                                                    // 883
    peachpuff: "ffdab9",                                                                                     // 884
    peru: "cd853f",                                                                                          // 885
    pink: "ffc0cb",                                                                                          // 886
    plum: "dda0dd",                                                                                          // 887
    powderblue: "b0e0e6",                                                                                    // 888
    purple: "800080",                                                                                        // 889
    red: "f00",                                                                                              // 890
    rosybrown: "bc8f8f",                                                                                     // 891
    royalblue: "4169e1",                                                                                     // 892
    saddlebrown: "8b4513",                                                                                   // 893
    salmon: "fa8072",                                                                                        // 894
    sandybrown: "f4a460",                                                                                    // 895
    seagreen: "2e8b57",                                                                                      // 896
    seashell: "fff5ee",                                                                                      // 897
    sienna: "a0522d",                                                                                        // 898
    silver: "c0c0c0",                                                                                        // 899
    skyblue: "87ceeb",                                                                                       // 900
    slateblue: "6a5acd",                                                                                     // 901
    slategray: "708090",                                                                                     // 902
    slategrey: "708090",                                                                                     // 903
    snow: "fffafa",                                                                                          // 904
    springgreen: "00ff7f",                                                                                   // 905
    steelblue: "4682b4",                                                                                     // 906
    tan: "d2b48c",                                                                                           // 907
    teal: "008080",                                                                                          // 908
    thistle: "d8bfd8",                                                                                       // 909
    tomato: "ff6347",                                                                                        // 910
    turquoise: "40e0d0",                                                                                     // 911
    violet: "ee82ee",                                                                                        // 912
    wheat: "f5deb3",                                                                                         // 913
    white: "fff",                                                                                            // 914
    whitesmoke: "f5f5f5",                                                                                    // 915
    yellow: "ff0",                                                                                           // 916
    yellowgreen: "9acd32"                                                                                    // 917
};                                                                                                           // 918
                                                                                                             // 919
// Make it easy to access colors via `hexNames[hex]`                                                         // 920
var hexNames = tinycolor.hexNames = flip(names);                                                             // 921
                                                                                                             // 922
                                                                                                             // 923
// Utilities                                                                                                 // 924
// ---------                                                                                                 // 925
                                                                                                             // 926
// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`                                                       // 927
function flip(o) {                                                                                           // 928
    var flipped = { };                                                                                       // 929
    for (var i in o) {                                                                                       // 930
        if (o.hasOwnProperty(i)) {                                                                           // 931
            flipped[o[i]] = i;                                                                               // 932
        }                                                                                                    // 933
    }                                                                                                        // 934
    return flipped;                                                                                          // 935
}                                                                                                            // 936
                                                                                                             // 937
// Return a valid alpha value [0,1] with all invalid values being set to 1                                   // 938
function boundAlpha(a) {                                                                                     // 939
    a = parseFloat(a);                                                                                       // 940
                                                                                                             // 941
    if (isNaN(a) || a < 0 || a > 1) {                                                                        // 942
        a = 1;                                                                                               // 943
    }                                                                                                        // 944
                                                                                                             // 945
    return a;                                                                                                // 946
}                                                                                                            // 947
                                                                                                             // 948
// Take input from [0, n] and return it as [0, 1]                                                            // 949
function bound01(n, max) {                                                                                   // 950
    if (isOnePointZero(n)) { n = "100%"; }                                                                   // 951
                                                                                                             // 952
    var processPercent = isPercentage(n);                                                                    // 953
    n = mathMin(max, mathMax(0, parseFloat(n)));                                                             // 954
                                                                                                             // 955
    // Automatically convert percentage into number                                                          // 956
    if (processPercent) {                                                                                    // 957
        n = parseInt(n * max, 10) / 100;                                                                     // 958
    }                                                                                                        // 959
                                                                                                             // 960
    // Handle floating point rounding errors                                                                 // 961
    if ((math.abs(n - max) < 0.000001)) {                                                                    // 962
        return 1;                                                                                            // 963
    }                                                                                                        // 964
                                                                                                             // 965
    // Convert into [0, 1] range if it isn't already                                                         // 966
    return (n % max) / parseFloat(max);                                                                      // 967
}                                                                                                            // 968
                                                                                                             // 969
// Force a number between 0 and 1                                                                            // 970
function clamp01(val) {                                                                                      // 971
    return mathMin(1, mathMax(0, val));                                                                      // 972
}                                                                                                            // 973
                                                                                                             // 974
// Parse a base-16 hex value into a base-10 integer                                                          // 975
function parseIntFromHex(val) {                                                                              // 976
    return parseInt(val, 16);                                                                                // 977
}                                                                                                            // 978
                                                                                                             // 979
// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1            // 980
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>   // 981
function isOnePointZero(n) {                                                                                 // 982
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;                              // 983
}                                                                                                            // 984
                                                                                                             // 985
// Check to see if string passed in is a percentage                                                          // 986
function isPercentage(n) {                                                                                   // 987
    return typeof n === "string" && n.indexOf('%') != -1;                                                    // 988
}                                                                                                            // 989
                                                                                                             // 990
// Force a hex value to have 2 characters                                                                    // 991
function pad2(c) {                                                                                           // 992
    return c.length == 1 ? '0' + c : '' + c;                                                                 // 993
}                                                                                                            // 994
                                                                                                             // 995
// Replace a decimal with it's percentage value                                                              // 996
function convertToPercentage(n) {                                                                            // 997
    if (n <= 1) {                                                                                            // 998
        n = (n * 100) + "%";                                                                                 // 999
    }                                                                                                        // 1000
                                                                                                             // 1001
    return n;                                                                                                // 1002
}                                                                                                            // 1003
                                                                                                             // 1004
// Converts a decimal to a hex value                                                                         // 1005
function convertDecimalToHex(d) {                                                                            // 1006
    return Math.round(parseFloat(d) * 255).toString(16);                                                     // 1007
}                                                                                                            // 1008
// Converts a hex value to a decimal                                                                         // 1009
function convertHexToDecimal(h) {                                                                            // 1010
    return (parseIntFromHex(h) / 255);                                                                       // 1011
}                                                                                                            // 1012
                                                                                                             // 1013
var matchers = (function() {                                                                                 // 1014
                                                                                                             // 1015
    // <http://www.w3.org/TR/css3-values/#integers>                                                          // 1016
    var CSS_INTEGER = "[-\\+]?\\d+%?";                                                                       // 1017
                                                                                                             // 1018
    // <http://www.w3.org/TR/css3-values/#number-value>                                                      // 1019
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";                                                                 // 1020
                                                                                                             // 1021
    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.        // 1022
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";                                         // 1023
                                                                                                             // 1024
    // Actual matching.                                                                                      // 1025
    // Parentheses and commas are optional, but not required.                                                // 1026
    // Whitespace can take the place of commas or opening paren                                              // 1027
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
                                                                                                             // 1030
    return {                                                                                                 // 1031
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),                                                          // 1032
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),                                                        // 1033
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),                                                          // 1034
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),                                                        // 1035
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),                                                          // 1036
        hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,                                          // 1037
        hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,                                          // 1038
        hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/                           // 1039
    };                                                                                                       // 1040
})();                                                                                                        // 1041
                                                                                                             // 1042
// `stringInputToObject`                                                                                     // 1043
// Permissive string parsing.  Take in a number of formats, and output an object                             // 1044
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`                         // 1045
function stringInputToObject(color) {                                                                        // 1046
                                                                                                             // 1047
    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();                                 // 1048
    var named = false;                                                                                       // 1049
    if (names[color]) {                                                                                      // 1050
        color = names[color];                                                                                // 1051
        named = true;                                                                                        // 1052
    }                                                                                                        // 1053
    else if (color == 'transparent') {                                                                       // 1054
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };                                                   // 1055
    }                                                                                                        // 1056
                                                                                                             // 1057
    // Try to match string input using regular expressions.                                                  // 1058
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360] // 1059
    // Just return an object and let the conversion functions handle that.                                   // 1060
    // This way the result will be the same whether the tinycolor is initialized with string or object.      // 1061
    var match;                                                                                               // 1062
    if ((match = matchers.rgb.exec(color))) {                                                                // 1063
        return { r: match[1], g: match[2], b: match[3] };                                                    // 1064
    }                                                                                                        // 1065
    if ((match = matchers.rgba.exec(color))) {                                                               // 1066
        return { r: match[1], g: match[2], b: match[3], a: match[4] };                                       // 1067
    }                                                                                                        // 1068
    if ((match = matchers.hsl.exec(color))) {                                                                // 1069
        return { h: match[1], s: match[2], l: match[3] };                                                    // 1070
    }                                                                                                        // 1071
    if ((match = matchers.hsla.exec(color))) {                                                               // 1072
        return { h: match[1], s: match[2], l: match[3], a: match[4] };                                       // 1073
    }                                                                                                        // 1074
    if ((match = matchers.hsv.exec(color))) {                                                                // 1075
        return { h: match[1], s: match[2], v: match[3] };                                                    // 1076
    }                                                                                                        // 1077
    if ((match = matchers.hex8.exec(color))) {                                                               // 1078
        return {                                                                                             // 1079
            a: convertHexToDecimal(match[1]),                                                                // 1080
            r: parseIntFromHex(match[2]),                                                                    // 1081
            g: parseIntFromHex(match[3]),                                                                    // 1082
            b: parseIntFromHex(match[4]),                                                                    // 1083
            format: named ? "name" : "hex8"                                                                  // 1084
        };                                                                                                   // 1085
    }                                                                                                        // 1086
    if ((match = matchers.hex6.exec(color))) {                                                               // 1087
        return {                                                                                             // 1088
            r: parseIntFromHex(match[1]),                                                                    // 1089
            g: parseIntFromHex(match[2]),                                                                    // 1090
            b: parseIntFromHex(match[3]),                                                                    // 1091
            format: named ? "name" : "hex"                                                                   // 1092
        };                                                                                                   // 1093
    }                                                                                                        // 1094
    if ((match = matchers.hex3.exec(color))) {                                                               // 1095
        return {                                                                                             // 1096
            r: parseIntFromHex(match[1] + '' + match[1]),                                                    // 1097
            g: parseIntFromHex(match[2] + '' + match[2]),                                                    // 1098
            b: parseIntFromHex(match[3] + '' + match[3]),                                                    // 1099
            format: named ? "name" : "hex"                                                                   // 1100
        };                                                                                                   // 1101
    }                                                                                                        // 1102
                                                                                                             // 1103
    return false;                                                                                            // 1104
}                                                                                                            // 1105
                                                                                                             // 1106
return tinycolor;                                                                                            // 1107
                                                                                                             // 1108
////////////////////////////////////////////////////////////////////////////////                             // 1109
// END LIBRARY CODE                                                                                          // 1110
////////////////////////////////////////////////////////////////////////////////                             // 1111
                                                                                                             // 1112
    })();                                                                                                    // 1113
                                                                                                             // 1114
////////////////////////////////////////////////////////////////////////////////                             // 1115
// EXPORTS                                                                                                   // 1116
////////////////////////////////////////////////////////////////////////////////                             // 1117
                                                                                                             // 1118
// Meteor                                                                                                    // 1119
if (typeof Package !== 'undefined') {                                                                        // 1120
    tinycolor = _tinycolor;                                                                                  // 1121
}                                                                                                            // 1122
// AMD / RequireJS                                                                                           // 1123
else if (typeof define !== 'undefined' && define.amd) {                                                      // 1124
  define([], function () {                                                                                   // 1125
      return _tinycolor;                                                                                     // 1126
  });                                                                                                        // 1127
}                                                                                                            // 1128
// Node.js                                                                                                   // 1129
else if (typeof module !== 'undefined' && module.exports) {                                                  // 1130
  module.exports = _tinycolor;                                                                               // 1131
}                                                                                                            // 1132
// included directly via <script> tag                                                                        // 1133
else {                                                                                                       // 1134
  root.tinycolor = _tinycolor;                                                                               // 1135
}                                                                                                            // 1136
                                                                                                             // 1137
})();                                                                                                        // 1138
                                                                                                             // 1139
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aramk:tinycolor'] = {
  tinycolor: tinycolor
};

})();

//# sourceMappingURL=aramk_tinycolor.js.map
