var Games = require('../app/controllers/games.js');

module.exports = function(app) {
    var games = new Games();
    app.cmd('start', '', games.start);
    app.cmd('stop', 'o', games.stop);
    app.cmd('join', '', games.join);
    app.cmd('quit', '', games.quit);
    app.cmd('cards', '', games.cards);
    app.cmd('play', '', games.play);
    app.cmd('list', '', games.list);
    app.cmd('winner', '', games.winner);
    app.cmd('points', '', games.points);
};
