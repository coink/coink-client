define(['react'],
function(React){

    var Contact = React.createClass({
        displayName: 'Contact',

        render: function() {
            var emails = [
                "rchasman@coink.io",
                "chris@coink.io",
                "matt@coink.io",
                "soumya92@coink.io",
                "ashley@coink.io",
                "zach@coink.io",
                "shane@coink.io",
                "kate@coink.io"
            ];
            return React.DOM.div({},
                React.DOM.h1({}, "Contact Us"),
                React.DOM.ul({},
                    _.map(emails, function(e) {
                        return React.DOM.li({}, e);
                    })));
            );
        }
    });

  return Contact;
});
