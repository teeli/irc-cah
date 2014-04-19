var fs = require('fs'),
    JaySchema = require('jayschema'),
    _ = require('underscore');

/**
 * Load and validate a card file
 * @param identifier Identifier of the card file
 * @param filename Filename of the card file
 */
function loadCardFile(identifier, filename) {
    console.log('Loading ' + identifier + ': ' + filename);
    if (fs.existsSync(filename)) {
        var data = require(filename);
        validator.validate(data, schema, function (errors) {
            if (errors) {
                console.error(identifier + ': Validation error');
                console.error(errors);
            } else {
                console.log(identifier + ': Validation OK!');
                config.cards = _.union(config.cards, data);
            }
        });
    } else {
        console.error('File does not exists');
    }
}

// Initialize base configuration and ENV
var config = _.extend(
    require(__dirname + '/../config/env/all.js'),
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.json') || {},
    { cards: [] }
);

// check custom card files and create them if they don't exist
if (!fs.existsSync(__dirname + '/../config/cards/Custom_a.json')) {
    fs.writeFileSync(__dirname + '/../config/cards/Custom_a.json', '[]');
}
if (!fs.existsSync(__dirname + '/../config/cards/Custom_q.json')) {
    fs.writeFileSync(__dirname + '/../config/cards/Custom_q.json', '[]');
}

// All card file paths. You can comment out the ones you don't want to use.
var cardFiles = {
    OfficialBaseSetQuestions: __dirname + '/../config/cards/OfficialBaseSet_q.json',
    OfficialBaseSetAmericaQuestions: __dirname + '/../config/cards/OfficialBaseSetAmerica_q.json',
    Official2ndExpansionQuestions: __dirname + '/../config/cards/Official2ndExpansion_q.json',
    Official2ndExpansionAmericaQuestions: __dirname + '/../config/cards/Official2ndExpansionAmerica_q.json',
    Official3rdExpansionQuestions: __dirname + '/../config/cards/Official3rdExpansion_q.json',
    Official3rdExpansionAmericaQuestions: __dirname + '/../config/cards/Official3rdExpansionAmerica_q.json',
    OfficialCanadianExpansionQuestions: __dirname + '/../config/cards/OfficialCanadianExpansion_q.json',
    OfficialChristmasExpansionQuestions: __dirname + '/../config/cards/OfficialChristmasExpansion_q.json',
    BGGQuestions: __dirname + '/../config/cards/BGG_q.json',
    BGGAmericaQuestions: __dirname + '/../config/cards/BGGAmerica_q.json',
    CustomQuestions: __dirname + '/../config/cards/Custom_q.json',
    OfficialBaseSetAnswers: __dirname + '/../config/cards/OfficialBaseSet_a.json',
    OfficialBaseSetAmericaAnswers: __dirname + '/../config/cards/OfficialBaseSetAmerica_a.json',
    Official2ndExpansionAnswers: __dirname + '/../config/cards/Official2ndExpansion_a.json',
    Official2ndExpansionAmericaAnswers: __dirname + '/../config/cards/Official2ndExpansionAmerica_a.json',
    Official3rdExpansionAnswers: __dirname + '/../config/cards/Official3rdExpansion_a.json',
    Official3rdExpansionAmericaAnswers: __dirname + '/../config/cards/Official3rdExpansionAmerica_a.json',
    OfficialCanadianExpansionAnswers: __dirname + '/../config/cards/OfficialCanadianExpansion_a.json',
    OfficialChristmasExpansionAnswers: __dirname + '/../config/cards/OfficialChristmasExpansion_a.json',
    BGGAnswers: __dirname + '/../config/cards/BGG_a.json',
    CustomAnswers: __dirname + '/../config/cards/Custom_a.json'
};

// Init validator
var validator = new JaySchema();
// Define schema to calidate against
var schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "Card Schema",
    "type": "array",
    "items": {
        "title": "Single card",
        "type": "object",
        "properties": {
            "type": {
                "description": "Type of the card (question or answer",
                "type": "string"
            },
            "value": {
                "description": "The text value of the card",
                "type": "string"
            },
            "keep": {
                "type": "string"
            },
            "draw": {
                "description": "Amount of cards that should be drawn from the deck when this card is in play",
                "type": "integer"
            },
            "pick": {
                "description": "Amount of cards that should be picked from the hand when this card is in play",
                "type": "integer"
            },
            "source": {
                "description": "Source of the card (e.g. expansion, community etc)",
                "type": "string"
            }
        },
        "required": ["value", "type", "pick", "draw"]
    }
};


// Validate and load cards files
console.log('Loading card data...');
for (var i in cardFiles) {
    if (cardFiles.hasOwnProperty(i)) {
        loadCardFile(i, cardFiles[i]);
    }
}

module.exports = config;
