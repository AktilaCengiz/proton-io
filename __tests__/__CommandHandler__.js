require("dotenv/config");
const { Intents } = require("discord.js");
const CommandHandler = require("../src/Structures/Commands/CommandHandler");
const ProtonClient = require("../src/Structures/ProtonClient");
const { CommandHandlerEvents } = require("../src/Utils/Constants");

class Client extends ProtonClient {
    constructor() {
        super({
            intents: Object.values(Intents.FLAGS).reduce((p, c) => p + c, 0),
            owners: ["579592668208693260"]
        });

        this.commandHandler = new CommandHandler(this, {
            directory: `${__dirname}/Commands`,
            prefix: "?"
        });

        this.commandHandler.loadAll();
    }
}

const client = new Client();

client.commandHandler.on(CommandHandlerEvents.COMMAND_NOT_EXECUTABLE, (message, command) => {
    message.channel.send("Command is not executable");
});

client.commandHandler.on(CommandHandlerEvents.COΜMAND_NOT_FOUND, (message, cmdName) => {
    message.channel.send(`${cmdName} is not found`);
});

client.commandHandler.on(CommandHandlerEvents.MISSING_PERMISSIONS, (message, command, permissions, ownerOnly, isClient) => {
    if (permissions === null) {
        message.channel.send(`${command.id} is owner only command`);
    } else if (isClient) {
        return message.channel.send(`The client must have the following permissions to run the command: ${permissions instanceof Array ? permissions.join("-") : permissions}\nCommand: ${command.id}`);
    } else {
        return message.channel.send(`You must have the following permissions to run the command: ${permissions instanceof Array ? permissions.join("-") : permissions}\nCommand: ${command.id}`);
    }
});

client.commandHandler.on(CommandHandlerEvents.COOLDOWN, (message, command, remaining) => {
    message.channel.send(`Time remaining to use the command: ${remaining}ms`);
});

client.commandHandler.on(CommandHandlerEvents.ERROR_AFTER_COMMAND_RUN, (err) => {
    console.log(err);
});

client.on("ready", () => {
    console.log("Bot is ready");
});

client.login(process.env.TOKEN);
