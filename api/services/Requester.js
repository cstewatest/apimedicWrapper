module.exports = function Requester() {  
  this.call = (method, url, opts) => {
    return new Promise((resolve, reject) => {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let request = new XMLHttpRequest();

      request.open(method, url, false);
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(request)
        } else {
          reject(request);
        }
      }
   
      request.onerror = () => reject(request);
      if (opts && opts['bearer']) { 
        request.setRequestHeader('Authorization', 'Bearer ' + opts['bearer']); 
      }
      request.send();
    })
  } 
}
