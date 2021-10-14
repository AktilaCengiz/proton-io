/* eslint-disable no-undef */
const ProtonClient = require("../../src/Structures/ProtonClient");
const equal = require("../equal");

const id = "123456789012345678";

test("isOwner string", () => {
    const client = new ProtonClient({
        owners: id,
        intents: []
    });

    equal(client.isOwner(id), false);
    // @ts-ignore
    client.users.cache.set(id, {});
    equal(client.isOwner(id), false);
});

test("isOwner array", () => {
    const client = new ProtonClient({
        owners: [id],
        intents: []
    });

    expect(client.isOwner(id)).toBe(false);
    // @ts-ignore
    client.users.cache.set(id, {});
    equal(client.isOwner(id), false);
    expect(client).toMatchSnapshot();
});
