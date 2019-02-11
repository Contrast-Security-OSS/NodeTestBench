
const docCalls = [
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

module.exports.docCalls = docCalls;


// swapping /doc<Route> for /client<Route>
const calls = docCalls.map(({ endpoint, ...rest}) => {
  return { ...rest, endpoint: endpoint.replace('doc', 'client') };
});
module.exports.calls = calls;
