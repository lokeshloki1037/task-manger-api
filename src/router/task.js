const express = require('express');
const taskrouter = express.Router();
const auth = require('../middleware/auth')
const Task = require('../models/task');


taskrouter.post('/task', auth, async (req,res)=>{
      const task = new Task({ ...req.body,
      owner:req.user._id
      })
    try{
      await task.save();
      res.status(201).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})


taskrouter.get('/tasks',auth, async (req,res)=>{
  const match = {}
  const sort = {}
  if(req.query.completed){
    match.completed = req.query.completed === 'true'
  }
  if(req.query.sortBy){
      const parts = req.query.sortBy.split(':')
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
    try{
      await req.user.populate({
        path : 'tasks',
        match,
        options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
        }
      }).execPopulate()
         res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

taskrouter.get('/task/:id',auth , async (req,res) => {
   const _id = req.params.id;
    try{
   const task = await Task.findOne({_id, owner:req.user._id})
   if(!task){
   return res.status(404).send()
   }  
   res.send(task)
    }catch(e){
   res.status(500).send(e)
    }
})

taskrouter.patch('/task/:id', auth ,async (req,res) => {
  const doupdates = Object.keys(req.body);
 const allowupdatetask = ['description' , 'completed'];
 const allow = doupdates.every((doupdate)=>allowupdatetask.includes(doupdate));
 if(!allow){
   return res.status(400).send()
 }
 try{
   const task = await Task.findOne({_id:req.params.id,owner:req.user.id})
      if(!task){
  return res.status(404).send()
 }
     doupdates.forEach((doupdate)=>task[doupdate]=req.body[doupdate])
     await task.save();
     res.send(up);
}catch(e){
  res.status(400).send(e);
}
})


taskrouter.delete('/task/:id', auth, async (req,res) => {

  try{
    const del = await Task.findByIdAndDelete({_id:req.params.id,owner:req.user.id})
   if(!del){
     res.status(404).send()
   }
   res.send(del )
  }catch(e){
    res.status(400).send();
  }
})

module.exports=taskrouter;