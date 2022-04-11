const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const path = require('path');
const http = require('http');
const localStrategy = require('passport-local').Strategy


const app = express()

const port = process.env.PORT || 3000;
const dbUrl = 'mongodb+srv://admin:admin@prf-cluster.f8nyu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(dbUrl)
mongoose.connection.on('connected',()=>{
    console.log('db csaatlakoztatatva');
})
mongoose.connection.on('error',(err)=>{
    console.log('Hiba történt db-hez csatlakozáskor',err);
})

require('./example.model');
require('./user.model');

const userModel = mongoose.model('user');
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({}))
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
//app.use(cors(corsConfig))
passport.use('local', new localStrategy(function (username, password, done) {
    userModel.findOne({ username: username }, function (err, user) {
        if (err) return done('Hiba lekeres soran', null);
        if (!user) return done('Nincs ilyen felhasználónév', null);
        user.comparePasswords(password, function (error, isMatch) {
            if (error) return done(error, false);
            if (!isMatch) return done('Hibas jelszo', false);
            return done(null, user);
        })
    })
}));


passport.serializeUser(function(user,done){
    if (!user) return done('Nincs megadva beléptethető felhasználó',null)
    return done(null,user);
});
passport.deserializeUser(function(user,done){
    if (!user) return done('Nincs user akit kiléptethetnénk',null)
    return done(null,user);
});

app.use(session({ secret: 'prf2022', resave: false }));
app.use(passport.initialize())
app.use(passport.session())


/*app.get('/',(req, res,next) => {
    res.send(__dirname+'/prf')
})*/
app.use(express.static(__dirname+'/dist/prf'))

app.get('/', (req, res) => {
    res.sendFile('/dist/prf/index.html',{root:__dirname})
});

app.use('/',require('./routes'));
app.use('/secondary',require('./routes'));

app.use((req,res,next)=>{
    console.log('ez a hibakezelo');
    res.sendFile('/dist/prf/index.html',{root:__dirname})
    //res.status(404).send('A kért erőforrás nem található')
}
)
app.listen(port, () => {
    console.log('The server is running')
})
