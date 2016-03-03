'use strict';
const timer = require('timer');
const telegram = require('./Telegram.Bot.dll').Telegram.Bot;

function start(api, callback, interval) {
    const bot = new telegram.Api(api);
    var offset = 0;
    function getUpdates() {
        var updates;
        try {
            updates = bot.GetUpdates(offset).Result;
        } catch (err) {
            return;
        }

        const len = updates.Length;
        for (let i = 0; i < len; i++) {
            const update = updates[i];
            callback(update, bot);
            offset = update.Id + 1;
        }
    }

    return { controller: timer.setInterval(getUpdates, interval), bot: bot };
}

exports.telegram = telegram;
exports.start = start;