define(['backbone', 'underscore', 'token_store'], function(Backbone, _, TokenStore) {
    var Profile = Backbone.Model.extend({

        defaults: { 'logged_in' : false },

    });

    return new Profile;

});
