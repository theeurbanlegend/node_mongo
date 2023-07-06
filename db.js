const {MongoClient}=require('mongodb')

let dbConnnection

const connectToDb=(cb)=>{
    MongoClient.connect('mongodb://127.0.0.1/bookstore')
    .then((client)=>{
        dbConnnection=client.db()
        return cb()
    })
    .catch(err=>{
        console.log(err)
        return cb(err)
    })
}
const getDb=()=>dbConnnection

module.exports={
    connectToDb,
    getDb
}