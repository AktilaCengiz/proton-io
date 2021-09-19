const ProtonModule = require("../ProtonModule");

class Command extends ProtonModule {
    constructor(id, options = {}) {
        super(id, options);

        this.aliases = options.aliases instanceof Array
            ? options.aliases
            : [];

        this.ownerOnly = typeof options.aliases === "boolean"
            ? options.ownerOnly
            : false;

        this.advancedArgs = typeof options.advancedArgs === "boolean"
            ? options.advancedArgs
            : false;

        this.cooldown = typeof options.cooldown === "number"
            ? options.cooldown
            : null;

        this.permissions = typeof options.permissions === "array"
            ? options.cooldown
            : null;

        this.information = typeof options.information === "object"
            ? options.information
            : {};

    }
}

module.exports = Command;