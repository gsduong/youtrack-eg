const express = require('express');
const router = express.Router();

/* GET api listing. */

router.get('/', (req, res) => {
  const options = {
    response_type: process.env.RESPONSE_TYPE,
    redirect_uri: req.protocol + '://' + req.headers.host + process.env.AUTHENTICATION_CALLBACK_PATH,
    request_credentials: process.env.REQUEST_CREDENTIALS,
    client_id: process.env.CLIENT_SERVICE_ID,
    scope: [process.env.SCOPE],
    access_type: process.env.ACCESS_TYPE
  };
  const url = require('url');
  const qs = require('querystring');
  const authorizationUri = url.resolve(process.env.HOST_URL, process.env.AUTHENTICATION_SERVER_ENDPOINT);
  console.log(`${authorizationUri}?${qs.stringify(options)}`);
  res.redirect(`${authorizationUri}?${qs.stringify(options)}`);
});

module.exports = router;
