define(['backbone', 'models/wallet'], function(Backbone, Wallet) {

    var Wallets = Backbone.Collection.extend({
        model: Wallet,
        urlRoot: "http://private-d789-coink.apiary.io/v1/wallets",
        url: function() {
            return this.urlRoot;
        }
    });

    return Wallets;

});
