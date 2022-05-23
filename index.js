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
        const purchaseCollection = client.db("parts-manufacturer").collection("purchase");
        const reviewCollection = client.db("parts-manufacturer").collection("reviews");

        app.get('/parts', async (req, res) => {
            const query = {};
            const cursor = partCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
        });
        app.get('/parts/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const part = await partCollection.findOne(query);
            res.send(part)
        })
        app.get('/reviews', async (req, res) => {
            const review = req.query.review
            const query = {review:review};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        app.get('/purchase', async (req, res) => {
            const booking = req.query.booking;
            const query = { booking: booking };
            const purchase = await purchaseCollection.find(query).toArray();
            res.send(purchase);
        })
        app.post('/purchase', async (req, res) => {
            const booking = req.body;
            const result = await purchaseCollection.insertOne(booking);
            res.send(result)
        })
        app.get('/myorders' , async(req,res) =>{
            const buyer =req.query.buyer;
            const query = {buyer};
            const cursor = purchaseCollection.find(query)
            const orders = await cursor.toArray();
            res.send(orders)
        })
        


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