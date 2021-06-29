require('../src/db/mongoose');
const Task = require('../src/models/task')


// Task.findByIdAndDelete('60cb25b0633b340bfcce8b27',{description:''}).then((tas)=>{
//     console.log(tas);
//     return Task.countDocuments({completed:false})
// }).then((com)=>{
//     console.log(com);
// }).catch((e)=>{
//     console.log(e);
// })


// const deletetask = async (id,completed) => {
// const delete1 = await Task.findByIdAndDelete(id)
// const count = await Task.countDocuments(completed)
// return count;
// }

// deletetask('60cda2eec2272c35c047c101',{completed:false}).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })


const deletetask = async (id) => {
const delete1 = await Task.findByIdAndDelete(id)
const count = await Task.countDocuments({completed:false})
return count;
}

deletetask('60cda2eec2272c35c047c101').then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})