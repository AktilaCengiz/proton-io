/* eslint-disable no-undef */
const ProtonClient = require("../../src/Structures/ProtonClient");

const id = "123456789012345678";

test("isOwner string", () => {
    const client = new ProtonClient({
        owners: id,
        intents: []
    });

    expect(client.isOwner(id)).toBe(false);
    // @ts-ignore
    client.users.cache.set(id, {});
    expect(client.isOwner(id)).toBe(false);
});

test("isOwner array", () => {
    const client = new ProtonClient({
        owners: [id],
        intents: []
    });

    expect(client.isOwner(id)).toBe(false);
    // @ts-ignore
    client.users.cache.set(id, {});
    expect(client.isOwner(id)).toBe(false);
});
