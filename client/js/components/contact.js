define(['react'],
function(React){

    var Contact = React.createClass({
        displayName: 'Contact',

        render: function() {
            return React.DOM.div({},
                React.DOM.h1({}, "Contact Us"),
                React.DOM.p({},
                    "rchasman@coink.io chris@coink.io")
            );
        }
    });

  return Contact;
});
