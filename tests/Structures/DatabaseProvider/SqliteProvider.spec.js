/*

const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
}
sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES ('aktila', 'aktila', 'aktila', '31', '31');").run();
var data = sql.prepare("SELECT * FROM scores WHERE user = 'aktila' AND guild = 'aktila'").get()
console.log(data)

*/

const SQLite = require("better-sqlite3");

const sql = new SQLite("./scores.sqlite");

const SqLiteProivder = require("../../../src/Structures/DatabaseProviders/SqlProvider");

const db = new SqLiteProivder(sql);


//db.set("aktila", { username: "aktila", level: 31, xp: 31 });
// var data = db.get("aktila")
// console.log(data)

// db.update("aktila", { level: "13" });

// var data2 = db.get("aktila");
// console.log(data2);
