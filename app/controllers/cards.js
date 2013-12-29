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
        var card;
        if(c instanceof Card) {
            card = c;
        } else {
            card = new Card(c);
        }
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
            var pickedCards = new Cards();
            // first get all cards
            _.each(index, function (i) {
                var c = self.cards[i];
                if (typeof c === 'undefined') {
                    throw new Error('Invalid card index');
                }
//                cards.push();
                pickedCards.addCard(c);
            }, this);
            // then remove them
            self.cards = _.without.apply(this, _.union([self.cards], pickedCards.cards));
//            _.each(pickedCards, function(card) {
//                self.cards.removeCard(card);
//            }, this);
            console.log('picked cards:');
            console.log(_.pluck(pickedCards.cards, 'id'));
            console.log(_.pluck(pickedCards.cards, 'text'));
            console.log('remaining cards:');
            console.log(_.pluck(self.cards, 'id'));
            console.log(_.pluck(self.cards, 'text'));
            return pickedCards;
        } else {
            var card = self.cards[index];
            self.removeCard(card);
            return card;
        }
    };

    self.getCards = function() {
        return self.cards;
    };

    self.numCards = function () {
        return this.cards.length;
    };
};

/**
 * Expose `Cards()`
 */
exports = module.exports = Cards;
