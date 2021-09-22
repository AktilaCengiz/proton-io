/* eslint-disable no-undef */
require("dotenv/config");
const CommandHandler = require("../../../src/Structures/Commands/CommandHandler");
const ProtonClient = require("../../../src/Structures/ProtonClient");

const directory = `${__dirname}/CommandModules`;

const client = new ProtonClient({
    intents: []
});

test("properties", () => {
    const commandHandler = new CommandHandler(client, {
        automateCategories: true,
        defaultCooldown: 10000,
        ignoreBots: true,
        ignoreSelf: true,
        prefix: "?",
        directory
    });
    commandHandler.loadAll();

    expect(commandHandler.prefix).toBe("?");
    expect(commandHandler.defaultCooldown).toBe(10000);
    expect(commandHandler.ignoreBots).toBe(true);
    expect(commandHandler.ignoreBots).toBe(true);
    expect(commandHandler.modules.first().category).toBe("Users");
    expect(commandHandler).toMatchSnapshot();
});
