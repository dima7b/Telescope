(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var Util;

(function () {

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/meteorspark:util/lib/util-server.js                       //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
// https://github.com/isaacs/inherits/blob/master/inherits_browser.js // 1
Util = Npm.require("util")                                            // 2
                                                                      // 3
////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteorspark:util'] = {
  Util: Util
};

})();

//# sourceMappingURL=meteorspark_util.js.map
