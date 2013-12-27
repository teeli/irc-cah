/**
 * Cards Against Humanity IRC bot
 * main application script
 * @author Teemu Lahti <teemu.lahti@gmail.com>
 */
console.log('Initializing Cards Against Humanity bot');

// dependencies
var _ = require('underscore'),
    irc = require('irc'),
    game = require('./app/game.js');

// Set node env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// app config
var config = require('./config/config');

// init irc client
console.log('Connecting to ' + config.server + ' as ' + config.nick + '...');
var client = new irc.Client(config.server, config.nick, config.clientOptions);

// handle connection to server for logging
client.addListener('registered', function (message) {
    console.log('Connected to server ' + message.server);
});

// handle joins to channels for logging
client.addListener('join', function (channel, nick, message) {
    console.log('Joined ' + channel + ' as ' + nick);
});

// init game
var cah = game(client, config);

require('./config/commands.js')(game);
