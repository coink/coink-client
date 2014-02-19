define(['backbone'], function(Backbone) {

    var Wallet = Backbone.Model.extend({
        urlRoot: "http://private-d789-coink.apiary.io/v1/wallets",
        parse: function(response) {
            response.id = response.address;
            return response;
        }
    });

    return Wallet;

});
