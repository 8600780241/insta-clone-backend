
const mongoose = require("mongoose")
const express = require("express")
const app = express();
const dbModel = require("./Db/db.js")
const multer = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")
const { GridFSBucket, MongoClient } = require("mongodb")
require("dotenv").config()
let cors = require("cors");
app.use(cors())
app.use(express.json())
const client = new MongoClient("mongodb+srv://saurabhsakharkar20:pranaysakh@cluster0.wsx60k7.mongodb.net/insta_clone?retryWrites=true&w=majority")
mongoose.connect(process.env.DB_URL + process.env.DATABASE)
    .then(res => {
        console.log("connected")
    })
    .catch(res => {
        console.log(res)
    });
app.get("/postdata/:file", async (req, res) => {

    try {
        await client.connect()
        const database = client.db(process.env.DATABASE)
        const photobucket = new GridFSBucket(database,
            { bucketName: process.env.PHOTOCOLLECTION })
        const event = photobucket.openDownloadStreamByName(req.params.file)
        event.on("data", (g) => {
            return res.write(g)

        })
        event.on("error", (g) => {
            return res.status(400).send(g)
        })
        event.on("end", (g) => {
            return res.end()
        })

    }
    catch (e) {
        res.send(e)

    }
})
const Storage = new GridFsStorage({
    url: process.env.DB_URL + process.env.DATABASE,
    file: (req, file) => {
        return {
            bucketName: process.env.PHOTOCOLLECTION,
            fileName: `${Date.now()}_${file.originalname}`
        }
    }
})
const upload = multer({
    storage: Storage
})
app.get("/", (req, res) => {
    res.send("hello")
})
app.get("/postdata", async (req, res) => {
    try {
        let data = await dbModel.find();
        res.send(data)
    }
    catch (e) {
        res.send(e)
    }
})
app.post("/post", upload.single("PostImage"), async (req, res) => {
    try {
        const post = await new dbModel({ PostImage: req.file.filename, ...req.body })
        const data = await post.save()
        res.send(data)
    }
    catch (e) {
        res.send(e)
    }
})
app.listen(8000, () => {
    console.log("run successfully")
})