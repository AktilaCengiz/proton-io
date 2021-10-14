/* eslint-disable no-undef */

const ProtonClient = require("../../src/Structures/ProtonClient");
const ProtonHandler = require("../../src/Structures/ProtonHandler");
const ProtonModule = require("../../src/Structures/ProtonModule");
const checkEqualKeys = require("../checkEqualKeys");
const equal = require("../equal");

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

beforeEach(client.handler.removeAll.bind(client.handler));

test("ProtonModule", () => {
    const MyFirstModule = new ProtonModule("MyFirstModule", {
        category: "X"
    });

    const MySecondModule = new ProtonModule("MySecondModule");

    client.handler.register(MyFirstModule, null);
    client.handler.register(MySecondModule, null);

    const registered = client.handler.modules.get("MyFirstModule");
    const registeredSecond = client.handler.modules.get("MySecondModule");

    checkEqualKeys(registered, {
        id: "MyFirstModule",
        category: "X",
        filepath: null,
        client,
        handler: client.handler
    });

    checkEqualKeys(registeredSecond, {
        id: "MySecondModule",
        category: "default",
        filepath: null,
        client,
        handler: client.handler
    });
    registered.remove();
    registeredSecond.remove();
    equal(client.handler.modules.size, 0);
    equal(client.handler.modules.random(), undefined);
});
