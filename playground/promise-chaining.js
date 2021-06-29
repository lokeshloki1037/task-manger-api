 require('../src/db/mongoose')
 const User = require('../src/models/user');

//  User.findByIdAndUpdate('60cb2c540bbbf243f8a73317',{age:1}).then((use)=>{
//      console.log(use)
//      return User.countDocuments({age:1})
//  }).then((result) => {
//      console.log(result)
//  }).catch((err)=>{
//      console.log(err)
//  });



 const updateapp = async (id , age) => {
  const updateage = await User.findByIdAndUpdate(id,{age})
  const count = await User.countDocuments({age:0})
 return {count,updateage}
} 

updateapp('60cb2c540bbbf243f8a73317',24).then((counts)=>{
    console.log(counts)
}).catch((err)=>{
    console.log(err)
})
