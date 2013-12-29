var _ = require('underscore'),
    util = require('util'),
    Cards = require('../controllers/cards'),
    Card = require('../models/card');

/**
 * Available states for game
 * @type {{STOPPED: string, STARTED: string, PLAYABLE: string, PLAYED: string, ROUND_END: string, WAITING: string}}
 */
var STATES = {
    STOPPED:   'Stopped',
    STARTED:   'Started',
    PLAYABLE:  'Playable',
    PLAYED:    'Played',
    ROUND_END: 'RoundEnd',
    WAITING:   'Waiting'
};

// TODO: Implement the ceremonial haiku round that ends the game
var HAIKU = new Card({
    "draw": 2,
    "pick": 3,
    "text": "(Draw 2, Pick 3) Make a haiku."
});

var Game = function Game(channel, client, config) {
    var self = this;

    // properties
    self.waitCount = 0; // number of times waited until enough players
    self.round = 0; // round number
    self.players = []; // list of players
    self.channel = channel; // the channel this game is running on
    self.client = client; // reference to the irc client
    self.config = config; // configuration data
    self.state = STATES.STARTED; // game state storage

    // init decks
    self.decks = {
        white: new Cards(config.cards.whites),
        black: new Cards(config.cards.blacks)
    };
    // init discard piles
    self.discards = {
        white: new Cards(),
        black: new Cards()
    };
    // init table slots
    self.table = {
        white: null,
        black: []
    };
    // shuffle decks
    self.decks.white.shuffle();
    self.decks.black.shuffle();

    /**
     * Stop game
     */
    self.stop = function (player) {
        self.state = STATES.STOPPED;


        if (typeof player !== 'undefined') {
            self.say(player.nick + ' stopped the game.');
        } else {
            self.say('Game has been stopped.');
        }
        self.showPoints();

        clearTimeout(self.startTimeout);
        // TODO: Destroy cards & players
        delete self.players;
        delete self.config;
        delete self.client;
        delete self.channel;
        delete self.round;
        delete self.decks;
        delete self.discards;
        delete self.table;
    };

    /**
     * Start next round
     */
    self.nextRound = function () {
        clearTimeout(self.stopTimeout);
        if (self.players.length < 3) {
            self.say('Not enough players to start a round (need at least 3). Waiting for others to join. Stopping in 3 minutes if not enough players.');
            self.state = STATES.WAITING;
            // stop game if not enough pleyers in 3 minutes
            self.stopTimeout = setTimeout(self.stop, 3 * 60 * 1000);
            return false;
        }
        self.round++;
        console.log('Starting round ', self.round);
        self.setCzar();
        self.deal();
        self.say('Round ' + self.round + '! ' + self.czar.nick + ' is the card czar.');
        self.playWhite();
        // show cards for all players (except czar)
        var timeout = 0;
        _.each(_.where(self.players, {isCzar: false}), function (player) {
            setTimeout(self.showCards, timeout + 1000, player);
        });
        self.state = STATES.PLAYABLE;
    };

    /**
     * Set a new czar
     * @returns Player The player object who is the new czar
     */
    self.setCzar = function () {
        if (self.czar) {
            console.log('Old czar:', self.czar.nick);
        }
        self.czar = self.players[self.players.indexOf(self.czar) + 1] || self.players[0];
        console.log('New czar:', self.czar.nick);
        self.czar.isCzar = true;
        return self.czar;
    };

    /**
     * Deal cards to fill players' hands
     */
    self.deal = function () {
        _.each(self.players, function (player) {
            console.log(player.nick + '(' + player.hostname + ') has ' + player.cards.numCards() + ' cards. Dealing ' + (10 - player.cards.numCards()) + ' cards');
            for (var i = player.cards.numCards(); i < 10; i++) {
                var card = self.decks.black.pickCards();
                player.cards.addCard(card);
                card.owner = player;
            }
        }, this);
    };

    /**
     * Clean up table after round is complete
     */
    self.clean = function () {
        // move cards from table to discard
        self.discards.white.addCard(self.table.white);
        self.table.white = null;
//        var count = self.table.black.length;
        _.each(self.table.black, function (cards) {
            _.each(cards.getCards(), function (card) {
                card.owner = null;
                self.discards.black.addCard(card);
                cards.removeCard(card);
            }, this);
        }, this);
        self.table.black = [];

        // reset players
        _.each(self.players, function (player) {
            player.hasPlayed = false;
            player.isCzar = false;
        });
        // reset state
        self.state = STATES.STARTED;
    };

    /**
     * Play new white card on the table
     */
    self.playWhite = function () {
        var card = self.decks.white.pickCards();
        // replace all instance of %s with underscores for prettier output
        self.say('Card: ' + card.text.replace(/\%s/g, '___'));
        self.table.white = card;
        // TODO: Timer to end the round
    };

    /**
     * Play a black card from players hand
     * @param player Player object
     * @param cards card indexes in players hand
     */
    self.playCard = function (player, cards) {
        console.log(player.nick + ' played cards', cards.join(', '));
        if (self.state !== STATES.PLAYABLE || player.cards.numCards() === 0) {
            self.say(player.nick + ': Can\'t play at the moment.');
        } else if (typeof player !== 'undefined') {
            if (player.isCzar === true) {
                self.say(player.nick + ': You are the card czar. The czar does not play. The czar makes other people do his dirty work.');
            } else {
                var blanks = self.table.white.text.match(/\%s/g);
                var count = blanks ? blanks.length : 1;
                if (player.hasPlayed === true) {
                    self.say(player.nick + ': You have already played on this round.');
                } else if (cards.length != count) {
                    // invalid card count
                    self.say(player.nick + ': You must pick ' + count + ' cards.');
                } else {
                    // get played cards
                    var playerCards;
                    try {
                        playerCards = player.cards.pickCards(cards);
                    } catch (error) {
                        self.notice(player.nick, 'Invalid card index');
                        return false;
                    }
                    self.table.black.push(playerCards);
                    player.hasPlayed = true;
                    self.notice(player.nick, 'You played: ' + self.getFullEntry(self.table.white, playerCards.getCards()));
                    if (_.where(_.filter(self.players, function (player) {
                        // check only players with cards (so players who joined in the middle of a round are ignored)
                        return player.cards.numCards() > 0;
                    }), {hasPlayed: false, isCzar: false}).length === 0) {
                        // alright, everyone played
                        self.state = STATES.PLAYED;
                        self.showEntries();
                    }
                }
            }
        } else {
            console.warn('Invalid player tried to play a card');
        }
    };

    /**
     * Show the entries
     */
    self.showEntries = function () {
        self.say('Everyone has played. Here are the entries:');
        // shuffle the entries
        self.table.black = _.shuffle(self.table.black);
        _.each(self.table.black, function (cards, i) {
            self.say(i + ": " + self.getFullEntry(self.table.white, cards.getCards()));
        }, this);
        self.say(self.czar.nick + ': Select the winner (!winner <entry number>)');
    };

    /**
     * Pick an entry that wins the round
     * @param index Index of the winning card in table list
     */
    self.selectWinner = function (player, index) {
        var winner = self.table.black[index];
        if (self.state === STATES.PLAYED) {
            if (player !== self.czar) {
                client.say(player.nick + ': You are not the card czar. Only the card czar can select the winner');
            } else if (typeof winner === 'undefined') {
                self.say('Invalid winner');
            } else {
                self.state = STATES.ROUND_END;
                var owner = winner.cards[0].owner;
                owner.points++;
                // announce winner
                self.say('Winner is: ' + owner.nick + ' with "' + self.getFullEntry(self.table.white, winner.getCards()) + '"! ' + owner.nick + ' has ' + owner.points + ' awesome points');
                self.clean();
                self.nextRound();
            }
        }
    };

    /**
     * Get formatted entry
     * @param white
     * @param blacks
     * @returns {*|Object|ServerResponse}
     */
    self.getFullEntry = function (white, blacks) {
        var args = [white.text];
        _.each(blacks, function (card) {
            args.push(card.text);
        }, this);
        return util.format.apply(this, args);
    };

    /**
     * Add a player to the game
     * @param player Player object containing new player's data
     * @returns The new player or false if invalid player
     */
    self.addPlayer = function (player) {
        if (typeof self.getPlayer(player.hostname) === 'undefined') {
            self.players.push(player);
            self.say(player.nick + ' has joined the game');
            // check if waiting for players
            if (self.state === STATES.WAITING && self.players.length >= 3) {
                // enough players, start the game
                self.nextRound();
            }
            return player;
        }
        return false;
    };

    /**
     * Find player
     * @param search
     * @returns {*}
     */
    self.getPlayer = function (search) {
        return _.findWhere(self.players, search);
    };

    /**
     * Remove player from game
     * @param player
     * @returns The removed player or false if invalid player
     */
    self.removePlayer = function (player) {
        if (typeof player !== 'undefined') {
            self.players = _.without(self.players, player);
            self.say(player.nick + ' has left the game');
            return player;
        }
        return false;
    };

    /**
     * Show players cards to player
     * @param player
     */
    self.showCards = function (player) {
        if (typeof player !== 'undefined') {
            var cards = "";
            _.each(player.cards.getCards(), function (card, index) {
                cards += ' [' + index + '] ' + card.text;
            }, this);
            self.notice(player.nick, player.nick + ', your cards are:' + cards);
        }
    };

    /**
     * Show points for all players
     */
    self.showPoints = function () {
        var sortedPlayers = _.sortBy(self.players, function (player) {
            return -player.points;
        });
        var output = "";
        _.each(sortedPlayers, function (player) {
            output += player.nick + " " + player.points + " awesome points, ";
        });
        self.say('The most horrible people: ' + output.slice(0, -2));
    };

    /**
     * List all players in the current game
     */
    self.listPlayers = function() {
        self.say('Players in the current game: ' + _.pluck(self.players, 'nick').join(', '));
    };

    /**
     * Public message to the game channel
     * @param string
     */
    self.say = function (string) {
        self.client.say(self.channel, string);
    };

    self.pm = function (nick, string) {
        self.client.say(nick, string);
    };

    self.notice = function (nick, string) {
        self.client.notice(nick, string);
    };

    // announce the game on the channel
    self.say('A new game of Cards Against Humanity. The game starts in 30 seconds. Type !join to join the game any time.');

    // wait for players to join
    self.startTimeout = setTimeout(self.nextRound, 30000);

};

exports = module.exports = Game;