define(['react', 'underscore', 'components/common/glyphicon', 'router', 'collections/menuItems'], function (React, _, Glyphicon, router, MenuItems) {

    var SidebarListItem = React.createClass({
        displayName: 'SidebarListItem',
        handleClick: function(e) {
            e.preventDefault();
            this.props.setActive(this);
            router.navigate(this.props.id.join('/'), {trigger: true});
        },

        render: function() {
            var icon = this.props.icon ? Glyphicon({name: this.props.icon}) : null;
            return React.DOM.li({},
                React.DOM.a({className: this.props.active == this.props.id[0] ? 'active' : 'inactive',
                    href: this.props.id.join('/'),
                    onClick: this.handleClick
                }, icon, this.props.text), this.props.children
            );
        }
    });

    var SidebarSubmenu = React.createClass({
        displayName: 'SidebarSubmenu',
        render: function() {
            return React.DOM.ul({}, _.map(this.props.items, function(menu_item) {
                return SidebarListItem({
                    text: menu_item.text,
                    active: this.props.active,
                    id: menu_item.route
                });
            }.bind(this)));
        }
    });

    var Sidebar = React.createClass({
        displayName: 'Sidebar',
        getInitialState: function() {
            return {
                active: 'wallet'
            };
        },

        getDefaultProps: function() {
            return {menuItems: new MenuItems()};
        },

        setActive: function(e) {
            this.setState({active: e.props.id[0]});
        },

        render: function() {
            if (this.props.loggedIn) {
                var items = _.map(this.props.menuItems.models, function(item) {
                        return SidebarListItem({
                            setActive: this.setActive,
                            icon: item.get("icon"),
                            active: this.state.active,
                            text: item.get("text"),
                            id: item.get("route")
                        },
                        SidebarSubmenu({
                            items: item.get("menu"),
                            active: this.state.active
                        }));
                    }.bind(this));

                return React.DOM.div({id: 'sidebar', className: 'large-3 medium-3 columns'},
                    React.DOM.div({className: 'wrap'},
                        this.props.header,
                        React.DOM.button({id: 'expand-btn'}, '☰'),
                        React.DOM.ul({className: 'nav'}, items)
                    )
                );
            } else {
                return React.DOM.div({});
            }
        }
    });

    return Sidebar;

});
