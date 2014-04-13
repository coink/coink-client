define(['react', 'models/notification', 'models/exchange', 'collections/exchanges'],
function(React, notification, Exchange, Exchanges) {

    var AddExchangeFormFields = React.createClass({
        displayName: "ExchangeFields",
        getInitialState: function() {
            return {nickname: ''}
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

    var NewExchangeView = React.createClass({
        displayName: "Exchanges",
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
            var currentExchange = this.props.meta_exchanges.findWhere({exchangeName: this.props.exchangeName});
            console.log("Newest currentExchange name is " + currentExchange.get('exchangeName'));
            var content;

            fields = AddExchangeFormFields({
                currentExchange: currentExchange,
                addModel: this.props.addModel,
                removeModel: this.props.removeModel
            });

            return React.DOM.div({}, React.DOM.h1({}, "New " + currentExchange.get('exchangeName') + " Account"),
                fields);
        }
    });

    return NewExchangeView;
});
