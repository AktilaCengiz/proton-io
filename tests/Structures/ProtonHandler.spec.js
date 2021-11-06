/* eslint-disable no-undef */
/* eslint-disable max-classes-per-file */
const { Collection } = require("discord.js");
const ProtonClient = require("../../src/Structures/ProtonClient");
const ProtonHandler = require("../../src/Structures/ProtonHandler");
const checkEqualKeys = require("../checkEqualKeys");
const equal = require("../equal");

const moduleDir = `${process.cwd()}/tests/Structures/Modules`;

class Client extends ProtonClient {
    constructor() {
        super({
            intents: []
        });

        this.handler = new ProtonHandler(this, {
            directory: moduleDir,
            automateCategories: true
        });
    }
}

const client = new Client();

test("properties", () => {
    checkEqualKeys(client.handler, {
        automateCategories: true,
        directory: moduleDir,
        client
    });
    expect(client.handler.modules).toBeInstanceOf(Collection);
    expect(client.handler).toMatchSnapshot();
});

test("load modules", () => {
    equal(client.handler.modules.size, 0);
    client.handler.loadAll();
    expect(client.handler.modules.size).toBeGreaterThan(0);
    client.handler.removeAll();
    equal(client.handler.modules.size, 0);
});
