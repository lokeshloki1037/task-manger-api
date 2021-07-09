const express = require('express');
const router =new express.Router();
const auth = require('../middleware/auth')
const User = require('../models/user')
const {sendWelcomeEmail,cancelationEmail} = require('../emails/account')
const multer = require('multer')
const sharp = require('sharp')


router.post('/user' , async (request , response) => {
  const user = new User(request.body)
  try{
    await user.save();
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuth()
     response.send({user,token}).status(201)
  }catch(err){
  response.status(400).send(err)
  }    
});

router.post('/user/login', async (req,res) => {
  try{
    const user = await User.findByCredentials(req.body.email,req.body.password);
    const token = await user.generateAuth()
   res.send({user,token});
  }catch(e){
  res.status(400).send(e);
  }
})


router.post('/user/logout', auth ,async (req,res) => {
  try{
     req.user.tokens = req.user.tokens.filter((token) => {
       return token.token !== req.token
     })
     await req.user.save()

     res.send('successfully logout')
  }catch(e){
    res.status(400).send(e)
  }
})

router.post('/user/logoutAll',auth , async (req,res) => {
  try{
     req.user.tokens = []
  await req.user.save()
  res.status(200).send('successfully logout')
  }catch(e){
res.status(400).send(e)
  }
})


router.get('/user/me',auth , async (req,res) => {
  res.send(req.user);
})

 
router.patch('/user/me',auth, async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowupdate = ['name','email','password','age'];
    const isValideoperation = updates.every((update) => allowupdate.includes(update));

    if(!isValideoperation){
        res.status(400).send();
    }
  try{ 
    updates.forEach((update)=>req.user[update] = req.body[update])
    await req.user.save();
  res.send(req.user)
  }catch(e){
      res.status(400).send(e)
  }
})


router.delete('/user/me' ,auth ,async (req,res)=>{
    try{
 await req.user.remove()
 cancelationEmail(req.user.email,req.user.name)
 res.status(200).send(req.user)
    }catch(e){
   res.send(e)
    }
})





const upload = multer({
    limits:{
        fileSize:1000000
    },
fileFilter(req, file, cb){
         
     if(file.originalname.match(/\.{jpg| jpeg | png}$/)){
         return cb(new Error('please upload a image'))
     }
           cb(undefined,true)
  }  
 })

router.post('/user/me/avatar',auth ,upload.single('avatar'),async(req,res) => {
  const buffer = await sharp(req.file.buffer).resize(width=250 ,heigth=250).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/user/me/avatar',auth,async(req,res)=>{
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get('/user/:id/avatar',async (req,res) => {
  try{
    const user = await User.findById(req.params.id)
  if(!user || !user.avatar){
    throw new Error()
  }
  res.set('content-type','images/jpg')
  res.send(user.avatar)
  }catch(e){
 res.status(400).send(e)
  }
})

module.exports=router