// import modules
var _ = require('underscore'),
    Game = require('./game'),
    Player = require('../models/player'),
    config = require('../../config/config');

var Games = function Games() {
    var self = this;
    self.games = [];

    /**
     * Find a game by channel it is running on
     * @param channel
     * @returns {*}
     */
    self.findGame = function (channel) {
        var game;
        // TODO: Replace with filter or something
        _.each(self.games, function (g) {
            if (g.channel === channel) {
                game = g;
            }
        });
        return game;
    };

    /**
     * Start a game
     * @param client
     * @param message
     * @param cmdArgs
     */
    self.start = function (client, message, cmdArgs) {
        // check if game running on the channel
        var channel = message.args[0],
            nick = message.nick,
            hostname = message.user + '@' + message.host;

        if (typeof self.findGame(channel) !== 'undefined') {
            // game exists
            client.say(channel, 'A game is already running. Type !join to join the game.');
        } else {
            // init game
            var game = new Game(channel, client, config);
            self.games.push(game);
            var player = new Player(nick, hostname);
            game.addPlayer(player);
        }
    };

    /**
     * Stop a game
     * @param client
     * @param message
     * @param cmdArgs
     */
    self.stop = function (client, message, cmdArgs) {
        var channel = message.args[0],
            nick = message.nick,
            hostname = message.user + '@' + message.host,
            game = self.findGame(channel);
        if (typeof game === 'undefined') {
            client.say(channel, 'No game running. Start the game by typing !start.');
        } else {
            game.stop(game.getPlayer({nick: nick, hostname: hostname}));
            self.games = _.without(self.games, game);
        }
    };

    /**
     * Add player to game
     * @param client
     * @param message
     * @param cmdArgs
     */
    self.join = function (client, message, cmdArgs) {
        var channel = message.args[0],
            nick = message.nick,
            hostname = message.user + '@' + message.host,
            game = self.findGame(channel);

        if (typeof game === 'undefined') {
            client.say(channel, 'No game running. Start the game by typing !start.');
        } else {
            var player = new Player(nick, hostname);
            game.addPlayer(player);
        }
    };

    /**
     * Remove player from game
     * @param client
     * @param message
     * @param cmdArgs
     */
    self.quit = function (client, message, cmdArgs) {
        var channel = message.args[0],
            nick = message.nick,
            hostname = message.user + '@' + message.host,
            game = self.findGame(channel);
        if (typeof game === 'undefined') {
            client.say(channel, 'No game running. Start the game by typing !start.');
        } else {
            game.removePlayer(game.getPlayer({nick: nick, hostname: hostname}));
        }
    };

    /**
     * Get players cards
     * @param client
     * @param message
     * @param cmdArgs
     */
    self.cards = function (client, message, cmdArgs) {
        var channel = message.args[0],
            nick = message.nick,
            hostname = message.user + '@' + message.host,
            game = self.findGame(channel);
        if (typeof game === 'undefined') {
            client.say(channel, 'No game running. Start the game by typing !start.');
        } else {
            var player = game.getPlayer({nick: nick, hostname: hostname});
            game.showCards(player);
        }
    };

    /**
     * Play cards
     * @param client
     * @param message
     * @param cmdArgs
     */
    self.play = function (client, message, cmdArgs) {
        // check if everyone has played and end the round
        var channel = message.args[0],
            nick = message.nick,
            hostname = message.user + '@' + message.host,
            game = self.findGame(channel);
        if (typeof game === 'undefined') {
            client.say(channel, 'No game running. Start the game by typing !start.');
        } else {
            var player = game.getPlayer({nick: nick, hostname: hostname});
            if (typeof(player) !== 'undefined') {
                game.playCard(cmdArgs, player);
            }
        }
    };

    /**
     * Lisst players in the game
     * @param client
     * @param message
     * @param cmdArgs
     */
    self.list = function (client, message, cmdArgs) {
        var channel = message.args[0],
            game = self.findGame(channel);
        if (typeof game === 'undefined') {
            client.say(channel, 'No game running. Start the game by typing !start.');
        } else {
            game.listPlayers();
        }
    };

    /**
     * Select the winner
     * @param client
     * @param message
     * @param cmdArgs
     */
    self.winner = function (client, message, cmdArgs) {
        var channel = message.args[0],
            nick = message.nick,
            hostname = message.user + '@' + message.host,
            game = self.findGame(channel);
        if (typeof game === 'undefined') {
            client.say(channel, 'No game running. Start the game by typing !start.');
        } else {
            var player = game.getPlayer({nick: nick, hostname: hostname});
            game.selectWinner(cmdArgs[0], player);
        }
    };

    /**
     * Show top players in current game
     * @param client
     * @param message
     * @param cmdArgs
     */
    self.points = function (client, message, cmdArgs) {
        var channel = message.args[0],
            hostname = message.user + '@' + message.host,
            game = self.findGame(channel);
        if (typeof game === 'undefined') {
            client.say(channel, 'No game running. Start the game by typing !start.');
        } else {
            game.showPoints();
        }
    };

    /**
     * Show top players in current game
     * @param client
     * @param message
     * @param cmdArgs
     */
    self.status = function(client, message, cmdArgs) {
        var channel = message.args[0],
            game = self.findGame(channel);
        if (typeof game === 'undefined') {
            client.say(channel, 'No game running. Start the game by typing !start.');
        } else {
            game.showStatus();
        }
    };
};

exports = module.exports = Games;