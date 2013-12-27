var _ = require('underscore'),
    Model = require('./model');

// Extend model
var Card = _.extend(Model);

// Define model
_.extend(Card.prototype, {
});

/**
 * Expose `Card()`
 */
exports = module.exports = Card;


