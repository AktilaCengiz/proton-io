const CachedManager = require("../Managers/CachedManager");

/**
 * @extends {CachedManager<string, CachedManager>}
 */
class CooldownManager extends CachedManager {
    /**
     *
     * @param {Message} message - Message structure.
     * @param {Command} command - Command structure.
     */
    add(message, command) {
        const { cooldown } = command;

        if (cooldown === null)
            return;

        /** @type {CachedManager<string, number>} */
        const commandCooldownCache = new CachedManager();
        commandCooldownCache.register(message.author.id, Date.now() + cooldown);

        super.register(command.id, commandCooldownCache);

        setTimeout(() => {
            commandCooldownCache.deregister(message.author.id);

            if (commandCooldownCache.cache.size === 0)
                super.deregister(command.id);
        }, cooldown);
    }
}

module.exports = CooldownManager;

/**
 * @typedef {import("./Command")} Command
 * @typedef {import("discord.js").Message} Message
 */
