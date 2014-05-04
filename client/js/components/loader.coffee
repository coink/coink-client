define ['react', 'jquery'],
(React, $) ->
    React.createClass
        displayName: 'Loader'
        render: -> React.DOM.div {id: "loader-container"}, React.DOM.div {id: "loader"}
