const express = require('express');
const api = express.Router();
const mongoose = require('mongoose');
// random id string.
const _id = '750786cbcf7979d4ff131091';

// ip for mongo.
const CONNECTION_STRING = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nodetestbench';

// connect to mongo.
mongoose.connect(CONNECTION_STRING, {useNewUrlParser: true});
mongoose.connection.once('open', () => {
  console.log(`Mongo connection open at ${CONNECTION_STRING}`);
});

const Test = mongoose.model('test', new mongoose.Schema({input: String}));

api
  .post('/deleteMany', (req, res) => {
    exec(Test, 'deleteMany', req, res);
  })
  .post('/deleteOne', (req, res) => {
    exec(Test, 'deleteOne', req, res);
  })
  .post('/find', (req, res) => {
    exec(Test, 'find', req, res);
  })
  .post('/findOne', (req, res) => {
    exec(Test, 'findOne', req, res);
  })
  .post('/findById', (req, res) => {
    exec(Test, 'findById', req, res);
  })
  .post('/findByIdAndDelete', (req, res) => {
    exec(Test, 'findByIdAndDelete', req, res);
  })
  .post('/findByIdAndRemove', (req, res) => {
    exec(Test, 'findByIdAndRemove', req, res);
  })
  .post('/findByIdAndUpdate', (req, res) => {
    execWithDoc(Test, 'findByIdAndUpdate', req, res);
  })
  .post('/findOneAndDelete', (req, res) => {
    exec(Test, 'findOneAndDelete', req, res);
  })
  .post('/findOneAndRemove', (req, res) => {
    exec(Test, 'findOneAndRemove', req, res);
  })
  .post('/findOneAndUpdate', (req, res) => {
    execWithDoc(Test, 'findOneAndUpdate', req, res);
  })
  .post('/replaceOne', (req, res) => {
    execWithDoc(Test, 'replaceOne', req, res);
  })
  .post('/updateMany', (req, res) => {
    exec(Test, 'updateMany', req, res);
  })
  .post('/updateOne', (req, res) => {
    execWithDoc(Test, 'updateOne', req, res);
  })
  .get('/', (req, res) => {
    res.render(__dirname + '/views/index');
  });

module.exports = api;

function exec(model, operation, req, res) {
  const input = req.body.input;
  _exec(model, operation, [{ input, _id }], function(error, doc) {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.send(input);
    }
  });
}

function execWithDoc(model, operation, req, res) {
  const input = req.body.input;
  _exec(model, operation, [{ input, _id }, { input }], function(error, doc) {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.send(input);
    }
  });
}

function _exec(model, operation, args, cb) {
  return model[operation].apply(model, args).exec(cb);
}
