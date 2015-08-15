(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Gravatar = Package['jparker:gravatar'].Gravatar;
var Inject = Package['meteorhacks:inject-initial'].Inject;

/* Package-scope variables */
var Avatar, getDescendantProp, getService, getGravatarUrl, getEmailOrHash, createCSS, sizeName;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/utilities:avatar/utils.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// see http://stackoverflow.com/questions/8051975/access-object-child-properties-using-a-dot-notation-string         // 1
getDescendantProp = function (obj, desc) {                                                                           // 2
  var arr = desc.split(".");                                                                                         // 3
  while(arr.length && (obj = obj[arr.shift()]));                                                                     // 4
  return obj;                                                                                                        // 5
};                                                                                                                   // 6
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/utilities:avatar/helpers.js                                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Get the account service to use for the user's avatar                                                              // 1
// Priority: Twitter > Facebook > Google > GitHub > Instagram > Linkedin                                             // 2
getService = function (user) {                                                                                       // 3
  var services = user && user.services || {};                                                                        // 4
  var customProp = user && Avatar.options.customImageProperty;                                                       // 5
  if (customProp && getDescendantProp(user, customProp)) { return 'custom'; }                                        // 6
  var service = _.find(['twitter', 'facebook', 'google', 'github', 'instagram', 'linkedin'], function(s) { return !!services[s]; });
  return service || 'none';                                                                                          // 8
};                                                                                                                   // 9
                                                                                                                     // 10
getGravatarUrl = function (user, defaultUrl) {                                                                       // 11
  var gravatarDefault;                                                                                               // 12
  var validGravatars = ['404', 'mm', 'identicon', 'monsterid', 'wavatar', 'retro', 'blank'];                         // 13
                                                                                                                     // 14
  // Initials are shown when Gravatar returns 404.                                                                   // 15
  if (Avatar.options.fallbackType !== 'initials') {                                                                  // 16
    var valid = _.contains(validGravatars, Avatar.options.gravatarDefault);                                          // 17
    gravatarDefault = valid ? Avatar.options.gravatarDefault : defaultUrl;                                           // 18
  }                                                                                                                  // 19
  else {                                                                                                             // 20
    gravatarDefault = '404';                                                                                         // 21
  }                                                                                                                  // 22
                                                                                                                     // 23
  var options = {                                                                                                    // 24
    // NOTE: Gravatar's default option requires a publicly accessible URL,                                           // 25
    // so it won't work when your app is running on localhost and you're                                             // 26
    // using an image with either the standard default image URL or a custom                                         // 27
    // defaultImageUrl that is a relative path (e.g. 'images/defaultAvatar.png').                                    // 28
    default: gravatarDefault,                                                                                        // 29
    size: 200, // use 200x200 like twitter and facebook above (might be useful later)                                // 30
    secure: true                                                                                                     // 31
  };                                                                                                                 // 32
                                                                                                                     // 33
  var emailOrHash = getEmailOrHash(user);                                                                            // 34
  return Gravatar.imageUrl(emailOrHash, options);                                                                    // 35
};                                                                                                                   // 36
                                                                                                                     // 37
// Get the user's email address or (if the emailHashProperty is defined) hash                                        // 38
getEmailOrHash = function (user) {                                                                                   // 39
  var emailOrHash;                                                                                                   // 40
  if (user && Avatar.options.emailHashProperty && !!getDescendantProp(user, Avatar.options.emailHashProperty)) {     // 41
    emailOrHash = getDescendantProp(user, Avatar.options.emailHashProperty);                                         // 42
  }                                                                                                                  // 43
  else if (user && user.emails) {                                                                                    // 44
    emailOrHash = user.emails[0].address; // TODO: try all emails                                                    // 45
  }                                                                                                                  // 46
  else {                                                                                                             // 47
    // If all else fails, return 32 zeros (trash hash, hehe) so that Gravatar                                        // 48
    // has something to build a URL with at least.                                                                   // 49
    emailOrHash = '00000000000000000000000000000000';                                                                // 50
  }                                                                                                                  // 51
  return emailOrHash;                                                                                                // 52
};                                                                                                                   // 53
                                                                                                                     // 54
// Creates the dynamically generated CSS file                                                                        // 55
//                                                                                                                   // 56
// CSS is dynamically generated so that we can have both a custom class prefix and also allow for custom sizes       // 57
createCSS = function () {                                                                                            // 58
                                                                                                                     // 59
  // We only need to do this on the server                                                                           // 60
                                                                                                                     // 61
  if (!Meteor.isServer)                                                                                              // 62
    return;                                                                                                          // 63
                                                                                                                     // 64
  // The base CSS styles                                                                                             // 65
                                                                                                                     // 66
  var p = '.' + Avatar.getCssClassPrefix();                                                                          // 67
  var a = p + ' ';                                                                                                   // 68
                                                                                                                     // 69
  var css =                                                                                                          // 70
    p + ' { \n\
      height: 50px; \n\
      width: 50px; \n\
      position: relative; \n\
    } \n' +                                                                                                          // 75
    a + p + '-image, \n' +                                                                                           // 76
    a + p + '-initials { \n\
      height: 100%; \n\
      width: 100%; \n\
      position: absolute; \n\
      top: 0px; \n\
      left: 0px; \n\
    } \n' +                                                                                                          // 83
    a + p + '-image { \n\
      z-index: 10; \n\
      background-color: #fff; \n\
    } \n' +                                                                                                          // 87
    a + p + '-initials { \n\
      display: block; \n\
      background-size: 100% 100%; \n\
      background-color: #aaa; \n\
      color: #fff; \n\
      font-size: 25px; \n\
      line-height: 50px; \n\
      font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", Arial, sans-serif; \n\
      text-align: center; \n\
      z-index: 1; \n\
    } \n' +                                                                                                          // 98
    p + '-rounded ' + p + '-image, \n' +                                                                             // 99
    p + '-rounded ' + p + '-initials { \n\
      border-radius: 5px; \n\
    } \n'+                                                                                                           // 102
    p + '-circle ' + p + '-image, \n' +                                                                              // 103
    p + '-circle ' + p + '-initials { \n\
      border-radius: 50%; \n\
    } \n' +                                                                                                          // 106
    p + '-hide-image ' + p + '-image { \n\
      display: none; \n\
    } \n' +                                                                                                          // 109
    p + '-hide-initials ' + p + '-initials { \n\
      display: none; \n\
    } \n\
  ';                                                                                                                 // 113
                                                                                                                     // 114
  // CSS for each of the defined sizes                                                                               // 115
                                                                                                                     // 116
  for (sizeName in Avatar.options.imageSizes) {                                                                      // 117
                                                                                                                     // 118
    var size = Avatar.options.imageSizes[sizeName];                                                                  // 119
                                                                                                                     // 120
    css = css + p + '-' + sizeName + ' {' +                                                                          // 121
      'width: ' + size + 'px; ' +                                                                                    // 122
      'min-width: ' + size + 'px; ' +                                                                                // 123
      'height: ' + size + 'px;' +                                                                                    // 124
    '}\n' +                                                                                                          // 125
    p + '-' + sizeName + ' ' + p + '-initials {' +                                                                   // 126
      'font-size: ' + size / 2 + 'px; ' +                                                                            // 127
      'line-height: ' + size + 'px;' +                                                                               // 128
    '}\n';                                                                                                           // 129
  }                                                                                                                  // 130
                                                                                                                     // 131
  // In order to allow for custom sizes and a custom prefix we need to be able to create a style sheet               // 132
  // on the fly. To do this cleanly we use the meteor-hacks:inject package to inject the styles directly             // 133
  // into the HTML code before it's sent to the client.                                                              // 134
                                                                                                                     // 135
  Inject.rawHead('avatar-styles', '<style>' + css + '</style>');                                                     // 136
}                                                                                                                    // 137
                                                                                                                     // 138
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/utilities:avatar/export.js                                                                               //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// Avatar object to be exported                                                                                      // 1
Avatar = {                                                                                                           // 2
                                                                                                                     // 3
  // Default functionality. You can override these options by calling                                                // 4
  // Avater.setOptions (do not set Avatar.options directly)                                                          // 5
                                                                                                                     // 6
  options: {                                                                                                         // 7
                                                                                                                     // 8
    // Determines the type of fallback to use when no image can be found via                                         // 9
    // linked services (Gravatar included):                                                                          // 10
    //   "default image" (the default option, which will show either the image                                       // 11
    //   specified by defaultImageUrl, the package's default image, or a Gravatar                                    // 12
    //   default image)                                                                                              // 13
    //     OR                                                                                                        // 14
    //   "initials" (show the user's initials).                                                                      // 15
    fallbackType: '',                                                                                                // 16
                                                                                                                     // 17
    // This will replace the included default avatar image's URL                                                     // 18
    // ('packages/avatar/default.png'). It can be a relative path                                                    // 19
    // (relative to website's base URL, e.g. 'images/defaultAvatar.png').                                            // 20
    defaultImageUrl: '',                                                                                             // 21
                                                                                                                     // 22
    // This property name will be used to fetch an avatar url from the user's profile                                // 23
    // (e.g. 'avatar'). If this property is set and a property of that name exists                                   // 24
    // on the user's profile (e.g. user.profile.avatar) that property will be used                                   // 25
    // as the avatar url.                                                                                            // 26
    customImageProperty: '',                                                                                         // 27
                                                                                                                     // 28
    // Gravatar default option to use (overrides default image URL)                                                  // 29
    // Options are available at:                                                                                     // 30
    // https://secure.gravatar.com/site/implement/images/#default-image                                              // 31
    gravatarDefault: '',                                                                                             // 32
                                                                                                                     // 33
    // This property on the user object will be used for retrieving gravatars                                        // 34
    // (useful when user emails are not published).                                                                  // 35
    emailHashProperty: '',                                                                                           // 36
                                                                                                                     // 37
    // This property is used to prefix the CSS classes of the DOM elements.                                          // 38
    // If no value is set, then the default CSS class assigned to all DOM elements are prefixed with 'avatar' as default.
    // If a value is set to, 'foo' for example, the resulting CSS classes are prefixed with 'foo'.                   // 40
    cssClassPrefix: '',                                                                                              // 41
                                                                                                                     // 42
    // This property defines the various image sizes available                                                       // 43
    imageSizes: {                                                                                                    // 44
      'large': 80,                                                                                                   // 45
      'small': 30,                                                                                                   // 46
      'extra-small': 20                                                                                              // 47
    }                                                                                                                // 48
  },                                                                                                                 // 49
                                                                                                                     // 50
  // Sets the Avatar options. You must use this setter function rather than assigning directly to                    // 51
  // Avatar.options, otherwise the stylesheet won't be generated.                                                    // 52
                                                                                                                     // 53
  setOptions: function(options) {                                                                                    // 54
    Avatar.options = _.extend(Avatar.options, options);                                                              // 55
    createCSS();                                                                                                     // 56
  },                                                                                                                 // 57
                                                                                                                     // 58
  // Returns the cssClassPrefix property from options                                                                // 59
  getCssClassPrefix: function () {                                                                                   // 60
    return (Avatar.options.cssClassPrefix)? Avatar.options.cssClassPrefix: 'avatar';                                 // 61
  },                                                                                                                 // 62
                                                                                                                     // 63
  // Get the initials of the user                                                                                    // 64
  getInitials: function (user) {                                                                                     // 65
                                                                                                                     // 66
    var initials = '';                                                                                               // 67
    var name = '';                                                                                                   // 68
    var parts = [];                                                                                                  // 69
                                                                                                                     // 70
    if (user && user.profile && user.profile.firstName) {                                                            // 71
      initials = user.profile.firstName.charAt(0).toUpperCase();                                                     // 72
                                                                                                                     // 73
      if (user.profile.lastName) {                                                                                   // 74
        initials += user.profile.lastName.charAt(0).toUpperCase();                                                   // 75
      }                                                                                                              // 76
      else if (user.profile.familyName) {                                                                            // 77
        initials += user.profile.familyName.charAt(0).toUpperCase();                                                 // 78
      }                                                                                                              // 79
      else if (user.profile.secondName) {                                                                            // 80
        initials += user.profile.secondName.charAt(0).toUpperCase();                                                 // 81
      }                                                                                                              // 82
    }                                                                                                                // 83
    else {                                                                                                           // 84
      if (user && user.profile && user.profile.name) {                                                               // 85
        name = user.profile.name;                                                                                    // 86
      }                                                                                                              // 87
      else if (user && user.username) {                                                                              // 88
        name = user.username;                                                                                        // 89
      }                                                                                                              // 90
                                                                                                                     // 91
      parts = name.split(' ');                                                                                       // 92
      // Limit getInitials to first and last initial to avoid problems with                                          // 93
      // very long multi-part names (e.g. "Jose Manuel Garcia Galvez")                                               // 94
      initials = _.first(parts).charAt(0).toUpperCase();                                                             // 95
      if (parts.length > 1) {                                                                                        // 96
        initials += _.last(parts).charAt(0).toUpperCase();                                                           // 97
      }                                                                                                              // 98
    }                                                                                                                // 99
                                                                                                                     // 100
    return initials;                                                                                                 // 101
  },                                                                                                                 // 102
                                                                                                                     // 103
  // Get the url of the user's avatar                                                                                // 104
  getUrl: function (user) {                                                                                          // 105
                                                                                                                     // 106
    var url = '';                                                                                                    // 107
    var defaultUrl, svc;                                                                                             // 108
                                                                                                                     // 109
    if (user) {                                                                                                      // 110
      svc = getService(user);                                                                                        // 111
      if (svc === 'twitter') {                                                                                       // 112
        // use larger image (200x200 is smallest custom option)                                                      // 113
        url = user.services.twitter.profile_image_url_https.replace('_normal.', '_200x200.');                        // 114
      }                                                                                                              // 115
      else if (svc === 'facebook') {                                                                                 // 116
        // use larger image (~200x200)                                                                               // 117
        url = 'https://graph.facebook.com/' + user.services.facebook.id + '/picture?type=large';                     // 118
      }                                                                                                              // 119
      else if (svc === 'google') {                                                                                   // 120
        url = user.services.google.picture;                                                                          // 121
      }                                                                                                              // 122
      else if (svc === 'github') {                                                                                   // 123
        url = 'https://avatars.githubusercontent.com/' + user.services.github.username + '?s=200';                   // 124
      }                                                                                                              // 125
      else if (svc === 'instagram') {                                                                                // 126
        url = user.services.instagram.profile_picture;                                                               // 127
      }                                                                                                              // 128
      else if (svc === 'linkedin') {                                                                                 // 129
        url = user.services.linkedin.pictureUrl;                                                                     // 130
      }                                                                                                              // 131
      else if (svc === "custom") {                                                                                   // 132
        url = getDescendantProp(user, Avatar.options.customImageProperty);                                           // 133
      }                                                                                                              // 134
      else if (svc === 'none') {                                                                                     // 135
        defaultUrl = Avatar.options.defaultImageUrl || 'packages/avatar/default.png';                                // 136
        // If it's a relative path (no '//' anywhere), complete the URL                                              // 137
        if (defaultUrl.indexOf('//') === -1) {                                                                       // 138
          // Strip starting slash if it exists                                                                       // 139
          if (defaultUrl.charAt(0) === '/') defaultUrl = defaultUrl.slice(1);                                        // 140
          // Then add the relative path to the server's base URL                                                     // 141
          defaultUrl = Meteor.absoluteUrl() + defaultUrl;                                                            // 142
        }                                                                                                            // 143
        url = getGravatarUrl(user, defaultUrl);                                                                      // 144
      }                                                                                                              // 145
    }                                                                                                                // 146
                                                                                                                     // 147
    return url;                                                                                                      // 148
  }                                                                                                                  // 149
};                                                                                                                   // 150
                                                                                                                     // 151
// Call setOptions to generate the default CSS. This will be replaced if the user calls setOptions in their own code // 152
                                                                                                                     // 153
Avatar.setOptions({});                                                                                               // 154
                                                                                                                     // 155
                                                                                                                     // 156
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['utilities:avatar'] = {
  Avatar: Avatar
};

})();

//# sourceMappingURL=utilities_avatar.js.map
