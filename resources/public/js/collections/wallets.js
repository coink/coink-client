define(['backbone', 'models/wallet'], function(Backbone, Wallet) {

    var Wallets = Backbone.Collection.extend({
        model: Wallet,
        urlRoot: urlRoot + "/v1/wallets",
        parse: function(response) {
            return response.data;
        },
        url: function() {
            return this.urlRoot;
        }
    });

    return Wallets;

});
