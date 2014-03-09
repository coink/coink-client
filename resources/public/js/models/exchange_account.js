define(['backbone'], function(Backbone) {

    var ExchangeAccount = Backbone.Model.extend({
        urlRoot: "http://private-d789-coink.apiary.io/v1/exchanges",
    });

    return ExchangeAccount;

});
