'use strict';
const exp = require('express');
const router = exp.Router();
const path = require('path');
const multer = require('multer');
const uploadPath = path.resolve(__dirname, '..', 'uploads');
const upload = multer({ dest: uploadPath });
const {
  routes: {
    unsafe_file_upload: { base: baseUri }
  },
  frameworkMapping: { express }
} = require('@contrast/test-bench-utils');

router.get('/', function(req, res) {
  res.render(path.resolve(__dirname, './views/index'), {
    uri: baseUri
  });
});

const { method, key } = express.body;

router[method]('/submit', upload.single('file'), function(req, res, next) {
  res.send(req[key].input);
});

module.exports = router;
