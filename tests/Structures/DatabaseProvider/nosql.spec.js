const { JsonDatabase } = require("wio.db");

const db = new JsonDatabase({
    databasePath: "./myJsonDatabase.json"
});

// Data set | get
db.set("test", 1);
db.get("test");