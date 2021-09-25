const Command = require("../../src/Structures/Commands/Command");

module.exports = class extends Command {
    constructor() {
        super("Kick", {
            aliases: ["kick"],
            userPermissions: "KICK_MEMBERS",
            clientPermissions: "KICK_MEMBERS"
        });
    }

    execute(msg) {
        msg.channel.send("ok");
    }
};
