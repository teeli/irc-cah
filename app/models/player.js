var _ = require('underscore'),
    Model = require('./model');

// Extend model
var Player = _.extend(Model);

// Define model
_.extend(Player.prototype, {
    defaults: {
        name: 'unknown player'
    }
});

/**
 * Expose `Player()`
 */
exports = module.exports = Player;


