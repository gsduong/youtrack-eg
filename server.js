/*======================== DEPENDENCIES START ==========================*/
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
/*======================== DEPENDENCIES END ==========================*/




/*============================== ROUTE DECLARATION START ==================================*/

const test_dotenv = require('./server/routes/test-dotenv');
const test_base64 = require('./server/routes/test-base64');

/*============================== ROUTE DECLARATION END ==================================*/





/*============================== APP CONFIG START ==================================*/
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));


/*============================== APP CONFIG END ==================================*/






/*============================== ROUTE SETTING START ==================================*/

app.use('/test-dotenv', test_dotenv);
app.use('/test-base64', test_base64);

/**
 * Send User to authorization server
 * @link https://www.jetbrains.com/help/hub/2017.1/Authorization-Code.html
 */
app.get('/auth', (req, res) => {
  const options = {
    response_type: process.env.RESPONSE_TYPE,
    redirect_uri: req.protocol + '://' + req.headers.host + process.env.AUTHENTICATION_CALLBACK_PATH,
    request_credentials: process.env.REQUEST_CREDENTIALS,
    client_id: process.env.CLIENT_SERVICE_ID,
    scope: [process.env.SCOPE1, process.env.SCOPE2, process.env.SCOPE3],
    access_type: process.env.ACCESS_TYPE
  };
  const url = require('url');
  const qs = require('querystring');
  const authorizationUri = url.resolve(process.env.HOST_URL, process.env.AUTHENTICATION_SERVER_ENDPOINT);
  console.log(`${authorizationUri}?${qs.stringify(options)}`);
  res.redirect(`${authorizationUri}?${qs.stringify(options)}`);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/authorize', (req, res) => {
  const error = req.query.error;
  if (error != undefined) {
    return res.send(error);
  }
  else {

    /**
     * After get a code from authorization server, we use it to get access token
     */
    const code = req.query.code;
    const state = req.query.state;

    if (code != undefined) {
      var request = require('request');

      var headers = {
        'Accept': 'application/json',
        'Authorization': 'Basic ' + new Buffer(process.env.CLIENT_SERVICE_ID + ":" + process.env.CLIENT_SERVICE_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      var options = {
        url: process.env.HOST_URL + process.env.TOKEN_SERVER_ENDPOINT,
        method: 'POST',
        headers: headers,
        form: {'grant_type': 'authorization_code', 'code': code, 'redirect_uri': req.protocol + '://' + req.headers.host + process.env.AUTHENTICATION_CALLBACK_PATH}
      };

      request(options, function (error, response, body) {
        if (error) return res.send(error);
        else {
          console.log(body);
          return res.send(body);
        }
      })
    } else {
      return res.send(res.body);
    }

  }
});

/*------------------------------ ROUTE API -------------------------------------------*/


/*============================== ROUTE SETTING END ===================================*/






/*============================== RUN APP =============================================*/
// Catch all other routes and return the index file
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';

app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log('API running on localhost:', port));
/*============================== RUN APP ==================================*/
