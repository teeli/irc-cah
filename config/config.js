var _ = require('underscore');

// Load app configuration

module.exports = _.extend(
    require(__dirname + '/../config/env/all.js'),
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.json') || {},
    { cards: {
        blacks: _.union(
            require(__dirname + '/../config/cards/blacks.json'),
            require(__dirname + '/../config/cards/blacks-custom.json') || {}
        ),
        whites: _.union(
            require(__dirname + '/../config/cards/whites.json'),
            require(__dirname + '/../config/cards/whites-custom.json') || {}
        )
    }}
);
