define(['backbone', 'models/menu_item'], function(Backbone, MenuItem) {

    var MenuItems = Backbone.Collection.extend({

        model: MenuItem,

        initialize: function() {
            this.set(menuItems);
        }
    });

    var menuItems = [
        {
            text: 'All',
            route: ['all'],
            icon: 'all'
        },
        {
            text: 'Wallets',
            route: ['wallets'],
            icon: 'wallet'
        },
        {
            text: 'Exchanges',
            route: ['exchanges'],
            icon: 'exchange',
            menu: [
            {
                text: 'Trades',
                route: ['exchanges', 'trades'],
                icon: 'trades'
            },
            {
                text: 'Orders',
                route: ['exchanges', 'orders'],
                icon: 'orders'
            }]
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
                icon: 'contact'
            },
            {
                text: 'FAQ',
                route: ['about', 'faq'],
                icon: 'question'
            }]
        }
    ];

    return new MenuItems();
});
