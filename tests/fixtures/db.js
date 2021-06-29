const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId() 
const userone = {
    _id:userOneId,
    name:"lokesh",
     email:"lokeshd1037@gmail.com",
     password:"venkatesh",
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_CODE)
    }]
}

const userTwoId = new mongoose.Types.ObjectId() 
const usertwo = {
    _id:userTwoId,
    name:"venki",
     email:"venki@gmail.com",
     password:"venkatesh",
    tokens:[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_CODE)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description:'first task',
    completer:false,
    owner:userOneId._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description:'first task',
    completer:false,
    owner:userOneId._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description:'first task',
    completer:true,
    owner:userTwoId._id
}

const setupdatabase = async()=>{
      await User.deleteMany()
      await Task.deleteMany()
   await new User(userone).save();
   await new User(usertwo).save();
   await new Task(taskOne).save();
   await new Task(taskTwo).save();
   await new Task(taskThree).save();
}

module.exports={
    userone,userOneId,setupdatabase,userTwoId,taskOne,taskTwo,taskThree
}