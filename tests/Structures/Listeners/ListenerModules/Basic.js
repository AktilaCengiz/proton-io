const Listener = require("../../../../src/Structures/Listeners/Listener");

module.exports = class extends Listener {
    constructor() {
        super("Basic", {
            emitter: "client",
            event: "ready",
            type: "once"
        });
    }
}