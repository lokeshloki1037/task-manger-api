const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId,userone,setupdatabase} =require('../tests/fixtures/db.js')

beforeEach(setupdatabase) 

test('should signup a new user', async ()=>{
  await request(app).post('/user').send({
        name:"lokesh",
        email:"lokeshd1037@gmail.com",
        password:"venkatesh"
  })
})


test('should login a exixting user', async ()=>{
 const res = await request(app).post('/user/login').send({
        email:userone.email,
        password:userone.password
    })
    const user = await User.findById(userOneId)
    expect(res.body.token).toBe(user.tokens[1].token )
})


test('should not login nonexisting user', async () =>{
    await request(app).post('/user/login').send({
        email:"lokeshwar1037@gmail.com",
        password:"lokesh123456789"
    }).expect(400)
})

test('should get profile for user', async () => {
    await request(app)
    .get('/user/me')
    .set('Authorization', `Bearer ${userone.tokens[0].token}`)
    .send()
    .expect(200)
})
 
test('should not get profile for authorized user',async()=>{
    await request(app)
    .get('/user/me')
    .send()
    .expect(401)
})

test('should account for user',async()=>{
    await request(app)
    .delete('/user/me')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send().expect(200)
})

test('should not delete unauthorization user',async()=>{
    await request(app)
    .delete('/user/me')
    .send()
    .expect(401)
    const user = await User.findById(userOneId)
    expect(user).not.toBeNull()
})


test('should upload avatar image', async()=>{
    await request(app).post('/user/me/avatar')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})
 

test('should update the user',async()=>{
    await request(app).patch('/user/me')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send({name:"lokeshwar Reddy"})
    .expect(200)
     const user = await User.findById(userone)
    expect(user.name).toBe('lokeshwar Reddy')
})

test('should update invalid user field',async()=>{
    await request(app).patch('/user/me')
    .set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .send({last_name:"reddy"})
    .expect(400) 
})