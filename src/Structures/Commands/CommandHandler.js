const isAsync = require("../../Utils/isAsync");
const ProtonHandler = require("../ProtonHandler");
const AliasManager = require("./AliasManager");

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
            ? options.prefix
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

        this.aliasManager = new AliasManager();

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

        if (typeof prefix !== "string" || !message.content.startsWith(prefix))
            return;

        // Parse message content.
        const [cmdName, ...args] = message.content.slice(prefix.length).split(/\s/g);

        /** @type {*} */
        const command = this.modules.get(this.aliasManager.cache.get(cmdName));

        if (!command) return;

        // Check if owner specific.
        if (command.ownerOnly && !this.client.isOwner(message.author)) return;

        // Check where to run
        if (typeof command.whereRunning === "string" || typeof command.whereRunning === "function") {
            if (typeof command.whereRunning === "function") {
                const result = isAsync(command.whereRunning)
                    ? await command.whereRunning(message)
                    : command.whereRunning(message);

                if (result !== null)
                    return;
            } else if (command.whereRunning === "guild") {
                if (!message.guild) return;
            } else if (command.whereRunning === "dmChannel") {
                if (message.guild && message.channel.type !== "DM") return;
            }
        }

        // Check member permission(s).
        if (command.userPermissions instanceof Array || typeof command.userPermissions === "string") {
            if (!message.member.permissions.has(command.userPermissions))
                return;
        }

        // Check client permission.
        if (command.clientPermissions instanceof Array || typeof command.clientPermissions === "string") {
            if (!message.guild.me.permissions.has(command.clientPermissions))
                return;
        }

        await command.execute(message);
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
