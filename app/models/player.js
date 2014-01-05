var _ = require('underscore'),
    Cards = require('../controllers/cards');

var Player = function Player(nick, hostname) {
    var self = this;
    self.id = _.uniqueId();
    self.nick = nick;
    self.hostname = hostname;
    self.cards = new Cards();
    self.hasPlayed = false;
    self.isCzar = false;
    self.points = 0;
    self.inactiveRounds = 0;
};

/**
 * Expose `Player()`
 */
exports = module.exports = Player;
