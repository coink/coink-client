define(['react', 'router'],
function(React, router) {
  var Help = React.createClass({

    render: function() {
      return React.DOM.div({},
        React.DOM.h1({}, "Help"),
        React.DOM.p({},
          "Use the side navigation to switch between viewing your wallet balances and exchange balances.")
        );
    }
  });

  return Help;
});