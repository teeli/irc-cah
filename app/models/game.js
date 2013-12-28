var _ = require('underscore'),
    Backbone = require('backbone'),
    Cards = require('../collections/cards'),
    Players = require('../collections/players');

// Extend model
var Game = Backbone.Model.extend({
    defaults:     {
        channel:      "",
        currentRound: 0,
        players:      new Players(),
        whiteDeck:    new Cards(),
        blackDeck:    new Cards()
    },
    initialize:   function (attr) {
        console.log('init game');
        this.set({
            whiteDiscard: new Cards(),
            blackDiscard: new Cards(),
            whiteTable:   new Cards(),
            blackTable:   new Cards()
        });
        console.log('Decks:');
        console.log(this.get('blackDeck').length);
        console.log(this.get('whiteDeck').length);
    },
    shuffleDecks: function () {
        // shuffle
        this.get('whiteDeck').shuffleDeck();
        this.get('blackDeck').shuffleDeck();
    },
    // deal cards for all players
    deal:         function () {
        var blackDeck = this.get('blackDeck'),
            players = this.get('players');

        players.forEach(function (player) {
            var cards = player.get('cards');
            console.log(player.get('nick') + '(' + player.get('hostname') + ') has ' + cards.length + ' cards. Dealing ' + (8 - cards.length) + ' cards');
            for (var i = cards.length; i < 8; i++) {
                var card = blackDeck.first();
                blackDeck.remove(card);
                cards.add(card);
                card.set({owner: player});
            }
        }, this);
    },
    // clean table & put cards to discard decks
    clean:        function () {
        var blackTable = this.get('blackTable'),
            whiteTable = this.get('whiteTable'),
            blackDiscard = this.get('blackDiscard'),
            whiteDiscard = this.get('whiteDiscard');

        blackTable.each(function(c) {
            blackDiscard.add(c);
        });
        blackTable.reset();
        whiteTable.each(function (c) {
            whiteDiscard.add(c);
        });
        whiteTable.reset();
    },
    // select next czar
    nextCzar:     function () {
        var players = this.get('players');
        if (players.length === 0) {
            return false;
        }
        var nextCzar = players.at(players.indexOf(players.findWhere({czar: true})) + 1 || 0) || players.first();
        players.invoke('set', {czar: false});
        nextCzar.set({czar: true});
        return nextCzar;
    },
    // new card from deck to table
    newCard:      function () {
        var deck = this.get('whiteDeck'),
            table = this.get('whiteTable'),
            card = deck.first();
        deck.remove(card);
        table.add(card);
        return card;
    },
    // play card from players hand
    // TODO: This should probably be in player object
    playCard:     function (card) {
        var table = this.get('blackTable'),
            players = this.get('players'),
            player = card.get('owner'),
            handCards = player.get('cards');
        handCards.remove(card);
        table.add(card);
        player.set({played: true});
        // check if all players played
        if (players.where({played: false, czar: false}).length === 0) {
            console.log('all played');
            this.trigger('allPlayed');
        }
    },
    getResults:   function () {
        var blackTable = this.get('blackTable'),
            whiteTable = this.get('whiteTable'),
            players = this.get('players'),
            whiteCard = whiteTable.first();

        return {
            blacks: blackTable,
            white:  whiteCard
        };
    },
    setWinner:    function (winnerIndex) {
        var blackTable = this.get('blackTable'),
            winnerCard = blackTable.at(winnerIndex);
        if(typeof winnerCard === 'undefined') {
            return undefined;
        }

        var winnerPlayer = winnerCard.get('owner');
        winnerPlayer.addPoint();
        return winnerPlayer;
    },
    nextRound: function() {
        this.set('currentRound', this.get('currentRound') + 1);
        // clean table
        this.clean();
        // reset played status
        this.get('players').invoke('set', {played: false});
        this.trigger('roundComplete');
    }
});

/**
 * Expose `Game()`
 */
exports = module.exports = Game;
