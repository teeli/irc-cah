/**
 * Cards Against Humanity IRC bot
 * main application script
 * @author Teemu Lahti <teemu.lahti@gmail.com>
 */
console.log('Cards Against Humanity IRC bot');

// Set node env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// dependencies
var bot = require('./app/bot');

// init the bot
bot.init();
// load channel command definitions
require('./config/commands.js')(bot);
