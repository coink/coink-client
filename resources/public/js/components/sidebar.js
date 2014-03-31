define(['react', 'underscore', 'router', 'collections/menu_items',
        'components/logo', 'components/common/glyphicon'],
function (React, _, router, MenuItems, Logo, Glyphicon) {

    var SidebarListItem = React.createClass({
        displayName: 'SidebarListItem',
        handleClick: function(e) {
            e.preventDefault();
            var item = this.props
            this.props.setActive(item.route[0]);
            router.navigate(item.route.join('/'), {trigger: true});
        },

        render: function() {
            var item = this.props
            var icon = item.icon ? Glyphicon({name: item.icon}) : null;
            var active = this.props.active == item.route[0] ? 'active' : 'inactive';
            var submenu = "";
            if (item.menu != undefined) {
                submenu = React.DOM.ul({}, _.map(item.menu, function(subitem) {
                    return SidebarListItem({
                        route: subitem.route,
                        text: subitem.text,
                        active: item.active,
                        icon: subitem.icon,
                        setActive: item.setActive
                    })
                }))
            }
            return React.DOM.li({className: active},
                React.DOM.a({
                    href: item.route.join('/'),
                    onClick: this.handleClick
                }, icon, item.text), submenu)
        }
    });

    var Sidebar = React.createClass({
        displayName: 'Sidebar',
        getInitialState: function() {
            return {
                active: 'wallets'
            };
        },

        getDefaultProps: function() {
            return {menuItems: new MenuItems()};
        },

        setActive: function(route) {
            console.log(route);
            this.setState({active: route});
        },

        render: function() {
            if (this.props.loggedIn) {
                var items = this.props.menuItems.map(function(item) {
                    return SidebarListItem({
                        key: item.get('text'),
                        text: item.get("text"),
                        icon: item.get("icon"),
                        route: item.get("route"),
                        menu: item.get("menu"),
                        active: this.state.active,
                        setActive: this.setActive
                    })
                }.bind(this));

                return React.DOM.div({id: 'sidebar', className: 'large-3 medium-3 columns'},
                    React.DOM.div({className: 'wrap'},
                        Logo({setActive: this.setActive}),
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
