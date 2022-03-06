    // config/auth.js

    // expose our config directly to our application using module.exports
    module.exports = {

        'facebookAuth' : {
            'clientID'      : 'your-secret-clientID-here', // your App ID
            'clientSecret'  : 'your-client-secret-here', // your App Secret
            'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
        },

        'twitterAuth' : {
            'consumerKey'       : 'your-consumer-key-here',
            'consumerSecret'    : 'your-client-secret-here',
            'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
        },

        'googleAuth' : {
            'clientID'      : '463712655499-f9d45054qk3ag0bbebvnqd5q8cndsepr.apps.googleusercontent.com',
            'clientSecret'  : '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',
            'callbackURL'   : 'http://localhost:8080/auth/google/callback'
        }

    };
