const CachedManager = require("../../Managers/CachedManager");

/**
 * @extends {CachedManager<string, CooldownState>}
 */
class CommandCooldown extends CachedManager {
    /**
     *
     * @param {User} user - User structure.
     * @returns {this}
     */
    initState(user) {
        if (!this.cache.has(user.id))
            this.register(user.id, {
                usageSize: 0,
                end: null
            });

        return this;
    }
}

module.exports = CommandCooldown;

/**
 * @typedef {object} CooldownState
 * @property {number} usageSize = How many times it used the command (for rateLimit).
 * @property {number} end - End timeout.
 */

/**
 * @typedef {import("discord.js").User} User
 */
