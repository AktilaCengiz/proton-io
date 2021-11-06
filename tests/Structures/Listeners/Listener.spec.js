const Listener = require("../../../src/Structures/Listeners/Listener");
const checkEqualKeys = require("../../checkEqualKeys");

test("done", () => {
    const _ = new Listener("_", {
        emitter: "client",
        event: "ready",
        type: "once"
    });

    checkEqualKeys(_, {
        emitter: "client",
        event: "ready",
        type: "once",
        category: "default",
        client: null,
        handler: null,
        filepath: null
    });

    expect(_).toMatchSnapshot();
});
