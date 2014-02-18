define(['backbone'], function(Backbone) {

    var Wallet = Backbone.Model.extend({
        urlRoot: "http://private-d789-coink.apiary.io/v1/wallets",
        parse: function(resp) {
            var attr = resp;
            attr.id = resp.address;
            return attr;
        }
    });

    return Wallet;

});
