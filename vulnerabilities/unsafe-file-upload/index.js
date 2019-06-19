'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const uploadPath = path.resolve(__dirname, '..', 'uploads');
const upload = multer({ dest: uploadPath });

router.get('/', function(req, res) {
  res.render(path.resolve(__dirname, './views/index'));
});

router.post('/submit', upload.single('test_file'), function(req, res, next) {
  res.send(req.body.test_text);
});

module.exports = router;
