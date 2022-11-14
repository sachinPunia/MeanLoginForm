const express = require('express');
// const auth = require("./routes/auth-route")
const bodyParser = require('body-parser');
const app = express();

const port = process.env.port || 8080;

const authRoute = require('./routes/auth-route'); 

const mongoose = require('mongoose');
const cors = require('cors');


mongoose.connect('mongodb://localhost:27017/shopapp',(err)=>{
    if (err){
    console.log("not connected"+err);
}
    else{
        console.log("connected database");
    }
});

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json( ))

app.use(cors());
app.use('/auth', authRoute);


app.get('/',(req,res)=>{
    res.send("welcome to main page")
})

app.listen(port,()=>{
console.log("Server is running",+port);
})