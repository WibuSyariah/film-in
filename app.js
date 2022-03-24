const express = require('express')
const app = express()
const router = require('./routes')
const session = require('express-session')
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

app.use('/assets', express.static('assets'))

app.use(session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true  
    }
}))

app.use('/', router)

app.listen(port, () => {
    console.log('This app is running at port: ', port)
})