let Authenticator = require('../services/Authenticator')
let redisClient = require('../models/redisClient');
let Requester = require('../services/Requester');
let urlBuilder = require('../services/urlBuilder');

let retrieveApiMedicResults = (res, urlBuilderOpts) => {
  redisClient.getAsync("authToken").then(function(token) {
    return (token || new Authenticator().call());
  }).then(function(token) {
    return (new urlBuilder(token, urlBuilderOpts).call());
  }).then(function(fullURL) {
    return (new Requester().call('GET', fullURL))
  }).then(function(apiMedicResponse) {
    res.status(apiMedicResponse.status).json(eval(apiMedicResponse.responseText))
  }).catch(err => {res.status(err.status || 500).json(err.responseText || err.message)})
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

exports.diagnosis_info = function(req, res) {
  let urlBuilderOpts = {type: 'diagnosis_info', diagnosisID: req.query.diagnosisID}
  retrieveApiMedicResults(res, urlBuilderOpts); 
};
