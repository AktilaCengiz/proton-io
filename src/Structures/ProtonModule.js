class ProtonModule {
    constructor(id, options = {}) {

        if (typeof id !== "string") {
            throw new TypeError("The module ID must be a type of string.");
        }

        this.id === id;

        this.category = typeof options.category === "string"
            ? options.category
            : "default";

        this.client = null;

        this.handler = null;

        this.filepath = null;
    }
}

module.exports = ProtonModule;
