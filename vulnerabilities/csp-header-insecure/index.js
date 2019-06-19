const _fn = require('lodash/fp');

module.exports = (function(router) {
  const VIEWS_PREFIX = '../vulnerabilities/csp-header-insecure/views';
  const pathForView = _fn.replace(/:view/, _fn, `${VIEWS_PREFIX}/:view`);

  router.get('/', function(req, res) {
    const unsafePolicy = [
      "default-src 'none'",
      'font-src *',
      'img-src *',
      'media-src *',
      'script-src *',
      "style-src 'unsafe-inline' *"
    ].join('; ');

    res.append('Content-Security-Policy', unsafePolicy);
    res.render(pathForView('index'), { policy: unsafePolicy });
  });

  return router;
})(require('express').Router());
