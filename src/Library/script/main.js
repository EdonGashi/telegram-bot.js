require('./telegram-bot.js');
global.console = require('console');
console.log('\nType commands below or message the bot via Telegram:');
require('core').sleep();

// Define custom handlers or text handlers below

// For text commands use addTextCommand(regex, callback)
// where callback(text, reply, match, update, bot);
// text = message text
// reply = function to reply to sender
// match = regex matches on command
// update = full update object
// bot = bot API object

addTextCommand(/^\/hello$/i, function (text, reply, match, update, bot) {
    reply('Hello!');
});
