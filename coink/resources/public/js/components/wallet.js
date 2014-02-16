define(['react'], function(React) {
    var Wallet = React.createClass({
        render: function() {
            return React.DOM.div({id : "wallet"},
                React.DOM.li({}, "stuff"));
        }
    });
    return Wallet;
});
