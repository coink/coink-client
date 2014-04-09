define(['react', 'models/notification', 'models/exchange', 'collections/exchanges', 'collections/meta_exchanges'],
function(React, notification, Exchange, Exchanges, MetaExchanges) {

    var AddExchangeFormFields = React.createClass({
        displayName: "ExchangeFields",
        getInitialState: function() {
            return {nickname: ''}
        },
        componentWillReceiveProps: function(nextProps) {
            $('input.exchange-field').each(function() {
                this.value = '';
            });
            var map = {};
            map.nickname = '';
            $.each(nextProps.currentExchange.get('requiredFields'), function(index, field) {
                map[field.machineName] = '';
            });
            this.replaceState(map);
        },
        setField: function(e) {
            var map = {};
            map[e.target.id] = e.target.value;
            this.setState(map);
        },
        handleSubmit: function(e) {
            e.preventDefault();

            //Fill map with the attributes to set in the model
            var map = {};
            map.exchangeName = this.props.currentExchange.get('exchangeName');
            map.nickname = this.state.nickname;
            map.credentials = {};
            $.each(this.props.currentExchange.get('requiredFields'), function(index, field) {
                map.credentials[field.machineName] = this.state[field.machineName];
            }.bind(this));

            //Only create and save the model if the input is valid
            if(this.validateAccount(map.credentials, map.nickname)) {
                var model = new Exchange(map);

                //This is where we save the entry on the server
                model.save({}, {
                    success: function(model, response, options) {
                        notification.success("Successfully added an exchange account " + model.get('nickname'));
                    },
                    error: function(model, response, options) {
                        notification.error("Unable to add exchange account " + model.get('nickname'));
                        this.props.removeModel(model);
                    }.bind(this)
                });

                //Optimistically add the entry to the view
                this.props.addModel(model);
            }
        },
        validateAccount: function(credentials, nickname) {
            var errorArray = [];

            $.each(credentials, function(key, value) {
                if(value == null || value.length == 0) {
                    errorArray.push(key);
                }
            });

            if(nickname == null || nickname.length == 0) {
                errorArray.push("nickname");
            }

            if(errorArray.length == 0) {
                return true;
            }
            else {
                notification.warning(this.validationError(errorArray));
                return false;
            }
        },
        validationError: function(errorArray) {
            var message = "Please enter your ";
            if(errorArray.length == 1) {
                return message.concat(errorArray[0]);
            }
            else if(errorArray.length == 2) {
                return message.concat(errorArray[0] + " and " + errorArray[1]);
            } else {
                var end = errorArray.pop();
                return message.concat(errorArray.join(', ') + ", and " + end);
            }
        },
        render: function() {
            var currentExchange = this.props.currentExchange;
            var exchangeName = currentExchange.get('exchangeName');
            var fields = currentExchange.get('requiredFields').map(function(field) {
                return React.DOM.div({key: field.machineName},
                        React.DOM.label({htmlFor: field.machineName}, field.displayName),
                        React.DOM.input({
                            type: 'text',
                            id: field.machineName,
                            className: 'exchange-field',
                            onChange: this.setField
                        }));
            }.bind(this));

            return React.DOM.form({onSubmit: this.handleSubmit},
                fields,
                React.DOM.label({htmlFor: 'nickname'}, 'Nickname'),
                React.DOM.input({
                    type: 'text',
                    id: 'nickname',
                    className: 'exchange-field',
                    onChange: this.setField
                }),
                React.DOM.input({type: 'submit', value: "Add"}));
        }
    });

    var AddExchangeForm = React.createClass({
        displayName: "ExchangeForm",
        getInitialState: function() {
            return {meta_exchanges: new MetaExchanges(), currentExchange: new Exchange()};
        },
        componentWillMount: function() {
            this.state.meta_exchanges.fetch({
                success: function(collection) {
                    var currentExchange = collection.at(0);
                    if(this.isMounted()) {
                        this.setState({"meta_exchanges": collection, "currentExchange": currentExchange});
                    }
                }.bind(this),
                error: function() {
                    notification.error("AJAX meta_exchanges error");
                }
            });
        },
        setExchange: function(e) {
            var exchangeName = e.target.value;
            var currentExchange = this.state.meta_exchanges.findWhere({exchangeName: exchangeName})
            this.setState({"currentExchange": currentExchange});
        },
        render: function() {
            var content = null, fields = null;
            if(!this.state.meta_exchanges.isEmpty()) {
                exchanges = this.state.meta_exchanges.map(function(model) {
                    return React.DOM.option({key: model.get('exchangeName'), value: model.get('exchangeName')}, model.get('exchangeName'));
                }.bind(this));
                fields = AddExchangeFormFields({
                    currentExchange: this.state.currentExchange,
                    exchange_accounts: this.props.exchange_accounts,
                    addModel: this.props.addModel,
                    removeModel: this.props.removeModel
                });
                content = React.DOM.div({},
                            React.DOM.span({}, "New Exchange Account: "),
                            React.DOM.select({onChange: this.setExchange}, exchanges),
                            fields);

            } else {
                content = React.DOM.p({}, "Loading");
            }

            return content;
       }
    });        

    var NewExchangeView = React.createClass({
        displayName: "Exchanges",
        getInitialState: function() {
            var exchange_accounts = new Exchanges();
            return {"exchange_accounts" : exchange_accounts, "loaded": false};
        },
        componentWillMount: function() {
            var exchange_accounts = new Exchanges();
            exchange_accounts.fetch({
                success: function(collection) {
                    if(this.isMounted()) {
                        this.setState({"exchange_accounts": collection, "loaded": true});
                    }
                }.bind(this),
                error: function(collection) {
                    if(this.isMounted()) {
                        this.setState({"loaded": true});
                        notification.error("AJAX error can't load exchanges");
                    }
                }.bind(this)
            });
        },
        addModel: function(model) {
            var exchange_accounts = this.state.exchange_accounts;
            exchange_accounts.add(model);
            if(this.isMounted()) {
                this.setState({"exchange_accounts": exchange_accounts});
            }
        },
        removeModel: function(model) {
            var exchange_accounts = this.state.exchange_accounts;
            exchange_accounts.remove(model);
            if(this.isMounted()) {
                this.setState({"exchange_accounts": exchange_accounts});
            }
        },
        render: function() {
            var content;
            var loaded = this.state.loaded;
            var exchange_accounts = this.state.exchange_accounts;

            if (!loaded) {
                content = React.DOM.p({}, "Loading");
            }
            else if (exchange_accounts.isEmpty()) {
                content = React.DOM.div({}, AddExchangeForm({exchange_accounts: exchange_accounts, addModel: this.addModel, removeModel: this.removeModel}),
                    React.DOM.div({}, "No exchange accounts"));
            }
            else {
                content = React.DOM.div({}, AddExchangeForm({exchange_accounts: exchange_accounts, addModel: this.addModel, removeModel: this.removeModel}));
            }

            return React.DOM.div({}, React.DOM.h1({}, "My Exchange Accounts"),
                content);
        }
    });

    return NewExchangeView;
});
