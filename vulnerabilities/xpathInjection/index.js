const {
  content: {
    xpathInjection: { xml }
  }
} = require('@contrast/test-bench-utils');
const controllerFactory = require('../../utils/controllerFactory');
module.exports = controllerFactory('xpathInjection', {
  locals: {
    xml
  }
});
