
const mongoose = require("mongoose")
const createSchema = new mongoose.Schema({
    name: { type: String },
    location: { type: String },
    likes: { type: Number },
    description: { type: String },
    PostImage: { type: String },
    date: {
        type: Date
    }
})
const dbModel = new mongoose.model("post", createSchema);
module.exports = dbModel;