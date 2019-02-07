const express = require('express');
const api = express.Router();
const AWS = require('aws-sdk');
const endpoint =  process.env.DDB_URI || 'http://localhost:8000';
const TABLE = 'sink-demo';
AWS.config.update({
  region: 'us-east-1',
  endpoint
});

const docClient = new AWS.DynamoDB.DocumentClient({
  params: {
    TableName: TABLE
  }
});

function callDb(req, res, method, payload) {
  return docClient[method](payload).promise().then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
}

api
  .get('/', (req, res) => {
    const calls = [
      {
        endpoint: '/docScan',
        name: 'scan table by criteria',
        fields: [
          {
            name: 'field',
            placeholder: 'name of key to filter by'
          },
          {
            name: 'value',
            placeholder: 'value of field to find'
          }
        ]
      },
      {
        endpoint: '/docQuery',
        name: 'query by id',
        fields: [{
          name: 'id',
          placeholder: 'Id to lookup'
        }]
      },
      {
        endpoint: '/docGetItem',
        name: 'get',
        fields: [{
          name: 'id',
          placeholder: 'Lookup Id'
        }]
      },
      {
        endpoint: '/docBatchGet',
        name: 'batchGet',
        fields: [{
          name: 'id',
          placeholder: 'Comma Delimited List of Ids'
        }]
      },
      {
        endpoint: '/docTransactGet',
        name: 'transactGet(get multiple ids)',
        fields: [{
          name: 'id',
          placeholder: 'Comma Delimited List of Ids'
        }]
      },
      {
        endpoint: '/docPutItem',
        name: 'put',
        fields: [
          {
            name: 'id',
            placeholder: 'Id'
          },
          {
            name: 'key1',
            placeholder: 'attr1'
          },
          {
            name: 'key2',
            placeholder: 'attr2'
          }
        ]
      },
      {
        endpoint: '/docUpdateItem',
        name: 'update',
        fields: [
          {
            name: 'id',
            placeholder: 'id of existing item'
          },
          {
            name: 'key1',
            placeholder: 'attr1'
          },
        ]
      },
      {
        endpoint: '/docTransactWrite',
        name: 'transactWrite',
        fields: [
          {
            name: 'id',
            placeholder: 'Comma delimited list of ids'
          },
          {
            name: 'key1',
            placeholder: 'attr1'
          },
          {
            name: 'key2',
            placeholder: 'attr2'
          }
        ]
      },
      {
        endpoint: '/docBatchWrite',
        name: 'batch write(one delete, one put)',
        fields: [
          {
            name: 'deleteId',
            placeholder: 'Enter ID to delete'
          },
          {
            name: 'id',
            placeholder: 'Id'
          },
          {
            name: 'key1',
            placeholder: 'attr1'
          },
          {
            name: 'key2',
            placeholder: 'attr2'
          },
        ]
      },
      {
        endpoint: '/docDeleteItem',
        name: 'delete',
        fields: [{
          name: 'id',
          placeholder: 'Id to delete'
        }]
      }
    ];

    res.render(__dirname + '/views/index', {
      calls
    });
  })
  .post('/docScan', (req, res) => {
    const { field, value } = req.body;
    const params = {
      FilterExpression: `#${field} = :${value}`,
      ExpressionAttributeNames: {
        [`#${field}`]: field,
      },
      ExpressionAttributeValues: {
        [`:${value}`]: value
      }
    };
    return callDb(req, res, 'scan', params);
  })
  .post('/docQuery', (req, res) => {
    const params = {
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: {
        '#id': 'id'
      },
      ExpressionAttributeValues: {
        ':id': req.body.id
      }
    };
    return callDb(req, res, 'query', params);
  })
  .post('/docGetItem', (req, res) => {
    const id = req.body.id;
    return callDb(req, res, 'get', {
      Key: { id }
    });
  })
  .post('/docTransactGet', (req, res) => {
    const ids = req.body.id.split(',');
    return callDb(req, res, 'transactGet', {
      TransactItems: ids.map((id) => ({
        Get: {
          TableName: TABLE,
          Key: { id }
        }
      }))
    });
  })
  .post('/docPutItem', (req, res) => {
    const { id, ...data} = req.body;
    return callDb(req, res, 'put', {
      Item: {
        id,
        ...data
      }
    });
  })
  .post('/docTransactWrite', (req, res) => {
    const { id, ...data } = req.body;
    const ids = id.split(',');
    return callDb(req, res, 'transactWrite', {
      TransactItems: ids.map((id) => ({
        Put: {
          TableName: TABLE,
          Item: {
            id,
            ...data
          }
        }
      }))
    });
  })
  .post('/docUpdateItem', (req, res) => {
    const { id, key1 } = req.body;
    return callDb(req, res, 'update', {
      Key: { id },
      UpdateExpression: 'set key1 = :key1',
      ExpressionAttributeValues: {
        ':key1': key1
      }
    });
  })
  .post('/docDeleteItem', (req, res) => {
    const id = req.body.id;
    return callDb(req, res, 'delete', {
      Key: { id }
    });
  })
  .post('/docBatchGet', (req, res) => {
    const ids = req.body.id.split(',');
    return callDb(req, res, 'batchGet', {
      RequestItems: {
        [TABLE]: {
          Keys: ids.map((id) => ({ id }))
        }
      }
    });
  })
  .post('/docBatchWrite', (req, res) => {
    const { id, deleteId, ...data } = req.body;
    const params = {
      RequestItems: {
        [TABLE]: []
      }
    };

    if(deleteId) {
      params.RequestItems[TABLE].push({
        DeleteRequest: {
          Key: { id: deleteId }
        }
      });
    }

    if (id) {
      params.RequestItems[TABLE].push({
        PutRequest: {
          Item: {
            id,
            ...data
          }
        }
      });
    }
    return callDb(req, res, 'batchWrite', params);
  });

module.exports = api;

