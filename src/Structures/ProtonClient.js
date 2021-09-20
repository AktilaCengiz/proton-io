const { Client } = require("discord.js");

class ProtonClient extends Client {
    /**
     *
     * @param {ProtonClientOptions & ClientOptions} options - Options for the ProtonClient.
     * @param {ClientOptions} clientOptions - Options for the discord.js Client.
     */
    constructor(options, clientOptions) {
        super({ ...options, ...clientOptions });

        this.owners = options.owners instanceof Array
            ? options.owners
            : [];
    }

    /**
     * Returns whether the specified person is the owner of the bot.
     * @param {UserResolvable} resolvable - User or User id
     * @returns {boolean}
     */
    isOwner(resolvable) {
        const user = this.users.resolve(resolvable);

        if (!user) return false;

        return typeof this.owners === "string"
            ? this.owners === user.id
            : this.owners.includes(user.id);
    }
}

module.exports = ProtonClient;

/**
 * @typedef {object} ProtonClientOptions
 * @property {string|string[]} [owners=[]] - Owner(s) of the client.
 */

/**
 * @typedef {import("discord.js").ClientOptions} ClientOptions
 * @typedef {import("discord.js").UserResolvable} UserResolvable
 */
