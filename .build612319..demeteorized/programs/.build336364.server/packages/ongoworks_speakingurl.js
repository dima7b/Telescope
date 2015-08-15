(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var getSlug;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/ongoworks:speakingurl/speakingurl.js                     //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
getSlug = Npm.require('speakingurl');                                // 1
                                                                     // 2
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ongoworks:speakingurl'] = {
  getSlug: getSlug
};

})();

//# sourceMappingURL=ongoworks_speakingurl.js.map
