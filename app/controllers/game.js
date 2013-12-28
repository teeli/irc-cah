// import modules
var util = require('util'),
    _ = require('underscore'),
    config = require('../../config/config'),
    Game = require('../models/game'),
    Games = require('../collections/games'),
    Cards = require('../collections/cards'),
    Player = require('../models/player');

var games = new Games(),
    gameTimer;
haiku = { // TODO: Implement haiku round that ends the game
    "draw": 2,
    "pick": 3,
    "text": "(Draw 2, Pick 3) Make a haiku."
};

// TODO: Games should just be array
// TODO: Game should be a separate controller
// TODO: Allow multi ccard thingies
// TODO: Enable draws on white cards

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
            // TODO: Check that enough players of wait more
            client.say(channel, 'Game is starting. Dealing cards...');
            // TODO: Move this to allow multiple games to run
            game.shuffleDecks();

            // game loop
            var gameLoop = function () {
                game.deal();
                // TODO: Event based
                var czar = game.nextCzar();
                if (czar) {
                    // czar found
                    client.say(channel, 'Round ' + (game.get('currentRound') + 1) + '! ' + czar.get('nick') + ' is the card czar.');
                    var card = game.newCard();
                    client.say(channel, card.get('text'));
                    game.set('playable', true);
                } else {
                    // no players
                    client.say(channel, 'No players. Stopping the game.');
                    games.remove(game);
                }
            };

            // event handlers
            game.on('allPlayed', function (event) {
                game.set('playable', false);
                client.say(channel, 'Every one has played. Here are the results:');
                var results = game.getResults();
                console.log(results);
                results.blacks.shuffleDeck();
                results.blacks.each(function (b, i) {
                    var owner = b.get('owner').get('nick');
                    client.say(channel, i + ": " + util.format(results.white.get('text'), b.get('text')));
                }, this);
                var czar = game.get('players').findWhere({czar: true});
                client.say(channel, czar.get('nick') + ': Select the winner (!winner <entry number>)');
            }, this);
            game.on('roundComplete', gameLoop);

            gameLoop();

        }, 10 * 1000);
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
            player.get('cards').forEach(function (element, index, list) {
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
    var channel = message.args[0],
        nick = message.nick,
        hostname = message.user + '@' + message.host,
        game = games.findWhere({channel: channel}),
        player = game.get('players').findWhere({hostname: hostname});
    // TODO: Make sure that players who join in the middle of round does not count (they have no cards)
    // check that game is in playing state
    if (typeof game === 'undefined' || !game.get('playable')) {
        client.say(channel, 'I can\'t let you do that, Dave');
    }
    if (typeof player !== 'undefined') {
        var cards = player.get('cards');
        if (cards.length > 0) {
            if (player.get('czar')) {
                client.say(channel, nick + ': You are the czar. The czar does not play. The czar makes other people do his dirty work.');
            } else {
                // TODO: Handle card
                console.log('CARD: ' + cmdArgs);
                var card = cards.at(cmdArgs[0]);
                console.log(nick + ' played ' + card.get('text'));
                game.playCard(card, player);
            }
        }
    }
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

/**
 * Select the winner
 * @param client
 * @param message
 * @param cmdArgs
 */
exports.winner = function (client, message, cmdArgs) {
    var channel = message.args[0],
        nick = message.nick,
        hostname = message.user + '@' + message.host,
        game = games.findWhere({channel: channel}),
        player = game.get('players').findWhere({hostname: hostname}),
        winnerIndex = cmdArgs[0];
    if(!isNaN(winnerIndex) && player.get('czar') === true) {
        var winner = game.setWinner(winnerIndex);
        if(typeof winner !== 'undefined') {
            client.say(channel, 'Winner is: ' + winner.get('nick') + ' with "tähä voittajalause"! ' + winner.get('nick') + ' has ' + winner.get('points') + ' points');
            game.nextRound();
        }
    } else {
        client.say(channel, nick + ': You are not the czar. You lose one point.');
    }
};