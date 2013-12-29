var _ = require('underscore'),
    irc = require('irc'),
    config = require('../config/config'),
    client,
    commands = [],
    msgs = [];

function checkUserMode(message, mode) {
    return true;
}

/**
 * Initialize the bot
 */
exports.init = function() {
    console.log('Initializing...');
    // init irc client
    console.log('Connecting to ' + config.server + ' as ' + config.nick + '...');
    client = new irc.Client(config.server, config.nick, config.clientOptions);

    // handle connection to server for logging
    client.addListener('registered', function (message) {
        console.log('Connected to server ' + message.server);
    });

    // handle joins to channels for logging
    client.addListener('join', function (channel, nick, message) {
        console.log('Joined ' + channel + ' as ' + nick);
    });

    // handle errors
    client.addListener('error', function (message) {
        console.log('error: ', message);
    });

    client.addListener('message', function (from, to, text, message) {
        console.log('message from ' + from + ' to ' + to + ': ' + text);
        // parse command
        var cmdArr = text.match(/^[\.|!](\w+)\s?(.*)$/);
        if (!cmdArr || cmdArr.length <= 1) {
            // command not found
            return false;
        }
        var cmd = cmdArr[1];
        // parse arguments
        var cmdArgs = [];
        if (cmdArr.length > 2) {
            cmdArgs = _.map(cmdArr[2].match(/(\w+)\s?/gi), function (str) {
                return str.trim();
            });
        }
        // build callback options

        if (config.clientOptions.channels.indexOf(to) >= 0) {
            // public commands
            _.each(commands, function (c) {
                if (cmd === c.cmd) {
                    console.log('command: ' + c.cmd);
                    // check user mode
                    if (checkUserMode(message, c.mode)) {
                        c.callback(client, message, cmdArgs);
                    }
                }
            }, this);
        } else if (config.nick === to) {
            // private message commands
            _.each(msgs, function (c) {
                if (cmd === c.cmd) {
                    console.log('command: ' + c.cmd);
                    // check user mode
                    if (checkUserMode(message, c.mode)) {
                        c.callback(client, message, cmdArgs);
                    }
                }
            }, this);
        }
    });
};

/**
 * Add a public command to the bot
 * @param cmd Command keyword
 * @param mode User mode that is allowed
 * @param cb Callback function
 */
exports.cmd = function (cmd, mode, cb) {
    commands.push({
        cmd:      cmd,
        mode:     mode,
        callback: cb
    });
};

/**
 * Add a msg command to the bot
 * @param cmd Command keyword
 * @param mode User mode that is allowed
 * @param cb Callback function
 */
exports.msg = function (cmd, mode, cb) {
    msgs.push({
        cmd:      cmd,
        mode:     mode,
        callback: cb
    });
};
