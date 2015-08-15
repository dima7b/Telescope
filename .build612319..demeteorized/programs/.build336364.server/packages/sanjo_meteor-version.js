(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var MeteorVersion;

(function () {

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/sanjo:meteor-version/main.js                                  //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
MeteorVersion = {                                                         // 1
  getSemanticVersion: function () {                                       // 2
    var meteorVersion = Meteor.release                                    // 3
    if (meteorVersion) {                                                  // 4
      var atIndex = meteorVersion.indexOf('@');                           // 5
      if (atIndex !== -1) {                                               // 6
        meteorVersion = meteorVersion.substr(atIndex + 1);                // 7
      }                                                                   // 8
      var mainVersionRegEx = /^\d+\.\d+\.\d+/;                            // 9
      var mainVersionMatch = mainVersionRegEx.exec(meteorVersion);        // 10
      meteorVersion = mainVersionMatch ? mainVersionMatch[0] : undefined; // 11
    }                                                                     // 12
                                                                          // 13
    return meteorVersion;                                                 // 14
  }                                                                       // 15
}                                                                         // 16
                                                                          // 17
////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['sanjo:meteor-version'] = {
  MeteorVersion: MeteorVersion
};

})();

//# sourceMappingURL=sanjo_meteor-version.js.map
