define(['react'],
function(React){

    var Faq = React.createClass({
        displayName: 'Faq',

        render: function() {
            return React.DOM.div({},
                React.DOM.h1({}, "FAQ"),
                React.DOM.p({},
                    "Here is a list of frequently asked questions:")
            );
        }
    });

  return Faq;
});
