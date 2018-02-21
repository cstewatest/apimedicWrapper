let authToken = "abc123";
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
let defaultQueryParams = "?language=en-gb&format=json&token=" + authToken
let queryParams = (additionalParams) => {
  return (additionalParams ? defaultQueryParams + additionalParams : defaultQueryParams)
}

let wrap = require('async-middleware').wrap

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
  let fullURL = baseURLFor('sublocations', req.query.locationID) + queryParams();

  makeRequest(fullURL, res)
};

exports.sublocation_symptoms = function(req, res) {
};

exports.additional_symptoms = function(req, res) {
};

exports.diagnosis = function(req, res) {
};
