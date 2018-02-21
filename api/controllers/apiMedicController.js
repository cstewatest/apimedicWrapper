let redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

const baseURL = "https://sandbox-healthservice.priaid.ch/"
let baseURLFor = (key, locationID, MWBG) => {
  let urls = { 
    sublocations: baseURL + "body/locations/" + locationID,
    sublocation_symptoms: baseURL + "symptoms/" + locationID + "/" + MWBG,
    additional_symptoms: baseURL + "symptoms/proposed",
    diagnosis: baseURL + "diagnosis"
  };
  return (urls[key])
}
let defaultQueryParams = (token) => {
  return "?language=en-gb&format=json&token=" + token
}

let queryParams = (token, additionalParams) => {
  return (additionalParams ? defaultQueryParams(token) + additionalParams : defaultQueryParams(token))
}

let makeRequest = (url, res) => {
  let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  let request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      res.json({status: 500, response: 'cannot complete request'});
    }

    if (request.status === 200) {
      res.json({status: 200, response: request.responseText});
    } else {
      res.json({status: request.status, response: request.responseText});
    }
  }

  request.open('GET', url, false)
  request.send()
}

exports.sublocations = function(req, res) {
  getAsync("token").then(function(token) {
    return (token || client.set("token", "abc123"));
  }).then(function(token) {
    return baseURLFor('sublocations', req.query.locationID) + queryParams(token);
  }).then(function(fullURL) {
    makeRequest(fullURL, res)
  }).catch(err => {res.json({status: 500, response: err.message})})
};

exports.sublocation_symptoms = function(req, res) {
};

exports.additional_symptoms = function(req, res) {
};

exports.diagnosis = function(req, res) {
};
