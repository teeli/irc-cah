// import modules
var _ = require('underscore'),
    game = require('../models/game'),
    games = require('../collections/games'),
    Cards = require('../collections/cards'),
    Card = require('../models/card'),
    player = require('../models/player');

var haiku = { // TODO: Implement haiku round that ends the game
    "draw": 2,
    "pick": 3,
    "text": "(Draw 2, Pick 3) Make a haiku."
};

exports.start = function (client, opts) {
    console.log(opts.uid + ' started a game');
    var whiteCards = new Cards(opts.config.cards.whites);
    var blackCards = new Cards(opts.config.cards.blacks);
    client.say(opts.to, whiteCards.getRandom().get('text'));
};

exports.stop = function (client, opts) {
    console.log(opts.uid + ' stopped a game');
};

exports.join = function (client, opts) {
    console.log(opts.uid + ' join a game');
};

exports.quit = function (client, opts) {
    console.log(opts.uid + ' quit a game');
};

exports.cards = function (client, opts) {
    console.log(opts.uid + ' checked their cards');
};

exports.play = function (client, opts) {
    console.log(opts.uid + ' plays: ' + opts.args.toString() + '(' + opts.args.length + ')');
    // check if everyone has played and end the round
};
