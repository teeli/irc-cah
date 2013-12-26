/**
 * Cards Against Humanity IRC bot
 * main application script
 * @author Teemu Lahti <teemu.lahti@gmail.com>
 */
var irc = require('irc'),
    env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config');

console.log('Starting Cards Against Humanity -bot');
console.log('Stats:');
console.log(config.cards.blacks.length + ' black cards loaded');
console.log(config.cards.whites.length + ' white cards loaded');

console.log('Connecting to ' + config.server + ' as ' + config.nick + '...');
var client = new irc.Client(config.server, config.nick, {
    channels: config.channels
});

client.addListener('message', function (from, to, message) {
    console.log('message from ' + from + ' to ' + to + ': ' + message);
    if (config.channels.indexOf(to) >= 0) {
        // said on channel where game is being played
        client.say(to, from + ', gotcha on ' + to);
    } else if (config.nick === to) {
        // private message to bot
        client.say(from, 'roger that');
    }
});

