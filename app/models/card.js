var _ = require('underscore');

var Card = function Card(card) {
    var self = this;
    self.id = _.uniqueId();
    self.draw = card.draw || 0;
    self.pick = card.pick || 0;
    self.value = card.value || 'A bug in the mainframe (please file a bug report, if you actually get this card)';
};

/**
 * Expose `Card()`
 */
exports = module.exports = Card;
