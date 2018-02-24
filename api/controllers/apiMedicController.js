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

let retrieveApiMedicResults = (res, url, additionalQueryParams) => {
  redisClient.getAsync("authToken").then(function(token) {
    return (token || new Authenticator().call());
  }).then(function(token) {
    return url + queryParams(token, additionalQueryParams);
  }).then(function(fullURL) {
    console.log(fullURL)
    return (new Requester().call('GET', fullURL))
  }).then(function(apiMedicResponse) {
    res.status(apiMedicResponse.status).json(apiMedicResponse.responseText)
  }).catch(err => {res.status(err.status).json(err.responseText)})
}

exports.sublocations = function(req, res) {
  retrieveApiMedicResults(res, baseURLFor('sublocations', req.query.locationID));
};

exports.sublocation_symptoms = function(req, res) {
  retrieveApiMedicResults(res, baseURLFor('sublocation_symptoms', req.query.locationID, req.query.mwbg));
};

exports.additional_symptoms = function(req, res) {
  additionalQueryParams = "&symptoms=" + req.query.symptoms + "&gender=" + req.query.gender + "&year_of_birth=" + req.query.year_of_birth
  retrieveApiMedicResults(res, baseURLFor('additional_symptoms'), additionalQueryParams);
};

exports.diagnosis = function(req, res) {
};
