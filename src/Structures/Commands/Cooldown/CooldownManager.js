/* eslint-disable class-methods-use-this */
const CachedManager = require("../../Managers/CachedManager");
const CommandCooldown = require("./CommandCooldown");

/**
 * @extends {CachedManager<string, CommandCooldown>}
 */
class CooldownManager extends CachedManager {
    /**
     * Creates a command cooldown cache for the cooldown system.
     * @param {Command} command - Command structure.
     * @returns {CommandCooldown}
     */
    init(command) {
        const commandCooldown = this.cache.get(command.id) ?? new CommandCooldown();
        this.register(command.id, commandCooldown);
        return commandCooldown;
    }
}

module.exports = CooldownManager;

/**
 * @typedef {import("../Command")} Command
 * @typedef {import("discord.js").User} User
 */
