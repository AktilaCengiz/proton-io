/* eslint-disable no-undef */

const ProtonClient = require("../../src/Structures/ProtonClient");
const ProtonHandler = require("../../src/Structures/ProtonHandler");
const ProtonModule = require("../../src/Structures/ProtonModule");

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
        category: "Software"
    });

    const MySecondModule = new ProtonModule("MySecondModule");

    client.handler.register(MyFirstModule, null);
    client.handler.register(MySecondModule, null);

    const registered = client.handler.modules.get("MyFirstModule");
    const registeredSecond = client.handler.modules.get("MySecondModule");

    expect(registered.id).toBe("MyFirstModule");
    expect(registered.category).toBe("Software");
    expect(registered.filepath).toBeNull();
    expect(registered.client).toBe(client);
    expect(registered.handler).toBe(client.handler);
    expect(typeof registered.reload).toBe("function");
    expect(typeof registered.remove).toBe("function");
    expect(registeredSecond.category).toBe("default");
    expect(client.handler.modules.size).toBe(2);
    expect(registered).toMatchSnapshot();
    expect(registeredSecond).toMatchSnapshot();
    registered.remove();
    registeredSecond.remove();
    expect(client.handler.modules.size).toBe(0);
    expect(client.handler.modules.random()).toBeUndefined();
});
