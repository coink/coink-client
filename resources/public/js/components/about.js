define(['react'],
function(React){

    var About = React.createClass({
        displayName: 'About',

        render: function() {
            return React.DOM.div({id: "about"},
                React.DOM.h1({}, "About Us"),
                React.DOM.p({},
                    "The team at Coink is a group of developers who understand the struggle of maintaining cryptocurrency"
                    + " balances and want to return your focus back to what really matters: trading your cryptocurrencies.")
            );
        }
    });

  return About;
});
