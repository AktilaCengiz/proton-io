const { CommandHandlerEvents } = require("../../Utils/Constants");
const isAsync = require("../../Utils/isAsync");
const ProtonHandler = require("../ProtonHandler");
const AliasManager = require("./AliasManager");
const CooldownManager = require("./Cooldown/CooldownManager");

class CommandHandler extends ProtonHandler {
    /**
     *
     * @param {ProtonClient} client
     * @param {CommandHandlerOptions & ProtonHandlerOptions} options
     */
    constructor(client, options) {
        super(client, options);

        /** @type {(string | PrefixBuilder)!} */
        this.prefix = typeof options.prefix === "string" || typeof options.prefix === "function"
            ? typeof options.prefix === "function"
                ? options.prefix.bind(this)
                : options.prefix
            : "!";

        /** @type {boolean!} */
        this.ignoreSelf = typeof options.ignoreSelf === "boolean"
            ? options.ignoreSelf
            : true;

        /** @type {boolean!} */
        this.ignoreBots = typeof options.ignoreBots === "boolean"
            ? options.ignoreBots
            : true;

        /** @type {number?} */
        this.defaultCooldown = typeof options.defaultCooldown === "number"
            ? options.defaultCooldown
            : null;

        /** @type {number?} */
        this.defaultRateLimit = typeof options.defaultRateLimit === "number"
            ? options.defaultRateLimit
            : null;

        /** @type {boolean!} */
        this.defaultTyping = typeof options.defaultTyping === "boolean"
            ? options.defaultTyping
            : false;

        /** @type {boolean!} */
        this.defaultAdvancedArgs = typeof options.defaultAdvancedArgs === "boolean"
            ? options.defaultAdvancedArgs
            : false;

        /** @type {AliasManager} */
        this.aliasManager = new AliasManager();

        /** @type {CooldownManager} */
        this.cooldownManager = new CooldownManager();

        this.init();
    }

    /**
     *
     * @param {Command} mod - Command
     * @returns {void}
     */
    register(mod) {
        super.register(mod);

        if (typeof mod.aliases === "string" || mod.aliases instanceof Array) {
            if (mod.aliases instanceof Array) {
                for (let i = 0; i < mod.aliases.length; i++)
                    this.aliasManager.register(mod.aliases[i], mod.id);
            } else
                this.aliasManager.register(mod.aliases, mod.id);
        }

        if (typeof mod.cooldown !== "number")
            mod.cooldown = this.defaultCooldown;

        if (typeof mod.rateLimit !== "number")
            mod.rateLimit = this.defaultRateLimit;

        if (typeof mod.typing !== "boolean")
            mod.typing = this.defaultTyping;

        if (typeof mod.advancedArgs !== "boolean")
            mod.advancedArgs = this.defaultAdvancedArgs;
    }

    /**
     *
     * @param {Command} mod - Command
     * @returns {void}
     */
    deregister(mod) {
        super.deregister(mod);

        if (typeof mod.aliases === "string" || mod.aliases instanceof Array) {
            if (mod.aliases instanceof Array) {
                for (let i = 0; i < mod.aliases.length; i++)
                    this.aliasManager.deregister(mod.aliases[i]);
            } else
                this.aliasManager.deregister(mod.aliases);
        }
    }

    init() {
        this.client.once("ready", () => {
            this.client.on("messageCreate", async (message) => {
                if (message.partial) await message.fetch();

                await this.handle(message);
            });
        });
    }

    /**
     *
     * @param {Message} message - Message structure.
     */
    async handle(message) {
        // Ignore bots.
        if (this.ignoreBots && message.author.bot) return;
        // Ignore self.
        if (this.ignoreSelf && message.author.id === this.client.user.id) return;

        /** @type {*} */
        let { prefix } = this;

        // Get prefix.
        if (typeof this.prefix === "function") {
            prefix = isAsync(this.prefix)
                ? await this.prefix(message)
                : this.prefix(message);
        }

        const { isOwner } = {
            isOwner: this.client.isOwner(message.author.id)
        };

        if (typeof prefix !== "string" || !message.content.startsWith(prefix))
            return;

        const { args, command } = this._parse(message, prefix);

        if (!command) return;

        // If not executable, return.
        if (!command.executable) {
            this.emit(CommandHandlerEvents.COMMAND_NOT_EXECUTABLE, message, command);
            return;
        }

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
            this.emit(CommandHandlerEvents.ERROR_AFTER_COMMAND_RUN, error);
        }
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
            const commandCooldowns = this.cooldownManager.init(command);

            // If there is no user in the cache, register it.
            if (!commandCooldowns.cache.has(message.author.id)) {
                commandCooldowns.initState(message.author);

                // Delete from cache after cooldown period.
                setTimeout(() => {
                    commandCooldowns.deregister(message.author.id);

                    // If the command cooldown cache is empty, clear the command's cache from the CooldownManager cache.
                    if (commandCooldowns.cache.size === 0)
                        this.cooldownManager.deregister(command.id);
                }, cooldown).unref();
            }

            // Get the user's cooldown state.
            const userCooldownState = commandCooldowns.cache.get(message.author.id);

            // If the expiry time is not null, the user is on cooldown.
            if (userCooldownState.end !== null) {
                this.emit(CommandHandlerEvents.COOLDOWN, message, command, userCooldownState.end - Date.now());
                return true;
            }

            //
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

    /**
     *
     * @param {Message} message - Message structure.
     * @param {string} prefix - Prefix .
     * @returns {{ args: string[], command?: Command}}
     */
    _parse(message, prefix) {
        // Parse message content.
        const [cmdName, ...args] = message.content.slice(prefix.length).split(/\s/g);

        /** @type {*} */
        const command = this.modules.get(this.aliasManager.cache.get(cmdName));

        if (!command) {
            this.emit(CommandHandlerEvents.COΜMAND_NOT_FOUND, message, cmdName);
            return {
                args,
                command: null
            };
        }
        return {
            args,
            command
        };
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
            this.emit(CommandHandlerEvents.MISSING_PERMISSIONS, message, command, command.userPermissions, command.ownerOnly, false);
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
                this.emit(CommandHandlerEvents.MISSING_PERMISSIONS, message, command, false);
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
                this.emit(CommandHandlerEvents.MISSING_PERMISSIONS, message, command, true);
                return false;
            }
        }

        return true;
    }
}

module.exports = CommandHandler;

/**
 * @typedef {object} CommandHandlerOptions
 * @property {PrefixBuilder} [prefix="!"] - Prefix for commands.
 * @property {boolean} [ignoreSelf=true] - Whether the client should ignore itself.
 * @property {boolean} [ignoreBots=true] - Whether the client ignores bots.
 * @property {number} [defaultCooldown=null] - Default cooldown for commands.
 * @property {number} [defaultRateLimit=null] - Default ratelimit for commands.
 * @property {boolean} [defaultTyping=false] - Whether or not to type during command execution.
 * @property {boolean} [defaultAdvancedArgs=false] - Whether to use the advanced argument system.
 */

/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("./Command")} Command
 * @typedef {import("../ProtonClient")} ProtonClient
 * @typedef {import("../ProtonHandler").ProtonHandlerOptions} ProtonHandlerOptions
 */

/**
 * @typedef {string | string[] | {(message:Message): string | string[] | Promise<string | string[]>}} PrefixBuilder
 */
