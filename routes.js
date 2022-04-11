const express = require('express')
const router = express.Router();
const passport = require('passport')
const mongoose = require('mongoose');
const exampleModel = mongoose.model('example');
const userModel =  mongoose.model('user');

router.route('/login').post((req, res, next) => {
    
    if (req.body.username, req.body.password) {
        console.log(req.body.username)
        passport.authenticate('local', function (error, user) {
            console.log('login eredménye:',user)
            if (error) return res.status(500).send(error);
            req.logIn(user, function (error) {
                if (error) return res.status(500).send(error);
                return res.status(200).send('Bejelentkezes sikeres');
            })
        })(req, res, next);
    } else { return res.status(400).send('Hibas keres, username es password kell'); }
});

router.route('/logout').post((req,res,next)=>{
    if(req.isAuthenticated()){
        req.logOut();
        return res.status(200).send(req.session.passport);
    }
    return res.status(200).send(req.session.passport);
})

router.route('/status').get((req,res,next)=>{
    if(req.isAuthenticated()){
        return res.status(200).send(req.session.passport);
    }
    else{
        res.status(403).send('Nem volt bejelentkezve a felhasználó');
    }
})

router.route('/user').get((req,res,next)=>{
    userModel.find({},(err,users)=>{
        if(err) return res.status(500).send('DB hiba');
        res.status(200).send(users);
      })}).post((req,res,next)=>{
        if(req.body.username && req.body.email && req.body.password){
            userModel.findOne({username:req.body.username},(err,user)=>{
                if(err) return res.status(500).send('DB hiba történt');
                if(user) return res.status(400).send('Már van ilyen felhasznalonev');
                const usr = new userModel({username:req.body.username, password:req.body.password, email:req.body.email});
                usr.save((error) =>{
                    if(error) return res.status(500).send('A mentés során hiba történt');
                    return res.status(200).send('A mentés sikeres')
                })
            })
        }
        else{
            return res.status(400).send('Hibas keres, nem volt username, password, vagy email');
        }
    })

router.route('/example').get((req,res,next)=>{
    exampleModel.find({},(err,examples)=>{
        if(err) return res.status(500).send('DB hiba');
        res.status(200).send(examples);
    })
}).post((req,res,next)=>{
    console.log(req.body.name)
    if(req.body.name && req.body.price && req.body.description){
        exampleModel.findOne({name:req.body.name},(err,example)=>{
            if(err) return res.status(500).send('DB hiba történt');
            if(example) return res.status(400).send('Már van ilyen id');
            const ex = new exampleModel({name:req.body.name,price: req.body.price, description: (req.body.description || '').toString()});
            ex.save((error) =>{
                if(error) return res.status(500).send('A mentés során hiba történt' + error);
                return res.status(200).send('A mentés sikeres')
            })
        })
    }
    else{
        return res.status(400).send('Nem volt id vagy name vagy price');
    }
}).put((req,res,next)=>{
    if(req.body.name && req.body.price && req.body.description){
        exampleModel.findOne({name:req.body.name},(err,example)=>{
            if(err) return res.status(500).send('DB hiba történt');
            if(example){
                 example.price = req.body.price;
                 example.description = req.body.description;
                 example.save((error) =>{
                    if(error) return res.status(500).send('A mentés során hiba történt');
                    return res.status(200).send('A mentés sikeres')
                })
            }
            else { 
                return res.status(400).send('Nincs ilyen ID az adatbázisban');
            }
        })
    }
    else{
        return res.status(400).send('Nem volt id vagy value');
    }
}).delete((req,res,next)=>{
    if(req.body.name){
        exampleModel.findOne({name:req.body.name},(err,example)=>{
            if(err) return res.status(500).send('DB hiba történt');
            if(example){
                 example.delete((error) =>{
                    if(error) return res.status(500).send('A törlés során hiba történt');
                    return res.status(200).send('A törlés sikeres')
                })
            }
            else {
                return res.status(400).send('Nincs ilyen ID az adatbázisban');
            }
        })
    }
    else{
        return res.status(400).send('Nem volt id vagy value');
    }
})

module.exports = router;