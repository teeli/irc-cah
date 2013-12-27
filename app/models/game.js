var _ = require('underscore'),
    Model = require('./model');

// Extend model
var Game = _.extend(Model);

// Define model
_.extend(Game.prototype, {
});

/**
 * Expose `Game()`
 */
exports = module.exports = Game;


