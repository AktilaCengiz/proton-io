/* eslint-disable no-undef */
require("dotenv/config");
const CommandHandler = require("../../../src/Structures/Commands/CommandHandler");
const ProtonClient = require("../../../src/Structures/ProtonClient");
const checkEqualKeys = require("../../checkEqualKeys");

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
    checkEqualKeys(commandHandler, {
        prefix: "?",
        defaultCooldown: 10000,
        ignoreBots: true,
    });
    expect(commandHandler).toMatchSnapshot();
});
