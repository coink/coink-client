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
        getUsername: function() {
            return sessionStorage.getItem('username');
        },
        createSession: function(token, expires, username) {
            sessionStorage.setItem('auth_token', token);
            sessionStorage.setItem('expires', expires);
            sessionStorage.setItem('username', username);
            this.set("logged_in", true);
        },
        destroySession: function() {
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('expires');
            sessionStorage.removeItem('username');
            this.set("logged_in", false);
        }

    });

    return new Profile;

});
