const { EventEmitter } = require("events");
const { CommandRunnerEvents } = require("../../Utils/Constants");
const { isAsync } = require("../../Utils/Types");

class CommandRunner extends EventEmitter {
    /**
     * @param {CommandHandler} handler
     * @param {Command} command
     */
    constructor(handler, command) {
        super();
        /** @type {CommandHandler} */
        this.handler = handler;
        /** @type {Command!} */
        this.command = command;
    }

    /**
     *
     * @param {Message} message
     * @returns
     */
    async tryRun(message) {
        const { command } = this;

        // If not executable, return.
        if (!command.executable) {
            this.emit(CommandRunnerEvents.COMMAND_NOT_EXECUTABLE, message, command);
            return;
        }

        const isOwner = this.handler.client.isOwner(message.author.id);

        // Permissions
        if (!await this._checkPermissions(message, command, { isOwner }))
            return;

        // Cooldown
        if (!isOwner) {
            if (this._handleCooldowns(message, command)) return;
        }

        const { typing } = command;
        try {
            if (typing)
                await message.channel.sendTyping();

            await command.execute(message);
        } catch (error) {
            this.emit(CommandRunnerEvents.ERROR_AFTER_COMMAND_RUN, error);
        }
    }

    /**
     * @param {Message} message - Message structure.
     * @param {Command} command - Command structure.
     * @param {object} others - Other params
     * @returns {Promise<boolean>}
     */
    async _checkPermissions(message, command, { isOwner }) {
        // Check if owner specific.
        if (command.ownerOnly && !isOwner) {
            this.emit(CommandRunnerEvents.MISSING_PERMISSIONS, message, command, false);
            return false;
        }

        // Check member permission(s).
        if (command.userPermissions !== null) {
            let authorized = true;
            if (typeof command.userPermissions === "function") {
                const result = isAsync(command.userPermissions)
                    ? await command.userPermissions(message)
                    : command.userPermissions(message);
                if (result !== null)
                    authorized = false;
            } else if (typeof command.userPermissions === "string" || command.userPermissions instanceof Array) {
                if (!message.member.permissions.has(command.userPermissions))
                    authorized = false;
            }

            if (!authorized) {
                this.emit(CommandRunnerEvents.MISSING_PERMISSIONS, message, command, false);
                return false;
            }
        }

        // Check client permission(s).
        if (command.clientPermissions !== null) {
            let runnable = true;
            if (typeof command.clientPermissions === "function") {
                const result = isAsync(command.clientPermissions)
                    ? await command.clientPermissions(message)
                    : command.clientPermissions(message);
                if (result !== null)
                    runnable = false;
            } else if (typeof command.clientPermissions === "string" || command.clientPermissions instanceof Array) {
                if (!message.guild.me.permissions.has(command.clientPermissions))
                    runnable = false;
            }

            if (!runnable) {
                this.emit(CommandRunnerEvents.MISSING_PERMISSIONS, message, command, true);
                return false;
            }
        }

        return true;
    }

    /**
     * Returns true if the user is on cooldown, otherwise creates a new cooldown cache.
     * @param {Message} message - Message structure.
     * @param {Command} command - Command structure.
     * @returns {boolean}
     */
    _handleCooldowns(message, command) {
        const { rateLimit, cooldown } = command;

        if (cooldown !== null) {
            // Get the command's cooldown cache.
            const commandCooldowns = this.handler.cooldownManager.init(command);

            // If there is no user in the cache, register it.
            if (!commandCooldowns.cache.has(message.author.id)) {
                commandCooldowns.initState(message.author);

                // Delete from cache after cooldown period.
                setTimeout(() => {
                    commandCooldowns.deregister(message.author.id);

                    // If the command cooldown cache is empty, clear the command's cache from the CooldownManager cache.
                    if (commandCooldowns.cache.size === 0)
                        this.handler.cooldownManager.deregister(command.id);
                }, cooldown).unref();
            }

            // Get the user's cooldown state.
            const userCooldownState = commandCooldowns.cache.get(message.author.id);

            // If the expiry time is not null, the user is on cooldown.
            if (userCooldownState.end !== null) {
                this.emit(CommandRunnerEvents.COOLDOWN, message, command, userCooldownState.end - Date.now());
                return true;
            }

            if (rateLimit) {
                userCooldownState.usageSize++;

                // If the usage count exceeds the rateLimit, add the expiry time to the "end" property in the user status.
                if (userCooldownState.usageSize >= rateLimit) {
                    userCooldownState.end = message.createdTimestamp + cooldown;
                }
            }
        }
        return false;
    }
}

module.exports = CommandRunner;

/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("./Command")} Command
 * @typedef {import("./CommandHandler")} CommandHandler
 */
