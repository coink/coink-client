define(['backbone'], function(Backbone) {

    var Profile = Backbone.Model.extend({

        initialize: function() {
            var token = this.getToken() ? true : false;
            this.set("logged_in", token);
        },
        getToken: function() {
            var auth_token = sessionStorage.getItem('auth_token');
            var expires = sessionStorage.getItem('expires');
            if (auth_token && expires && new Date(expires * 1000) > new Date())
                return auth_token;
            return null;
        },
        setToken: function(token, expires) {
            sessionStorage.setItem('auth_token', token);
            sessionStorage.setItem('expires', expires);
            this.set("logged_in", true);
        },
        destroyToken: function() {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('expires');
            this.set("logged_in", false);
        }

    });

    return new Profile;

});
