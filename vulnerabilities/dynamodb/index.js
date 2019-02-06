const express = require('express');
const api = express.Router();
const AWS = require('aws-sdk');
const endpoint =  process.env.DDB_URI || 'http://localhost:8000';
AWS.config.update({
  region: 'us-east-1',
  endpoint
});

const docClient = new AWS.DynamoDB.DocumentClient({
  params: {
    TableName: 'sink-demo'
  }
});

api
  .get('/', (req, res) => {
    res.render(__dirname + '/views/index');
  })
  .post('/docGetItem', (req, res) => {
    const id = req.body.id;
    return docClient.get({ Key: { id } }).promise().then(({ Item: data }) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
  })
  .post('/docPutItem', (req, res) => {
    const { id, ...data} = req.body;
    console.log(req.body);
    return docClient.put({
      Item: {
        id,
        ...data
      }
    }).promise().then((data) => {
      res.send(data);
    }).catch((err) => {
      console.log(err);
      res.status(500).send(err.message);
    });
  });

module.exports = api;

