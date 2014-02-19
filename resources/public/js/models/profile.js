define(['backbone', 'underscore'], function(Backbone, _) {

    var Profile = Backbone.Model.extend({

        defaults: { 'model_name': 'profile' },
        parse: function(response) {
            var attributes = response;

            attributes.id = response.username;
            attributes.token = null;
            attributes.api_server = null;

            return attributes;
        },
        url: function(){
            return "v1/login";
        },
        set_icons: function(icon_set, options) {
            _.defaults(options, {success: function() {}, error: function() {}});
            this.save({ icon_set: icon_set },
                {
                    patch: true,
                    async: false,
                    success: function() {
                        options.success();
                    },
                    error: function() {
                        options.error();
                    }
                });
        }
    });

    return Profile;
});
