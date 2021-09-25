const Command = require("../../src/Structures/Commands/Command");

module.exports = class extends Command {
    constructor() {
        super("Ping", {
            aliases: ["ping"]
        });
    }

    execute(msg) {
        msg.channel.send("ok");
    }
};
