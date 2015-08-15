(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var MailChimp;

(function () {

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// packages/miro:mailchimp/lib/server/mailchimp.js                           //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
var getSettingsValueFor = function ( key ) {                                 // 1
		if (                                                                       // 2
			Meteor.settings &&                                                        // 3
			Meteor.settings.private &&                                                // 4
			Meteor.settings.private.MailChimp                                         // 5
		) {                                                                        // 6
			return Meteor.settings.private.MailChimp[key];                            // 7
		}                                                                          // 8
	};                                                                          // 9
                                                                             // 10
MailChimp = function ( apiKey, options ) {                                   // 11
	var mailChimpOptions = {                                                    // 12
			'apiKey' : apiKey || getSettingsValueFor( 'apiKey' ),                     // 13
			'options': options || {                                                   // 14
				'version': '2.0'	// Living on The Edge ;)                                // 15
			}                                                                         // 16
		};                                                                         // 17
                                                                             // 18
	if ( !mailChimpOptions.apiKey || mailChimpOptions.apiKey === '' ) {         // 19
                                                                             // 20
		console.error( '[MailChimp] Error: No API Key defined!' );                 // 21
                                                                             // 22
		throw new Meteor.Error(                                                    // 23
			'No API Key',                                                             // 24
			'No API Key defined',                                                     // 25
			'Define your API Key either in settings.json file or in a method call'    // 26
		);                                                                         // 27
	}                                                                           // 28
                                                                             // 29
	this._asyncAPI = Npm.require( 'mailchimp' ).MailChimpAPI(                   // 30
		mailChimpOptions.apiKey,                                                   // 31
		mailChimpOptions.options                                                   // 32
	);                                                                          // 33
};                                                                           // 34
                                                                             // 35
MailChimp.prototype.call = function ( section, method, options, callback ) { // 36
	if ( callback && typeof callback === 'function' ) {                         // 37
		// If anyone still wants to use old-fashioned callback method              // 38
		this._asyncAPI.call( section, method, options, callback );                 // 39
	} else {                                                                    // 40
		try {                                                                      // 41
			var wrapped = Meteor.wrapAsync( this._asyncAPI.call, this._asyncAPI );    // 42
                                                                             // 43
			return wrapped( section, method, options );                               // 44
		} catch ( error ) {                                                        // 45
			// A workaround for:                                                      // 46
			// https://github.com/meteor/meteor/issues/2774                           // 47
			if ( !error.error ) {                                                     // 48
				throw new Meteor.Error( error.code, error.message );                     // 49
			} else {                                                                  // 50
				throw new Meteor.Error( error );                                         // 51
			}                                                                         // 52
		}                                                                          // 53
	}                                                                           // 54
};                                                                           // 55
                                                                             // 56
Meteor.methods({                                                             // 57
	'MailChimp': function ( clientOptions, section, method, options ) {         // 58
		check( clientOptions, Object );                                            // 59
		check( section, String );                                                  // 60
		check( method, String );                                                   // 61
		check( options, Object );                                                  // 62
                                                                             // 63
		var mailChimp,                                                             // 64
			mailChimpOptions = _.defaults( {}, options );                             // 65
                                                                             // 66
		try {                                                                      // 67
			mailChimp = new MailChimp( clientOptions.apiKey, clientOptions.options ); // 68
		} catch ( error ) {                                                        // 69
			throw new Meteor.Error( error.error, error.reason, error.details );       // 70
		}                                                                          // 71
                                                                             // 72
		switch ( section ) {                                                       // 73
			case 'lists':                                                             // 74
				if ( !mailChimpOptions.id || mailChimpOptions.id === '' ) {              // 75
					mailChimpOptions.id = getSettingsValueFor( 'listId' );                  // 76
				}                                                                        // 77
                                                                             // 78
				break;                                                                   // 79
			default:                                                                  // 80
		}                                                                          // 81
                                                                             // 82
		return mailChimp.call( section, method, mailChimpOptions );                // 83
	}                                                                           // 84
});                                                                          // 85
                                                                             // 86
///////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['miro:mailchimp'] = {
  MailChimp: MailChimp
};

})();

//# sourceMappingURL=miro_mailchimp.js.map
