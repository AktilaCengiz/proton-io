const ProtonModule = require("../ProtonModule");

class Listener extends ProtonModule {
    constructor(id, options = {}) {
        super(id, options);
    }
}

module.exports = Listener;
