define(['backbone'], function(Backbone) {

    var MetaExchange = Backbone.Model.extend({
        urlRoot: urlRoot + "/v1/meta_exchange"
    });

    return MetaExchange;
});
