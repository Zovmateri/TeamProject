const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const config = require('./config')
const authRoutes = require('./routes/authRoutes')

const app = express()

// Middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(
    session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true,
    })
)

// Serve static files
app.use(express.static('public'))

// Use routes
app.use('/auth',authRoutes)

// View engine setup
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// Start the server
const port = process.env.PORT || 3000; // Use the environment port or 3000 as a default
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});