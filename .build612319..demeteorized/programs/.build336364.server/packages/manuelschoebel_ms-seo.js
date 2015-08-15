(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;

/* Package-scope variables */
var __coffeescriptShare;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/manuelschoebel:ms-seo/seo_collection.coffee.js           //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.SeoCollection = new Mongo.Collection('seo');
///////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/manuelschoebel:ms-seo/seo_publications.coffee.js         //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('seoByRouteName', function(routeName) {
  check(routeName, String);
  return SeoCollection.find({
    route_name: routeName
  });
});
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['manuelschoebel:ms-seo'] = {};

})();

//# sourceMappingURL=manuelschoebel_ms-seo.js.map
