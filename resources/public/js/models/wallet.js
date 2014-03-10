define(['backbone'], function(Backbone) {

    var Wallet = Backbone.Model.extend({
        urlRoot: urlRoot + "/v1/wallets",
        /*parse: function(response) {
            response.id = response.address;
            return response;
        }*/
    });

    return Wallet;

});
