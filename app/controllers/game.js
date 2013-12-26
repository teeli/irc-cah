exports.start = function (opts) {
    console.log(opts.uid + ' started a game');
};

exports.stop = function (opts) {
    console.log(opts.uid + ' stopped a game');
};

exports.join = function (opts) {
    console.log(opts.uid + ' join a game');
};

exports.quit = function (opts) {
    console.log(opts.uid + ' quit a game');
};

exports.cards = function (opts) {
    console.log(opts.uid + ' checked their cards');
};

exports.play = function (opts) {
    console.log(opts.uid + ' plays: ' + opts.args.toString() + '(' + opts.args.length + ')');
    // check if everyone has played and end the round
};
