const express = require('express');
const mongodb = require('mongodb')
require('dotenv').config()

const app = express()
const objectid=mongodb.ObjectID
// {"_id":objectid("60519689ef7492b32b8de8be")}--to find using id
const mongoClient=mongodb.MongoClient;
app.use(express.json())

const dbUrl=process.env.DB_URL||"mongodb://127.0.0.1:27017";

app.get('/',async(req,res)=>{
   try {
       let clientdb= await mongoClient.connect(dbUrl);
       let db = clientdb.db("product_db");
       let data = await db.collection("collection").find().toArray()
       res.status(200).json(data)
       clientdb.close()
   } catch (error) {
     console.log(error)  
   } 
})

app.post('/create-product',async(req,res)=>{
    try {
        let client=await mongoClient.connect(dbUrl)
    let db=client.db("product_db")
    await db.collection("collection").insertOne(req.body)
    res.status(200).json({message:"product created"})
    client.close()
    } catch (error) {
        console.log(error)
    }
    
})

app.put('/update-product/:id',async(req,res)=>{
    try {
        let client=await mongoClient.connect(dbUrl)
        let db = await client.db("product_db")
        await db.collection("collection").findOneAndUpdate({_id:objectid(req.params.id)},{$set:req.body})
        res.status(200).json({message:"product updated"})
        client.close()
    } catch (error) {
       console.log(error) 
    }
})

app.delete('/delete-product/:id',async(req,res)=>{
    try {
        let client=await mongoClient.connect(dbUrl)
        let db = await client.db("product_db")
        await db.collection("collection").deleteOne({_id:objectid(req.params.id)})
        res.status(200).json({message:"product deleted"})
        client.close()
    } catch (error) {
       console.log(error) 
    }
})

app.listen(process.env.PORT||1040,()=>{
    console.log("App is running")
})