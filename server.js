let redisClient = require('./api/models/redisClient');
let express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  bodyParser = require('body-parser');

app.listen(port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function rateLimit (req, res, next) {
  redisClient.getAsync("requestAmt").then(function(amt) {
    if (parseInt(amt) > 100) {
      res.status(429).json('rate limit exceeded');
    } else {
      redisClient.incr('requestAmt')
      if (amt == '1') { redisClient.expire('requestAmt', 2419200) } 
      next();
    }
  })
}

//put back after upgrading to paid api
//app.use(rateLimit);

let routes = require('./api/routes/apiMedicRoutes');
routes(app);

