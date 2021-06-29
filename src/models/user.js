const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userschema = mongoose.Schema( {
        name:{
            type:String,
            trim:true,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('email is invalide');
                }
            }
        },
        password:{
            type:String,
            required:true,
            minlength:7,
            trim:true,
            validate(value){
                if(value.includes('password')){
                    throw new Error('password cannot contain "password')
                }
            }
        },
        age:{
              type:Number,
              default:0,
              validate(value){
                  if(value < 0)
                  throw new Error('please enter the valide age')
              }
            },
            tokens:[{
                token:{
                    type:String,
                    required:true
                }
            }] ,
            avatar:{
                type:Buffer
            } 
        },{
            timestamps:true
        })

        userschema.virtual('tasks',{
            ref:'Task',
            localField:'_id',
            foreignField:'owner'
        })

        userschema.methods.toJSON = function () {
         const user = this
         const userObject = user.toObject()

         delete userObject.password
         delete userObject.tokens
         delete userObject.avatar 
         
         return userObject
        }

        userschema.methods.generateAuth = async function(){
            const user = this
            const token = jwt.sign({_id:user._id},process.env.JWT_CODE)
            user.tokens = user.tokens.concat({token})
             await user.save()
            return token
        }

        userschema.statics.findByCredentials = async (email,password) => {
           const user = await User.findOne({email});
           if(!user){
               throw new Error('unable to login');
           }
          const isMatch = await bcrypt.compare(password,user.password)
             if(!isMatch){
                 throw new Error('unable to login')
             }
             return user
        }

        //hash the plain text password before saving using middleware
        userschema.pre('save',async function(next) {
            const user = this

            if(user.isModified('password')){
                user.password = await bcrypt.hash(user.password,8)
            }
            next()
        })

        //delete user tasks when user is removed using middleware

        userschema.pre('remove',async function (next){
            const user = this
         await  Task.deleteMany({owner:user._id})
            next()
    
        })

const User = mongoose.model('User' ,userschema)

module.exports=User;