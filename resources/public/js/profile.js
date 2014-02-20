define(['models/profile', 'collections/wallets'], function(Profile, Wallets) {
    /* Get Profile and identities beofre we do anything else  */
    /* TODO: Do this server side */

    var profile = new Profile();
    /*profile.fetch({
        async: false,
        success: function(model) {
            var wallets = new Wallets();
            wallets.fetch({
                async: false
            });

            model.set('wallets', wallets);
        },
        error: function(model, response, options) {
            if (response.status == 401) {
                console.log("Not logged in");
            } else {
                console.error("Error fetching profile");
            }
        }
    });*/

    return profile.isNew() ? null : profile;
});
