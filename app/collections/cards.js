var _ = require('underscore'),
    Backbone = require('backbone'),
    Card = require('../models/card');

var Cards = Backbone.Collection.extend({
    model:       Card,
    shuffleDeck: function () {
        this.reset(this.shuffle(), {silent: true});
    }
});

/**
 * Expose `Cards()`
 */
exports = module.exports = Cards;
