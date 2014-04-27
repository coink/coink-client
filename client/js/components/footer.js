define(['react', 'coin'], function(React, coin) {

    var Footer = React.createClass({
        displayName: 'Footer',

        render: function() {
            var year = new Date().getFullYear();
            return React.DOM.footer({},
              "\u00a9 " + year + " Coink");
        },

        componentDidMount: function() {

            var config = {
                wallet_address: '1cnkWJwRmzUGwDTBCaDoK8xbNqRLGTxfw',
                currency: 'bitcoin',
                counter: 'count',
                alignment: 'ac',
                qrcode: true,
                auto_show: false,
                lbl_button: 'Donate BTC',
                lbl_address: 'Feed us!' ,
                lbl_count: 'donations' ,
                lbl_amount: 'BTC'
            };
            config = CoinWidgetCom.validate(config);
            CoinWidgetCom.config[CoinWidgetComCounter] = config;
            CoinWidgetCom.loader.jquery();
            $('footer').append('<span data-coinwidget-instance="'+CoinWidgetComCounter+'" class="COINWIDGETCOM_CONTAINER"></span>');
            CoinWidgetComCounter++;
        }
    });
    return Footer;
});
