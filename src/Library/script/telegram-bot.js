'use strict';
// ReSharper disable UndeclaredGlobalVariableUsing
const core = require('core');
const cast = require('cast');
const console = require('console');
const botStarter = require('./bot.js');
const telegram = botStarter.telegram;
const messageType = telegram.Types.MessageType;
const config = require('./bot-config.json');
const stdout = require('stdout');
const color = stdout.color;
const stdoutExplore = require('repl').stdoutExplore;

stdout.write('Started bot on poll rate: ');
stdoutExplore(config.interval);
stdout.write('Allowed eval users: ');
stdoutExplore(config.evalUser);
stdout.write('Use ');
stdout.write('addUser(', color.dcyan);
stdout.write('username', color.dgreen);
stdout.write(')', color.dcyan);
stdout.writeln(' to add more users');

if (typeof config.evalUser === 'string') {
    config.evalUser = [config.evalUser];
}

function addUser(username) {
    if (typeof username !== 'string') {
        return 'Username must be a string.';
    }

    if (config.evalUser.find(element => element === username)) {
        return 'User already exists.';
    }

    config.evalUser.push(username);
    stdout.write('Updated users: ');
    stdoutExplore(config.evalUser);
    return `Added eval user ${username}.`;
}

const handlers = {};
handlers[cast.int(messageType.TextMessage)] = require('./textHandler.js');

function getHandler(type) {
    const updateType = cast.int(type);
    return handlers[updateType];
}

function setHandler(type, callback) {
    const updateType = cast.int(type);
    handlers[updateType] = callback;
    return `Added update handler for ${type.ToString()}.`;
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

global.telegram = telegram;
global.messageType = messageType;
global.getHandler = getHandler;
global.setHandler = setHandler;
global.addUser = addUser;
global.users = config.evalUser;
