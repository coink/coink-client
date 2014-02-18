define(['react'], function(React) {
    var Footer = React.createClass({
        render: function() {
            var year = new Date().getFullYear();
            return React.DOM.footer({},
                React.DOM.a({
                }, "\u00a9" + year + " Coink"));
        }
    });
    return Footer;
});
