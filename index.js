const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w4x1x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const partCollection = client.db("parts-manufacturer").collection("parts");
        const userCollection = client.db("parts-manufacturer").collection("users");
        const reviewCollection = client.db("parts-manufacturer").collection("reviews");

        app.get('/parts', async (req, res) => {
            const query = {};
            const cursor = partCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
          });
          app.get('/parts/:id', async(req,res) =>{
              const id = req.params.id;
              console.log(id)
              const query ={_id: ObjectId(id)};
              const part = await partCollection.findOne(query);
              res.send(part)
          })
          app.get('/reviews', async (req,res) =>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
          })
          app.get('/user',  async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
          });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})