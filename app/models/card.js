var _ = require('underscore'),
    Backbone = require('backbone');

// Extend model
var Card = Backbone.Model.extend({
    defaults: {
        draw: 0,
        pick: 0,
        text: 'A bug in the mainframe (please file a bug report, if you actually get this card)'
    }
});

/**
 * Expose `Card()`
 */
exports = module.exports = Card;


