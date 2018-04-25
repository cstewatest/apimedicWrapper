module.exports = function urlBuilder(token, opts) {  
  const baseURL = "https://healthservice.priaid.ch/";
  
  this.token = token;
  this.type = opts['type']
  this.locationID = opts['locationID']
  this.mwbg = opts['mwbg']
  this.symptoms = opts['symptoms']
  this.gender = opts['gender']
  this.year_of_birth = opts['year_of_birth']
  
  this.defaultQueryParams = "language=en-gb&format=json&token=" + this.token
  this.additionalQueryParams = "symptoms=" + this.symptoms + "&gender=" + this.gender + "&year_of_birth=" + this.year_of_birth
  
  this.resourceURLs =  { 
    sublocations: "body/locations/" + this.locationID + "?",
    sublocation_symptoms: "symptoms/" + this.locationID + "/" + this.mwbg + "?",
    additional_symptoms: "symptoms/proposed?" + this.additionalQueryParams + "&",
    diagnosis: "diagnosis?" + this.additionalQueryParams + "&"
  };
 
  this.call = () => {
    return baseURL + this.resourceURLs[this.type] + this.defaultQueryParams 
  }
  
}
