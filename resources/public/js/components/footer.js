define(['react'], function(React) {

    var Footer = React.createClass({

        displayName: 'Footer',

        render: function() {
            var year = new Date().getFullYear();
            return React.DOM.footer({}, "\u00a9 " + year + " Coink");
        }
    });

    return Footer;

});
