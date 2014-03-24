define(['backbone'], function(Backbone) {

    var MetaExchange = Backbone.Model.extend({
        urlRoot: urlRoot + "/v1/meta_exchange",
        /*parse: function(response) {
            response.id = response.address;
            return response;
        }*/
    });

    return MetaExchange;

});
