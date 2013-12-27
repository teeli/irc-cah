var _ = require('underscore'),
    Collection = require('./collection');

var Cards = _.extend(Collection);

// Define model
_.extend(Cards.prototype, {
    getRandom: function () {
        return this.at(Math.round(Math.random() * this.length()));
    }
});

/**
 * Expose `Cards()`
 */
exports = module.exports = Cards;