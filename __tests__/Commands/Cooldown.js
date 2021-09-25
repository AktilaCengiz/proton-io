const Command = require("../../src/Structures/Commands/Command");

module.exports = class extends Command {
    constructor() {
        super("Cooldown", {
            aliases: ["cooldown"],
            cooldown: 10000
        });
    }

    execute(msg) {
        msg.channel.send("ok");
    }
};
