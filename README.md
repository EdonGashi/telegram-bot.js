## telegram-bot.js
This app runs a telegram bot on its configured API.

The bot can initially eval code via Telegram messages to the permitted user. By calling `addTextCommand(regex, callback)` custom commands can be specified. To handle other types of messages `setHandler(messageType, callback)` can be called.
