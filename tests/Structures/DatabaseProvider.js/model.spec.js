const mongoose = require("mongoose");

const { Schema } = mongoose;

const guildSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    settings: {
        type: Object,
        require: true
    }
}, { minimize: false });

module.exports = mongoose.model("model", guildSchema);
