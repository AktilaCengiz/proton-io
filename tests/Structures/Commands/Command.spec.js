/* eslint-disable no-undef */
const Command = require("../../../src/Structures/Commands/Command");

test("Null props", () => {
    const NullProps = new Command("NullProps");
    expect(NullProps.id).toBe("NullProps");
    expect(NullProps.aliases).toBeNull();
    expect(NullProps.clientPermissions).toBeNull();
    expect(NullProps.cooldown).toBeNull();
    expect(NullProps.information).toBeNull();
    expect(NullProps.ownerOnly).toBe(false);
    expect(NullProps.userPermissions).toBeNull();
    expect(NullProps.executable).toBe(true);
    expect(NullProps).toMatchSnapshot();
});

test("Example", () => {
    const Example = new Command("Example", {
        aliases: ["example"],
        clientPermissions: [],
        cooldown: 10000,
        information: {},
        ownerOnly: true,
        userPermissions: []
    });
    expect(Example.id).toBe("Example");
    expect(Example.aliases).toBeInstanceOf(Array);
    expect(Example.clientPermissions).toStrictEqual([]);
    expect(Example.cooldown).toBe(10000);
    expect(Example.information).toStrictEqual({});
    expect(Example.ownerOnly).toBe(true);
    expect(Example.userPermissions).toStrictEqual([]);
    expect(Example.executable).toBe(true);
    expect(Example).toMatchSnapshot();
});
