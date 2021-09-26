const Command = require("../../src/Structures/Commands/Command");

module.exports = class extends Command {
    constructor() {
        super("Typing", {
            aliases: ["typing"],
            typing: true
        });
    }

    execute(msg) {
        msg.channel.send("ok");
    }
};
