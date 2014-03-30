define(['backbone', 'models/menuItem'], function(Backbone, MenuItem) {

    var MenuItems = Backbone.Collection.extend({
        model: MenuItem,
        initialize: function() {
            this.set(menuItems);
        }
    });

    var menuItems = [
        {
            text: 'Wallets',
            route: ['wallets'],
            icon: 'wallet'
        },
        {
            text: 'Exchanges',
            route: ['exchanges'],
            icon: 'exchange'
        },
        {
            text: 'Settings',
            route: ['settings'],
            icon: 'cog'
        },
        {
            text: 'Help',
            route: ['help'],
            icon: 'help'
        },
        {
            text: 'About',
            route: ['about'],
            icon: 'about',
            menu: [
            {
                text: 'Contact Us',
                route: ['about', 'contact'],
                icon: 'contact',
            }]
        }
    ];

    return MenuItems;

});
