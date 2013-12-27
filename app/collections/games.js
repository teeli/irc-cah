var _ = require('underscore'),
    Backbone = require('backbone'),
    Game = require('../models/game');

var Games = Backbone.Collection.extend({
    model: Game
});

/**
 * Expose `Games()`
 */
exports = module.exports = Games;