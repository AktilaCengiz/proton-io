const CachedManager = require("../Managers/CachedManager");

/**
 * @extends {CachedManager<string, number>}
 */
class CooldownManager extends CachedManager {
    /**
     *
     * @param {number} defaultCooldown
     */
    constructor(defaultCooldown) {
        super();

        this.defaultCooldown = defaultCooldown;
    }

    /**
     * @param {Message} message - Message structure.
     * @param {Command} command - Command structure.
     */
    addToCache(message, command) {
        const cooldownTimeout = command.cooldown ?? this.defaultCooldown;

        if (cooldownTimeout === null)
            return;

        super.register(message.author.id, Date.now() + cooldownTimeout);

        setTimeout(() => this.deregister(message.author.id), cooldownTimeout);
    }

    /**
     *
     * @param {Message} message - Message structure.
     * @param {Command} command - Command structure.
     * @returns
     */
    checkExist(message, command) {
        if (!this.cache.has(message.author.id)) {
            this.addToCache(message, command);
            return false;
        }
        return true;
    }
}

module.exports = CooldownManager;

/**
 * @typedef {import("./Command")} Command
 * @typedef {import("discord.js").Message} Message
 */
