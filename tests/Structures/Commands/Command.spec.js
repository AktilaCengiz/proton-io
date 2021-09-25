/* eslint-disable no-undef */
const Command = require("../../../src/Structures/Commands/Command");

test("Null props", () => {
    const NullProps = new Command("NullProps");
    expect(NullProps.id).toBe("NullProps");
    expect(NullProps.advancedArgs).toBe(false);
    expect(NullProps.aliases).toBeNull();
    expect(NullProps.args).toBeNull();
    expect(NullProps.clientPermissions).toBeNull();
    expect(NullProps.cooldown).toBeNull();
    expect(NullProps.information).toBeNull();
    expect(NullProps.ownerOnly).toBe(false);
    expect(NullProps.userPermissions).toBeNull();
    expect(NullProps.whereRunning).toBeNull();
    expect(NullProps.executable).toBe(true);
    expect(NullProps).toMatchSnapshot();
});

test("Example", () => {
    const Example = new Command("Example", {
        advancedArgs: true,
        aliases: ["example"],
        args: [],
        clientPermissions: [],
        cooldown: 10000,
        information: {},
        ownerOnly: true,
        whereRunning: "guild",
        userPermissions: []
    });
    expect(Example.id).toBe("Example");
    expect(Example.advancedArgs).toBe(true);
    expect(Example.aliases).toBeInstanceOf(Array);
    expect(Example.args).toStrictEqual([]);
    expect(Example.clientPermissions).toStrictEqual([]);
    expect(Example.cooldown).toBe(10000);
    expect(Example.information).toStrictEqual({});
    expect(Example.ownerOnly).toBe(true);
    expect(Example.userPermissions).toStrictEqual([]);
    expect(Example.whereRunning).toBe("guild");
    expect(Example.executable).toBe(true);
    expect(Example).toMatchSnapshot();
});
