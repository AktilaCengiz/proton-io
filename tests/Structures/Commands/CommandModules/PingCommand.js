const Command = require("../../../../src/Structures/Commands/Command");

module.exports = class extends Command {
    constructor() {
        super("Ping", {
            category: "Users"
        });
    }
};
