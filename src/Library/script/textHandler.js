'use strict';
const evalUser = require('./bot-config.json').evalUser;
const repl = require('repl');
const StringWriter = require('StringWriter');
const writer = new StringWriter();
const explore = require('explore').create(writer, {});

const textCommands = [];

function isValidEvalUser(user) {
    if (evalUser) {
        if (typeof evalUser === 'string') {
            return user === evalUser;
        } else {
            return evalUser.find(element => element === user);
        }
    } else return false;
}

function onTextUpdate(update, bot) {
    const text = update.Message.Text;
    function reply(msg) {
        try {
            bot.SendTextMessage(update.Message.Chat.Id, msg);
        } catch (err) {
            // ignored
        }
    }

    const len = textCommands.length;
    for (let i = 0; i < len; i++) {
        const command = textCommands[i];
        const regex = command.regex;
        const match = text.match(regex);
        if (match) {
            command.callback(text, reply, match, update, bot);
            return;
        }
    }

    if (text[0] === '/' || text[0] === '@') {
        return;
    }

    if (isValidEvalUser(update.Message.From.Username)) {
        repl.evaluate(text, function (result) {
            writer.clear();
            explore(result);
            reply(writer.getText());
        }, reply);
    }
}

function addTextCommand(regex, callback) {
    textCommands.push({ regex: regex, callback: callback });
    return `Added text command with pattern ${regex.toString()}`;
}

addTextCommand(/^\/eval (.+)/, function (msg, reply, match, update) {
    if (isValidEvalUser(update.Message.From.Username)) {
        const code = match[1];
        repl.evaluate(code, function (result) {
            writer.clear();
            explore(result);
            reply(writer.getText());
        }, reply);
    }
});

global.textCommands = textCommands;
global.addTextCommand = addTextCommand;
module.exports = onTextUpdate;