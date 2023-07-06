const express=require('express')
const {connectToDb,getDb}=require('./db')
const {ObjectId}=require('mongodb')


const app=express()
app.use(express.json())

let db
connectToDb((err)=>{
if (!err){
    const port=8080
    app.listen(port,()=>{
        console.log(`App listening on port ${port}`)
    })}
    db=getDb()
})




app.get("/books", (req,res)=>{
    let books=[]

    db.collection('books')
        .find()
        .sort({author:1})
        .forEach(book =>books.push(book))
        .then(()=>{
            res.status(200).json(books)
        })
        .catch(()=>{
            res.status(404).json({
                error:"We could not find the documents"
            })
        })

})

app.get("/books/:id",(req,res)=>{
    if (ObjectId.isValid(req.params.id)){
    db.collection('books')
    .findOne({_id: new ObjectId(req.params.id)})
    .then(doc=>{
        res.status(200).json(doc)
    })
    .catch((err)=>{
        res.status(404).json({
            error:"Document is invalid"
        })
    })
    }else{
        res.status(404).json({
            error:"Invalid id"
        })
    }
})

app.post("/books", (req,res)=>{
    const book=req.body

    db.collection('books')
    .insertOne(book)
    .then(result=>{
        res.status(201).json(result)
    })
    .catch(err=>{
        res.status(404).json({
            error:"Could not create book details"
        })
    })
})

app.delete("/books/:id",(req,res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id:new ObjectId(req.params.id)})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(404).json({
                error:"Could not delete book with specified id"
            })
        })
}
})
app.patch("/books/:id",(req,res)=>{
    const updates=req.body
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id:new ObjectId(req.params.id)},{$set: updates})
        .then(result=>{
            res.status(200).json(result)
        })
        .catch(err=>{
            res.status(404).json({
                error:"Could not update book with specified id"
            })
        })}else{
            res.status(404).json({
                error:"Invalid doc id"
            })
        }
})
