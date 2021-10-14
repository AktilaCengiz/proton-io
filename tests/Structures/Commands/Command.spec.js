/* eslint-disable no-undef */
const Command = require("../../../src/Structures/Commands/Command");
const checkEqualKeys = require("../../checkEqualKeys");

test("Null props", () => {
    const NullProps = new Command("NullProps");
    checkEqualKeys(NullProps, {
        id: "NullProps",
        aliases: null,
        clientPermissions: null,
        cooldown: null,
        information: null,
        ownerOnly: false,
        userPermissions: null,
        executable: true
    });
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

    checkEqualKeys(Example, {
        id: "Example",
        cooldown: 10000,
        ownerOnly: true,
        executable: true
    });

    expect(Example.aliases).toStrictEqual(["example"]);
    expect(Example.clientPermissions).toStrictEqual([]);
    expect(Example.information).toStrictEqual({});
    expect(Example.userPermissions).toStrictEqual([]);
    expect(Example).toMatchSnapshot();
});
