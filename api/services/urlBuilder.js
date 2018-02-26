module.exports = function urlBuilder(token, opts) {  
  const baseURL = "https://sandbox-healthservice.priaid.ch/";
  
  this.token = token;
  this.type = opts['type']
  this.locationID = opts['locationID']
  this.mwbg = opts['mwbg']
  this.symptoms = opts['symptoms']
  this.gender = opts['gender']
  this.year_of_birth = opts['year_of_birth']
  
  this.resourceURLs =  { 
    sublocations: "body/locations/" + this.locationID + "?",
    sublocation_symptoms: "symptoms/" + this.locationID + "/" + this.mwbg + "?",
    //additional_symptoms: "symptoms/proposed" + additionalQueryParams,
    //diagnosis: "diagnosis" + additionalQueryParams
  };

 
  let defaultQueryParams = "language=en-gb&format=json&token=" + this.token
 
  let additionalQueryParams = "?symptoms=" + JSON.stringify(this.symptoms) + "&gender=" + this.gender + "&year_of_birth=" + this.year_of_birth

  this.call = () => {
    console.log(baseURL + this.resourceURLs[this.type] + defaultQueryParams);
    return baseURL + this.resourceURLs[this.type] + defaultQueryParams 
  }
  
}
