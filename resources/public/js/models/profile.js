define(['backbone', 'underscore', 'token_store'], function(Backbone, _, TokenStore) {
    var Profile = Backbone.Model.extend({

        defaults: { 'model_name': 'profile' },
        parse: function(response) {
            var attributes = response;

            attributes.id = response.username;
            attributes.token = TokenStore.get();

            return attributes;
        },
        url: function(){
            return "/";
        }
    });

    return Profile;
});
