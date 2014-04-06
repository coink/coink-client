define(['react', 'underscore', 'router', 'models/menu_item', 'collections/menu_items',
        'components/common/logo', 'components/common/glyphicon'],
function (React, _, router, MenuItem, MenuItems, Logo, Glyphicon) {

    var SidebarListItem = React.createClass({
        displayName: 'SidebarListItem',

        handleClick: function(e) {
            e.preventDefault();
            router.navigate(this.props.route.join('/'), {trigger: true});
        },

        render: function() {
            var icon = this.props.icon ? Glyphicon({name: this.props.icon}) : null;
            var content = React.DOM.li({
                className: this.props.active ? "active" : "inactive"},
                React.DOM.a({
                    href: this.props.route.join('/'),
                    onClick: this.handleClick
                }, icon, this.props.key), this.props.children);
            return content;
        }
    });

    var Sidebar = React.createClass({
        displayName: 'Sidebar',

        getInitialState: function() {
            return {active: null};
        },

        getDefaultProps: function() {
            return {menuItems: MenuItems};
        },

        componentDidMount: function() {
            var routeMap = router.getRouteMap();
            router.on("route", function(view) {
                if (view == "handleDefaultRoute" ||
                    view == "login" || view == "register")
                        return;
                active = routeMap[view] ? routeMap[view].split('/') : [view];
                this.setState({active: active});
            }.bind(this))
        },

        render: function() {
            if (!this.props.loggedIn) return React.DOM.div({});
            var menuItems = this.props.menuItems;
            var meta_exchanges_menuItems = this.props.meta_exchanges.map(function(item) {
                var menuItem = {text: item.get('exchangeName'), route: ['exchanges', item.get('exchangeName')], icon: item.get('exchangeName')};
                return menuItem;
            });
            if(meta_exchanges_menuItems.length > 0) {
                menuItems.findWhere({text: 'Exchanges'}).set({menu: meta_exchanges_menuItems});
            }

            var items = menuItems.map(function(item) {
                return SidebarListItem({
                    key: item.get("text"),
                    icon: item.get("icon"),
                    route: item.get("route"),
                    active: this.state.active && item.get("route") == this.state.active[0]
                }, React.DOM.ul({},
                    _(item.get("menu")).map(function(subitem) {
                        return SidebarListItem({
                            key: subitem.text,
                            icon: subitem.icon,
                            route: subitem.route,
                            active: this.state.active && subitem.route.join('/') == this.state.active.join('/')
                        })
                    }.bind(this))))
            }.bind(this));

            return React.DOM.div({
                id: 'sidebar',
                className: 'large-3 medium-3 columns'
            },
            React.DOM.div({className: 'wrap'},
                Logo(),
                React.DOM.button({id: 'expand-btn'}, '☰'),
                React.DOM.ul({className: 'nav'}, items))
            );
        }
    });

    return Sidebar;
});
