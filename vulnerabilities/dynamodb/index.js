const express = require('express');
const api = express.Router();
const AWS = require('aws-sdk');
const endpoint = process.env.DDB_URI || 'http://localhost:8000';
const TABLE = 'sink-demo';
const { docCalls, calls } = require('./call-bindings');
const _ = require('lodash');
AWS.config.update({
  region: 'us-east-1',
  endpoint
});

const dClient = new AWS.DynamoDB.DocumentClient({
  params: {
    TableName: TABLE
  }
});

const client = new AWS.DynamoDB({
  params: {
    TableName: TABLE
  }
});

function callDb({ docClient = false, req, res, method, params }) {
  const db = docClient ? dClient : client;
  return db[method](params)
    .promise()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

api
  .get('/', (req, res) => {
    res.render(`${__dirname}/views/index`, {
      docCalls,
      calls
    });
  })
  .post('/clientScan', (req, res) => {
    const { field, value } = req.body;
    const params = {
      FilterExpression: `#${field} = :${value}`,
      ExpressionAttributeNames: {
        [`#${field}`]: field
      },
      ExpressionAttributeValues: {
        [`:${value}`]: { S: value }
      }
    };
    return callDb({ req, res, method: 'scan', params });
  })
  .post('/clientQuery', (req, res) => {
    const params = {
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: {
        '#id': 'id'
      },
      ExpressionAttributeValues: {
        ':id': { S: req.body.id }
      }
    };
    return callDb({ req, res, method: 'query', params });
  })
  .post('/clientGetItem', (req, res) => {
    const { id } = req.body;
    return callDb({
      req,
      res,
      method: 'getItem',
      params: {
        Key: { id: { S: id } }
      }
    });
  })
  .post('/clientTransactGet', (req, res) => {
    const ids = req.body.id.split(',');
    return callDb({
      req,
      res,
      method: 'transactGetItems',
      params: {
        TransactItems: ids.map((id) => ({
          Get: {
            TableName: TABLE,
            Key: { id: { S: id } }
          }
        }))
      }
    });
  })
  .post('/clientPutItem', (req, res) => {
    const Item = _.mapValues(req.body, (value) => ({ S: value }));
    return callDb({
      req,
      res,
      method: 'putItem',
      params: {
        Item
      }
    });
  })
  .post('/clientTransactWrite', (req, res) => {
    const ids = req.body.id.split(',');
    delete req.body.id;

    const TransactItems = ids.map((id) => {
      const obj = {
        Put: {
          TableName: TABLE,
          Item: _.mapValues(req.body, (value) => ({ S: value }))
        }
      };
      obj.Put.Item.id = { S: id };
      return obj;
    });
    return callDb({
      req,
      res,
      method: 'transactWriteItems',
      params: {
        TransactItems
      }
    });
  })
  .post('/clientUpdateItem', (req, res) => {
    const { id, key1 } = req.body;
    return callDb({
      req,
      res,
      method: 'updateItem',
      params: {
        Key: { id: { S: id } },
        UpdateExpression: 'set key1 = :key1',
        ExpressionAttributeValues: {
          ':key1': { S: key1 }
        }
      }
    });
  })
  .post('/clientDeleteItem', (req, res) => {
    const { id } = req.body;
    return callDb({
      req,
      res,
      method: 'deleteItem',
      params: {
        Key: { id: { S: id } }
      }
    });
  })
  .post('/clientBatchGet', (req, res) => {
    const ids = req.body.id.split(',');
    return callDb({
      req,
      res,
      method: 'batchGetItem',
      params: {
        RequestItems: {
          [TABLE]: {
            Keys: ids.map((id) => ({ id: { S: id } }))
          }
        }
      }
    });
  })
  .post('/clientBatchWrite', (req, res) => {
    const { deleteId } = req.body;
    delete req.body.deleteId;
    const params = {
      RequestItems: {
        [TABLE]: []
      }
    };

    if (deleteId) {
      params.RequestItems[TABLE].push({
        DeleteRequest: {
          Key: { id: { S: deleteId } }
        }
      });
    }

    if (req.body.id) {
      const Item = _.mapValues(req.body, (value) => ({ S: value }));
      params.RequestItems[TABLE].push({
        PutRequest: {
          Item
        }
      });
    }
    return callDb({ req, res, method: 'batchWriteItem', params });
  })
  .post('/docScan', (req, res) => {
    const { field, value } = req.body;
    const params = {
      FilterExpression: `#${field} = :${value}`,
      ExpressionAttributeNames: {
        [`#${field}`]: field
      },
      ExpressionAttributeValues: {
        [`:${value}`]: value
      }
    };
    return callDb({ docClient: true, req, res, method: 'scan', params });
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
    return callDb({ docClient: true, req, res, method: 'query', params });
  })
  .post('/docGetItem', (req, res) => {
    const { id } = req.body;
    return callDb({
      docClient: true,
      req,
      res,
      method: 'get',
      params: {
        Key: { id }
      }
    });
  })
  .post('/docTransactGet', (req, res) => {
    const ids = req.body.id.split(',');
    return callDb({
      docClient: true,
      req,
      res,
      method: 'transactGet',
      params: {
        TransactItems: ids.map((id) => ({
          Get: {
            TableName: TABLE,
            Key: { id }
          }
        }))
      }
    });
  })
  .post('/docPutItem', (req, res) =>
    callDb({
      docClient: true,
      req,
      res,
      method: 'put',
      params: {
        Item: req.body
      }
    })
  )
  .post('/docTransactWrite', (req, res) => {
    const ids = req.body.id.split(',');
    delete req.body.id;
    return callDb({
      docClient: true,
      req,
      res,
      method: 'transactWrite',
      params: {
        TransactItems: ids.map((id) => {
          const obj = {
            Put: {
              TableName: TABLE,
              Item: _.cloneDeep(req.body)
            }
          };
          obj.Put.Item.id = id;
          return obj;
        })
      }
    });
  })
  .post('/docUpdateItem', (req, res) => {
    const { id, key1 } = req.body;
    return callDb({
      docClient: true,
      req,
      res,
      method: 'update',
      params: {
        Key: { id },
        UpdateExpression: 'set key1 = :key1',
        ExpressionAttributeValues: {
          ':key1': key1
        }
      }
    });
  })
  .post('/docDeleteItem', (req, res) => {
    const { id } = req.body;
    return callDb({
      docClient: true,
      req,
      res,
      method: 'delete',
      params: {
        Key: { id }
      }
    });
  })
  .post('/docBatchGet', (req, res) => {
    const ids = req.body.id.split(',');
    return callDb({
      docClient: true,
      req,
      res,
      method: 'batchGet',
      params: {
        RequestItems: {
          [TABLE]: {
            Keys: ids.map((id) => ({ id }))
          }
        }
      }
    });
  })
  .post('/docBatchWrite', (req, res) => {
    const { deleteId } = req.body;
    delete req.body.deleteId;
    const params = {
      RequestItems: {
        [TABLE]: []
      }
    };

    if (deleteId) {
      params.RequestItems[TABLE].push({
        DeleteRequest: {
          Key: { id: deleteId }
        }
      });
    }

    if (req.body.id) {
      params.RequestItems[TABLE].push({
        PutRequest: {
          Item: req.body
        }
      });
    }
    return callDb({ req, res, method: 'batchWrite', params, docClient: true });
  });

module.exports = api;
