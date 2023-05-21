const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());

// DataBase 

console.log(process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6kes8os.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const toyCollection = client.db('babytoy').collection('addatoy')

app.get('/addatoy', async (req, res) => {
  let query = {};
  if (req.query?.email) {
    query = { email: req.query.email }
  }
  const result = await toyCollection.find(query).toArray()
  res.send(result)
})

app.get('/addatoy/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)}
    const result=await toyCollection.findOne(query)
    res.send(result)
})

app.get('/alltoy',async(req,res)=>{
  const cursor=toyCollection.find().limit(20)
  const result=await cursor.toArray()
  res.send(result)
})

app.get('/category/:text', async (req, res) => {
  const toyName =req.params.text;
  // console.log(toyName)
  const query={category:toyName};
  const result=await toyCollection.find(query).toArray()
  res.send(result);
})

app.post('/addatoy', async (req, res) => {
  const addToy = req.body;
  const result = await toyCollection.insertOne(addToy);
  res.send(result)
})


app.delete('/addatoy/:id', async (req, res) => {
    const id=req.params.id;
    const query={_id: new ObjectId(id)}
    const result=await toyCollection.deleteOne(query);
    res.send(result)
})

app.put('/addatoy/:id',async(req,res)=>{
  const id=req.params.id;
  const updatedToy=req.body;
  // console.log(updatedToy)
  const filter={_id: new ObjectId(id)}
  const options={upsert:true}
  const updated={
       $set:{
          price:updatedToy.price,
          quantity:updatedToy.quantity,
          detail:updatedToy.detail
       }
  }
   const result=await toyCollection.updateOne(filter,updated,options)
   res.send(result)
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Baby Toys Server Is Onnnn')
});

app.listen(port, () => {
  console.log(`Server Is running on port ${port}`)
})