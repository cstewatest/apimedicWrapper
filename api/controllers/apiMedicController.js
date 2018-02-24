let Authenticator = require('../services/Authenticator')

let redisClient = require('../models/redisClient');
let Requester = require('../services/Requester');

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

let retrieveApiMedicResults = (url, res) => {
  redisClient.getAsync("authToken").then(function(token) {
    return (token || new Authenticator().call());
  }).then(function(token) {
    return url + queryParams(token);
  }).then(function(fullURL) {
    return (new Requester().call('GET', fullURL))
  }).then(function(apiMedicResponse) {
    res.status(apiMedicResponse.status).json(apiMedicResponse.responseText)
  }).catch(err => {res.status(apiMedicResponse.status).json(err.responseText)})
}

exports.sublocations = function(req, res) {
  retrieveApiMedicResults(baseURLFor('sublocations', req.query.locationID), res);
};

exports.sublocation_symptoms = function(req, res) {
};

exports.additional_symptoms = function(req, res) {
};

exports.diagnosis = function(req, res) {
};
