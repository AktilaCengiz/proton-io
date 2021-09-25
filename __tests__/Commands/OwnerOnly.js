const Command = require("../../src/Structures/Commands/Command");

module.exports = class extends Command {
    constructor() {
        super("OwnerOnly", {
            aliases: ["owner-only"],
            ownerOnly: true
        });
    }

    execute(msg) {
        msg.channel.send("ok");
    }
};
