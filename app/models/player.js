var _ = require('underscore'),
    Backbone = require('backbone'),
    Cards = require('../collections/cards');

// Extend model
var Player = Backbone.Model.extend({
    defaults: {
        nick:  'unknown player',
        cards: new Cards()
    }
});

/**
 * Expose `Player()`
 */
exports = module.exports = Player;


