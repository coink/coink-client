define(['backbone'], function(Backbone) {

    var ExchangeAccount = Backbone.Model.extend({
        urlRoot: urlRoot + "/v1/exchanges",
    });

    return ExchangeAccount;

});
