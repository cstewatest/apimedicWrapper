let CryptoJS = require("crypto-js")
let Requester = require('../services/Requester');
let redisClient = require('../models/redisClient');

const BASE_URL = "https://authservice.priaid.ch/login"
const API_KEY = "christina_stewart_corp"

module.exports = function Authenticator() {  
  this.call = () => {
    return (
      redisClient.getAsync("secretKey").then((secretKey) => {
        let computedHash = CryptoJS.HmacMD5(BASE_URL, secretKey);
        let computedHashString = computedHash.toString(CryptoJS.enc.Base64);
        return (API_KEY + ":" + computedHashString)
      }).then(function(bearer) {
        return (new Requester().call('POST', BASE_URL, {bearer: bearer}))
      }).then(function(apiMedicResponse) {
        let result = apiMedicResponse.responseText;
        let parsedResult = JSON.parse(result)
        let token = parsedResult["Token"]
        redisClient.set('authToken', token)
        redisClient.expire('authToken', 7200)
        return token
      }).catch((err) => {
        console.log(err);
        throw new Error("Error authenticating. Please try again later.")
      })
    )
  }
}
