const equal = require("./equal");

module.exports = (struct, expected) => {
    for (const key in expected) {
        equal(struct[key], expected[key]);
    }
};
