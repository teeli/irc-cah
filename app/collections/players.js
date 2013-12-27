var _ = require('underscore'),
    Backbone = require('backbone'),
    Player = require('../models/player');

var Players = Backbone.Collection.extend({
    model: Player
});

/**
 * Expose `Players()`
 */
exports = module.exports = Players;
