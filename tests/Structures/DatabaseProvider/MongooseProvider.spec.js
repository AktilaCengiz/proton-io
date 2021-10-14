const mongoose = require("mongoose");
const MongooseProvider = require("../../../src/Structures/DatabaseProviders/MongooseProvider");
const model = require("./model.spec");

mongoose.connect("mongodb://localhost/test", {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("Veritabanı bağlantısı başarılı.");
    const db = new MongooseProvider(model);
    const data = await db.model;
    console.log(data);
});
