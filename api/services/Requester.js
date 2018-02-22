module.exports = function Requester() {  
  this.call = (method, url, opts) => {
    return new Promise((resolve, reject) => {
      let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      let request = new XMLHttpRequest();

      request.open(method, url, false);
      request.onload = () => {
        console.log('in on load')
        if (request.status >= 200 && request.status < 300) {
          resolve(request)
        } else {
          console.log(request)
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
