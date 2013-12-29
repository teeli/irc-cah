var _ = require('underscore'),
    util = require('util'),
    Cards = require('../controllers/cards'),
    Card = require('../models/card');

/**
 * Available states for game
 * @type {{STOPPED: string, STARTED: string, PLAYABLE: string, PLAYED: string, ROUND_END: string}}
 */
var STATES = {
    STOPPED:   'Stopped',
    STARTED:   'Started',
    PLAYABLE:  'Playable',
    PLAYED:    'Played',
    ROUND_END: 'RoundEnd'
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
    self.round = 0;
    self.players = [];
    self.channel = channel;
    self.client = client;
    self.config = config;
    self.state = STATES.STARTED;

    // init decks
    self.decks = {
        white: new Cards(config.cards.whites),
        black: new Cards(config.cards.blacks)
    };
    self.discards = {
        white: new Cards(),
        black: new Cards()
    };
    self.table = {
        white: new Cards(),
        black: new Cards()
    };
    self.decks.white.shuffle();
    self.decks.black.shuffle();

    /**
     * Stop game
     */
    self.stop = function () {
        self.state = STATES.STOPPED;
        // TODO: Destroy everything
    };

    /**
     * Start next round
     */
    self.nextRound = function () {
        if (self.players.length === 0) {
            // TODO: stop the game here
            self.say('Not enough players. Stoping...');
            self.stop();
            return false;
        }
        self.round++;
        console.log('Starting round ', self.round);
        self.setCzar();
        self.deal();
        self.say('Round ' + self.round + '! ' + self.czar.nick + ' is the card czar.');
        self.playWhite();
        self.state = STATES.PLAYABLE;
    };

    /**
     * Set a new czar
     * @returns Player The player object who is the new czar
     */
    self.setCzar = function () {
        console.log('Old czar', self.czar);
        self.czar = self.players[self.players.indexOf(self.czar) + 1] || self.players[0];
        console.log('New czar', self.czar);
        console.log('index', self.players.indexOf(self.char));
        self.czar.czar = true;
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
     * Play new white card on the table
     */
    self.playWhite = function () {
        var card = self.decks.white.pickCards();
        // replace all instance of %s with underscores for prettier output
        self.say(card.text.replace(/\%s/g, '___'));
        self.table.white = card;
        // TODO: Timer to end the round
    };

    /**
     * Clean up table after round is complete
     */
    self.clean = function () {
        // move cards from table to discard
        self.discards.white.addCard(self.table.white);
        self.table.white = null;
        var count = self.table.black.numCards();
        for (var i = 0; i < count; i++) {
            self.discards.black.addCard(self.table.black.pickCards(0));
        }

        // reset players
        _.each(self.players, function (player) {
            player.played = false;
            player.czar = false;
        });
        // reset state
        self.state = STATES.STARTED;
    };

    /**
     * Play a black card from players hand
     * @param player Player object
     * @param cards card indexes in players hand
     */
    self.playCard = function (player, cards) {
        console.log('play card', arguments);
        if (self.state !== STATES.PLAYABLE) {
            self.say(player.nick + ': Can\'t play at the moment.');
        } else if (typeof player !== 'undefined') {
            if (player.czar === true) {
                self.say(player.nick + ': You are the card czar. The czar does not play. The czar makes other people do his dirty work.');
            } else {
                var blanks = self.table.white.text.match(/\%s/g);
                var count = blanks ? blanks.length : 1;
                if (player.played === true) {
                    self.say(player.nick + ': You have already played on this round.');
                }
                if (cards.length != count) {
                    // invalid card count
                    self.say(player.nick + ': You must pick ' + count + ' cards.');
                } else {
                    // TODO: Handle multiple cards
                    var card = player.cards.pickCards(cards[0]);
                    self.table.black.addCard(card);
                    player.played = true;
                    if (_.where(self.players, {played: false, czar: false}).length === 0) {
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
        _.each(self.table.black.cards, function (card, i) {
            self.say(i + ": " + util.format(self.table.white.text, card.text));
        }, this);
        self.say(self.czar.nick + ': Select the winner (!winner <entry number>)');
    };

    /**
     * Pick an entry that wins the round
     * @param index Index of the winning card in table list
     */
    self.selectWinner = function (player, index) {
        var winner = self.table.black.cards[index];
        if (self.state === STATES.PLAYED) {
            if(player.czar === false) {
                client.say(player.nick + ': You are not the card czar. Only the card czar can select the winner');
            } else if (typeof winner === 'undefined') {
                self.say('Invalid winner');
            } else {
                self.state = STATES.ROUND_END;
                var owner = winner.owner;
                winner.owner = null;
                owner.points++;
                self.say('Winner is: ' + owner.nick + ' with "' + util.format(self.table.white.text, winner.text) + '"! ' + owner.nick + ' has ' + owner.points + ' points');
                self.clean();
                self.nextRound();
            }
        }
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
            return player;
        }
        return false;
    };

    /**
     * Find player by hostname
     * @param search
     * @returns {*}
     */
    self.getPlayer = function (search) {
//        var player;
//        _.each(self.players, function (p) {
//            if (p.hostname === hostname) {
//                player = p;
//            }
//        }, self);
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
     * Public message to the game channel
     * @param string
     */
    self.say = function (string) {
        self.client.say(self.channel, string);
    };

    // announce the game on the channel
    self.say('A new game of Cards Against Humanity. The game start in 30 seconds. Type !join to join the game any time.');

    // wait for players to join
    self.startTimeout = setTimeout(self.nextRound, 10000);
    console.log('Game initilized. Timeout id: ', self.startTimeout);

};

exports = module.exports = Game;