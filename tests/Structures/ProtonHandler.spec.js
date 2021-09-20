/* eslint-disable no-undef */
/* eslint-disable max-classes-per-file */
const ProtonClient = require("../../src/Structures/ProtonClient");
const ProtonHandler = require("../../src/Structures/ProtonHandler");
const ProtonModule = require("../../src/Structures/ProtonModule");

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
            super("LocalModule");
        }
    }

    const loaded = client.handler.load(LocalModule);

    expect(loaded.category).toBe("default");
    expect(loaded.client).toBe(client);
    expect(loaded.handler).toBe(client.handler);
    expect(loaded.filepath).toBeNull();
    expect(loaded.id).toBe("LocalModule");

    const loadedSec = client.handler.load(`${moduleDir}/ExampleModule`);

    expect(loadedSec.category).toBe("Modules");
    expect(loadedSec.client).toBe(client);
    expect(loadedSec.handler).toBe(client.handler);
    expect(typeof loadedSec.filepath).toBe("string");
    expect(loadedSec.id).toBe("ExampleModule");
});

test("loadAll", () => {
    expect(client.handler.modules.size).toBe(0);
    client.handler.loadAll();
    expect(client.handler.modules.size).toBeGreaterThanOrEqual(1);
});

test("remove", () => {
    client.handler.loadAll();
    expect(client.handler.modules.size).toBe(1);
    client.handler.remove(client.handler.modules.first()?.id);
    expect(client.handler.modules.size).toBe(0);
});
