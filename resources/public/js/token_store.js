/*
 * Stores authentication tokens in sessionStorage
 */
define([], function() {

    var TokenStore = function() {};

    TokenStore.get = function() {
        var auth_token = sessionStorage.getItem('auth_token');
        var expires = sessionStorage.getItem('expires');
        if (auth_token && expires && new Date(expires * 1000) > new Date())
            return auth_token;
        return null;
    };

    TokenStore.set = function(token, expires) {
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('expires', expires);
    };

    TokenStore.destroy = function() {
        sessionStorage.removeItem('auth_token'),
        sessionStorage.removeItem('expires')
    };

    return TokenStore;
});
