define(['backbone', 'models/wallet'], function(Backbone, Wallet) {

    var Wallets = Backbone.Collection.extend({
        model: Wallet,
        urlRoot: "http://private-d789-coink.apiary.io/v1/wallets",
        parse: function(response) {
            return response.data;
        },
        url: function() {
            return this.urlRoot;
        }
    });

    return Wallets;

});
