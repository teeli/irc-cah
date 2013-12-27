var _ = require('underscore'),
    Backbone = require('backbone'),
    Cards = require('../collections/cards'),
    Players = require('../collections/players');

// Extend model
var Game = Backbone.Model.extend({
    defaults:   {
        channel:      "",
        currentRound: 0,
        players:      new Players(),
        whiteDeck:    new Cards(),
        blackDeck:    new Cards(),
        whiteDiscard: new Cards(),
        blackDiscard: new Cards(),
        table:        new Cards()
    },
    initialize: function (attr) {
        console.log('init game');
    },
    shuffleDecks: function() {
        // shuffle
        this.get('whiteDeck').shuffleDeck();
        this.get('blackDeck').shuffleDeck();
    },
    // deal cards for all players
    deal:       function () {
        this.get('players').forEach(function (player) {
            var cards = player.get('cards');
            console.log(player.get('nick') + ' has ' + cards.length + ' cards');
            for (var i = cards.length; i < 8; i++) {
                console.log('add card ' + i);
                var card = this.get('blackDeck').first();
                this.get('blackDeck').remove(card);
                cards.add(card);
                console.log(card);
            }
        }, this);
    },
    // clean table & put cards to dis
    clean:      function () {

    }
});

/**
 * Expose `Game()`
 */
exports = module.exports = Game;
