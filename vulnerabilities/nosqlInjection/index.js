'use strict';

const { content } = require('@contrast/test-bench-utils');
const controllerFactory = require('../../utils/controllerFactory');

module.exports = controllerFactory('nosqlInjection', {
  locals: {
    attackValues: content.nosqlInjection
  }
});
