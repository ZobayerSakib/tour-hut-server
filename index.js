const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
//Middleware settings here
app.use(cors());
app.use(express.json())

//Mongodb server site settings
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ndc9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log('database is connected')

        const database = client.db("packageServer");
        const servicesConnection = database.collection("services");
        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesConnection.find({});
            const result = await cursor.toArray(cursor);
            console.log(result)
            res.send(result);
        })

        app.post('/services', async (req, res) => {
            const document = req.body;
            console.log(document);
            const result = await servicesConnection.insertOne(document);
            res.json(result)
        })

        //Another Collection of Database

        const tourConnection = database.collection("tourSite");
        app.get('/tourPoint', async (req, res) => {
            const cursor = tourConnection.find({});
            const result = await cursor.toArray(cursor);
            console.log(result)
            res.send(result);
        })

        //POST API SETTINGS


    } finally {
        // await client.close()
    }
} run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Server is Ok')
})

app.listen(port, () => {
    console.log('working the server port', port)
})