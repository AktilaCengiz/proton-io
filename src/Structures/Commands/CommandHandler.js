const ProtonHandler = require("../ProtonHandler");
const AliasManager = require("./AliasManager");
const CooldownManager = require("./Cooldown/CooldownManager");
const {
    isAsync,
    isString,
    isFunction,
    isArray
} = require("../../Utils/Types");
const CommandRunner = require("./CommandRunner");
const { CommandHandlerEvents } = require("../../Utils/Constants");

class CommandHandler extends ProtonHandler {
    /**
     *
     * @param {ProtonClient} client
     * @param {CommandHandlerOptions & ProtonHandlerOptions} options
     */
    constructor(client, options) {
        super(client, options);

        /** @type {(string | string[] | PrefixRouter)!} */
        this.prefix = isString(options.prefix) || isFunction(options.prefix)
            ? isFunction(options.prefix)
                // @ts-ignore
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

        /** @type {(PermissionString | PermissionString[] | PermissionsRouter)?} */
        this.defaultUserPermissions = typeof options.defaultUserPermissions === "string"
            || typeof options.defaultUserPermissions === "function"
            || options.defaultUserPermissions instanceof Array
            ? typeof options.defaultUserPermissions === "function"
                ? options.defaultUserPermissions.bind(this)
                : options.defaultUserPermissions
            : null;

        /** @type {(PermissionString | PermissionString[] | PermissionsRouter)?} */
        this.defaultClientPermissions = typeof options.defaultClientPermissions === "string"
            || typeof options.defaultClientPermissions === "function"
            || options.defaultClientPermissions instanceof Array
            ? typeof options.defaultClientPermissions === "function"
                ? options.defaultClientPermissions.bind(this)
                : options.defaultClientPermissions
            : null;

        /** @type {AliasManager} */
        this.aliasManager = new AliasManager();

        /** @type {CooldownManager} */
        this.cooldownManager = new CooldownManager();

        this.init();
    }

    /**
     *
     * @param {Command} mod - Command
     * @param {string} [filepath]
     * @returns {void}
     */
    register(mod, filepath) {
        super.register(mod, filepath);

        if (typeof mod.aliases === "string" || mod.aliases instanceof Array) {
            if (mod.aliases instanceof Array) {
                for (let i = 0; i < mod.aliases.length; i++)
                    this.aliasManager.register(mod.aliases[i], mod.id);
            } else
                this.aliasManager.register(mod.aliases, mod.id);
        }
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
        if (isFunction(this.prefix)) {
            prefix = isAsync(this.prefix)
                // @ts-ignore
                ? await this.prefix(message)
                // @ts-ignore
                : this.prefix(message);
        } else if (isArray(this.prefix)) {
            // @ts-ignore
            prefix = this.prefix.find((p) => message.content.startsWith(p));
        }

        if (typeof prefix !== "string" || !message.content.startsWith(prefix))
            return;

        const { command } = this._parse(message, prefix);

        if (!command) {
            this.emit(CommandHandlerEvents.COΜMAND_NOT_FOUND, message);
            return;
        }
        const commandRunner = new CommandRunner(this, command);

        commandRunner.tryRun(message);
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
}

module.exports = CommandHandler;

/**
 * @typedef {object} CommandHandlerOptions
 * @property {string | string[] | PrefixRouter} [prefix="!"] - Prefix for commands.
 * @property {boolean} [ignoreSelf=true] - Whether the client should ignore itself.
 * @property {boolean} [ignoreBots=true] - Whether the client ignores bots.
 * @property {number} [defaultCooldown=null] - Default cooldown for commands.
 * @property {number} [defaultRateLimit=null] - Default ratelimit for commands.
 * @property {boolean} [defaultTyping=false] - Whether or not to type during command execution.
 * @property {PermissionString | PermissionString[] | PermissionsRouter} [defaultUserPermissions=null] - Required permission(s) for the user to use the command.
 * @property {PermissionString | PermissionString[] | PermissionsRouter} [defaultClientPermissions=null] - Required client permission(s) for the command.
 */

/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("./Command")} Command
 * @typedef {import("../ProtonClient")} ProtonClient
 * @typedef {import("../ProtonHandler").ProtonHandlerOptions} ProtonHandlerOptions
 * @typedef {import("discord.js").PermissionString} PermissionString
 * @typedef {import("./Command").PermissionsRouter} PermissionsRouter
 */

/**
 * @typedef {{(message:Message): string | string[] | Promise<string | string[]>}} PrefixRouter
 */
