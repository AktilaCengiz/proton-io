const readdir = require("../../src/Utils/readdir");


test("readdir", () => {
    expect(readdir(`${process.cwd()}/src`).length).toBeGreaterThan(0);
});