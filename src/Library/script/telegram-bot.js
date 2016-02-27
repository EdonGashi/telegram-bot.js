'use strict';
// ReSharper disable UndeclaredGlobalVariableUsing
const core = require('core');
const cast = require('cast');
const console = require('console');
const botStarter = require('./bot.js');
const messageType = botStarter.messageType;
const config = require('./bot-config.json');

console.log(`Started bot on poll rate ${config.interval}`);

const handlers = {};

handlers[cast.int(messageType.TextMessage)] = require('./textHandler.js');

function getHandler(type) {
    const updateType = cast.int(type);
    return handlers[updateType];
}

function setHandler(type, callback) {
    const updateType = cast.int(type);
    handlers[updateType] = callback;
}

function onUpdate(update, bot) {
    const updateType = cast.int(update.Message.Type);
    const handler = handlers[updateType];
    if (handler) {
        handler(update, bot);
    }
}

const botInfo = botStarter.start(config.key, onUpdate, config.interval);

global.controller = botInfo.controller;
global.bot = botInfo.bot;
global.messageType = messageType;
global.getHandler = getHandler;
global.setHandler = setHandler;
core.sleep();