const request = require('supertest')
const  app = require('../src/app')
const Task = require('../src/models/task')
const {userOneId,userone,userTwoId,usertwo,taskOne,taskTwo,taskThree,setupdatabase} =require('../tests/fixtures/db.js')

beforeEach(setupdatabase)

test('should create task for user',async() => {
    const response = await request(app)
    .post('/task')
    .set('Authorization', `Bearer ${userone.tokens[0].token}`)
    .send({
        descripiton:"hello good evng"
    })
    const task = await Task.findById(response.body._id)
    expect(task).toBeNull()
})

test('should fetch use tasks', async()=>{
    const response = await request(app)
    .get('/tasks')
    .set('Authourization', `Bearer ${userone.tokens[0].token}`)
    .send()
    // expect(response.body.length).toEqual(2)
})

test('should not delete user tasks',async()=>{
   const response = await request(app)
    .delete('/task/me')
    .set('Authorization', `Bearer ${usertwo.tokens[0].token}`)
    .send()
    .expect(404)
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})






 //.delete(`/task/${taskone._id}`)