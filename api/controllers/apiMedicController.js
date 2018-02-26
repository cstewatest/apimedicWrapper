let Authenticator = require('../services/Authenticator')

let redisClient = require('../models/redisClient');
let Requester = require('../services/Requester');
let urlBuilder = require('../services/urlBuilder');

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

let retrieveApiMedicResults = (res, urlBuilderOpts) => {
  redisClient.getAsync("authToken").then(function(token) {
    return (token || new Authenticator().call());
  }).then(function(token) {
    return (new urlBuilder(token, urlBuilderOpts).call());
  }).then(function(fullURL) {
    return (new Requester().call('GET', fullURL))
  }).then(function(apiMedicResponse) {
    res.status(apiMedicResponse.status).json(apiMedicResponse.responseText)
  }).catch(err => {res.status(err.status).json(err.responseText)})
}

exports.sublocations = function(req, res) {
  let urlBuilderOpts = {locationID: req.query.locationID, type: 'sublocations'}
  retrieveApiMedicResults(res, urlBuilderOpts);
};

exports.sublocation_symptoms = function(req, res) {
  let urlBuilderOpts = {locationID: req.query.locationID, mwbg: req.query.mwbg, type: 'sublocation_symptoms'}
  retrieveApiMedicResults(res, urlBuilderOpts);
};

exports.additional_symptoms = function(req, res) {
  let urlBuilderOpts = {type: 'additional_symptoms', symptoms: req.query.symptoms, gender: req.query.gender, year_of_birth: req.query.year_of_birth}
  retrieveApiMedicResults(res, urlBuilderOpts);
};

exports.diagnosis = function(req, res) {
  let urlBuilderOpts = {type: 'diagnosis', symptoms: req.query.symptoms, gender: req.query.gender, year_of_birth: req.query.year_of_birth}
   retrieveApiMedicResults(res, urlBuilderOpts);
};
