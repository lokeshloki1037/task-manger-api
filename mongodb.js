const {MongoClient,ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser:true,useUnifiedTopology: true }, (error , client) => {
if(error){
    return console.log('unable to connect to database');
}

 const db = client.db(databseName);


// db.collection('users').deleteMany({_id:new ObjectId("60c970cf6dd22d2eeca6d3a7"),
// _id :new ObjectId("60c98f6c11c5a01c58e13a7b"),
// _id:new ObjectId("60c98f6c11c5a01c58e13a7c")}).then((res) => {console.log(res)}).catch((err)=>{console.log(err)});

db.collection('tasks').deleteMany({demandOption:false,type:'string'}).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});


//db.collection('tasks').deleteOne({descripiton:"he is byjus employee"}).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
});