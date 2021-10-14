/* eslint-disable no-undef */
/* eslint-disable max-classes-per-file */
const ProtonClient = require("../../src/Structures/ProtonClient");
const ProtonHandler = require("../../src/Structures/ProtonHandler");
const ProtonModule = require("../../src/Structures/ProtonModule");
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

beforeEach(() => client.handler.removeAll() /** Nice work */);

test("load", () => {
    class LocalModule extends ProtonModule {
        constructor() {
            super("A");
        }
    }

    const loaded = client.handler.load(LocalModule);

    checkEqualKeys(loaded, {
        id: "A",
        category: "default",
        filepath: null,
        client,
        handler: client.handler
    });
    const loadedSec = client.handler.load(`${moduleDir}/ExampleModule`);

    checkEqualKeys(loadedSec, {
        id: "ExampleModule",
        category: "Modules",
        client,
        handler: client.handler
    });

    equal(typeof loadedSec.filepath, "string");
    expect(client.handler).toMatchSnapshot();
});

test("loadAll", () => {
    equal(client.handler.modules.size, 0);
    client.handler.loadAll();
    expect(client.handler.modules.size).toBeGreaterThanOrEqual(1);
});

test("remove", () => {
    client.handler.loadAll();
    equal(client.handler.modules.size, 1);
    client.handler.remove(client.handler.modules.first()?.id);
    equal(client.handler.modules.size, 0);
});
