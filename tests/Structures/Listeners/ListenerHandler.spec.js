const { EventEmitter } = require("events");
const Listener = require("../../../src/Structures/Listeners/Listener");
const ListenerHandler = require("../../../src/Structures/Listeners/ListenerHandler");
const ProtonClient = require("../../../src/Structures/ProtonClient");
const checkEqualKeys = require("../../checkEqualKeys");
const equal = require("../../equal");

const localEmitter = new EventEmitter();



class Client extends ProtonClient {
    constructor() {
        super({
            intents: []
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: `${process.cwd()}/tests/Structures/Listeners/ListenerModules`,
            automateCategories: true
        });

        this.listenerHandler.loadAll();

        this.listenerHandler.setEmitter("localEmitter", localEmitter);
    }
}

const client = new Client();

test("listen", () => {
    class Ready extends Listener {
        constructor() {
            super("Ready", {
                emitter: "localEmitter",
                type: "once",
                event: "ready"
            })
        }

        execute(message) {
            equal(message, "worked");
        }
    }

    client.listenerHandler.load(Ready);

    localEmitter.emit("ready", "worked");
})