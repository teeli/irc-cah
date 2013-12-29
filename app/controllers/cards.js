var _ = require('underscore'),
    Card = require('../models/card');
//    Backbone = require('backbone'),
//    Card = require('../models/card');
//
//var Cards = Backbone.Collection.extend({
//    model:       Card,
//    shuffleDeck: function () {
//        this.reset(this.shuffle(), {silent: true});
//    }
//});

var Cards = function Cards(cards) {
    var self = this;

    self.cards = [];

    // add all cards in init array
    _.each(cards, function (c) {
        var card = new Card(c);
        self.cards.push(card);
    });

    self.shuffle = function () {
        self.cards = _.shuffle(self.cards);
        return self;
    };

    self.addCard = function (card) {
        self.cards.push(card);
        return card;
    };

    self.removeCard = function (card) {
        if (typeof card !== 'undefined') {
            self.cards = _.without(self.cards, card);
        }
        return card;
    };

    self.pickCards = function (index) {
        if (typeof index === 'undefined') index = 0;
        if (index instanceof Array) {
            // get multiple cards
            var cards = [];
            // first get all cards
            _.each(index, function (i) {
                var c = self.cards[i];
                if (typeof c === 'undefined') {
                    throw new Error('Invalid card index');
                }
                cards.push();
            }, this);
            // then remove them
            _.each(cards, function (i) {
                self.removeCard(self.cards[i]);
            });
            return cards;
        } else {
            var card = self.cards[index];
            self.removeCard(card);
            return card;
        }
    };

    self.numCards = function () {
        return this.cards.length;
    };
};

/**
 * Expose `Cards()`
 */
exports = module.exports = Cards;
