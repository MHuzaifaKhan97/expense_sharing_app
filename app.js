const express = require('express');
const app = express();
const cors = require('cors');

// For JSON Body Parse
const bodyParser = require('body-parser');
// For MongoDB
const mongoose = require('mongoose');
// Use dot env
require('dotenv/config')

// Allowing all request for all other origin. 
app.use(cors());
app.options("*", cors());

// Used a middleware to parse req.body in post request
app.use(bodyParser.json());

// Constants from .env file
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING;

// Import routers
const userRouter = require('./routers/user');


//Routes
app.use(`${api}/user`, userRouter)

// Connection with MongoDB
mongoose.connect(connectionString, {
    dbName: 'expense-app'
}).then(() => {
    console.log("Database is connected")
}).catch((err) => {
    console.log(err);
})

app.listen(3000,()=> {
    console.log(api);
    console.log("Server is listening")
})