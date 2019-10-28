'use strict';

const {
  content: {
    xxe: { attackXml }
  }
} = require('@contrast/test-bench-utils');
const controllerFactory = require('../../utils/controllerFactory');

module.exports = controllerFactory('xxe', {
  model: {
    input: attackXml
  }
});
