define(['backbone'], function(Backbone) {

    var Wallet = Backbone.Model.extend({
        urlRoot: urlRoot + "/v1/wallets",
    });

    return Wallet;
});
