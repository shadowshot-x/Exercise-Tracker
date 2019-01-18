"use strict";
const express = require('express');
const app = express();
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI);
const bodyParser = require('body-parser');
const cors = require('cors'); // FOR FCC TESTING PURPOSES

const User = require ('./schemas').User;
const Exercise = require('./schemas').Exercise;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({origin: '*'})); // FOR FCC TESTING PURPOSES

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/api/exercise/users', (req, res) => {
  User.find({}, 'username _id', (err, users) => { // the string here is a 'projection': the fields to return
    return res.json(users)
  })
});

app.get('/api/exercise/log', (req, res) => {
  User.findById(req.query.userId, (err, user) => {
    if (err) 
      return res.json(err)
    if (req.query.limit) {
      user.log = user.log.slice(0, req.query.limit)
    }
    else if (req.query.to && req.query.from) {
      let from = new Date(req.query.from)
      let to = new Date(req.query.to)
      user.log = user.log.filter(log => log.date >= from && log.date <= to)
    }
    user.count = user.log.length;
    return res.json(user)
  })
})

app.post("/api/exercise/new-user", (req, res) => {
  let username = req.body.username;
  if (!username) {
    return res.send("Path `username` is required")
  }
  
  User.findOne({username : username}, (err, user) => {
    if (err) {
      return res.send('Error finding user')
    }
    else if (user) {
      return res.send('User already exists')
    }
    else {
      let user = new User({username : username, setDefaultsOnInsert: true})
      console.log(user);
      user.save((err, user) => {
        return err ? res.json(err) : res.json({username : user.username, _id : user._id})
      })
    }
  })
});

app.post("/api/exercise/add", (req, res) => {
  User.findById(req.body.userId, (err, user) => {
    if (err)
      return res.send('unknown _id')
    user.count++
    let exercise = new Exercise({
      description : req.body.description,
      duration : req.body.duration,
      date : req.body.date || this.default,
    })
    user.log.push(exercise);
    user.save((err, update) => {
      if (err)
        return res.json(err)
      res.json({
        _id : user._id,
        username : user.username,
        description : exercise.description,
        duration : exercise.duration,
        date : exercise.date })
    })
  })
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Listening on port ' + listener.address().port)
});
