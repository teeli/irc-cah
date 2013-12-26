module.exports = function(app) {
    var game = require('../app/controllers/game.js');
    app.cmd('start', '*', game.start);
    app.cmd('stop', 'o', game.stop);
    app.cmd('join', '*', game.join);
    app.cmd('quit', '*', game.quit);
    app.cmd('cards', '*', game.cards);
    app.cmd('play', '*', game.play);

};
