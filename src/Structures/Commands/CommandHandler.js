const { CommandHandlerEvents } = require("../../Utils/Constants");
const isAsync = require("../../Utils/isAsync");
const ProtonHandler = require("../ProtonHandler");
const AliasManager = require("./AliasManager");
const CooldownManager = require("./CooldownManager");

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

        /** @type {boolean} */
        this.ignoreSelf = typeof options.ignoreSelf === "boolean"
            ? options.ignoreSelf
            : true;

        /** @type {boolean} */
        this.ignoreBots = typeof options.ignoreBots === "boolean"
            ? options.ignoreBots
            : true;

        /** @type {number?} */
        this.defaultCooldown = typeof options.defaultCooldown === "number"
            ? options.defaultCooldown
            : null;

        /** @type {AliasManager} */
        this.aliasManager = new AliasManager();

        /** @type {CooldownManager} */
        this.cooldownManager = new CooldownManager(this.defaultCooldown);

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
        if (!this._checkPermissions(message, command, { isOwner }))
            return;

        // Cooldown
        if (!isOwner) {
            // The command's cooldown cache.
            const commandCooldown = this.cooldownManager.cache.get(command.id);

            // If not exist, register
            if (!commandCooldown) {
                this.cooldownManager.add(message, command);
            } else if (commandCooldown.cache.has(message.author.id)) {
                // Remaining time.
                const remaining = commandCooldown.cache.get(message.author.id) - Date.now();
                this.emit(CommandHandlerEvents.COOLDOWN, message, command, remaining);
                return;
            }
        }
        await command.execute(message);
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
     * @returns {boolean}
     */
    _checkPermissions(message, command, others) {
        // Check if owner specific.
        if (command.ownerOnly && others.isOwner) {
            this.emit(CommandHandlerEvents.MISSING_PERMISSIONS, message, command, command.userPermissions, command.ownerOnly, false);
            return false;
        }

        // Check member permission(s).
        if (command.userPermissions instanceof Array || typeof command.userPermissions === "string") {
            if (!message.member.permissions.has(command.userPermissions)) {
                this.emit(CommandHandlerEvents.MISSING_PERMISSIONS, message, command, command.userPermissions, command.ownerOnly, false);
                return false;
            }
        }

        // Check client permission.
        if (command.clientPermissions instanceof Array || typeof command.clientPermissions === "string") {
            if (!message.guild.me.permissions.has(command.clientPermissions)) {
                this.emit(CommandHandlerEvents.MISSING_PERMISSIONS, message, command, command.userPermissions, command.ownerOnly, true);
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
