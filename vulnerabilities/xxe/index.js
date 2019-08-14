'use strict';

const { utils } = require('@contrast/test-bench-utils');
const controllerFactory = require('../../utils/controllerFactory');

module.exports = controllerFactory('xxe', {
  locals: {
    attackXml: utils.attackXml
  }
});
