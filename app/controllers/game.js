// import modules
var _ = require('underscore'),
    config = require('../../config/config'),
    Game = require('../models/game'),
    Games = require('../collections/games'),
    Cards = require('../collections/cards'),
    Player = require('../models/player');

var games = new Games(),
    haiku = { // TODO: Implement haiku round that ends the game
        "draw": 2,
        "pick": 3,
        "text": "(Draw 2, Pick 3) Make a haiku."
    };

/**
 * Start a game
 * @param client
 * @param message
 * @param cmdArgs
 */
exports.start = function (client, message, cmdArgs) {
    // check if game running on the channel
    var channel = message.args[0],
        nick = message.nick,
        hostname = message.user + '@' + message.host,
        game = games.findWhere({channel: channel});
    if (typeof game === 'undefined') {
        // create game
        client.say(channel, nick + ' started a new game of Cards Against Humanity. The game start in 30 seconds. Type !join to join the game any time.');
        game = new Game({
            channel:   channel,
            startedBy: nick,
            whiteDeck: new Cards(config.cards.whites),
            blackDeck: new Cards(config.cards.blacks)
        });

        // add game to games
        games.add(game);

        // add the player to the game
        exports.join(client, message, cmdArgs);

        setTimeout(function () {
            client.say(channel, 'Game is starting. Dealing cards...');
            game.shuffleDecks();
            game.deal();
        }, 3 * 1000);
    } else {
        client.say(channel, 'A game is already running. Type !join to join the game.');
    }
};

/**
 * Stop a game
 * @param client
 * @param message
 * @param cmdArgs
 */
exports.stop = function (client, message, cmdArgs) {
    var channel = message.args[0],
        nick = message.nick,
        game = games.findWhere({channel: channel});
    if (typeof game === 'undefined') {
        client.say(channel, 'No game running. Start the game by typing !start.');
    } else {
        client.say(channel, nick + ' stopped the game. Here are the results');
        games.remove(game);
    }
};

/**
 * Add player to game
 * @param client
 * @param message
 * @param cmdArgs
 */
exports.join = function (client, message, cmdArgs) {
    var channel = message.args[0],
        nick = message.nick,
        hostname = message.user + '@' + message.host,
        game = games.findWhere({channel: channel});
    if (typeof game === 'undefined') {
        client.say(channel, 'No game running. Start the game by typing !start.');
    } else {
        client.say(channel, nick + ' has joined the game');
        // add the player to the game
        var player = new Player({
            nick:     nick,
            hostname: hostname
        });
        game.get('players').add(player);
    }
};

/**
 * Remove player from game
 * @param client
 * @param message
 * @param cmdArgs
 */
exports.quit = function (client, message, cmdArgs) {
    var channel = message.args[0],
        nick = message.nick,
        hostname = message.user + '@' + message.host,
        game = games.findWhere({channel: channel});
    if (typeof game === 'undefined') {
        client.say(channel, 'No game running. Start the game by typing !start.');
    } else {
        client.say(channel, nick + ' has left the game');
        var players = game.get('players');
        var player = players.findWhere({hostname: hostname});
        if (typeof player !== 'undefined') {
            players.remove(player);
        }
    }
};

/**
 * Get players cards
 * @param client
 * @param message
 * @param cmdArgs
 */
exports.cards = function (client, message, cmdArgs) {
    var channel = message.args[0],
        nick = message.nick,
        hostname = message.user + '@' + message.host,
        game = games.findWhere({channel: channel});
    if (typeof game !== 'undefined') {
        var players = game.get('players');
        var player = players.findWhere({hostname: hostname});
        if (typeof player !== 'undefined') {
            client.notice(nick, nick + ', your cards are:');
            console.log(player.get('cards'));
            player.get('cards').forEach(function(element, index, list) {
                client.notice(nick, index + ': ' + element.get('text'));
            }, this);
        }
    }
};

/**
 * Play cards
 * @param client
 * @param message
 * @param cmdArgs
 */
exports.play = function (client, message, cmdArgs) {
    // check if everyone has played and end the round
};

/**
 * Lisst players in the game
 * @param client
 * @param message
 * @param cmdArgs
 */
exports.list = function (client, message, cmdArgs) {
    var channel = message.args[0],
        nick = message.nick,
        game = games.findWhere({channel: channel});
    if (typeof game === 'undefined') {
        client.say(channel, 'No game running. Start the game by typing !start.');
    } else {
        client.say(channel, game.get('players').pluck('nick').toString());
    }
};

