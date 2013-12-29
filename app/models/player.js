var _ = require('underscore'),
    Cards = require('../controllers/cards');

var Player = function Player(nick, hostname) {
    var self = this;
    self.id = _.uniqueId();
    self.nick = nick;
    self.hostname = hostname;
    self.cards = new Cards();
    self.played = false;
    self.czar = false;
    self.points = 0;
};

/**
 * Expose `Player()`
 */
exports = module.exports = Player;
