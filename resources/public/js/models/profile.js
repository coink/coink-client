define(['backbone'], function(Backbone) {

    var Profile = Backbone.Model.extend({

        getToken: function() {
            var auth_token = sessionStorage.getItem('auth_token');
            var expires = sessionStorage.getItem('expires');
            if (auth_token && expires && new Date(expires * 1000) > new Date())
                return auth_token;
            return null;
        },
        setToken: function(token, expires) {
            console.log("set");
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
