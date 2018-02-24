let CryptoJS = require("crypto-js")
let Requester = require('../services/Requester');
let redisClient = require('../models/redisClient');

const BASE_URL = "https://sandbox-authservice.priaid.ch/login"
const API_KEY = "christina.v.stewart@gmail.com"
const SECRET_KEY = "i8QRs56Dfw7WAq32Y"

module.exports = function Authenticator() {  
  let that = this;
  this.computedHash = CryptoJS.HmacMD5(BASE_URL, SECRET_KEY);
  this.computedHashString = this.computedHash.toString(CryptoJS.enc.Base64);

  this.call = () => {
    let bearer = API_KEY + ":" + that.computedHashString
    
    return (
      new Requester().call('POST', BASE_URL, {bearer: bearer}).then(function(apiMedicResponse) {
        let result = apiMedicResponse.responseText;
        let parsedResult = JSON.parse(result)
        let token = parsedResult["Token"]
        redisClient.set('authToken', token)
        redisClient.expire('authToken', 7200)
        return token
      }).catch(err => {({status: err.status, response: err.responseText})})
    )
  }
}
