define(['backbone', 'models/exchange'], function(Backbone, Exchange) {

    var Exchanges = Backbone.Collection.extend({

        model: Exchange,

        urlRoot: urlRoot + "/v1/exchanges",

        parse: function(response) {
            return response.data;
        },

        url: function() {
            return this.urlRoot;
        }
    });

    return Exchanges;
});
