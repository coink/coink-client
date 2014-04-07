define(['backbone', 'models/meta_exchange'], function(Backbone, MetaExchange) {

    var MetaExchanges = Backbone.Collection.extend({

        model: MetaExchange,

        urlRoot: urlRoot + "/v1/meta_exchanges",

        parse: function(response) {
            return response.data;
        },

        url: function() {
            return this.urlRoot;
        }
    });

    return MetaExchanges;
});
