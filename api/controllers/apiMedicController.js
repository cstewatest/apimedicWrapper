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

exports.sublocations = function(req, res) {
  redisClient.getAsync("token").then(function(token) {
    return (token || redisClient.set("token", "abc123"));
  }).then(function(token) {
    return baseURLFor('sublocations', req.query.locationID) + queryParams(token);
  }).then(function(fullURL) {
    return (new Requester().call('GET', fullURL))
  }).then(function(apiMedicResponse) {
    res.json({status: apiMedicResponse.status, response: apiMedicResponse.responseText})
  }).catch(err => {res.json({status: err.status, response: err.responseText})})
};

exports.sublocation_symptoms = function(req, res) {
};

exports.additional_symptoms = function(req, res) {
};

exports.diagnosis = function(req, res) {
};
