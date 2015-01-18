/**
 * Cards Against Humanity IRC bot
 * main application script
 * @author Teemu Lahti <teemu.lahti@gmail.com>
 * @version 0.6.0
 */
console.log('Cards Against Humanity IRC bot');

// Set node env
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// dependencies
var bot = require('./app/bot');

// init the bot
bot.init();
// load channel command definitions
require('./config/commands.js')(bot);
