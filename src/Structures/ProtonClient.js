const { Client } = require("discord.js");

class ProtonClient extends Client {
    constructor(options, clientOptions) {
        super(clientOptions);

        this.owners = options.owners instanceof Array
            ? options.owners
            : [];
    }

    isOwner(resolvable) {
        const user = this.users.resolve(resolvable);

        if (!user) return false;

        return typeof this.owners === "string"
            ? this.owners === user.id
            : this.owners.includes(user.id);
    }
}

module.exports = ProtonClient;
