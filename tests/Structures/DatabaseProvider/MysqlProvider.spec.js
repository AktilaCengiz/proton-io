const mysql2 = require("mysql2");
const Provider = require("../../../src/Structures/DatabaseProviders/MySqlProvider");

const connection = mysql2.createConnection({

    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "aktila"
});

// connection.connect();
const db = new Provider(connection);
const data = db.set("aktilacengiz", { name: "ahmet" });
console.log(data);
// db.delete("aktilacengiz");

// db.set("aktilacengiz", {
//     name: "Aktila",
//     surname: "Cengiz",
//     age: 18,
//     job: "Engineer"
// });

// async function a() {
//     var data = await db.delete("aktilacengiz")
//     console.log(data);
// }
// a();
