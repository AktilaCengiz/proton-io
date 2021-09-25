const Command = require("../../src/Structures/Commands/Command");

module.exports = class extends Command {
    constructor() {
        super("Say", {
            aliases: ["say"],
            executable: false
        });
    }

    execute(msg) {
        msg.channel.send("ok");
    }
};
