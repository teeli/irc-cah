var _ = require('underscore'),
    Backbone = require('backbone'),
    Cards = require('../collections/cards');

// Extend model
var Player = Backbone.Model.extend({
    defaults:   {
        nick:   'unknown player',
        czar:   false,
        played: false,
        points: 0
    },
    initialize: function () {
        console.log('Initialize player ' + this.get('nick'));
        this.set({
            cards: new Cards()
        });
    },
    addPoint: function() {
        this.set('points', this.get('points') + 1);
    }
});

/**
 * Expose `Player()`
 */
exports = module.exports = Player;


