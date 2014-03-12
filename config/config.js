var fs = require('fs'),
    _ = require('underscore');

// check custom card files
if(!fs.existsSync(__dirname + '/../config/cards/Custom_a.json')) {
    fs.writeFileSync(__dirname + '/../config/cards/Custom_a.json','[]');
}
if(!fs.existsSync(__dirname + '/../config/cards/Custom_q.json')) {
    fs.writeFileSync(__dirname + '/../config/cards/Custom_q.json', '[]');
}

// Load app configuration

module.exports = _.extend(
    require(__dirname + '/../config/env/all.js'),
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.json') || {},
    { cards: {
        questions: _.union(
            require(__dirname + '/../config/cards/OfficialBaseSet_q.json'),
            require(__dirname + '/../config/cards/Official2ndExpansion_q.json'),
            require(__dirname + '/../config/cards/Official3rdExpansion_q.json'),
            require(__dirname + '/../config/cards/OfficialCanadianExpansion_q.json'),
            require(__dirname + '/../config/cards/OfficialChristmasExpansion_q.json'),
            require(__dirname + '/../config/cards/BGG_q.json'),
            require(__dirname + '/../config/cards/OfficialBaseSet_q.json'),
            require(__dirname + '/../config/cards/Custom_q.json') || {}
        ),
        answers: _.union(
            require(__dirname + '/../config/cards/OfficialBaseSet_a.json'),
            require(__dirname + '/../config/cards/Official2ndExpansion_a.json'),
            require(__dirname + '/../config/cards/Official3rdExpansion_a.json'),
            require(__dirname + '/../config/cards/OfficialCanadianExpansion_a.json'),
            require(__dirname + '/../config/cards/OfficialChristmasExpansion_a.json'),
            require(__dirname + '/../config/cards/BGG_a.json'),
            require(__dirname + '/../config/cards/OfficialBaseSet_a.json'),
            require(__dirname + '/../config/cards/Custom_a.json') || {}
        )
    }}
);
