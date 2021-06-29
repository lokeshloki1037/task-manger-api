const mongoose = require('mongoose'); 

mongoose.connect(process.env.MONGOODB_URL,
 {useCreateIndex:true,useFindAndModify:false, useNewUrlParser:true,useUnifiedTopology:true});