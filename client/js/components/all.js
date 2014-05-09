define(['react', 'components/exchanges', 'components/loader'], function(React, Exchanges, Loader) {
    
    var DataTable = React.createClass({
        displayName: "DataTable",
        render: function() {
            /*
            var rows = ___.map(function(coin) {
                return CoinRow({});
            });
            */
            var rows = React.DOM.tr({});
            return React.DOM.table({}, 
                React.DOM.thead({},
                    React.DOM.tr({},
                        React.DOM.td({}, "Ticker"),
                        React.DOM.td({}, "Name"),
                        React.DOM.td({}, "Quantity"),
                        React.DOM.td({}, "Cost per coin (bitcoin)"),
                        React.DOM.td({}, "Total cost"),
                        React.DOM.td({}, "Current sell value"),
                        React.DOM.td({}, "Last price per coin")
                    )
                ),
                React.DOM.tbody({},
                    rows
                )
            );
        }
    });

    var AllView = React.createClass({
        displayName: "AllView",
        render: function() {

            var loaded = true;
            var content = React.DOM.div({}, "HI");
           if(!loaded) {
               return React.DOM.div({}, React.DOM.h1({}, "All"), new Loader());
           }
           else {
                return DataTable({});
           }
        }
    });

    return AllView;
});
