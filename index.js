const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient } = require('mongodb');


const port = process.env.PORT || 9000;

// middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n6yc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('doctorer-ghor');
        const appoinmentsCollection = database.collection('appoinments')

        // get post
        app.get('/appoinments', async (req, res) => {
            const email = req.query.email;
            const date = req.query.date;

            const query = { email: email, date: date }
            console.log(query)
            const cursor = appoinmentsCollection.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments)
        })

        // set post
        app.post('/appoinments', async (req, res) => {
            const appoinment = req.body;
            const result = await appoinmentsCollection.insertOne(appoinment)
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello doctors!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
});


// app.get('/users')
// app.post('/users')
// app.get('users/:id')
// app.delete('/users/:id')
// app.put('/users/:id')