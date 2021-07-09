const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/user').send({
         "name":"lokesh",
        "email":"lokeshd1037@gmail.com",
        "password":"venkatesh"
    })//.expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            "name":"lokesh",
        "email":"lokeshd1037@gmail.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('venkatesh')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    })//.expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/user/login').send({
        email: userOne.email,
        password: 'thisisnotmypassword'
    })//.expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
       // .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/user/me')
        .send()
       // .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
       // .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticate user', async () => {
    await request(app)
        .delete('/user/me')
        .send()
       // .expect(401)
})

// test('Should upload avatar image', async () => {
//     await request(app)
//         .post('/user/me/avatar')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .attach('avatar', './fixtures/profile-pic.jpg')
//        // .expect(200)
//     const user = await User.findById(userOneId)
//     expect(user.avatar).toEqual(expect.any(Buffer))
// })

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'venki'
        })
       // .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('venki')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'last name'
        })
       // .expect(400)
})