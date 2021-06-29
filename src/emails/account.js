const sgMail = require('@sendgrid/mail')
require('../../config/dev.env')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendWelcomeEmail = (email,name) => {
sgMail.send({
    to:email,
    from:'lokeshd1037@gmail.com',
    subject:'Thanks for joining in',
    text:`welcome to the app , ${name}. Let me know you get along with the app.`
})
}

const cancelationEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'lokeshd1037@gmail.com',
        subject:'deleting your mail',
        text:`see you back sometime, good luck ${name}`
    })
}
    
module.exports={
    sendWelcomeEmail,cancelationEmail
}


//    to:'lokeshwar1037@gmail.com',
//   from:'lokeshd1037@gmail.com',
//     subject:'This is my first creation',
//     text:'i hope this is working correctly'

