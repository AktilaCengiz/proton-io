/* eslint-disable no-undef */

const ProtonClient = require("../../src/Structures/ProtonClient");
const ProtonHandler = require("../../src/Structures/ProtonHandler");
const ProtonModule = require("../../src/Structures/ProtonModule");
const checkEqualKeys = require("../checkEqualKeys");

class Client extends ProtonClient {
    constructor() {
        super({
            intents: []
        });

        this.handler = new ProtonHandler(this, {
            directory: ""
        });
    }
}

const client = new Client();

test("properties", () => {
    const mod = new ProtonModule("Mod");
    checkEqualKeys(mod, {
        id: "Mod",
        category: "default",
        filepath: null,
        client: null,
        handler: null
    });
    client.handler.register(mod, null);
    checkEqualKeys(mod, {
        client,
        handler: client.handler
    });
    expect(mod).toMatchSnapshot();
});
