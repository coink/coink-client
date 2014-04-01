define(['react', 'jquery'], function(React, $) {

    var Landing = React.createClass({
        displayName: 'Landing',

        render: function() {
            return React.DOM.div({id: "landing"});
        }
    });

    return Landing;
});
