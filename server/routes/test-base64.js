const express = require('express');
const router = express.Router();

/* GET api listing. */

router.get('/', (req, res) => {
  return res.json(new Buffer(process.env.CLIENT_SERVICE_ID + ":" + process.env.CLIENT_SERVICE_SECRET).toString('base64'));
});

module.exports = router;
