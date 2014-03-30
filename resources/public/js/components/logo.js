define(['react', 'router', 'models/profile'], function(React, router, profile) {

    var Logo = React.createClass({
        handleClick: function(e) {
            e.preventDefault();
            router.navigate('/', {trigger : true});
        },
        render: function() {
            
            return React.DOM.a(
                {href: '/', id: 'logo', onClick: this.handleClick},
                React.DOM.h1({}, "Coink")
            );
        }
    });

    return Logo;
});
